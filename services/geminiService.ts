import { NewsItem, ComparisonResult, GameOfTheWeekData, TimelineEvent, Review } from "../types";

// MOCK DATA STORES

const MOCK_NEWS: NewsItem[] = [
    {
      headline: "Nintendo PlayStation Prototype Discovered",
      date: "Aug 2015",
      summary: "A rare prototype of the SNES-CD add-on, developed in partnership with Sony, has reportedly been found in a box of old junk.",
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

const MOCK_GAME_OF_THE_WEEK: GameOfTheWeekData = {
    title: "Chrono Trigger",
    developer: "Square",
    year: "1995",
    genre: "JRPG",
    content: "Chrono Trigger is widely regarded as one of the greatest video games of all time. Developed by a 'Dream Team' consisting of Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest), and Akira Toriyama (Dragon Ball), it redefined the RPG genre.\n\nThe game follows Crono and his friends as they travel through time to prevent a global catastrophe caused by Lavos.",
    whyItMatters: "Introduced New Game+, multiple endings, and seamless battles without random encounters on a separate screen."
};

const MOCK_REVIEWS: Review[] = [
    { id: '1', author: 'RetroGamer88', rating: 5, text: `I remember playing this when it first came out. A true classic! The soundtrack is unforgettable.`, date: '199X', verified: true },
    { id: '2', author: 'BitMaster', rating: 4, text: "Gameplay holds up well, but the graphics are a bit dated now. Still worth a playthrough.", date: '200X', verified: false },
    { id: '3', author: 'PolygonPolygon', rating: 5, text: "Best game of the 16-bit era. No contest.", date: 'Yesterday', verified: true }
];

const MOCK_TIMELINE: TimelineEvent[] = [
    { year: "1972", name: "Magnavox Odyssey", manufacturer: "Magnavox", description: "The first commercial home video game console. It was analog, battery-powered, and used overlays on the TV screen." },
    { year: "1977", name: "Atari 2600", manufacturer: "Atari", description: "Popularized the use of microprocessor-based hardware and ROM cartridges containing game code." },
    { year: "1983", name: "The Video Game Crash", manufacturer: "Industry Wide", description: "Oversaturation of the market with low-quality games led to a massive recession in the video game industry." },
    { year: "1985", name: "NES (North America)", manufacturer: "Nintendo", description: "Single-handedly revitalized the US video game market with the release of Super Mario Bros." },
    { year: "1989", name: "Game Boy", manufacturer: "Nintendo", description: "Defined portable gaming for a decade, proving battery life and library matter more than color screens." },
    { year: "1994", name: "PlayStation", manufacturer: "Sony", description: "Marked Sony's dominance in the market and the transition from cartridges to CD-ROMs as the standard." },
    { year: "1996", name: "Nintendo 64", manufacturer: "Nintendo", description: "Pioneered true 3D gaming with the analog stick, though it stuck to cartridges." },
    { year: "2000", name: "PlayStation 2", manufacturer: "Sony", description: "The best-selling console of all time, doubling as a DVD player." },
    { year: "2001", name: "Xbox", manufacturer: "Microsoft", description: "Microsoft's entry into the console market, featuring a built-in hard drive and Halo." }
];

/**
 * Returns retro gaming news (Mock Data).
 */
export const fetchRetroNews = async (): Promise<NewsItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_NEWS;
};

/**
 * Compares two consoles (Mock Data for Visualization).
 */
export const compareConsoles = async (consoleA: string, consoleB: string): Promise<ComparisonResult | null> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a static comparison regardless of input for visualization purposes
  return {
    consoleA: consoleA || "Sega Genesis",
    consoleB: consoleB || "Super Nintendo",
    summary: "The 16-bit console war was a defining moment in gaming history. Sega marketed 'Blast Processing' and edgy attitude, while Nintendo focused on color palette, sound quality, and exclusive IP.",
    points: [
      { feature: "CPU Speed", consoleAValue: "7.6 MHz (68000)", consoleBValue: "3.58 MHz (65816)", winner: "A" },
      { feature: "Colors on Screen", consoleAValue: "61 Colors", consoleBValue: "256 Colors", winner: "B" },
      { feature: "Sound Chip", consoleAValue: "Yamaha YM2612 (FM)", consoleBValue: "Sony SPC700 (Sample)", winner: "B" },
      { feature: "Resolution", consoleAValue: "320 x 224", consoleBValue: "256 x 224", winner: "A" },
      { feature: "Best Selling Game", consoleAValue: "Sonic the Hedgehog", consoleBValue: "Super Mario World", winner: "Tie" }
    ]
  };
};

/**
 * Chat with Retro Sage (Mock Response).
 */
export const sendChatMessage = async (history: any[], newMessage: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
      "I AM ACCESSING MY DATA BANKS... YES, THE KONAMI CODE IS UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, B, A.",
      "IN 1983, ATARI BURIED THOUSANDS OF E.T. CARTRIDGES IN A LANDFILL IN ALAMOGORDO, NEW MEXICO.",
      "THE SEGA DREAMCAST WAS AHEAD OF ITS TIME, FEATURING BUILT-IN ONLINE PLAY CAPABILITIES.",
      "PLEASE INSERT COIN TO CONTINUE THIS QUERY."
  ];
  
  // Return a random retro fact
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Returns Game of the Week (Mock Data).
 */
export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_GAME_OF_THE_WEEK;
};

/**
 * Returns timeline events (Mock Data).
 */
export const fetchTimelineData = async (): Promise<TimelineEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TIMELINE;
};

/**
 * Fetches initial reviews for a given topic (Mock Data).
 */
export const fetchInitialReviews = async (topic: string): Promise<Review[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_REVIEWS;
};

/**
 * Moderates content (Mock Logic - Always True).
 */
export const moderateContent = async (text: string): Promise<boolean> => {
  // Simple bad word filter simulation
  const badWords = ['badword', 'spam', 'virus'];
  const hasBadWord = badWords.some(word => text.toLowerCase().includes(word));
  
  return !hasBadWord;
};