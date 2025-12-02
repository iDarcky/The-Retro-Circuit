import { supabase } from "./supabase/singleton";
import { NewsItem, GameOfTheWeekData, TimelineEvent, UserCollectionItem, SearchResult, ManufacturerProfile, ConsoleDetails, ConsoleFilterState } from "./types";
import { FALLBACK_MANUFACTURERS } from "../data/static";

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
        try {
            const { data: consoles } = await supabase
                .from('consoles')
                .select('id, slug, name, manufacturer, image_url')
                .ilike('name', `%${query}%`)
                .limit(5);

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
        } catch {
             return [];
        }
    }
};

export const fetchManufacturers = async (): Promise<string[]> => {
    try {
        const { data, error } = await supabase.from('manufacturers').select('name').order('name');
        if (error) throw error;
        return data.map((m: { name: string }) => m.name);
    } catch {
        const { data } = await supabase.from('consoles').select('manufacturer');
        const brands = Array.from(new Set((data || []).map((d: { manufacturer: string }) => d.manufacturer))).sort();
        return brands as string[];
    }
};

export const fetchManufacturerProfile = async (name: string): Promise<ManufacturerProfile> => {
    try {
        const { data, error } = await supabase
            .from('manufacturers')
            .select('*')
            .ilike('name', name)
            .single();
        
        if (error || !data) throw error;
        return data as ManufacturerProfile;
    } catch {
        const fallbackKey = Object.keys(FALLBACK_MANUFACTURERS).find(k => k.toLowerCase() === name.toLowerCase());
        const fallbackData = fallbackKey ? FALLBACK_MANUFACTURERS[fallbackKey] : undefined;
        
        return fallbackData || {
            name: name,
            founded: 'Unknown',
            origin: 'Unknown',
            description: 'No dossier found in mainframe.',
            ceo: 'Unknown',
            key_franchises: []
        };
    }
};

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        let query = supabase.from('consoles').select('*', { count: 'exact' }).order('release_year', { ascending: true });

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

    } catch {
        return { data: [], count: 0 };
    }
};

export const fetchAllConsoles = async (): Promise<ConsoleDetails[]> => {
    const { data } = await fetchConsolesFiltered({ 
        minYear: 1970, maxYear: 2005, generations: [], types: [], manufacturer: null 
    }, 1, 100);
    return data;
};

export const fetchConsoleList = async (): Promise<{name: string, slug: string}[]> => {
    const { data } = await supabase.from('consoles').select('name, slug').order('name');
    return data || [];
};

export const fetchGameList = async (): Promise<{title: string, slug: string, id: string}[]> => {
    const { data } = await supabase.from('games').select('title, slug, id').order('title');
    return data || [];
};

export const fetchConsoleBySlug = async (slug: string): Promise<ConsoleDetails | null> => {
    try {
        const { data, error } = await supabase.from('consoles').select('*').eq('slug', slug).single();
        if (error) throw error;
        return data as ConsoleDetails;
    } catch {
        return null;
    }
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

export const addConsole = async (consoleData: ConsoleDetails): Promise<boolean> => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...data } = consoleData;
        const { error } = await supabase.from('consoles').insert([data]);
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

export const fetchAllGames = async (): Promise<GameOfTheWeekData[]> => {
    try {
        const { data } = await fetchGamesPaginated(1, 100);
        return data;
    } catch {
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