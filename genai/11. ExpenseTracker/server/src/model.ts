import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";

export const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY, // Default value.
    model: "llama-3.3-70b-versatile",
});
