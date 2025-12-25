
import { supabase } from "../supabase/singleton";
import { ConsoleDetails } from "../types";

export const fetchLatestConsoles = async (limit: number = 3): Promise<ConsoleDetails[]> => {
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[API] fetchLatestConsoles DB Error:', error.message);
            // Fallback: sort by release_year if created_at fails or doesn't exist
             const { data: backupData } = await supabase
                .from('consoles')
                .select(`
                    *,
                    manufacturer:manufacturer(*),
                    variants:console_variants(*)
                `)
                .order('release_year', { ascending: false })
                .limit(limit);

             return normalizeConsoles(backupData);
        }

        return normalizeConsoles(data);

    } catch (e) {
        console.error('[API] Fetch Latest Consoles Exception:', e);
        return [];
    }
};

// Fetch consoles sorted by release_year DESC (Real World Latest)
export const fetchRealWorldLatest = async (limit: number = 3): Promise<ConsoleDetails[]> => {
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*)
            `)
            // Sort by release_year DESC, nulls last
            .order('release_year', { ascending: false, nullsFirst: false })
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
            if (!item.release_year) item.release_year = defaultVariant.release_year;
            if (!item.image_url) item.image_url = defaultVariant.image_url;
            item.specs = defaultVariant;
        } else {
            item.specs = {};
        }
        return item;
    }) as ConsoleDetails[];
}
