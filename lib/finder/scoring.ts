
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

    // Penalty for mismatch (if strict matching desired, or just 0)
    // User requested "Add a small penalty if it doesn’t match"
    return -5;
};
