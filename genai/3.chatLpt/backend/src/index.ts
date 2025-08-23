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
import { generator } from './generator';
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

app.post('/chat', async (req, res) => {
    const inputMessage = req.body.inputMessage as string
    const threadId = req.body.threadId as string
    const answer = await generator(inputMessage, threadId)
    res.send(answer);
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));


