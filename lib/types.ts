
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

export interface SearchResult {
    type: 'GAME' | 'CONSOLE';
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    image?: string;
}

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

// -- DB STRUCTURE TYPES --

// Table: manufacturer
export interface Manufacturer {
  id: string;             // UUID
  name: string;           // Required Text
  slug: string;           // Unique Required Text
  description: string;    // Multiline Text
  country: string;        // Text
  founded_year: number;   // Integer
  website?: string;       // Text (URL)
  key_franchises: string; // Text (Comma-separated)
  image_url?: string;     // Text (URL)
}

export const ManufacturerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name Required"),
  slug: z.string().min(1, "Slug Required"),
  description: z.string().min(10, "Description Required"),
  country: z.string().min(2, "Country Required"),
  founded_year: z.coerce.number().min(1800).max(2100),
  website: z.string().url().optional().or(z.literal('')),
  key_franchises: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

export const MANUFACTURER_FORM_FIELDS = [
  { label: 'Company Name', key: 'name', type: 'text', required: true },
  { label: 'Slug (Unique)', key: 'slug', type: 'text', required: true },
  { label: 'Founded Year', key: 'founded_year', type: 'number', required: true },
  { label: 'Country', key: 'country', type: 'text', required: true },
  { label: 'Website URL', key: 'website', type: 'url', required: false },
  { label: 'Image URL', key: 'image_url', type: 'url', required: false },
  { label: 'Key Franchises', key: 'key_franchises', type: 'text', required: false },
  { label: 'Description', key: 'description', type: 'textarea', required: true },
];

// DEPRECATED: ConsoleSpecs is no longer used for new entries. 
// All specs are now in ConsoleVariant. Kept for type safety on legacy reads if needed.
export interface ConsoleSpecs {
  id?: string;
  console_id?: string;
  // Legacy fields...
  [key: string]: any; 
}

// Table: console_variants (Now holds ALL specs)
export interface ConsoleVariant {
  id: string;
  console_id: string;
  variant_name: string;
  slug?: string;
  release_year?: number;
  is_default: boolean;
  image_url?: string; 

  // Core Tech
  cpu_model?: string;
  cpu_cores?: number;
  cpu_threads?: number;
  cpu_clock_mhz?: number;
  gpu_model?: string;
  gpu_cores?: number;
  gpu_clock_mhz?: number;
  os?: string;
  tdp_range_w?: string;

  // Memory & Storage
  ram_gb?: number;
  ram_type?: string;     // e.g. LPDDR5
  ram_speed_mhz?: number; // e.g. 6400
  storage_gb?: number;
  storage_type?: string; // e.g. NVMe SSD, eMMC
  storage_expandable?: boolean;
  
  // Display
  screen_size_inch?: number;
  screen_resolution_x?: number;
  screen_resolution_y?: number;
  display_type?: string; // e.g. OLED, LCD
  display_tech?: string; // e.g. VRR, FreeSync
  resolution_pixel_density?: number;
  refresh_rate_hz?: number; 
  brightness_nits?: number; 
  
  // Controls & IO
  input_layout?: string;
  dpad_type?: string;
  analog_stick_type?: string;
  shoulder_buttons?: string;
  has_back_buttons?: boolean;
  ports?: string;
  connectivity?: string;

  // Multimedia
  audio_speakers?: string;
  audio_tech?: string;
  haptics?: string;
  gyro?: boolean;

  // Power & Physical
  weight_g?: number;
  battery_mah?: number;
  battery_wh?: number; 
  
  // Misc
  price_launch_usd?: number;
}

export const ConsoleVariantSchema = z.object({
  console_id: z.string().uuid(),
  variant_name: z.string().min(1, "Name required"),
  slug: z.string().optional(),
  release_year: z.coerce.number().optional(),
  is_default: z.boolean().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  
  // Core
  cpu_model: z.string().optional(),
  cpu_cores: z.coerce.number().optional(),
  cpu_threads: z.coerce.number().optional(),
  cpu_clock_mhz: z.coerce.number().optional(),
  gpu_model: z.string().optional(),
  gpu_cores: z.coerce.number().optional(),
  gpu_clock_mhz: z.coerce.number().optional(),
  os: z.string().optional(),
  tdp_range_w: z.string().optional(),

  // Memory
  price_launch_usd: z.coerce.number().optional(),
  ram_gb: z.coerce.number().optional(),
  ram_type: z.string().optional(),
  ram_speed_mhz: z.coerce.number().optional(),
  storage_gb: z.coerce.number().optional(),
  storage_type: z.string().optional(),
  storage_expandable: z.boolean().optional(),
  
  // Display
  screen_size_inch: z.coerce.number().optional(),
  screen_resolution_x: z.coerce.number().optional(),
  screen_resolution_y: z.coerce.number().optional(),
  display_type: z.string().optional(),
  display_tech: z.string().optional(),
  resolution_pixel_density: z.coerce.number().optional(),
  refresh_rate_hz: z.coerce.number().optional(), 
  brightness_nits: z.coerce.number().optional(), 
  
  // Controls
  input_layout: z.string().optional(),
  dpad_type: z.string().optional(),
  analog_stick_type: z.string().optional(),
  shoulder_buttons: z.string().optional(),
  has_back_buttons: z.boolean().optional(),
  ports: z.string().optional(),
  connectivity: z.string().optional(),

  // Multimedia
  audio_speakers: z.string().optional(),
  audio_tech: z.string().optional(),
  haptics: z.string().optional(),
  gyro: z.boolean().optional(),

  // Power
  weight_g: z.coerce.number().optional(),
  battery_mah: z.coerce.number().optional(),
  battery_wh: z.coerce.number().optional(), 
});

export const VARIANT_FORM_GROUPS = [
    {
        title: "Identity & Market",
        fields: [
            { label: 'Variant Name (e.g. Pro)', key: 'variant_name', type: 'text', required: true },
            { label: 'Release Year', key: 'release_year', type: 'number' },
            { label: 'Launch Price ($)', key: 'price_launch_usd', type: 'number' },
            { label: 'Is Default Model?', key: 'is_default', type: 'checkbox' },
            { label: 'Image URL', key: 'image_url', type: 'url' },
        ]
    },
    {
        title: "Silicon Core",
        fields: [
            { label: 'CPU Model', key: 'cpu_model', type: 'text' },
            { label: 'GPU Model', key: 'gpu_model', type: 'text' },
            { label: 'CPU Cores', key: 'cpu_cores', type: 'number' },
            { label: 'CPU Threads', key: 'cpu_threads', type: 'number' },
            { label: 'CPU Clock (MHz)', key: 'cpu_clock_mhz', type: 'number' },
            { label: 'GPU Cores', key: 'gpu_cores', type: 'number' },
            { label: 'GPU Clock (MHz)', key: 'gpu_clock_mhz', type: 'number' },
            { label: 'OS', key: 'os', type: 'text' },
            { label: 'TDP Range', key: 'tdp_range_w', type: 'text' },
        ]
    },
    {
        title: "Memory & Storage",
        fields: [
            { label: 'RAM Size (GB)', key: 'ram_gb', type: 'number' },
            { label: 'RAM Tech (LPDDR5)', key: 'ram_type', type: 'text' },
            { label: 'RAM Speed (MHz)', key: 'ram_speed_mhz', type: 'number' },
            { label: 'Storage (GB)', key: 'storage_gb', type: 'number' },
            { label: 'Storage Type', key: 'storage_type', type: 'text' },
            { label: 'SD Slot?', key: 'storage_expandable', type: 'checkbox' },
        ]
    },
    {
        title: "Display Technology",
        fields: [
            { label: 'Screen Size (inch)', key: 'screen_size_inch', type: 'number', step: '0.1' },
            { label: 'Resolution X', key: 'screen_resolution_x', type: 'number' },
            { label: 'Resolution Y', key: 'screen_resolution_y', type: 'number' },
            { label: 'Panel Type (OLED)', key: 'display_type', type: 'text' },
            { label: 'Tech (VRR)', key: 'display_tech', type: 'text' },
            { label: 'Refresh (Hz)', key: 'refresh_rate_hz', type: 'number' },
            { label: 'Nits', key: 'brightness_nits', type: 'number' },
            { label: 'PPI', key: 'resolution_pixel_density', type: 'number' },
        ]
    },
    {
        title: "Controls & IO",
        fields: [
            { label: 'Input Layout', key: 'input_layout', type: 'text' },
            { label: 'D-Pad Style', key: 'dpad_type', type: 'text' },
            { label: 'Sticks (Hall Effect)', key: 'analog_stick_type', type: 'text' },
            { label: 'Triggers', key: 'shoulder_buttons', type: 'text' },
            { label: 'Back Buttons?', key: 'has_back_buttons', type: 'checkbox' },
            { label: 'Ports', key: 'ports', type: 'text' },
            { label: 'Connectivity', key: 'connectivity', type: 'text' },
        ]
    },
    {
        title: "Multimedia & Immersion",
        fields: [
            { label: 'Speakers', key: 'audio_speakers', type: 'text' },
            { label: 'Audio Tech', key: 'audio_tech', type: 'text' },
            { label: 'Haptics', key: 'haptics', type: 'text' },
            { label: 'Gyroscope?', key: 'gyro', type: 'checkbox' },
        ]
    },
    {
        title: "Power & Physical",
        fields: [
            { label: 'Battery (mAh)', key: 'battery_mah', type: 'number' },
            { label: 'Battery (Wh)', key: 'battery_wh', type: 'number', step: '0.1' },
            { label: 'Weight (g)', key: 'weight_g', type: 'number' },
        ]
    }
];

// Table: console
export interface ConsoleDetails {
  id: string;
  name: string;
  slug: string;
  manufacturer_id: string;
  release_year?: string; // Optional now
  generation?: string;
  form_factor?: string;
  media?: string;
  description?: string;
  image_url?: string;
  units_sold?: string;
  best_selling_game?: string;
  
  // Relations
  manufacturer?: Manufacturer;
  // Legacy support for reads, but writes should assume empty
  specs: ConsoleSpecs; 
  variants?: ConsoleVariant[];
}

export const ConsoleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  manufacturer_id: z.string().uuid(),
  release_year: z.string().regex(/^\d{4}$/).optional(),
  generation: z.string().optional(),
  form_factor: z.string().optional(),
  media: z.string().optional(),
  units_sold: z.string().optional(),
  best_selling_game: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

export const CONSOLE_FORM_FIELDS = [
  { label: 'Console Name', key: 'name', type: 'text', required: true },
  { label: 'Slug (Unique)', key: 'slug', type: 'text', required: true },
  // Release Year Removed for Folder Creation
  { label: 'Image URL (Main)', key: 'image_url', type: 'url', required: false },
  { label: 'Description', key: 'description', type: 'textarea', required: false },
];

export interface ConsoleFilterState {
  minYear: number;
  maxYear: number;
  generations: string[];
  form_factors: string[];
  manufacturer_id: string | null;
}
