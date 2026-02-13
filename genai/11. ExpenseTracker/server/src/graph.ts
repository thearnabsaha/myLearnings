import { AIMessage } from "@langchain/core/messages";
import { StateGraph, START, END, GraphNode, ConditionalEdgeRouter } from "@langchain/langgraph";
import { MessagesState } from "./state";
import { llmCall, shouldContinue, toolNode } from "./nodes";


const agent = new StateGraph(MessagesState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "llmCall")
    .compile();


// // Invoke
// import { HumanMessage } from "@langchain/core/messages";
// const result = await agent.invoke({
//     messages: [new HumanMessage("Add 3 and 4.")],
// });

// for (const message of result.messages) {
//     console.log(`[${message.type}]: ${message.text}`);
// }