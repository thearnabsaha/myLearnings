import express, { json } from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import axios from 'axios';
import { QdrantClient } from "@qdrant/js-client-rest";
import crypto from 'crypto'
const morganFormat = ':method :url :status :response-time ms';

import { pullEmbeddingModel, pullGemmaModel } from './models';
import { Embedder, Loader, Splitter } from './rag1';
import { COLLECTION_NAME, OLLAMA_HOST } from './config';
import { ensureCollection, qdrant } from './db';
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
});

pullGemmaModel();
pullEmbeddingModel()

app.get('/chat', async (req, res) => {
  await ensureCollection()
  const pdfAfterLoading = await Loader("./a.pdf")
  const pdfAfterSpliting = await Splitter(pdfAfterLoading)
  const pdfAfterEmbedding = await Promise.all(
    pdfAfterSpliting.map(async (doc) => ({
      id: crypto.randomUUID(),
      vector: await Embedder(doc.pageContent),
      payload: {
        text: doc.pageContent,
      }
    })))
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: pdfAfterEmbedding,
  })
  console.log("Saved to DB")
  res.json({ count: pdfAfterEmbedding.length, preview: pdfAfterEmbedding.slice(0, 3) });
});
app.get("/ask", async (req, res) => {
  try {
    const query = req.query.q as string
    const queryVector = await Embedder(query)
    const search = await qdrant.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: 5,
      with_payload: true
    })
    const results = search.map((e) => e.payload?.text)
    const chatRes = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: "gemma3:1b",
      messages: [
        { role: "system", content: "Answer using the provided context below." },
        { role: "user", content: `Context:\n${results.join("\n---\n")}\n\nQuestion: ${query}` },
      ],
      stream:false
    });
    console.log({ query, answer:chatRes.data.message.content })
    res.json({ query,answer:chatRes.data.message.content })
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.listen(port, () => console.log('> Server is up and running on port: ' + port));