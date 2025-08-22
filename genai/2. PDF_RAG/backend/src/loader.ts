import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
export const pdfLoader = async (pathOfPDF: any) => {
    const pdfPath = path.resolve(__dirname, pathOfPDF);
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    console.log(docs[0])
    return docs
}