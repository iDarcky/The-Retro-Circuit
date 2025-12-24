
export const MANUFACTURER_FORM_FIELDS = [
  { label: 'Company Name', key: 'name', type: 'text', required: false },
  { label: 'Slug (Unique)', key: 'slug', type: 'text', required: false },
  { label: 'Founded Year', key: 'founded_year', type: 'number', required: false },
  { label: 'Country', key: 'country', type: 'text', required: false },
  { label: 'Website URL', key: 'website', type: 'url', required: false },
  { label: 'Image URL', key: 'image_url', type: 'url', required: false },
  { label: 'Brand Color', key: 'brand_color', type: 'color', required: false, note: 'Hex code or use picker' },
  { label: 'Key Franchises', key: 'key_franchises', type: 'text', required: false },
  { label: 'Description', key: 'description', type: 'textarea', required: false },
];

export const CONSOLE_FORM_FIELDS = [
    { label: 'Console Name', key: 'name', type: 'text', required: true },
    { label: 'Slug (Auto)', key: 'slug', type: 'text', required: true },
    { label: 'Form Factor (Handheld, Console, etc.)', key: 'form_factor', type: 'text', required: false },
    { label: 'Description', key: 'description', type: 'textarea', required: false },
    { label: 'Image URL', key: 'image_url', type: 'url', required: false },

    { subHeader: 'Finder Traits' },
    {
        label: 'Setup Ease (1=Hard, 5=Easy)',
        key: 'setup_ease_score',
        type: 'number',
        required: false,
        width: 'half',
        note: '1: Expert/Linux, 3: Guided, 5: Plug & Play'
    },
    {
        label: 'Community Score (1-5)',
        key: 'community_score',
        type: 'number',
        required: false,
        width: 'half',
        note: '1: None, 5: Massive/Active'
    },
];

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
            { label: 'OS / Firmware', key: 'os', type: 'text', required: false },
            { label: 'UI Skin', key: 'ui_skin', type: 'text', required: false },
            
            { label: 'CPU Model', key: 'cpu_model', type: 'text', required: false, width: 'third' },
            { label: 'CPU Architecture', key: 'cpu_architecture', type: 'text', required: false, width: 'third' },
            { label: 'Process Node', key: 'cpu_process_node', type: 'text', required: false, width: 'third' },

            { label: 'CPU Cores', key: 'cpu_cores', type: 'number', required: false, width: 'third' },
            { label: 'CPU Threads', key: 'cpu_threads', type: 'number', required: false, width: 'third' },
            { label: 'CPU Clock (MHz)', key: 'cpu_clock_mhz', type: 'number', required: false, width: 'third' },
            
            { label: 'GPU Model', key: 'gpu_model', type: 'text', required: false, width: 'third' },
            { label: 'GPU Architecture', key: 'gpu_architecture', type: 'text', required: false, width: 'third' },
            { label: 'CUs / Execution Units', key: 'gpu_compute_units', type: 'text', required: false, width: 'third' },
            
            { label: 'GPU Clock (MHz)', key: 'gpu_clock_mhz', type: 'number', required: false, width: 'third' },
            { label: 'GPU Teraflops', key: 'gpu_teraflops', type: 'number', required: false, step: '0.01', width: 'third' },
        ]
    },
    {
        title: "MEMORY & STORAGE",
        fields: [
            { label: 'RAM Size', key: 'ram_mb', type: 'custom_ram', required: false, width: 'third' },
            { label: 'RAM Type (e.g. LPDDR5)', key: 'ram_type', type: 'text', required: false, width: 'third' },
            { 
                label: 'RAM Speed (Rated)', 
                key: 'ram_speed_mhz', 
                type: 'number', 
                required: false, 
                width: 'third',
                note: 'Use effective speed (MT/s). E.g. 5500.'
            },
            
            { label: 'Base Capacity (GB)', key: 'storage_gb', type: 'number', required: false, width: 'third' },
            { label: 'Storage Type (e.g. UFS 3.1)', key: 'storage_type', type: 'text', required: false, width: 'third' },
            { label: 'MicroSD Slot?', key: 'storage_expandable', type: 'checkbox', required: false, width: 'third' },
        ]
    },
    {
        title: "DISPLAY",
        fields: [
            { label: 'Screen Size (inch)', key: 'screen_size_inch', type: 'number', required: false, step: '0.1', width: 'third' },
            { label: 'Res X (px)', key: 'screen_resolution_x', type: 'number', required: false, width: 'third' },
            { label: 'Res Y (px)', key: 'screen_resolution_y', type: 'number', required: false, width: 'third' },

            { label: 'Aspect Ratio', key: 'aspect_ratio', type: 'text', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated' },
            { label: 'Pixel Density (PPI)', key: 'ppi', type: 'number', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated' },

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

            { label: 'Display Tech (VRR etc)', key: 'display_tech', type: 'text', required: false, width: 'half' },
            { label: 'Touchscreen?', key: 'touchscreen', type: 'checkbox', required: false, width: 'half' },

            { subHeader: 'Secondary Display' },
            { label: '2nd Screen Size', key: 'second_screen_size_inch', type: 'number', required: false, step: '0.1', width: 'third' },
            { label: '2nd Res X', key: 'second_screen_resolution_x', type: 'number', required: false, width: 'third' },
            { label: '2nd Res Y', key: 'second_screen_resolution_y', type: 'number', required: false, width: 'third' },

            { label: '2nd Aspect Ratio', key: 'second_screen_aspect_ratio', type: 'text', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated' },
            { label: '2nd Pixel Density (PPI)', key: 'second_screen_ppi', type: 'number', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated' },

            { label: '2nd Refresh Rate (Hz)', key: 'second_screen_refresh_rate', type: 'number', required: false, width: 'third' },
            { label: '2nd Brightness (nits)', key: 'second_screen_nits', type: 'number', required: false, width: 'third' },
            { label: '2nd Touch?', key: 'second_screen_touch', type: 'checkbox', required: false, width: 'third' },
        ]
    },
    {
        title: "INPUT & MECHANICS",
        fields: [
            { label: 'Input Layout', key: 'input_layout', type: 'select', required: false, width: 'half', options: ['Xbox', 'Nintendo', 'PlayStation', 'Retroid/Unique'] },
            { label: 'Start, Select, Home', key: 'other_buttons', type: 'text', required: false, width: 'half' },

            { label: 'D-Pad Mech', key: 'dpad_mechanism', type: 'text', required: false, width: 'half', note: 'Rubber Dome, Dome Switch...' },
            { label: 'Face Btn Mech', key: 'action_button_mechanism', type: 'text', required: false, width: 'half', note: 'Conductive Rubber, Microswitch...' },

            { label: 'Stick Tech', key: 'thumbstick_mechanism', type: 'text', required: false, width: 'quarter', note: 'Hall Effect, ALPS...' },
            { label: 'Stick Layout', key: 'thumbstick_layout', type: 'text', required: false, width: 'quarter', note: 'Staggered, Inline...' },
            { label: 'L3/R3 Clicks?', key: 'has_stick_clicks', type: 'checkbox', required: false, width: 'quarter' },
            { label: 'Cap Type', key: 'thumbstick_cap', type: 'text', required: false, width: 'quarter', note: 'Concave, Convex...' },

            { label: 'L1/R1 Mech', key: 'bumper_mechanism', type: 'text', required: false, width: 'third' },
            { label: 'L2/R2 Mech', key: 'trigger_mechanism', type: 'text', required: false, width: 'third', note: 'Analog, Digital...' },
            { label: 'Stacked vs Inline', key: 'shoulder_layout', type: 'text', required: false, width: 'third' },

            { label: 'Haptics', key: 'haptics', type: 'text', required: false, width: 'third' },
            { label: 'Gyroscope?', key: 'gyro', type: 'checkbox', required: false, width: 'third' },
            { label: 'Back Buttons?', key: 'has_back_buttons', type: 'checkbox', required: false, width: 'third' },
        ]
    },
    {
        title: "CONNECTIVITY & IO",
        fields: [
            { label: 'Wi-Fi Specs', key: 'wifi_specs', type: 'text', required: false, width: 'quarter' },
            { label: 'Bluetooth Specs', key: 'bluetooth_specs', type: 'text', required: false, width: 'quarter' },
            { label: 'Legacy/Other (IR, NFC)', key: 'other_connectivity', type: 'text', required: false, width: 'quarter' },
            { label: 'Cellular?', key: 'cellular_connectivity', type: 'checkbox', required: false, width: 'quarter' },

            { label: 'Video Output', key: 'video_out', type: 'text', required: false, width: 'full' },

            { label: 'Ports', key: 'ports', type: 'textarea', required: false, width: 'full', note: 'List all physical I/O (USB-C, HDMI, etc.)' },
        ]
    },
    {
        title: "POWER & CHASSIS",
        fields: [
            { label: 'Capacity (mAh)', key: 'battery_capacity_mah', type: 'number', required: false, width: 'third' },
            { label: 'Capacity (Wh)', key: 'battery_capacity_wh', type: 'number', required: false, width: 'third' },
            { label: 'Battery Type', key: 'battery_type', type: 'text', required: false, width: 'third', note: 'Li-Ion, Li-Po, AA...' },

            { label: 'Max Speed (W)', key: 'charging_speed_w', type: 'number', required: false, width: 'third', note: 'For Sorting' },
            { label: 'Charging Specs', key: 'charging_tech', type: 'text', required: false, width: 'third', note: 'e.g. 5V/1.5A, USB-PD' },
            { label: 'Weight (g)', key: 'weight_g', type: 'number', required: false, width: 'third' },
            
            { label: 'Cooling', key: 'cooling_solution', type: 'text', required: false, width: 'full', note: 'Active Fan, Passive...' },

            { label: 'Width (mm)', key: 'width_mm', type: 'number', required: false, width: 'third' },
            { label: 'Height (mm)', key: 'height_mm', type: 'number', required: false, width: 'third' },
            { label: 'Thickness (mm)', key: 'depth_mm', type: 'number', required: false, width: 'third' },

            { label: 'Body Material', key: 'body_material', type: 'text', required: false, width: 'half' },
            { label: 'Available Colors', key: 'available_colors', type: 'text', required: false, width: 'half' },
            
            { label: 'TDP (W)', key: 'tdp_wattage', type: 'number', required: false, width: 'full', note: 'Thermal Design Power' },
        ]
    },
    {
        title: "AUDIO & MISC",
        fields: [
            { label: 'Speakers', key: 'audio_speakers', type: 'text', required: false, width: 'half', note: 'Front-facing Stereo, Mono...' },
            { label: 'Headphone Jack?', key: 'has_headphone_jack', type: 'checkbox', required: false, width: 'quarter' },
            { label: 'Microphone?', key: 'has_microphone', type: 'checkbox', required: false, width: 'quarter' },

            { label: 'Biometrics', key: 'biometrics', type: 'text', required: false, width: 'half', note: 'Fingerprint Sensor, Face Unlock...' },
            { label: 'Camera Specs', key: 'camera_specs', type: 'text', required: false, width: 'half', note: '2MP Front...' },
        ]
    }
];
