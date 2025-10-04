import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { frontDeskSystemPrompt, routingSystemPrompt } from "./prompt";
import { StateAnnotation } from "./state";

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
    // Define the function that determines whether to continue or not
    function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
        const lastMessage = messages[messages.length - 1] as AIMessage;
        const lastMessageContent = lastMessage.content as string;
        console.log(messages)
        if (lastMessageContent.includes("Marketing")) {
            return "MarketingSupport";
        }
        // if (lastMessageContent.includes("LEARNING")) {
        //     return "LearningSupport";
        // }
        return "LearningSupport";
    }
    // Define the function that calls the model
    const frontDesk = async (state: typeof StateAnnotation.State) => {
        console.log("I am in frontdesk")
        const response = await agentModel.invoke([
            { role: "system", content: frontDeskSystemPrompt },
            ...state.messages]);
        const routedResponse = await agentModel.invoke([
            { role: "system", content: routingSystemPrompt },
            ...state.messages], { response_format: { type: "json_object" } });
        // console.log("a", response)
        // console.log("b", routedResponse)
        return { messages: [routedResponse] };
        // return { messages: [response] };
    }

    const MarketingSupport = async (state: typeof StateAnnotation.State) => {
        console.log("I am in marketing support")
        const response = await agentModel.invoke(state.messages);
        return { messages: [response] };
        // const response = await agent.invoke(state);
        // return { messages: [response.messages] };
    }
    const LearningSupport = async (state: typeof StateAnnotation.State) => {
        console.log("I am in learning support")
        // const response = await agent.invoke(state);
        // return { messages: [response.messages] };
        const response = await agentModel.invoke(state.messages);
        return { messages: [response] };
    }
    const workflow = new StateGraph(StateAnnotation)
        .addNode("frontDesk", frontDesk)
        .addNode("MarketingSupport", MarketingSupport)
        .addNode("LearningSupport", LearningSupport)
        .addEdge("__start__", "frontDesk")
        .addConditionalEdges("frontDesk", shouldContinue)
        .addEdge("MarketingSupport", "__end__")
        .addEdge("LearningSupport", "__end__")

    const app = workflow.compile();
    // Use the agent
    // const finalState = await app.invoke(
    //     // { messages: [new SystemMessage(frontDeskSystemPrompt), new HumanMessage("how many course are there?")], },
    //     { messages: [new SystemMessage(frontDeskSystemPrompt), new HumanMessage("how many chapters are there in genai course?")], },
    //     { configurable: { thread_id: 1 } },
    // );
    // console.log(finalState.messages[finalState.messages.length - 1].content);

    const stream = await app.stream({
        messages: [
            {
                role: "user",
                // content: "how many chapters are there in genai course?",
                content: "how many course are there?",
                // content: "is there any cupon code?",
            },
        ]
    }, { configurable: { thread_id: "1" } });

    // for await (const value of stream) {
    //     console.log("---STEP---");
    //     console.log(value);
    //     console.log("---END STEP---");
    // }

}