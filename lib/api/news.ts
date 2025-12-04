import { supabase } from "../supabase/singleton";
import { NewsItem } from "../types";

export const fetchRetroNews = async (page: number = 1, limit: number = 5, category?: string): Promise<{ data: NewsItem[], count: number }> => {
    try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        let query = supabase.from('news').select('*', { count: 'exact' }).order('date', { ascending: false });
        if (category && category !== 'ALL') query = query.eq('category', category);
        const { data, count, error } = await query.range(from, to);
        if (error) throw error;
        return { data: (data as NewsItem[]) || [], count: count || 0 };
    } catch {
        return { data: [], count: 0 };
    }
};

export const addNewsItem = async (item: NewsItem): Promise<boolean> => {
    try {
        const { error } = await supabase.from('news').insert([item]);
        return !error;
    } catch {
        return false;
    }
};