// OllamaEmbeddings.ts
import axios from "axios";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { CharacterTextSplitter } from "@langchain/textsplitters";

export class OllamaEmbeddings implements EmbeddingsInterface {
    model: string;
    host: string;

    constructor(options: { model?: string; host?: string } = {}) {
        this.model = options.model ?? "nomic-embed-text";
        this.host = options.host ?? "http://localhost:11434";
    }

    async embedQuery(text: string): Promise<number[]> {
        const response = await axios.post(`${this.host}/api/embeddings`, {
            model: this.model,
            prompt: text,
        });

        return response.data.embedding; // Ollama returns { embedding: number[] }
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        return Promise.all(texts.map((t) => this.embedQuery(t)));
    }
}


export const pdfLoader = async (pathOfPDF: any) => {
    const pdfPath = path.resolve(__dirname, pathOfPDF);
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    return docs[0].pageContent
}
import { QdrantVectorStore } from "@langchain/qdrant";
// import { OllamaEmbeddings } from "./OllamaEmbeddings";
// import { OpenAIEmbeddings } from "@langchain/openai";
// const embeddings = new OpenAIEmbeddings({
//     model: "text-embedding-3-small",
// });
const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    host: process.env.OLLAMA_HOST || "http://localhost:11434",
});
export const embedder = async (chunks: any) => {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: process.env.collectionName,
    });
    const documents = chunks.map((e: any) => ({
        pageContent: e,
    }));
    await vectorStore.addDocuments(documents);
    return vectorStore
}
export const PdfSpiltter = async (document: any) => {
    const textSplitter = new CharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });
    const texts = await textSplitter.splitText(document);
    return texts
}
