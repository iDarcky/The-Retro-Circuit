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
    signUp: async (email: string, password: string, username: string) => {
        // Dynamically redirect to the current domain (works for both localhost and production)
        const redirectTo = window.location.origin;
        return await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: {
                    username: username,
                    full_name: username // Storing as full_name as well for broader compatibility
                }
            }
        });
    },
    resetPassword: async (email: string) => {
        const redirectTo = window.location.origin; // Redirects back to homepage, AuthSection handles the event
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo
        });
    },
    updateUserPassword: async (newPassword: string) => {
        return await supabase.auth.updateUser({ password: newPassword });
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
 * Compares two consoles using Mock Data (Offline Mode)
 */
export const compareConsoles = async (consoleA: string, consoleB: string): Promise<ComparisonResult | null> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple mock response to allow the UI to function without AI
    return {
        consoleA: consoleA,
        consoleB: consoleB,
        summary: `OFFLINE ANALYSIS: ${consoleA} and ${consoleB} are iconic systems. Connect to AI Mainframe for deeper analysis.`,
        points: [
            { feature: "Processor", consoleAValue: "8/16-bit CPU", consoleBValue: "16/32-bit CPU", winner: "Tie" },
            { feature: "Resolution", consoleAValue: "256x224", consoleBValue: "512x448", winner: "B" },
            { feature: "Sound", consoleAValue: "FM Synth", consoleBValue: "PCM Samples", winner: "Tie" },
            { feature: "Media", consoleAValue: "Cartridge", consoleBValue: "CD-ROM", winner: "Tie" }
        ]
    };
  } catch (error) {
      console.error("Comparison Error:", error);
      return null;
  }
};

/**
 * Chat with Retro Sage (Offline Mode)
 */
export const sendChatMessage = async (history: any[], newMessage: string): Promise<string> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return `[SYSTEM MESSAGE] THE RETRO SAGE IS CURRENTLY OFFLINE. I CANNOT PROCESS "${newMessage.toUpperCase()}" AT THIS TIME. PLEASE TRY AGAIN LATER.`;
  } catch (error) {
      console.error("Chat Error:", error);
      return "SYSTEM ERROR: THE SAGE IS OFFLINE.";
  }
};

/**
 * Moderates content (Mock implementation for client-side speed)
 */
export const moderateContent = async (text: string): Promise<boolean> => {
  const badWords = ['badword', 'spam', 'virus'];
  const hasBadWord = badWords.some(word => text.toLowerCase().includes(word));
  return !hasBadWord;
};