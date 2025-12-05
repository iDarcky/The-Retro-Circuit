import { supabase } from "../supabase/singleton";
import { ConsoleDetails, ConsoleFilterState, ConsoleSpecs, ConsoleVariant } from "../types";

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        // Query variants instead of legacy console_specs
        let query = supabase.from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*)', { count: 'exact' })
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

        // Normalize data: Populate 'specs' and missing root fields from the default variant
        const normalizedData = (data || []).map((item: any) => {
            const variants = item.variants || [];
            // Prioritize default variant, else take the first one
            const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];
            
            if (defaultVariant) {
                // If console 'folder' lacks info, pull from variant
                if (!item.release_year) item.release_year = defaultVariant.release_year;
                if (!item.image_url) item.image_url = defaultVariant.image_url;
                
                // Populate legacy 'specs' property so older components don't crash
                item.specs = defaultVariant;
            } else {
                item.specs = {};
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
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*)')
            .eq('slug', slug)
            .single();
            
        if (error) throw error;

        const rawData: any = data;
        const variants = rawData.variants || [];
        const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];

        // Backfill specs and display properties from variant if needed
        rawData.specs = defaultVariant || {};
        
        if (!rawData.image_url && defaultVariant?.image_url) {
            rawData.image_url = defaultVariant.image_url;
        }
        if (!rawData.release_year && defaultVariant?.release_year) {
             rawData.release_year = defaultVariant.release_year;
        }

        return rawData as ConsoleDetails;
    } catch {
        return null;
    }
};

export const getConsoleSpecs = async (consoleId: string): Promise<ConsoleSpecs | null> => {
    // Legacy support: Fetch from console_variants since console_specs is deprecated
    try {
        // Try to find default variant first
        const { data, error } = await supabase
            .from('console_variants')
            .select('*')
            .eq('console_id', consoleId)
            .eq('is_default', true)
            .maybeSingle();
            
        if (data) return data as ConsoleSpecs;

        // Fallback to any variant
        const { data: anyVar } = await supabase
            .from('console_variants')
            .select('*')
            .eq('console_id', consoleId)
            .limit(1)
            .maybeSingle();
            
        return anyVar as ConsoleSpecs;
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
        const { data, error } = await supabase
            .from('consoles')
            .select('*, variants:console_variants(*)')
            .eq('manufacturer_id', manufacturerId);
            
        if (error) throw error;
        
        // Normalize
        return (data || []).map((item: any) => {
             const variants = item.variants || [];
             const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];
             item.specs = defaultVariant || {};
             if (defaultVariant && !item.image_url) item.image_url = defaultVariant.image_url;
             return item;
        }) as ConsoleDetails[];
    } catch {
        return [];
    }
}

// Updated: Only creates the Console Identity (Folder). Specs are handled via variants.
export const addConsole = async (
    consoleData: Omit<ConsoleDetails, 'id' | 'manufacturer' | 'specs' | 'variants'>
): Promise<{ success: boolean, message?: string, id?: string }> => {
    try {
        const { data: newConsole, error: consoleError } = await supabase.from('consoles').insert([consoleData]).select('id').single();
        if (consoleError) {
             console.error('SUPABASE CONSOLE INSERT ERROR:', consoleError.code, consoleError.message, consoleError.details);
             return { success: false, message: consoleError.message || "Failed to create console record" };
        }
        if (!newConsole) return { success: false, message: "No data returned from insert" };

        return { success: true, id: newConsole.id };
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