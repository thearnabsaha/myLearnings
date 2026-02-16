import {
    StateGraph,
    START,
} from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { GraphState } from "./state";
import { llmCall, shouldContinue1, toolNode } from "./nodes";

const graph = new StateGraph(GraphState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addEdge("llmCall", "toolNode")
    .addConditionalEdges("llmCall", shouldContinue1)
    // .addConditionalEdges("toolNode", shouldContinue2)
    .compile();

export const agent = async () => {
    const result = await graph.invoke({
        messages: [
            new HumanMessage("weather of kolkata??")
        ],
    });

    for (const message of result.messages) {
        console.log(`[${message._getType()}]: ${message.content}`);
    }

}