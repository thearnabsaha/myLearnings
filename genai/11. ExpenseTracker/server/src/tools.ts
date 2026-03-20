import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { ChatGroq } from "@langchain/groq"
import { TavilySearch } from "@langchain/tavily";

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
})
// Define tools
// const add = tool(({ a, b }) => a + b, {
//     name: "add",
//     description: "Add two numbers",
//     schema: z.object({
//         a: z.number().describe("First number"),
//         b: z.number().describe("Second number"),
//     }),
// });

// const multiply = tool(({ a, b }) => a * b, {
//     name: "multiply",
//     description: "Multiply two numbers",
//     schema: z.object({
//         a: z.number().describe("First number"),
//         b: z.number().describe("Second number"),
//     }),
// });

// const divide = tool(({ a, b }) => a / b, {
//     name: "divide",
//     description: "Divide two numbers",
//     schema: z.object({
//         a: z.number().describe("First number"),
//         b: z.number().describe("Second number"),
//     }),
// });
const searchClient = new TavilySearch({
    maxResults: 5,
    topic: "general",
});
const searchTool = tool(async ({ query }) => {
    const results = await searchClient.invoke({ query });
    return results
}, {
    name: "search",
    description: "Searches from the internet for newer informations",
    schema: z.object({
        query: z.string().describe("query to search in the internet")
    }),
});
// Augment the LLM with tools
export const toolsByName = {
    [searchTool.name]: searchTool,
    // [add.name]: add,
    // [multiply.name]: multiply,
    // [divide.name]: divide,
};
const tools = Object.values(toolsByName);
export const modelWithTools = model.bindTools(tools);