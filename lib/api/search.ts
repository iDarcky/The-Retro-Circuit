import { supabase } from "../supabase/singleton";
import { SearchResult } from "../types";

export const searchDatabase = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        const terms = query.trim().split(/\s+/).filter(t => t.length > 0);
        let dbQuery = supabase.from('global_search_index').select('*');
        terms.forEach(term => { dbQuery = dbQuery.ilike('title', `%${term}%`); });
        const { data, error } = await dbQuery.limit(10);
        if (error) throw error;
        return (data || []).map((item: any) => ({
            type: item.type as 'GAME' | 'CONSOLE',
            id: item.id,
            slug: item.slug,
            title: item.title,
            subtitle: item.subtitle,
            image: item.image
        }));
    } catch {
        return [];
    }
};