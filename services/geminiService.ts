
import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, ConsoleDetails, UserCollectionItem } from "../types";
import { supabase } from "./supabaseClient";

// ... [Existing MOCK_NEWS, MOCK_TIMELINE, MOCK_CONSOLES etc. preserved but omitted for brevity in this output, adding new functions below] ...

const MOCK_NEWS: NewsItem[] = [
    { headline: "Test", date: "2025-11-24", summary: "Test", category: "Hardware" },
    { headline: "Nintendo PlayStation Prototype Found", date: "2015-08-01", summary: "A rare prototype of the SNES-CD add-on found in a box of junk.", category: "Hardware" },
    { headline: "Sega Announces Project Mars", date: "1994-01-01", summary: "Sega unveils the 32X add-on to extend Genesis lifecycle.", category: "Hardware" },
    { headline: "Final Fantasy VII Moves to PlayStation", date: "1996-01-12", summary: "Square breaks tradition with Nintendo, moving their flagship RPG to Sony's new CD-based console.", category: "Industry" },
    { headline: "Dreamcast Launch Date Set", date: "1999-09-09", summary: "Sega confirms 9/9/99 launch for their powerful new 128-bit system.", category: "Hardware" },
    { headline: "Rareware Acquired by Microsoft", date: "2002-09-24", summary: "The house of Donkey Kong Country and GoldenEye 007 leaves the Nintendo family.", category: "Industry" }
];

const MOCK_CONSOLES: ConsoleDetails[] = [
    {
        id: "1", name: "Sega Genesis", slug: "sega-genesis", manufacturer: "Sega", release_year: 1989, type: "Home", generation: 4,
        intro_text: "The Sega Genesis (known as Mega Drive outside NA) defined the 16-bit era with 'Blast Processing' and an edgy attitude that challenged Nintendo's dominance.",
        cpu: "Motorola 68000 @ 7.6MHz", gpu: "VDP @ 13MHz", ram: "64KB Main, 64KB VRAM", media: "ROM Cartridge", audio: "Yamaha YM2612 FM", resolution: "320x224",
        units_sold: "30.75 Million", launch_price: "$189", best_selling_game: "Sonic the Hedgehog",
        dimensions: "279 x 203 x 64 mm", weight: "2.1 kg", ports: ["2x Controller (DE-9)", "1x A/V Out", "1x RF Out", "1x Exp. Port"],
        power_supply: "External AC Adapter (9V)", connectivity: "Sega Channel (Adapter required)"
    },
    {
        id: "2", name: "Super Nintendo", slug: "snes", manufacturer: "Nintendo", release_year: 1991, type: "Home", generation: 4,
        intro_text: "The SNES brought arcade-quality graphics and sound home with Mode 7 scaling and rotation, hosting some of the greatest RPGs of all time.",
        cpu: "Ricoh 5A22 @ 3.58MHz", gpu: "PPU (Picture Processing Unit)", ram: "128KB Main, 64KB VRAM", media: "ROM Cartridge", audio: "Sony SPC700", resolution: "512x448",
        units_sold: "49.1 Million", launch_price: "$199", best_selling_game: "Super Mario World",
        dimensions: "200 x 242 x 72 mm", weight: "1.2 kg", ports: ["2x Controller", "1x Multi-Out (AV)", "1x RF Out", "1x EXT"],
        power_supply: "External AC Adapter (10V)"
    },
    {
        id: "3", name: "PlayStation", slug: "playstation", manufacturer: "Sony", release_year: 1994, type: "Home", generation: 5,
        intro_text: "Sony's debut console revolutionized gaming with real-time 3D graphics and CD-quality audio, bringing gaming to the mass market.",
        cpu: "R3000A @ 33.86MHz", gpu: "GTE (Geometry Transformation Engine)", ram: "2MB Main, 1MB VRAM", media: "CD-ROM", audio: "16-bit 24-channel ADPCM", resolution: "640x480",
        units_sold: "102.49 Million", launch_price: "$299", best_selling_game: "Gran Turismo",
        dimensions: "270 x 188 x 60 mm", weight: "1.5 kg", ports: ["2x Controller", "2x Memory Card", "1x Multi-Out", "1x Serial I/O", "1x Parallel I/O"],
        power_supply: "Internal AC"
    },
    {
        id: "4", name: "Nintendo 64", slug: "n64", manufacturer: "Nintendo", release_year: 1996, type: "Home", generation: 5,
        intro_text: "The world's first true 64-bit home system, pioneering analog control and 4-player local multiplayer.",
        cpu: "NEC VR4300 @ 93.75MHz", gpu: "SGI Reality Coprocessor", ram: "4MB RDRAM (Exp. to 8MB)", media: "ROM Cartridge", audio: "16-bit 64-channel PCM", resolution: "640x480",
        units_sold: "32.93 Million", launch_price: "$199", best_selling_game: "Super Mario 64",
        dimensions: "260 x 190 x 73 mm", weight: "1.1 kg", ports: ["4x Controller", "1x Multi-Out", "1x Memory Expansion"],
        power_supply: "External AC Adapter (3.3V/12V)"
    },
    {
        id: "5", name: "Sega Dreamcast", slug: "dreamcast", manufacturer: "Sega", release_year: 1999, type: "Home", generation: 6,
        intro_text: "The Dreamcast was ahead of its time, featuring built-in internet capabilities and arcade-perfect ports.",
        cpu: "Hitachi SH-4 @ 200MHz", gpu: "NEC PowerVR2", ram: "16MB Main, 8MB VRAM", media: "GD-ROM", audio: "Yamaha AICA", resolution: "640x480",
        units_sold: "9.13 Million", launch_price: "$199", best_selling_game: "Sonic Adventure",
        dimensions: "190 x 195.8 x 75.5 mm", weight: "1.5 kg", ports: ["4x Controller", "1x A/V Out", "1x Serial", "1x Modem Port"],
        power_supply: "Internal AC", connectivity: "56k Modem (Built-in)"
    },
    {
        id: "6", name: "Game Boy", slug: "gameboy", manufacturer: "Nintendo", release_year: 1989, type: "Handheld", generation: 4,
        intro_text: "The Game Boy proved that gameplay mattered more than graphics, dominating the handheld market for a decade.",
        cpu: "Sharp LR35902 @ 4.19MHz", gpu: "Integrated", ram: "8KB Main, 8KB VRAM", media: "ROM Cartridge", audio: "4-channel Stereo", resolution: "160x144",
        units_sold: "118.69 Million", launch_price: "$89", best_selling_game: "Tetris",
        dimensions: "90 x 148 x 32 mm", weight: "220g", display_type: "STN Dot Matrix LCD (Green/Black)",
        power_supply: "4x AA Batteries", battery_life: "15-30 Hours", ports: ["1x Link Cable", "1x Headphone Jack", "1x DC In"]
    }
];

const MOCK_TIMELINE: TimelineEvent[] = [
    { year: "1972", name: "Magnavox Odyssey", manufacturer: "Magnavox", description: "The first commercial home video game console is released." },
    { year: "1977", name: "Atari 2600", manufacturer: "Atari", description: "Popularized the use of microprocessor-based hardware and ROM cartridges." },
    { year: "1983", name: "The Video Game Crash", manufacturer: "Industry", description: "Market saturation and low-quality games lead to a massive recession in the North American video game market." },
    { year: "1985", name: "NES Launch (NA)", manufacturer: "Nintendo", description: "The Nintendo Entertainment System revitalizes the US market." },
    { year: "1989", name: "Game Boy", manufacturer: "Nintendo", description: "Portable gaming is revolutionized with interchangeable cartridges." },
    { year: "1991", name: "Street Fighter II", manufacturer: "Capcom", description: "Revolutionizes the fighting game genre in arcades." },
    { year: "1994", name: "PlayStation Launch", manufacturer: "Sony", description: "Sony enters the market and dominates with CD-based gaming." }
];

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

async function fetchWithFallback<T>(dbPromise: Promise<{ data: any, error: any }>, fallback: T): Promise<T> {
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
        MOCK_NEWS
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

export const fetchAllGames = async (): Promise<GameOfTheWeekData[]> => {
    try {
        const { data, error } = await supabase.from('games').select('*').order('year', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Failed to fetch games:", e);
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
        MOCK_TIMELINE
    );
};

export const fetchAllConsoles = async (): Promise<ConsoleDetails[]> => {
    return fetchWithFallback(
        supabase.from('consoles').select('*').order('release_year', { ascending: true }),
        MOCK_CONSOLES
    );
};

export const fetchConsoleList = async (): Promise<{name: string, slug: string}[]> => {
    try {
        const { data, error } = await supabase.from('consoles').select('name, slug').order('name');
        if (error) throw error;
        return data || [];
    } catch (e) {
        return MOCK_CONSOLES.map(c => ({ name: c.name, slug: c.slug }));
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
        return MOCK_CONSOLES.find(c => c.slug === slug) || null;
    }
};

export const compareConsoles = async (slugA: string, slugB: string): Promise<ComparisonResult | null> => {
  try {
    const fetchC1 = supabase.from('consoles').select('*').eq('slug', slugA).single();
    const fetchC2 = supabase.from('consoles').select('*').eq('slug', slugB).single();
    const [res1, res2] = await Promise.all([fetchC1, fetchC2]);

    let c1: ConsoleDetails | undefined = res1.data;
    let c2: ConsoleDetails | undefined = res2.data;

    if (!c1) c1 = MOCK_CONSOLES.find(c => c.slug === slugA);
    if (!c2) c2 = MOCK_CONSOLES.find(c => c.slug === slugB);

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
