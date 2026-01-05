import { StateGraph, START, END, MessagesAnnotation, Annotation } from "@langchain/langgraph";

export const MessagesState = Annotation.Root({
    ...MessagesAnnotation.spec,
});

// Extract the state type for function signatures
export type MessagesStateType = typeof MessagesState.State;