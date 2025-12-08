import { z } from 'zod';

// --- VALIDATION HELPERS ---
const safeString = z.any().transform(val => {
  if (val === null || val === undefined) return '';
  return String(val);
});

const safeNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}, z.number().optional());

const safeBoolean = z.preprocess((val) => val === true || val === 'true', z.boolean().default(false));

// --- TYPES ---

export type NewsCategory = 'Hardware' | 'Software' | 'Industry' | 'Rumor' | 'Mods' | 'Events' | 'Homebrew';

export interface NewsItem {
  headline: string;
  date: string;
  summary: string;
  category: NewsCategory;
}

export const NewsItemSchema = z.object({
  headline: safeString,
  date: safeString,
  summary: safeString,
  category: z.enum(['Hardware', 'Software', 'Industry', 'Rumor', 'Mods', 'Events', 'Homebrew']).optional().default('Hardware'),
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
  aScore?: number;
  bScore?: number;
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
  slug: safeString,
  title: safeString,
  developer: safeString,
  year: safeString,
  genre: safeString,
  content: safeString,
  whyItMatters: safeString,
  rating: safeNumber,
  image: safeString,
  console_slug: safeString,
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

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  founded_year: number;
  website?: string;
  key_franchises: string;
  image_url?: string;
}

export const ManufacturerSchema = z.object({
  id: z.string().optional(),
  name: safeString,
  slug: safeString,
  description: safeString,
  country: safeString,
  founded_year: safeNumber,
  website: safeString,
  key_franchises: safeString,
  image_url: safeString,
});

export const MANUFACTURER_FORM_FIELDS = [
  { label: 'Company Name', key: 'name', type: 'text', required: false },
  { label: 'Slug (Unique)', key: 'slug', type: 'text', required: false },
  { label: 'Founded Year', key: 'founded_year', type: 'number', required: false },
  { label: 'Country', key: 'country', type: 'text', required: false },
  { label: 'Website URL', key: 'website', type: 'url', required: false },
  { label: 'Image URL', key: 'image_url', type: 'url', required: false },
  { label: 'Key Franchises', key: 'key_franchises', type: 'text', required: false },
  { label: 'Description', key: 'description', type: 'textarea', required: false },
];

export const ConsoleSchema = z.object({
    manufacturer_id: safeString,
    name: safeString,
    slug: safeString,
    description: safeString,
    image_url: safeString,
    form_factor: safeString,
});

export const CONSOLE_FORM_FIELDS = [
    { label: 'Console Name', key: 'name', type: 'text', required: true },
    { label: 'Slug (Auto)', key: 'slug', type: 'text', required: true },
    { label: 'Form Factor (Handheld, Console, etc.)', key: 'form_factor', type: 'text', required: false },
    { label: 'Description', key: 'description', type: 'textarea', required: false },
    { label: 'Image URL', key: 'image_url', type: 'url', required: false },
];

export interface ConsoleFilterState {
    minYear: number;
    maxYear: number;
    generations: string[];
    form_factors: string[];
    manufacturer_id: string | null;
}

export interface ConsoleSpecs {
  id?: string;
  console_id?: string;
  [key: string]: any; 
}

export interface ConsoleVariant {
  id: string;
  console_id: string;
  variant_name: string;
  slug?: string;
  is_default: boolean;
  release_year?: number;
  model_no?: string;
  price_launch_usd?: number;
  image_url?: string; 

  // Silicon
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
  ram_gb?: number;
  ram_type?: string;
  ram_speed_mhz?: number;
  storage_gb?: number;
  storage_type?: string;
  storage_expandable?: boolean;
  
  // Display
  screen_size_inch?: number;
  screen_resolution_x?: number;
  screen_resolution_y?: number;
  display_type?: string;
  display_tech?: string;
  refresh_rate_hz?: number;
  brightness_nits?: number;
  aspect_ratio?: string;
  ppi?: number;
  touchscreen?: boolean;

  second_screen_size?: number;
  second_screen_resolution_x?: number;
  second_screen_resolution_y?: number;
  second_screen_touch?: boolean;

  // Power
  battery_mah?: number;
  battery_wh?: number;
  charging_speed_w?: number;
  charging_port?: string;
  tdp_range_w?: string;

  // Audio & Misc
  audio_speakers?: string;
  audio_tech?: string;
  headphone_jack?: boolean;
  microphone?: boolean;
  camera?: boolean;
  biometrics?: boolean;
  
  // IO & Connectivity
  ports?: string;
  connectivity?: string;
  wireless_connectivity?: string;
  cellular_connectivity?: boolean;
  video_out?: string;
  haptics?: string; // Text in DB (e.g. 'HD Rumble')
  gyro?: boolean;
  
  // Controls
  input_layout?: string;
  dpad_type?: string;
  dpad_mechanism?: string;
  dpad_shape?: string;
  analog_stick_type?: string;
  thumbstick_mechanism?: string;
  thumbstick_layout?: string;
  thumbstick_cap?: string;
  shoulder_buttons?: string;
  trigger_mechanism?: string;
  action_button_mechanism?: string;
  has_back_buttons?: boolean;

  // Body
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
    image_url?: string;
    form_factor?: string;
    manufacturer?: Manufacturer;
    variants?: ConsoleVariant[];
    specs?: ConsoleSpecs | Partial<ConsoleVariant>; // Legacy prop for compatibility
    
    // Computed/Joined fields
    release_year?: number; 
    generation?: string; // Not in DB, derived or removed
}

// Zod Schema for Variants matching new DB
export const ConsoleVariantSchema = z.object({
  id: z.string().optional(),
  console_id: safeString,
  variant_name: safeString,
  slug: safeString,
  is_default: safeBoolean,
  
  release_year: safeNumber,
  price_launch_usd: safeNumber,
  model_no: safeString,
  image_url: safeString,

  // Silicon
  cpu_model: safeString,
  cpu_architecture: safeString,
  cpu_process_node: safeString,
  cpu_cores: safeNumber,
  cpu_threads: safeNumber,
  cpu_clock_mhz: safeNumber,
  
  gpu_model: safeString,
  gpu_architecture: safeString,
  gpu_cores: safeNumber,
  gpu_core_unit: safeString,
  gpu_clock_mhz: safeNumber,
  gpu_teraflops: safeNumber,
  
  os: safeString,
  tdp_range_w: safeString,

  // Memory
  ram_gb: safeNumber,
  ram_type: safeString,
  ram_speed_mhz: safeNumber,
  
  storage_gb: safeNumber,
  storage_type: safeString,
  storage_expandable: safeBoolean,

  // Display
  screen_size_inch: safeNumber,
  screen_resolution_x: safeNumber,
  screen_resolution_y: safeNumber,
  display_type: safeString,
  display_tech: safeString,
  refresh_rate_hz: safeNumber,
  brightness_nits: safeNumber,
  aspect_ratio: safeString,
  ppi: safeNumber,
  touchscreen: safeBoolean,

  second_screen_size: safeNumber,
  second_screen_resolution_x: safeNumber,
  second_screen_resolution_y: safeNumber,
  second_screen_touch: safeBoolean,

  // Power
  battery_mah: safeNumber,
  battery_wh: safeNumber,
  charging_speed_w: safeNumber,
  charging_port: safeString,
  
  // Audio & Misc
  audio_speakers: safeString,
  audio_tech: safeString,
  headphone_jack: safeBoolean,
  microphone: safeBoolean,
  camera: safeBoolean,
  biometrics: safeBoolean,

  // IO & Connectivity
  ports: safeString,
  wireless_connectivity: safeString,
  cellular_connectivity: safeBoolean,
  video_out: safeString,
  haptics: safeString,
  gyro: safeBoolean,

  // Controls
  input_layout: safeString,
  dpad_type: safeString,
  dpad_mechanism: safeString,
  dpad_shape: safeString,
  analog_stick_type: safeString,
  thumbstick_mechanism: safeString,
  thumbstick_layout: safeString,
  thumbstick_cap: safeString,
  shoulder_buttons: safeString,
  trigger_mechanism: safeString,
  action_button_mechanism: safeString,
  has_back_buttons: safeBoolean,

  // Body
  dimensions: safeString,
  weight_g: safeNumber,
  body_material: safeString,
  cooling: safeString,
  colors: safeString,
  ui_skin: safeString,
});

// Admin Form Structure
export const VARIANT_FORM_GROUPS = [
    {
        title: "IDENTITY & ORIGIN",
        fields: [
            { label: 'Variant Name (e.g. "OLED Model")', key: 'variant_name', type: 'text', required: false, width: 'full' },
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
            { label: 'TDP / Wattage', key: 'tdp_range_w', type: 'text', required: false },
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
            // Dual Screen
            { label: '2nd Screen Size', key: 'second_screen_size', type: 'number', required: false, step: '0.1' },
            { label: '2nd Screen Touch?', key: 'second_screen_touch', type: 'checkbox', required: false },
            { label: '2nd Res X', key: 'second_screen_resolution_x', type: 'number', required: false },
            { label: '2nd Res Y', key: 'second_screen_resolution_y', type: 'number', required: false },
        ]
    },
    {
        title: "INPUT & CONNECTIVITY",
        fields: [
            { label: 'Input Layout', key: 'input_layout', type: 'text', required: false },
            { label: 'D-Pad Style', key: 'dpad_type', type: 'text', required: false },
            { label: 'D-Pad Mech (Rubber/Clicky)', key: 'dpad_mechanism', type: 'text', required: false },
            { label: 'Analog Sticks', key: 'analog_stick_type', type: 'text', required: false },
            { label: 'Stick Mech (Alps/Hall)', key: 'thumbstick_mechanism', type: 'text', required: false },
            { label: 'Stick Layout', key: 'thumbstick_layout', type: 'text', required: false },
            { label: 'Shoulder Buttons', key: 'shoulder_buttons', type: 'text', required: false },
            { label: 'Trigger Mech (Digital/Analog)', key: 'trigger_mechanism', type: 'text', required: false },
            { label: 'Action Btn Mech', key: 'action_button_mechanism', type: 'text', required: false },
            { label: 'Back Buttons?', key: 'has_back_buttons', type: 'checkbox', required: false },
            
            { label: 'Wireless (WiFi/BT)', key: 'wireless_connectivity', type: 'text', required: false },
            { label: 'Cellular (5G/4G)', key: 'cellular_connectivity', type: 'checkbox', required: false },
            { label: 'Ports / IO', key: 'ports', type: 'text', required: false },
            { label: 'Video Out', key: 'video_out', type: 'text', required: false },
            { label: 'Haptics', key: 'haptics', type: 'text', required: false },
            { label: 'Gyroscope?', key: 'gyro', type: 'checkbox', required: false },
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
            { label: 'Camera', key: 'camera', type: 'checkbox', required: false },
            { label: 'Biometrics', key: 'biometrics', type: 'checkbox', required: false },
        ]
    }
];