import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from "langchain";
import { firstPrompt } from "./prompt";
export const callLLM = async () => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0
    });

    const LLM = async (state: typeof MessagesAnnotation.State) => {
        const response = await model.invoke(state.messages);
        return { messages: [...state.messages, response] };
    };

    const graph = new StateGraph(MessagesAnnotation)
        .addNode("LLM", LLM)
        .addEdge(START, "LLM")
        .addEdge("LLM", END)
        .compile();

    const answer = await graph.invoke({ messages: [new AIMessage(firstPrompt), new HumanMessage("hi! I am arnab")] });
    console.log(answer.messages[answer.messages.length - 1].content)
}