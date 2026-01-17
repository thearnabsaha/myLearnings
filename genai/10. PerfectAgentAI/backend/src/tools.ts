import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import z from "zod";
// Define tools
const Searchtool = new TavilySearch({
    maxResults: 3,
});
// const customTool = tool(function,Schema);
// const add = tool(({ a, b }) => a + b, {
//     name: "add",
//     description: "Add two numbers",
//     schema: z.object({
//         a: z.number().describe("First number"),
//         b: z.number().describe("Second number"),
//     }),
// });
// Augment the LLM with tools
export const toolsByName = {
    // [add.name]: add,
    // [multiply.name]: multiply,
    // [divide.name]: divide,
    [Searchtool.name]: Searchtool,
};
export const tools = Object.values(toolsByName);
