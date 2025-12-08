import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from "langchain";
import { SystemMessage } from '@langchain/core/messages';
import { TwitterReviewerPrompt, TwitterWriterPrompt } from "./prompt";
export const callLLM = async () => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0
    });

    const LLM = async (state: typeof MessagesAnnotation.State) => {
        const response = await model.invoke(state.messages);
        return { messages: [...state.messages, response] };
    };
    const writer = async (state: typeof MessagesAnnotation.State) => {
        const response = await model.invoke([{ role: "system", content: TwitterWriterPrompt }, ...state.messages]);
        return { messages: [...state.messages, response] };
    };
    const reviewer = async (state: typeof MessagesAnnotation.State) => {
        const response = await model.invoke([{ role: "system", content: TwitterReviewerPrompt }, ...state.messages]);
        return { messages: [...state.messages, response] };
    };

    const graph = new StateGraph(MessagesAnnotation)
        .addNode("writer", writer)
        // .addNode("reviewer", reviewer)
        .addEdge(START, "writer")
        // .addConditionalEdges('writer',"reviewer",)
        // .addEdge("writer", END)
        .compile();

    const answer = await graph.invoke({ messages: [new HumanMessage("write a tweet about bunjs")] });
    console.log(answer.messages[answer.messages.length - 1].content)
}