import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";
const checkpointer = new MemorySaver();
export const generator = async (question: string, threadId: string) => {
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0,
    });
    const search = new TavilySearch({
        maxResults: 5,
        topic: "general",
    });
    const agent = createReactAgent({
        llm: model,
        tools: [search],
        checkpointer
    });

    const system_prompt = `You are a personal assistent, who answers the asked questions. give answers in text only
                    Current date and time is: ${new Date().toUTCString()}
                    You have access to following tools:
                    1. webSearch({query}:{query:string}) //Search the latest information and the realtime data on the internet
                    `
    const result = await agent.invoke({
        messages: [
            {
                role: "system",
                content: system_prompt,
            },
            {
                role: "user",
                content: question,
            },
        ],
    }, { configurable: { thread_id: threadId } });
    return result.messages[result.messages.length - 1].lc_kwargs.content
}