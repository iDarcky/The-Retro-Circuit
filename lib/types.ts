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

export interface UserProfile {
  id: string;
  username: string;
  role: 'user' | 'admin';
  avatar_id: string;
  updated_at?: string;
}

export interface ManufacturerProfile {
  name: string;
  founded: string;
  origin: string;
  ceo?: string;
  key_franchises: string[];
  description: string;
}

// -- NEW DB STRUCTURE TYPES --

export interface Manufacturer {
  id: string;
  name: string;
  founded_year: string;
  origin_country: string;
  website?: string;
  description: string;
  key_franchises: string[];
  logo_url?: string;
}

export const ManufacturerSchema = z.object({
  name: z.string().min(1, "Name required"),
  founded_year: z.string(),
  origin_country: z.string(),
  website: z.string().optional(),
  description: z.string().min(10),
  key_franchises: z.string().transform(str => str.split(',').map(s => s.trim())), // Input as comma string, convert to array
  logo_url: z.string().optional()
});

export interface ConsoleSpecs {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display_type?: string;
  resolution?: string;
  media?: string;
  ports?: string;
  connectivity?: string;
  dimensions?: string;
  weight?: string;
  battery_life?: string;
  power_supply?: string;
  launch_price?: string;
  launch_price_inflation?: string;
  units_sold?: string;
  best_selling_game?: string;
}

export interface Console {
  id: string;
  manufacturer_id: string;
  name: string;
  slug: string;
  release_year: number;
  generation: string;
  form_factor: string; // Home, Handheld, Hybrid
  image_url?: string;
  description: string;
}

// Joined Type for UI
export interface ConsoleDetails extends Console {
  manufacturer: Manufacturer; // Joined
  specs: ConsoleSpecs; // Joined
}

export const ConsoleSchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().optional(),
  manufacturer_id: z.string().uuid("Invalid Manufacturer"),
  release_year: z.coerce.number().int().min(1970).max(2030),
  generation: z.string(),
  form_factor: z.string(),
  image_url: z.string().optional(),
  description: z.string().min(10),
  // Specs are passed as a separate object in admin, but validated loosely here or separately
});

export const ConsoleSpecsSchema = z.object({
  cpu: z.string().optional(),
  gpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  display_type: z.string().optional(),
  resolution: z.string().optional(),
  media: z.string().optional(),
  ports: z.string().optional(),
  connectivity: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  battery_life: z.string().optional(),
  power_supply: z.string().optional(),
  launch_price: z.string().optional(),
  launch_price_inflation: z.string().optional(),
  units_sold: z.string().optional(),
  best_selling_game: z.string().optional(),
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
  generations: string[]; // Changed to string for flexibility
  form_factors: string[]; // Changed from 'types' to match DB 'form_factor'
  manufacturer_id?: string | null;
}