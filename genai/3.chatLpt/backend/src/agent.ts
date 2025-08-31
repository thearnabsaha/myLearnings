import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
dotenv.config();
export const agent = async () => {
    const search = new TavilySearch({
        maxResults: 5,
        topic: "general",
    });
    const tools = [search];
    const toolNode = new ToolNode(tools);
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0,
    }).bindTools(tools);
    const agent = await createReactAgent({
        llm: model,
        tools: [search],
    });

    // Define a new graph
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", agent)
        .addEdge("__start__", "agent")
        .addEdge("agent", "__end__")
    const app = workflow.compile();
    // Use the agent
    const finalState = await app.invoke({
        messages: [new HumanMessage("what is the weather in sf")],
    });
    console.log(finalState.messages[finalState.messages.length - 1].content);

}
agent()