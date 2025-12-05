import { supabase } from "../supabase/singleton";
import { ConsoleDetails, ConsoleFilterState, ConsoleSpecs, ConsoleVariant } from "../types";

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        let query = supabase.from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*), variants:console_variants(*)', { count: 'exact' })
            .order('release_year', { ascending: true });

        if (filters.manufacturer_id) query = query.eq('manufacturer_id', filters.manufacturer_id);
        if (filters.minYear > 1970) query = query.gte('release_year', filters.minYear);
        if (filters.maxYear < 2005) query = query.lte('release_year', filters.maxYear);
        if (filters.generations.length > 0) query = query.in('generation', filters.generations);
        if (filters.form_factors.length > 0) query = query.in('form_factor', filters.form_factors);

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query.range(from, to);
        if (error) throw error;

        // Normalize specs (handle array vs object)
        const normalizedData = (data || []).map((item: any) => {
            if (Array.isArray(item.specs)) {
                item.specs = item.specs[0] || {};
            }
            return item;
        });

        return { data: normalizedData as ConsoleDetails[], count: count || 0 };

    } catch (e) {
        console.error('Fetch Consoles Error:', e);
        return { data: [], count: 0 };
    }
};

export const fetchConsoleList = async (): Promise<{name: string, slug: string, id: string}[]> => {
    const { data } = await supabase.from('consoles').select('id, name, slug').order('name');
    return data || [];
};

export const fetchConsoleBySlug = async (slug: string): Promise<ConsoleDetails | null> => {
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*), variants:console_variants(*)')
            .eq('slug', slug)
            .single();
            
        if (error) throw error;

        // Normalize specs from array to object if necessary
        const rawData: any = data;
        if (rawData && Array.isArray(rawData.specs)) {
            rawData.specs = rawData.specs[0] || {};
        }

        return rawData as ConsoleDetails;
    } catch {
        return null;
    }
};

export const getConsoleSpecs = async (consoleId: string): Promise<ConsoleSpecs | null> => {
    try {
        const { data, error } = await supabase.from('console_specs').select('*').eq('console_id', consoleId).single();
        if (error) throw error;
        return data as ConsoleSpecs;
    } catch {
        return null;
    }
};

export const getVariantsByConsole = async (consoleId: string): Promise<ConsoleVariant[]> => {
    try {
        const { data, error } = await supabase
            .from('console_variants')
            .select('*')
            .eq('console_id', consoleId)
            .order('is_default', { ascending: false }); // Defaults first
        if (error) throw error;
        return data as ConsoleVariant[];
    } catch {
        return [];
    }
};

export const getConsolesByManufacturer = async (manufacturerId: string): Promise<ConsoleDetails[]> => {
    try {
        const { data, error } = await supabase.from('consoles').select('*').eq('manufacturer_id', manufacturerId);
        if (error) throw error;
        return data as ConsoleDetails[];
    } catch {
        return [];
    }
}

export const addConsole = async (
    consoleData: Omit<ConsoleDetails, 'id' | 'manufacturer' | 'specs' | 'variants'>, 
    specsData: ConsoleSpecs
): Promise<{ success: boolean, message?: string }> => {
    try {
        const { data: newConsole, error: consoleError } = await supabase.from('consoles').insert([consoleData]).select('id').single();
        if (consoleError) {
             console.error('SUPABASE CONSOLE INSERT ERROR:', consoleError.code, consoleError.message, consoleError.details);
             return { success: false, message: consoleError.message || "Failed to create console record" };
        }
        if (!newConsole) return { success: false, message: "No data returned from insert" };

        const { error: specsError } = await supabase.from('console_specs').insert([{ ...specsData, console_id: newConsole.id }]);
        if (specsError) {
             console.error('SUPABASE SPECS INSERT ERROR:', specsError.code, specsError.message, specsError.details);
             await supabase.from('consoles').delete().eq('id', newConsole.id);
             return { success: false, message: `Specs Error: ${specsError.message}` };
        }
        return { success: true };
    } catch (e: any) {
        console.error('EXCEPTION IN addConsole:', e);
        return { success: false, message: e.message || "Unknown Exception" };
    }
};

export const addConsoleVariant = async (variantData: Omit<ConsoleVariant, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        const { error } = await supabase.from('console_variants').insert([variantData]);
        if (error) return { success: false, message: error.message };
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}