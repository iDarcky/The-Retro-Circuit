
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
        title: "IDENTITY & RELEASE",
        fields: [
            { label: 'Variant Name (e.g. "OLED Model")', key: 'variant_name', type: 'text', required: false, width: 'half' },
            { label: 'Model No.', key: 'model_no', type: 'text', required: false, width: 'quarter' },
            { label: 'Is Default/Base Model?', key: 'is_default', type: 'checkbox', required: false, width: 'quarter' },

            { label: 'Release Date', key: 'release_date', type: 'custom_date', required: false, width: 'full' },

            { label: 'Launch Price — MSRP at release ($)', key: 'price_launch_usd', type: 'number', required: false, width: 'third' },
            { label: 'Street Price — typical today ($)', key: 'price_avg_usd', type: 'number', required: false, width: 'third', note: 'Preferred for display and Best Of ranking.' },
            { label: 'Amazon ASIN', key: 'amazon_asin', type: 'text', required: false, width: 'third' },
        ]
    },
    {
        title: "PLATFORM / OS",
        fields: [
            { label: 'OS Family', key: 'os_family', type: 'select', required: false, width: 'quarter',
              options: ['android', 'linux', 'steamos', 'windows', 'proprietary', 'other'] },
            { label: 'OS Version (e.g. 13)', key: 'os_version', type: 'text', required: false, width: 'quarter' },
            { label: 'OS name / distro', key: 'os', type: 'text', required: false, width: 'quarter',
              note: 'Only if it differs from family + version, e.g. "Linux (RetroPie)".' },
            { label: 'UI Skin / Launcher', key: 'ui_skin', type: 'text', required: false, width: 'quarter',
              note: 'e.g. MinUI, OnionOS, KDE Plasma.' },
        ]
    },
    {
        title: "SILICON",
        fields: [
            { subHeader: 'CPU', column: true },
            { label: 'Cores', key: 'cpu_clusters', type: 'custom_cpu_clusters', required: false, subGroup: 'CPU' },
            { label: 'CPU Model (legacy text)', key: 'cpu_model', type: 'text', required: false, subGroup: 'CPU',
              note: 'Superseded by Cores above; kept while the two are reconciled.' },
            { label: 'CPU Arch', key: 'cpu_arch', type: 'select', required: false, subGroup: 'CPU',
              options: ['arm64', 'arm32', 'x86_64', 'other'] },
            { label: 'Architecture detail', key: 'cpu_architecture', type: 'text', required: false, subGroup: 'CPU' },
            { label: 'Total Cores', key: 'cpu_cores', type: 'number', required: false, subGroup: 'CPU' },
            { label: 'Threads', key: 'cpu_threads', type: 'number', required: false, subGroup: 'CPU' },
            { label: 'Clock Min', key: 'cpu_clock_min_mhz', type: 'custom_clock', required: false, subGroup: 'CPU' },
            { label: 'Clock Max', key: 'cpu_clock_max_mhz', type: 'custom_clock', required: false, subGroup: 'CPU' },

            { subHeader: 'GPU', column: true },
            { label: 'GPU Vendor', key: 'gpu_vendor', type: 'select', required: false, subGroup: 'GPU',
              options: ['Qualcomm', 'ARM', 'AMD', 'Intel', 'NVIDIA', 'Imagination', 'Broadcom', 'Other'] },
            { label: 'GPU Name', key: 'gpu_name', type: 'text', required: false, subGroup: 'GPU', note: 'e.g. Adreno 740' },
            { label: 'GPU Architecture', key: 'gpu_architecture', type: 'text', required: false, subGroup: 'GPU' },
            { label: 'GPU Cores', key: 'gpu_cores', type: 'number', required: false, subGroup: 'GPU' },
            { label: 'CUs / Execution Units', key: 'gpu_compute_units', type: 'text', required: false, subGroup: 'GPU' },
            { label: 'GPU Clock', key: 'gpu_clock_mhz', type: 'custom_clock', required: false, subGroup: 'GPU' },
            { label: 'Teraflops', key: 'gpu_teraflops', type: 'number', required: false, step: '0.01', subGroup: 'GPU' },
            { label: 'GPU Model (legacy text)', key: 'gpu_model', type: 'text', required: false, subGroup: 'GPU' },

            { subHeader: 'Platform', column: true },
            { label: 'SoC Vendor', key: 'soc_vendor', type: 'select', required: false, subGroup: 'Platform',
              options: ['Qualcomm', 'MediaTek', 'Rockchip', 'Allwinner', 'AMD', 'Intel', 'Ingenic',
                        'Actions Semiconductor', 'SigmaStar', 'Broadcom', 'Samsung', 'Apple', 'NVIDIA', 'Other'] },
            { label: 'SoC Name', key: 'soc_name', type: 'text', required: false, subGroup: 'Platform', note: 'e.g. Snapdragon 8' },
            { label: 'Generation', key: 'soc_gen', type: 'text', required: false, subGroup: 'Platform',
              note: 'e.g. Gen 2. Ranks above clock speed.' },
            { label: 'SoC (legacy text)', key: 'soc', type: 'text', required: false, subGroup: 'Platform' },
            { label: 'Process Node', key: 'cpu_process_node', type: 'text', required: false, subGroup: 'Platform' },
            { label: 'Vulkan Support', key: 'vulkan_support', type: 'text', required: false, subGroup: 'Platform', note: 'e.g. 1.3' },
            { label: 'GPU Driver / Turnip', key: 'gpu_driver', type: 'text', required: false, subGroup: 'Platform' },
            { label: 'Benchmark (AnTuTu)', key: 'benchmark_score', type: 'number', required: false, subGroup: 'Platform' },
            { label: 'Performance Rating', key: 'performance_grade', type: 'text', required: false, subGroup: 'Platform' },
        ]
    },
    {
        title: "MEMORY & STORAGE",
        fields: [
            { label: 'RAM Size', key: 'ram_mb', type: 'custom_ram', required: false, width: 'third' },
            { label: 'RAM Type (e.g. LPDDR5)', key: 'ram_type', type: 'text', required: false, width: 'third' },
            { label: 'RAM Speed (Rated)', key: 'ram_speed_mhz', type: 'number', required: false, width: 'third',
              note: 'Use effective speed (MT/s). E.g. 5500.' },

            { label: 'Base Capacity (GB)', key: 'storage_gb', type: 'number', required: false, width: 'half' },
            { label: 'Storage Type (e.g. UFS 3.1)', key: 'storage_type', type: 'text', required: false, width: 'half' },

            { label: 'Expandable Storage?', key: 'storage_expandable', type: 'checkbox', required: false, width: 'quarter' },
            { label: 'Card Slots', key: 'expansion_slot_count', type: 'select', required: false, width: 'quarter', options: ['0', '1', '2'] },
            { label: 'Card Type', key: 'expansion_card_type', type: 'select', required: false, width: 'quarter',
              options: ['microsd', 'sd', 'memory_stick', 'cfexpress', 'proprietary'] },
            { label: 'Speed Class', key: 'expansion_speed_class', type: 'text', required: false, width: 'quarter', note: 'UHS-I, UHS-II' },
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

            { label: 'Panel Type', key: 'display_type', type: 'select', required: false, width: 'third',
              options: ['IPS LCD', 'OLED', 'AMOLED', 'TN LCD', 'Mini-LED', 'Micro-LED', 'TFT LCD'] },
            { label: 'Refresh Rate (Hz)', key: 'refresh_rate_hz', type: 'number', required: false, width: 'third' },
            { label: 'Brightness (nits)', key: 'brightness_nits', type: 'number', required: false, width: 'third' },

            { label: 'Lens Material', key: 'lens_material', type: 'select', required: false, width: 'quarter',
              options: ['tempered_glass', 'gorilla_glass', 'plastic', 'none'] },
            { label: 'OCA Laminated?', key: 'lens_laminated', type: 'checkbox', required: false, width: 'quarter' },
            { label: 'Display Tech (VRR, contrast, sRGB)', key: 'display_tech', type: 'text', required: false, width: 'quarter' },
            { label: 'Touchscreen?', key: 'touchscreen', type: 'checkbox', required: false, width: 'quarter' },

            // Only 9 of 514 variants have a second screen, so the block stays folded
            // away until this toggle is on (it opens itself when data is present).
            { type: 'custom_second_screen_toggle', key: '__second_screen_toggle', width: 'full' },

            { label: '2nd Screen Size (inch)', key: 'second_screen_size', type: 'number', required: false, step: '0.1', width: 'third', optionalGroup: 'second_screen' },
            { label: '2nd Res X', key: 'second_screen_resolution_x', type: 'number', required: false, width: 'third', optionalGroup: 'second_screen' },
            { label: '2nd Res Y', key: 'second_screen_resolution_y', type: 'number', required: false, width: 'third', optionalGroup: 'second_screen' },

            { label: '2nd Aspect Ratio', key: 'second_screen_aspect_ratio', type: 'text', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated', optionalGroup: 'second_screen' },
            { label: '2nd Pixel Density (PPI)', key: 'second_screen_ppi', type: 'number', required: false, width: 'half', visualStyle: 'computed', note: 'Auto-calculated', optionalGroup: 'second_screen' },

            { label: '2nd Panel Type', key: 'second_screen_display_type', type: 'select', required: false, width: 'third', optionalGroup: 'second_screen',
              options: ['IPS LCD', 'OLED', 'AMOLED', 'TN LCD', 'Mini-LED', 'Micro-LED', 'TFT LCD'] },
            { label: '2nd Refresh Rate (Hz)', key: 'second_screen_refresh_rate', type: 'number', required: false, width: 'third', optionalGroup: 'second_screen' },
            { label: '2nd Brightness (nits)', key: 'second_screen_nits', type: 'number', required: false, width: 'third', optionalGroup: 'second_screen' },

            { label: '2nd Lens', key: 'second_screen_lens', type: 'text', required: false, width: 'third', optionalGroup: 'second_screen' },
            { label: '2nd Display Tech', key: 'second_screen_tech', type: 'text', required: false, width: 'third', optionalGroup: 'second_screen' },
            { label: '2nd Touch?', key: 'second_screen_touch', type: 'checkbox', required: false, width: 'third', optionalGroup: 'second_screen' },
        ]
    },
    {
        title: "INPUT",
        fields: [
            { subHeader: 'D-pad', column: true },
            { label: 'Shape', key: 'dpad_shape', type: 'select', required: false, subGroup: 'D-pad', options: ['cross', 'disc', 'segmented', 'unknown'] },
            { label: 'Tech', key: 'dpad_tech', type: 'select', required: false, subGroup: 'D-pad', options: ['membrane', 'microswitch', 'mechanical', 'hall', 'tmr', 'potentiometer', 'spring', 'optical', 'unknown'] },
            { label: 'Placement', key: 'dpad_placement', type: 'select', required: false, subGroup: 'D-pad', options: ['left', 'right', 'center', 'top', 'bottom', 'unknown'] },

            { subHeader: 'Face buttons', column: true },
            { label: 'Count', key: 'face_button_count', type: 'select', required: false, subGroup: 'Face buttons', options: ['2', '4', '6'] },
            { label: 'Tech', key: 'face_button_tech', type: 'select', required: false, subGroup: 'Face buttons', options: ['membrane', 'microswitch', 'mechanical', 'hall', 'tmr', 'potentiometer', 'spring', 'optical', 'unknown'] },
            { label: 'Label Scheme', key: 'face_label_scheme', type: 'select', required: false, subGroup: 'Face buttons', options: ['nintendo', 'xbox', 'playstation', 'generic', 'unknown'] },

            { subHeader: 'Sticks', column: true },
            { label: 'Count', key: 'stick_count', type: 'select', required: false, subGroup: 'Sticks', options: ['0', '1', '2'] },
            { label: 'Layout', key: 'stick_layout', type: 'select', required: false, subGroup: 'Sticks', options: ['symmetric', 'asymmetric', 'centered', 'unknown'] },
            { label: 'Placement', key: 'stick_placement', type: 'select', required: false, subGroup: 'Sticks', options: ['left', 'right', 'center', 'top', 'bottom', 'unknown'] },
            { label: 'Tech', key: 'stick_tech', type: 'select', required: false, subGroup: 'Sticks', options: ['membrane', 'microswitch', 'mechanical', 'hall', 'tmr', 'potentiometer', 'spring', 'optical', 'unknown'] },
            { label: 'Cap Style', key: 'stick_cap', type: 'select', required: false, subGroup: 'Sticks', options: ['concave', 'convex', 'flat', 'domed', 'textured', 'unknown'] },
            { label: 'L3/R3 Clicks?', key: 'stick_clicks', type: 'checkbox', required: false, subGroup: 'Sticks' },

            { subHeader: 'Shoulders & triggers', column: true },
            { label: 'Bumper Tech', key: 'bumper_tech', type: 'select', required: false, subGroup: 'Shoulders & triggers', options: ['membrane', 'microswitch', 'mechanical', 'hall', 'tmr', 'potentiometer', 'spring', 'optical', 'unknown'] },
            { label: 'Bumper Type', key: 'bumper_type', type: 'select', required: false, subGroup: 'Shoulders & triggers', options: ['digital', 'analog', 'unknown'] },
            { label: 'Trigger Tech', key: 'trigger_tech', type: 'select', required: false, subGroup: 'Shoulders & triggers', options: ['membrane', 'microswitch', 'mechanical', 'hall', 'tmr', 'potentiometer', 'spring', 'optical', 'unknown'] },
            { label: 'Trigger Type', key: 'trigger_type', type: 'select', required: false, subGroup: 'Shoulders & triggers', options: ['digital', 'analog', 'unknown'] },
            { label: 'Layout', key: 'trigger_layout', type: 'select', required: false, subGroup: 'Shoulders & triggers', options: ['inline', 'stacked', 'shelf', 'unknown'] },

            { subHeader: 'Extras', column: true },
            { label: 'Back Buttons', key: 'back_button_count', type: 'select', required: false, subGroup: 'Extras', options: ['0', '2', '4'] },
            { label: 'Touchpads', key: 'touchpad_count', type: 'select', required: false, subGroup: 'Extras', options: ['0', '1', '2'] },
            { label: 'Touchpad Click?', key: 'touchpad_clickable', type: 'checkbox', required: false, subGroup: 'Extras' },
            { label: 'Has Keyboard?', key: 'has_keyboard', type: 'checkbox', required: false, subGroup: 'Extras' },
            { label: 'Rumble / Vibration?', key: 'has_rumble', type: 'checkbox', required: false, subGroup: 'Extras',
              note: 'Force feedback you feel. Not the same thing as the gyroscope under Audio & Sensors.' },
            { label: 'System Button Set', key: 'system_button_set', type: 'select', required: false, subGroup: 'Extras',
              options: ['minimal', 'standard', 'extended', 'unknown'],
              note: 'minimal = Start/Select · standard = + Home · extended = + Function/Turbo' },
            { label: 'System Buttons', key: 'system_buttons_text', type: 'text', required: false, subGroup: 'Extras', note: 'e.g. Start, Select, Home' },

            { label: 'Confidence', key: 'input_confidence', type: 'select', required: false, width: 'third', options: ['confirmed', 'inferred', 'unknown'] },
            { label: 'Notes', key: 'input_notes', type: 'textarea', required: false, width: 'full' },
        ]
    },
    {
        title: "CONNECTIVITY",
        fields: [
            { label: 'Wi-Fi Specs', key: 'wifi_specs', type: 'text', required: false, width: 'quarter' },
            { label: 'Bluetooth Specs', key: 'bluetooth_specs', type: 'text', required: false, width: 'quarter' },
            { label: 'Cellular?', key: 'cellular_connectivity', type: 'text', required: false, width: 'quarter' },
            { label: 'Legacy/Other (IR, NFC)', key: 'other_connectivity', type: 'text', required: false, width: 'quarter' },
            { label: 'Video Output', key: 'video_out', type: 'text', required: false, width: 'full' },
        ]
    },
    {
        title: "POWER & THERMALS",
        fields: [
            { subHeader: 'Battery', column: true },
            { label: 'Capacity (mAh)', key: 'battery_capacity_mah', type: 'number', required: false, subGroup: 'Battery' },
            { label: 'Capacity (Wh)', key: 'battery_capacity_wh', type: 'number', required: false, subGroup: 'Battery' },
            { label: 'Battery Type', key: 'battery_type', type: 'text', required: false, subGroup: 'Battery', note: 'Li-Ion, Li-Po, AA...' },

            { subHeader: 'Charging', column: true },
            { label: 'Charge Port', key: 'charge_port', type: 'select', required: false, subGroup: 'Charging',
              options: ['usb_c', 'micro_usb', 'mini_usb', 'barrel_dc', 'proprietary', 'none'] },
            { label: 'Port Count', key: 'charge_port_count', type: 'select', required: false, subGroup: 'Charging', options: ['1', '2', '3'] },
            { label: 'Port Position', key: 'charge_port_position', type: 'select', required: false, subGroup: 'Charging',
              options: ['top', 'bottom', 'side', 'back', 'multiple'] },
            { label: 'Max Speed (W)', key: 'charging_speed_w', type: 'number', required: false, subGroup: 'Charging' },
            { label: 'Charging Specs', key: 'charging_tech', type: 'text', required: false, subGroup: 'Charging', note: 'e.g. 5V/1.5A, USB-PD' },

            { subHeader: 'Thermals', column: true },
            { label: 'Cooling Type', key: 'cooling_type', type: 'select', required: false, subGroup: 'Thermals',
              options: ['passive', 'active', 'hybrid'] },
            { label: 'Fans', key: 'cooling_fan_count', type: 'select', required: false, subGroup: 'Thermals', options: ['0', '1', '2'] },
            { label: 'Heatsink', key: 'cooling_heatsink', type: 'checkbox', required: false, subGroup: 'Thermals' },
            { label: 'Heatpipe', key: 'cooling_heatpipe', type: 'checkbox', required: false, subGroup: 'Thermals' },
            { label: 'Vapor Chamber', key: 'cooling_vapor_chamber', type: 'checkbox', required: false, subGroup: 'Thermals' },
            { label: 'Ventilation Cutouts', key: 'cooling_vents', type: 'checkbox', required: false, subGroup: 'Thermals' },
            { label: 'TDP (W)', key: 'tdp_wattage', type: 'number', required: false, subGroup: 'Thermals' },
            { label: 'Cooling Notes', key: 'cooling_solution', type: 'text', required: false, subGroup: 'Thermals',
              note: 'Only for unusual setups the checkboxes miss.' },
        ]
    },
    {
        title: "CHASSIS",
        fields: [
            { label: 'Width (mm)', key: 'width_mm', type: 'number', required: false, width: 'quarter' },
            { label: 'Height (mm)', key: 'height_mm', type: 'number', required: false, width: 'quarter' },
            { label: 'Thickness (mm)', key: 'depth_mm', type: 'number', required: false, width: 'quarter' },
            { label: 'Weight (g)', key: 'weight_g', type: 'number', required: false, width: 'quarter' },

            { label: 'Body Material', key: 'body_material', type: 'text', required: false, width: 'half' },
            { label: 'Available Colors', key: 'available_colors', type: 'text', required: false, width: 'half' },

            { label: 'Ports', key: 'ports', type: 'textarea', required: false, width: 'full',
              note: 'Full physical I/O list. The charge port has its own fields under Power.' },
        ]
    },
    {
        title: "AUDIO & SENSORS",
        fields: [
            { subHeader: 'Speakers', column: true },
            { label: 'Count', key: 'speaker_count', type: 'select', required: false, subGroup: 'Speakers', options: ['0', '1', '2', '4'] },
            { label: 'Config', key: 'speaker_config', type: 'select', required: false, subGroup: 'Speakers', options: ['mono', 'stereo', 'surround'] },
            { label: 'Placement', key: 'speaker_placement', type: 'select', required: false, subGroup: 'Speakers',
              options: ['front', 'bottom', 'rear', 'top', 'side', 'front_side', 'internal'] },
            { label: 'Audio Tech', key: 'audio_tech', type: 'text', required: false, subGroup: 'Speakers', note: 'DTS, Dolby...' },
            { label: 'Headphone Jack?', key: 'has_headphone_jack', type: 'checkbox', required: false, subGroup: 'Speakers' },
            { label: 'Microphone?', key: 'has_microphone', type: 'checkbox', required: false, subGroup: 'Speakers' },

            { subHeader: 'Sensors', column: true },
            { label: 'Gyroscope?', key: 'has_gyro', type: 'checkbox', required: false, subGroup: 'Sensors',
              note: 'Motion sensing only. Rumble is a separate field, under Input > Extras.' },
            { label: 'Biometrics', key: 'biometrics', type: 'text', required: false, subGroup: 'Sensors', note: 'Fingerprint, Face Unlock...' },
            { label: 'Camera Specs', key: 'camera_specs', type: 'text', required: false, subGroup: 'Sensors', note: '2MP Front...' },
            { label: 'Other Sensors', key: 'sensors', type: 'text', required: false, subGroup: 'Sensors',
              note: 'Ambient light, accelerometer. Gyro and fingerprint have their own fields.' },
        ]
    }
];
