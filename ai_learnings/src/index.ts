import { interpretEmotion } from './interpretEmotion';

async function main() {
  const dream = "I was running in school corridors.";
  const result = await interpretEmotion(dream);
  console.log("🌙 Emotional Interpretation:\n", result);
}

main();
