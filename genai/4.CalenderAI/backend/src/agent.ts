import { END, StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
import { tool } from "@langchain/core/tools";
import z from "zod";
import { createCalenderEvents, getCalenderEvents } from "./tools";
dotenv.config();
const checkpointer = new MemorySaver();
export const agent = async (message: string, threadId: string, email: string) => {
    const system_prompt = `You are a personal assistent, who answers the asked questions.
                    Current date and time is: ${new Date().toUTCString()} 
                    `
    const search = new TavilySearch({
        maxResults: 5,
        topic: "general",
    });
    const getCalenderEventsTool = tool(
        //@ts-ignore
        async ({ query }) => {
            const meet = await getCalenderEvents(email)
            return meet;
        },
        {
            name: "getCalenderEvents",
            description: "Check calender for meetings! and answers if there is any.",
            schema: z.object({
                query: z.string().describe("The query to use in your search for meetings"),
            }),
        }
    );
    const createCalenderEventTool = tool(
        //@ts-ignore
        async ({ start, end, summary, description, attendees }) => {
            const meet = await createCalenderEvents(email, start, end, attendees, summary, description)
            return meet;
            // return "new calender event added!"
        },
        {
            name: "createCalenderEventTool",
            description: "Create new meetings in calender",
            schema: z.object({
                start: z.string().describe("Starting of the meeting"),
                end: z.string().describe("Ending of the meeting"),
                summary: z.string().describe("Summary of the meeting"),
                description: z.string().describe("Description of the meeting"),
                attendees: z.string().describe("attendees of the meeting"),

            }),
        }
    );

    const tools = [search, getCalenderEventsTool, createCalenderEventTool];
    const toolNode = new ToolNode(tools);

    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    }).bindTools(tools);

    const reactAgent = createReactAgent({
        llm: model,
        tools,
        checkpointer,
    });

    const shouldContinue = (state: any) => {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage.tool_calls?.length) {
            return "tools"
        } else {
            return "__end__"
        }
    }

    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", reactAgent)
        .addNode("tools", toolNode)
        .addEdge("__start__", "agent")
        .addEdge("tools", "agent")
        .addConditionalEdges("agent", shouldContinue, {
            __end__: END,
            tools: "tools"
        })

    const app = workflow.compile({ checkpointer });

    const finalState = await app.invoke(
        { messages: [new SystemMessage(system_prompt), new HumanMessage(message)] },
        { configurable: { thread_id: threadId } },
    );

    return finalState.messages[finalState.messages.length - 1].content
}

