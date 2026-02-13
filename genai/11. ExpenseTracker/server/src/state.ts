import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

// Use Annotation for state definition
export const GraphState = Annotation.Root({
    ...MessagesAnnotation.spec,
    llmCalls: Annotation<number>({
        reducer: (x, y) => x + y,
        default: () => 0,
    }),
});
