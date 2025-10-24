import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-pro",
    prompt: {
      text: "Write a short story about a robot learning to love.",
    },
    maxOutputTokens: 200,
  });

  console.log("Generated Content:", response.content.text);
}

main();
