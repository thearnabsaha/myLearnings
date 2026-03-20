import { SystemMessage } from "@langchain/core/messages";
import { modelWithTools } from "./tools";
import { MessagesState } from "./state";
import { GraphNode } from "@langchain/langgraph";
import { systemPrompt } from "./prompts";

export const llmCall: GraphNode<typeof MessagesState> = async (state) => {
    const response = await modelWithTools.invoke([
        new SystemMessage(
            systemPrompt
        ),
        ...state.messages,
    ]);
    return {
        messages: [response],
        llmCalls: 1,
    };
};
