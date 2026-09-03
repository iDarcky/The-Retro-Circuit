"use server";

import { supabaseAnon } from "../../lib/supabase/anon";
import { SearchResult } from "../../lib/types";
import { searchRateLimit, getIp } from "../../lib/rate-limit";

export const searchDatabase = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        // Rate limiting, and it fails OPEN.
        //
        // If Upstash is unreachable, out of quota, or misconfigured, `.limit()` throws.
        // That used to fall through to the outer catch and return an empty array, so a
        // Redis problem looked exactly like "no results" — search appeared broken with
        // nothing anywhere saying why. A limiter that cannot answer should not take down
        // the feature it protects.
        if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) {
            try {
                const ip = await getIp();
                const { success } = await searchRateLimit.limit(ip);
                if (!success) {
                    console.warn(`[search] rate limit hit for ${ip}`);
                    return [];
                }
            } catch (e: any) {
                console.error('[search] rate limiter unavailable, allowing the query:', e?.message ?? e);
            }
        }

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

        // Both failures were silent: only `.data` was ever read, so an RPC error or a
        // permissions problem returned an empty list indistinguishable from no matches.
        if (consolesResponse.error) {
            console.error('[search] search_consoles_global failed:', consolesResponse.error.message);
            throw new Error(`console search failed: ${consolesResponse.error.message}`);
        }
        if (manufacturersResponse.error) {
            console.error('[search] manufacturer search failed:', manufacturersResponse.error.message);
        }

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
    } catch (e: any) {
        console.error('[search] failed:', e?.message ?? e);
        // Rethrow so the caller can tell "nothing matched" from "the search broke".
        // Swallowing this is why a broken search was indistinguishable from an empty one.
        throw new Error('SEARCH_FAILED');
    }
};
