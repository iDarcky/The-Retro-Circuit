
export type ComparisonMetric = {
    key: string; // Changed from keyof ConsoleVariant to allow string for nested path access
    label: string;
    type: 'number' | 'string' | 'boolean' | 'currency' | 'resolution';
    unit?: string;
    lowerIsBetter?: boolean;
    /** No side wins this row. Dimensions are a preference, not a score: a wider device
     *  is not a better one, and the table should not claim otherwise. */
    neutral?: boolean;
    category?: string;
    path?: string[]; // Path to nested property if not on root
};

export const METRICS: ComparisonMetric[] = [
    // --- IDENTITY ---
    { label: 'Launch Price', key: 'price_launch_usd', type: 'currency', lowerIsBetter: true , category: 'Identity' },
    { label: 'Model Number', key: 'model_no', type: 'string' , category: 'Identity' },
    { label: 'OS / Firmware', key: 'os', type: 'string' , category: 'Identity' },
    { label: 'UI Skin', key: 'ui_skin', type: 'string' , category: 'Identity' },

    // --- DISPLAY ---
    { label: 'Screen Size', key: 'screen_size_inch', type: 'number', unit: '\"' , category: 'Display' },
    { label: 'Resolution', key: 'screen_resolution_x', type: 'resolution' , category: 'Display' },
    { label: 'Display Type', key: 'display_type', type: 'string' , category: 'Display' },
    { label: 'Display Tech', key: 'display_tech', type: 'string' , category: 'Display' },
    { label: 'Refresh Rate', key: 'refresh_rate_hz', type: 'number', unit: 'Hz' , category: 'Display' },
    { label: 'Pixel Density', key: 'ppi', type: 'number', unit: 'PPI' , category: 'Display' },
    { label: 'Brightness', key: 'brightness_nits', type: 'number', unit: ' nits' , category: 'Display' },
    { label: 'Touchscreen', key: 'touchscreen', type: 'boolean' , category: 'Display' },
    { label: 'Aspect Ratio', key: 'aspect_ratio', type: 'string' , category: 'Display' },
    
    // --- Secondary Display ---
    { label: '2nd Screen Size', key: 'second_screen_size', type: 'number', unit: '"' , category: 'Second screen' },
    { label: '2nd Screen Touch', key: 'second_screen_touch', type: 'boolean' , category: 'Second screen' },
    { label: '2nd Screen PPI', key: 'second_screen_ppi', type: 'number', unit: 'PPI' , category: 'Second screen' },
    { label: '2nd Screen Aspect Ratio', key: 'second_screen_aspect_ratio', type: 'string' , category: 'Second screen' },
    { label: '2nd Screen Refresh Rate', key: 'second_screen_refresh_rate', type: 'number', unit: 'Hz' , category: 'Second screen' },
    { label: '2nd Screen Brightness', key: 'second_screen_nits', type: 'number', unit: 'nits' , category: 'Second screen' },

    // --- PROCESSING ---
    { label: 'CPU Model', key: 'cpu_model', type: 'string' , category: 'Processing' },
    { label: 'CPU Arch', key: 'cpu_architecture', type: 'string' , category: 'Processing' },
    { label: 'Process Node', key: 'cpu_process_node', type: 'string' , category: 'Processing' },
    { label: 'CPU Cores', key: 'cpu_cores', type: 'number' , category: 'Processing' },
    { label: 'CPU Threads', key: 'cpu_threads', type: 'number' , category: 'Processing' },
    { label: 'CPU Clock (Max)', key: 'cpu_clock_max_mhz', type: 'number', unit: ' MHz' , category: 'Processing' },
    
    { label: 'GPU Model', key: 'gpu_model', type: 'string' , category: 'Processing' },
    { label: 'GPU Arch', key: 'gpu_architecture', type: 'string' , category: 'Processing' },
    { label: 'GPU Cores', key: 'gpu_cores', type: 'number' , category: 'Processing' },
    { label: 'GPU Units', key: 'gpu_compute_units', type: 'string' , category: 'Processing' },
    { label: 'GPU Clock', key: 'gpu_clock_mhz', type: 'number', unit: ' MHz' , category: 'Processing' },
    { label: 'Compute Power', key: 'gpu_teraflops', type: 'number', unit: ' TFLOPS' , category: 'Processing' },

    // --- MEMORY & STORAGE ---
    { label: 'RAM', key: 'ram_mb', type: 'number', unit: ' MB' , category: 'Memory and storage' },
    { label: 'RAM Type', key: 'ram_type', type: 'string' , category: 'Memory and storage' },
    { label: 'RAM Speed', key: 'ram_speed_mhz', type: 'number', unit: ' MHz' , category: 'Memory and storage' },
    { label: 'Storage', key: 'storage_gb', type: 'number', unit: ' GB' , category: 'Memory and storage' },
    { label: 'Storage Type', key: 'storage_type', type: 'string' , category: 'Memory and storage' },
    { label: 'Expandable', key: 'storage_expandable', type: 'boolean' , category: 'Memory and storage' },
    { label: 'Card Type', key: 'expansion_card_type', type: 'string' , category: 'Memory and storage' },

    // --- POWER ---
    { label: 'Battery Capacity', key: 'battery_capacity_mah', type: 'number', unit: ' mAh' , category: 'Power' },
    { label: 'Battery Energy', key: 'battery_capacity_wh', type: 'number', unit: ' Wh' , category: 'Power' },
    { label: 'Charging Speed', key: 'charging_speed_w', type: 'number', unit: 'W' , category: 'Power' },
    { label: 'TDP', key: 'tdp_wattage', type: 'number', unit: 'W' , category: 'Power' },

    // --- CONNECTIVITY & IO ---
    { label: 'Wi-Fi', key: 'wifi_specs', type: 'string' , category: 'Connectivity' },
    { label: 'Bluetooth', key: 'bluetooth_specs', type: 'string' , category: 'Connectivity' },
    { label: 'Cellular', key: 'cellular_connectivity', type: 'boolean' , category: 'Connectivity' },
    { label: 'Video Output', key: 'video_out', type: 'string' , category: 'Connectivity' },
    { label: 'Ports', key: 'ports', type: 'string' , category: 'Connectivity' },
    { label: 'Charge Port', key: 'charge_port', type: 'string' , category: 'Connectivity' },
    
    // --- AUDIO & MISC ---
    { label: 'Speakers', key: 'audio_speakers', type: 'string' , category: 'Audio and extras' },
    { label: 'Speaker Config', key: 'speaker_config', type: 'string' , category: 'Audio and extras' },
    { label: 'Audio Tech', key: 'audio_tech', type: 'string' , category: 'Audio and extras' },
    { label: 'Headphone Jack', key: 'has_headphone_jack', type: 'boolean' , category: 'Audio and extras' },
    { label: 'Microphone', key: 'has_microphone', type: 'boolean' , category: 'Audio and extras' },
    { label: 'Camera', key: 'camera_specs', type: 'string' , category: 'Audio and extras' },
    { label: 'Biometrics', key: 'biometrics', type: 'string' , category: 'Audio and extras' },

    // --- CONTROLS & SENSORS (New Profile Fields) ---
    { label: 'D-Pad Tech', key: 'dpad_tech', type: 'string', path: ['variant_input_profile', 'dpad_tech'] , category: 'Controls' },
    { label: 'D-Pad Shape', key: 'dpad_shape', type: 'string', path: ['variant_input_profile', 'dpad_shape'] , category: 'Controls' },
    { label: 'Stick Tech', key: 'stick_tech', type: 'string', path: ['variant_input_profile', 'stick_tech'] , category: 'Controls' },
    { label: 'Stick Layout', key: 'stick_layout', type: 'string', path: ['variant_input_profile', 'stick_layout'] , category: 'Controls' },
    { label: 'Stick Cap', key: 'stick_cap', type: 'string', path: ['variant_input_profile', 'stick_cap'] , category: 'Controls' },
    { label: 'Stick Count', key: 'stick_count', type: 'number', path: ['variant_input_profile', 'stick_count'] , category: 'Controls' },

    { label: 'Face Btn Tech', key: 'face_button_tech', type: 'string', path: ['variant_input_profile', 'face_button_tech'] , category: 'Controls' },
    { label: 'Face Btn Layout', key: 'face_button_layout', type: 'string', path: ['variant_input_profile', 'face_button_layout'] , category: 'Controls' },

    { label: 'Trigger Tech', key: 'trigger_tech', type: 'string', path: ['variant_input_profile', 'trigger_tech'] , category: 'Controls' },
    { label: 'Trigger Type', key: 'trigger_type', type: 'string', path: ['variant_input_profile', 'trigger_type'] , category: 'Controls' },
    { label: 'Bumper Tech', key: 'bumper_tech', type: 'string', path: ['variant_input_profile', 'bumper_tech'] , category: 'Controls' },

    { label: 'Back Buttons', key: 'back_button_count', type: 'number', path: ['variant_input_profile', 'back_button_count'] , category: 'Controls' },
    { label: 'Gyroscope', key: 'has_gyro', type: 'boolean', path: ['variant_input_profile', 'has_gyro'] , category: 'Controls' },
    { label: 'Rumble', key: 'has_rumble', type: 'boolean', path: ['variant_input_profile', 'has_rumble'] , category: 'Controls' },

    // --- PHYSICAL ---
    { label: 'Width (mm)', neutral: true, key: 'width_mm', type: 'number' , category: 'Physical' },
    { label: 'Height (mm)', neutral: true, key: 'height_mm', type: 'number' , category: 'Physical' },
    { label: 'Thickness (mm)', neutral: true, key: 'depth_mm', type: 'number' , category: 'Physical' },
    { label: 'Weight', key: 'weight_g', type: 'number', unit: 'g', lowerIsBetter: true , category: 'Physical' },
    { label: 'Body Material', key: 'body_material', type: 'string' , category: 'Physical' },
    { label: 'Cooling', key: 'cooling_type', type: 'string' , category: 'Physical' },
    { label: 'Colors', key: 'available_colors', type: 'string' , category: 'Physical' },
];
