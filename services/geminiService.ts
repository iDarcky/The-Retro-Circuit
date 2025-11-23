import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NewsItem, ComparisonResult } from "../types";

// Initialize the client. API_KEY is guaranteed to be in process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

/**
 * Generates retro gaming news summaries.
 */
export const fetchRetroNews = async (): Promise<NewsItem[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        date: { type: Type.STRING, description: "A date relevant to the event (e.g., 'Nov 1990')" },
        summary: { type: Type.STRING },
        category: { type: Type.STRING, enum: ['Hardware', 'Software', 'Industry', 'Rumor'] }
      },
      required: ['headline', 'date', 'summary', 'category']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Generate 4 distinct, interesting, and historically accurate news snippets about retro gaming (1970s-2000s). Treat them as if they are fresh reports from that era or retrospective facts.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as NewsItem[];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
};

/**
 * Compares two consoles.
 */
export const compareConsoles = async (consoleA: string, consoleB: string): Promise<ComparisonResult | null> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      consoleA: { type: Type.STRING },
      consoleB: { type: Type.STRING },
      summary: { type: Type.STRING, description: "A brief 2-sentence summary of the rivalry." },
      points: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            feature: { type: Type.STRING, description: "The technical spec or category being compared (e.g. CPU, Audio, Best Game)" },
            consoleAValue: { type: Type.STRING },
            consoleBValue: { type: Type.STRING },
            winner: { type: Type.STRING, enum: ['A', 'B', 'Tie'] }
          },
          required: ['feature', 'consoleAValue', 'consoleBValue', 'winner']
        }
      }
    },
    required: ['consoleA', 'consoleB', 'summary', 'points']
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Compare the ${consoleA} and the ${consoleB}. Focus on technical specs, library quality, and historical impact.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, // Lower temperature for factual comparisons
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ComparisonResult;
  } catch (error) {
    console.error("Failed to compare consoles:", error);
    return null;
  }
};

/**
 * Chat with the Retro Sage.
 */
export const sendChatMessage = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: modelName,
      messages: history,
      config: {
        systemInstruction: "You are the 'Retro Sage', a wise, nostalgic, and slightly 80s-cyberpunk style AI entity living inside the Retro Circuit mainframe. You know everything about video game history from 1970 to 2005. Keep answers concise, fun, and use occasional retro-slang (like 'rad', 'tubular', 'blast processing')."
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Connection to the mainframe interrupted...";
  } catch (error) {
    console.error("Chat error:", error);
    return "The mainframe is experiencing heavy traffic. Try again.";
  }
};
