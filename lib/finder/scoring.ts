
import { ConsoleDetails } from '../types';

export type ProfileType = 'nostalgia' | 'completionist' | 'performance' | 'onthego' | 'gift';

export interface FinderWeights {
  power: number;
  portability: number;
  ease: number;
  value: number;
  library: number;
}

// Q1 Multipliers (User Defined)
const PROFILE_MULTIPLIERS: Record<string, FinderWeights> = {
    nostalgia: { power: 0.95, portability: 1.0, ease: 1.15, value: 1.0, library: 1.05 },
    completionist: { power: 1.05, portability: 1.0, ease: 1.0, value: 1.10, library: 1.20 },
    performance: { power: 1.25, portability: 1.0, ease: 0.95, value: 1.0, library: 1.0 },
    onthego: { power: 0.95, portability: 1.25, ease: 1.0, value: 1.0, library: 1.0 },
    gift: { power: 0.90, portability: 1.0, ease: 1.25, value: 1.0, library: 1.05 },
    default: { power: 1.0, portability: 1.0, ease: 1.0, value: 1.0, library: 1.0 }
};

// System Era Weights for Library/Power Calculation
const SYSTEM_WEIGHTS: Record<string, number> = {
    // 8-16 bit -> 0.25
    nes_state: 0.25, snes_state: 0.25, gb_state: 0.25, gba_state: 0.25, genesis_state: 0.25, gbc_state: 0.25,
    // 32/64 bit -> 0.5
    ps1_state: 0.5, n64_state: 0.5, dreamcast_state: 0.5, saturn_state: 0.5,
    // Handheld 2000s -> 0.75
    psp_state: 0.75, nds_state: 0.75,
    // 6th gen -> 1.0
    ps2_state: 1.0, gamecube_state: 1.0, wii_state: 1.0,
    // Modern -> 1.25
    switch_state: 1.25, ps3_state: 1.25, x3ds_state: 1.0, // 3DS usually grouped with 2000s or 6th gen? Assuming 1.0 for now or 0.75?
    // Wait, 3DS is newer than NDS. Prompt said "Handheld 2000s -> PSP, NDS".
    // 3DS is 2011. Let's group it with 6th gen or Modern?
    // Given 3DS emulation is harder than NDS, let's treat it as 1.0 (like Wii).
    vita_state: 0.75 // Vita is comparable to PSP/PS2 mix. Let's stick to 0.75 or 1.0. Given "Handheld 2000s" was 0.75, Vita is 2011.
    // I'll stick to the explicit user list where possible.
};

// Max possible Library Score (Theoretical sum of all weights if everything is Playable)
// Calculated roughly: 6*0.25 + 4*0.5 + 2*0.75 + 3*1.0 + 2*1.25 = 1.5 + 2.0 + 1.5 + 3.0 + 2.5 = 10.5
// We will normalize against a reasonable "High" value, say 8.0, or dynamically.
// For now, let's use a fixed max to keep scores consistent.
const MAX_LIBRARY_SCORE = 10.0;
const MAX_POWER_WEIGHT = 1.25; // Modern

const PASS_STATES = ['Playable', 'Great', 'Perfect'];

// Helpers
const normalize = (val: number, min: number, max: number) => {
    if (val <= min) return 0;
    if (val >= max) return 1;
    return (val - min) / (max - min);
};

const isPass = (state: string | undefined | null) => {
    if (!state) return false;
    const s = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
    return PASS_STATES.includes(s);
};

// --- SCORING FUNCTIONS ---

export const calculatePowerScore = (consoleItem: ConsoleDetails): number => {
    const variants = consoleItem.variants || [];
    if (variants.length === 0) return 0;

    // Check for PC Gaming bypass
    if (consoleItem.device_category === 'pc_gaming') return 1.0;

    let maxWeight = 0;

    for (const variant of variants) {
        const rawProfile = (variant as any).emulation_profiles;
        const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
        if (!profile) continue;

        for (const [key, weight] of Object.entries(SYSTEM_WEIGHTS)) {
            if (isPass(profile[key])) {
                if (weight > maxWeight) maxWeight = weight;
            }
        }
    }

    return normalize(maxWeight, 0, MAX_POWER_WEIGHT);
};

export const calculateLibraryScore = (consoleItem: ConsoleDetails): number => {
    const variants = consoleItem.variants || [];
    if (variants.length === 0) return 0;

    // PC Gaming typically has infinite library -> 1.0
    if (consoleItem.device_category === 'pc_gaming') return 1.0;

    // Use best variant
    let bestScore = 0;

    for (const variant of variants) {
        const rawProfile = (variant as any).emulation_profiles;
        const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
        if (!profile) continue;

        let currentSum = 0;
        for (const [key, weight] of Object.entries(SYSTEM_WEIGHTS)) {
            if (isPass(profile[key])) {
                currentSum += weight;
            }
        }
        if (currentSum > bestScore) bestScore = currentSum;
    }

    return normalize(bestScore, 0, MAX_LIBRARY_SCORE);
};

export const calculatePortabilityScore = (consoleItem: ConsoleDetails): number => {
    // Specs usually on default variant
    const specs = consoleItem.specs as any;
    if (!specs) return 0.5; // Unknown

    const screen = specs.screen_size_inch || 999;
    const weight = specs.weight_g || 999;

    // High: <= 3.5 AND <= 250
    if (screen <= 3.5 && weight <= 250) return 1.0;

    // Medium: <= 5.0 AND <= 450
    if (screen <= 5.0 && weight <= 450) return 0.5;

    // Low
    return 0.0;
};

export const calculateEaseScore = (consoleItem: ConsoleDetails): number => {
    const score = consoleItem.finder_traits?.setup_ease_score;
    if (!score) return 0.5; // Neutral default if missing
    // 1-5 -> 0-1
    return normalize(score, 1, 5);
};

export const calculateValueScore = (power: number, library: number, price: number | null): number => {
    if (price === null || price === undefined) return 0.5; // Neutral

    // Price Score: Cheaper = 1.0, Expensive = 0.0
    // Range $50 - $800
    // formula: 1 - ((price - min) / (max - min))
    const minPrice = 50;
    const maxPrice = 800;

    // Clamp price first
    let p = price;
    if (p < minPrice) p = minPrice;
    if (p > maxPrice) p = maxPrice;

    const priceScore = 1 - ((p - minPrice) / (maxPrice - minPrice));

    // Value = (Power*0.6 + Library*0.4) * PriceScore
    return (power * 0.6 + library * 0.4) * priceScore;
};

// --- MAIN SCORING ORCHESTRATOR ---

export interface ScoreBreakdown {
    power: number;
    portability: number;
    ease: number;
    value: number;
    library: number;
    total: number;
    badges: string[];
}

export const calculateConsoleScore = (
    consoleItem: ConsoleDetails,
    inputs: {
        profile: string | null;
        toneMode: string | null;
        setupAnswer: string | null; // Q6
        budgetBand: string | null;
        targetTier: string | null; // Used for exclusion logic if needed, but strict weights handled by power
        portabilityPref: string | null; // Could add specific bias if needed
    }
): ScoreBreakdown => {
    // 1. Raw Scores (Normalized 0-1)
    const powerRaw = calculatePowerScore(consoleItem);
    const libraryRaw = calculateLibraryScore(consoleItem);
    const portabilityRaw = calculatePortabilityScore(consoleItem);
    const easeRaw = calculateEaseScore(consoleItem);

    const price = (consoleItem.specs as any)?.price_launch_usd || null;
    const valueRaw = calculateValueScore(powerRaw, libraryRaw, price);

    // 2. Get Multipliers
    const profileKey = (inputs.profile || 'default').toLowerCase();
    const weights = PROFILE_MULTIPLIERS[profileKey] || PROFILE_MULTIPLIERS['default'];

    // 3. Apply Multipliers
    let sPower = powerRaw * weights.power;
    let sLibrary = libraryRaw * weights.library;
    let sPortability = portabilityRaw * weights.portability;
    let sEase = easeRaw * weights.ease;
    let sValue = valueRaw * weights.value;

    // 4. Gift Mode Logic (Q6 Override)
    // If Gift AND (Setup = Tinker/Power), reduce the implicit "bonus" of complex devices.
    // In our scoring, "Ease" score is high for simple devices.
    // If the user ASKED for "Tinker" (Power User), normally we might boost complex devices.
    // But currently, the "Ease" score penalizes complex devices (low score).
    // The prompt says: "If tone_mode=gift and Q6='Power user', reduce its effect slightly."

    // Wait, if Q6="Power User", does that mean we WANT low ease?
    // Usually, a "Power User" preference implies we should NOT penalize low ease, or even reward it.
    // My current `ease` score is "Plug & Play" = 1.0. "Linux/Hard" = 0.0.
    // If User = Power, they probably want the "Hard" device (which usually has high power).
    // The "Multiplier" for 'Performance' profile sets Ease weight to 0.95 (tiny).

    // Let's implement a specific Q6 Logic:
    // If Setup = 'beginner', we weight Ease heavily (already done via Profile? No, Setup is Q6).
    // We should probably dynamically adjust the Ease Weight based on Q6 answer too.

    // Interpretation of "Q6 = Power user -> reduce its effect":
    // If user says "Power user", they are effectively saying "Ease doesn't matter".
    // So we might lower the Ease weight to 0.
    // If Gift Mode is ON, and they say "Power user", we "reduce its effect slightly" -> maybe don't go all the way to 0?
    // Or maybe the user meant: "Don't recommend the SUPER hard stuff even if they asked for power".

    // Let's look at the User's instruction:
    // "Normal behavior (no gift): Complex device gets full bonus from Q6"
    // "Gift behavior: Reduce that bonus by ~40-50%"

    // This implies Q6 GIVES a bonus.
    // If I add a "Setup Match Bonus":
    // Match Score = 1.0 if (Device Ease matches User Pref).
    // But ease is 1-5.
    // Beginner -> Wants 5.
    // Power -> Wants 1? (Or is ok with 1).

    // Let's add a "Setup Affinity" score.
    // If User=Beginner, Affinity = Ease Score.
    // If User=Power, Affinity = (1 - Ease Score) ?? (They like complexity?)
    // Or maybe just "Power users ignore ease".

    // Given the complexity, let's stick to the User's explicit prompt:
    // "Normal: Complex device gets full bonus... Gift: Reduce bonus".
    // I will add a `setup_bonus` to the total.

    let setupBonus = 0;
    const deviceEase = consoleItem.finder_traits?.setup_ease_score || 3;

    if (inputs.setupAnswer === 'power' || inputs.setupAnswer === 'tinker') {
        // User likes complexity/power.
        // If device is complex (Ease <= 2), give bonus.
        if (deviceEase <= 2) {
            setupBonus = 0.15; // "Full Bonus"
        }

        // GIFT OVERRIDE
        if (inputs.toneMode === 'gift') {
            setupBonus = setupBonus * 0.5; // Reduce by 50%
        }
    } else if (inputs.setupAnswer === 'beginner') {
        // User wants easy.
        if (deviceEase >= 4) {
            setupBonus = 0.15;
        }
    }

    // Add setup bonus to total

    // 5. Total Sum
    const total = sPower + sLibrary + sPortability + sEase + sValue + setupBonus;

    // 6. Badges
    const badges: string[] = [];
    if (deviceEase >= 4) badges.push("Easy to set up");
    if ((consoleItem.finder_traits?.community_score || 0) >= 4) badges.push("Good community support");

    return {
        power: sPower,
        portability: sPortability,
        ease: sEase,
        value: sValue,
        library: sLibrary,
        total,
        badges
    };
};
