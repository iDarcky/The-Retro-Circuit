
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
    switch_state: 1.25, ps3_state: 1.25, x3ds_state: 1.0,
    vita_state: 0.75
};

// --- NORMALIZATION CONSTANTS ---
const MAX_RAW_POWER = 1.25;    // Corresponds to Modern era systems

// DYNAMIC LIBRARY MAX: Sum of all system weights.
const MAX_RAW_LIBRARY = Object.values(SYSTEM_WEIGHTS).reduce((sum, weight) => sum + weight, 0);

const MIN_RAW_EASE = 1;        // Hardest to set up
const MAX_RAW_EASE = 5;        // Easiest to set up
const MIN_RAW_PRICE = 50;      // Price floor for value calc
const MAX_RAW_PRICE = 800;     // Price ceiling for value calc

const PASS_STATES = ['Playable', 'Great', 'Perfect'];

// --- TIER & EMULATION CONSTANTS ---

const STATE_SCORES: Record<string, number> = {
    'Perfect': 1.0,
    'Great': 0.85,
    'Playable': 0.65,
    'Struggles': 0.25,
    'Unplayable': 0.0,
    'N/A': 0.0,
    'Unknown': 0.0
};

const TIER_ANCHORS: Record<string, string[]> = {
    '8bit': ['nes_state', 'snes_state', 'gba_state'],
    '32bit': ['ps1_state', 'n64_state'],
    '2000s': ['psp_state', 'nds_state'],
    '6thgen': ['ps2_state', 'gamecube_state'],
    'modern': ['switch_state', 'ps3_state']
};

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

export const getDeviceTierLevel = (powerCeiling: number): number => {
    const rawWeight = powerCeiling * MAX_RAW_POWER;
    if (rawWeight >= 1.25) return 5; // Modern
    if (rawWeight >= 1.0) return 4;  // 6th Gen
    if (rawWeight >= 0.75) return 3; // 2000s
    if (rawWeight >= 0.5) return 2;  // 32-bit
    return 1;                        // 8-bit
};

// --- SCORING FUNCTIONS ---

export const calculatePowerCeilingScore = (consoleItem: ConsoleDetails): number => {
    const variants = consoleItem.variants || [];
    if (variants.length === 0) return 0;
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

    return normalize(maxWeight, 0, MAX_RAW_POWER);
};

export const calculateTierFitScore = (consoleItem: ConsoleDetails, targetTier: string | null): number => {
    if (!targetTier) return 1.0;
    if (consoleItem.device_category === 'pc_gaming') return 1.0;

    const anchors = TIER_ANCHORS[targetTier];
    if (!anchors || anchors.length === 0) return 1.0;

    const variants = consoleItem.variants || [];
    let bestFitScore = 0;

    for (const variant of variants) {
        const rawProfile = (variant as any).emulation_profiles;
        const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
        if (!profile) continue;

        let sum = 0;
        let count = 0;

        for (const anchor of anchors) {
            const state = profile[anchor];
            const s = state ? state.charAt(0).toUpperCase() + state.slice(1).toLowerCase() : 'N/A';
            const score = STATE_SCORES[s] !== undefined ? STATE_SCORES[s] : 0;

            sum += score;
            count++;
        }

        if (count > 0) {
            const avg = sum / count;
            if (avg > bestFitScore) bestFitScore = avg;
        }
    }

    return bestFitScore;
};

export const calculateLibraryScore = (consoleItem: ConsoleDetails): number => {
    const variants = consoleItem.variants || [];
    if (variants.length === 0) return 0;
    if (consoleItem.device_category === 'pc_gaming') return 1.0;

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

    return normalize(bestScore, 0, MAX_RAW_LIBRARY);
};

export const calculatePortabilityScore = (consoleItem: ConsoleDetails): number => {
    const specs = consoleItem.specs as any;
    if (!specs) return 0.5;

    const screen = specs.screen_size_inch || 999;
    const weight = specs.weight_g || 999;

    if (screen <= 3.5 && weight <= 250) return 1.0;
    if (screen <= 5.0 && weight <= 450) return 0.5;
    return 0.0;
};

export const calculatePortabilityMatchScore = (consoleItem: ConsoleDetails, pref: string | null): number => {
    if (!pref) return 1.0;

    const pScore = calculatePortabilityScore(consoleItem);

    switch (pref) {
        case 'pocket':
            return pScore;

        case 'jacket':
            if (pScore >= 0.8) return 0.8;
            if (pScore >= 0.4) return 1.0;
            return 0.2;

        case 'home':
            if (pScore <= 0.2) return 1.0;
            if (pScore <= 0.6) return 0.7;
            return 0.4;

        case 'versatile':
            if (pScore >= 0.4 && pScore <= 0.8) return 1.0;
            return 0.6;

        default:
            return 1.0;
    }
};

export const calculateEaseScore = (consoleItem: ConsoleDetails): number => {
    const score = consoleItem.setup_ease_score;
    if (!score) return 0.5;
    return normalize(score, MIN_RAW_EASE, MAX_RAW_EASE);
};

export const calculateValueScore = (powerNormalized: number, libraryNormalized: number, price: number | null): number => {
    if (price === null || price === undefined) return 0.5;

    let p = price;
    if (p < MIN_RAW_PRICE) p = MIN_RAW_PRICE;
    if (p > MAX_RAW_PRICE) p = MAX_RAW_PRICE;

    const priceScore = 1 - ((p - MIN_RAW_PRICE) / (MAX_RAW_PRICE - MIN_RAW_PRICE));
    return (powerNormalized * 0.6 + libraryNormalized * 0.4) * priceScore;
};

// --- MAIN SCORING ORCHESTRATOR ---

export interface ScoreBreakdown {
    power: number;
    powerCeiling: number;
    tierFit: number;
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
        setupAnswer: string | null;
        budgetBand: string | null;
        targetTier: string | null;
        portabilityPref: string | null;
        formFactorPref?: string | null;
        aestheticPref?: string | null;
        features?: string | null;
    }
): ScoreBreakdown => {

    // --- STEP 1: COMPUTE NORMALIZED CORE SCORES (0.0 - 1.0) ---
    const powerCeiling = calculatePowerCeilingScore(consoleItem);
    const tierFit = calculateTierFitScore(consoleItem, inputs.targetTier);
    const powerRaw = powerCeiling; // Base power metric is ceiling

    const libraryRaw = calculateLibraryScore(consoleItem);
    const portabilityRaw = calculatePortabilityScore(consoleItem);
    const easeRaw = calculateEaseScore(consoleItem);

    const price = (consoleItem.specs as any)?.price_launch_usd || null;
    const valueRaw = calculateValueScore(powerRaw, libraryRaw, price);

    // Q5 Special Logic: Portability Match
    const portabilityMatch = calculatePortabilityMatchScore(consoleItem, inputs.portabilityPref);

    // --- STEP 2: APPLY Q1 PROFILE MULTIPLIERS ---
    const profileKey = (inputs.profile || 'default').toLowerCase();
    const weights = PROFILE_MULTIPLIERS[profileKey] || PROFILE_MULTIPLIERS['default'];

    const sPower = powerRaw * weights.power;
    const sLibrary = libraryRaw * weights.library;
    const sPortability = (portabilityRaw * portabilityMatch) * weights.portability; // Q5 logic integrated
    const sEase = easeRaw * weights.ease;
    const sValue = valueRaw * weights.value;

    // --- STEP 3: COMPUTE BASE WEIGHTED SCORE ---
    const baseWeightedScore = sPower + sLibrary + sPortability + sEase + sValue;

    // --- STEP 4 & 5: APPLY MAJOR MULTIPLIERS (Tier & Budget) ---
    // Instead of penalties, we scale the entire base score down if requirements aren't met.

    let budgetMultiplier = 1.0;
    let tierMultiplier = 1.0;

    // Q4: Budget Multiplier
    if (inputs.budgetBand && price !== null && price !== undefined) {
        let maxBudget = 9999;
        switch (inputs.budgetBand) {
            case 'b_under_60': maxBudget = 60; break;
            case 'b_60_120': maxBudget = 120; break;
            case 'b_120_180': maxBudget = 180; break;
            case 'b_180_300': maxBudget = 300; break;
            case 'b_300_plus': maxBudget = 9999; break;
        }

        if (price > maxBudget) {
            const overage = (price - maxBudget) / maxBudget;
            if (overage <= 0.10) {
                budgetMultiplier = 0.95;
            } else if (overage <= 0.25) {
                budgetMultiplier = 0.85;
            } else {
                budgetMultiplier = 0.70;
            }
        }
    }

    // Q3: Tier Multiplier
    // STRICT SEPARATION: This decision must rely ONLY on tierFit (User Match).
    // powerCeiling (Headroom) is explicitly excluded from this check to ensure we only measure fit for the requested tier.
    // tierFit is 0-1 based on anchor system performance (Perfect=1.0, Playable=0.65, Struggles=0.25, Unplayable=0).
    if (inputs.targetTier) {
        if (tierFit >= 0.60) {
            // "Playable" (0.65) or "Perfect" (1.0) -> Meets or exceeds expectations
            tierMultiplier = 1.00;
        } else if (tierFit >= 0.25) {
            // "Struggles" (0.25) -> It runs, but not well. Roughly equivalent to 1 tier below in experience.
            tierMultiplier = 0.70;
        } else if (tierFit > 0) {
            // Trace capability (< 0.25) -> Very poor experience. Roughly 2 tiers below.
            tierMultiplier = 0.40;
        } else {
            // Unplayable (0.0) -> Cannot play target games. 3+ tiers below.
            tierMultiplier = 0.20;
        }
    }

    // Apply Multipliers to Base
    const intermediateScore = baseWeightedScore * tierMultiplier * budgetMultiplier;

    // --- STEP 6: APPLY SMALL BONUSES (Additive) ---
    // Bonuses are added AFTER penalties/multipliers to allow tie-breaking
    // and slight boosts even for penalized items, but never dominating.

    // Q2: Form Factor Bonus
    let formFactorBonus = 0;
    if (inputs.formFactorPref && consoleItem.form_factor) {
        const pref = inputs.formFactorPref.toLowerCase();
        const factor = consoleItem.form_factor.toLowerCase();

        if (pref === 'surprise') {
        } else if (factor === pref) {
            formFactorBonus = 0.03;
        }
    }

    // Q6: Setup Bonus (Gift Logic)
    let setupBonus = 0;
    const deviceEase = consoleItem.setup_ease_score || 3;

    if (inputs.setupAnswer === 'power' || inputs.setupAnswer === 'tinker') {
        if (deviceEase <= 2) {
            setupBonus = 0.05;
            if (inputs.toneMode === 'gift') {
                setupBonus = setupBonus * 0.5;
            }
        }
    } else if (inputs.setupAnswer === 'beginner') {
        if (deviceEase >= 4) {
            setupBonus = 0.05;
        }
    }

    // Q8: Aesthetic Bonus
    let aestheticBonus = 0;
    if (inputs.aestheticPref) {
        const availableColors = (consoleItem.specs as any)?.available_colors?.toLowerCase() || '';
        const pref = inputs.aestheticPref.toLowerCase();

        let keywords: string[] = [];
        switch(pref) {
            case 'retro':
                keywords = ['grey', 'gray', 'beige', 'classic', 'dmg', 'wood', 'gold', 'famicom'];
                break;
            case 'transparent':
                keywords = ['transparent', 'clear', 'atomic', 'crystal', 'ice', 'purple', 'blue'];
                break;
            case 'modern':
                keywords = ['black', 'white', 'silver', 'metal', 'matte', 'slate'];
                break;
            case 'colorful':
                keywords = ['yellow', 'blue', 'red', 'green', 'pink', 'orange', 'teal', 'indigo', 'turquoise'];
                break;
        }

        if (keywords.some(k => availableColors.includes(k))) {
            aestheticBonus = 0.02;
        }
    }

    // --- FINAL TOTAL & CLAMPING ---
    let total = intermediateScore + formFactorBonus + setupBonus + aestheticBonus;

    // Safety Clamp (Score shouldn't be negative)
    if (total < 0) total = 0;

    // 6. Badges
    const badges: string[] = [];
    if (deviceEase >= 4) badges.push("Easy to set up");
    if ((consoleItem.community_score || 0) >= 4) badges.push("Good community support");

    return {
        power: sPower,
        powerCeiling,
        tierFit,
        portability: sPortability,
        ease: sEase,
        value: sValue,
        library: sLibrary,
        total,
        badges
    };
};
