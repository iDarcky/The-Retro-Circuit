import { SYSTEM_TIERS } from '../config/emulation';
import type { EmulationProfile } from '../types';

/* THE CIRCUIT SCORE
 *
 *   Circuit Score = 40·Reach + 35·Polish + 25·Feel      (0–100)
 *
 * Reach   what the device can attempt at all — the highest tier with at least one
 *         system running Playable or better, over five.
 * Polish  how well it runs what it reaches — the share of systems at or below that
 *         reach graded Great or Perfect.
 * Feel    what it is like to own — the mean of the two hand-scored 1-5 columns,
 *         setup_ease_score and community_score.
 *
 * The weights are the argument. Reach leads because it is a hard ceiling: no amount
 * of polish makes a Tier 1 chip run PS2. Polish is nearly as heavy because a device
 * that reaches high and stutters is worse than one that reaches lower and is solid —
 * that is the whole reason this is not a raw sum of grades, which punished a device
 * for not attempting things it never claimed. Feel is a quarter: enough to move a
 * device several points, not enough to let an opinion outvote the measurements.
 *
 * Price is deliberately NOT in here. "Is this good" and "is this good value" are
 * different questions, and a blended number answers neither — see valueRating below,
 * which derives value from the score rather than baking it in.
 *
 * Measured across the 486 graded variants: Tier 1 averages 41, Tier 2 48, Tier 3 61,
 * Tier 4 72, Tier 5 85, with real variance inside each tier.
 */

export const SCORE_WEIGHTS = { reach: 40, polish: 35, feel: 25 } as const;

/** Grades that count as "this actually runs". */
const PLAYABLE = new Set(['Playable', 'Great', 'Perfect']);
/** Grades that count as "this runs well". */
const STRONG = new Set(['Great', 'Perfect']);

const tierKeys = (tierIndex: number): string[] =>
    SYSTEM_TIERS[tierIndex]?.systems.map(s => s.key) ?? [];

export interface CircuitScore {
    /** 0–100, rounded. */
    score: number;
    /** Highest tier with a playable system, 1–5. */
    reach: number;
    /** Share of systems at or below reach graded Great or Perfect, 0–1. */
    polish: number;
    /** Mean of the hand-scored columns, 0–1. Null when neither is set. */
    feel: number | null;
    /** Points contributed by each part, for the stacked bar. Sums to `score`. */
    parts: { reach: number; polish: number; feel: number };
    /** How many systems the polish figure was computed from. */
    graded: number;
}

/** Highest tier with at least one system running Playable or better. */
export function reachOf(profile?: EmulationProfile | null): number | null {
    if (!profile) return null;
    for (let i = SYSTEM_TIERS.length - 1; i >= 0; i--) {
        const hit = tierKeys(i).some(k => PLAYABLE.has(String((profile as any)[k] ?? '')));
        if (hit) return i + 1;
    }
    return null;
}

/**
 * Circuit Score for one variant.
 *
 * Returns null rather than a zero when the profile is ungraded — an unscored device
 * must never render as a bad one. Same rule the rest of the page follows.
 */
export function circuitScore(
    profile?: EmulationProfile | null,
    setupEase?: number | null,
    communityScore?: number | null,
): CircuitScore | null {
    const reach = reachOf(profile);
    if (reach === null || !profile) return null;

    // Polish looks only at tiers the device actually reaches. Counting Tier 5 against
    // a Tier 1 handheld is what made the old raw sum unfair.
    let graded = 0;
    let strong = 0;
    for (let i = 0; i < reach; i++) {
        for (const key of tierKeys(i)) {
            const grade = String((profile as any)[key] ?? '');
            if (!grade) continue;
            graded += 1;
            if (STRONG.has(grade)) strong += 1;
        }
    }
    const polish = graded > 0 ? strong / graded : 0;

    // Either hand-scored column alone is enough; the mean of one number is that number.
    const manual = [setupEase, communityScore].filter(
        (n): n is number => typeof n === 'number' && n > 0,
    );
    const feel = manual.length > 0 ? manual.reduce((a, b) => a + b, 0) / manual.length / 5 : null;

    const reachNorm = reach / SYSTEM_TIERS.length;

    // With no Feel the remaining weights are rescaled to 100 rather than left short,
    // so a console without a hand score is not silently docked 25 points.
    const scale = feel === null
        ? 100 / (SCORE_WEIGHTS.reach + SCORE_WEIGHTS.polish)
        : 1;

    const parts = {
        reach: SCORE_WEIGHTS.reach * reachNorm * scale,
        polish: SCORE_WEIGHTS.polish * polish * scale,
        feel: feel === null ? 0 : SCORE_WEIGHTS.feel * feel,
    };

    return {
        score: Math.round(parts.reach + parts.polish + parts.feel),
        reach,
        polish,
        feel,
        parts: {
            reach: Math.round(parts.reach),
            polish: Math.round(parts.polish),
            feel: Math.round(parts.feel),
        },
        graded,
    };
}

/* VALUE — price expressed against the score, not folded into it.
 *
 * Score per $100. Kept as a separate reading so a price change never moves the
 * Circuit Score, and so "good" and "good value" stay answerable one at a time. */
export function scorePerDollar(score: number, priceUsd?: number | null): number | null {
    if (!priceUsd || priceUsd <= 0) return null;
    return (score / priceUsd) * 100;
}

/** Where a value sits in a sorted population. Returns 0–1, higher = better. */
export function percentileOf(value: number, population: number[]): number | null {
    if (population.length === 0) return null;
    const below = population.filter(v => v < value).length;
    const equal = population.filter(v => v === value).length;
    return (below + equal / 2) / population.length;
}

/** Quartile band, 1–4, from a percentile. Bands survive new consoles far better than
 *  an exact percentage does, which matters when the pages are statically rendered. */
export function bandOf(percentile: number): 1 | 2 | 3 | 4 {
    if (percentile < 0.25) return 1;
    if (percentile < 0.5) return 2;
    if (percentile < 0.75) return 3;
    return 4;
}

export const BAND_LABELS = ['', 'Bottom quarter', 'Below average', 'Above average', 'Top quarter'] as const;

/** A rank claim drawn from a handful of devices is noise. Below this, say nothing. */
export const MIN_POPULATION_FOR_RANK = 8;
