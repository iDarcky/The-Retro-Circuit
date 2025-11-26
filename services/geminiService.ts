
import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, ConsoleDetails, UserCollectionItem, SearchResult, ConsoleFilterState, ManufacturerProfile } from "../types";
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
    'Coleco': {
        color: 'text-indigo-400 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.3)]',
        bg: 'bg-indigo-900/20',
        hover: 'hover:bg-indigo-900/40'
    },
    'Mattel': {
        color: 'text-red-600 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]',
        bg: 'bg-red-900/10',
        hover: 'hover:bg-red-900/30'
    },
    'Magnavox': {
        color: 'text-amber-500 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        bg: 'bg-amber-900/20',
        hover: 'hover:bg-amber-900/40'
    },
    '3DO': {
        color: 'text-gray-200 border-gray-200 shadow-[0_0_20px_rgba(229,231,235,0.3)]',
        bg: 'bg-gray-800/40',
        hover: 'hover:bg-gray-700/60'
    },
    'Bandai': {
        color: 'text-rose-400 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.3)]',
        bg: 'bg-rose-900/20',
        hover: 'hover:bg-rose-900/40'
    },
    'GCE': {
        color: 'text-blue-300 border-blue-300 shadow-[0_0_20px_rgba(147,197,253,0.3)]',
        bg: 'bg-blue-900/30',
        hover: 'hover:bg-blue-900/50'
    },
    'Commodore': {
        color: 'text-blue-200 border-blue-200 shadow-[0_0_20px_rgba(191,219,254,0.3)]',
        bg: 'bg-blue-900/20',
        hover: 'hover:bg-blue-800/40'
    },
    'Panasonic': {
        color: 'text-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]',
        bg: 'bg-blue-900/20',
        hover: 'hover:bg-blue-900/40'
    },
    'Amstrad': {
        color: 'text-gray-400 border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.3)]',
        bg: 'bg-gray-800/30',
        hover: 'hover:bg-gray-700/50'
    },
    'Fairchild': {
        color: 'text-yellow-600 border-yellow-600 shadow-[0_0_20px_rgba(202,138,4,0.3)]',
        bg: 'bg-yellow-900/10',
        hover: 'hover:bg-yellow-900/30'
    },
    'Bally': {
        color: 'text-red-400 border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.3)]',
        bg: 'bg-red-900/20',
        hover: 'hover:bg-red-800/40'
    },
    'Epoch': {
        color: 'text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        bg: 'bg-red-950/30',
        hover: 'hover:bg-red-900/50'
    },
    'Casio': {
        color: 'text-pink-400 border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.3)]',
        bg: 'bg-pink-900/20',
        hover: 'hover:bg-pink-900/40'
    },
    // MODERN HANDHELDS
    'Valve': {
        color: 'text-blue-400 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]',
        bg: 'bg-slate-900/50',
        hover: 'hover:bg-slate-800/60'
    },
    'Retroid': {
        color: 'text-orange-400 border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.3)]',
        bg: 'bg-orange-900/20',
        hover: 'hover:bg-orange-800/40'
    },
    'Anbernic': {
        color: 'text-gray-300 border-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.3)]',
        bg: 'bg-gray-800/30',
        hover: 'hover:bg-gray-700/50'
    },
    'Analogue': {
        color: 'text-white border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]',
        bg: 'bg-black',
        hover: 'hover:bg-gray-900'
    },
    'Panic': {
        color: 'text-yellow-300 border-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.3)]',
        bg: 'bg-yellow-900/20',
        hover: 'hover:bg-yellow-800/40'
    },
    'Ayaneo': {
        color: 'text-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]',
        bg: 'bg-cyan-900/20',
        hover: 'hover:bg-cyan-800/40'
    },
    'Ayn': {
        color: 'text-sky-300 border-sky-300 shadow-[0_0_20px_rgba(125,211,252,0.3)]',
        bg: 'bg-sky-900/20',
        hover: 'hover:bg-sky-800/40'
    },
    'Powkiddy': {
        color: 'text-red-300 border-red-300 shadow-[0_0_20px_rgba(252,165,165,0.3)]',
        bg: 'bg-red-900/10',
        hover: 'hover:bg-red-900/30'
    },
    'Miyoo': {
        color: 'text-purple-300 border-purple-300 shadow-[0_0_20px_rgba(216,180,254,0.3)]',
        bg: 'bg-purple-900/20',
        hover: 'hover:bg-purple-800/40'
    },
    'GPD': {
        color: 'text-blue-500 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        bg: 'bg-blue-900/20',
        hover: 'hover:bg-blue-800/40'
    },
    'Asus': {
        color: 'text-red-600 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]',
        bg: 'bg-red-950/40',
        hover: 'hover:bg-red-900/60'
    },
    'Lenovo': {
        color: 'text-indigo-500 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]',
        bg: 'bg-indigo-900/20',
        hover: 'hover:bg-indigo-800/40'
    },
    'MSI': {
        color: 'text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        bg: 'bg-red-900/20',
        hover: 'hover:bg-red-800/40'
    },
    'Evercade': {
        color: 'text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        bg: 'bg-red-900/30',
        hover: 'hover:bg-red-800/50'
    },
    'Logitech': {
        color: 'text-teal-300 border-teal-300 shadow-[0_0_20px_rgba(94,234,212,0.3)]',
        bg: 'bg-teal-900/20',
        hover: 'hover:bg-teal-800/40'
    }
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
    'Microsoft': { 
        name: 'Microsoft', 
        founded: '1975', 
        origin: 'Redmond, USA', 
        ceo: 'Satya Nadella', 
        key_franchises: ['Halo', 'Gears of War', 'Forza', 'Fable'], 
        description: 'Active, major competitor in home console market since 2001. Notable Consoles: Xbox, Xbox 360, Xbox One, Xbox Series X/S.' 
    },
    'Sega': { 
        name: 'Sega', 
        founded: '1960', 
        origin: 'Tokyo, Japan', 
        ceo: 'Haruki Satomi', 
        key_franchises: ['Sonic', 'Yakuza', 'Virtua Fighter', 'Persona'], 
        description: 'Exited hardware in 2001, now software-only. Notable Consoles: Master System, Genesis/Mega Drive, Saturn, Dreamcast.' 
    },
    'Atari': { 
        name: 'Atari', 
        founded: '1972', 
        origin: 'California, USA', 
        ceo: 'Wade Rosen', 
        key_franchises: ['Pong', 'Asteroids', 'Centipede', 'RollerCoaster Tycoon'], 
        description: 'Pioneered home gaming, exited hardware 1996. Notable Consoles: 2600, 5200, 7800, Jaguar, Lynx.' 
    },
    'NEC': { 
        name: 'NEC', 
        founded: '1899', 
        origin: 'Tokyo, Japan', 
        ceo: 'Takayuki Morita', 
        key_franchises: ['Bomberman', 'Bonk', 'Adventure Island'], 
        description: 'Exited gaming hardware, brand remains in electronics. Notable Consoles: TurboGrafx-16/PC Engine, PC-FX.' 
    },
    'SNK': { 
        name: 'SNK', 
        founded: '1978', 
        origin: 'Osaka, Japan', 
        ceo: 'Kenji Matsubara', 
        key_franchises: ['King of Fighters', 'Metal Slug', 'Fatal Fury', 'Samurai Shodown'], 
        description: 'Bankrupt 2001, reformed as SNK Playmore, now focuses on software. Notable Consoles: Neo Geo (arcade and home), Neo Geo Pocket.' 
    },
    'Coleco': {
        name: 'Coleco',
        founded: '1932',
        origin: 'Connecticut, USA',
        ceo: 'N/A',
        key_franchises: ['Donkey Kong (Port)', 'Zaxxon', 'Cabbage Patch Kids'],
        description: 'ColecoVision competed with Atari 2600, company folded after video game crash. Notable Consoles: Telstar, ColecoVision.'
    },
    'Mattel': {
        name: 'Mattel',
        founded: '1945',
        origin: 'California, USA',
        ceo: 'Ynon Kreiz',
        key_franchises: ['Astrosmash', 'Shark! Shark!', 'BurgerTime'],
        description: 'Still active in toys, licensed Intellivision brand to others. Notable Consoles: Intellivision.'
    },
    'Magnavox': {
        name: 'Magnavox',
        founded: '1917',
        origin: 'Indiana, USA',
        ceo: 'N/A',
        key_franchises: ['K.C. Munchkin', 'Pick Axe Pete', 'Hotel Mario'],
        description: 'Created the first home console (Odyssey, 1972). Notable Consoles: Odyssey, Odyssey 2, CD-i.'
    },
    '3DO': {
        name: '3DO',
        founded: '1991',
        origin: 'California, USA',
        ceo: 'Trip Hawkins',
        key_franchises: ['Gex', 'Road Rash', 'Need for Speed'],
        description: 'Expensive console ($699 launch), early CD-based gaming. Notable Consoles: 3DO Interactive Multiplayer.'
    },
    'Bandai': {
        name: 'Bandai',
        founded: '1950',
        origin: 'Tokyo, Japan',
        ceo: 'Masaru Kawaguchi',
        key_franchises: ['Digimon', 'Gundam', 'Tamagotchi'],
        description: 'Merged with Namco in 2005. Notable Consoles: Pippin (with Apple), WonderSwan.'
    },
    'GCE': {
        name: 'GCE',
        founded: '1978',
        origin: 'California, USA',
        ceo: 'N/A',
        key_franchises: ['Mine Storm', 'Spike'],
        description: 'General Consumer Electronics. Created the only vector-based home console with built-in screen. Notable Consoles: Vectrex.'
    },
    'Commodore': {
        name: 'Commodore',
        founded: '1954',
        origin: 'Pennsylvania, USA',
        ceo: 'Jack Tramiel',
        key_franchises: ['Turrican', 'Lemmings', 'Zool', 'Chaos Engine'],
        description: 'Better known for computers (C64, Amiga). Released the CD32 in 1993, a consolized Amiga 1200.'
    },
    'Panasonic': {
        name: 'Panasonic',
        founded: '1918',
        origin: 'Osaka, Japan',
        ceo: 'Yuki Kusumi',
        key_franchises: ['Real 3DO', 'Panasonic Q'],
        description: 'Made limited gaming hardware including the high-end 3DO FZ-1 and the legendary Panasonic Q (GameCube with DVD).'
    },
    'Amstrad': {
        name: 'Amstrad',
        founded: '1968',
        origin: 'Brentwood, UK',
        ceo: 'Alan Sugar',
        key_franchises: ['Burnin Rubber', 'Pang', 'RoboCop'],
        description: 'Failed console attempt, better known for computers (CPC). Notable Consoles: GX4000.'
    },
    'Fairchild': {
        name: 'Fairchild',
        founded: '1927',
        origin: 'California, USA',
        ceo: 'N/A',
        key_franchises: ['Video Whizball', 'Tennis'],
        description: 'Semiconductor company that released the first cartridge-based console. Notable Consoles: Channel F.'
    },
    'Bally': {
        name: 'Bally',
        founded: '1932',
        origin: 'Chicago, USA',
        ceo: 'N/A',
        key_franchises: ['The Incredible Wizard', 'Star Battle'],
        description: 'Arcade manufacturer\'s home console attempt. Notable Consoles: Astrocade.'
    },
    'Epoch': {
        name: 'Epoch',
        founded: '1958',
        origin: 'Tokyo, Japan',
        ceo: 'Michihiro Maeda',
        key_franchises: ['Epoch Baseball', 'Sylvanian Families'],
        description: 'Japan-only systems. Notable Consoles: Cassette Vision, Super Cassette Vision.'
    },
    'Casio': {
        name: 'Casio',
        founded: '1946',
        origin: 'Tokyo, Japan',
        ceo: 'Kazuhiro Kashio',
        key_franchises: ['Anime Sticker Maker'],
        description: 'Failed girls-focused console, Japan-only. Notable Consoles: Loopy.'
    },
    // MODERN HANDHELDS
    'Valve': {
        name: 'Valve',
        founded: '1996',
        origin: 'Bellevue, USA',
        ceo: 'Gabe Newell',
        key_franchises: ['Half-Life', 'Portal', 'Steam Deck'],
        description: 'PC gaming giant. Notable Devices: Steam Deck.'
    },
    'Analogue': {
        name: 'Analogue',
        founded: '2011',
        origin: 'Seattle, USA',
        ceo: 'Christopher Taber',
        key_franchises: ['Analogue Pocket', 'Super Nt'],
        description: 'Premium FPGA-based hardware clones.'
    },
    'Retroid': {
        name: 'Retroid',
        founded: '2019',
        origin: 'Shenzhen, China',
        ceo: 'N/A',
        key_franchises: ['Retroid Pocket'],
        description: 'Popular for Android-based retro gaming handhelds.'
    },
    'Anbernic': {
        name: 'Anbernic',
        founded: '2017',
        origin: 'Shenzhen, China',
        ceo: 'N/A',
        key_franchises: ['RG35XX', 'RG405'],
        description: 'Prolific manufacturer of retro handhelds.'
    },
    'Miyoo': {
        name: 'Miyoo',
        founded: '2019',
        origin: 'Shenzhen, China',
        ceo: 'N/A',
        key_franchises: ['Miyoo Mini'],
        description: 'Cult following for ultra-portable retro gaming.'
    },
    'Panic': {
        name: 'Panic',
        founded: '1997',
        origin: 'Portland, USA',
        ceo: 'Cabel Sasser',
        key_franchises: ['Playdate'],
        description: 'Unique crank-based indie gaming handheld.'
    }
};

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
    } catch (e) {
        console.error("Search failed", e);
        return [];
    }
};

export const fetchManufacturers = async (): Promise<string[]> => {
    try {
        // Now fetching from the dedicated 'manufacturers' table
        const { data, error } = await supabase.from('manufacturers').select('name').order('name');
        if (error) throw error;
        return data.map((m: any) => m.name);
    } catch (e) {
        console.warn("Falling back to unique console values due to error:", e);
        // Fallback: Get from consoles table if manufacturers table fails
        const { data } = await supabase.from('consoles').select('manufacturer');
        const brands = Array.from(new Set((data || []).map((d: any) => d.manufacturer))).sort();
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
        console.warn(`Manufacturer fetch failed for ${name}, utilizing fallback.`);
        return FALLBACK_MANUFACTURERS[name] || {
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
        console.error("Filter fetch failed", e);
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

export const compareConsoles = async (slugA: string, slugB: string): Promise<ComparisonResult | null> => {
    try {
        const { data: cA } = await supabase.from('consoles').select('*').eq('slug', slugA).single();
        const { data: cB } = await supabase.from('consoles').select('*').eq('slug', slugB).single();
        
        if(!cA || !cB) return null;

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
            image: g.image
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
