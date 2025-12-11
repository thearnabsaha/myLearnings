import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import * as z from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StateAnnotation } from "./state";
import { isAIMessage, ToolMessage } from "@langchain/core/messages";
import { END, START, StateGraph } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0
});

// Define tools
const SearchTool = new TavilySearch({
    maxResults: 3,
    topic: "general",
});

const toolsByName = {
    [SearchTool.name]: SearchTool,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

async function llmCall(state: typeof StateAnnotation.State) {
    return {
        messages: await modelWithTools.invoke([
            new SystemMessage(
                "You are a helpful assistant who answers all the questions."
            ),
            ...state.messages,
        ]),
    };
}
async function toolNode(state: typeof StateAnnotation.State) {
    const lastMessage = state.messages.at(-1);

    if (lastMessage == null || !isAIMessage(lastMessage)) {
        return { messages: [] };
    }

    const result: ToolMessage[] = [];
    for (const toolCall of lastMessage.tool_calls ?? []) {
        const tool = toolsByName[toolCall.name];
        const observation = await tool.invoke(toolCall);
        result.push(observation);
    }

    return { messages: result };
}
async function shouldContinue(state: typeof StateAnnotation.State) {
    const lastMessage = state.messages.at(-1);
    if (lastMessage == null || !isAIMessage(lastMessage)) return END;

    // If the LLM makes a tool call, then perform an action
    if (lastMessage.tool_calls?.length) {
        return "toolNode";
    }
    // Otherwise, we stop (reply to the user)
    return END;
}
const graph = new StateGraph(StateAnnotation)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "llmCall")
    .compile();

// Invoke
export const agent = async (inputMessage: string, threadId: string) => {
    const result = await graph.invoke({
        messages: [new HumanMessage("what is the weather of kolkata")],
    });
    console.log(result)
    console.log(result.messages[result.messages.length - 1].content)
    return result.messages[result.messages.length - 1].content
}
