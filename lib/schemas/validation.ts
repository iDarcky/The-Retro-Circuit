
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
  has_keyboard: safeBoolean,

  // Body
  width_mm: safeNumber,
  height_mm: safeNumber,
  depth_mm: safeNumber,
  ui_skin: safeString,
});
