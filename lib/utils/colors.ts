
/**
 * Converts a Hex color code to an RGB string (e.g. "255, 0, 0").
 * Useful for Tailwind opacity modifiers like `bg-[rgba(var(--color),0.5)]`.
 */
export function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 255, 157'; // Default Secondary Green
}

/**
 * Ensures a color has high enough contrast (brightness) to be readable on a dark background.
 * Converts to HSL, enforces min-lightness (60%), and converts back to Hex.
 */
export function ensureHighContrast(hex: string): string {
    // 1. Parse Hex to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '#ffffff'; // Fallback to white

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    // 2. RGB to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // 3. Enforce Minimum Lightness (e.g., 70% for safe readability on black)
    if (l < 0.7) {
        l = 0.7;
    }

    // 4. HSL back to RGB
    let r1, g1, b1;
    if (s === 0) {
        r1 = g1 = b1 = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r1 = hue2rgb(p, q, h + 1/3);
        g1 = hue2rgb(p, q, h);
        b1 = hue2rgb(p, q, h - 1/3);
    }

    // 5. RGB back to Hex
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}
