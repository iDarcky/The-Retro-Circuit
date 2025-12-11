
import type { ConsoleVariant } from '../types';

export type ComparisonMetric = {
    key: keyof ConsoleVariant;
    label: string;
    type: 'number' | 'string' | 'boolean' | 'currency' | 'resolution';
    unit?: string;
    lowerIsBetter?: boolean;
    category?: string;
};

export const METRICS: ComparisonMetric[] = [
    // --- IDENTITY ---
    { label: 'Release Year', key: 'release_year', type: 'number' },
    { label: 'Launch Price', key: 'price_launch_usd', type: 'currency', lowerIsBetter: true },
    { label: 'Model Number', key: 'model_no', type: 'string' },
    { label: 'OS / Firmware', key: 'os', type: 'string' },
    { label: 'UI Skin', key: 'ui_skin', type: 'string' },

    // --- DISPLAY ---
    { label: 'Screen Size', key: 'screen_size_inch', type: 'number', unit: '\"' },
    { label: 'Resolution', key: 'screen_resolution_x', type: 'resolution' },
    { label: 'Display Type', key: 'display_type', type: 'string' },
    { label: 'Display Tech', key: 'display_tech', type: 'string' },
    { label: 'Refresh Rate', key: 'refresh_rate_hz', type: 'number', unit: 'Hz' },
    { label: 'Pixel Density', key: 'ppi', type: 'number', unit: 'PPI' },
    { label: 'Brightness', key: 'brightness_nits', type: 'number', unit: ' nits' },
    { label: 'Touchscreen', key: 'touchscreen', type: 'boolean' },
    { label: 'Aspect Ratio', key: 'aspect_ratio', type: 'string' },
    
    // --- Secondary Display ---
    { label: '2nd Screen Size', key: 'second_screen_size_inch', type: 'number', unit: '\"' },
    { label: '2nd Screen Touch', key: 'second_screen_touch', type: 'boolean' },
    { label: '2nd Screen PPI', key: 'second_screen_ppi', type: 'number', unit: 'PPI' },
    { label: '2nd Screen Aspect Ratio', key: 'second_screen_aspect_ratio', type: 'string' },
    { label: '2nd Screen Refresh Rate', key: 'second_screen_refresh_rate_hz', type: 'number', unit: 'Hz' },
    { label: '2nd Screen Brightness', key: 'second_screen_brightness_nits', type: 'number', unit: 'nits' },

    // --- PROCESSING ---
    { label: 'CPU Model', key: 'cpu_model', type: 'string' },
    { label: 'CPU Arch', key: 'cpu_architecture', type: 'string' },
    { label: 'Process Node', key: 'cpu_process_node', type: 'string' },
    { label: 'CPU Cores', key: 'cpu_cores', type: 'number' },
    { label: 'CPU Threads', key: 'cpu_threads', type: 'number' },
    { label: 'CPU Clock', key: 'cpu_clock_mhz', type: 'number', unit: ' MHz' },
    
    { label: 'GPU Model', key: 'gpu_model', type: 'string' },
    { label: 'GPU Arch', key: 'gpu_architecture', type: 'string' },
    { label: 'GPU Cores', key: 'gpu_cores', type: 'number' },
    { label: 'GPU Units', key: 'gpu_compute_units', type: 'string' },
    { label: 'GPU Clock', key: 'gpu_clock_mhz', type: 'number', unit: ' MHz' },
    { label: 'Compute Power', key: 'gpu_teraflops', type: 'number', unit: ' TFLOPS' },

    // --- MEMORY & STORAGE ---
    { label: 'RAM', key: 'ram_mb', type: 'number', unit: ' MB' },
    { label: 'RAM Type', key: 'ram_type', type: 'string' },
    { label: 'RAM Speed', key: 'ram_speed_mhz', type: 'number', unit: ' MHz' },
    { label: 'Storage', key: 'storage_gb', type: 'number', unit: ' GB' },
    { label: 'Storage Type', key: 'storage_type', type: 'string' },
    { label: 'Expandable', key: 'storage_expandable', type: 'boolean' },

    // --- POWER ---
    { label: 'Battery Capacity', key: 'battery_capacity_mah', type: 'number', unit: ' mAh' },
    { label: 'Battery Energy', key: 'battery_capacity_wh', type: 'number', unit: ' Wh' },
    { label: 'Charging Speed', key: 'charging_speed_w', type: 'number', unit: 'W' },
    { label: 'TDP', key: 'tdp_wattage', type: 'number', unit: 'W' },

    // --- CONNECTIVITY & IO ---
    { label: 'Wi-Fi', key: 'wifi_specs', type: 'string' },
    { label: 'Bluetooth', key: 'bluetooth_specs', type: 'string' },
    { label: 'Cellular', key: 'cellular_connectivity', type: 'boolean' },
    { label: 'Video Output', key: 'video_out', type: 'string' },
    { label: 'Ports', key: 'ports', type: 'string' },
    
    // --- AUDIO & MISC ---
    { label: 'Speakers', key: 'audio_speakers', type: 'string' },
    { label: 'Audio Tech', key: 'audio_tech', type: 'string' },
    { label: 'Headphone Jack', key: 'has_headphone_jack', type: 'boolean' },
    { label: 'Microphone', key: 'has_microphone', type: 'boolean' },
    { label: 'Camera', key: 'camera_specs', type: 'string' },
    { label: 'Biometrics', key: 'biometrics', type: 'string' },

    // --- CONTROLS & SENSORS ---
    { label: 'Input Layout', key: 'input_layout', type: 'string' },
    { label: 'D-Pad Mech', key: 'dpad_mechanism', type: 'string' },
    { label: 'D-Pad Shape', key: 'dpad_shape', type: 'string' },
    { label: 'Stick Mech', key: 'thumbstick_mechanism', type: 'string' },
    { label: 'Stick Layout', key: 'thumbstick_layout', type: 'string' },
    { label: 'Stick Cap', key: 'thumbstick_cap', type: 'string' },
    { label: 'Triggers', key: 'trigger_mechanism', type: 'string' },
    { label: 'Shoulders', key: 'shoulder_layout', type: 'string' },
    { label: 'Action Buttons', key: 'action_button_mechanism', type: 'string' },
    { label: 'Back Buttons', key: 'has_back_buttons', type: 'boolean' },
    { label: 'Haptics', key: 'haptics', type: 'string' },
    { label: 'Gyroscope', key: 'gyro', type: 'boolean' },

    // --- PHYSICAL ---
    { label: 'Width (mm)', key: 'width_mm', type: 'number' },
    { label: 'Height (mm)', key: 'height_mm', type: 'number' },
    { label: 'Thickness (mm)', key: 'depth_mm', type: 'number' },
    { label: 'Weight', key: 'weight_g', type: 'number', unit: 'g', lowerIsBetter: true },
    { label: 'Body Material', key: 'body_material', type: 'string' },
    { label: 'Cooling', key: 'cooling_solution', type: 'string' },
    { label: 'Colors', key: 'available_colors', type: 'string' },
];
