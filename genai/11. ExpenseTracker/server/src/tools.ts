import { tool } from "@langchain/core/tools";
import z from "zod";
import { model } from "./model";

// Define tools
const add = tool(({ a, b }) => a + b, {
    name: "add",
    description: "Add two numbers",
    schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
});

const multiply = tool(({ a, b }) => a * b, {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
});

const divide = tool(({ a, b }) => a / b, {
    name: "divide",
    description: "Divide two numbers",
    schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
    }),
});

// Augment the LLM with tools
export const toolsByName: Record<string, typeof add | typeof multiply | typeof divide> = {
    [add.name]: add,
    [multiply.name]: multiply,
    [divide.name]: divide,
};
const tools = Object.values(toolsByName);
export const modelWithTools = model.bindTools(tools);
