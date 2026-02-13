import { ChatGroq } from "@langchain/groq";

export const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0
});