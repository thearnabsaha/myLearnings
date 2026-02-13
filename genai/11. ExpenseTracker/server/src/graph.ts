import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { StateGraph, START, END, GraphNode, ConditionalEdgeRouter } from "@langchain/langgraph";
import { MessagesState } from "./state";
import { llmCall, shouldContinue, toolNode } from "./nodes";


export const agent = new StateGraph(MessagesState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "llmCall")
    .compile();



// for (const message of result.messages) {
//     console.log(`[${message.type}]: ${message.text}`);
// }