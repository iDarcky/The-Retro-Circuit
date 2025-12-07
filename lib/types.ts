
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
  title: z.string().min(1, "Title is required"),
  developer: z.string().min(1, "Developer is required"),
  year: z.string().min(4, "Year must be 4 digits"),
  genre: z.string().min(1, "Genre is required"),
  content: z.string().min(10, "Review content must be longer"),
  whyItMatters: z.string().min(10, "Analysis must be longer"),
  rating: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  image: z.string().optional().or(z.literal('')),
  console_slug: z.string().optional().or(z.literal('')),
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
  name: z.string().optional().or(z.literal('')),
  slug: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  founded_year: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  website: z.string().optional().or(z.literal('')),
  key_franchises: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
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

export const ConsoleSchema = z.object({
    manufacturer_id: z.string().optional().or(z.literal('')),
    name: z.string().optional().or(z.literal('')),
    slug: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    // Relaxed from enum to string to allow legacy types
    type: z.string().optional().or(z.literal('')),
    generation: z.string().optional().or(z.literal('')),
    // Numeric safety
    release_year: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()), 
    units_sold: z.string().optional().or(z.literal('')),
    image_url: z.string().optional().or(z.literal('')),
    form_factor: z.string().optional().or(z.literal('')),
});

export const CONSOLE_FORM_FIELDS = [
    { label: 'Console Name', key: 'name', type: 'text', required: true },
    { label: 'Slug (Auto)', key: 'slug', type: 'text', required: false },
    { label: 'Type', key: 'type', type: 'text', required: false }, // Should be dropdown ideally
    { label: 'Generation', key: 'generation', type: 'text', required: false },
    { label: 'Form Factor', key: 'form_factor', type: 'text', required: false },
    { label: 'Legacy Release Year', key: 'release_year', type: 'number', required: false },
    { label: 'Lifetime Sales', key: 'units_sold', type: 'text', required: false },
    { label: 'Description', key: 'description', type: 'textarea', required: false },
    { label: 'Main Image URL', key: 'image_url', type: 'url', required: false },
];

export interface ConsoleFilterState {
    minYear: number;
    maxYear: number;
    generations: string[];
    form_factors: string[];
    manufacturer_id: string | null;
}

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
  model_no?: string;
  price_launch_usd?: number;

  // Core Tech
  cpu_model?: string;
  cpu_architecture?: string; 
  cpu_process_node?: string; 
  cpu_cores?: number;
  cpu_threads?: number;
  cpu_clock_mhz?: number;
  gpu_model?: string;
  gpu_architecture?: string; 
  gpu_cores?: number;
  gpu_core_unit?: string;
  gpu_clock_mhz?: number;
  gpu_teraflops?: number; 
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
  touchscreen?: boolean; 
  aspect_ratio?: string; 
  resolution_pixel_density?: number;
  ppi?: number; 
  refresh_rate_hz?: number; 
  brightness_nits?: number; 

  // Dual Screen
  second_screen_size?: number;
  second_screen_resolution_x?: number;
  second_screen_resolution_y?: number;
  second_screen_touch?: boolean;
  
  // Controls & IO
  input_layout?: string;
  dpad_type?: string;
  analog_stick_type?: string;
  shoulder_buttons?: string;
  has_back_buttons?: boolean;
  ports?: string;
  connectivity?: string;
  wireless_connectivity?: string;
  cellular_connectivity?: boolean;
  video_out?: string;
  haptics?: boolean;
  gyro?: boolean;
  
  // Audio & Media
  audio_speakers?: string;
  audio_tech?: string;
  headphone_jack?: boolean;
  microphone?: boolean;
  camera?: string;
  biometrics?: string;

  // Power & Body
  battery_mah?: number;
  battery_wh?: number;
  charging_speed_w?: number;
  charging_port?: string;
  dimensions?: string;
  weight_g?: number;
  body_material?: string;
  cooling?: string;
  colors?: string;
  ui_skin?: string;
}

export interface ConsoleDetails {
    id: string;
    manufacturer_id: string;
    name: string;
    slug: string;
    description?: string;
    type?: string;
    generation?: string;
    release_year?: number;
    units_sold?: string;
    image_url?: string;
    form_factor?: string;
    manufacturer?: Manufacturer;
    variants?: ConsoleVariant[];
    specs?: ConsoleSpecs | Partial<ConsoleVariant>;
}

// Zod Schema for Variants
// Relaxed Validation: Only Identity fields required. Everything else optional/nullable.
export const ConsoleVariantSchema = z.object({
  id: z.string().optional(),
  console_id: z.string().optional().or(z.literal('')),
  variant_name: z.string().optional().or(z.literal('')),
  slug: z.string().optional().or(z.literal('')),
  
  // Booleans with preprocessing to handle nulls
  is_default: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
  
  // Relaxed Identity Fields (Optional for Legacy/Drafts)
  release_year: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  price_launch_usd: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),

  // Optional Identity
  model_no: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),

  // Silicon (Optional)
  cpu_model: z.string().optional().or(z.literal('')),
  cpu_architecture: z.string().optional().or(z.literal('')),
  cpu_process_node: z.string().optional().or(z.literal('')),
  cpu_cores: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  cpu_threads: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  cpu_clock_mhz: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  
  gpu_model: z.string().optional().or(z.literal('')),
  gpu_architecture: z.string().optional().or(z.literal('')),
  gpu_cores: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  gpu_core_unit: z.string().optional().or(z.literal('')),
  gpu_clock_mhz: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  gpu_teraflops: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  
  os: z.string().optional().or(z.literal('')),
  tdp_range_w: z.string().optional().or(z.literal('')),

  // Memory (Optional)
  ram_gb: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  ram_type: z.string().optional().or(z.literal('')),
  ram_speed_mhz: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  
  storage_gb: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  storage_type: z.string().optional().or(z.literal('')),
  storage_expandable: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),

  // Display (Optional)
  screen_size_inch: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  screen_resolution_x: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  screen_resolution_y: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  display_type: z.string().optional().or(z.literal('')),
  display_tech: z.string().optional().or(z.literal('')),
  touchscreen: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
  aspect_ratio: z.string().optional().or(z.literal('')),
  ppi: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  refresh_rate_hz: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  brightness_nits: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),

  second_screen_size: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  second_screen_resolution_x: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  second_screen_resolution_y: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  second_screen_touch: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),

  // Input & Connectivity (Optional)
  input_layout: z.string().optional().or(z.literal('')),
  dpad_type: z.string().optional().or(z.literal('')),
  analog_stick_type: z.string().optional().or(z.literal('')),
  shoulder_buttons: z.string().optional().or(z.literal('')),
  has_back_buttons: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
  ports: z.string().optional().or(z.literal('')),
  wireless_connectivity: z.string().optional().or(z.literal('')),
  cellular_connectivity: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
  video_out: z.string().optional().or(z.literal('')),
  haptics: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
  gyro: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),

  // Audio & Misc (Optional)
  audio_speakers: z.string().optional().or(z.literal('')),
  audio_tech: z.string().optional().or(z.literal('')),
  headphone_jack: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
  microphone: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
  camera: z.string().optional().or(z.literal('')),
  biometrics: z.string().optional().or(z.literal('')),

  // Power (Optional)
  battery_mah: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  battery_wh: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  charging_speed_w: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  charging_port: z.string().optional().or(z.literal('')),
  
  dimensions: z.string().optional().or(z.literal('')),
  weight_g: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  body_material: z.string().optional().or(z.literal('')),
  cooling: z.string().optional().or(z.literal('')),
  colors: z.string().optional().or(z.literal('')),
  ui_skin: z.string().optional().or(z.literal('')),
});

// Admin Form Structure
export const VARIANT_FORM_GROUPS = [
    {
        title: "IDENTITY & ORIGIN",
        fields: [
            { label: 'Variant Name (e.g. "OLED Model")', key: 'variant_name', type: 'text', required: true, width: 'full' },
            { label: 'Release Year', key: 'release_year', type: 'number', required: false },
            { label: 'Launch Price ($)', key: 'price_launch_usd', type: 'number', required: false },
            { label: 'Is Default/Base Model?', key: 'is_default', type: 'checkbox', required: false },
            { label: 'Model No.', key: 'model_no', type: 'text', required: false },
            { label: 'Image URL', key: 'image_url', type: 'url', required: false, width: 'full' },
        ]
    },
    {
        title: "SILICON CORE",
        fields: [
            { label: 'CPU Model', key: 'cpu_model', type: 'text', required: false },
            { label: 'CPU Architecture', key: 'cpu_architecture', type: 'text', required: false },
            { label: 'Process Node', key: 'cpu_process_node', type: 'text', required: false },
            { label: 'CPU Cores', key: 'cpu_cores', type: 'number', required: false },
            { label: 'CPU Threads', key: 'cpu_threads', type: 'number', required: false },
            { label: 'CPU Clock (MHz)', key: 'cpu_clock_mhz', type: 'number', required: false },
            { label: 'GPU Model', key: 'gpu_model', type: 'text', required: false },
            { label: 'GPU Architecture', key: 'gpu_architecture', type: 'text', required: false },
            { label: 'GPU Cores', key: 'gpu_cores', type: 'number', required: false },
            { label: 'GPU Unit (CUs/Cores)', key: 'gpu_core_unit', type: 'text', required: false },
            { label: 'GPU Clock (MHz)', key: 'gpu_clock_mhz', type: 'number', required: false },
            { label: 'GPU Teraflops', key: 'gpu_teraflops', type: 'number', required: false, step: '0.01' },
            { label: 'OS / Firmware', key: 'os', type: 'text', required: false },
            { label: 'TDP Range (W)', key: 'tdp_range_w', type: 'text', required: false },
        ]
    },
    {
        title: "MEMORY & STORAGE",
        fields: [
            { label: 'RAM (GB)', key: 'ram_gb', type: 'number', required: false },
            { label: 'RAM Type', key: 'ram_type', type: 'text', required: false },
            { label: 'RAM Speed (MHz)', key: 'ram_speed_mhz', type: 'number', required: false },
            { label: 'Storage (GB)', key: 'storage_gb', type: 'number', required: false },
            { label: 'Storage Type', key: 'storage_type', type: 'text', required: false },
            { label: 'SD Expandable?', key: 'storage_expandable', type: 'checkbox', required: false },
        ]
    },
    {
        title: "DISPLAY",
        fields: [
            { label: 'Screen Size (inch)', key: 'screen_size_inch', type: 'number', required: false, step: '0.1' },
            { label: 'Display Type (OLED/LCD)', key: 'display_type', type: 'text', required: false },
            { label: 'Res X (px)', key: 'screen_resolution_x', type: 'number', required: false },
            { label: 'Res Y (px)', key: 'screen_resolution_y', type: 'number', required: false },
            { label: 'Aspect Ratio', key: 'aspect_ratio', type: 'text', required: false },
            { label: 'Pixel Density (PPI)', key: 'ppi', type: 'number', required: false },
            { label: 'Refresh Rate (Hz)', key: 'refresh_rate_hz', type: 'number', required: false },
            { label: 'Brightness (nits)', key: 'brightness_nits', type: 'number', required: false },
            { label: 'Display Tech (VRR etc)', key: 'display_tech', type: 'text', required: false },
            { label: 'Touchscreen?', key: 'touchscreen', type: 'checkbox', required: false },
        ]
    },
    {
        title: "INPUT & CONNECTIVITY",
        fields: [
            { label: 'Input Layout', key: 'input_layout', type: 'text', required: false },
            { label: 'D-Pad Style', key: 'dpad_type', type: 'text', required: false },
            { label: 'Analog Sticks', key: 'analog_stick_type', type: 'text', required: false },
            { label: 'Shoulder Buttons', key: 'shoulder_buttons', type: 'text', required: false },
            { label: 'Wireless (WiFi/BT)', key: 'wireless_connectivity', type: 'text', required: false },
            { label: 'Ports / IO', key: 'ports', type: 'text', required: false },
            { label: 'Video Out Capable', key: 'video_out', type: 'text', required: false },
            { label: 'Back Buttons?', key: 'has_back_buttons', type: 'checkbox', required: false },
            { label: 'Haptics?', key: 'haptics', type: 'checkbox', required: false },
            { label: 'Gyroscope?', key: 'gyro', type: 'checkbox', required: false },
            { label: 'Cellular (5G/4G)?', key: 'cellular_connectivity', type: 'checkbox', required: false },
        ]
    },
    {
        title: "POWER & CHASSIS",
        fields: [
            { label: 'Battery (mAh)', key: 'battery_mah', type: 'number', required: false },
            { label: 'Battery (Wh)', key: 'battery_wh', type: 'number', required: false },
            { label: 'Charging Speed (W)', key: 'charging_speed_w', type: 'number', required: false },
            { label: 'Charging Port', key: 'charging_port', type: 'text', required: false },
            { label: 'Dimensions', key: 'dimensions', type: 'text', required: false },
            { label: 'Weight (g)', key: 'weight_g', type: 'number', required: false },
            { label: 'Body Material', key: 'body_material', type: 'text', required: false },
            { label: 'Cooling Solution', key: 'cooling', type: 'text', required: false },
        ]
    },
    {
        title: "AUDIO & MISC",
        fields: [
            { label: 'Colors', key: 'colors', type: 'text', required: false },
            { label: 'UI Skin', key: 'ui_skin', type: 'text', required: false },
            { label: 'Speakers', key: 'audio_speakers', type: 'text', required: false },
            { label: 'Audio Tech', key: 'audio_tech', type: 'text', required: false },
            { label: 'Headphone Jack?', key: 'headphone_jack', type: 'checkbox', required: false },
            { label: 'Microphone?', key: 'microphone', type: 'checkbox', required: false },
        ]
    }
];
