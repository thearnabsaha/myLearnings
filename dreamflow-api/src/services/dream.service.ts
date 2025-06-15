import openai from '../config/openai';
import { buildDreamPrompt } from '../utils/promptBuilder';

const userSessions = new Map<string, string[]>(); // In-memory session for now

export async function handleDreamInput(userId: string, userInput: string): Promise<string> {
  const history = userSessions.get(userId) || [];
  history.push(`User: ${userInput}`);

  const prompt = buildDreamPrompt(history, userInput);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: 'You are a helpful dream interpretation assistant.' },
               { role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const reply = response.choices[0].message.content || '';
  history.push(`AI: ${reply}`);
  userSessions.set(userId, history);

  return reply;
}

export function getDreamHistory(userId: string): string[] {
  return userSessions.get(userId) || [];
}

export function resetDreamSession(userId: string) {
  userSessions.delete(userId);
}
