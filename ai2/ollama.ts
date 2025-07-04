import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { OpenAI } from 'openai';
import axios from 'axios';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan(':method :url :status :response-time ms'));
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

const OLLAMA_HOST = 'http://localhost:11434';
// Pull the model (ideally done once when starting up)
const pullModel = async () => {
    try {
        await axios.post(`${OLLAMA_HOST}/api/pull`, {
            name: 'gemma3:1b',
        });
        console.log('✅ Model pulled successfully');
    } catch (error) {
        console.error('❌ Error pulling model:', (error as any).message);
    }
};
pullModel();
app.get('/chat', async (req, res) => {
    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
        model: 'gemma3:1b',
        messages: [{ role: 'user', content: "what is the weather there in mumbai" }],
        stream: false
    });
    //   const response1 = await axios.post(`${OLLAMA_HOST}/api/chat`, {
    //   model: 'gemma3:1b',
    //   messages: [{ role: 'user', content: query }],
    // });
    console.log(response.data.message.content)
    res.status(200).json(response.data.message.content);
    // res.status(200).json(response1);
});

app.listen(port, () => console.log(`> Server running on port ${port}`));
