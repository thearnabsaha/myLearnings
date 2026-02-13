import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { GraphState } from "./state";
import { modelWithTools, toolsByName } from "./tools";
import { END } from "@langchain/langgraph";

export const llmCall = async (state: typeof GraphState.State) => {
    const response = await modelWithTools.invoke(state.messages as any);
    return {
        messages: [response],
        llmCalls: 1,
    };
};

export const toolNode = async (state: typeof GraphState.State) => {
    const lastMessage = state.messages[state.messages.length - 1];

    if (!lastMessage || !(lastMessage instanceof AIMessage)) {
        return { messages: [] };
    }

    const result: ToolMessage[] = [];
    for (const toolCall of lastMessage.tool_calls ?? []) {
        const tool = toolsByName[toolCall.name];
        if (!tool) continue;

        const observation = await tool.invoke(toolCall);

        result.push(
            new ToolMessage({
                content: String(observation),
                tool_call_id: toolCall.id!,
                name: toolCall.name,
            })
        );
    }

    return { messages: result };
};

export const shouldContinue = (state: typeof GraphState.State): "toolNode" | typeof END => {
    const lastMessage = state.messages[state.messages.length - 1];

    if (!lastMessage || !(lastMessage instanceof AIMessage)) {
        return END;
    }

    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return "toolNode";
    }

    return END;
};
