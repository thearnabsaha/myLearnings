import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { ChatGroq } from "@langchain/groq"
import { TavilySearch } from "@langchain/tavily";
import { prisma } from './lib/prisma';
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

const addExpense = tool(async ({ amount, description, category, date, userId }) => {
    await prisma.expense.create({
        data: {
            amount: amount,
            description: description,
            category: category,
            date: new Date(date),
            user: {
                connect: { id: userId }
            }
        }
    })
}, {
    name: "addExpense",
    description: "add new expense to database",
    schema: z.object({
        amount: z.number().describe("Expense Amount"),
        description: z.string().describe("Expense Description"),
        category: z.string().describe("Expense Catagory"),
        date: z.string().describe("Expense Date"),
        userId: z.string().describe("User ID"),
    }),
});
// export const a = async () => {
//     const results = await prisma.expense.findMany({
//         where: {
//             userId: "cmmzesrtw00002m8uth4n32t2"
//         }
//     })
//     console.log(results)
// }
const getExpense = tool(async ({ userId }) => {
    const results = await prisma.expense.findMany({
        where: {
            userId: userId
        }
    })
    // console.log(results)
    return JSON.stringify(results)
}, {
    name: "getExpense",
    description: "finds all expenses from database",
    schema: z.object({
        userId: z.string().describe("User ID"),
    }),
});
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
    [addExpense.name]: addExpense,
    [getExpense.name]: getExpense,
    // [multiply.name]: multiply,
    // [divide.name]: divide,
};
const tools = Object.values(toolsByName);
export const modelWithTools = model.bindTools(tools);