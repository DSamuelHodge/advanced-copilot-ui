import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize safe client
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are an expert Frontend Engineer and UI/UX Designer. 
Your task is to generate high-quality, modern, and responsive React components using Tailwind CSS.

RULES:
1. Always output the full code for a single file React component.
2. Use 'lucide-react' for icons. Import them like: import { IconName } from 'lucide-react';
3. Use Tailwind CSS for all styling.
4. If the user asks for a specific UI (like a landing page, dashboard, card), generate the complete functional code.
5. Wrap your code strictly in a \`\`\`tsx code block.
6. Do not omit code for brevity; provide the full working component.
`;

export const streamMessageToGemini = async function* (
  prompt: string, 
  model: GeminiModel,
  history: {role: string, parts: {text: string}[]}[]
): AsyncGenerator<string> {
  // Simulation mode if no key provided
  if (!apiKey) {
    const simulatedResponse = "I'm in UI Demo mode because no API key was found. I would normally process your request: \"" + prompt + "\". The UI is fully interactive! I can simulate code generation, reasoning, and conversations as if I were streaming from the server.";
    const chunks = simulatedResponse.split(' ');
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
      yield chunk + " ";
    }
    return;
  }

  try {
    const response = await ai.models.generateContentStream({
      model: model,
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: h.parts
        })),
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "Sorry, I encountered an error connecting to the AI service. Please check your API Key.";
  }
};