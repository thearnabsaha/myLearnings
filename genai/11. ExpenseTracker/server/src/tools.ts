import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { model } from "./model";
import { TavilySearch } from "@langchain/tavily";

const searchTool = new TavilySearch({
    maxResults: 5,
    topic: "general",
    // includeAnswer: false,
    // includeRawContent: false,
    // includeImages: false,
    // includeImageDescriptions: false,
    // searchDepth: "basic",
    // timeRange: "day",
    // includeDomains: [],
    // excludeDomains: [],
});
const add = tool(({ a, b }) => a + b, {
    name: "add",
    description: "Add two numbers",
    schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
});
const toolsByName = {
    [add.name]: add,
    [searchTool.name]: searchTool,
};
const tools = Object.values(toolsByName);
export const modelWithTools = model.bindTools(tools);