
import { supabase } from "../supabase/singleton";
import { ConsoleDetails } from "../types";

export const fetchLatestConsoles = async (limit: number = 3): Promise<ConsoleDetails[]> => {
    try {
        // Sort by release_date (descending) primarily
        // Fallback to release_year if release_date is missing (though we are migrating away)
        const { data, error } = await supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*)
            `)
            .order('created_at', { ascending: false }) // Keep created_at for "Latest Added" context?
            // Wait, the prompt implies "Latest Released" hardware vs "Latest Added" database entries.
            // The original code sorted by 'created_at' for this function, but the user says:
            // "Latest Released (real-world releases), Latest Added (database updates)" are separate.
            // This function is named `fetchLatestConsoles`.
            // Let's check `fetchRealWorldLatest` in `lib/api/latest.ts` if it exists, or if this function serves both purposes.
            // The prompt says "API function `fetchRealWorldLatest` is located in `lib/api/latest.ts`".
            // So `fetchLatestConsoles` likely means "Latest Added to DB".
            // I should double check `fetchRealWorldLatest`.
            // BUT, looking at the code I read, this file ONLY has `fetchLatestConsoles`.
            // Ah, memory says "The API function `fetchRealWorldLatest` is located in `lib/api/latest.ts` (consolidated)".
            // Let me re-read the file content I just got.
            // It ONLY has `fetchLatestConsoles`.
            // I might have missed `fetchRealWorldLatest` if I overwrote it or it's missing.
            // Wait, I see `fetchRealWorldLatest` in my Plan step 4 notes.
            // Let me check if I should add it or if it's missing.

            // Actually, the previous read of `lib/api/latest.ts` showed ONLY `fetchLatestConsoles`.
            // This function sorts by `created_at`.
            // If there is a "Latest Released" section, it must use another function.
            // I will add `fetchRealWorldLatest` here if it's missing, or modify it if it exists.

            // Re-reading the code:
            // `fetchLatestConsoles` sorts by `created_at`. This is "Latest Added".

            // I need to implement or update the "Latest Released" logic.
            // If I look at `lib/api/consoles.ts`, I see general fetch.

            // Let's assume I need to ADD `fetchRealWorldLatest` to this file to support the homepage requirement properly,
            // OR update `fetchLatestConsoles` if it was intended to be "Real World".
            // However, `created_at` suggests "Database Entry".

            // I will add `fetchRealWorldLatest` to this file, sorting by `release_date`.

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
        // Fetch consoles joined with variants to get release dates
        // We need to sort by the release date of the *default variant* or the console's release date (if we had one on the console table, but we don't).
        // Since we can't easily sort by a joined column deeply in Supabase in one go without a view,
        // we might fetch variants sorted by release_date, then get their consoles.
        // OR, if `consoles` doesn't have `release_date`, we rely on `release_year` (legacy) or `variants.release_date`.

        // Strategy: Query `console_variants` sorted by `release_date` desc, distinct on `console_id`.
        const { data: variants, error } = await supabase
            .from('console_variants')
            .select(`
                *,
                console:consoles (
                    *,
                    manufacturer:manufacturer(*)
                )
            `)
            .not('release_date', 'is', null)
            .order('release_date', { ascending: false })
            .limit(limit * 2); // Fetch more to handle potential dupes if distinct fails (Supabase JS doesn't support distinct on specific columns easily in simple select)

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
