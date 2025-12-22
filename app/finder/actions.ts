'use server';

import { fetchAllConsoles } from '../../lib/api/consoles';
import { calculateFormFactorScore } from '../../lib/finder/scoring';

// We reuse the interface but map the existing domain type to it if needed
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
}

export async function getFinderResults(formFactorPref: string | null): Promise<FinderResultConsole[]> {
  try {
    // Reuse the existing, proven API function that powers the main vault
    // This handles joins, normalization, and public access correctly.
    const allConsoles = await fetchAllConsoles();

    if (!allConsoles || allConsoles.length === 0) {
      console.warn('Finder: fetchAllConsoles returned empty array.');
      return [];
    }

    // Calculate Scores
    const scoredConsoles = allConsoles.map((consoleItem) => {
      // Use the normalized form_factor from the API result
      const score = calculateFormFactorScore(consoleItem.form_factor, formFactorPref || '');

      // Map domain type to finder result type
      return {
        id: consoleItem.id,
        name: consoleItem.name,
        slug: consoleItem.slug,
        image_url: consoleItem.image_url || null,
        form_factor: consoleItem.form_factor || null,
        manufacturer: consoleItem.manufacturer ? { name: consoleItem.manufacturer.name } : null,
        release_year: consoleItem.release_year,
        _score: score
      };
    });

    // Sort: Primary = Score DESC, Secondary = Release Year DESC
    scoredConsoles.sort((a, b) => {
      if (b._score !== a._score) {
        return b._score - a._score;
      }
      const yearA = a.release_year || 0;
      const yearB = b.release_year || 0;
      return yearB - yearA;
    });

    // Return Top 3
    return scoredConsoles.slice(0, 3).map(({ _score, ...rest }) => rest);

  } catch (err) {
    console.error('Unexpected Finder Exception:', err);
    return [];
  }
}
