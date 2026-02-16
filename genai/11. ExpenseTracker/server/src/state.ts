import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

// Use Annotation for state definition
export const GraphState = Annotation.Root({
    ...MessagesAnnotation.spec,
});
