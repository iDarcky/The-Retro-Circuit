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
  id?: string;
  title: string;
  developer: string;
  year: string;
  genre: string;
  content: string;
  whyItMatters: string;
  image?: string;
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
  casing?: string;
  
  // Specs
  cpu?: string;
  gpu?: string;
  ram?: string;
  media?: string;
  audio?: string;
  resolution?: string;
  display_type?: string;
  storage?: string;

  // Market
  units_sold?: string;
  launch_price?: string;
  inflation_price?: string;
  best_selling_game?: string;

  // I/O
  ports?: string[];
  power_supply?: string;
  battery_life?: string;
  connectivity?: string;
}
