import {
    StateGraph,
    START,
    MemorySaver,
} from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { GraphState } from "./state";
import { llmCall, shouldContinueFromModel, shouldContinueFromToolNode, toolNode } from "./nodes";

const checkpointer = new MemorySaver();
const graph = new StateGraph(GraphState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    // .addEdge("llmCall", "toolNode")
    .addConditionalEdges("llmCall", shouldContinueFromModel)
    .addConditionalEdges("toolNode", shouldContinueFromToolNode)
    .compile({ checkpointer });
export const agent = async (inputMessage: string, threadId: string) => {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(inputMessage)
        ],
    }, { configurable: { thread_id: threadId } });
    console.log(result.messages[result.messages.length - 1].content)
    for (const message of result.messages) {
        console.log(`[${message._getType()}]: ${message.content}`);
    }
    return result.messages[result.messages.length - 1].content;
}