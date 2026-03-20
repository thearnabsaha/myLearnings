import { SystemMessage } from "@langchain/core/messages";
import { modelWithTools } from "./tools";
import { MessagesState } from "./state";
import { GraphNode } from "@langchain/langgraph";

export const llmCall: GraphNode<typeof MessagesState> = async (state) => {
    const response = await modelWithTools.invoke([
        new SystemMessage(
            "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
        ),
        ...state.messages,
    ]);
    return {
        messages: [response],
        llmCalls: 1,
    };
};
