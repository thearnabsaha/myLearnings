import { END, StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
dotenv.config();
const checkpointer = new MemorySaver();
export const agent = async (message: string, threadId: string) => {
    const system_prompt = `You are a personal assistent, who answers the asked questions.
                    Current date and time is: ${new Date().toUTCString()}
                    `
    const search = new TavilySearch({
        maxResults: 5,
        topic: "general",
    });

    const tools = [search];
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

