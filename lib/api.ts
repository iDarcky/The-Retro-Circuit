import { supabase } from "./supabase/singleton";
import { NewsItem, GameOfTheWeekData, TimelineEvent, UserCollectionItem, SearchResult, Manufacturer, ConsoleDetails, ConsoleFilterState, ConsoleSpecs } from "./types";

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
        const { data, error } = await supabase
            .from('global_search_index')
            .select('*')
            .ilike('title', `%${query}%`)
            .limit(10);

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
        const { data, error } = await supabase.from('manufacturers').select('*').order('name');
        if (error) throw error;
        return data as Manufacturer[];
    } catch {
        return [];
    }
};

export const fetchManufacturerProfile = async (nameOrId: string): Promise<Manufacturer | null> => {
    try {
        // Try searching by ID or Name
        let query = supabase.from('manufacturers').select('*');
        
        // Simple check if it looks like a UUID
        if (nameOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
             query = query.eq('id', nameOrId);
        } else {
             query = query.ilike('name', nameOrId);
        }
        
        const { data, error } = await query.single();
        if (error || !data) throw error;
        return data as Manufacturer;
    } catch {
        return null;
    }
};

export const addManufacturer = async (manu: Omit<Manufacturer, 'id'>): Promise<boolean> => {
    try {
        const { error } = await supabase.from('manufacturers').insert([manu]);
        return !error;
    } catch {
        return false;
    }
}

// -- CONSOLE API --

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        // JOIN: Select console fields, join manufacturer, join specs
        let query = supabase.from('consoles')
            .select('*, manufacturer:manufacturers(*), specs:console_specs(*)', { count: 'exact' })
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

    } catch {
        return { data: [], count: 0 };
    }
};

export const fetchConsoleList = async (): Promise<{name: string, slug: string}[]> => {
    const { data } = await supabase.from('consoles').select('name, slug').order('name');
    return data || [];
};

export const fetchConsoleBySlug = async (slug: string): Promise<ConsoleDetails | null> => {
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturers(*), specs:console_specs(*)')
            .eq('slug', slug)
            .single();
            
        if (error) throw error;
        return data as ConsoleDetails;
    } catch {
        return null;
    }
};

export const addConsole = async (
    consoleData: Omit<ConsoleDetails, 'id' | 'manufacturer' | 'specs'>, 
    specsData: ConsoleSpecs
): Promise<boolean> => {
    try {
        // 1. Insert Console
        const { data: newConsole, error: consoleError } = await supabase
            .from('consoles')
            .insert([consoleData])
            .select('id')
            .single();

        if (consoleError || !newConsole) throw consoleError;

        // 2. Insert Specs (Linked to Console ID)
        const { error: specsError } = await supabase
            .from('console_specs')
            .insert([{ ...specsData, console_id: newConsole.id }]);

        if (specsError) throw specsError; // Note: In a real app, we'd want to rollback the console insert here

        return true;
    } catch {
        return false;
    }
};

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
        if (error) throw error;
        return true;
    } catch {
        return false;
    }
};

export const fetchUserCollection = async (): Promise<UserCollectionItem[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        const { data, error } = await supabase.from('user_collections').select('*').eq('user_id', user.id);
        if (error) throw error;
        return data || [];
    } catch {
        return [];
    }
};

export const addToCollection = async (item: UserCollectionItem): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...itemData } = item;
        const payload = { ...itemData, user_id: user.id };

        const { error } = await supabase.from('user_collections').upsert(payload, { onConflict: 'user_id, item_id' });
        return !error;
    } catch {
        return false;
    }
};

export const removeFromCollection = async (itemId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        const { error } = await supabase.from('user_collections').delete().match({ user_id: user.id, item_id: itemId });
        return !error;
    } catch {
        return false;
    }
};

export const fetchRetroNews = async (page: number = 1, limit: number = 20, category?: string): Promise<{ data: NewsItem[], count: number }> => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    try {
        let query = supabase
            .from('news')
            .select('*', { count: 'exact' });

        if (category && category !== 'ALL') {
            query = query.eq('category', category);
        }
            
        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);
        
        if (error) throw error;
        
        return { data: data as NewsItem[], count: count || 0 };
    } catch {
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
    } catch {
        return false;
    }
};

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
            whyItMatters: g.why_it_matters,
            rating: g.rating,
            image: g.image,
            console_slug: g.console_slug
        }));

        return { 
            data: mappedData, 
            count: count || 0 
        };
    } catch {
        return { data: [], count: 0 };
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
            image: data.image,
            console_slug: data.console_slug
        };
    } catch {
        return null;
    }
};

export const fetchGamesForConsole = async (consoleSlug: string): Promise<GameOfTheWeekData[]> => {
    try {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('console_slug', consoleSlug)
            .order('year', { ascending: true });
        
        if (error) throw error;

        return (data || []).map((g: any) => ({
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
    } catch {
        return [];
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
          image: data.image,
          console_slug: data.console_slug
      };
  } catch {
      return null;
  }
};

export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    try {
        const { data, error } = await supabase.from('timeline').select('*').order('year', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch {
        return [];
    }
};