import axios from "axios";
import { OLLAMA_HOST } from "./config";

export const pullGemmaModel = async () => {
  try {
    await axios.post(`${OLLAMA_HOST}/api/pull`, {
      name: 'gemma3:1b',
    });
    console.log('✅Gemma Model pulled successfully');
  } catch (error) {
    console.error('❌ Error pulling model:', (error as any).message);
  }
};
export const pullEmbeddingModel = async () => {
  try {
    await axios.post(`${OLLAMA_HOST}/api/pull`, {
      name: 'nomic-embed-text',
    });
    console.log('✅Embedding Model pulled successfully');
  } catch (error) {
    console.error('❌ Error pulling model:', (error as any).message);
  }
};
