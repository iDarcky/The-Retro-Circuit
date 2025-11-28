import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, ConsoleDetails, UserCollectionItem, SearchResult, ConsoleFilterState, ManufacturerProfile, ComparisonPoint } from "../types";
import { supabase } from "./supabaseClient";

// --- VISUAL THEMES ---
// Shared between ConsoleLibrary and ManufacturerDetail
export const BRAND_THEMES: Record<string, { color: string, bg: string, hover: string }> = {
    'Nintendo': {
        color: 'text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        bg: 'bg-red-900/20',
        hover: 'hover:bg-red-900/40'
    },
    'Sega': {
        color: 'text-blue-500 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        bg: 'bg-blue-900/20',
        hover: 'hover:bg-blue-900/40'
    },
    'Sony': {
        color: 'text-yellow-400 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]',
        bg: 'bg-yellow-900/20',
        hover: 'hover:bg-yellow-900/40'
    },
    'Atari': {
        color: 'text-orange-500 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
        bg: 'bg-orange-900/20',
        hover: 'hover:bg-orange-900/40'
    },
    'Microsoft': {
        color: 'text-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]',
        bg: 'bg-green-900/20',
        hover: 'hover:bg-green-900/40'
    },
    'NEC': {
        color: 'text-purple-400 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)]',
        bg: 'bg-purple-900/20',
        hover: 'hover:bg-purple-900/40'
    },
    'SNK': {
        color: 'text-teal-400 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)]',
        bg: 'bg-teal-900/20',
        hover: 'hover:bg-teal-900/40'
    },
};

export const getBrandTheme = (brand: string) => {
    return BRAND_THEMES[brand] || {
        color: 'text-retro-neon border-retro-neon shadow-[0_0_20px_rgba(0,255,157,0.3)]',
        bg: 'bg-retro-grid/20',
        hover: 'hover:bg-retro-grid/40'
    };
};

// --- FALLBACK DATA ---
const FALLBACK_MANUFACTURERS: Record<string, ManufacturerProfile> = {
    'Nintendo': { 
        name: 'Nintendo', 
        founded: '1889', 
        origin: 'Kyoto, Japan', 
        ceo: 'Shuntaro Furukawa', 
        key_franchises: ['Mario', 'Zelda', 'Metroid', 'Pokémon', 'Smash Bros'], 
        description: 'Active, dominant in handheld/hybrid market. Founded in 1889. Notable Consoles: NES, SNES, N64, GameCube, Wii, Wii U, Switch.' 
    },
    'Sony': { 
        name: 'Sony', 
        founded: '1946', 
        origin: 'Tokyo, Japan', 
        ceo: 'Kenichiro Yoshida', 
        key_franchises: ['Gran Turismo', 'God of War', 'Uncharted', 'The Last of Us'], 
        description: 'Active, leading home console manufacturer. Entered gaming in 1994. Notable Consoles: PlayStation, PS2, PS3, PS4, PS5.' 
    },
};

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('consoles').select('*', { count: 'exact', head: true });
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
        const redirectTo = typeof window !== 'undefined' ? window.location.origin : '';
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
        const redirectTo = typeof window !== 'undefined' ? window.location.origin : '';
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
    } catch (e) {
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
        } catch (legacyError) {
             return [];
        }
    }
};

export const fetchManufacturers = async (): Promise<string[]> => {
    try {
        const { data, error } = await supabase.from('manufacturers').select('name').order('name');
        if (error) throw error;
        return data.map((m: { name: string }) => m.name);
    } catch (e) {
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
    } catch (e) {
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

    } catch (e) {
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
    } catch (e) {
        return null;
    }
};

// --- COMPARISON LOGIC & HELPERS ---

// Helper to extract numbers from messy spec strings (e.g. "3.58 MHz" -> 3.58, "4 GB" -> 4000)
// Returns value in MB for memory, MHz for speed
const parseSpecValue = (val: string | undefined): number => {
    if (!val) return 0;
    const clean = val.toLowerCase().replace(/,/g, '');
    const num = parseFloat(clean.match(/[0-9.]+/)?.[0] || '0');
    
    // Normalize Memory/Storage to MB
    if (clean.includes('kb') || clean.includes('kilobyte')) return num / 1024;
    if (clean.includes('gb') || clean.includes('gigabyte')) return num * 1024;
    if (clean.includes('tb') || clean.includes('terabyte')) return num * 1024 * 1024;
    // Normalize Speed to MHz
    if (clean.includes('ghz')) return num * 1000;
    
    return num;
};

// Helper to parse currency strings (e.g. "$199.99" -> 199.99)
const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
};

// Helper to parse sales strings (e.g. "61.9 million" -> 61.9)
const parseSales = (salesStr?: string): number => {
    if (!salesStr) return 0;
    const clean = salesStr.toLowerCase().replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    // Heuristic: if number is huge (e.g. 60000000), assume raw count, else assume millions
    if (num > 1000) return num / 1000000;
    return num || 0;
};

const calculateScore = (valA: number, valB: number): { a: number, b: number } => {
    const max = Math.max(valA, valB);
    if (max === 0) return { a: 0, b: 0 };
    return {
        a: Math.round((valA / max) * 100),
        b: Math.round((valB / max) * 100)
    };
};

export const compareConsoles = async (slugA: string, slugB: string): Promise<ComparisonResult | null> => {
    try {
        const { data: cA } = await supabase.from('consoles').select('*').eq('slug', slugA).single();
        const { data: cB } = await supabase.from('consoles').select('*').eq('slug', slugB).single();
        
        if(!cA || !cB) return null;

        const yearA = cA.release_year;
        const yearB = cB.release_year;
        
        const priceA = parsePrice(cA.launch_price);
        const priceB = parsePrice(cB.launch_price);
        
        const salesA = parseSales(cA.units_sold);
        const salesB = parseSales(cB.units_sold);
        
        const cpuA = parseSpecValue(cA.cpu);
        const cpuB = parseSpecValue(cB.cpu);
        
        const ramA = parseSpecValue(cA.ram);
        const ramB = parseSpecValue(cB.ram);

        const points: ComparisonPoint[] = [];

        // 1. Generation
        points.push({
            feature: 'Legacy',
            consoleAValue: `${cA.release_year} (Gen ${cA.generation})`,
            consoleBValue: `${cB.release_year} (Gen ${cB.generation})`,
            winner: cA.generation > cB.generation ? 'A' : (cB.generation > cA.generation ? 'B' : 'Tie'),
            aScore: cA.generation > cB.generation ? 100 : (cA.generation === cB.generation ? 50 : 30),
            bScore: cB.generation > cA.generation ? 100 : (cA.generation === cB.generation ? 50 : 30)
        });

        // 2. Sales
        const salesScore = calculateScore(salesA, salesB);
        points.push({
            feature: 'Market (Millions Sold)',
            consoleAValue: cA.units_sold || 'Unknown',
            consoleBValue: cB.units_sold || 'Unknown',
            winner: salesA > salesB ? 'A' : (salesB > salesA ? 'B' : 'Tie'),
            aScore: salesScore.a,
            bScore: salesScore.b
        });

        // 3. Price (Cheaper wins?) No, typically for "Specs" higher price implies more power, 
        // but for "Value" lower is better. Let's just compare raw magnitude for the bar.
        points.push({
            feature: 'Launch Cost',
            consoleAValue: cA.launch_price || 'Unknown',
            consoleBValue: cB.launch_price || 'Unknown',
            winner: (priceA > 0 && priceB > 0) ? (priceA < priceB ? 'A' : (priceB < priceA ? 'B' : 'Tie')) : 'Tie',
            aScore: calculateScore(priceA, priceB).a,
            bScore: calculateScore(priceA, priceB).b
        });

        // 4. CPU
        const cpuScore = calculateScore(cpuA, cpuB);
        points.push({
            feature: 'Processing Power',
            consoleAValue: cA.cpu || 'Unknown',
            consoleBValue: cB.cpu || 'Unknown',
            winner: cpuA > cpuB ? 'A' : (cpuB > cpuA ? 'B' : 'Tie'),
            aScore: cpuScore.a,
            bScore: cpuScore.b
        });

        // 5. RAM
        const ramScore = calculateScore(ramA, ramB);
        points.push({
            feature: 'Memory (RAM)',
            consoleAValue: cA.ram || 'Unknown',
            consoleBValue: cB.ram || 'Unknown',
            winner: ramA > ramB ? 'A' : (ramB > ramA ? 'B' : 'Tie'),
            aScore: ramScore.a,
            bScore: ramScore.b
        });

        return {
            consoleA: cA.name,
            consoleB: cB.name,
            consoleAImage: cA.image_url,
            consoleBImage: cB.image_url,
            summary: `${cA.manufacturer} faces off against ${cB.manufacturer}.`,
            points: points
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
            image: game.image,
            console_slug: game.console_slug
        }]);
        if (error) throw error;
        return true;
    } catch (e) {
        return false;
    }
};

export const addConsole = async (consoleData: ConsoleDetails): Promise<boolean> => {
    try {
        const { id, ...data } = consoleData;
        const { error } = await supabase.from('consoles').insert([data]);
        if (error) throw error;
        return true;
    } catch (e) {
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
        return [];
    }
};

export const addToCollection = async (item: UserCollectionItem): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        const { id, ...itemData } = item;
        const payload = { ...itemData, user_id: user.id };

        const { error } = await supabase.from('user_collections').upsert(payload, { onConflict: 'user_id, item_id' });
        return !error;
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
            image: data.image,
            console_slug: data.console_slug
        };
    } catch (e) {
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
    } catch (e) {
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