
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

    // Safety: If no variants, we can't judge emulation, but we shouldn't crash.
    // However, user said "default to FAIL".
    if (variants.length === 0) return -100;

    // Check if ANY variant passes the tier requirements.
    // We calculate a score for each variant, then take the best one.
    // If best variant fails -> -100.
    // If best variant passes -> +10 (or bonus).

    let bestVariantScore = -100;

    for (const variant of variants) {
        let score = -100; // Default fail

        // Handle "emulation_profiles" being an array or object depending on fetch
        // PostgREST usually returns array for one-to-many, but if 1:1 it might be obj.
        // Based on types, it's EmulationProfile | null.
        // BUT wait, types say `emulation_profile` (singular) in `ConsoleVariant`,
        // but `emulation_profiles` (plural) in fetch.
        // We'll handle it dynamically.
        const rawProfile = (variant as any).emulation_profiles;
        const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;

        // "Modern" Logic: PC Gaming Bypass
        const isPC = consoleItem.device_category === 'pc_gaming';

        switch (targetTier) {
            case '8bit': // 16-bit era
                // Anchors: snes_state, gba_state.
                // "Reality: almost everything passes; don’t over-filter here."
                // Pass if ANY anchor is good, or if it's PC.
                if (isPC) {
                    score = 10;
                } else if (profile) {
                    const snes = isPass(profile.snes_state);
                    const gba = isPass(profile.gba_state);
                    if (snes || gba) score = 10;
                }
                break;

            case '32bit': // PS1, N64, Dreamcast
                // Rule: >= 2 of 3 pass
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
                // Rule: >= 1 of 2 passes
                if (isPC) {
                    score = 10;
                } else if (profile) {
                    const psp = isPass(profile.psp_state);
                    const nds = isPass(profile.nds_state);
                    if (psp || nds) score = 10;
                }
                break;

            case '6thgen': // PS2, GC, Wii
                // Rule: >= 2 of 3 pass
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
                        // Stronger boost if both pass
                        if (switchState && ps3) score = 20;
                    }
                }
                break;

            default:
                score = 0; // Unknown tier? No penalty.
        }

        if (score > bestVariantScore) {
            bestVariantScore = score;
        }
    }

    return bestVariantScore;
};
