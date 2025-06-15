import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateQuestions(dream: string): Promise<string[]> {
  const prompt = `
You are Freud. A user tells you their dream: "${dream}"
Generate 5 simple yes/no or short-answer questions to ask the user, to better interpret their dream.
Output only questions in a JSON array, e.g. ["Is this dream recent?", "Did you feel scared?"]
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: prompt }],
  });

  const questionsRaw = response.choices[0].message?.content || '[]';
  return JSON.parse(questionsRaw);
}

export async function interpretDream(dream: string, answers: string[], questions: string[]): Promise<string> {
  const questionAnswerPairs = questions
    .map((q, i) => `Q: ${q}\nA: ${answers[i] || ''}`)
    .join('\n');

  const prompt = `
You are Freud. Here is a dream and the user's answers to your questions.

Dream: "${dream}"

User's answers:
${questionAnswerPairs}

Give a clear, step-by-step Freudian interpretation of the dream. Use simple language. in detailed manner.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0].message?.content || 'No interpretation found.';
}
