"use server";

import { createClient } from "../../lib/supabase/server";
import { supabaseAnon } from "../../lib/supabase/anon";
import { ConsoleDetails, ConsoleFilterState, ConsoleSpecs, ConsoleVariant, VariantInputProfile } from "../../lib/types";

// Helper: Normalize Variant (Unwrap 1:1 relations that Supabase returns as arrays)
function normalizeVariant(v: any): any {
    if (!v) return v;
    if (Array.isArray(v.variant_input_profile)) {
        v.variant_input_profile = v.variant_input_profile[0] || null;
    }
    if (Array.isArray(v.emulation_profiles)) {
        v.emulation_profile = v.emulation_profiles[0] || null;
    }
    return v;
}

// Helper: Normalize Console List (Apply variant normalization and defaults)
function normalizeConsoleList(data: any[] | null): ConsoleDetails[] {
    if (!data || !Array.isArray(data)) return []; // DEFENSIVE CHECK

    return data.map((item: any) => {
        if (!item) return null; // Skip invalid items

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
    }).filter(Boolean) as ConsoleDetails[];
}

export const fetchAllConsoles = async (includeHidden: boolean = false): Promise<ConsoleDetails[]> => {
    try {
        const supabase = supabaseAnon;
        let query = supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*, emulation_profiles(*), variant_input_profile(*)), og_icon_url
            `)
            .order('name', { ascending: true });

        if (!includeHidden) {
            query = query.eq('status', 'published');
        }

        const { data, error } = await query;

        if (error) {
            console.error('[API] fetchAllConsoles DB Error:', error.message);
            // Instead of throwing, return empty to prevent page crash
            return [];
        }

        return normalizeConsoleList(data);

    } catch (e: any) {
        console.error('[API] Fetch All Consoles Exception:', e);
        return [];
    }
};

export const fetchVaultConsoles = async (): Promise<ConsoleDetails[]> => {
    try {
        const supabase = supabaseAnon;
        // Optimized query: Excludes heavy 'emulation_profiles' and 'variant_input_profile'
        // Only fetches core console data, manufacturer, and variant specs needed for list view filtering
        const { data, error } = await supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*)
            `)
            .eq('status', 'published')
            .order('name', { ascending: true });

        if (error) {
            console.error('[API] fetchVaultConsoles DB Error:', error.message);
            return [];
        }

        return normalizeConsoleList(data);
    } catch (e: any) {
        console.error('[API] Fetch Vault Consoles Exception:', e);
        return [];
    }
};

export const fetchConsolesFiltered = async (filters: ConsoleFilterState, page: number = 1, limit: number = 20): Promise<{ data: ConsoleDetails[], count: number }> => {
    try {
        const supabase = supabaseAnon;
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
            return { data: [], count: 0 };
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

export const fetchConsoleList = async (includeHidden: boolean = false): Promise<{ name: string, slug: string, id: string, status?: string, updated_at?: string, manufacturer?: { name: string, slug: string } }[]> => {
    const supabase = supabaseAnon;
    // Updated to include manufacturer name for better searchability in Arena
    let query = supabase.from('consoles').select('id, name, slug, status, updated_at, manufacturer(name, slug)').order('name');

    if (!includeHidden) {
        query = query.eq('status', 'published');
    }

    const { data } = await query;

    if (!data) return [];

    return data.map((item: any) => ({
        id: item.id,
        // Prepend Manufacturer name if available (e.g. "Nintendo Game Boy")
        name: item.manufacturer?.name ? `${item.manufacturer.name} ${item.name}` : item.name,
        slug: item.slug,
        status: item.status,
        updated_at: item.updated_at,
        manufacturer: item.manufacturer
    }));
};

export const fetchConsoleBySlug = async (slug: string, includeHidden: boolean = false): Promise<{ data: ConsoleDetails | null, error: any }> => {
    try {
        const supabase = supabaseAnon;
        let query = supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*, emulation_profiles(*), variant_input_profile(*)), og_icon_url
            `)
            .eq('slug', slug);

        if (!includeHidden) {
            query = query.eq('status', 'published');
        }

        // Use maybeSingle to avoid 406/JSON errors if 0 or >1 rows
        // But .limit(1).maybeSingle() or just .limit(1) and check length
        // Standard .single() throws if 0 rows.

        const { data, error } = await query.maybeSingle();

        if (error) {
            return { data: null, error: { message: error.message } };
        }

        if (!data) {
            return { data: null, error: { message: "Console not found in database" } };
        }

        // Normalize single item (wrap in array then unwrap)
        const list = normalizeConsoleList([data]);
        return { data: list[0] || null, error: null };
    } catch (e: any) {
        // Return a structured error object instead of throwing
        return { data: null, error: { message: `EXCEPTION: ${e.message}` } };
    }
};

export const getConsoleById = async (id: string): Promise<ConsoleDetails | null> => {
    try {
        const supabase = supabaseAnon;
        const { data, error } = await supabase.from('consoles').select('*').eq('id', id).single();
        if (error) throw error;
        return data as ConsoleDetails;
    } catch {
        return null;
    }
};

export const getConsoleSpecs = async (consoleId: string): Promise<ConsoleSpecs | null> => {
    try {
        const supabase = supabaseAnon;
        const { data } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*), emulation_profiles(*)')
            .eq('console_id', consoleId)
            .eq('is_default', true)
            .maybeSingle();

        if (data) return normalizeVariant(data) as ConsoleSpecs;

        const { data: anyVar } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*), emulation_profiles(*)')
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
        const supabase = supabaseAnon;
        const { data, error } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*), emulation_profiles(*)')
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
        const supabase = supabaseAnon;
        const { data, error } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*), emulation_profiles(*)')
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
        const supabase = supabaseAnon;
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
        const supabase = await createClient();
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
        const supabase = await createClient();

        // Remove joined fields that are not columns in the consoles table
        const { manufacturer, variants, specs, ...cleanData } = consoleData as any;

        const { error } = await supabase.from("consoles").update(cleanData).eq("id", id);
        if (error) return { success: false, message: error.message };
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const addConsoleVariant = async (variantData: Omit<ConsoleVariant, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();
        const { variant_input_profile, emulation_profile, ...mainVariantData } = variantData;

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
            // Use UPSERT because the trigger automatically creates a row on insert
            const { error: profileError } = await supabase.from('variant_input_profile').upsert([profileData], { onConflict: 'variant_id' });

            if (profileError) {
                console.error("Input Profile Update Failed:", profileError);
                return { success: true, message: "Variant saved, but Input Profile update failed: " + profileError.message };
            }
        }

        if (emulation_profile) {
            // Emulation profiles might be auto-created by DB triggers, so we use upsert
            const { id, ...emuDataWithoutId } = emulation_profile as any;
            const emuPayload = {
                ...emuDataWithoutId,
                variant_id: newVariant.id
            };

            const { error: emuError } = await supabase
                .from('emulation_profiles')
                .upsert(emuPayload, { onConflict: 'variant_id' });

            if (emuError) {
                console.error("Emulation Profile Copy Failed:", emuError);
                // Non-fatal error, we still return success for the variant
            }
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const updateConsoleVariant = async (id: string, variantData: Partial<ConsoleVariant>): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();
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

export const deleteConsole = async (id: string): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();

        // 1. Check status
        const { data: consoleData, error: fetchError } = await supabase.from('consoles').select('status').eq('id', id).single();
        if (fetchError) return { success: false, message: fetchError.message };

        if (consoleData.status !== 'draft') {
            return { success: false, message: "Only DRAFT consoles can be deleted." };
        }

        // 2. Delete
        const { error: deleteError } = await supabase.from('consoles').delete().eq('id', id);
        if (deleteError) return { success: false, message: deleteError.message };

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export const fetchConsoleAndVariantCounts = async (): Promise<{ consoles: number, variants: number }> => {
    try {
        const supabase = supabaseAnon;

        // Count published consoles
        const { count: consoleCount, error: consoleError } = await supabase
            .from('consoles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published');

        if (consoleError) throw consoleError;

        // Count variants for published consoles
        // We use !inner to enforce the join filter
        const { count: variantCount, error: variantError } = await supabase
            .from('console_variants')
            .select('id, console:consoles!inner(status)', { count: 'exact', head: true })
            .eq('console.status', 'published');

        if (variantError) throw variantError;

        return { consoles: consoleCount || 0, variants: variantCount || 0 };

    } catch (e: any) {
        console.error('[API] Fetch Counts Exception:', e);
        return { consoles: 0, variants: 0 };
    }
};
