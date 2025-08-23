import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
});
export const generator = async (question: string) => {
    const aiMsg = await llm.invoke([
        {
            role: "system",
            content:
                "You are a helpful assistant who talks to me.",
        },
        { role: "user", content: question },
    ]);
    return aiMsg.lc_kwargs.content
}