import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { GetCouponsTool, GetDataTool } from "./tools";
import { StateAnnotation } from "./state";
import { frontDeskSystemPrompt, learningSupportTeamPrompt, marketingSupportTeamPrompt, routingSystemPrompt } from "./prompt";

export const agent = async () => {
    // Define the tools for the agent to use
    const tools = [GetCouponsTool];
    const DataTools = [GetDataTool];
    const toolNode = new ToolNode(tools);
    const DataToolsNode = new ToolNode(DataTools);
    // Create a model and give it access to the tools
    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    })
    // Define the function that determines whether to continue or not
    function shouldCallTools({ messages }: typeof StateAnnotation.State) {
        const lastMessage = messages[messages.length - 1] as AIMessage;

        // If the LLM makes a tool call, then we route to the "tools" node
        if (lastMessage.tool_calls?.length) {
            return "tools";
        }
        // Otherwise, we stop (reply to the user) using the special "__end__" node
        return "__end__";
    }
    function shouldCallDataTools({ messages }: typeof StateAnnotation.State) {
        const lastMessage = messages[messages.length - 1] as AIMessage;

        // If the LLM makes a tool call, then we route to the "tools" node
        if (lastMessage.tool_calls?.length) {
            return "DataTools";
        }
        // Otherwise, we stop (reply to the user) using the special "__end__" node
        return "__end__";
    }
    function shouldContinue(state: typeof StateAnnotation.State) {
        // console.log()
        if (state.nextRepresentative == "MARKETING") {
            return "MarketingSupport"
        }
        if (state.nextRepresentative == "LEARNING") {
            return "LearningSupport"
        }
        // Otherwise, we stop (reply to the user) using the special "__end__" node
        return "__end__";
    }

    // Define the function that calls the model
    async function frontDesk(state: typeof StateAnnotation.State) {
        const response = await model.invoke([
            {
                role: "system", content: frontDeskSystemPrompt
            }, ...state.messages
        ]);
        const routedResponse = await model.invoke([
            { role: "system", content: routingSystemPrompt },
            ...state.messages], { response_format: { type: "json_object" } });
        const nextRepresentative = JSON.parse(routedResponse.content as string)

        return { messages: [response], nextRepresentative: nextRepresentative.nextRepresentative };
    }
    async function MarketingSupport(state: typeof MessagesAnnotation.State) {
        const modelWithTools = model.bindTools(tools);
        const response = await modelWithTools.invoke([
            {
                role: "system", content: marketingSupportTeamPrompt
            }, ...state.messages
        ]);
        return { messages: [response] };
    }
    async function LearningSupport(state: typeof MessagesAnnotation.State) {
        const modelWithTools = model.bindTools(DataTools);
        const response = await modelWithTools.invoke([
            {
                role: "system", content: learningSupportTeamPrompt
            }, ...state.messages
        ]);
        return { messages: [response] };
    }
    // Define a new graph
    const workflow = new StateGraph(StateAnnotation)
        .addNode("frontDesk", frontDesk)
        .addNode("tools", toolNode)
        .addNode("DataTools", DataToolsNode)
        .addNode("LearningSupport", LearningSupport)
        .addNode("MarketingSupport", MarketingSupport)
        .addEdge("__start__", "frontDesk")
        .addEdge("tools", "MarketingSupport")
        .addEdge("DataTools", "LearningSupport")
        .addConditionalEdges("frontDesk", shouldContinue, {
            MarketingSupport: "MarketingSupport",
            LearningSupport: "LearningSupport",
            __end__: "__end__"
        })
        .addConditionalEdges("MarketingSupport", shouldCallTools, {
            tools: "tools",
            __end__: "__end__"
        })
        .addConditionalEdges("LearningSupport", shouldCallDataTools, {
            DataTools: "DataTools",
            __end__: "__end__"
        });

    // Finally, we compile it into a LangChain Runnable.
    const app = workflow.compile({ checkpointer: new MemorySaver });

    // const stream = await app.stream({
    //     messages: [
    //         {
    //             role: "user",
    //             // content: "genai course is on which language",
    //             content: "how many chapters are there in genai course?",
    //             // content: "how many course are there?",
    //             // content: "is there any cupon code?",
    //             // content: "hi",
    //         },
    //     ]
    // }, { configurable: { thread_id: "1" } });

    // for await (const value of stream) {
    //     console.log("---STEP---");
    //     //@ts-ignore
    //     console.log(value);
    //     console.log("---END STEP---");
    // }

    const finalState = await app.invoke(
        // { messages: [new HumanMessage("genai course is on which language")] },
        // { messages: [new HumanMessage("how many chapters are there in genai course?")] },
        // { messages: [new HumanMessage("how many course are there?")] },
        { messages: [new HumanMessage("is there any cupon code?")] },
        // { messages: [new HumanMessage("hi")] },
        { configurable: { thread_id: 1 } },
    );
    console.log(finalState.messages[finalState.messages.length - 1].content)
    return finalState.messages[finalState.messages.length - 1].content
}