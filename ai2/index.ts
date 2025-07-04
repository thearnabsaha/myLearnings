import express, { json } from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { OpenAI } from 'openai';
import axios from 'axios';

const morganFormat = ':method :url :status :response-time ms';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
app.use(morgan(morganFormat));
app.use(helmet());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('hello from simple server :)');
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
const OLLAMA_GEMMA_HOST = 'http://localhost:11434';
const pullGemmaModel = async () => {
    try {
        await axios.post(`${OLLAMA_GEMMA_HOST}/api/pull`, {
            name: 'gemma3:1b',
        });
        console.log('✅Gemma Model pulled successfully');
    } catch (error) {
        console.error('❌ Error pulling model:', (error as any).message);
    }
};
const pullEmbeddingModel = async () => {
    try {
        await axios.post(`${OLLAMA_GEMMA_HOST}/api/pull`, {
            name: 'nomic-embed-text',
        });
        console.log('✅Embedding Model pulled successfully');
    } catch (error) {
        console.error('❌ Error pulling model:', (error as any).message);
    }
};
pullGemmaModel();
pullEmbeddingModel()


const ArnabPdf ="./Arnab_CV_2.pdf"
const loader = new PDFLoader(ArnabPdf);
app.get('/chat', async (req, res) => {
  const docs = await loader.load();
  docs[0];
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));