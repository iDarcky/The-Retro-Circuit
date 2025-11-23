import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, Review } from "../types";

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
        temperature: 0.4, 
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

/**
 * Generates a 'Game of the Week' article.
 */
export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData | null> => {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        developer: { type: Type.STRING },
        year: { type: Type.STRING },
        genre: { type: Type.STRING },
        content: { type: Type.STRING, description: "A 300-word engaging article about the game's mechanics and history." },
        whyItMatters: { type: Type.STRING, description: "A concise bullet point explanation of why this game is significant." }
      },
      required: ['title', 'developer', 'year', 'genre', 'content', 'whyItMatters']
    };
  
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: "Choose a highly influential retro video game from the 1980s or 1990s. Write a 'Game of the Week' feature for it.",
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.9,
        }
      });
  
      const text = response.text;
      if (!text) return null;
      return JSON.parse(text) as GameOfTheWeekData;
    } catch (error) {
      console.error("Failed to fetch Game of the Week:", error);
      return null;
    }
};

/**
 * Generates timeline events for consoles.
 */
export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            year: { type: Type.STRING },
            name: { type: Type.STRING },
            manufacturer: { type: Type.STRING },
            description: { type: Type.STRING, description: "A very brief 15-20 word description." }
        },
        required: ['year', 'name', 'manufacturer', 'description']
      }
    };
  
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: "List 12 major home video game consoles released between 1972 and 2001. Sort them chronologically.",
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.2,
        }
      });
  
      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as TimelineEvent[];
    } catch (error) {
      console.error("Timeline error:", error);
      return [];
    }
};

/**
 * Generates fake reviews for a given topic to populate the UI.
 */
export const fetchInitialReviews = async (topic: string): Promise<Review[]> => {
    const schema: Schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                author: { type: Type.STRING },
                rating: { type: Type.INTEGER },
                text: { type: Type.STRING },
                date: { type: Type.STRING },
                verified: { type: Type.BOOLEAN }
            },
            required: ['id', 'author', 'rating', 'text', 'date', 'verified']
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate 3 diverse, short user reviews for ${topic || "Retro Gaming"}. Ratings should vary.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
            }
        });
        const text = response.text;
        if(!text) return [];
        return JSON.parse(text) as Review[];
    } catch (e) {
        return [];
    }
}

/**
 * Checks if content is safe. Returns true if safe, false if not.
 */
export const moderateContent = async (text: string): Promise<boolean> => {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Is the following review text appropriate for a general audience gaming website? It should not contain hate speech, excessive profanity, or spam. Text: "${text}". Answer strict JSON boolean { "safe": true/false }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { safe: { type: Type.BOOLEAN } },
                    required: ['safe']
                }
            }
        });
        const res = JSON.parse(response.text || "{}");
        return res.safe === true;
    } catch (e) {
        console.error("Moderation error", e);
        return false; // Fail safe
    }
}
