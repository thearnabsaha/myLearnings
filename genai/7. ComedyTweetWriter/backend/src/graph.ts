import { HumanMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { TwitterReviewerPrompt, TwitterWriterPrompt } from "./prompt";
import { StateAnnotation } from "./state";

export const agent = async (inputMessage: string, threadId: string) => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    })

    function shouldContinue(state: typeof StateAnnotation.State) {
        if (Number(state.iteration) > 3) {
            return "__end__";
        }
        return "reviewer";
    }

    async function writer(state: typeof StateAnnotation.State) {
        const response = await model.invoke([
            {
                role: "system", content: TwitterWriterPrompt
            }, ...state.messages
        ]);
        return { messages: [response], iteration: Number(state.iteration) >= 1 ? state.iteration : 1 };
    }
    async function reviewer(state: typeof StateAnnotation.State) {
        const response = await model.invoke([
            {
                role: "system", content: TwitterReviewerPrompt
            }, ...state.messages
        ]);
        return { messages: [new HumanMessage(response.content as string)], iteration: state.iteration + 1 };
    }

    const workflow = new StateGraph(StateAnnotation)
        .addNode("writer", writer)
        .addNode("reviewer", reviewer)
        .addEdge("__start__", "writer")
        .addEdge("reviewer", "writer")
        .addConditionalEdges("writer", shouldContinue);

    const app = workflow.compile();

    const finalState = await app.invoke(
        { messages: [new HumanMessage(inputMessage)] },
        { configurable: { thread_id: threadId } },
    );
    console.log(finalState.messages[finalState.messages.length - 1].content)
    return finalState.messages[finalState.messages.length - 1].content
}
