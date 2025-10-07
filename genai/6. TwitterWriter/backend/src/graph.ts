import { HumanMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { TwitterReviewerPrompt, TwitterWriterPrompt } from "./prompt";
import { StateAnnotation } from "./state";

export const agent = async () => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    })

    function shouldContinue({ messages }: typeof StateAnnotation.State) {
        console.log("I am in continue")
        return "__end__";
    }

    async function writer(state: typeof StateAnnotation.State) {
        console.log("I am in writer")
        const response = await model.invoke([
            {
                role: "system", content: TwitterReviewerPrompt
            }, ...state.messages
        ]);
        return { messages: [response], iteration: 1 };
    }
    async function reviewer(state: typeof StateAnnotation.State) {
        console.log("I am in reviewer")
        const response = await model.invoke([
            {
                role: "system", content: TwitterWriterPrompt
            }, ...state.messages
        ]);
        return { messages: [response] };
    }

    const workflow = new StateGraph(StateAnnotation)
        .addNode("writer", writer)
        .addNode("reviewer", reviewer)
        .addEdge("__start__", "writer")
        .addEdge("reviewer", "writer")
        .addConditionalEdges("writer", shouldContinue);

    const app = workflow.compile();

    // const finalState = await app.invoke({
    //     messages: [new HumanMessage("write an tweet on macbook vs thinkpad")],
    // });
    // console.log(finalState.messages[finalState.messages.length - 1].content);
    const stream = await app.stream({
        messages: [
            {
                role: "user",
                content: "write an tweet on macbook vs thinkpad",
            },
        ]
    }, { configurable: { thread_id: "1" } });
    for await (const value of stream) {
        console.log("---STEP---");
        //@ts-ignore
        console.log(value);
        console.log("---END STEP---");
    }
}
