/**
 * Turn a pixel resolution into the aspect ratio a person would actually write down.
 *
 * The exact greatest-common-divisor answer is often useless. A 1200×752 panel reduces
 * to 75:47, which is technically correct and tells a reader nothing — the panel is sold
 * as 16:10, and 16:10 is what belongs on the page. Panels are routinely a few pixels off
 * their nominal ratio because of rounding, notches, or a driver reserving rows.
 *
 * So: reduce exactly, then snap to a standard ratio when the true decimal is within
 * tolerance. 1200/752 = 1.5957 against 16:10 = 1.6 is 0.27% out, well inside.
 */

/** Ratios worth naming, widest first. Value is width/height. */
const COMMON: { label: string; value: number }[] = [
    { label: '32:9', value: 32 / 9 },
    { label: '21:9', value: 21 / 9 },
    { label: '2:1', value: 2 / 1 },
    { label: '16:9', value: 16 / 9 },
    { label: '5:3', value: 5 / 3 },
    { label: '16:10', value: 16 / 10 },
    { label: '3:2', value: 3 / 2 },
    { label: '4:3', value: 4 / 3 },
    { label: '5:4', value: 5 / 4 },
    { label: '1:1', value: 1 },
    { label: '3:4', value: 3 / 4 },
    { label: '9:16', value: 9 / 16 },
];

/**
 * How far off nominal a panel may be and still be called by the nominal name.
 *
 * 1.5% is wide enough for the rounding that produces 75:47 out of a 16:10 panel, and
 * narrow enough that 3:2 (1.5) and 16:10 (1.6) never collide — they are 6.7% apart.
 */
const TOLERANCE = 0.015;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export function aspectRatioOf(width: number, height: number): string | null {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return null;
    }

    const exact = width / height;
    for (const { label, value } of COMMON) {
        if (Math.abs(exact - value) / value <= TOLERANCE) return label;
    }

    // Nothing standard is close, so the odd ratio is the truth and worth showing.
    const divisor = gcd(Math.round(width), Math.round(height));
    return `${Math.round(width) / divisor}:${Math.round(height) / divisor}`;
}

export function ppiOf(width: number, height: number, diagonalInches: number): number | null {
    if (!Number.isFinite(diagonalInches) || diagonalInches <= 0) return null;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
    return Math.round(Math.sqrt(width * width + height * height) / diagonalInches);
}
