'use server';

import { fetchAllConsoles } from '../../lib/api/consoles';
import { calculateConsoleScore, ScoreBreakdown } from '../../lib/finder/scoring';

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
    };

    // Calculate Scores
    const scoredConsoles = allConsoles.map((consoleItem) => {
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
        _breakdown: scoreData // Internal use if needed
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
