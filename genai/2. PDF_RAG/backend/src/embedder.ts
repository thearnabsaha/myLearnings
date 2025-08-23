import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
});

const pinecone = new PineconeClient();
// Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
export const embedder = async () => {
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
        maxConcurrency: 5,
        // You can pass a namespace here too
        // namespace: "foo",
    });
}