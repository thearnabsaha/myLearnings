// import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
// import { ChatGroq } from "@langchain/groq";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { frontDeskSystemPrompt, marketingSupportTeamPrompt, routingSystemPrompt } from "./prompt";
// import { StateAnnotation } from "./state";
// import { GetCouponsTool } from "./tools";

// export const agent = async () => {
//     // Define the tools for the agent to use

//     const tools = [GetCouponsTool];
//     const toolNode = new ToolNode(tools);

//     const agentModel = new ChatGroq({
//         model: "openai/gpt-oss-120b",
//         temperature: 0,
//     })
//     // .bindTools(tools);
//     // Initialize memory to persist state between graph runs
//     const agentCheckpointer = new MemorySaver();
//     const agent = createReactAgent({
//         llm: agentModel,
//         tools: tools,
//         checkpointSaver: agentCheckpointer,
//     });
//     // Define the function that determines whether to continue or not
//     function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
//         const lastMessage = messages[messages.length - 1] as AIMessage;
//         const lastMessageContent = lastMessage.content as string;
//         if (lastMessageContent.includes("Marketing")) {
//             return "MarketingSupport";
//         }
//         return "LearningSupport";
//     }
//     function shouldCallTools({ messages }: typeof MessagesAnnotation.State) {
//         // if(nextRepresentative=="Marketing"){

//         // }
//         console.log(messages)
//         return "__end__";
//     }
//     // Define the function that calls the model
//     const frontDesk = async (state: typeof StateAnnotation.State) => {
//         console.log("I am in frontdesk")
//         const response = await agentModel.invoke([
//             { role: "system", content: frontDeskSystemPrompt },
//             ...state.messages]);
//         const routedResponse = await agentModel.invoke([
//             { role: "system", content: routingSystemPrompt },
//             // ...state.messages]);
//             ...state.messages], { response_format: { type: "json_object" } });
//         // console.log(state)
//         //@ts-ignore
//         const jsonContent = JSON.parse(routedResponse.content)
//         // console.log("a", response, jsonContent.nextRepresentative)
//         return { messages: [response], nextRepresentative: jsonContent.nextRepresentative };
//     }

//     const MarketingSupport = async (state: typeof StateAnnotation.State) => {
//         console.log("I am in marketing support")
//         const agentModelWithTools = agentModel.bindTools(tools)
//         state.messages.pop()
//         // console.log("a", state.messages.pop())
//         // console.log("b", state.messages)
//         const response = await agentModelWithTools.invoke([
//             { role: "system", content: marketingSupportTeamPrompt },
//             ...state.messages]);
//         return { messages: [response] };
//         // const response = await agent.invoke(state);
//         // return { messages: [response.messages] };
//     }
//     const LearningSupport = async (state: typeof StateAnnotation.State) => {
//         console.log("I am in learning support")
//         // const response = await agent.invoke(state);
//         // return { messages: [response.messages] };
//         const response = await agentModel.invoke(state.messages);
//         return { messages: [response] };
//     }
//     const workflow = new StateGraph(StateAnnotation)
//         .addNode("frontDesk", frontDesk)
//         .addNode("MarketingSupport", MarketingSupport)
//         .addNode("LearningSupport", LearningSupport)
//         .addNode("tools", toolNode)
//         .addEdge("__start__", "frontDesk")
//         .addConditionalEdges("frontDesk", shouldContinue, {
//             MarketingSupport: "MarketingSupport",
//             LearningSupport: "LearningSupport",
//             __end__: "__end__",
//         })
//         .addConditionalEdges("MarketingSupport", shouldCallTools, {
//             tools: "tools",
//             __end__: "__end__",
//         })
//         // .addEdge("MarketingSupport", "__end__")
//         .addEdge("LearningSupport", "__end__")

//     const app = workflow.compile();
//     // Use the agent
//     // const finalState = await app.invoke(
//     //     // { messages: [new SystemMessage(frontDeskSystemPrompt), new HumanMessage("how many course are there?")], },
//     //     { messages: [new SystemMessage(frontDeskSystemPrompt), new HumanMessage("how many chapters are there in genai course?")], },
//     //     { configurable: { thread_id: 1 } },
//     // );
//     // console.log(finalState.messages[finalState.messages.length - 1].content);

//     const stream = await app.stream({
//         messages: [
//             {
//                 role: "system",
//                 content: frontDeskSystemPrompt
//             },
//             {
//                 role: "user",
//                 // content: "how many chapters are there in genai course?",
//                 // content: "how many course are there?",
//                 content: "is there any cupon code?",
//             },
//         ]
//     }, { configurable: { thread_id: "1" } });

//     // for await (const value of stream) {
//     //     console.log("---STEP---");
//     //     console.log(value);
//     //     console.log("---END STEP---");
//     // }

// }

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
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
        console.log("I am in frontDesk")
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
        console.log("i am in marketing team")
        const modelWithTools = model.bindTools(tools);
        const response = await modelWithTools.invoke([
            {
                role: "system", content: marketingSupportTeamPrompt
            }, ...state.messages
        ]);
        return { messages: [response] };
    }
    async function LearningSupport(state: typeof MessagesAnnotation.State) {
        console.log("i am in learning team")
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
    const app = workflow.compile();

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
        { messages: [new HumanMessage("how many chapters are there in genai course?")] },
        { configurable: { thread_id: 1 } },
    );
    console.log(finalState.messages[finalState.messages.length - 1].content)
    return finalState.messages[finalState.messages.length - 1].content
}