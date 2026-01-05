import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import * as z from "zod";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StateAnnotation } from "./state";
import { isAIMessage, ToolMessage } from "@langchain/core/messages";
import { END, START, StateGraph } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { FinalResponderPrompt, ResponderPrompt, ReviewerPrompt } from "./prompt";
import { questionAnswerSchema, type QuestionAnswer } from "./schema";

const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
});
const structuredModel = model.withStructuredOutput(questionAnswerSchema);

// Define tools
const SearchTool = new TavilySearch({
    maxResults: 3,
    searchDepth: "advanced",
});

// const toolsByName = {
//     [SearchTool.name]: SearchTool,
// };
// const tools = Object.values(toolsByName);
// const modelWithTools = model.bindTools(tools);

async function Responder(state: typeof StateAnnotation.State) {
    const response = await structuredModel.invoke([
        new SystemMessage(
            ResponderPrompt
        ),
        ...state.messages,
        new SystemMessage(
            "Reflect on the user's original question and the actions taken thus far. Respond using structured output."
        ),
    ])

    return {
        messages: [new AIMessage(JSON.stringify(response))],
        iteration: 0,
    };
}
async function Revisor(state: typeof StateAnnotation.State) {
    const response = await structuredModel.invoke([
        new SystemMessage(
            ReviewerPrompt
        ),
        ...state.messages,
        new SystemMessage(
            "Reflect on the user's original question and the actions taken thus far. Respond using structured output."
        ),
    ])
    return {
        messages: [new AIMessage(JSON.stringify(response))],
        iteration: Number(state.iteration) + 1,
    };
}
async function FinalResponder(state: typeof StateAnnotation.State) {
    const response = await model.invoke([
        new SystemMessage(
            FinalResponderPrompt
        ),
        ...state.messages,
    ])
    return {
        messages: [new AIMessage(response)],
    };
}
async function toolNode(state: typeof StateAnnotation.State) {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    const parsed = JSON.parse(lastMessage.content as string) as QuestionAnswer;

    const searchResult = await SearchTool.batch(parsed.searchQueries.map((query) => ({ query })));

    const cleanedResults = [];

    for (let i = 0; i < parsed.searchQueries.length; i++) {
        const query = parsed.searchQueries[i];
        const searchOutput = searchResult[i];

        // Access the results array directly from the search output
        const results = searchOutput?.results || [];

        // Extract only essential fields from each result
        for (const result of results) {
            cleanedResults.push({
                query: query,
                content: result.content || '',
                url: result.url || '',
            });
        }
    }

    return {
        messages: [new HumanMessage(JSON.stringify({ searchResults: cleanedResults }))],
    };
}
async function shouldContinue(state: typeof StateAnnotation.State) {
    // Otherwise, we stop (reply to the user)
    if (Number(state.iteration) < 2) {
        return "toolNode"
    }
    return "FinalResponder";
    // return END;
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
