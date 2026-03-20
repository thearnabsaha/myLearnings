import {
    StateGraph,
    StateSchema,
    MessagesValue,
    ReducedValue,
    GraphNode,
    ConditionalEdgeRouter,
    START,
    END,
} from "@langchain/langgraph";
import { z } from "zod/v4";

export const MessagesState = new StateSchema({
    messages: MessagesValue,
    llmCalls: new ReducedValue(
        z.number().default(0),
        { reducer: (x, y) => x + y }
    ),
});