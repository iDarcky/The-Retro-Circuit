import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, ConsoleDetails, UserCollectionItem, SearchResult, ConsoleFilterState } from "../types";
import { supabase } from "./supabaseClient";

const parseMemory = (memStr: string | undefined): number => {
    if (!memStr) return 0;
    const normalized = memStr.toUpperCase();
    const match = normalized.match(/(\d+(\.\d+)?)\s*(GB|MB|KB|B)/);
    if (!match) return 0;
    const val = parseFloat(match[1]);
    const unit = match[3];
    switch(unit) {
        case 'GB': return val * 1024 * 1024;
        case 'MB': return val * 1024;
        case 'KB': return val;
        case 'B': return val / 1024;
        default: return 0;
    }
};

async function fetchWithFallback<T>(dbPromise: any, fallback: T): Promise<T> {
    try {
        const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) => 
            setTimeout(() => reject(new Error("Request Timed Out")), 2500)
        );
        const { data, error } = await Promise.race([dbPromise, timeoutPromise]);
        if (error || !data) throw new Error("DB Error or Empty Data");
        if (Array.isArray(fallback) && Array.isArray(data) && data.length === 0) throw new Error("Empty Array Returned");
        return data as T;
    } catch (err) {
        console.warn("Connection unstable, loading simulation data.");
        return fallback;
    }
}

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('consoles').select('count', { count: 'exact', head: true });
        return !error;
    } catch (e) {
        return false;
    }
};

export const retroAuth = {
    signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (email: string, password: string, username: string) => {
        const redirectTo = window.location.origin;
        return await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: { username, full_name: username, avatar_id: 'pilot' }
            }
        });
    },
    resetPassword: async (email: string) => {
        const redirectTo = window.location.origin;
        return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
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
    },
    updateAvatar: async (avatarId: string) => {
        return await supabase.auth.updateUser({
            data: { avatar_id: avatarId }
        });
    },
    isAdmin: async (): Promise<boolean> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) return false;
        
        const { data } = await supabase.from('admins').select('email').eq('email', user.email).single();
        return !!data;
    }
};

// --- SEARCH & FILTER ---

export const searchDatabase = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        // Search Consoles
        const { data: consoles } = await supabase
            .from('consoles')
            .select('id, slug, name, manufacturer, image_url')
            .ilike('name', `%${query}%`)
            .limit(5);

        // Search Games
        const { data: games } = await supabase
            .from('games')
            .select('id, slug, title, developer, image')
            .ilike('title', `%${query}%`)
            .limit(5);

        const results: SearchResult[] = [];

        if (consoles) {
            consoles.forEach((c: any) => results.push({
                type: 'CONSOLE',
                id: c.id,
                slug: c.slug,
                title: c.name,
                subtitle: c.manufacturer,
                image: c.image_url
            }));
        }

        if (games) {
            games.forEach((g: any) => results.push({
                type: 'GAME',
                id: g.id,
                slug: g.slug,
                title: g.title,
                subtitle: g.developer,
                image: g.image
            }));
        }

        return results;
    } catch (e) {
        console.error("Search failed", e);
        return [];
    }
};

export const fetchManufacturers = async (): Promise<string[]> => {
    try {
        const { data, error } = await supabase.from('consoles').select('manufacturer');
        if (error) throw error;
        // Use Set to get unique values in client since Supabase doesn't support distinct easily on select without RPC
        const brands = Array.from(new Set((data || []).map((d: any) => d.manufacturer))).sort();
        return brands as string[];
    } catch (e) {
        return ['Atari', 'Nintendo', 'Sega', 'Sony'];
    }
};

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        let query = supabase.from('consoles').select('*', { count: 'exact' }).order('release_year', { ascending: true });

        // Apply Filters
        if (filters.manufacturer) {
            query = query.eq('manufacturer', filters.manufacturer);
        }
        
        if (filters.minYear > 1970) {
            query = query.gte('release_year', filters.minYear);
        }
        
        if (filters.maxYear < 2005) {
            query = query.lte('release_year', filters.maxYear);
        }

        if (filters.generations.length > 0) {
            query = query.in('generation', filters.generations);
        }

        if (filters.types.length > 0) {
            query = query.in('type', filters.types);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query.range(from, to);
        if (error) throw error;
        return { data: data || [], count: count || 0 };

    } catch (e) {
        console.error("Filter fetch failed", e);
        return { data: [], count: 0 };
    }
};

// Deprecated: Use fetchConsolesFiltered
export const fetchAllConsoles = async (): Promise<ConsoleDetails[]> => {
    const { data } = await fetchConsolesFiltered({ 
        minYear: 1970, maxYear: 2005, generations: [], types: [], manufacturer: null 
    }, 1, 100);
    return data;
};

// Optimized list fetch for dropdowns
export const fetchConsoleList = async (): Promise<{name: string, slug: string}[]> => {
    const { data } = await supabase.from('consoles').select('name, slug').order('name');
    return data || [];
};

export const fetchConsoleBySlug = async (slug: string): Promise<ConsoleDetails | null> => {
    try {
        const { data, error } = await supabase.from('consoles').select('*').eq('slug', slug).single();
        if (error) throw error;
        return data as ConsoleDetails;
    } catch (e) {
        return null;
    }
};

export const compareConsoles = async (slugA: string, slugB: string): Promise<ComparisonResult | null> => {
    try {
        const { data: cA } = await supabase.from('consoles').select('*').eq('slug', slugA).single();
        const { data: cB } = await supabase.from('consoles').select('*').eq('slug', slugB).single();
        
        if(!cA || !cB) return null;

        // Basic comparison logic since we don't have the AI model here
        return {
            consoleA: cA.name,
            consoleB: cB.name,
            summary: `Comparison between ${cA.name} (${cA.release_year}) and ${cB.name} (${cB.release_year}).`,
            points: [
                { feature: 'Year', consoleAValue: cA.release_year.toString(), consoleBValue: cB.release_year.toString(), winner: cA.release_year < cB.release_year ? 'A' : 'B' },
                { feature: 'Gen', consoleAValue: `Gen ${cA.generation}`, consoleBValue: `Gen ${cB.generation}`, winner: cA.generation > cB.generation ? 'A' : 'B' },
                { feature: 'Media', consoleAValue: cA.media || 'N/A', consoleBValue: cB.media || 'N/A', winner: 'Tie' }
            ]
        }
    } catch(e) {
        return null;
    }
}

// --- DATA ENTRY (ADMIN) ---

export const addGame = async (game: GameOfTheWeekData): Promise<boolean> => {
    try {
        const { error } = await supabase.from('games').insert([{
            title: game.title,
            slug: game.slug,
            developer: game.developer,
            year: game.year,
            genre: game.genre,
            content: game.content,
            why_it_matters: game.whyItMatters,
            rating: game.rating,
            image: game.image
        }]);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Add Game Failed:", e);
        return false;
    }
};

export const addConsole = async (consoleData: ConsoleDetails): Promise<boolean> => {
    try {
        // Remove ID if present to allow DB generation
        const { id, ...data } = consoleData;
        const { error } = await supabase.from('consoles').insert([data]);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Add Console Failed:", e);
        return false;
    }
};

// --- COLLECTION MANAGEMENT ---
export const fetchUserCollection = async (): Promise<UserCollectionItem[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        const { data, error } = await supabase.from('user_collections').select('*').eq('user_id', user.id);
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Fetch collection failed:", e);
        return [];
    }
};

export const addToCollection = async (item: UserCollectionItem): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        // Remove 'id' if present, allow DB to generate it, ensure user_id is set
        const { id, ...itemData } = item;
        const payload = { ...itemData, user_id: user.id };

        const { error } = await supabase.from('user_collections').upsert(payload, { onConflict: 'user_id, item_id' });
        return !error;
    } catch (e) {
        console.error("Add to collection failed:", e);
        return false;
    }
};

export const removeFromCollection = async (itemId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        const { error } = await supabase.from('user_collections').delete().match({ user_id: user.id, item_id: itemId });
        return !error;
    } catch (e) {
        console.error("Remove from collection failed:", e);
        return false;
    }
};

export const fetchRetroNews = async (page: number = 1, limit: number = 20): Promise<{ data: NewsItem[], count: number }> => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    try {
        const { data, count, error } = await supabase
            .from('news')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);
        
        if (error) throw error;
        
        return { data: data as NewsItem[], count: count || 0 };
    } catch (e) {
        // Fallback or empty
        return { data: [], count: 0 };
    }
};

export const addNewsItem = async (item: NewsItem): Promise<boolean> => {
    try {
        const { error } = await supabase.from('news').insert([{
            headline: item.headline,
            summary: item.summary,
            category: item.category,
            date: item.date || new Date().toISOString()
        }]);
        return !error;
    } catch (err) {
        return false;
    }
};

// Updated to support pagination and field mapping
export const fetchGamesPaginated = async (page: number = 1, limit: number = 9): Promise<{ data: GameOfTheWeekData[], count: number }> => {
    try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        
        const { data, count, error } = await supabase
            .from('games')
            .select('*', { count: 'exact' })
            .order('year', { ascending: false })
            .range(from, to);
            
        if (error) throw error;
        
        const mappedData = (data || []).map((g: any) => ({
            id: g.id,
            slug: g.slug,
            title: g.title,
            developer: g.developer,
            year: g.year,
            genre: g.genre,
            content: g.content,
            whyItMatters: g.why_it_matters, // Map from snake_case
            rating: g.rating,
            image: g.image
        }));

        return { 
            data: mappedData, 
            count: count || 0 
        };
    } catch (e) {
        console.error("Failed to fetch games:", e);
        return { data: [], count: 0 };
    }
};

export const fetchAllGames = async (): Promise<GameOfTheWeekData[]> => {
    try {
        const { data } = await fetchGamesPaginated(1, 100);
        return data;
    } catch (e) {
        return [];
    }
};

export const fetchGameBySlug = async (slug: string): Promise<GameOfTheWeekData | null> => {
    try {
        const { data, error } = await supabase.from('games').select('*').eq('slug', slug).single();
        if (error) throw error;
        if (!data) return null;
        return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            developer: data.developer,
            year: data.year,
            genre: data.genre,
            content: data.content,
            whyItMatters: data.why_it_matters,
            rating: data.rating,
            image: data.image
        };
    } catch (e) {
        return null;
    }
};

export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData | null> => {
  try {
      const { data, error } = await supabase.from('games').select('*').order('year', { ascending: false }).limit(1).single();
      if (error) throw error;
      if (!data) return null;
      return {
          id: data.id,
          slug: data.slug,
          title: data.title,
          developer: data.developer,
          year: data.year,
          genre: data.genre,
          content: data.content,
          whyItMatters: data.why_it_matters,
          rating: data.rating,
          image: data.image
      };
  } catch (e) {
      return null;
  }
};

export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    try {
        const { data, error } = await supabase.from('timeline').select('*').order('year', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (e) {
        return [];
    }
};