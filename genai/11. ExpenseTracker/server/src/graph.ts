import { SystemMessage } from "@langchain/core/messages";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";
import { modelWithTools, toolsByName } from "./tools";
import { ConditionalEdgeRouter, END, GraphNode, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { llmCall } from "./model";

const toolNode: GraphNode<typeof MessagesState> = async (state) => {
    //@ts-ignore
    const lastMessage = state.messages.at(-1);

    if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
        return { messages: [] };
    }

    const result: ToolMessage[] = [];
    for (const toolCall of lastMessage.tool_calls ?? []) {
        //@ts-ignore
        const tool = toolsByName[toolCall.name];
        const observation = await tool.invoke(toolCall);
        result.push(observation);
    }

    return { messages: result };
};
//@ts-ignore
const shouldContinue: ConditionalEdgeRouter<typeof MessagesState, "toolNode"> = (state) => {
    //@ts-ignore
    const lastMessage = state.messages.at(-1);

    // Check if it's an AIMessage before accessing tool_calls
    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return END;
    }

    // If the LLM makes a tool call, then perform an action
    if (lastMessage.tool_calls?.length) {
        return "toolNode";
    }

    // Otherwise, we stop (reply to the user)
    return END;
};
const checkpointer = new MemorySaver();
const graph = new StateGraph(MessagesState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    //@ts-ignore
    .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "llmCall")
    .compile({ checkpointer });

// Invoke
export const agent = async (msg: string, threadId: string, userId: string) => {
    console.log(threadId);
    const result = await graph.invoke({
        messages: [new HumanMessage(msg + "(never show it in a response) my user userId : " + userId)],
    }, { configurable: { thread_id: threadId } });

    // for (const message of result.messages) {
    //     console.log(`[${message.type}]: ${message.text}`);
    // }
    console.log(result)
    // console.log(result.messages[result.messages.length - 1].content)
    return result.messages[result.messages.length - 1].content
}