
// Map of Enum Keys to Human Readable Labels
export const INPUT_ENUM_LABELS: Record<string, Record<string, string>> = {
    rc_button_tech: {
        'membrane': 'Membrane',
        'microswitch': 'Microswitch',
        'mechanical': 'Mechanical',
        'hall': 'Hall',
        'potentiometer': 'Potentiometer',
        'spring': 'Spring',
        'optical': 'Optical',
        'unknown': 'Unknown',
    },
    rc_dpad_shape: {
        'cross': 'Cross',
        'disc': 'Disc',
        'segmented': 'Segmented',
        'unknown': 'Unknown',
    },
    rc_placement: {
        'left': 'Left',
        'right': 'Right',
        'center': 'Center',
        'top': 'Top',
        'bottom': 'Bottom',
        'unknown': 'Unknown',
    },
    rc_label_scheme: {
        'nintendo': 'Nintendo',
        'xbox': 'Xbox',
        'playstation': 'Playstation',
        'generic': 'Generic',
        'unknown': 'Unknown',
    },
    rc_stick_layout: {
        'symmetric': 'Symmetric',
        'asymmetric': 'Asymmetric',
        'centered': 'Centered',
        'unknown': 'Unknown',
    },
    rc_stick_cap: {
        'concave': 'Concave',
        'convex': 'Convex',
        'flat': 'Flat',
        'domed': 'Domed',
        'textured': 'Textured',
        'unknown': 'Unknown',
    },
    rc_trigger_type: {
        'digital': 'Digital',
        'analog': 'Analog',
        'unknown': 'Unknown',
    },
    rc_trigger_layout: {
        'inline': 'Inline',
        'stacked': 'Stacked',
        'unknown': 'Unknown',
    },
    rc_keyboard_type: {
        'physical': 'Physical',
        'touch': 'Touch',
        'unknown': 'Unknown',
    },
    rc_system_button_set: {
        'minimal': 'Minimal',
        'standard': 'Standard',
        'extended': 'Extended',
        'unknown': 'Unknown',
    },
    rc_confidence: {
        'confirmed': 'Confirmed',
        'inferred': 'Inferred',
        'unknown': 'Unknown',
    }
};

export function formatInputEnum(type: keyof typeof INPUT_ENUM_LABELS, value: string | null | undefined): string | null {
    if (!value || value === 'unknown') return null; // Hide unknown or null values
    const map = INPUT_ENUM_LABELS[type];
    if (map && map[value]) {
        return map[value];
    }
    // Fallback: Capitalize first letter if not found in map
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
}
