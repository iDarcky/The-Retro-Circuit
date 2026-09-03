
import { ConsoleDetails } from '../types';
import type { SystemKey } from '../config/emulation';

export type ProfileType = 'nostalgia' | 'completionist' | 'performance' | 'onthego' | 'gift';

export interface FinderWeights {
    power: number;
    portability: number;
    ease: number;
    value: number;
    library: number;
}

// Q1 100-Point Weights (User Defined Points)
// This distributes exactly 100 points across the 5 categories based on the user's Profile.
const PROFILE_WEIGHTS: Record<string, FinderWeights> = {
    nostalgia: { power: 20, portability: 20, ease: 25, value: 15, library: 20 },
    completionist: { power: 20, portability: 15, ease: 15, value: 20, library: 30 },
    performance: { power: 40, portability: 10, ease: 10, value: 15, library: 25 },
    onthego: { power: 15, portability: 40, ease: 15, value: 15, library: 15 },
    gift: { power: 15, portability: 15, ease: 40, value: 15, library: 15 },
    default: { power: 20, portability: 20, ease: 20, value: 20, library: 20 }
};

// System Era Weights for Library/Power Calculation.
//
// Typed as Record<SystemKey, number>, so adding a system to SYSTEM_TIERS without
// giving it a weight is a compile error. This table had silently fallen four systems
// behind that list — master_system, xbox, wii_u and xbox_360 were absent, so a device
// whose strength was one of them earned no library or power credit for it.
//
// The weights track emulation difficulty, which is finer-grained than the five display
// tiers: wii and x3ds sit in the tiers' "Modern & HD" band but weigh 1.0 here because
// they are markedly easier to run than ps3. The four added below follow the same rule —
// master_system with the 8/16-bit set, xbox alongside its 6th-gen contemporaries, and
// wii_u and xbox_360 with ps3, whose hardware generation they share.
const SYSTEM_WEIGHTS: Record<SystemKey, number> = {
    // 8-16 bit -> 0.25
    nes_state: 0.25, snes_state: 0.25, gb_state: 0.25, gba_state: 0.25, genesis_state: 0.25, gbc_state: 0.25,
    master_system: 0.25,
    // 32/64 bit -> 0.5
    ps1_state: 0.5, n64_state: 0.5, dreamcast_state: 0.5, saturn_state: 0.5,
    // Handheld 2000s -> 0.75
    psp_state: 0.75, nds_state: 0.75,
    // 6th gen -> 1.0
    ps2_state: 1.0, gamecube_state: 1.0, wii_state: 1.0, xbox: 1.0,
    // Modern -> 1.25
    switch_state: 1.25, ps3_state: 1.25, x3ds_state: 1.0,
    vita_state: 0.75,
    wii_u: 1.25, xbox_360: 1.25
};

// --- NORMALIZATION CONSTANTS ---
const MAX_RAW_POWER = 1.25;    // Corresponds to Modern era systems

// DYNAMIC LIBRARY MAX: Sum of all system weights.
/**
 * Systems that exist in the grid but that no variant is graded on yet.
 *
 * They keep their true difficulty weight above, so the model stays right and the
 * moment data lands it is scored correctly. They are excluded from the normalisation
 * denominators below because those denominators mean "the best a device could
 * plausibly reach": counting a column that reads N/A on all 517 rows deflates every
 * device's library score for credit literally nobody can earn, which quietly shifts
 * the blend against library and in favour of power, ease, value and portability.
 *
 * Checked against the catalogue: xbox and xbox_360 are N/A on all 517 profiles, while
 * wii_u passes on 124 and master_system on 4 — which is why those two are scored.
 * Remove an entry here once its column has real grades.
 */
const UNGRADED: ReadonlySet<SystemKey> = new Set<SystemKey>(['xbox', 'xbox_360']);

const gradedWeights = () =>
    (Object.entries(SYSTEM_WEIGHTS) as [SystemKey, number][])
        .filter(([key]) => !UNGRADED.has(key))
        .map(([, weight]) => weight);

const MAX_RAW_LIBRARY = gradedWeights().reduce((sum, weight) => sum + weight, 0);

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

const getTierMaxWeight = (tier: string | null) => {
    switch (tier) {
        case '8bit': return 0.25;
        case '32bit': return 0.50;
        case '2000s': return 0.75;
        case '6thgen': return 1.0;
        case 'modern': return 1.25;
        default: return MAX_RAW_POWER;
    }
};

const getTierMaxLibrary = (tier: string | null) => {
    if (!tier) return MAX_RAW_LIBRARY;
    const maxW = getTierMaxWeight(tier);
    return gradedWeights().filter(w => w <= maxW).reduce((a, b) => a + b, 0);
};

// --- SCORING FUNCTIONS ---

export const calculatePowerCeilingScore = (consoleItem: ConsoleDetails, targetTier: string | null = null): number => {
    const variants = consoleItem.variants || [];
    if (variants.length === 0) return 0;
    if (consoleItem.device_category === 'pc_gaming') return 1.0;

    const targetMax = getTierMaxWeight(targetTier);
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

    return normalize(maxWeight, 0, targetMax);
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

        let passCount = 0;
        let highestStateScore = 0; // Track highest quality pass for bonus

        for (const anchor of anchors) {
            const state = profile[anchor];
            const s = state ? state.charAt(0).toUpperCase() + state.slice(1).toLowerCase() : 'N/A';
            const score = STATE_SCORES[s] !== undefined ? STATE_SCORES[s] : 0;

            // "Playable" (0.65), "Great" (0.85), "Perfect" (1.0)
            if (score >= 0.65) {
                passCount++;
                if (score > highestStateScore) highestStateScore = score;
            }
        }

        // --- NEW STRICT RULES ---
        let variantFitScore = 0;

        switch (targetTier) {
            case '8bit':
                variantFitScore = 1.0; // Trivial
                break;
            case '32bit': // ps1 + n64 + dc (Needs >= 2)
            case '6thgen': // ps2 + gc + wii (Needs >= 2)
                if (passCount >= 2) {
                    // It passes structurally. We use the highestStateScore to reward Perfect vs Playable
                    variantFitScore = highestStateScore;
                }
                break;
            case '2000s': // psp + nds (Needs >= 1)
                if (passCount >= 1) {
                    variantFitScore = highestStateScore;
                }
                break;
            case 'modern': // switch + ps3 (Switch MUST pass. ps3 is bonus/later, but we anchor primarily on switch for now)
                // Assuming modern anchors are [switch, ps3]. 
                // We'll enforce that passCount >= 1 and Specifically switch_state passes.
                const switchState = profile['switch_state'];
                const switchS = switchState ? switchState.charAt(0).toUpperCase() + switchState.slice(1).toLowerCase() : 'N/A';
                const switchScore = STATE_SCORES[switchS] !== undefined ? STATE_SCORES[switchS] : 0;

                if (switchScore >= 0.65) {
                    variantFitScore = switchScore;
                }
                break;
        }

        if (variantFitScore > bestFitScore) {
            bestFitScore = variantFitScore;
        }
    }

    return bestFitScore;
};

export const calculateLibraryScore = (consoleItem: ConsoleDetails, targetTier: string | null = null): number => {
    const variants = consoleItem.variants || [];
    if (variants.length === 0) return 0;
    if (consoleItem.device_category === 'pc_gaming') return 1.0;

    const targetMax = getTierMaxLibrary(targetTier);
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

    return normalize(bestScore, 0, targetMax);
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
    // If no preference is given, the raw portability score (0.0 - 1.0) 
    // simply relies on its 100-point weight from Q1 (e.g. 40 points if 'onthego')
    if (!pref) return 1.0;

    const specs = consoleItem.specs as any;
    const screen = specs?.screen_size_inch || 999;
    const weight = specs?.weight_g || 999;

    // We no longer rely on the raw pScore. We directly look at specs for the Q5 hard constraints.
    // Q5 acts as a multiplier against the Q1 base Portability points.
    switch (pref) {
        case 'pocket':
            // "Must fit in a standard jeans pocket"
            if (screen <= 3.5 && weight <= 250) return 1.0; // Perfect, keep all Q1 portability points
            if (screen <= 4.0 && weight <= 300) return 0.5; // Stretch, keep half
            return 0.0; // Fail. Loses all Portability points.

        case 'jacket':
            // "Bag/Jacket Carry"
            if (screen <= 5.5 && weight <= 450) return 1.0;
            if (screen <= 7.0 && weight <= 650) return 0.7;
            return 0.1; // Too big even for a jacket, crush Portability

        case 'home':
            // "Home-focused (bigger screens welcome)"
            // Here, we actually WANT it to be big. 
            // The score engine treats Portability = 1.0 as "Lightweight". 
            // So if they want Home, Portability points are virtually useless to them, 
            // BUT we should heavily penalize tiny pocket screens.
            if (screen >= 5.5) return 1.0; // Good home screen
            if (screen >= 4.0) return 0.6; // Acceptable
            return 0.0; // Tiny screen is awful for Home.

        case 'versatile':
            // "Mix of portability and screen size"
            if (screen >= 4.0 && screen <= 6.0 && weight <= 500) return 1.0; // The holy grail middle
            if (screen >= 3.5 && screen <= 7.0 && weight <= 650) return 0.6;
            return 0.2; // Too extreme in either direction

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
    if (price === null || price === undefined) return 0.1;

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
    const powerCeiling = calculatePowerCeilingScore(consoleItem, inputs.targetTier);
    const tierFit = calculateTierFitScore(consoleItem, inputs.targetTier);
    const powerRaw = powerCeiling; // Base power metric is ceiling

    const libraryRaw = calculateLibraryScore(consoleItem, inputs.targetTier);
    const portabilityRaw = calculatePortabilityScore(consoleItem);
    const easeRaw = calculateEaseScore(consoleItem);

    const price = (consoleItem.specs as any)?.price_launch_usd || null;
    const valueRaw = calculateValueScore(powerRaw, libraryRaw, price);

    // Q5 Special Logic: Portability Match
    const portabilityMatch = calculatePortabilityMatchScore(consoleItem, inputs.portabilityPref);

    // --- STEP 2: APPLY Q1 PROFILE WEIGHTS (100-point total distribution) ---
    const profileKey = (inputs.profile || 'default').toLowerCase();
    const weights = PROFILE_WEIGHTS[profileKey] || PROFILE_WEIGHTS['default'];

    const sPower = powerRaw * weights.power;
    const sLibrary = libraryRaw * weights.library;
    const sPortability = (portabilityRaw * portabilityMatch) * weights.portability; // Q5 logic integrated
    const sEase = easeRaw * weights.ease;
    const sValue = valueRaw * weights.value;

    // --- STEP 3: COMPUTE BASE WEIGHTED SCORE ---
    // The sum is naturally out of 100 since the weights distribute precisely 100 points
    // and the RAW values are explicitly clamped 0.0 to 1.0
    const baseWeightedScore = sPower + sLibrary + sPortability + sEase + sValue;

    // --- STEP 4 & 5: APPLY MAJOR MULTIPLIERS (Tier & Budget) ---
    // Instead of penalties, we scale the entire base score down if requirements aren't met.

    let budgetMultiplier = 1.0;
    let tierMultiplier = 1.0;

    // Q4: Budget Multiplier
    if (inputs.budgetBand) {
        if (price === null || price === undefined) {
            budgetMultiplier = 0.05; // Punish null prices heavily on budget requests
        } else {
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
                    budgetMultiplier = 0.80;
                } else if (overage <= 0.25) {
                    budgetMultiplier = 0.50;
                } else if (overage <= 0.50) {
                    budgetMultiplier = 0.20;
                } else {
                    budgetMultiplier = 0.01;
                }
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
            tierMultiplier = 0.10;
        } else if (tierFit > 0) {
            // Trace capability (< 0.25) -> Very poor experience. Roughly 2 tiers below.
            tierMultiplier = 0.05;
        } else {
            // Unplayable (0.0) -> Cannot play target games. 3+ tiers below.
            tierMultiplier = 0.00;
        }
    }

    // --- NEW: Category Cut logic based on Target Tier ---
    // User requested explicit splits between pure emulation devices vs PC handhelds for lower tiers
    let categoryMultiplier = 1.0;
    if (inputs.targetTier && consoleItem.device_category === 'pc_gaming') {
        const tier = inputs.targetTier;
        if (tier === '8bit' || tier === '32bit') {
            categoryMultiplier = 0.0; // Hard exclude PCs for retro 2D/PS1
        } else if (tier === '2000s') {
            categoryMultiplier = 0.50; // Heavy penalty to emulate 70-30 split favoring Android
        } else if (tier === '6thgen') {
            categoryMultiplier = 0.80; // Soft penalty to emulate 60-40 split favoring Android
        } else if (tier === 'modern') {
            categoryMultiplier = 1.0; // 50-50 neutral for modern
        }
    }

    // --- Q6: Setup Multiplier ---
    // User requested explicit protections so beginners don't get hard-to-setup Linux consoles.
    let setupMultiplier = 1.0;
    const deviceEase = consoleItem.setup_ease_score || 3;

    if (inputs.setupAnswer === 'beginner') {
        if (deviceEase <= 2) {
            setupMultiplier = 0.1; // Total beginners won't survive a heavily tinkered device
        } else if (deviceEase <= 3) {
            setupMultiplier = 0.5; // Guide required, which they don't want
        }
    } else if (inputs.setupAnswer === 'guide') {
        if (deviceEase <= 1) {
            setupMultiplier = 0.2; // Even with a guide, a '1' is painful
        } else if (deviceEase <= 2) {
            setupMultiplier = 0.8; // Takes work, but manageable
        }
    } else if (inputs.setupAnswer === 'power' || inputs.setupAnswer === 'tinker') {
        // Power users and tinkers don't get penalized for complexity.
        // If it's a gift tone though, we still need to be a bit careful:
        if (inputs.toneMode === 'gift' && deviceEase <= 2) {
            setupMultiplier = 0.6; // Even if they are buying for a tinker, 'very hard' is a risky gift
        }
    }

    // Apply Multipliers to Base
    const intermediateScore = baseWeightedScore * tierMultiplier * budgetMultiplier * categoryMultiplier * setupMultiplier;

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
            formFactorBonus = 2.0;
        }
    }

    // Q8: Aesthetic Bonus
    let aestheticBonus = 0;
    if (inputs.aestheticPref) {
        const availableColors = (consoleItem.specs as any)?.available_colors?.toLowerCase() || '';
        const material = (consoleItem.specs as any)?.chassis_material?.toLowerCase() || '';
        const pref = inputs.aestheticPref.toLowerCase();

        let colorKeywords: string[] = [];
        let materialKeywords: string[] = [];
        switch (pref) {
            case 'retro':
                colorKeywords = ['grey', 'gray', 'beige', 'classic', 'dmg', 'wood', 'gold', 'famicom'];
                break;
            case 'transparent':
                colorKeywords = ['transparent', 'clear', 'atomic', 'crystal', 'ice', 'purple', 'blue'];
                break;
            case 'modern':
                colorKeywords = ['black', 'white', 'silver', 'matte', 'slate'];
                materialKeywords = ['metal', 'aluminium', 'aluminum', 'alloy'];
                break;
            case 'colorful':
                colorKeywords = ['yellow', 'blue', 'red', 'green', 'pink', 'orange', 'teal', 'indigo', 'turquoise'];
                break;
        }

        const colorMatch = colorKeywords.some(k => availableColors.includes(k));
        const materialMatch = materialKeywords.some(k => material.includes(k));

        if (colorMatch || materialMatch) {
            aestheticBonus = 1.0;
        }
    }

    // --- FINAL TOTAL & CLAMPING ---
    let total = intermediateScore + formFactorBonus + aestheticBonus;

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
