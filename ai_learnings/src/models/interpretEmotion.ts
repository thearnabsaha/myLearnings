import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { freudPrompt } from '../promts/freudPrompt';
import { jungPrompt } from '../promts/jungPrompt';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function interpretEmotion(dreamText: string,prompter: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:prompter=="freud"?freudPrompt:jungPrompt,
      },
      {
        role: "user",
        content: dreamText,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "No response";
}
