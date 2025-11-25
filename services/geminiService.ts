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

async function fetchWithFallback<T>(dbPromise: PromiseLike<{ data: any, error: any }>, fallback: T): Promise<T> {
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

export const fetchConsolesFiltered = async (filters: ConsoleFilterState): Promise<ConsoleDetails[]> => {
    try {
        let query = supabase.from('consoles').select('*').order('release_year', { ascending: true });

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

        const { data, error } = await query;
        if (error) throw error;
        return data || [];

    } catch (e) {
        console.error("Filter fetch failed", e);
        return [];
    }
};

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

export const fetchRetroNews = async (): Promise<NewsItem[]> => {
    return fetchWithFallback(
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        []
    );
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

// Deprecated in favor of fetchGamesPaginated, kept for backward compatibility if needed
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
    return fetchWithFallback(
        supabase.from('timeline').select('*').order('year', { ascending: true }),
        []
    );
};

export const fetchAllConsoles = async (): Promise<ConsoleDetails[]> => {
    return fetchWithFallback(
        supabase.from('consoles').select('*').order('release_year', { ascending: true }),
        []
    );
};

export const fetchConsoleList = async (): Promise<{name: string, slug: string}[]> => {
    try {
        const { data, error } = await supabase.from('consoles').select('name, slug').order('name');
        if (error) throw error;
        return data || [];
    } catch (e) {
        return [];
    }
}

export const fetchConsoleBySlug = async (slug: string): Promise<ConsoleDetails | null> => {
    try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject("Timeout"), 1500));
        const dbPromise = supabase.from('consoles').select('*').eq('slug', slug).single();
        const { data, error } = await Promise.race([dbPromise, timeoutPromise]) as any;
        if (error || !data) throw new Error("Console Not Found");
        return (data as ConsoleDetails);
    } catch (err) {
        return null;
    }
};

export const compareConsoles = async (slugA: string, slugB: string): Promise<ComparisonResult | null> => {
  try {
    const fetchC1 = supabase.from('consoles').select('*').eq('slug', slugA).single();
    const fetchC2 = supabase.from('consoles').select('*').eq('slug', slugB).single();
    const [res1, res2] = await Promise.all([fetchC1, fetchC2]);

    let c1: ConsoleDetails | undefined = res1.data;
    let c2: ConsoleDetails | undefined = res2.data;

    if (c1 && c2) {
        const parseNum = (str?: string) => parseFloat(str?.replace(/[^0-9.]/g, '') || '0') || 0;
        const ram1 = parseMemory(c1.ram);
        const ram2 = parseMemory(c2.ram);
        const ramWinner = ram1 === ram2 ? 'Tie' : (ram1 > ram2 ? 'A' : 'B');

         return {
            consoleA: c1.name,
            consoleB: c2.name,
            summary: `Comparison generated for ${c1.name} and ${c2.name}.`,
            points: [
                { feature: "Release Year", consoleAValue: c1.release_year.toString(), consoleBValue: c2.release_year.toString(), winner: c1.release_year < c2.release_year ? 'A' : 'B' }, 
                { feature: "CPU", consoleAValue: c1.cpu || 'N/A', consoleBValue: c2.cpu || 'N/A', winner: "Tie" },
                { feature: "GPU", consoleAValue: c1.gpu || 'N/A', consoleBValue: c2.gpu || 'N/A', winner: "Tie" },
                { feature: "RAM", consoleAValue: c1.ram || 'N/A', consoleBValue: c2.ram || 'N/A', winner: ramWinner },
                { feature: "Resolution", consoleAValue: c1.resolution || 'N/A', consoleBValue: c2.resolution || 'N/A', winner: "Tie" },
                { feature: "Media", consoleAValue: c1.media || 'N/A', consoleBValue: c2.media || 'N/A', winner: "Tie" },
                { feature: "Audio", consoleAValue: c1.audio || 'N/A', consoleBValue: c2.audio || 'N/A', winner: "Tie" },
                { feature: "Units Sold", consoleAValue: c1.units_sold || 'N/A', consoleBValue: c2.units_sold || 'N/A', winner: parseNum(c1.units_sold) > parseNum(c2.units_sold) ? 'A' : 'B' },
                { feature: "Launch Price", consoleAValue: c1.launch_price || 'N/A', consoleBValue: c2.launch_price || 'N/A', winner: parseNum(c1.launch_price) < parseNum(c2.launch_price) ? 'A' : 'B' }
            ]
        };
    }
    return null;
  } catch (error) {
      return null;
  }
};