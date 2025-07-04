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
import { COLLECTION_NAME, OLLAMA_HOST } from './rag1/config';
import { QdrantClient } from '@qdrant/js-client-rest';

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

const qdrant = new QdrantClient({ host: "localhost", port: 6333 });
let chatHistory = [
  {
    role: "system",
    msg: `You are Rose, an AI girlfriend who uses sweet words like dove, honey, baby, and dear. You help answer questions using document context when provided.`
  }
];

async function ensureCollection() {
  await qdrant.deleteCollection(COLLECTION_NAME)
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: {
      size: 768, // nomic-embed-text output size
      distance: "Cosine",
    },
  });
  console.log("Qdrant collection created");
}
export const Embedder = async (document: any) => {
  const response = await axios.post(`${OLLAMA_HOST}/api/embeddings`, {
    model: "nomic-embed-text",
    prompt: document
  })
  return response.data.embedding
}
const document = [
  `arnab is the full stack developer`,
  `simran is a very good girl`,
  `soham loves titi`,
  `arnab works in pwc`,
  `soham goes to gym`,
  `simran loves arnab`
]
const searchFromDocuments = async (query: string) => {
  const embededQuery = await Embedder(query)
  const search = await qdrant.search(COLLECTION_NAME, {
    vector: embededQuery,
    limit: 5,
    with_payload: true
  })
  const results = search.map((e) => e.payload?.text)
  console.log(results)
  return results
}
app.post("/load", async (req, res) => {
  await ensureCollection()
  const points = await Promise.all(
    document.map(async (e) => ({
      id: crypto.randomUUID(),
      vector: await Embedder(e),
      payload: {
        text: e,
      }
    })))
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: points,
  })
  console.log("Saved to DB")
  res.json({ points })
})
app.post('/chat', async (req, res) => {
  const { userMsg } = req.body;
  const releventInfo = await searchFromDocuments(userMsg)
  const contextText = releventInfo.join('\n---\n');
  const systemMsg = `You are Rose, an AI girlfriend who uses sweet words like dove, honey, baby, and dear.Use the following context from documents to help answer the question:\n${contextText}`;
  const promptHistory=[
    { role: 'system', msg: systemMsg },
    ...chatHistory.filter(m => m.role !== 'system'),
    { role: 'user', msg: userMsg },
  ]
  chatHistory.push({ role: "user", msg: userMsg })
  const prompt = promptHistory.map((e) => `${e.role}:${e.msg}`).join('\n')
  try {
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: 'gemma3:1b',
      prompt,
      stream: false
    });
    const aiReply = response.data.response;
    chatHistory.push({ role: "assistant", msg: aiReply })
    res.json({ response: aiReply });
    console.log(prompt)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to Gemma' });
  }
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));