'use server';

import { fetchAllConsoles } from '../../lib/api/consoles';
import { calculateConsoleScore, ScoreBreakdown, getDeviceTierLevel } from '../../lib/finder/scoring';
import { ConsoleDetails } from '../../lib/types/domain';

export interface FinderResultConsole {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  form_factor: string | null;
  manufacturer: {
    name: string;
  } | null;
  // release_year?: number; // REMOVED
  release_date?: string | null; // NEW
  price?: number | null;

  // Match Metadata
  match_label?: string;
  match_reason?: string;

  // Scoring Debug/Display
  _score: number;
  _badges: string[];
  _breakdown?: ScoreBreakdown; // Optional for debug
  _relaxed_features?: string[]; // Log relaxed requirements
}

export async function getFinderResults(
  searchParams: Record<string, string>
): Promise<FinderResultConsole[]> {
  try {
    const allConsoles = await fetchAllConsoles();

    if (!allConsoles || allConsoles.length === 0) {
      console.warn('Finder: fetchAllConsoles returned empty array.');
      return [];
    }

    // Extract Inputs
    const inputs = {
        profile: searchParams.profile || 'default',
        toneMode: searchParams.tone_mode || null,
        setupAnswer: searchParams.setup || null, // Q6
        budgetBand: searchParams.budget_band || null,
        targetTier: searchParams.target_tier || null,
        portabilityPref: searchParams.portability || null,
        formFactorPref: searchParams.form_factor_pref || null,
        features: searchParams.features || null,
        aestheticPref: searchParams.aesthetic || null
    };

    let filteredConsoles = [...allConsoles];
    let relaxedFeatures: string[] = [];

    // --- Q7: FEATURE FILTERING ---
    if (inputs.features && inputs.features !== 'none') {
        const requiredFeatures = inputs.features.split(',').filter(f => f !== 'none');

        const checkFeature = (consoleItem: ConsoleDetails, feature: string): boolean => {
            const variant = consoleItem.specs as any;
            if (!variant) return false;

            switch (feature) {
                case 'hdmi':
                    return !!variant.video_out && variant.video_out.toLowerCase().includes('hdmi');
                case 'bluetooth':
                    return !!variant.bluetooth_specs || (!!variant.other_connectivity && variant.other_connectivity.toLowerCase().includes('bluetooth'));
                case 'wifi':
                    return !!variant.wifi_specs;
                case 'dual_sticks':
                    // Check new input profile first, fallback to legacy checks if needed (though deprecated)
                    if (variant.variant_input_profile) {
                         const count = variant.variant_input_profile.stick_count;
                         return count !== null && count >= 2;
                    }
                    // Fallback for legacy data/structure if input_profile is missing
                    const sticks = (variant.thumbstick_layout || '') + (variant.input_layout || '');
                    return sticks.toLowerCase().includes('dual') || sticks.toLowerCase().includes('twin');
                case 'dual_screen':
                    return (variant.second_screen_size_inch || 0) > 0;
                default:
                    return true;
            }
        };

        const relaxationOrder = ['dual_screen', 'dual_sticks', 'hdmi', 'wifi', 'bluetooth'];
        let currentRequirements = [...requiredFeatures];

        const performFilter = () => {
             return filteredConsoles.filter(c => {
                 return currentRequirements.every(req => checkFeature(c, req));
             });
        };

        let tempResults = performFilter();

        while (tempResults.length === 0 && currentRequirements.length > 0) {
            const nextToRemove = relaxationOrder.find(r => currentRequirements.includes(r));

            if (nextToRemove) {
                relaxedFeatures.push(nextToRemove);
                currentRequirements = currentRequirements.filter(r => r !== nextToRemove);
                tempResults = performFilter();
            } else {
                const popped = currentRequirements.pop();
                if (popped) relaxedFeatures.push(popped);
                tempResults = performFilter();
            }
        }
        filteredConsoles = tempResults;
    }

    // --- SCORING ---
    // Score everything first. Explicitly type the array to FinderResultConsole[]
    // so that objects in it are known to have optional match_label/match_reason fields.
    const scoredConsoles: FinderResultConsole[] = filteredConsoles.map((consoleItem) => {
      const scoreData = calculateConsoleScore(consoleItem, inputs);
      const price = (consoleItem.specs as any)?.price_launch_usd || null;
      // Extract formatted release date or just return the date string if available
      const releaseDate = (consoleItem.specs as any)?.release_date || null;

      return {
        id: consoleItem.id,
        name: consoleItem.name,
        slug: consoleItem.slug,
        image_url: consoleItem.image_url || null,
        form_factor: consoleItem.form_factor || null,
        manufacturer: consoleItem.manufacturer ? { name: consoleItem.manufacturer.name } : null,
        // release_year: consoleItem.release_year, // REMOVED
        release_date: releaseDate,
        price: price,
        _score: scoreData.total,
        _badges: scoreData.badges,
        _breakdown: scoreData,
        _relaxed_features: relaxedFeatures.length > 0 ? relaxedFeatures : undefined,
        match_label: undefined,
        match_reason: undefined
      };
    });

    if (scoredConsoles.length === 0) return [];

    // --- SELECTION LOGIC (Multi-Pass) ---
    const finalSelection: FinderResultConsole[] = [];
    const pickedIds = new Set<string>();

    const getBudgetMultiplier = (price: number | null | undefined, band: string | null) => {
        if (!band || !price) return 1.0;
        let max = 9999;
        switch (band) {
            case 'b_under_60': max = 60; break;
            case 'b_60_120': max = 120; break;
            case 'b_120_180': max = 180; break;
            case 'b_180_300': max = 300; break;
            case 'b_300_plus': max = 9999; break;
        }
        if (price > max) {
            const overage = (price - max) / max;
            if (overage <= 0.10) return 0.95;
            if (overage <= 0.25) return 0.85;
            if (overage <= 0.50) return 0.70;
            if (overage <= 1.0) return 0.50;
            return 0.10; // Killing penalty
        }
        return 1.0;
    };


    // PASS 1: Best Match (Highest Total Score)
    scoredConsoles.sort((a, b) => b._score - a._score);
    const bestMatch = scoredConsoles[0];

    if (bestMatch) {
        bestMatch.match_label = "Best Match";
        bestMatch.match_reason = "Matches your preferences best across all categories.";
        finalSelection.push(bestMatch);
        pickedIds.add(bestMatch.id);
    }

    // PASS 2: Best Performance for Budget
    const perfCandidates = [...scoredConsoles]; // Copy

    perfCandidates.sort((a, b) => {
        const getPerfScore = (c: typeof a) => {
            const bd = c._breakdown!;
            const bMult = getBudgetMultiplier(c.price, inputs.budgetBand);
            return (bd.powerCeiling * 0.6 + bd.tierFit * 0.4) * bMult;
        };
        return getPerfScore(b) - getPerfScore(a);
    });

    const perfPick = perfCandidates.find(c => !pickedIds.has(c.id));

    if (perfPick) {
        perfPick.match_label = "Best Performance for Budget";
        perfPick.match_reason = "Maximizes power and compatibility within your price range, prioritizing performance over features.";
        finalSelection.push(perfPick);
        pickedIds.add(perfPick.id);
    }

    // PASS 3: Upgrade Pick (+$50) OR Runner Up
    const remaining = scoredConsoles.filter(c => !pickedIds.has(c.id));

    if (remaining.length > 0) {
        let upgradePick: typeof remaining[0] | null = null;

        if (inputs.budgetBand && inputs.budgetBand !== 'b_300_plus') {
            let maxBudget = 9999;
            switch (inputs.budgetBand) {
                case 'b_under_60': maxBudget = 60; break;
                case 'b_60_120': maxBudget = 120; break;
                case 'b_120_180': maxBudget = 180; break;
                case 'b_180_300': maxBudget = 300; break;
            }

            const candidates = remaining.filter(c => {
                if (!c.price) return false;

                // 1. Budget Constraint
                const isPriceEligible = c.price > maxBudget && c.price <= maxBudget + 50;
                if (!isPriceEligible) return false;

                // 2. Justify Cost Check
                if (!bestMatch || !bestMatch._breakdown || !c._breakdown) return false;

                const tierFitGain = c._breakdown.tierFit - bestMatch._breakdown.tierFit;

                const bestMatchTierLevel = getDeviceTierLevel(bestMatch._breakdown.powerCeiling);
                const currentTierLevel = getDeviceTierLevel(c._breakdown.powerCeiling);
                const tierLevelGain = currentTierLevel - bestMatchTierLevel;

                const isSignificantUpgrade = (tierFitGain >= 0.20) || (tierLevelGain >= 1);

                return isSignificantUpgrade;
            });

            if (candidates.length > 0) {
                // Sort by Raw Power (Ceiling) to pick the strongest upgrade
                candidates.sort((a, b) => (b._breakdown?.powerCeiling || 0) - (a._breakdown?.powerCeiling || 0));
                upgradePick = candidates[0];
                upgradePick.match_label = "Upgrade Pick (+$50)";
                upgradePick.match_reason = "Slightly over budget, but offers significantly more power or compatibility.";
            }
        }

        if (upgradePick) {
            finalSelection.push(upgradePick);
            pickedIds.add(upgradePick.id);
        } else {
            // Fallback: Runner Up (Next highest Total Score)
            remaining.sort((a, b) => b._score - a._score);
            const runnerUp = remaining[0];
            runnerUp.match_label = "Runner Up";
            runnerUp.match_reason = "A strong alternative that nearly matched your top pick.";
            finalSelection.push(runnerUp);
            pickedIds.add(runnerUp.id);
        }
    }

    return finalSelection;

  } catch (err) {
    console.error('Unexpected Finder Exception:', err);
    return [];
  }
}
