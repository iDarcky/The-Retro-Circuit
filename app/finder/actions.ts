'use server';

import { createClient } from '../../lib/supabase/server';

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

  // If "surprise", we just get random ones (or latest/popular)
  if (!formFactorPref || formFactorPref === 'surprise') {
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
      .limit(3);

    if (error) {
      console.error('Finder Error:', error);
      return [];
    }
    return data as any;
  }

  // Normalize preference to match DB casing (assuming DB uses Title Case or user input)
  // Our Q2 values are: 'horizontal', 'vertical', 'clamshell'
  // We need to map these to what is likely in the DB.
  // Common convention: 'Horizontal', 'Vertical', 'Clamshell'
  const dbFormFactor = formFactorPref.charAt(0).toUpperCase() + formFactorPref.slice(1);

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
    .ilike('form_factor', dbFormFactor) // ilike for case-insensitive match
    .limit(3);

  if (error) {
    console.error('Finder Error:', error);
    return [];
  }

  return data as any;
}
