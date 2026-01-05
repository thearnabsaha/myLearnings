import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import * as z from "zod";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StateAnnotation } from "./state";
import { isAIMessage, ToolMessage } from "@langchain/core/messages";
import { END, START, StateGraph } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { FinalResponderPrompt, ResponderPrompt, ReviewerPrompt } from "./prompt";
import { questionAnswerSchema } from "./schema";

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0
});
// const structuredModel = model.withStructuredOutput(questionAnswerSchema);
// Define tools
const SearchTool = new TavilySearch({
    maxResults: 3,
});

const toolsByName = {
    [SearchTool.name]: SearchTool,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

async function Responder(state: typeof StateAnnotation.State) {
    const response = await modelWithTools.invoke([
        new SystemMessage(
            ResponderPrompt
        ),
        ...state.messages,
    ])

    return {
        messages: [new AIMessage(response)],
        iteration: 0,
    };
}
async function Revisor(state: typeof StateAnnotation.State) {
    const response = await modelWithTools.invoke([
        new SystemMessage(
            ReviewerPrompt
        ),
        ...state.messages,
    ])
    return {
        messages: [new AIMessage(response)],
        iteration: Number(state.iteration) + 1,
    };
}
async function FinalResponder(state: typeof StateAnnotation.State) {
    const response = await modelWithTools.invoke([
        new SystemMessage(
            FinalResponderPrompt
        ),
        ...state.messages,
    ])
    return {
        messages: [new AIMessage(response)],
        // iteration: Number(state.iteration) + 1,
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
    // Otherwise, we stop (reply to the user)
    if (Number(state.iteration) < 2) {
        return "toolNode"
    }
    return "FinalResponder";
}
const graph = new StateGraph(StateAnnotation)
    .addNode("Responder", Responder)
    .addNode("toolNode", toolNode)
    .addNode("Revisor", Revisor)
    .addNode("FinalResponder", FinalResponder)
    .addEdge(START, "Responder")
    .addEdge("Responder", "toolNode")
    .addEdge("toolNode", "Revisor")
    .addConditionalEdges("Revisor", shouldContinue, ["toolNode", "FinalResponder"])
    .addEdge("FinalResponder", END)
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
