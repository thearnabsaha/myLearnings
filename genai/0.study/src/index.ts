import readline from 'node:readline/promises'
import dotenv from 'dotenv';
dotenv.config();
import { Groq } from 'groq-sdk';
import { tavily } from "@tavily/core";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
let messages = [
    {
        role: "system",
        content: `You are a personal assistent, who answers the asked questions, who gives answers in one word or sentence.
                    Current date and time is: ${new Date().toUTCString()}
                    You have access to following tools:
                    1. webSearch({query}:{query:string}) //Search the latest information and the realtime data on the internet
                    `
    },

]
const webSearch = async ({ query }: { query: string }) => {
    console.log("webSearch tool is getting called...")
    const response = await tvly.search(query);
    const responseContents = response.results.map((e) => e.content).join("\n\n")
    return responseContents
}
async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    while (true) {
        let question = await rl.question("You : ")
        messages.push({
            role: "user",
            content: String(question)
        })
        if (question === "bye") {
            break;
        }
        while (true) {
            const completion = await groq.chat.completions
                .create({
                    temperature: 0,
                    //@ts-ignore
                    messages: messages,
                    model: "openai/gpt-oss-20b",
                    tools: [
                        {
                            type: "function",
                            function: {
                                name: "webSearch",
                                description: "Search the latest information and the realtime data on the internet",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        query: {
                                            type: "string",
                                            description: "The search query to perform search on"
                                        },
                                    },
                                    required: ["query"]
                                }
                            }
                        }
                    ],
                    tool_choice: "auto"
                })
            //@ts-ignore
            messages.push(completion.choices[0]?.message)
            let toolResult;
            const toolcalls = await completion.choices[0]?.message.tool_calls
            if (!toolcalls) {
                console.log("Rose :", completion.choices[0]?.message?.content)
                break;
            }
            for (const e of toolcalls) {
                const functionName = e.function.name
                const functionArguments = e.function.arguments
                if (functionName === "webSearch") {
                    toolResult = await webSearch(JSON.parse(functionArguments))
                    messages.push({
                        // @ts-ignore
                        tool_call_id: e.id,
                        role: "tool",
                        name: functionName,
                        content: toolResult
                    })
                }
            }
        }
    }
    rl.close()
}
main()
