import axios from "axios";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OLLAMA_HOST } from "./config";

export const Loader = async (pdf:any) => {
  const ArnabPdf = pdf
  const loader = new PDFLoader(ArnabPdf);
  const docs = await loader.load();
  return docs
}
export const Splitter = async (document: any) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(document);
  return splitDocs;
}
export const Embedder = async (document: any) => {
  const response = await axios.post(`${OLLAMA_HOST}/api/embeddings`, {
    model: "nomic-embed-text",
    prompt: document
  })
  return response.data.embedding
}