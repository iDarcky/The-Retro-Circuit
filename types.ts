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
