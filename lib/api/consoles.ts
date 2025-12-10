import { supabase } from "../supabase/singleton";
import { ConsoleDetails, ConsoleFilterState, ConsoleSpecs, ConsoleVariant } from "../types";

export const fetchAllConsoles = async (): Promise<ConsoleDetails[]> => {
    try {
        // The 'Vacuum' Strategy: Fetch everything including nested variants
        const { data, error } = await supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*)
            `)
            .order('name', { ascending: true });

        if (error) {
            console.error('[API] fetchAllConsoles DB Error:', error.message);
            throw error;
        }

        // Normalize
        return (data || []).map((item: any) => {
            const variants = item.variants || [];
            const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];
            
            if (defaultVariant) {
                if (!item.release_year) item.release_year = defaultVariant.release_year;
                if (!item.image_url) item.image_url = defaultVariant.image_url;
                item.specs = defaultVariant;
            } else {
                item.specs = {};
            }
            return item;
        }) as ConsoleDetails[];

    } catch (e) {
        console.error('[API] Fetch All Consoles Exception:', e);
        return [];
    }
};

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        // Query consoles. We sort by NAME by default in the DB to ensure we get a stable list
        // regardless of whether 'release_year' is null or missing in the parent table.
        let query = supabase.from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*)', { count: 'exact' });

        if (filters.manufacturer_id) query = query.eq('manufacturer_id', filters.manufacturer_id);
        
        if (filters.form_factors.length > 0) query = query.in('form_factor', filters.form_factors);

        // Pagination (fetch a bit more to handle in-memory filtering if needed, but for now strict range)
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Perform query
        const { data, count, error } = await query.order('name', { ascending: true }).range(from, to);
        
        if (error) {
            console.error('[API] fetchConsolesFiltered DB Error:', error.message);
            throw error;
        }

        // Normalize data: Populate 'specs' and missing root fields from the default variant
        let normalizedData = (data || []).map((item: any) => {
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

        // IN-MEMORY SORTING & FILTERING (Crucial for split schema)
        // 1. Filter by Year (now that we've backfilled it from variants)
        if (filters.minYear > 1970 || filters.maxYear < new Date().getFullYear()) {
            normalizedData = normalizedData.filter((item: any) => {
                const year = item.release_year || 9999; // Keep TBA items if looking for new
                return year >= filters.minYear && year <= filters.maxYear;
            });
        }

        // 2. Sort by Release Year Descending (Newest First)
        normalizedData.sort((a: any, b: any) => {
            const yearA = a.release_year || 9999;
            const yearB = b.release_year || 9999;
            return yearB - yearA; // Descending
        });

        return { data: normalizedData as ConsoleDetails[], count: count || 0 };

    } catch (e) {
        console.error('[API] Fetch Consoles Exception:', e);
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
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants (
                    *,
                    emulation_profiles (*)
                )
            `)
            .eq('slug', slug)
            .single();
            
        if (error) throw error;

        const rawData: any = data;
        
        // Normalize emulation_profiles array to single object if present
        if (rawData.variants && Array.isArray(rawData.variants)) {
             rawData.variants = rawData.variants.map((v: any) => {
                 // Check if emulation_profiles came back as array
                 if (v.emulation_profiles && Array.isArray(v.emulation_profiles)) {
                     v.emulation_profile = v.emulation_profiles[0] || null;
                     delete v.emulation_profiles;
                 }
                 return v;
             });
        }
        
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

export const getConsoleById = async (id: string): Promise<ConsoleDetails | null> => {
    try {
        const { data, error } = await supabase.from('consoles').select('*').eq('id', id).single();
        if (error) throw error;
        return data as ConsoleDetails;
    } catch {
        return null;
    }
};

export const getConsoleSpecs = async (consoleId: string): Promise<ConsoleSpecs | null> => {
    // Legacy support: Fetch from console_variants since console_specs is deprecated
    try {
        // Try to find default variant first
        const { data } = await supabase
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

export const getVariantById = async (variantId: string): Promise<ConsoleVariant | null> => {
    try {
        const { data, error } = await supabase
            .from('console_variants')
            .select('*')
            .eq('id', variantId)
            .single();
        if (error) throw error;
        return data as ConsoleVariant;
    } catch {
        return null;
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

export const updateConsole = async (
    id: string,
    consoleData: Partial<ConsoleDetails>
): Promise<{ success: boolean, message?: string }> => {
    try {
        const { error } = await supabase.from('consoles').update(consoleData).eq('id', id);
        if (error) return { success: false, message: error.message };
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
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
};

export const updateConsoleVariant = async (id: string, variantData: Partial<ConsoleVariant>): Promise<{ success: boolean, message?: string }> => {
    try {
        const { error } = await supabase.from('console_variants').update(variantData).eq('id', id);
        if (error) return { success: false, message: error.message };
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};