import { END, StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, } from "@langchain/core/messages";
import dotenv from 'dotenv';
dotenv.config();
export const agent = async () => {
    const system_prompt = `You are a personal assistent, who answers the asked questions. give answers in text only
                    Current date and time is: ${new Date().toUTCString()}
                    `
    const search = new TavilySearch({
        maxResults: 5,
        topic: "general",
    });

    const tools = [search];
    const toolNode = new ToolNode(tools);

    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    }).bindTools(tools);

    const reactAgent = createReactAgent({
        llm: model,
        tools: [search],
    });
    const shouldContinue = (state: any) => {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage.tool_calls?.length) {
            return "tools"
        } else {
            return "__end__"
        }
    }
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", reactAgent)
        .addNode("tools", toolNode)
        .addEdge("__start__", "agent")
        .addEdge("tools", "agent")
        .addConditionalEdges("agent", shouldContinue, {
            __end__: END,
            tools: "tools"
        })

    const app = workflow.compile();
    const finalState = await app.invoke({
        // messages: [new HumanMessage("what is the weather in sf")],
        messages: [new AIMessage(system_prompt), new HumanMessage("what current time here, and what is my name")],
    });
    console.log(finalState.messages[finalState.messages.length - 1].content);
    return finalState.messages[finalState.messages.length - 1].content
}
// agent()

