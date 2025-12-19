
import { supabase } from "../supabase/singleton";
import { SearchResult } from "../types";

export const searchDatabase = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        const term = `%${query.trim()}%`;

        // Parallel query execution
        const [consolesResponse, manufacturersResponse] = await Promise.all([
            supabase
                .from('consoles')
                .select('id, name, slug, image_url, manufacturer:manufacturer(name)')
                .ilike('name', term)
                .limit(5),
            supabase
                .from('manufacturer')
                .select('id, name, slug, image_url')
                .ilike('name', term)
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
                    subtitle: item.manufacturer?.name,
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
