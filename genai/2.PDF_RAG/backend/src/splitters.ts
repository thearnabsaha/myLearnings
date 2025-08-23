import { CharacterTextSplitter } from "@langchain/textsplitters";
export const PdfSpiltter = async (document: any) => {
    const textSplitter = new CharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });
    const texts = await textSplitter.splitText(document);
    return texts
}
