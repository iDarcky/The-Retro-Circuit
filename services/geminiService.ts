import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, Review } from "../types";

// Initialize the Google GenAI client
// The API key is obtained from the environment variable process.env.API_KEY
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const isAiAvailable = !!apiKey;

// Fallback Data
const FALLBACK_NEWS: NewsItem[] = [
    {
      headline: "Nintendo PlayStation Prototype Discovered",
      date: "Aug 2015",
      summary: "A rare prototype of the SNES-CD add-on, developed in partnership with Sony, has reportedly been found in a box of old junk.",
      category: "Hardware"
    },
    {
      headline: "Sega Announces 'Project Mars' (32X)",
      date: "Jan 1994",
      summary: "In a bid to extend the Genesis lifecycle, Sega has unveiled the 32X add-on. Critics question if this stop-gap measure can compete with upcoming dedicated 32-bit consoles.",
      category: "Hardware"
    },
    {
      headline: "Square Soft to Abandon Nintendo for Sony?",
      date: "Jan 1996",
      summary: "Rumors are swirling that RPG giant Square may be moving development of Final Fantasy VII to Sony's PlayStation, citing cartridge storage limitations on the N64.",
      category: "Industry"
    },
    {
      headline: "Mortal Kombat Senate Hearings",
      date: "Dec 1993",
      summary: "The US Senate has launched hearings on video game violence, with Mortal Kombat and Night Trap taking center stage. A ratings board creation seems imminent.",
      category: "Industry"
    }
];

/**
 * Returns retro gaming news using Gemini to generate dynamic content.
 */
export const fetchRetroNews = async (): Promise<NewsItem[]> => {
  if (!isAiAvailable) return FALLBACK_NEWS;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate 4 interesting retro gaming news headlines from the 80s and 90s. Include a mix of Hardware, Software, Industry, and Rumor categories.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              date: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ['headline', 'date', 'summary', 'category']
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as NewsItem[];
    }
  } catch (error) {
    console.error("Failed to fetch news from AI:", error);
  }
  return FALLBACK_NEWS;
};

/**
 * Compares two consoles using Gemini Pro for reasoning.
 */
export const compareConsoles = async (consoleA: string, consoleB: string): Promise<ComparisonResult | null> => {
  if (!isAiAvailable) {
    // Basic fallback logic for demo purposes if AI is missing
    return {
        consoleA: consoleA,
        consoleB: consoleB,
        summary: "Offline Mode: AI analysis unavailable. Please check API Key configuration.",
        points: []
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Compare the video game consoles "${consoleA}" and "${consoleB}". Provide a technical and historical comparison.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            consoleA: { type: Type.STRING },
            consoleB: { type: Type.STRING },
            summary: { type: Type.STRING },
            points: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  consoleAValue: { type: Type.STRING },
                  consoleBValue: { type: Type.STRING },
                  winner: { type: Type.STRING, description: "Must be 'A', 'B', or 'Tie'" }
                },
                required: ['feature', 'consoleAValue', 'consoleBValue', 'winner']
              }
            }
          },
          required: ['consoleA', 'consoleB', 'summary', 'points']
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as ComparisonResult;
    }
  } catch (error) {
    console.error("Comparison failed:", error);
  }
  return null;
};

/**
 * Chat with Retro Sage (Gemini Flash).
 */
export const sendChatMessage = async (history: any[], newMessage: string): Promise<string> => {
  if (!isAiAvailable) return "COMMUNICATION ERROR: SYSTEM OFFLINE.";

  try {
    // Ensure history is in the correct format for Gemini
    // RetroSage history: { role: string, parts: [{ text: string }] }[]
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: newMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are the Retro Sage, a wise AI knowledgeable about 8-bit, 16-bit, and 32-bit video game history. Speak in a slightly robotic but helpful retro manner. Keep answers concise."
      }
    });

    return response.text || "I am unable to process that query.";
  } catch (error) {
    console.error("Chat failed:", error);
    return "SIGNAL LOST.";
  }
};

/**
 * Returns Game of the Week (Mock/Static fallback preferred for consistency, but can be AI).
 */
export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData> => {
    // Keep this static or use AI to rotate. Let's use AI for variety if available.
    if (isAiAvailable) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Pick a random classic video game (8-bit to 32-bit era) as Game of the Week. Provide detailed info.",
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            developer: { type: Type.STRING },
                            year: { type: Type.STRING },
                            genre: { type: Type.STRING },
                            content: { type: Type.STRING },
                            whyItMatters: { type: Type.STRING }
                        },
                        required: ['title', 'developer', 'year', 'genre', 'content', 'whyItMatters']
                    }
                }
            });
            if (response.text) return JSON.parse(response.text);
        } catch (e) {
            console.warn("AI GOTW failed, using fallback.");
        }
    }

    return {
        title: "Chrono Trigger",
        developer: "Square",
        year: "1995",
        genre: "JRPG",
        content: "Chrono Trigger is widely regarded as one of the greatest video games of all time. Developed by a 'Dream Team' consisting of Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest), and Akira Toriyama (Dragon Ball), it redefined the RPG genre.\n\nThe game follows Crono and his friends as they travel through time to prevent a global catastrophe caused by Lavos.",
        whyItMatters: "Introduced New Game+, multiple endings, and seamless battles without random encounters on a separate screen."
    };
};

/**
 * Returns timeline events (Mock data is better for strict historical timeline consistency).
 */
export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    return [
        { year: "1972", name: "Magnavox Odyssey", manufacturer: "Magnavox", description: "The first commercial home video game console. It was analog, battery-powered, and used overlays on the TV screen." },
        { year: "1977", name: "Atari 2600", manufacturer: "Atari", description: "Popularized the use of microprocessor-based hardware and ROM cartridges containing game code." },
        { year: "1983", name: "The Video Game Crash", manufacturer: "Industry Wide", description: "Oversaturation of the market with low-quality games led to a massive recession in the video game industry." },
        { year: "1985", name: "NES (North America)", manufacturer: "Nintendo", description: "Single-handedly revitalized the US video game market with the release of Super Mario Bros." },
        { year: "1989", name: "Game Boy", manufacturer: "Nintendo", description: "Defined portable gaming for a decade, proving battery life and library matter more than color screens." },
        { year: "1994", name: "PlayStation", manufacturer: "Sony", description: "Marked Sony's dominance in the market and the transition from cartridges to CD-ROMs as the standard." },
        { year: "1996", name: "Nintendo 64", manufacturer: "Nintendo", description: "Pioneered true 3D gaming with the analog stick, though it stuck to cartridges." }
    ];
};

/**
 * Returns reviews (Mock).
 */
export const fetchInitialReviews = async (topic: string): Promise<Review[]> => {
    return [
        { id: "1", author: "RetroGamer99", rating: 5, text: "An absolute masterpiece that defines the genre. The controls are tight and the music is unforgettable.", date: "1998", verified: true },
        { id: "2", author: "BitCruncher", rating: 4, text: "Graphics are amazing for the time, though the framerate dips occasionally.", date: "1999", verified: false },
        { id: "3", author: "CartridgeBlower", rating: 5, text: "I spent my entire summer vacation playing this. Best money I ever spent.", date: "1997", verified: true }
    ];
};

/**
 * Content Moderation using Gemini.
 */
export const moderateContent = async (text: string): Promise<boolean> => {
    if (!isAiAvailable) return true;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Evaluate if the following text contains hate speech, explicit content, or severe toxicity. Text: "${text}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { isSafe: { type: Type.BOOLEAN } },
                    required: ['isSafe']
                }
            }
        });
        
        if (response.text) {
            const result = JSON.parse(response.text);
            return result.isSafe;
        }
    } catch (e) {
        console.error("Moderation check failed", e);
    }
    return true; // Default to allow if check fails
};