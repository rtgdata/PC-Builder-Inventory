import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

// IMPORTANT: This key is managed externally. Do not modify.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const getAi = () => {
    if (!API_KEY) return null;
    return new GoogleGenAI({ apiKey: API_KEY });
}

export const generatePCName = async (components: Product[]): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        return `Custom Build ${new Date().toLocaleDateString()}`;
    }

    const componentList = components.map(c => `- ${c.name} (${c.category})`).join('\n');
    const prompt = `
      Based on the following list of high-end computer components, generate a single, cool, and marketable name for the finished PC build.
      The name should be short, memorable, and evoke a sense of power, speed, or advanced technology.
      Do not add any explanation or preamble. Only return the name itself.

      Components:
      ${componentList}

      Example Names: "Aegis Fury", "Nova Prime", "Cerberus X", "Odyssey One", "Vortex Titan"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        // FIX: Replaced regex literal with new RegExp() to avoid potential parsing errors.
        const text = response.text.trim().replace(new RegExp('"', 'g'), ''); // Clean up response
        return text;
    } catch (error) {
        console.error("Error generating PC name with Gemini:", error);
        return `Pro Build ${new Date().toISOString().slice(0, 10)}`;
    }
};