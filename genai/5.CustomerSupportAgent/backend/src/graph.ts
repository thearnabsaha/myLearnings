import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { frontDeskSystemPrompt } from "./prompt";

export const agent = async () => {
    // Define the tools for the agent to use
    const agentModel = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    });
    // Initialize memory to persist state between graph runs
    const agentCheckpointer = new MemorySaver();
    const agent = createReactAgent({
        llm: agentModel,
        tools: [],
        checkpointSaver: agentCheckpointer,
    });

    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", agent)
        .addEdge("__start__", "agent")
        .addEdge("agent", "__end__")

    const app = workflow.compile();
    // Use the agent
    const finalState = await app.invoke(
        { messages: [new SystemMessage(frontDeskSystemPrompt), new HumanMessage("what is the weather in sf")], },
        { configurable: { thread_id: 1 } },
    );
    console.log(finalState.messages[finalState.messages.length - 1].content);
}