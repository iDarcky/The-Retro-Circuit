
import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, Review, ConsoleDetails } from "../types";
import { supabase } from "./supabaseClient";

/**
 * MOCK DATA STORE (FALLBACK MODE)
 * These act as the "Simulation" data when the main database is unreachable.
 */

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

const MOCK_GOTW: GameOfTheWeekData = {
    title: "Chrono Trigger",
    developer: "Square",
    year: "1995",
    genre: "RPG",
    content: "A dream team of creators—Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest), and Akira Toriyama (Dragon Ball)—joined forces to create what many consider the perfect RPG. With its unique time-travel mechanic, seamless battle transitions, and multiple endings, Chrono Trigger pushed the SNES to its absolute limits.",
    whyItMatters: "Introduced New Game+ and multiple endings to the mainstream. The 'Active Time Battle' version 2.0 refined turn-based combat, and the soundtrack by Yasunori Mitsuda remains legendary."
};

const MOCK_TIMELINE: TimelineEvent[] = [
    { year: "1972", name: "Magnavox Odyssey", manufacturer: "Magnavox", description: "The first commercial home video game console is released." },
    { year: "1977", name: "Atari 2600", manufacturer: "Atari", description: "Popularized the use of microprocessor-based hardware and ROM cartridges." },
    { year: "1983", name: "The Video Game Crash", manufacturer: "Industry", description: "Market saturation and low-quality games lead to a massive recession in the North American video game market." },
    { year: "1985", name: "NES Launch (NA)", manufacturer: "Nintendo", description: "The Nintendo Entertainment System revitalizes the US market." },
    { year: "1989", name: "Game Boy", manufacturer: "Nintendo", description: "Portable gaming is revolutionized with interchangeable cartridges." },
    { year: "1991", name: "Street Fighter II", manufacturer: "Capcom", description: "Revolutionizes the fighting game genre in arcades." },
    { year: "1994", name: "PlayStation Launch", manufacturer: "Sony", description: "Sony enters the market and dominates with CD-based gaming." }
];

const MOCK_REVIEWS: Review[] = [
    { id: "1", author: "RetroGamer99", rating: 5, text: "The Sega Dreamcast was ahead of its time. Online play in 1999!", date: "10/24/2023", verified: true },
    { id: "2", author: "NintyFan", rating: 4, text: "N64 controller was weird, but Mario 64 changed everything.", date: "11/02/2023", verified: false },
    { id: "3", author: "SonyPony", rating: 5, text: "PS2 library is unmatched. Best DVD player ever too.", date: "12/15/2023", verified: true }
];

// HELPER: Fallback Fetcher
// Tries to execute the DB promise, but returns fallback data if it fails, times out (1500ms), or returns empty data when expected.
async function fetchWithFallback<T>(dbPromise: Promise<{ data: any, error: any }>, fallback: T): Promise<T> {
    try {
        const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) => 
            setTimeout(() => reject(new Error("Request Timed Out")), 1500)
        );

        // We race the DB call against a timeout
        const { data, error } = await Promise.race([dbPromise, timeoutPromise]);
        
        if (error || !data) {
             throw new Error("DB Error or Empty Data");
        }
        
        // Handle array check if fallback is array (if DB returns empty array, usually we want to show mock data in this demo)
        if (Array.isArray(fallback) && Array.isArray(data) && data.length === 0) {
             throw new Error("Empty Array Returned - Switching to Simulation Mode");
        }

        return data as T;
    } catch (err) {
        console.warn("Connection unstable or empty, loading simulation data.");
        return fallback;
    }
}

/**
 * Checks if the connection to Supabase is working
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        // Simple check to a publicly accessible table or just checking if client throws
        const { error } = await supabase.from('news').select('count', { count: 'exact', head: true });
        return !error;
    } catch (e) {
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
        const redirectTo = window.location.origin;
        return await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: { username, full_name: username }
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
    }
};

/**
 * Returns retro gaming news from Supabase (with Fallback)
 */
export const fetchRetroNews = async (): Promise<NewsItem[]> => {
    return fetchWithFallback(
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        MOCK_NEWS
    );
};

/**
 * Inserts a new news item into Supabase
 */
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

/**
 * Returns Game of the Week from Supabase (with Fallback)
 */
export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData | null> => {
  try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject("Timeout"), 1500));
      const dbPromise = supabase.from('game_of_the_week').select('*').limit(1).single();
      
      const { data, error } = await Promise.race([dbPromise, timeoutPromise]) as any;

      if (error || !data) throw new Error("GOTW Not Found");
      return {
          title: data.title,
          developer: data.developer,
          year: data.year,
          genre: data.genre,
          content: data.content,
          whyItMatters: data.why_it_matters
      };
  } catch (e) {
      console.warn("Using Mock GOTW");
      return MOCK_GOTW;
  }
};

/**
 * Returns timeline events from Supabase (with Fallback)
 */
export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    return fetchWithFallback(
        supabase.from('timeline').select('*').order('year', { ascending: true }),
        MOCK_TIMELINE
    );
};

/**
 * Fetches reviews from Supabase (with Fallback)
 */
export const fetchInitialReviews = async (topic: string): Promise<Review[]> => {
  try {
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (topic && topic !== 'ALL REVIEWS') {
        query = query.ilike('text', `%${topic}%`);
      }
      
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject("Timeout"), 1500));
      const { data, error } = await Promise.race([query, timeoutPromise]) as any;

      if (error || !data || data.length === 0) throw new Error("Reviews Empty");
      return (data as Review[]);
  } catch (err) {
      console.warn("Using Mock Review Data");
      if (topic && topic !== 'ALL REVIEWS') {
          return MOCK_REVIEWS.filter(r => r.text.toLowerCase().includes(topic.toLowerCase()));
      }
      return MOCK_REVIEWS;
  }
};

/**
 * Submits a new review to Supabase
 */
export const submitReviewToDB = async (review: Review): Promise<boolean> => {
    try {
        const { error } = await supabase.from('reviews').insert([{
            author: review.author,
            rating: review.rating,
            text: review.text,
            date: review.date,
            verified: review.verified,
            console_id: review.consoleId
        }]);
        return !error;
    } catch (err) {
        return false;
    }
};

/**
 * CONSOLE DATA API
 * Fetches the list of all consoles for the 'Finder' (with Fallback)
 */
export const fetchAllConsoles = async (): Promise<ConsoleDetails[]> => {
    return fetchWithFallback(
        supabase.from('consoles').select('*').order('release_year', { ascending: true }),
        MOCK_CONSOLES
    );
};

/**
 * CONSOLE DATA API
 * Fetches a single console by its URL slug (with Fallback)
 */
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

/**
 * Compares two consoles using Supabase Data with fallback to Mock
 */
export const compareConsoles = async (consoleA: string, consoleB: string): Promise<ComparisonResult | null> => {
  try {
    // Attempt to fetch from DB
    // We use ilike for case-insensitive matching on name or exact on slug
    const fetchC1 = supabase.from('consoles').select('*').or(`name.ilike.%${consoleA}%,slug.eq.${consoleA.toLowerCase()}`).limit(1).single();
    const fetchC2 = supabase.from('consoles').select('*').or(`name.ilike.%${consoleB}%,slug.eq.${consoleB.toLowerCase()}`).limit(1).single();

    const [res1, res2] = await Promise.all([fetchC1, fetchC2]);

    let c1: ConsoleDetails | undefined = res1.data;
    let c2: ConsoleDetails | undefined = res2.data;

    // Fallback to MOCK if DB misses
    if (!c1) {
        c1 = MOCK_CONSOLES.find(c => c.name.toLowerCase().includes(consoleA.toLowerCase()) || c.slug === consoleA.toLowerCase());
    }
    if (!c2) {
        c2 = MOCK_CONSOLES.find(c => c.name.toLowerCase().includes(consoleB.toLowerCase()) || c.slug === consoleB.toLowerCase());
    }

    if (c1 && c2) {
         return {
            consoleA: c1.name,
            consoleB: c2.name,
            summary: `Comparison generated for ${c1.name} and ${c2.name}.`,
            points: [
                { feature: "Release Year", consoleAValue: c1.release_year.toString(), consoleBValue: c2.release_year.toString(), winner: c1.release_year < c2.release_year ? 'A' : 'B' }, 
                { feature: "CPU", consoleAValue: c1.cpu, consoleBValue: c2.cpu, winner: "Tie" },
                { feature: "Resolution", consoleAValue: c1.resolution, consoleBValue: c2.resolution, winner: "Tie" },
                { feature: "Media", consoleAValue: c1.media, consoleBValue: c2.media, winner: "Tie" },
                { feature: "Units Sold", consoleAValue: c1.units_sold, consoleBValue: c2.units_sold, winner: parseInt(c1.units_sold) > parseInt(c2.units_sold) ? 'A' : 'B' }
            ]
        };
    }

    // Fallback if names don't match anything
    return {
        consoleA: consoleA,
        consoleB: consoleB,
        summary: `DATA MISSING: COULD NOT LOCATE FULL SCHEMATICS FOR ${consoleA} OR ${consoleB}.`,
        points: []
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
    await new Promise(resolve => setTimeout(resolve, 800));
    return `[SYSTEM MESSAGE] THE RETRO SAGE IS CURRENTLY OPERATING IN OFFLINE MODE. I CANNOT PROCESS "${newMessage.toUpperCase()}" LIVE. PLEASE TRY AGAIN LATER.`;
  } catch (error) {
      return "SYSTEM ERROR: THE SAGE IS OFFLINE.";
  }
};

/**
 * Moderates content
 */
export const moderateContent = async (text: string): Promise<boolean> => {
  const badWords = ['badword', 'spam', 'virus'];
  const hasBadWord = badWords.some(word => text.toLowerCase().includes(word));
  return !hasBadWord;
};
