
import { z } from 'zod';

export type NewsCategory = 'Hardware' | 'Software' | 'Industry' | 'Rumor' | 'Mods' | 'Events' | 'Homebrew';

export interface NewsItem {
  headline: string;
  date: string;
  summary: string;
  category: NewsCategory;
}

export const NewsItemSchema = z.object({
  headline: z.string().min(5, "Headline too short"),
  date: z.string().optional(),
  summary: z.string().min(10, "Summary too short"),
  category: z.enum(['Hardware', 'Software', 'Industry', 'Rumor', 'Mods', 'Events', 'Homebrew']),
});

export interface ComparisonPoint {
  feature: string;
  consoleAValue: string;
  consoleBValue: string;
  winner: 'A' | 'B' | 'Tie';
  aScore?: number; // 0-100 for visual bar
  bScore?: number; // 0-100 for visual bar
}

export interface ComparisonResult {
  consoleA: string;
  consoleB: string;
  summary: string;
  points: ComparisonPoint[];
  consoleAImage?: string;
  consoleBImage?: string;
}

export interface GameOfTheWeekData {
  id?: string;
  slug?: string;
  title: string;
  developer: string;
  year: string;
  genre: string;
  content: string;
  whyItMatters: string;
  image?: string;
  rating?: number;
  console_slug?: string;
}

export const GameSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  developer: z.string().min(2, "Developer is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be 4 digits"),
  genre: z.string().min(2, "Genre is required"),
  content: z.string().min(20, "Content must be substantial"),
  whyItMatters: z.string().min(10, "Field is required"),
  rating: z.number().min(1).max(5).default(5),
  image: z.string().url("Invalid Image URL").optional().or(z.literal('')),
  console_slug: z.string().optional(),
});

export interface TimelineEvent {
  year: string;
  name: string;
  manufacturer: string;
  description: string;
}

export interface UserCollectionItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'GAME' | 'CONSOLE';
  status: 'OWN' | 'WANT';
  item_name?: string;
  item_image?: string;
}

export interface ManufacturerProfile {
  id?: string;
  name: string;
  founded: string;
  origin: string;
  description: string;
  ceo: string;
  key_franchises: string[];
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

export const ConsoleSchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().optional(),
  manufacturer: z.string().min(1, "Manufacturer required"),
  release_year: z.coerce.number().int().min(1970).max(2030),
  type: z.string().min(1),
  generation: z.coerce.number().int().min(1).max(10),
  intro_text: z.string().min(10),
  image_url: z.string().url("Invalid URL").optional().or(z.literal('')),
  // Dynamic specs are kept flexible
});

// Search & Filter Types
export interface SearchResult {
  type: 'GAME' | 'CONSOLE';
  id: string;
  slug: string;
  title: string;
  subtitle?: string; // Dev or Manu
  image?: string;
}

export interface ConsoleFilterState {
  minYear: number;
  maxYear: number;
  generations: number[];
  types: string[]; // Home, Handheld
  manufacturer?: string | null;
}
