// OllamaEmbeddings.ts
import axios from "axios";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";

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
