
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
            .eq('status', 'published') // Enforce published status
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[API] fetchLatestConsoles DB Error:', error.message);
            return [];
        }

        return normalizeConsoles(data);

    } catch (e) {
        console.error('[API] Fetch Latest Consoles Exception:', e);
        return [];
    }
};

export const fetchRealWorldLatest = async (limit: number = 3): Promise<ConsoleDetails[]> => {
    try {
        // Strategy: Query `console_variants` sorted by `release_date` desc, distinct on `console_id`.
        // We use inner join on consoles to ensure we only get variants belonging to PUBLISHED consoles.

        const { data: variants, error } = await supabase
            .from('console_variants')
            .select(`
                *,
                console:consoles!inner (
                    *,
                    manufacturer:manufacturer(*)
                )
            `)
            .eq('console.status', 'published') // Filter by console status
            .not('release_date', 'is', null)
            .order('release_date', { ascending: false })
            .limit(limit * 2);

        if (error) {
            console.error('[API] fetchRealWorldLatest DB Error:', error.message);
            return [];
        }

        // De-duplicate consoles
        const uniqueConsoles = new Map<string, ConsoleDetails>();
        for (const v of variants || []) {
            if (v.console && !uniqueConsoles.has(v.console.id)) {
                // Attach this variant as the default/specs for display context
                const consoleData = v.console;
                consoleData.specs = v;
                consoleData.image_url = v.image_url || consoleData.image_url;

                uniqueConsoles.set(v.console.id, consoleData);
                if (uniqueConsoles.size >= limit) break;
            }
        }

        return Array.from(uniqueConsoles.values());

    } catch (e) {
        console.error('[API] Fetch Real World Latest Exception:', e);
        return [];
    }
}

function normalizeConsoles(data: any[] | null): ConsoleDetails[] {
    return (data || []).map((item: any) => {
        const variants = item.variants || [];
        const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];

        if (defaultVariant) {
            if (!item.image_url) item.image_url = defaultVariant.image_url;
            item.specs = defaultVariant;
        } else {
            item.specs = {};
        }
        return item;
    }) as ConsoleDetails[];
}
