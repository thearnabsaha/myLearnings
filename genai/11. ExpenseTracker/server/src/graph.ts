import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import * as z from "zod";
import {
    StateGraph,
    Annotation,
    MessagesAnnotation,
    START,
    END,
} from "@langchain/langgraph";
import { BaseMessage, AIMessage, ToolMessage, HumanMessage } from "@langchain/core/messages";
import { GraphState } from "./state";
import { llmCall, shouldContinue, toolNode } from "./nodes";




const graph = new StateGraph(GraphState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue)
    .addEdge("toolNode", "llmCall")
    .compile();

export const agent = async () => {
    const result = await graph.invoke({
        messages: [
            new HumanMessage("Add 3 and 4.")
        ],
    });

    for (const message of result.messages) {
        console.log(`[${message._getType()}]: ${message.content}`);
    }

    console.log(`\nTotal LLM calls: ${result.llmCalls}`);
}