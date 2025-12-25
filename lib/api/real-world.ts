
import { supabase } from "../supabase/singleton";
import { ConsoleDetails } from "../types";

export const fetchRealWorldLatest = async (limit: number = 3): Promise<ConsoleDetails[]> => {
    try {
        // Query by release_year descending
        // Note: release_year can be null, we might want to filter for not-null or use a fallback
        const { data, error } = await supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*)
            `)
            .not('release_year', 'is', null)
            .order('release_year', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[API] fetchRealWorldLatest DB Error:', error.message);
            return [];
        }

        return normalizeConsoles(data);

    } catch (e) {
        console.error('[API] Fetch Real World Latest Exception:', e);
        return [];
    }
};

function normalizeConsoles(data: any[] | null): ConsoleDetails[] {
    return (data || []).map((item: any) => {
        const variants = item.variants || [];
        const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];

        if (defaultVariant) {
            // Ensure root properties are populated if missing
            if (!item.release_year) item.release_year = defaultVariant.release_year;
            if (!item.image_url) item.image_url = defaultVariant.image_url;
            item.specs = defaultVariant;
        } else {
            item.specs = {};
        }
        return item;
    }) as ConsoleDetails[];
}
