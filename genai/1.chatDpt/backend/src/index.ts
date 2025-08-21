import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3001;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { Groq } from 'groq-sdk';
import { tavily } from "@tavily/core";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

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

import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const messages: ChatCompletionMessageParam[] = [
    {
        role: "system",
        content: "You are a helpful assistant.",
    },
    {
        role: "user",
        content: "hello",
    },
];
export const getGroqChatCompletion = async () => {
    return groq.chat.completions.create({
        messages: messages,
        model: "openai/gpt-oss-20b",
    });
};

app.get('/', async (req, res) => {
    const completion = await getGroqChatCompletion();
    console.log(completion.choices[0]?.message?.content || "");
    res.send('hello from simple server :)');
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));