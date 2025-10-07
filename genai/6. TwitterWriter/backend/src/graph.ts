import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";

export const agent = async () => {
    // Define the tools for the agent to use
    // const tools = [new TavilySearchResults({ maxResults: 3 })];
    // const toolNode = new ToolNode(tools);
    // Create a model and give it access to the tools
    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    })

    // Define the function that determines whether to continue or not
    function shouldContinue({ messages }: typeof MessagesAnnotation.State) {

        // Otherwise, we stop (reply to the user) using the special "__end__" node
        return "__end__";
    }

    // Define the function that calls the model
    async function writer(state: typeof MessagesAnnotation.State) {
        const response = await model.invoke(state.messages);

        // We return a list, because this will get added to the existing list
        return { messages: [response] };
    }
    // Define the function that calls the model
    async function reviewer(state: typeof MessagesAnnotation.State) {
        const response = await model.invoke(state.messages);

        // We return a list, because this will get added to the existing list
        return { messages: [response] };
    }

    // Define a new graph
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("writer", writer)
        .addNode("reviewer", reviewer)
        .addEdge("__start__", "writer")
        .addEdge("reviewer", "writer")
        .addConditionalEdges("writer", shouldContinue);

    // Finally, we compile it into a LangChain Runnable.
    const app = workflow.compile();

    // Use the agent
    const finalState = await app.invoke({
        messages: [new HumanMessage("what is the weather in sf")],
    });
    console.log(finalState.messages[finalState.messages.length - 1].content);

    const nextState = await app.invoke({
        // Including the messages from the previous run gives the LLM context.
        // This way it knows we're asking about the weather in NY
        messages: [...finalState.messages, new HumanMessage("what about ny")],
    });
    console.log(nextState.messages[nextState.messages.length - 1].content);
}
