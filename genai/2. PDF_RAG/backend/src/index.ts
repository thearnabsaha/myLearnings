import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3002;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { Groq } from 'groq-sdk';
import { tavily } from "@tavily/core";
import { pdfLoader } from './loader';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors());


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
//TOOL_CALLING 1
let messages = [
    {
        role: "system",
        content: `You are a personal assistent, who answers the asked questions.
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

app.get('/1', async (req, res) => {
    pdfLoader("../Arnab_CV_1.pdf")
    res.send("hi")
});
app.post('/chat', async (req, res) => {
    console.log(messages)
    const inputMessage = req.body.inputMessage
    console.log(inputMessage)
    messages.push({
        role: "user",
        content: inputMessage as string
    })
    let answer;
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
            answer = completion.choices[0]?.message?.content
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
    res.send(answer);
});

app.get('/health', async (req, res) => {
    const start = Date.now();
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date(),
        responseTime: `${Date.now() - start}ms`,
    };
    res.status(200).json(healthcheck);
});
app.get('/reset', async (req, res) => {
    messages = [
        {
            role: "system",
            content: `You are a personal assistent, who answers the asked questions.
                    Current date and time is: ${new Date().toUTCString()}
                    You have access to following tools:
                    1. webSearch({query}:{query:string}) //Search the latest information and the realtime data on the internet
                    `
        },
    ]
    res.status(200).json("reset");
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));


