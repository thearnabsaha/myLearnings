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
import { PdfSpiltter } from './splitters';
import { embedder } from './embedder';
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
const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrieved context to answer the question with text only in 2 lines. If you don't know the answer, say I don't know.`;

app.get('/1', async (req, res) => {
    try {
        const question = req.query.q
        const doc = await pdfLoader("../Arnab_CV_1.pdf")
        const spilitDoc = await PdfSpiltter(doc)
        const dbData = await embedder(spilitDoc)
        const relevantChunks = await dbData.similaritySearch(question as string, 3);
        const context = relevantChunks.map((chunk) => chunk.pageContent).join('\n\n');
        const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer:`;
        const completion = await groq.chat.completions.create({
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: userQuery,
                },
            ],
            model: "openai/gpt-oss-20b",
        });
        res.send(completion.choices[0].message.content)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});
app.listen(port, () => console.log('> Server is up and running on port: ' + port));


