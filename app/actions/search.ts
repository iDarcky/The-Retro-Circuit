"use server";

import { supabaseAnon } from "../../lib/supabase/anon";
import { SearchResult } from "../../lib/types";

export const searchDatabase = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        const supabase = supabaseAnon;
        const term = query.trim(); // No wildcards needed for RPC usually if handled inside, but my RPC adds them.

        // Parallel query execution
        // 1. Search Consoles via RPC (handles "Nintendo Gameboy" logic)
        // 2. Search Manufacturers via standard ILIKE (handles "Nintendo")
        const [consolesResponse, manufacturersResponse] = await Promise.all([
            supabase
                .rpc('search_consoles_global', { term }),
            supabase
                .from('manufacturer')
                .select('id, name, slug, image_url')
                .ilike('name', `%${term}%`)
                .limit(5)
        ]);

        const results: SearchResult[] = [];

        // Map Consoles
        if (consolesResponse.data) {
            consolesResponse.data.forEach((item: any) => {
                results.push({
                    type: 'CONSOLE',
                    id: item.id,
                    slug: item.slug,
                    title: item.name,
                    subtitle: item.manufacturer_name, // RPC returns this
                    image: item.image_url
                });
            });
        }

        // Map Fabricators (Manufacturers)
        if (manufacturersResponse.data) {
            manufacturersResponse.data.forEach((item: any) => {
                results.push({
                    type: 'FABRICATOR',
                    id: item.id,
                    slug: item.slug,
                    title: item.name,
                    subtitle: 'Manufacturer',
                    image: item.image_url
                });
            });
        }

        return results;
    } catch (e) {
        console.error('Search API Error:', e);
        return [];
    }
};
