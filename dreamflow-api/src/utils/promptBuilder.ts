export function buildDreamPrompt(history: string[], userInput: string): string {
  const joinedHistory = history.join('\n');

  return `
You are an intelligent dream analysis chatbot. 
You're in an ongoing chat where the user describes their dream. Ask context-relevant questions.
They can also change their dream at any point. Always respond in a conversational tone.

History so far:
${joinedHistory}

User just said:
"${userInput}"

Respond with the next appropriate question or reflection.
`;
}
