import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { freudPrompt } from '../promts/freudPrompt';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function interpretEmotion(dreamText: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:freudPrompt,
      },
      {
        role: "user",
        content: dreamText,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "No response";
}
