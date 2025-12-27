import { supabase } from "../supabase/singleton";
import { ConsoleDetails, ConsoleFilterState, ConsoleSpecs, ConsoleVariant, VariantInputProfile } from "../types";

// Helper: Normalize Variant (Unwrap 1:1 relations that Supabase returns as arrays)
function normalizeVariant(v: any): any {
    if (!v) return v;
    if (Array.isArray(v.variant_input_profile)) {
        v.variant_input_profile = v.variant_input_profile[0] || null;
    }
    return v;
}

// Helper: Normalize Console List (Apply variant normalization and defaults)
function normalizeConsoleList(data: any[] | null): ConsoleDetails[] {
    return (data || []).map((item: any) => {
        const variants = (item.variants || []).map(normalizeVariant);
        item.variants = variants;

        const defaultVariant = variants.find((v: any) => v.is_default) || variants[0];

        if (defaultVariant) {
            if (!item.image_url) item.image_url = defaultVariant.image_url;
            item.specs = defaultVariant;
        } else {
            item.specs = {};
        }

        return item;
    }) as ConsoleDetails[];
}

export const fetchAllConsoles = async (includeHidden: boolean = false): Promise<ConsoleDetails[]> => {
    try {
        let query = supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*, emulation_profiles(*), variant_input_profile(*))
            `)
            .order('name', { ascending: true });

        if (!includeHidden) {
            query = query.eq('status', 'published');
        }

        const { data, error } = await query;

        if (error) {
            console.error('[API] fetchAllConsoles DB Error:', error.message);
            throw error;
        }

        return normalizeConsoleList(data);

    } catch (e) {
        console.error('[API] Fetch All Consoles Exception:', e);
        return [];
    }
};

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        // Public search always enforces published status
        let query = supabase.from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*, variant_input_profile(*))', { count: 'exact' })
            .eq('status', 'published');

        if (filters.manufacturer_id) query = query.eq('manufacturer_id', filters.manufacturer_id);
        
        if (filters.form_factors.length > 0) query = query.in('form_factor', filters.form_factors);

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query.order('name', { ascending: true }).range(from, to);
        
        if (error) {
            console.error('[API] fetchConsolesFiltered DB Error:', error.message);
            throw error;
        }

        let normalizedData = normalizeConsoleList(data);

        // IN-MEMORY SORTING & FILTERING
        if (filters.minYear > 1970 || filters.maxYear < new Date().getFullYear()) {
            normalizedData = normalizedData.filter((item: any) => {
                const dateStr = item.specs?.release_date;
                const year = dateStr ? new Date(dateStr).getFullYear() : 9999;
                return year >= filters.minYear && year <= filters.maxYear;
            });
        }

        normalizedData.sort((a: any, b: any) => {
             const dateA = a.specs?.release_date ? new Date(a.specs.release_date).getTime() : 0;
             const dateB = b.specs?.release_date ? new Date(b.specs.release_date).getTime() : 0;
             return dateB - dateA;
        });

        return { data: normalizedData as ConsoleDetails[], count: count || 0 };

    } catch (e) {
        console.error('[API] Fetch Consoles Exception:', e);
        return { data: [], count: 0 };
    }
};

export const fetchConsoleList = async (includeHidden: boolean = false): Promise<{name: string, slug: string, id: string, status?: string}[]> => {
    let query = supabase.from('consoles').select('id, name, slug, status').order('name');

    if (!includeHidden) {
        query = query.eq('status', 'published');
    }

    const { data } = await query;
    return data || [];
};

export const fetchConsoleBySlug = async (slug: string, includeHidden: boolean = false): Promise<{ data: ConsoleDetails | null, error: any }> => {
    try {
        let query = supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*, emulation_profiles(*), variant_input_profile(*))
            `)
            .eq('slug', slug);

        if (!includeHidden) {
            query = query.eq('status', 'published');
        }

        const { data, error } = await query.limit(1);
            
        if (error) {
            return { data: null, error: { message: error.message } };
        }

        if (!data || data.length === 0) {
            return { data: null, error: { message: "Console not found in database" } };
        }

        // Normalize single item
        const list = normalizeConsoleList(data);
        return { data: list[0], error: null };
    } catch (e: any) {
        return { data: null, error: { message: `EXCEPTION: ${e.message}` } };
    }
};

export const getConsoleById = async (id: string): Promise<ConsoleDetails | null> => {
    try {
        // Admin use primarily, but let's leave as is (usually used by ID for editing)
        const { data, error } = await supabase.from('consoles').select('*').eq('id', id).single();
        if (error) throw error;
        return data as ConsoleDetails;
    } catch {
        return null;
    }
};

export const getConsoleSpecs = async (consoleId: string): Promise<ConsoleSpecs | null> => {
    try {
        const { data } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*)')
            .eq('console_id', consoleId)
            .eq('is_default', true)
            .maybeSingle();
            
        if (data) return normalizeVariant(data) as ConsoleSpecs;

        const { data: anyVar } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*)')
            .eq('console_id', consoleId)
            .limit(1)
            .maybeSingle();
            
        return normalizeVariant(anyVar) as ConsoleSpecs;
    } catch {
        return null;
    }
};

export const getVariantsByConsole = async (consoleId: string): Promise<ConsoleVariant[]> => {
    try {
        const { data, error } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*)')
            .eq('console_id', consoleId)
            .order('is_default', { ascending: false });
        if (error) throw error;
        return (data || []).map(normalizeVariant) as ConsoleVariant[];
    } catch {
        return [];
    }
};

export const getVariantById = async (variantId: string): Promise<ConsoleVariant | null> => {
    try {
        const { data, error } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*)')
            .eq('id', variantId)
            .single();
        if (error) throw error;
        return normalizeVariant(data) as ConsoleVariant;
    } catch {
        return null;
    }
};

export const getConsolesByManufacturer = async (manufacturerId: string): Promise<ConsoleDetails[]> => {
    try {
        const { data, error } = await supabase
            .from('consoles')
            .select('*, variants:console_variants(*, variant_input_profile(*))')
            .eq('manufacturer_id', manufacturerId)
            .eq('status', 'published'); // Enforce published
            
        if (error) throw error;
        
        return normalizeConsoleList(data);
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
        const { variant_input_profile, ...mainVariantData } = variantData;

        const { data: newVariant, error: variantError } = await supabase
            .from('console_variants')
            .insert([mainVariantData])
            .select('id')
            .single();

        if (variantError) return { success: false, message: "Variant Insert Failed: " + variantError.message };
        if (!newVariant) return { success: false, message: "Variant Insert Failed: No Data" };

        if (variant_input_profile) {
            const profileData: VariantInputProfile = {
                ...variant_input_profile,
                variant_id: newVariant.id
            };
            const { error: profileError } = await supabase.from('variant_input_profile').insert([profileData]);

            if (profileError) {
                console.error("Input Profile Insert Failed:", profileError);
                return { success: true, message: "Variant saved, but Input Profile failed: " + profileError.message };
            }
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const updateConsoleVariant = async (id: string, variantData: Partial<ConsoleVariant>): Promise<{ success: boolean, message?: string }> => {
    try {
        const { variant_input_profile, ...mainVariantData } = variantData;

        const { error: variantError } = await supabase.from('console_variants').update(mainVariantData).eq('id', id);
        if (variantError) return { success: false, message: variantError.message };

        if (variant_input_profile) {
            const profileData = {
                ...variant_input_profile,
                variant_id: id
            };
            const { error: profileError } = await supabase.from('variant_input_profile').upsert([profileData]);

            if (profileError) {
                console.error("Input Profile Update Failed:", profileError);
                 return { success: true, message: "Variant updated, but Input Profile failed: " + profileError.message };
            }
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
