import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
const one = (state: any) => {
    console.log("one...")
    return state
}
const two = (state: any) => {
    console.log("two...")
    return state
}
const three = (state: any) => {
    console.log("three...")
    return state
}
const four = (state: any) => {
    console.log("four...")
    return state
}
const five = (state: any) => {
    console.log("five...")
    return state
}
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("one", one)
    .addNode("two", two)
    .addNode("three", three)
    .addNode("four", four)
    .addNode("five", five)
    .addEdge("__start__", "one")
    .addEdge("one", "two")
    .addEdge("two", "three")
    .addEdge("three", "four")
    .addEdge("four", "five")
    .addEdge("five", "__end__")
const app = workflow.compile();
const main = async () => {
    const finalState = await app.invoke({
        messages: [],
    });
    console.log(finalState)
}
main()