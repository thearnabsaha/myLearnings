import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { Groq } from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
//TOOL_CALLING 1
const webSearch = async ({ query }: { query: string }) => {
    console.log("webSearch tool is getting called...")
    return `Iphone 20 was launched on 2025 31st may`
}
app.get('/1', async (req, res) => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content: `You are a personal assistent, who answers the asked questions.
                    You have access to following tools:
                    1. webSearch({query}:{query:string}) //Search the latest information and the realtime data on the internet
                    `
                },
                {
                    role: "user",
                    content: `what is the current weather in the mumbai`,
                },
            ],
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
        .then(async (chatCompletion) => {
            // console.log(chatCompletion.choices[0]?.message?.content || "");
            let toolResult;
            const toolcalls = chatCompletion.choices[0]?.message.tool_calls
            if (!toolcalls) {
                console.log(`Assistant: ${chatCompletion.choices[0]?.message?.content}`)
                return
            }
            for (const toolcall of toolcalls) {
                console.log("tool", toolcall)
                const functionName = toolcall.function.name
                const functionArguments = toolcall.function.arguments
                if (functionName === "webSearch") {
                    toolResult = await webSearch(JSON.parse(functionArguments))
                    console.log("Tool Result : ", toolResult)
                }
            }
            res.send(toolResult);
        });
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

app.listen(port, () => console.log('> Server is up and running on port: ' + port));


