/* A brand's own colour and one-line tagline, shared by the brand index and brand pages. */

// Fallbacks for brands whose row has no brand_color (the same map the old brand page used).
const STATIC_HEX: Record<string, string> = {
    Nintendo: '#ef4444', Sega: '#3b82f6', Sony: '#facc15', Atari: '#f97316', Microsoft: '#22c55e', NEC: '#c084fc', SNK: '#2dd4bf',
};

function hexToRgb(hex: string): [number, number, number] | null {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** The brand colour, lifted toward white when it is too dark to see on the black page. */
export function brandColor(name: string, raw?: string | null): string {
    const rgb = hexToRgb(raw || STATIC_HEX[name] || '#10b981') ?? [16, 185, 129];
    const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    if (lum >= 0.3) return `rgb(${rgb.join(',')})`;
    const t = Math.min(0.6, 0.3 - lum + 0.3); // darker colours are lifted further
    return `rgb(${rgb.map((c) => Math.round(c + (255 - c) * t)).join(',')})`;
}

/** First sentence of the description: "The people's champion." */
export function brandTagline(description?: string | null): string | null {
    const d = (description ?? '').trim();
    if (!d) return null;
    const m = /^(.{3,90}?[.!?])(\s|$)/.exec(d);
    return m ? m[1] : null;
}

/** The brand colour as a solid fill, with black or white text, whichever reads better on it. */
export function brandFill(name: string, raw?: string | null): { bg: string; fg: string; muted: string } {
    const hex = raw || STATIC_HEX[name] || '#10b981';
    const rgb = hexToRgb(hex) ?? [16, 185, 129];
    const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    const light = lum > 0.55;
    return { bg: `rgb(${rgb.join(',')})`, fg: light ? '#0b0b0e' : '#ffffff', muted: light ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' };
}
