
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
  brand_color?: string;
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

  // Tier 1: Classic 2D
  nes_state?: string;
  snes_state?: string;
  master_system?: string;
  genesis_state?: string;
  gb_state?: string;
  gbc_state?: string;
  gba_state?: string;

  // Tier 2: Early 3D
  ps1_state?: string;
  n64_state?: string;
  saturn_state?: string;
  nds_state?: string;
  dreamcast_state?: string;

  // Tier 3: Advanced Handhelds
  psp_state?: string;
  x3ds_state: string;
  vita_state: string;

  // Tier 4: Classic Home
  ps2_state: string;
  gamecube_state: string;
  xbox?: string;

  // Tier 5: Modern & HD
  wii_state: string;
  wii_u?: string;
  ps3_state?: string;
  xbox_360?: string;
  switch_state: string;

  summary_text: string;

  // Verification
  source: string | null;
  last_verified: string | Date;
}

// --- New Input Enums ---
export type RcButtonTech = 'membrane' | 'microswitch' | 'mechanical' | 'hall' | 'potentiometer' | 'spring' | 'optical' | 'unknown';
export type RcDpadShape = 'cross' | 'disc' | 'segmented' | 'unknown';
export type RcPlacement = 'left' | 'right' | 'center' | 'unknown';
// RcFaceLayout removed
export type RcLabelScheme = 'nintendo' | 'xbox' | 'playstation' | 'generic' | 'unknown';
export type RcStickLayout = 'symmetric' | 'asymmetric' | 'centered' | 'unknown';
export type RcStickCap = 'concave' | 'convex' | 'flat' | 'domed' | 'textured' | 'unknown';
export type RcTriggerType = 'digital' | 'analog' | 'unknown';
export type RcTriggerLayout = 'inline' | 'stacked' | 'unknown';
export type RcKeyboardType = 'physical' | 'touch' | 'unknown';
export type RcSystemButtonSet = 'minimal' | 'standard' | 'extended' | 'unknown';
export type RcConfidence = 'confirmed' | 'inferred' | 'unknown';

export interface VariantInputProfile {
  variant_id: string;
  dpad_tech: RcButtonTech | null;
  dpad_shape: RcDpadShape | null;
  dpad_placement: RcPlacement | null;
  face_button_count: number | null; // check ((face_button_count = any (array[2, 4, 6])))
  face_button_tech: RcButtonTech | null;
  face_label_scheme: RcLabelScheme | null;
  stick_count: number | null; // check ((stick_count = any (array[0, 1, 2])))
  stick_tech: RcButtonTech | null;
  stick_layout: RcStickLayout | null;
  stick_clicks: boolean | null;
  stick_cap: RcStickCap | null;
  bumper_tech: RcButtonTech | null;
  trigger_tech: RcButtonTech | null;
  trigger_type: RcTriggerType | null;
  trigger_layout: RcTriggerLayout | null;
  back_button_count: number | null; // check ((back_button_count = any (array[0, 2, 4])))
  has_gyro: boolean | null;
  has_keyboard: boolean | null;
  keyboard_type: RcKeyboardType | null;
  system_button_set: RcSystemButtonSet | null;
  system_buttons_text: string | null;
  touchpad_count: number | null; // check ((touchpad_count = any (array[0, 1, 2])))
  touchpad_clickable: boolean | null;
  input_confidence: RcConfidence;
  input_notes: string | null;
  created_at?: string;
  updated_at?: string;
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
  cpu_clock_max_mhz?: number;
  cpu_clock_min_mhz?: number;
  
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
  second_screen_ppi?: number;
  second_screen_aspect_ratio?: string;
  second_screen_refresh_rate?: number;
  second_screen_nits?: number;

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
  cellular_connectivity?: string;
  video_out?: string | null;
  haptics?: string;
  
  // Deprecated Fields Removed:
  // input_layout, other_buttons, dpad_mechanism, dpad_shape,
  // thumbstick_mechanism, thumbstick_layout, thumbstick_cap, has_stick_clicks,
  // shoulder_layout, bumper_mechanism, trigger_mechanism, action_button_mechanism,
  // has_back_buttons, has_keyboard (moved to profile), gyro (moved to profile as has_gyro)

  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  ui_skin?: string;

  emulation_profile?: EmulationProfile | null;
  variant_input_profile?: VariantInputProfile | null;
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

    device_category: 'emulation' | 'pc_gaming' | 'fpga' | 'legacy';
    has_cartridge_slot: boolean;
    supported_cartridge_types: string | null;
    chassis_features: string | null;

    setup_ease_score?: number | null;
    community_score?: number | null;
}
