
export interface NewsItem {
  headline: string;
  date: string;
  summary: string;
  category: 'Hardware' | 'Software' | 'Industry' | 'Rumor';
}

export interface ComparisonPoint {
  feature: string;
  consoleAValue: string;
  consoleBValue: string;
  winner: 'A' | 'B' | 'Tie';
}

export interface ComparisonResult {
  consoleA: string;
  consoleB: string;
  summary: string;
  points: ComparisonPoint[];
}

export interface GameOfTheWeekData {
  title: string;
  developer: string;
  year: string;
  genre: string;
  content: string;
  whyItMatters: string;
}

export interface TimelineEvent {
  year: string;
  name: string;
  manufacturer: string;
  description: string;
}

// Phase 2: GSMArena-style Deep Specs
export interface ConsoleDetails {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  release_year: number;
  release_date?: string;
  discontinued_date?: string;
  type: string; // 'Home', 'Handheld', 'Hybrid'
  generation: number;
  intro_text: string;
  image_url?: string;
  
  // Body & Design
  dimensions?: string; // e.g., "260 x 190 x 65 mm"
  weight?: string; // e.g., "1.5 kg"
  casing?: string; // e.g., "Plastic, Matte Black"
  
  // Core Specs
  cpu: string;
  gpu: string;
  ram: string;
  storage?: string; // Built-in storage or memory card
  
  // Display (For handhelds/Output for home)
  resolution: string;
  display_type?: string; // e.g., "STN LCD", "OLED" (for handhelds)
  
  // Audio & Media
  media: string;
  audio: string;
  
  // Connectivity
  ports?: string[]; // e.g. ["2x Controller", "AV Out", "RF"]
  connectivity?: string; // e.g. "Link Cable", "Online Adapter"
  
  // Power
  power_supply?: string; // e.g. "AC Adapter 9V", "4x AA Batteries"
  battery_life?: string; // For handhelds
  
  // Market Data
  units_sold: string;
  launch_price: string;
  inflation_price?: string; // Calculated price today
  best_selling_game: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}
