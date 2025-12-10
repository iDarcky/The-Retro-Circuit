
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
    type: 'GAME' | 'CONSOLE' | 'FABRICATOR';
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
    panel_types: string[];
}

export interface ConsoleSpecs {
  id?: string;
  console_id?: string;
  [key: string]: any; 
}

export interface EmulationProfile {
  id: string;
  variant_id: string;
  
  // Systems
  ps1_state?: string;
  ps2_state: 'Perfect' | 'Great' | 'Playable' | 'Struggles' | 'Unplayable' | 'N/A';
  psp_state?: string;
  gamecube_state: string;
  wii_state: string;
  x3ds_state: string;
  switch_state: string;
  vita_state: string;
  dreamcast_state?: string;
  saturn_state?: string;
  
  summary_text: string;
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
  gpu_compute_units?: string;
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

  // Power & Chassis
  battery_capacity_mah?: number;
  battery_capacity_wh?: number;
  battery_type?: string;
  charging_speed_w?: number;
  tdp_wattage?: number | null;
  weight_g?: number;
  cooling_solution?: string;
  body_material?: string;
  available_colors?: string;

  // Audio & Misc
  audio_speakers?: string;
  audio_tech?: string;
  has_headphone_jack?: boolean;
  has_microphone?: boolean;
  camera_specs?: string;
  biometrics?: string;
  
  // IO & Connectivity
  ports?: string;
  bluetooth_specs?: string;
  wifi_specs?: string;
  other_connectivity?: string;
  cellular_connectivity?: boolean;
  video_out?: string | null;
  haptics?: string;
  gyro?: boolean;
  
  // Controls
  input_layout?: string;
  other_buttons?: string;
  dpad_mechanism?: string;
  dpad_shape?: string;
  thumbstick_mechanism?: string;
  thumbstick_layout?: string;
  thumbstick_cap?: string;
  has_stick_clicks?: boolean;
  shoulder_layout?: string;
  bumper_mechanism?: string;
  trigger_mechanism?: string;
  action_button_mechanism?: string;
  has_back_buttons?: boolean;

  // Dimensions (mm)
  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  ui_skin?: string;

  // Emulation
  emulation_profile?: EmulationProfile | null;
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
  gpu_compute_units: safeString,
  gpu_clock_mhz: safeNumber,
  gpu_teraflops: safeNumber,
  
  os: safeString,

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

  // Power & Chassis
  battery_capacity_mah: safeNumber,
  battery_capacity_wh: safeNumber,
  battery_type: safeString,
  charging_speed_w: safeNumber,
  tdp_wattage: safeNumber,
  weight_g: safeNumber,
  cooling_solution: safeString,
  body_material: safeString,
  available_colors: safeString,

  // Audio & Misc
  audio_speakers: safeString,
  audio_tech: safeString,
  has_headphone_jack: safeBoolean,
  has_microphone: safeBoolean,
  camera_specs: safeString,
  biometrics: safeString,

  // IO & Connectivity
  ports: safeString,
  wifi_specs: safeString,
  bluetooth_specs: safeString,
  other_connectivity: safeString,
  cellular_connectivity: safeBoolean,
  video_out: safeString,
  haptics: safeString,
  gyro: safeBoolean,

  // Controls
  input_layout: safeString,
  other_buttons: safeString,
  dpad_mechanism: safeString,
  dpad_shape: safeString,
  thumbstick_mechanism: safeString,
  thumbstick_layout: safeString,
  thumbstick_cap: safeString,
  has_stick_clicks: safeBoolean,
  shoulder_layout: safeString,
  bumper_mechanism: safeString,
  trigger_mechanism: safeString,
  action_button_mechanism: safeString,
  has_back_buttons: safeBoolean,

  // Body
  width_mm: safeNumber,
  height_mm: safeNumber,
  depth_mm: safeNumber,
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
            // Row 1: Platform
            { label: 'OS / Firmware', key: 'os', type: 'text', required: false },
            { label: 'UI Skin', key: 'ui_skin', type: 'text', required: false },
            
            // Row 2: CPU Specs
            { label: 'CPU Model', key: 'cpu_model', type: 'text', required: false, width: 'third' },
            { label: 'CPU Architecture', key: 'cpu_architecture', type: 'text', required: false, width: 'third' },
            { label: 'Process Node', key: 'cpu_process_node', type: 'text', required: false, width: 'third' },

            // Row 3: CPU Performance
            { label: 'CPU Cores', key: 'cpu_cores', type: 'number', required: false, width: 'third' },
            { label: 'CPU Threads', key: 'cpu_threads', type: 'number', required: false, width: 'third' },
            { label: 'CPU Clock (MHz)', key: 'cpu_clock_mhz', type: 'number', required: false, width: 'third' },
            
            // Row 4: GPU Specs
            { label: 'GPU Model', key: 'gpu_model', type: 'text', required: false, width: 'third' },
            { label: 'GPU Architecture', key: 'gpu_architecture', type: 'text', required: false, width: 'third' },
            { label: 'CUs / Execution Units', key: 'gpu_compute_units', type: 'text', required: false, width: 'third' },
            
            // Row 5: GPU Performance
            { label: 'GPU Clock (MHz)', key: 'gpu_clock_mhz', type: 'number', required: false, width: 'third' },
            { label: 'GPU Teraflops', key: 'gpu_teraflops', type: 'number', required: false, step: '0.01', width: 'third' },
        ]
    },
    {
        title: "MEMORY & STORAGE",
        fields: [
            // Row 1: RAM
            { label: 'RAM (GB)', key: 'ram_gb', type: 'number', required: false, width: 'third' },
            { label: 'RAM Type (e.g. LPDDR5)', key: 'ram_type', type: 'text', required: false, width: 'third' },
            { 
                label: 'RAM Speed (Rated)', 
                key: 'ram_speed_mhz', 
                type: 'number', 
                required: false, 
                width: 'third',
                note: 'Use effective speed (MT/s). E.g. 5500.'
            },
            
            // Row 2: Storage
            { label: 'Base Capacity (GB)', key: 'storage_gb', type: 'number', required: false, width: 'third' },
            { label: 'Storage Type (e.g. UFS 3.1)', key: 'storage_type', type: 'text', required: false, width: 'third' },
            { label: 'MicroSD Slot?', key: 'storage_expandable', type: 'checkbox', required: false, width: 'third' },
        ]
    },
    {
        title: "DISPLAY",
        fields: [
            // Row 1: Dimensions
            { label: 'Screen Size (inch)', key: 'screen_size_inch', type: 'number', required: false, step: '0.1', width: 'third' },
            { label: 'Res X (px)', key: 'screen_resolution_x', type: 'number', required: false, width: 'third' },
            { label: 'Res Y (px)', key: 'screen_resolution_y', type: 'number', required: false, width: 'third' },

            // Row 2: Computed Specs
            { label: 'Aspect Ratio', key: 'aspect_ratio', type: 'text', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated' },
            { label: 'Pixel Density (PPI)', key: 'ppi', type: 'number', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated' },

            // Row 3: Tech Specs
            { 
                label: 'Display Type', 
                key: 'display_type', 
                type: 'select', 
                required: false, 
                width: 'third',
                options: ['IPS LCD', 'OLED', 'AMOLED', 'TN LCD', 'Mini-LED', 'Micro-LED', 'TFT LCD'] 
            },
            { label: 'Refresh Rate (Hz)', key: 'refresh_rate_hz', type: 'number', required: false, width: 'third' },
            { label: 'Brightness (nits)', key: 'brightness_nits', type: 'number', required: false, width: 'third' },

            // Row 4: Extras
            { label: 'Display Tech (VRR etc)', key: 'display_tech', type: 'text', required: false, width: 'half' },
            { label: 'Touchscreen?', key: 'touchscreen', type: 'checkbox', required: false, width: 'half' },

            // Row 5: Dual Screen
            { label: '2nd Screen Size', key: 'second_screen_size', type: 'number', required: false, step: '0.1', width: 'quarter', subHeader: 'Secondary Display' },
            { label: '2nd Res X', key: 'second_screen_resolution_x', type: 'number', required: false, width: 'quarter' },
            { label: '2nd Res Y', key: 'second_screen_resolution_y', type: 'number', required: false, width: 'quarter' },
            { label: '2nd Touch?', key: 'second_screen_touch', type: 'checkbox', required: false, width: 'quarter' },
        ]
    },
    {
        title: "INPUT MECHANICS",
        fields: [
            // Row 1: The Basics
            { label: 'Input Layout', key: 'input_layout', type: 'select', required: false, width: 'half', options: ['Xbox', 'Nintendo', 'PlayStation', 'Retroid/Unique'] },
            { label: 'Start, Select, Home', key: 'other_buttons', type: 'text', required: false, width: 'half' },

            // Row 2: Face & D-Pad
            { label: 'D-Pad Mech', key: 'dpad_mechanism', type: 'text', required: false, width: 'half', note: 'Rubber Dome, Dome Switch...' },
            { label: 'Face Btn Mech', key: 'action_button_mechanism', type: 'text', required: false, width: 'half', note: 'Conductive Rubber, Microswitch...' },

            // Row 3: Thumbsticks
            { label: 'Stick Tech', key: 'thumbstick_mechanism', type: 'text', required: false, width: 'quarter', note: 'Hall Effect, ALPS...' },
            { label: 'Stick Layout', key: 'thumbstick_layout', type: 'text', required: false, width: 'quarter', note: 'Staggered, Inline...' },
            { label: 'L3/R3 Clicks?', key: 'has_stick_clicks', type: 'checkbox', required: false, width: 'quarter' },
            { label: 'Cap Type', key: 'thumbstick_cap', type: 'text', required: false, width: 'quarter', note: 'Concave, Convex...' },

            // Row 4: Shoulders & Triggers
            { label: 'L1/R1 Mech', key: 'bumper_mechanism', type: 'text', required: false, width: 'third' },
            { label: 'L2/R2 Mech', key: 'trigger_mechanism', type: 'text', required: false, width: 'third', note: 'Analog, Digital...' },
            { label: 'Stacked vs Inline', key: 'shoulder_layout', type: 'text', required: false, width: 'third' },

            // Row 5: Feedback
            { label: 'Haptics', key: 'haptics', type: 'text', required: false, width: 'third' },
            { label: 'Gyroscope?', key: 'gyro', type: 'checkbox', required: false, width: 'third' },
            { label: 'Back Buttons?', key: 'has_back_buttons', type: 'checkbox', required: false, width: 'third' },
        ]
    },
    {
        title: "CONNECTIVITY & IO",
        fields: [
            // Row 1: Wireless
            { label: 'Wi-Fi Specs', key: 'wifi_specs', type: 'text', required: false, width: 'quarter' },
            { label: 'Bluetooth Specs', key: 'bluetooth_specs', type: 'text', required: false, width: 'quarter' },
            { label: 'Legacy/Other (IR, NFC)', key: 'other_connectivity', type: 'text', required: false, width: 'quarter' },
            { label: 'Cellular?', key: 'cellular_connectivity', type: 'checkbox', required: false, width: 'quarter' },

            // Row 2: Video
            { label: 'Video Output', key: 'video_out', type: 'text', required: false, width: 'full' },

            // Row 3: Ports
            { label: 'Ports', key: 'ports', type: 'textarea', required: false, width: 'full', note: 'List all physical I/O (USB-C, HDMI, etc.)' },
        ]
    },
    {
        title: "POWER & CHASSIS",
        fields: [
            // Row 1: Battery Stats
            { label: 'Capacity (mAh)', key: 'battery_capacity_mah', type: 'number', required: false, width: 'third' },
            { label: 'Capacity (Wh)', key: 'battery_capacity_wh', type: 'number', required: false, width: 'third' },
            { label: 'Battery Type', key: 'battery_type', type: 'text', required: false, width: 'third', note: 'Li-Ion, Li-Po, AA...' },

            // Row 2: Charging & Weight
            { label: 'Charge Speed (W)', key: 'charging_speed_w', type: 'number', required: false, width: 'third' },
            { label: 'Weight (g)', key: 'weight_g', type: 'number', required: false, width: 'third' },
            { label: 'Cooling', key: 'cooling_solution', type: 'text', required: false, width: 'third', note: 'Active Fan, Passive...' },

            // Row 3: Dimensions
            { label: 'Width (mm)', key: 'width_mm', type: 'number', required: false, width: 'third' },
            { label: 'Height (mm)', key: 'height_mm', type: 'number', required: false, width: 'third' },
            { label: 'Thickness (mm)', key: 'depth_mm', type: 'number', required: false, width: 'third' },

            // Row 4: Build
            { label: 'Body Material', key: 'body_material', type: 'text', required: false, width: 'half' },
            { label: 'Available Colors', key: 'available_colors', type: 'text', required: false, width: 'half' },
            
            // Row 5: TDP
            { label: 'TDP (W)', key: 'tdp_wattage', type: 'number', required: false, width: 'full', note: 'Thermal Design Power' },
        ]
    },
    {
        title: "AUDIO & MISC",
        fields: [
            // Row 1: Audio
            { label: 'Speakers', key: 'audio_speakers', type: 'text', required: false, width: 'half', note: 'Front-facing Stereo, Mono...' },
            { label: 'Headphone Jack?', key: 'has_headphone_jack', type: 'checkbox', required: false, width: 'quarter' },
            { label: 'Microphone?', key: 'has_microphone', type: 'checkbox', required: false, width: 'quarter' },

            // Row 2: Extras
            { label: 'Biometrics', key: 'biometrics', type: 'text', required: false, width: 'half', note: 'Fingerprint Sensor, Face Unlock...' },
            { label: 'Camera Specs', key: 'camera_specs', type: 'text', required: false, width: 'half', note: '2MP Front...' },
        ]
    }
];
