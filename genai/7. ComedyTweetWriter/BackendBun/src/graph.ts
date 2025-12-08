import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "langchain";
export const callLLM = async () => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0
    });

    const mockLlm = async (state: typeof MessagesAnnotation.State) => {
        const response = await model.invoke(state.messages);
        return { messages: [...state.messages, response] };
    };

    const graph = new StateGraph(MessagesAnnotation)
        .addNode("mock_llm", mockLlm)
        .addEdge(START, "mock_llm")
        .addEdge("mock_llm", END)
        .compile();

    const answer = await graph.invoke({ messages: [{ role: "user", content: "hi!" }] });
    console.log(answer)
}