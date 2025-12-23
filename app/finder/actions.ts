'use server';

import { fetchAllConsoles } from '../../lib/api/consoles';
import { calculateConsoleScore, ScoreBreakdown } from '../../lib/finder/scoring';
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
  release_year?: number;
  price?: number | null;

  // Scoring Debug/Display
  _score: number;
  _badges: string[];
  _breakdown?: ScoreBreakdown; // Optional for debug
  _relaxed_features?: string[]; // New: Log relaxed requirements
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
        features: searchParams.features || null // Q7: Features CSV
    };

    let filteredConsoles = [...allConsoles];
    let relaxedFeatures: string[] = [];

    // --- Q7: FEATURE FILTERING ---
    // Strict requirements. If user asks for HDMI, we only show HDMI.
    // If strict filtering kills all results, we relax them in order.

    if (inputs.features && inputs.features !== 'none') {
        const requiredFeatures = inputs.features.split(',').filter(f => f !== 'none');

        // Define Feature Check Logic
        // Returns true if console supports the feature
        const checkFeature = (consoleItem: ConsoleDetails, feature: string): boolean => {
            const variant = consoleItem.specs as any; // Usually default variant
            if (!variant) return false;

            switch (feature) {
                case 'hdmi':
                    // Check video_out field
                    return !!variant.video_out && variant.video_out.toLowerCase().includes('hdmi');
                case 'bluetooth':
                    return !!variant.bluetooth_specs || (!!variant.other_connectivity && variant.other_connectivity.toLowerCase().includes('bluetooth'));
                case 'wifi':
                    return !!variant.wifi_specs;
                case 'dual_sticks':
                    // "Dual Sticks" usually means `thumbstick_layout` implies 2, or checking logic
                    // Current schema has `thumbstick_layout`.
                    // Let's assume if thumbstick_layout is present and not 'none', it might have sticks.
                    // But we need to know count.
                    // The schema does NOT have a strict stick count.
                    // We can check `thumbstick_layout` text for "Dual" or check `thumbstick_mechanism`.
                    // Or look at `input_layout`.
                    // Given the ambiguity, let's search for "Dual" in `thumbstick_layout` or `input_layout`.
                    const sticks = (variant.thumbstick_layout || '') + (variant.input_layout || '');
                    return sticks.toLowerCase().includes('dual') || sticks.toLowerCase().includes('twin');
                case 'dual_screen':
                    // Check second_screen fields or form_factor 'Clamshell' (not sufficient)
                    // Schema has `second_screen_size_inch`. If > 0, it has dual screen.
                    return (variant.second_screen_size_inch || 0) > 0;
                default:
                    return true;
            }
        };

        // Relaxation Order: Dual Screen -> Dual Analog -> HDMI -> Wifi -> Bluetooth
        const relaxationOrder = ['dual_screen', 'dual_sticks', 'hdmi', 'wifi', 'bluetooth'];

        // Try strict first
        let currentRequirements = [...requiredFeatures];

        // Recursive Filtering Function
        const performFilter = () => {
             const result = filteredConsoles.filter(c => {
                 return currentRequirements.every(req => checkFeature(c, req));
             });
             return result;
        };

        let tempResults = performFilter();

        // If no results, relax logic
        // Only loop if we started with requirements
        while (tempResults.length === 0 && currentRequirements.length > 0) {
            // Find the first removable requirement according to priority order
            const nextToRemove = relaxationOrder.find(r => currentRequirements.includes(r));

            if (nextToRemove) {
                console.log(`[Finder] Relaxing requirement: ${nextToRemove}`);
                relaxedFeatures.push(nextToRemove);
                currentRequirements = currentRequirements.filter(r => r !== nextToRemove);
                tempResults = performFilter();
            } else {
                // If we have requirements but none match relaxation order (unknown features?), just break to avoid infinite loop
                // Or remove the last one arbitrarily
                const popped = currentRequirements.pop();
                if (popped) relaxedFeatures.push(popped);
                tempResults = performFilter();
            }
        }

        // If we still have 0 results after dropping everything (unlikely unless DB empty), revert to original (show 0 matches)
        // OR show best matches based on score?
        // The prompt says: "If strict filtering results in zero... Return closest matches".
        // Our relaxation loop effectively finds closest matches by dropping least important features first.
        filteredConsoles = tempResults;

        // If we relaxed everything and still have nothing (e.g. initial set empty), logic below handles empty array.
    }

    // Calculate Scores for Remaining Consoles
    const scoredConsoles = filteredConsoles.map((consoleItem) => {
      const scoreData = calculateConsoleScore(consoleItem, inputs);

      const price = (consoleItem.specs as any)?.price_launch_usd || null;

      return {
        id: consoleItem.id,
        name: consoleItem.name,
        slug: consoleItem.slug,
        image_url: consoleItem.image_url || null,
        form_factor: consoleItem.form_factor || null,
        manufacturer: consoleItem.manufacturer ? { name: consoleItem.manufacturer.name } : null,
        release_year: consoleItem.release_year,
        price: price,
        _score: scoreData.total,
        _badges: scoreData.badges,
        _breakdown: scoreData,
        _relaxed_features: relaxedFeatures.length > 0 ? relaxedFeatures : undefined
      };
    });

    // Sort: Score DESC
    scoredConsoles.sort((a, b) => b._score - a._score);

    // Return Top 3
    return scoredConsoles.slice(0, 3).map(({ _breakdown, ...rest }) => rest);

  } catch (err) {
    console.error('Unexpected Finder Exception:', err);
    return [];
  }
}
