
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
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

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string;
  verified: boolean;
}

// Phase 1: New Data Architecture for Consoles
export interface ConsoleDetails {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  release_year: number;
  release_date?: string;
  type: string; // 'Home', 'Handheld'
  generation: number;
  intro_text: string;
  image_url?: string;
  
  // Specs
  cpu: string;
  gpu: string;
  ram: string;
  media: string;
  audio: string;
  resolution: string;
  
  // Market
  units_sold: string;
  launch_price: string;
  best_selling_game: string;
}
