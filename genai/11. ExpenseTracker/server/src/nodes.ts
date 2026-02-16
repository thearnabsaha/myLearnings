import { AIMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { GraphState } from "./state";
import { modelWithTools, toolsByName } from "./tools";
import { END } from "@langchain/langgraph";

export const llmCall = async (state: typeof GraphState.State) => {
    // const response = await modelWithTools.invoke(state.messages as any);
    const response = await modelWithTools.invoke([
        new SystemMessage(
            "You are a expense tracker assistent. except doing expense tracking related thing, you don't do anything, you just politely decline and tell what you can do."
        ),
        ...state.messages,
    ]);
    return {
        messages: [response],
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

export const shouldContinue1 = (state: typeof GraphState.State): "toolNode" | typeof END => {
    const lastMessage = state.messages[state.messages.length - 1];

    if (!lastMessage || !(lastMessage instanceof AIMessage)) {
        return END;
    }

    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return "toolNode";
    }

    return END;
};
// export const shouldContinue2 = (state: typeof GraphState.State): "toolNode" | typeof END => {
//     const lastMessage = state.messages[state.messages.length - 1];

//     if (!lastMessage || !(lastMessage instanceof AIMessage)) {
//         return END;
//     }

//     if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
//         return "toolNode";
//     }

//     return END;
// };
