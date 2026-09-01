/* The spreadsheet's column order, as a form layout.
 *
 * Specs arrive from a sheet whose columns run in a fixed order, and entering them into a
 * form grouped by subsystem means jumping between sections for every row. This is the
 * same fields in the sheet's order so the two can be read side by side, top to bottom,
 * without hunting.
 *
 * It is a reordering, not a second schema: every key here is a real field from
 * VARIANT_FORM_GROUPS, and both layouts save through the same code. A key that appears
 * in neither list is a bug in one of them, which `assertSheetOrderCoverage` catches.
 *
 * Several sheet columns cover more than one database field, because the sheet packs
 * things a column at a time ("Screen Type Brightness") that we store separately. Those
 * expand into their parts, in the order you would read them off the cell.
 */

export interface SheetStep {
    /** The sheet's own column heading, so the two can be matched by eye. */
    column: string;
    /** Form field keys this column fills, in entry order. */
    keys: string[];
}

export const SHEET_STEPS: SheetStep[] = [
    { column: 'Released', keys: ['release_date'] },
    { column: 'Form Factor', keys: [] },  // lives on the console, not the variant
    { column: 'OS', keys: ['os_family', 'os_version', 'os', 'ui_skin'] },
    { column: 'System On A Chip (SoC)', keys: ['soc_vendor', 'soc_name', 'soc_gen', 'soc', 'cpu_process_node'] },
    { column: 'CPU', keys: ['cpu_model'] },
    { column: 'CPU Cores', keys: ['cpu_clusters'] },
    { column: 'CPU Threads', keys: ['cpu_threads'] },
    { column: 'CPU Clock Speed', keys: ['cpu_clock_min_mhz', 'cpu_clock_max_mhz'] },
    { column: 'Architecture', keys: ['cpu_arch', 'cpu_architecture'] },
    { column: 'GPU', keys: ['gpu_vendor', 'gpu_name', 'gpu_architecture', 'gpu_model'] },
    { column: 'GPU Cores', keys: ['gpu_cores', 'gpu_compute_units'] },
    { column: 'GPU Clock Speed', keys: ['gpu_clock_min_mhz', 'gpu_clock_mhz', 'gpu_teraflops'] },
    { column: 'RAM', keys: ['ram_mb', 'ram_type', 'ram_speed_mhz'] },
    { column: 'Screen Size', keys: ['screen_size_inch', 'screen_resolution_x', 'screen_resolution_y'] },
    { column: 'Screen Type / Brightness', keys: ['display_type', 'display_tech', 'brightness_nits', 'touchscreen'] },
    { column: 'Refresh Rate / PPI / Aspect', keys: ['refresh_rate_hz', 'ppi', 'aspect_ratio'] },
    { column: 'Screen Lens', keys: ['lens_material', 'lens_laminated'] },
    { column: 'Battery', keys: ['battery_capacity_mah', 'battery_capacity_wh', 'battery_type', 'battery_swappable'] },
    {
        column: 'Cooling',
        keys: ['cooling_type', 'cooling_fan_count', 'cooling_heatsink', 'cooling_heatpipe',
               'cooling_vapor_chamber', 'cooling_vents', 'tdp_wattage'],
    },
    { column: 'D-Pad', keys: ['dpad_shape', 'dpad_tech', 'dpad_placement'] },
    { column: 'Analogs', keys: ['stick_count', 'stick_layout', 'stick_placement', 'stick_tech', 'stick_cap', 'stick_clicks'] },
    { column: 'Face Buttons', keys: ['face_button_count', 'face_button_tech', 'face_label_scheme'] },
    { column: 'Shoulder Buttons', keys: ['bumper_tech', 'bumper_type', 'trigger_tech', 'trigger_type', 'trigger_layout'] },
    { column: 'Extra Buttons', keys: ['back_button_count', 'touchpad_count', 'touchpad_clickable', 'has_keyboard', 'system_button_set', 'system_buttons_text'] },
    { column: 'Charge Port', keys: ['charge_port', 'charge_port_count', 'charge_port_positions', 'charging_speed_w', 'charging_tech'] },
    { column: 'Storage', keys: ['storage_mb', 'storage_type', 'storage_expandable', 'expansion_slot_count', 'expansion_card_type', 'expansion_speed_class'] },
    { column: 'Connectivity', keys: ['wifi_specs', 'bluetooth_specs', 'cellular_connectivity', 'other_connectivity'] },
    { column: 'Video Output', keys: ['video_out'] },
    { column: 'Audio Output', keys: ['has_headphone_jack', 'headphone_jack_position', 'audio_tech'] },
    { column: 'Speaker', keys: ['speaker_count', 'speaker_config', 'speaker_placement', 'has_microphone'] },
    { column: 'Rumble', keys: ['has_rumble'] },
    { column: 'Sensors', keys: ['has_gyro', 'sensors', 'biometrics', 'camera_specs'] },
    { column: 'Volume / Brightness / Power Control', keys: ['ports'] },
    { column: 'Dimensions', keys: ['width_mm', 'height_mm', 'depth_mm'] },
    { column: 'Weight', keys: ['weight_g'] },
    { column: 'Shell Material', keys: ['body_material'] },
    { column: 'Colors', keys: ['available_colors'] },
    { column: 'Price (average)', keys: ['price_avg_usd', 'price_launch_usd'] },
];

/* Sheet columns with no home on the variant form, and where they actually go. Listed so
 * the layout can say so rather than letting you look for a field that is not there. */
export const SHEET_ELSEWHERE: { column: string; where: string }[] = [
    { column: 'Form Factor', where: 'On the console, not the variant' },
    { column: 'Video Review 1-5', where: 'Console links, kind = review' },
    { column: 'Written Review', where: 'Console links, kind = review' },
    { column: 'Vendor Link 1-5', where: 'Console links, kind = vendor' },
    { column: 'Pricing Category', where: 'Derived from price, not stored' },
    { column: 'Pros / Cons', where: 'Not modelled yet' },
    { column: 'Emulation Limit', where: 'Emulation profile, per system' },
    { column: 'Notes', where: 'Input notes, or the console description' },
];

/** Identity fields the sheet has no column for, but a new variant cannot be saved without. */
export const SHEET_PREAMBLE_KEYS = ['console_id', 'variant_name', 'slug', 'is_default', 'model_no', 'image_url', 'amazon_asin'];

/** Every key the sheet layout renders, in order. */
export const sheetOrderKeys = (): string[] =>
    SHEET_STEPS.flatMap(s => s.keys);

/**
 * Which form fields the sheet layout would hide.
 *
 * The sheet does not cover everything the database holds, and silently dropping fields
 * from a layout is how columns stop getting filled. The layout renders these in a
 * trailing "not in the sheet" block instead.
 */
export function sheetLeftovers(allKeys: string[]): string[] {
    const covered = new Set([...sheetOrderKeys(), ...SHEET_PREAMBLE_KEYS]);
    return allKeys.filter(k => !covered.has(k) && !k.startsWith('__'));
}
