import { QdrantClient } from "@qdrant/js-client-rest";
import { COLLECTION_NAME } from "./config";

export const qdrant = new QdrantClient({ url: "http://localhost:6333" });

export async function ensureCollection() {
    await qdrant.deleteCollection(COLLECTION_NAME);
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768, // nomic-embed-text output size
        distance: "Cosine",
      },
    });
    console.log("Qdrant collection created");
}