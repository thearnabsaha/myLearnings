import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "./OllamaEmbeddings";
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