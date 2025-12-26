
import { z } from 'zod';

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
  brand_color: safeString,
});

export const ConsoleSchema = z.object({
    manufacturer_id: safeString,
    name: safeString,
    slug: safeString,
    description: safeString,
    image_url: safeString,
    form_factor: safeString,

    // Feature Flags & Config
    device_category: safeString,
    chassis_features: safeString,
    has_cartridge_slot: safeBoolean,
    supported_cartridge_types: safeString,

    // New Finder Traits
    setup_ease_score: safeNumber,
    community_score: safeNumber,
});

export const VariantInputProfileSchema = z.object({
    dpad_tech: safeString,
    dpad_shape: safeString,
    dpad_placement: safeString,
    face_button_count: safeNumber,
    face_button_tech: safeString,
    face_label_scheme: safeString,
    stick_count: safeNumber,
    stick_tech: safeString,
    stick_layout: safeString,
    stick_clicks: safeBoolean,
    stick_cap: safeString,
    bumper_tech: safeString,
    trigger_tech: safeString,
    trigger_type: safeString,
    trigger_layout: safeString,
    back_button_count: safeNumber,
    has_gyro: safeBoolean,
    has_keyboard: safeBoolean,
    // keyboard_type: safeString, - Removed
    system_button_set: safeString,
    system_buttons_text: safeString,
    touchpad_count: safeNumber,
    touchpad_clickable: safeBoolean,
    input_confidence: safeString,
    input_notes: safeString,
});

export const ConsoleVariantSchema = z.object({
  id: z.string().optional(),
  console_id: safeString,
  variant_name: safeString,
  slug: safeString,
  is_default: safeBoolean,
  
  release_date: safeString.nullable(),
  release_date_precision: z.enum(['year', 'month', 'day']).nullable().optional(),
  model_no: safeString,
  price_launch_usd: safeNumber,
  image_url: safeString,

  // Silicon
  cpu_model: safeString,
  cpu_architecture: safeString,
  cpu_process_node: safeString,
  cpu_cores: safeNumber,
  cpu_threads: safeNumber,
  cpu_clock_max_mhz: safeNumber,
  cpu_clock_min_mhz: safeNumber,
  
  gpu_model: safeString,
  gpu_architecture: safeString,
  gpu_cores: safeNumber,
  gpu_compute_units: safeString,
  gpu_clock_mhz: safeNumber,
  gpu_teraflops: safeNumber,
  
  os: safeString,

  // Memory
  ram_mb: safeNumber,
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
  second_screen_ppi: safeNumber,
  second_screen_aspect_ratio: safeString,
  second_screen_refresh_rate: safeNumber,
  second_screen_nits: safeNumber,

  // Power & Chassis
  battery_capacity_mah: safeNumber,
  battery_capacity_wh: safeNumber,
  battery_type: safeString,
  charging_speed_w: safeNumber,
  charging_tech: safeString,
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
  cellular_connectivity: safeString,
  video_out: safeString,
  haptics: safeString,
  gyro: safeBoolean, // Legacy field, kept but usually unused

  // CONTROLS - REPLACED BY VARIANT INPUT PROFILE (below)
  // We remove the old fields to prevent Zod from stripping new ones if we merged,
  // but actually we merge them below.

  // Body
  width_mm: safeNumber,
  height_mm: safeNumber,
  depth_mm: safeNumber,
  ui_skin: safeString,
}).merge(VariantInputProfileSchema.partial()); // Merging the new schema allows the new keys to pass validation
