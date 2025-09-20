import { END, StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
import { tool } from "@langchain/core/tools";
import z from "zod";
import { createCalenderEvents, deleteCalenderEvents, getCalenderEvents, updateCalenderEvents } from "./tools";
dotenv.config();
const checkpointer = new MemorySaver();

export const agent = async (message: string, threadId: string, email: string) => {
    const system_prompt = `You are a personal assistent, who answers the asked questions in bullet points format.
                    Current date and time is: ${new Date().toUTCString()} ,
                    Current Timezone is: ${Intl.DateTimeFormat().resolvedOptions().timeZone} You will use this time zone while using tools.
                    Before calling createCalenderEventTool make sure you have start, end, summary, description, attendees (emails only not name)(stored like [{"email":"example1@example.com"},{"email":"example2@example.com"}] in object format not json), timezone,always ask "is it am or pm"? if just given numbers (like 5-6). otherwise ask for the missing value. Before creating any meeting check is there already a meet, if not then create otherwise reconfirm. You can also delete the meeting by id, you won't ask the id, you will get the meeting id name summary then delete it.always confirm with details before deleting. if i want to update any calender event, you will ask me about everything that you needed to update, and if after asking i doesn't provide one, go with previous value, always me again before updating the events.
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
        async ({ start, end, summary, description, attendees, timezone }) => {
            const meet = await createCalenderEvents(email, start, end, attendees, summary, description, timezone)
            return meet;
        },
        {
            name: "createCalenderEventTool",
            description: "Create new meetings in calender",
            schema: z.object({
                start: z.string().describe("Starting of the meeting"),
                end: z.string().describe("Ending of the meeting"),
                summary: z.string().describe("Summary of the meeting"),
                description: z.string().describe("Description of the meeting"),
                attendees: z.string().describe("Attendees of the meeting"),
                timezone: z.string().describe("Local Timezone of the meeting"),
            }),
        }
    );
    const deleteCalenderEventTool = tool(
        //@ts-ignore
        async ({ summary, id }) => {
            const meet = await deleteCalenderEvents(email, id)
            return meet;
        },
        {
            name: "deleteCalenderEventTool",
            description: "Delete new meetings in calender",
            schema: z.object({
                summary: z.string().describe("Summary of the meeting"),
                id: z.string().describe("Id of the meeting"),
            }),
        }
    );
    const updateCalenderEventTool = tool(
        //@ts-ignore
        async ({ start, end, summary, description, attendees, timezone, id }) => {
            const meet = await updateCalenderEvents(email, id, start, end, attendees, summary, description, timezone)
            return meet;
        },
        {
            name: "updateCalenderEventTool",
            description: "Update meetings in calender",
            schema: z.object({
                start: z.string().describe("Starting of the meeting"),
                id: z.string().describe("Id of the meeting"),
                end: z.string().describe("Ending of the meeting"),
                summary: z.string().describe("Summary of the meeting"),
                description: z.string().describe("Description of the meeting"),
                attendees: z.string().describe("Attendees of the meeting"),
                timezone: z.string().describe("Local Timezone of the meeting"),
            }),
        }
    );
    const tools = [search, getCalenderEventsTool, createCalenderEventTool, deleteCalenderEventTool, updateCalenderEventTool];
    const toolNode = new ToolNode(tools);

    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    }).bindTools(tools);

    const reactAgent = createReactAgent({
        //@ts-ignore
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

