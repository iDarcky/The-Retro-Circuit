
import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, Review } from "../types";

// Configuration for Future CMS Integration
const API_BASE_URL = ''; // e.g., 'https://api.retro-circuit.com'
const USE_MOCK_DATA = true; // Toggle this to false when backend is ready

/**
 * Helper to simulate fetching from a real API with fallback.
 */
async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<T> {
  if (USE_MOCK_DATA || !API_BASE_URL) {
    // Simulate network latency for realism
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
    return fallbackData;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch from ${endpoint}, falling back to local data.`);
    return fallbackData;
  }
}

/**
 * Returns retro gaming news.
 */
export const fetchRetroNews = async (): Promise<NewsItem[]> => {
  const fallback: NewsItem[] = [
    {
      headline: "Nintendo PlayStation Prototype Discovered",
      date: "Aug 2015",
      summary: "A rare prototype of the SNES-CD add-on, developed in partnership with Sony, has reportedly been found in a box of old junk. Implications for the industry could be massive.",
      category: "Hardware"
    },
    {
      headline: "Sega Announces 'Project Mars' (32X)",
      date: "Jan 1994",
      summary: "In a bid to extend the Genesis lifecycle, Sega has unveiled the 32X add-on. Critics question if this stop-gap measure can compete with upcoming dedicated 32-bit consoles.",
      category: "Hardware"
    },
    {
      headline: "Square Soft to Abandon Nintendo for Sony?",
      date: "Jan 1996",
      summary: "Rumors are swirling that RPG giant Square may be moving development of Final Fantasy VII to Sony's PlayStation, citing cartridge storage limitations on the N64.",
      category: "Industry"
    },
    {
      headline: "Mortal Kombat Senate Hearings",
      date: "Dec 1993",
      summary: "The US Senate has launched hearings on video game violence, with Mortal Kombat and Night Trap taking center stage. A ratings board creation seems imminent.",
      category: "Industry"
    }
  ];

  return fetchWithFallback('/news', fallback);
};

/**
 * Compares two consoles.
 */
export const compareConsoles = async (consoleA: string, consoleB: string): Promise<ComparisonResult | null> => {
  // Logic remains client-side for now as it's a calculator, not just data retrieval
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const cA = consoleA.toLowerCase();
  const cB = consoleB.toLowerCase();
  
  const isSega = (s: string) => s.includes('genesis') || s.includes('mega drive');
  const isSnes = (s: string) => s.includes('snes') || s.includes('super nintendo');
  const isPs1 = (s: string) => s.includes('ps1') || s.includes('playstation') || s.includes('psx');
  const isN64 = (s: string) => s.includes('n64') || s.includes('nintendo 64');

  // Genesis vs SNES
  if ((isSega(cA) && isSnes(cB)) || (isSnes(cA) && isSega(cB))) {
    const isGenesisA = isSega(cA);
    return {
      consoleA: isGenesisA ? "Sega Genesis" : "Super Nintendo",
      consoleB: isGenesisA ? "Super Nintendo" : "Sega Genesis",
      summary: "The ultimate 16-bit console war. Sega focused on speed and attitude ('Blast Processing'), while Nintendo delivered superior colors and sound chips.",
      points: [
        { feature: "CPU Speed", consoleAValue: isGenesisA ? "7.6 MHz" : "3.58 MHz", consoleBValue: isGenesisA ? "3.58 MHz" : "7.6 MHz", winner: isGenesisA ? "A" : "B" },
        { feature: "Colors", consoleAValue: isGenesisA ? "61" : "256", consoleBValue: isGenesisA ? "256" : "61", winner: isGenesisA ? "B" : "A" },
        { feature: "Sound", consoleAValue: isGenesisA ? "FM Synth" : "Sample-based", consoleBValue: isGenesisA ? "Sample-based" : "FM Synth", winner: "Tie" },
        { feature: "Best Sonic Game", consoleAValue: isGenesisA ? "Sonic 3 & Knuckles" : "N/A", consoleBValue: isGenesisA ? "N/A" : "Sonic 3 & Knuckles", winner: isGenesisA ? "A" : "B" }
      ]
    };
  }

  // PS1 vs N64
  if ((isPs1(cA) && isN64(cB)) || (isN64(cA) && isPs1(cB))) {
    const isPs1A = isPs1(cA);
    return {
      consoleA: isPs1A ? "PlayStation" : "Nintendo 64",
      consoleB: isPs1A ? "Nintendo 64" : "PlayStation",
      summary: "The battle of 3D. Sony leveraged CD storage for cinematics and audio, while Nintendo stuck to cartridges for loading speed but sacrificed capacity.",
      points: [
        { feature: "Media", consoleAValue: isPs1A ? "CD-ROM" : "Cartridge", consoleBValue: isPs1A ? "Cartridge" : "CD-ROM", winner: isPs1A ? "A" : "B" },
        { feature: "Load Times", consoleAValue: isPs1A ? "Slow" : "Instant", consoleBValue: isPs1A ? "Instant" : "Slow", winner: isPs1A ? "B" : "A" },
        { feature: "Texture Filtering", consoleAValue: isPs1A ? "Affine" : "Bilinear", consoleBValue: isPs1A ? "Bilinear" : "Affine", winner: isPs1A ? "B" : "A" },
        { feature: "Library Size", consoleAValue: isPs1A ? "Huge" : "Small", consoleBValue: isPs1A ? "Small" : "Huge", winner: isPs1A ? "A" : "B" }
      ]
    };
  }

  // Fallback for unknown
  return {
    consoleA: consoleA,
    consoleB: consoleB,
    summary: "Historical data for this specific match-up is fragmented. Both systems have their loyal following.",
    points: [
      { feature: "Nostalgia Factor", consoleAValue: "High", consoleBValue: "High", winner: "Tie" },
      { feature: "Availability", consoleAValue: "Rare", consoleBValue: "Rare", winner: "Tie" },
      { feature: "Bit Rating", consoleAValue: "Unknown", consoleBValue: "Unknown", winner: "Tie" }
    ]
  };
};

/**
 * Returns a random retro quote.
 */
export const sendChatMessage = async (history: any[], newMessage: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const quotes = [
    "It's dangerous to go alone! Take this.",
    "Thank you Mario! But our princess is in another castle!",
    "All your base are belong to us.",
    "Do a barrel roll!",
    "War. War never changes.",
    "A winner is you!",
    "Hey! Listen!",
    "Rise and shine, Mr. Freeman. Rise and... shine.",
    "You were almost a Jill sandwich!",
    "Snake? Snake? SNAKEEEEEE!",
    "It's a secret to everybody.",
    "I am Error."
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

/**
 * Returns Game of the Week.
 */
export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData> => {
    const fallback: GameOfTheWeekData = {
        title: "Chrono Trigger",
        developer: "Square",
        year: "1995",
        genre: "JRPG",
        content: "Chrono Trigger is widely regarded as one of the greatest video games of all time. Developed by a 'Dream Team' consisting of Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest), and Akira Toriyama (Dragon Ball), it redefined the RPG genre.\n\nThe game follows Crono and his friends as they travel through time to prevent a global catastrophe caused by Lavos. With its revolutionary active time battle system, multiple endings, and intricate plot, it pushed the SNES to its absolute limits.",
        whyItMatters: "Introduced New Game+, multiple endings, and seamless battles without random encounters on a separate screen. A masterclass in pacing and sprite art."
    };
    return fetchWithFallback('/gotw', fallback);
};

/**
 * Returns timeline events.
 */
export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    const fallback: TimelineEvent[] = [
        { year: "1972", name: "Magnavox Odyssey", manufacturer: "Magnavox", description: "The first commercial home video game console. It was analog, battery-powered, and used overlays on the TV screen." },
        { year: "1977", name: "Atari 2600", manufacturer: "Atari", description: "Popularized the use of microprocessor-based hardware and ROM cartridges containing game code." },
        { year: "1983", name: "The Video Game Crash", manufacturer: "Industry Wide", description: "Oversaturation of the market with low-quality games led to a massive recession in the video game industry." },
        { year: "1985", name: "NES (North America)", manufacturer: "Nintendo", description: "Single-handedly revitalized the US video game market with the release of Super Mario Bros." },
        { year: "1989", name: "Game Boy", manufacturer: "Nintendo", description: "Defined portable gaming for a decade, proving battery life and library matter more than color screens." },
        { year: "1994", name: "PlayStation", manufacturer: "Sony", description: "Marked Sony's dominance in the market and the transition from cartridges to CD-ROMs as the standard." },
        { year: "1996", name: "Nintendo 64", manufacturer: "Nintendo", description: "Pioneered true 3D gaming with the analog stick, though it stuck to cartridges." }
    ];
    return fetchWithFallback('/timeline', fallback);
};

/**
 * Returns reviews.
 */
export const fetchInitialReviews = async (topic: string): Promise<Review[]> => {
    const fallback: Review[] = [
        { id: "1", author: "RetroGamer99", rating: 5, text: "An absolute masterpiece that defines the genre. The controls are tight and the music is unforgettable.", date: "1998", verified: true },
        { id: "2", author: "BitCruncher", rating: 4, text: "Graphics are amazing for the time, though the framerate dips occasionally.", date: "1999", verified: false },
        { id: "3", author: "CartridgeBlower", rating: 5, text: "I spent my entire summer vacation playing this. Best money I ever spent.", date: "1997", verified: true }
    ];
    return fetchWithFallback(`/reviews?topic=${topic}`, fallback);
};

/**
 * Mock moderation.
 */
export const moderateContent = async (text: string): Promise<boolean> => {
    // In a real app, this would be: await fetchWithFallback('/moderate', { text })
    await new Promise(resolve => setTimeout(resolve, 200));
    const badWords = ['badword', 'spam', 'virus'];
    return !badWords.some(word => text.toLowerCase().includes(word));
};
