
import { z } from 'zod';

const safeString = z.any().transform(val => {
  if (val === null || val === undefined) return '';
  return String(val);
});

/**
 * Postgres enum columns reject '' — only a real label or NULL is valid. safeString
 * coerces empty input to '', which made every save fail once an enum field was left
 * blank, so enum-backed fields use this instead.
 */
const safeEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.enum(values).nullable().optional()
  );

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
  known_for: z.array(z.string()).optional(),
  who_its_for: safeString.optional(),
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

  // Status
  status: safeString,
  // Postgres enum — safeEnum, not safeString, so a blank select does not reject the save.
  release_status: safeEnum(['released', 'upcoming', 'rumoured', 'discontinued']),
  is_featured: safeBoolean,
});

// Every column below except the counts, booleans and free text is a Postgres enum, so all
// of them need safeEnum for the same reason cpu_arch did — leaving one blank in the admin
// otherwise submits '' and the whole save is rejected.
const BUTTON_TECH = ['membrane', 'microswitch', 'mechanical', 'hall', 'tmr', 'potentiometer', 'spring', 'optical', 'unknown'] as const;
const PLACEMENT = ['left', 'right', 'center', 'top', 'bottom', 'unknown'] as const;
const TRIGGER_TYPE = ['digital', 'analog', 'unknown'] as const;

export const VariantInputProfileSchema = z.object({
  dpad_tech: safeEnum(BUTTON_TECH),
  dpad_shape: safeEnum(['cross', 'disc', 'segmented', 'unknown']),
  dpad_placement: safeEnum(PLACEMENT),
  face_button_count: safeNumber,
  face_button_tech: safeEnum(BUTTON_TECH),
  face_label_scheme: safeEnum(['nintendo', 'xbox', 'playstation', 'generic', 'unknown']),
  stick_count: safeNumber,
  stick_tech: safeEnum(BUTTON_TECH),
  stick_layout: safeEnum(['symmetric', 'asymmetric', 'centered', 'unknown']),
  stick_placement: safeEnum(PLACEMENT),
  stick_clicks: safeBoolean,
  stick_cap: safeEnum(['concave', 'convex', 'flat', 'domed', 'textured', 'unknown']),
  bumper_tech: safeEnum(BUTTON_TECH),
  bumper_type: safeEnum(TRIGGER_TYPE),
  trigger_tech: safeEnum(BUTTON_TECH),
  trigger_type: safeEnum(TRIGGER_TYPE),
  trigger_layout: safeEnum(['inline', 'stacked', 'shelf', 'unknown']),
  back_button_count: safeNumber,
  has_gyro: safeBoolean,
  has_rumble: safeBoolean,
  has_keyboard: safeBoolean,
  // keyboard_type: safeString, - Removed
  system_button_set: safeEnum(['minimal', 'standard', 'extended', 'unknown']),
  system_buttons_text: safeString,
  touchpad_count: safeNumber,
  touchpad_clickable: safeBoolean,
  input_confidence: safeEnum(['confirmed', 'inferred', 'unknown']),
  input_notes: safeString,
});

// One entry per big/little core cluster, ordered fastest first. `uarch_year` is the
// architecture's release year — the only honest way to compare a 3 GHz old core against
// a 2 GHz new one, since clock alone says nothing across generations.
export const CpuClusterSchema = z.object({
  count: z.coerce.number().int().min(1).max(64).nullable().optional(),
  core: z.string().max(120).nullable().optional(),
  clock_mhz: z.coerce.number().int().min(1).max(10000).nullable().optional(),
  uarch_year: z.coerce.number().int().min(1990).max(2100).nullable().optional(),
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
  price_avg_usd: safeNumber,
  amazon_asin: safeString.nullable().optional(),
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
  os_family: safeEnum(['android', 'linux', 'steamos', 'windows', 'proprietary', 'other'] as const),
  os_version: safeString,
  soc: safeString,
  cpu_arch: safeEnum(['arm64', 'arm32', 'x86_64', 'other'] as const),
  vulkan_support: safeString,
  gpu_driver: safeString,
  benchmark_score: safeNumber,
  performance_grade: safeString,

  // Memory
  ram_mb: safeNumber,
  ram_type: safeString,
  ram_speed_mhz: safeNumber,

  storage_gb: safeNumber,
  storage_type: safeString,
  storage_expandable: safeBoolean,
  microsd_type: safeString,

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
  screen_lens: safeString,

  second_screen_size: safeNumber,
  second_screen_resolution_x: safeNumber,
  second_screen_resolution_y: safeNumber,
  second_screen_touch: safeBoolean,
  second_screen_ppi: safeNumber,
  second_screen_aspect_ratio: safeString,
  second_screen_refresh_rate: safeNumber,
  second_screen_nits: safeNumber,

  // --- Batch B: structured replacements for the imported free text ----------
  soc_vendor: safeString,
  soc_name: safeString,
  soc_gen: safeString,
  gpu_vendor: safeString,
  gpu_name: safeString,
  cpu_clusters: CpuClusterSchema.array().nullable().optional(),

  cooling_type: safeEnum(['passive', 'active', 'hybrid'] as const),
  cooling_fan_count: safeNumber,
  cooling_heatsink: safeBoolean,
  cooling_heatpipe: safeBoolean,
  cooling_vapor_chamber: safeBoolean,
  cooling_vents: safeBoolean,

  speaker_count: safeNumber,
  speaker_config: safeEnum(['mono', 'stereo', 'surround'] as const),
  speaker_placement: safeEnum(['front', 'bottom', 'rear', 'top', 'side', 'front_side', 'internal'] as const),

  charge_port: safeEnum(['usb_c', 'micro_usb', 'mini_usb', 'barrel_dc', 'proprietary', 'none'] as const),
  charge_port_count: safeNumber,
  charge_port_position: safeEnum(['top', 'bottom', 'side', 'back', 'multiple'] as const),

  expansion_slot_count: safeNumber,
  expansion_card_type: safeEnum(['microsd', 'sd', 'memory_stick', 'cfexpress', 'proprietary'] as const),
  expansion_speed_class: safeString,

  lens_material: safeEnum(['tempered_glass', 'gorilla_glass', 'plastic', 'none'] as const),
  lens_laminated: safeBoolean,

  second_screen_display_type: safeString,
  second_screen_tech: safeString,
  second_screen_lens: safeString,

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
  sensors: safeString,

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
