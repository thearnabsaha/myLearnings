import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { pullEmbeddingModel, pullGemmaModel } from './rag1/models';
import axios from 'axios';
import { OLLAMA_HOST } from './rag1/config';

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
})
pullGemmaModel();
pullEmbeddingModel()

// 
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: 'gemma3:1b',
      prompt,
      stream: false
    });

    res.json({ response: response.data.response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to Gemma' });
  }
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));