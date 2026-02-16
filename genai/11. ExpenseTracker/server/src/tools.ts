import { tool } from "@langchain/core/tools";
import z from "zod";
import { model } from "./model";

// Define tools
const addExpense = tool(
    ({ title, amount, date }) => {
        console.log("addExpense tool : ", title, amount, date)
    }
    , {
        name: "addExpense",
        description: "Add the given expense to the database.",
        schema: z.object({
            title: z.string().describe("Title of the expense"),
            amount: z.number().describe("Expense Amount"),
            date: z.string().describe("Expense Date in dd/mm/yyyy in IST"),
        }),
    });
const getExpense = tool(
    ({ date }) => {
        console.log("getExpense tool : ", date)
    }
    , {
        name: "getExpense",
        description: "Get all the expenses from the database.",
        schema: z.object({
            date: z.string().describe("Expense Date in dd/mm/yyyy in IST"),
        }),
    });
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
export const toolsByName: Record<string, typeof add | typeof multiply | typeof getExpense | typeof addExpense> = {
    [addExpense.name]: addExpense,
    [add.name]: add,
    [multiply.name]: multiply,
    [getExpense.name]: getExpense,
};
const tools = Object.values(toolsByName);
export const modelWithTools = model.bindTools(tools);
