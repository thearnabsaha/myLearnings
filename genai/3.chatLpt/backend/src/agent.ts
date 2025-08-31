// import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
// import { createReactAgent } from "@langchain/langgraph/prebuilt";
// import { TavilySearch } from "@langchain/tavily";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { ChatGroq } from "@langchain/groq";
// export const agent = async () => {
//     const search = new TavilySearch({
//         maxResults: 5,
//         topic: "general",
//     });
//     const tools = [search];
//     const toolNode = new ToolNode(tools);
//     const model = new ChatGroq({
//         model: "openai/gpt-oss-20b",
//         temperature: 0,
//     }).bindTools(tools);
//     const agent = await createReactAgent({
//         llm: model,
//         tools: [search],
//     });

// }
// // // Define a new graph
// // const workflow = new StateGraph(MessagesAnnotation)
// // // .addNode("agent", callModel)
// // // .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
// // // .addNode("tools", toolNode)
// // // .addEdge("tools", "agent")
// // // .addConditionalEdges("agent", shouldContinue);

// // // Finally, we compile it into a LangChain Runnable.
// // const app = workflow.compile();
