import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function extractTags(dreamText: string): Promise<string[]> {
  const prompt = `
    Extract up to 2-10 important keywords or symbols from the following dream text.  
    Provide only a comma-separated list of keywords, no explanations.

    Dream: """${dreamText}"""
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const tagsRaw = completion.choices[0]?.message?.content ?? "";
  return tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
}
