import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from "langchain";
import { SystemMessage } from '@langchain/core/messages';
import { StateAnnotation } from "./state";
import { PromptEnhancerPrompt, PromptEnhancerReviewerPrompt } from "./prompt";
export const agent = async (inputMessage: string, threadId: string) => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0
    });
    // const LLM = async (state: typeof MessagesAnnotation.State) => {
    //     const response = await model.invoke(state.messages);
    //     return { messages: [...state.messages, response] };
    // };

    // const writer = async (state: typeof MessagesAnnotation.State) => {
    //     const response = await model.invoke([{ role: "system", content: TwitterWriterPrompt }, ...state.messages]);
    //     return { messages: [...state.messages, response] };
    // };
    const writer = async (state: typeof StateAnnotation.State) => {
        const response = await model.invoke([{ role: "system", content: PromptEnhancerPrompt }, ...state.messages]);
        return { messages: [response], iteration: Number(state.iteration) >= 1 ? state.iteration : 1 };
    };
    const reviewer = async (state: typeof StateAnnotation.State) => {
        const response = await model.invoke([{ role: "system", content: PromptEnhancerReviewerPrompt }, ...state.messages]);
        return { messages: [new HumanMessage(response.content as string)], iteration: Number(state.iteration) + 1 };
    };
    const nextNode = (state: typeof StateAnnotation.State) => {
        if (Number(state.iteration) < 3) {
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

    const answer = await graph.invoke({ messages: [new HumanMessage("find me a best starter pokemon")] }, { configurable: { thread_id: threadId } },);
    // const answer = await graph.invoke({ messages: [new HumanMessage(inputMessage)] }, { configurable: { thread_id: threadId } },);
    console.log(answer)
    console.log(answer.messages[answer.messages.length - 1].content)
    return answer.messages[answer.messages.length - 1].content
}