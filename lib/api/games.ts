import { supabase as supabaseSingleton } from "../supabase/singleton";
import { GameOfTheWeekData } from "../types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchGameList = async (): Promise<{title: string, slug: string, id: string}[]> => {
    const { data } = await supabaseSingleton.from('games').select('title, slug, id').order('title');
    return data || [];
};

export const fetchGamesByConsole = async (consoleSlug: string, client?: SupabaseClient): Promise<GameOfTheWeekData[]> => {
    const supabase = client || supabaseSingleton;
    try {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('console_slug', consoleSlug)
            .order('year', { ascending: true });
            
        if (error) throw error;

        return (data || []).map((g: any) => ({
            id: g.id,
            slug: g.slug,
            title: g.title,
            developer: g.developer,
            year: g.year,
            genre: g.genre,
            content: g.content,
            whyItMatters: g.why_it_matters,
            rating: g.rating,
            image: g.image,
            console_slug: g.console_slug
        }));
    } catch {
        return [];
    }
};

export const addGame = async (game: GameOfTheWeekData): Promise<boolean> => {
    try {
        const { error } = await supabaseSingleton.from('games').insert([{
            title: game.title,
            slug: game.slug,
            developer: game.developer,
            year: game.year,
            genre: game.genre,
            content: game.content,
            why_it_matters: game.whyItMatters,
            rating: game.rating,
            image: game.image,
            console_slug: game.console_slug
        }]);
        return !error;
    } catch {
        return false;
    }
};

export const fetchGameOfTheWeek = async (): Promise<GameOfTheWeekData | null> => {
    try {
        const { data, error } = await supabaseSingleton.from('games').select('*').limit(1).maybeSingle();
        if (error || !data) return null;
        return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            developer: data.developer,
            year: data.year,
            genre: data.genre,
            content: data.content,
            whyItMatters: data.why_it_matters,
            rating: data.rating,
            image: data.image,
            console_slug: data.console_slug
        };
    } catch {
        return null;
    }
};

export const fetchGamesPaginated = async (page: number = 1, limit: number = 12): Promise<{ data: GameOfTheWeekData[], count: number }> => {
    try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, count, error } = await supabaseSingleton.from('games').select('*', { count: 'exact' }).order('year', { ascending: false }).range(from, to);
        if (error) throw error;
        const mapped = (data || []).map((g: any) => ({
            id: g.id,
            slug: g.slug,
            title: g.title,
            developer: g.developer,
            year: g.year,
            genre: g.genre,
            content: g.content,
            whyItMatters: g.why_it_matters,
            rating: g.rating,
            image: g.image,
            console_slug: g.console_slug
        }));
        return { data: mapped, count: count || 0 };
    } catch {
        return { data: [], count: 0 };
    }
};