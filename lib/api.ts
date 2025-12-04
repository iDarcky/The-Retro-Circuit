
import { supabase } from "./supabase/singleton";
import { NewsItem, GameOfTheWeekData, UserCollectionItem, SearchResult, Manufacturer, ConsoleDetails, ConsoleFilterState, ConsoleSpecs, ConsoleVariant } from "./types";

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('consoles').select('*', { count: 'exact', head: true });
        return !error;
    } catch {
        return false;
    }
};

export const searchDatabase = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        // Split query into individual terms for flexible "fuzzy-like" matching
        const terms = query.trim().split(/\s+/).filter(t => t.length > 0);
        
        let dbQuery = supabase
            .from('global_search_index')
            .select('*');

        // Chain ILIKE filters
        terms.forEach(term => {
            dbQuery = dbQuery.ilike('title', `%${term}%`);
        });

        const { data, error } = await dbQuery.limit(10);

        if (error) throw error;

        return (data || []).map((item: any) => ({
            type: item.type as 'GAME' | 'CONSOLE',
            id: item.id,
            slug: item.slug,
            title: item.title,
            subtitle: item.subtitle,
            image: item.image
        }));
    } catch {
        return [];
    }
};

// -- MANUFACTURER API --

export const fetchManufacturers = async (): Promise<Manufacturer[]> => {
    try {
        const { data, error } = await supabase.from('manufacturer').select('*').order('name');
        if (error) {
            console.error('Fetch Manufacturers Error:', error);
            throw error;
        }
        return data as Manufacturer[];
    } catch (e) {
        console.error(e);
        return [];
    }
};

// Task 1: Function to fetch a single manufacturer by slug
export const getManufacturerBySlug = async (slug: string): Promise<Manufacturer | null> => {
    try {
        const { data, error } = await supabase
            .from('manufacturer')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data as Manufacturer;
    } catch {
        return null;
    }
};

// Deprecated alias kept for backward compatibility if needed, or can be removed if not used elsewhere
export const fetchManufacturerProfile = async (nameOrId: string): Promise<Manufacturer | null> => {
    return getManufacturerBySlug(nameOrId);
};

export const addManufacturer = async (manu: Omit<Manufacturer, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        const { error } = await supabase.from('manufacturer').insert([manu]);
        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message || "Unknown error occurred" };
    }
}

// -- CONSOLE API --

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        let query = supabase.from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*), variants:console_variant(*)', { count: 'exact' })
            .order('release_year', { ascending: true });

        if (filters.manufacturer_id) {
            query = query.eq('manufacturer_id', filters.manufacturer_id);
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

        if (filters.form_factors.length > 0) {
            query = query.in('form_factor', filters.form_factors);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query.range(from, to);
        if (error) throw error;
        return { data: (data as any) || [], count: count || 0 };

    } catch (e) {
        console.error('Fetch Consoles Error:', e);
        return { data: [], count: 0 };
    }
};

export const fetchConsoleList = async (): Promise<{name: string, slug: string, id: string}[]> => {
    const { data } = await supabase.from('consoles').select('id, name, slug').order('name');
    return data || [];
};

export const fetchConsoleBySlug = async (slug: string): Promise<ConsoleDetails | null> => {
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*), variants:console_variant(*)')
            .eq('slug', slug)
            .single();
            
        if (error) throw error;
        return data as ConsoleDetails;
    } catch {
        return null;
    }
};

// Task 1: Fetch specs for a single console
export const getConsoleSpecs = async (consoleId: string): Promise<ConsoleSpecs | null> => {
    try {
        const { data, error } = await supabase
            .from('console_specs')
            .select('*')
            .eq('console_id', consoleId)
            .single();
        if (error) throw error;
        return data as ConsoleSpecs;
    } catch {
        return null;
    }
};

export const getConsolesByManufacturer = async (manufacturerId: string): Promise<ConsoleDetails[]> => {
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select('*')
            .eq('manufacturer_id', manufacturerId);
        
        if (error) throw error;
        return data as ConsoleDetails[];
    } catch {
        return [];
    }
}

export const addConsole = async (
    consoleData: Omit<ConsoleDetails, 'id' | 'manufacturer' | 'specs' | 'variants'>, 
    specsData: ConsoleSpecs
): Promise<{ success: boolean, message?: string }> => {
    try {
        const { data: newConsole, error: consoleError } = await supabase
            .from('consoles')
            .insert([consoleData])
            .select('id')
            .single();

        if (consoleError || !newConsole) {
            return { success: false, message: consoleError?.message || "Failed to create console record" };
        }

        const { error: specsError } = await supabase
            .from('console_specs')
            .insert([{ ...specsData, console_id: newConsole.id }]);

        if (specsError) {
             await supabase.from('consoles').delete().eq('id', newConsole.id);
             return { success: false, message: `Specs Error: ${specsError.message}` };
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message || "Unknown Exception" };
    }
};

export const addConsoleVariant = async (variantData: Omit<ConsoleVariant, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        const { error } = await supabase.from('console_variant').insert([variantData]);
        if (error) return { success: false, message: error.message };
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

// -- GAMES & OTHERS --

export const fetchGameList = async (): Promise<{title: string, slug: string, id: string}[]> => {
    const { data } = await supabase.from('games').select('title, slug, id').order('title');
    return data || [];
};

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
            image: game.image,
            console_slug: game.console_slug
        }]);
        return !error;
    } catch {
        return false;
    }
};

export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData | null> => {
    try {
        const { data, error } = await supabase.from('games').select('*').limit(1).maybeSingle();
        if (error || !data) return null;

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
            image: data.image,
            console_slug: data.console_slug
        };
    } catch {
        return null;
    }
};

export const fetchGamesPaginated = async (page: number = 1, limit: number = 12): Promise<{ data: GameOfTheWeekData[], count: number }> => {
    try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        
        const { data, count, error } = await supabase
            .from('games')
            .select('*', { count: 'exact' })
            .order('year', { ascending: false })
            .range(from, to);

        if (error) throw error;

        const mapped = (data || []).map((g: any) => ({
            id: g.id,
            slug: g.slug,
            title: g.title,
            developer: g.developer,
            year: g.year,
            genre: g.genre,
            content: g.content,
            whyItMatters: g.why_it_matters,
            rating: g.rating,
            image: g.image,
            console_slug: g.console_slug
        }));

        return { data: mapped, count: count || 0 };
    } catch {
        return { data: [], count: 0 };
    }
};

// -- NEWS --

export const fetchRetroNews = async (page: number = 1, limit: number = 5, category?: string): Promise<{ data: NewsItem[], count: number }> => {
    try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('news')
            .select('*', { count: 'exact' })
            .order('date', { ascending: false });

        if (category && category !== 'ALL') {
            query = query.eq('category', category);
        }

        const { data, count, error } = await query.range(from, to);

        if (error) throw error;

        return { data: (data as NewsItem[]) || [], count: count || 0 };
    } catch {
        return { data: [], count: 0 };
    }
};

export const addNewsItem = async (item: NewsItem): Promise<boolean> => {
    try {
        const { error } = await supabase.from('news').insert([item]);
        return !error;
    } catch {
        return false;
    }
};

// -- COLLECTION --

export const addToCollection = async (item: UserCollectionItem): Promise<boolean> => {
    try {
        const { error } = await supabase.from('user_collections').upsert([item], { onConflict: 'user_id, item_id, item_type' });
        return !error;
    } catch {
        return false;
    }
};

export const removeFromCollection = async (itemId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('user_collections')
            .delete()
            .match({ user_id: user.id, item_id: itemId });
            
        return !error;
    } catch {
        return false;
    }
};

export const fetchUserCollection = async (): Promise<UserCollectionItem[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('user_collections')
            .select('*')
            .eq('user_id', user.id);
            
        if (error) throw error;
        return data as UserCollectionItem[];
    } catch {
        return [];
    }
};
