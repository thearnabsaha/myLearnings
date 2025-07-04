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
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
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
const OLLAMA_HOST = 'http://localhost:11434';
const pullGemmaModel = async () => {
  try {
    await axios.post(`${OLLAMA_HOST}/api/pull`, {
      name: 'gemma3:1b',
    });
    console.log('✅Gemma Model pulled successfully');
  } catch (error) {
    console.error('❌ Error pulling model:', (error as any).message);
  }
};
const pullEmbeddingModel = async () => {
  try {
    await axios.post(`${OLLAMA_HOST}/api/pull`, {
      name: 'nomic-embed-text',
    });
    console.log('✅Embedding Model pulled successfully');
  } catch (error) {
    console.error('❌ Error pulling model:', (error as any).message);
  }
};

pullGemmaModel();
pullEmbeddingModel()

const Loader = async () => {
  const ArnabPdf = "./Arnab_CV_2.pdf"
  const loader = new PDFLoader(ArnabPdf);
  const docs = await loader.load();
  return docs
}
const Splitter = async (document: any) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(document);
  return splitDocs;
}
const Embedder = async (document: any) => {
  const response = await axios.post(`${OLLAMA_HOST}/api/embeddings`, {
    model: "nomic-embed-text",
    prompt: document
  })
  return response.data.embedding
}
const qdrant = new QdrantClient({ url: "http://localhost:6333" });

const COLLECTION_NAME = "arnab_docs";
async function ensureCollection() {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.find((c) => c.name === COLLECTION_NAME);
  if (!exists) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768, // nomic-embed-text output size
        distance: "Cosine",
      },
    });
    console.log("Qdrant collection created");
  }
}
app.get('/chat', async (req, res) => {
  await ensureCollection()
  const pdfAfterLoading = await Loader()
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
        // { role: "system", content: "You are a smart Interviewer AI Assistent! Ask interview 10 question using the provided context below." },
        // { role: "user", content: `Context:\n${results.join("\n---\n")}` },
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