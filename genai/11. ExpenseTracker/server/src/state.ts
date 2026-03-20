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
    messages: MessagesValue
});