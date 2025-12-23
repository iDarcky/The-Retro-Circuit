
import { ConsoleDetails } from '../types';

export type ProfileType = 'nostalgia' | 'completionist' | 'performance' | 'onthego' | 'gift';

export interface FinderWeights {
  power: number;
  portability: number;
  ease: number;
  value: number;
  library: number;
}

export const BASE_WEIGHTS: FinderWeights = {
  power: 1.0,
  portability: 1.0,
  ease: 1.0,
  value: 1.0,
  library: 1.0,
};

export const calculateWeights = (profile: ProfileType): FinderWeights => {
  const weights = { ...BASE_WEIGHTS };

  switch (profile) {
    case 'nostalgia':
      weights.ease *= 1.15;
      weights.power *= 0.95;
      weights.library *= 1.05;
      break;
    case 'completionist':
      weights.library *= 1.20;
      weights.value *= 1.10;
      weights.power *= 1.05;
      break;
    case 'performance':
      weights.power *= 1.25;
      weights.ease *= 0.95;
      break;
    case 'onthego':
      weights.portability *= 1.25;
      weights.power *= 0.95;
      break;
    case 'gift':
      weights.ease *= 1.25;
      weights.library *= 1.05;
      weights.power *= 0.90;
      break;
  }

  return weights;
};

// Logic for Q2 Form Factor Bonus
export const calculateFormFactorScore = (consoleFormFactor: string | undefined, preference: string): number => {
    if (!consoleFormFactor) return 0;
    if (preference === 'surprise') return 0; // Neutral

    const normalizedConsole = consoleFormFactor.toLowerCase();
    const normalizedPref = preference.toLowerCase();

    // Direct Match
    if (normalizedConsole === normalizedPref) {
        return 5; // Small bonus example
    }

    // Penalty for mismatch
    return -5;
};

// --- Q3 TIER LOGIC ---

const PASS_STATES = ['Playable', 'Great', 'Perfect'];

const isPass = (state: string | undefined | null) => {
    if (!state) return false;
    // Normalize to handle case sensitivity if DB differs
    const s = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
    return PASS_STATES.includes(s);
};

export const calculateTierScore = (consoleItem: ConsoleDetails, targetTier: string | null): number => {
    if (!targetTier) return 0;

    const variants = consoleItem.variants || [];

    if (variants.length === 0) return -100;

    let bestVariantScore = -100;

    for (const variant of variants) {
        let score = -100; // Default fail

        const rawProfile = (variant as any).emulation_profiles;
        const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;

        // "Modern" Logic: PC Gaming Bypass
        const isPC = consoleItem.device_category === 'pc_gaming';

        switch (targetTier) {
            case '8bit': // 16-bit era
                if (isPC) {
                    score = 10;
                } else if (profile) {
                    const snes = isPass(profile.snes_state);
                    const gba = isPass(profile.gba_state);
                    if (snes || gba) score = 10;
                }
                break;

            case '32bit': // PS1, N64, Dreamcast
                if (isPC) {
                    score = 10;
                } else if (profile) {
                    let passes = 0;
                    if (isPass(profile.ps1_state)) passes++;
                    if (isPass(profile.n64_state)) passes++;
                    if (isPass(profile.dreamcast_state)) passes++;

                    if (passes >= 2) score = 10;
                }
                break;

            case '2000s': // PSP, NDS
                if (isPC) {
                    score = 10;
                } else if (profile) {
                    const psp = isPass(profile.psp_state);
                    const nds = isPass(profile.nds_state);
                    if (psp || nds) score = 10;
                }
                break;

            case '6thgen': // PS2, GC, Wii
                if (isPC) {
                    score = 10;
                } else if (profile) {
                    let passes = 0;
                    if (isPass(profile.ps2_state)) passes++;
                    if (isPass(profile.gamecube_state)) passes++;
                    if (isPass(profile.wii_state)) passes++;

                    if (passes >= 2) score = 10;
                }
                break;

            case 'modern': // Switch, PS3, PC
                if (isPC) {
                    score = 10; // "Modern-capable"
                } else if (profile) {
                    const switchState = isPass(profile.switch_state);
                    const ps3 = isPass(profile.ps3_state);

                    // Rule: Switch OR PS3 passes (>= 1 of 2)
                    if (switchState || ps3) {
                        score = 10;
                        if (switchState && ps3) score = 20;
                    }
                }
                break;

            default:
                score = 0;
        }

        if (score > bestVariantScore) {
            bestVariantScore = score;
        }
    }

    return bestVariantScore;
};

// --- Q4 BUDGET LOGIC ---

export const calculateBudgetScore = (price: number | undefined | null, band: string | null): number => {
    // If no band selected, neutral
    if (!band) return 0;

    // If price is missing, slight penalty? Or neutral?
    // User logic implies filtering/ranking. Missing price is hard to judge.
    // Let's give it -10 so it falls below priced items that match range.
    if (price === undefined || price === null) return -10;

    // Define Ranges
    let min = 0;
    let max = 0;
    let noLimit = false;

    switch (band) {
        case 'b_under_60': max = 60; break;
        case 'b_60_120': min = 60; max = 120; break;
        case 'b_120_180': min = 120; max = 180; break;
        case 'b_180_300': min = 180; max = 300; break;
        case 'b_300_plus': min = 300; noLimit = true; break;
        default: return 0;
    }

    // Logic:
    // In Range -> +10
    // Cheaper -> +5
    // Over Budget -> -20

    if (noLimit) {
        // If 300+, anything > 300 is In Range (+10).
        // What about < 300? Is it "Cheaper"? Yes.
        if (price > 300) return 10;
        return 5;
    }

    if (price > min && price <= max) {
        return 10;
    }

    // "Under 60" special case: min=0
    if (band === 'b_under_60' && price <= 60) {
        return 10;
    }

    if (price <= min) {
        return 5;
    }

    // If we are here, price > max (Over Budget)
    return -20;
};
