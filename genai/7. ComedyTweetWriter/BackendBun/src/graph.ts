import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";

// const mockLlm = (state: typeof MessagesAnnotation.State) => {
//     return { messages: [{ role: "ai", content: "hello world" }] };
// };
import { ChatGroq } from "@langchain/groq";
export const callLLM = async () => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0
    });
    // const graph = new StateGraph(MessagesAnnotation)
    //     .addNode("mock_llm", model)
    //     .addEdge(START, "mock_llm")
    //     .addEdge("mock_llm", END)
    //     .compile();

    // await graph.invoke({ messages: [{ role: "user", content: "hi!" }] });
    const answer = await model.invoke("Hello, I am arnab!")
    console.log(answer.content)
}