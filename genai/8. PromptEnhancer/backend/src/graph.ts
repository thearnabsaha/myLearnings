import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "langchain";
import { StateAnnotation } from "./state";
import { PromptEnhancerPrompt, PromptEnhancerReviewerPrompt } from "./prompt";
export const agent = async (inputMessage: string, threadId: string) => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0
    });
    const writer = async (state: typeof StateAnnotation.State) => {
        const response = await model.invoke([{ role: "system", content: PromptEnhancerPrompt }, ...state.messages]);
        return { messages: [response], iteration: Number(state.iteration) >= 1 ? state.iteration : 1 };
    };
    const reviewer = async (state: typeof StateAnnotation.State) => {
        const response = await model.invoke([{ role: "system", content: PromptEnhancerReviewerPrompt }, ...state.messages]);
        return { messages: [new HumanMessage(response.content as string)], iteration: Number(state.iteration) + 1 };
    };
    const nextNode = (state: typeof StateAnnotation.State) => {
        if (Number(state.iteration) < 2) {
            return "reviewer"
        }
        return END
    }
    const graph = new StateGraph(StateAnnotation)
        .addNode("writer", writer)
        .addNode("reviewer", reviewer)
        .addEdge(START, "writer")
        .addConditionalEdges('writer', nextNode)
        .addEdge("reviewer", "writer")
        .compile();

    const answer = await graph.invoke({ messages: [new HumanMessage(inputMessage)] }, { configurable: { thread_id: threadId } },);
    console.log(answer)
    console.log(answer.messages[answer.messages.length - 1].content)
    return answer.messages[answer.messages.length - 1].content
}