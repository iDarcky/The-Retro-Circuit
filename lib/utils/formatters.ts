
// Map of Enum Keys to Human Readable Labels
export const INPUT_ENUM_LABELS: Record<string, Record<string, string>> = {
    rc_button_tech: {
        'membrane': 'Rubber membrane',
        'microswitch': 'Microswitch (clicky)',
        'mechanical': 'Mechanical switch',
        'hall': 'Hall effect',
        'potentiometer': 'Potentiometer',
        'spring': 'Spring mechanism',
        'optical': 'Optical sensor',
        'unknown': 'Unknown',
    },
    rc_dpad_shape: {
        'cross': 'Cross',
        'disc': 'Disc',
        'segmented': 'Segmented / split',
        'unknown': 'Unknown',
    },
    rc_placement: {
        'left': 'Left',
        'right': 'Right',
        'center': 'Centered',
        'unknown': 'Unknown',
    },
    rc_face_layout: {
        'diamond': 'Diamond (4-button)',
        'inline': 'Inline',
        'arcade_6': 'Arcade (6-button)',
        'split': 'Split layout',
        'unknown': 'Unknown',
    },
    rc_label_scheme: {
        'nintendo': 'Nintendo (A/B/X/Y)',
        'xbox': 'Xbox (A/B/X/Y)',
        'playstation': 'PlayStation (△ ○ × □)',
        'generic': 'Generic / unbranded',
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
        'digital': 'Digital (on/off)',
        'analog': 'Analog (pressure)',
        'unknown': 'Unknown',
    },
    rc_trigger_layout: {
        'inline': 'Inline',
        'stacked': 'Stacked',
        'unknown': 'Unknown',
    },
    rc_keyboard_type: {
        'physical': 'Physical keyboard',
        'touch': 'Touch keyboard',
        'unknown': 'Unknown',
    },
    rc_system_button_set: {
        'minimal': 'Minimal (Start/Select/Menu)',
        'standard': 'Standard (+ Home)',
        'extended': 'Extended (extra shortcuts)',
        'unknown': 'Unknown',
    },
    rc_confidence: {
        'confirmed': 'Confirmed',
        'inferred': 'Inferred',
        'unknown': 'Unknown',
    }
};

export function formatInputEnum(type: keyof typeof INPUT_ENUM_LABELS, value: string | null | undefined): string {
    if (!value) return '---';
    const map = INPUT_ENUM_LABELS[type];
    if (map && map[value]) {
        return map[value];
    }
    // Fallback: Capitalize first letter if not found in map
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
}
