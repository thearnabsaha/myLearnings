import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function interpretEmotion(dreamText: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert in dream analysis. Given a short dream description, you interpret the emotional undertone and what it may reflect about the dreamer's subconscious state. Avoid symbolism, focus purely on emotions and psychological states.",
      },
      {
        role: "user",
        content: dreamText,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "No response";
}
