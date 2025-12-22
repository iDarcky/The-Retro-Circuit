'use server';

import { createClient } from '../../lib/supabase/server';
import { calculateFormFactorScore } from '../../lib/finder/scoring';

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
    const supabase = await createClient();

    // Fetch all consoles
    // Using manufacturer:manufacturer(*) based on proven pattern in lib/api/consoles.ts
    const { data, error } = await supabase
      .from('consoles')
      .select(`
        id,
        name,
        slug,
        image_url,
        form_factor,
        release_year,
        manufacturer:manufacturer(*)
      `)
      .limit(100);

    if (error) {
      console.error('Supabase Finder Error:', error.message, error.details);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('Supabase Finder: No data returned from consoles table.');
      return [];
    }

    // Calculate Scores
    const scoredConsoles = data.map((consoleItem) => {
      const score = calculateFormFactorScore(consoleItem.form_factor, formFactorPref || '');

      // Normalize manufacturer (handle array vs object)
      const rawManufacturer = consoleItem.manufacturer;
      const manufacturerObj = Array.isArray(rawManufacturer) ? rawManufacturer[0] : rawManufacturer;

      return {
        ...consoleItem,
        manufacturer: manufacturerObj ? { name: manufacturerObj.name } : null,
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
    return scoredConsoles.slice(0, 3).map(({ _score, ...rest }) => rest) as FinderResultConsole[];

  } catch (err) {
    console.error('Unexpected Finder Exception:', err);
    return [];
  }
}
