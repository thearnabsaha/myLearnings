import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import { freudPrompt } from "../promts/freudPrompt";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const messages: { role: string; content: string }[] = [
  {
    role: "system",
    content: freudPrompt,
  },
];

export async function interpretEmotion2(
  dreamText: string,
  userAnswers?: string
): Promise<string> {
  if (messages.length === 1) {
    messages.push({
      role: "user",
      content: `${dreamText}\n\nPlease ask me 2-3 clarifying questions about my dream before giving your full interpretation.`,
    });
  } else if (userAnswers) {
    messages.push({
      role: "user",
      content: `${userAnswers}\n\nNow, please provide your detailed Freudian interpretation based on the dream and my answers.`,
    });
  } else {
    throw new Error("You must provide userAnswers after the first call.");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  const response = completion.choices[0]?.message?.content ?? "No response";

  messages.push({
    role: "assistant",
    content: response,
  });

  return response;
}
