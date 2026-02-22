"use server";

import { supabaseAnon } from "../../lib/supabase/anon";

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        const supabase = supabaseAnon;
        const { error } = await supabase.from('consoles').select('*', { count: 'exact', head: true });
        return !error;
    } catch {
        return false;
    }
};