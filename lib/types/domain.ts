
export type NewsCategory = 'Hardware' | 'Software' | 'Industry' | 'Rumor' | 'Mods' | 'Events' | 'Homebrew';

export interface NewsItem {
  headline: string;
  date: string;
  summary: string;
  category: NewsCategory;
}

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
  ram_mb?: number; 
  ram_type?: string;
  ram_speed_mhz?: number;
  storage_gb?: number;
  storage_type?: string;
  storage_expandable?: boolean;
  
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

  battery_capacity_mah?: number;
  battery_capacity_wh?: number;
  battery_type?: string;
  charging_speed_w?: number;
  charging_tech?: string; 
  tdp_wattage?: number | null;
  weight_g?: number;
  cooling_solution?: string;
  body_material?: string;
  available_colors?: string;

  audio_speakers?: string;
  audio_tech?: string;
  has_headphone_jack?: boolean;
  has_microphone?: boolean;
  camera_specs?: string;
  biometrics?: string;
  
  ports?: string;
  bluetooth_specs?: string;
  wifi_specs?: string;
  other_connectivity?: string;
  cellular_connectivity?: boolean;
  video_out?: string | null;
  haptics?: string;
  gyro?: boolean;
  
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

  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  ui_skin?: string;

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
    specs?: ConsoleSpecs | Partial<ConsoleVariant>;
    
    release_year?: number; 
    generation?: string;
}
