import { createClient } from '../supabase/client';
import { ConsoleDetails } from '../types/domain';

// Helper: Normalize Variant (Unwrap 1:1 relations that Supabase returns as arrays)
function normalizeVariant(v: any): any {
    if (!v) return v;
    if (Array.isArray(v.variant_input_profile)) {
        v.variant_input_profile = v.variant_input_profile[0] || null;
    }
    if (Array.isArray(v.emulation_profiles)) {
        v.emulation_profile = v.emulation_profiles[0] || null;
    }
    return v;
}

// Helper: Normalize Console List (Apply variant normalization and defaults)
function normalizeConsoles(data: any[] | null): ConsoleDetails[] {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item: any) => {
        if (!item) return null;

        const variants = (item.variants || []).map(normalizeVariant);
        item.variants = variants;

        const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];

        if (defaultVariant) {
            if (!item.image_url) item.image_url = defaultVariant.image_url;
            item.specs = defaultVariant;
        } else {
            item.specs = {};
        }

        return item;
    }).filter(Boolean) as ConsoleDetails[];
}

export async function fetchLatestConsoles(limit: number = 5): Promise<ConsoleDetails[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('consoles')
      .select(`
        *,
        manufacturer:manufacturer(id, name),
        variants:console_variants(*)
      `)
      .eq('status', 'published') // Only show published consoles
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching latest consoles:', error);
      return [];
    }

    if (!data) return [];

    return normalizeConsoles(data);
  } catch (error) {
    console.error('Unexpected error fetching latest consoles:', error);
    return [];
  }
}

export async function fetchRealWorldLatest(limit: number = 5): Promise<ConsoleDetails[]> {
  try {
    const supabase = createClient();
    // Fetch a larger batch to sort in memory, since release_date is in variants/specs
    const { data, error } = await supabase
      .from('consoles')
      .select(`
        *,
        manufacturer:manufacturer(id, name),
        variants:console_variants(*)
      `)
      .eq('status', 'published')
      .limit(50); // Fetch enough to find the latest 5

    if (error) {
      console.error('Error fetching real-world latest consoles:', error);
      return [];
    }

    if (!data) return [];

    const normalized = normalizeConsoles(data);

    // Sort by release date descending
    normalized.sort((a, b) => {
        const dateA = a.specs?.release_date ? new Date(a.specs.release_date).getTime() : 0;
        const dateB = b.specs?.release_date ? new Date(b.specs.release_date).getTime() : 0;
        return dateB - dateA;
    });

    return normalized.slice(0, limit);
  } catch (error) {
    console.error('Unexpected error fetching real-world latest consoles:', error);
    return [];
  }
}
