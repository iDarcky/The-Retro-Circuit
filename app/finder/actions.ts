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
  const supabase = await createClient();

  // Fetch all consoles (limit 100 to be safe, but we want a broad selection)
  // We remove the .ilike filter so we get everything, then score/sort in memory.
  const { data, error } = await supabase
    .from('consoles')
    .select(`
      id,
      name,
      slug,
      image_url,
      form_factor,
      release_year,
      manufacturer:manufacturer(name)
    `)
    .limit(100);

  if (error) {
    console.error('Finder Error:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Calculate Scores
  // If formFactorPref is null, we treat it as empty string (neutral/no bonus)
  const scoredConsoles = data.map((consoleItem) => {
    // calculateFormFactorScore handles 'surprise' and case-insensitivity internally
    const score = calculateFormFactorScore(consoleItem.form_factor, formFactorPref || '');

    // Supabase join returns an array or object depending on relationship type (one-to-one vs one-to-many).
    // Based on previous files, 'manufacturer' seems to be singular in domain but Supabase query types can be tricky.
    // We cast or normalize it here.
    const manufacturer = Array.isArray(consoleItem.manufacturer)
      ? consoleItem.manufacturer[0]
      : consoleItem.manufacturer;

    return {
      ...consoleItem,
      manufacturer: manufacturer || null,
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
  // We remove the temporary _score field before returning to match interface (or just cast it)
  // The interface doesn't require _score, so returning the object with extra props is valid in JS/TS runtime usually,
  // but let's be clean.
  return scoredConsoles.slice(0, 3).map(({ _score, ...rest }) => rest) as FinderResultConsole[];
}
