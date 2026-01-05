import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { ChatGroq } from "@langchain/groq";
import { END, START, StateGraph } from "@langchain/langgraph";
import { MessagesState, type MessagesStateType } from "./state";
import { AIMessage, ToolMessage, SystemMessage, HumanMessage } from "@langchain/core/messages";
import { tools, toolsByName } from "./tools";
const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0
});
export const modelWithTools = model.bindTools(tools);
export async function responder(state: MessagesStateType) {
    return {
        messages: [await modelWithTools.invoke([
            new SystemMessage(
                "You are a helpful assistant which answers all the questions, you search if required"
            ),
            ...state.messages,
        ])],
    };
}
export async function toolNode(state: MessagesStateType) {
    const lastMessage = state.messages.at(-1);

    if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
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
export async function shouldContinue(state: MessagesStateType) {
    const lastMessage = state.messages.at(-1);

    // Check if it's an AIMessage before accessing tool_calls
    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return END;
    }

    // If the LLM makes a tool call, then perform an action
    if (lastMessage.tool_calls?.length) {
        return "toolNode";
    }
    // Otherwise, we stop (reply to the user)
    return END;
}
const graph = new StateGraph(MessagesState)
    .addNode("responder", responder)
    .addNode("toolNode", toolNode)
    .addEdge(START, "responder")
    .addEdge("toolNode", "responder")
    .addConditionalEdges("responder", shouldContinue, ["toolNode", END])
    .compile();

// Invoke
export const agent = async (inputMessage: string, threadId: string) => {
    const result = await graph.invoke({
        messages: [new HumanMessage(inputMessage)],
    });
    console.log(result)
    console.log(result.messages[result.messages.length - 1].content)
    return result.messages[result.messages.length - 1].content
}
