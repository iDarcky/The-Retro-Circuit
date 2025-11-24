import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, Review } from "../types";
import { supabase } from "./supabaseClient";

/**
 * Checks if the connection to Supabase is working
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('news').select('count', { count: 'exact', head: true });
        if (error && (error.code === 'PGRST301' || error.message.includes('fetch'))) {
            console.error("DB Connection Check Failed:", error);
            return false;
        }
        return true;
    } catch (e) {
        console.error("DB Connection Exception:", e);
        return false;
    }
};

/**
 * AUTHENTICATION SERVICE
 */
export const retroAuth = {
    signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (email: string, password: string) => {
        // Dynamically redirect to the current domain (works for both localhost and production)
        const redirectTo = window.location.origin;
        return await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: redirectTo
            }
        });
    },
    signOut: async () => {
        return await supabase.auth.signOut();
    },
    getUser: async () => {
        const { data } = await supabase.auth.getUser();
        return data.user;
    }
};

/**
 * Returns retro gaming news from Supabase
 */
export const fetchRetroNews = async (): Promise<NewsItem[]> => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as NewsItem[]) || [];
  } catch (err) {
    console.error("Error fetching news:", err);
    throw err; 
  }
};

/**
 * Inserts a new news item into Supabase
 */
export const addNewsItem = async (item: NewsItem): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('news')
            .insert([{
                headline: item.headline,
                summary: item.summary,
                category: item.category,
                date: item.date || new Date().toISOString()
            }]);

        if (error) {
            console.error("Error inserting news:", error);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Exception adding news:", err);
        return false;
    }
};

/**
 * Returns Game of the Week from Supabase
 */
export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData | null> => {
  try {
    const { data, error } = await supabase
      .from('game_of_the_week')
      .select('*')
      .limit(1)
      .single();

    if (error) {
        console.error("Supabase error fetching GOTW:", error);
        return null;
    }
    
    return {
        title: data.title,
        developer: data.developer,
        year: data.year,
        genre: data.genre,
        content: data.content,
        whyItMatters: data.why_it_matters
    };
  } catch (err) {
    console.error("Error fetching GOTW:", err);
    return null;
  }
};

/**
 * Returns timeline events from Supabase
 */
export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    try {
        const { data, error } = await supabase
            .from('timeline')
            .select('*')
            .order('year', { ascending: true });
        
        if (error) throw error;
        return (data as TimelineEvent[]) || [];
    } catch (err) {
        console.error("Error fetching timeline:", err);
        return [];
    }
};

/**
 * Fetches reviews from Supabase
 */
export const fetchInitialReviews = async (topic: string): Promise<Review[]> => {
  try {
      let query = supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
      
      if (topic && topic !== 'ALL REVIEWS') {
        query = query.ilike('text', `%${topic}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data as Review[]) || [];
  } catch (err) {
      console.error("Error fetching reviews:", err);
      return [];
  }
};

/**
 * Submits a new review to Supabase
 */
export const submitReviewToDB = async (review: Review): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('reviews')
            .insert([
                {
                    author: review.author,
                    rating: review.rating,
                    text: review.text,
                    date: review.date,
                    verified: review.verified
                }
            ]);
        
        if (error) {
            console.error("Supabase Insert Error:", error);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Submit Exception:", err);
        return false;
    }
};

/**
 * Compares two consoles (Placeholder for now)
 */
export const compareConsoles = async (consoleA: string, consoleB: string): Promise<ComparisonResult | null> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    consoleA: consoleA || "Sega Genesis",
    consoleB: consoleB || "Super Nintendo",
    summary: "Mock Comparison: Real comparison requires Gemini API Key or populated 'consoles' database table.",
    points: [
      { feature: "CPU Speed", consoleAValue: "7.6 MHz (68000)", consoleBValue: "3.58 MHz (65816)", winner: "A" },
      { feature: "Colors on Screen", consoleAValue: "61 Colors", consoleBValue: "256 Colors", winner: "B" },
      { feature: "Sound Chip", consoleAValue: "Yamaha YM2612 (FM)", consoleBValue: "Sony SPC700 (Sample)", winner: "B" },
      { feature: "Resolution", consoleAValue: "320 x 224", consoleBValue: "256 x 224", winner: "A" },
      { feature: "Best Selling Game", consoleAValue: "Sonic the Hedgehog", consoleBValue: "Super Mario World", winner: "Tie" }
    ]
  };
};

/**
 * Chat with Retro Sage (Placeholder)
 */
export const sendChatMessage = async (history: any[], newMessage: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "SYSTEM: PLEASE CONFIGURE GEMINI API KEY TO ENABLE AI SAGE.";
};

/**
 * Moderates content
 */
export const moderateContent = async (text: string): Promise<boolean> => {
  const badWords = ['badword', 'spam', 'virus'];
  const hasBadWord = badWords.some(word => text.toLowerCase().includes(word));
  return !hasBadWord;
};