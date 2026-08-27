"use server";

import { createClient } from "../../lib/supabase/server";
import { submitToIndexNow } from "../../lib/indexnow";
import { supabaseAnon } from "../../lib/supabase/anon";
import { ConsoleDetails, ConsoleFilterState, ConsoleSpecs, ConsoleVariant, VariantInputProfile } from "../../lib/types";
import { revalidatePath } from "next/cache";

/**
 * Refresh every cached surface a console appears on, then tell IndexNow.
 *
 * Public pages are `revalidate = false`, so nothing regenerates on a timer — a newly
 * published console stays invisible until each surface is explicitly invalidated.
 * `/sitemap.xml` matters most: it is how Google discovers the URL at all. IndexNow
 * only reaches Bing/Yandex, so without this a publish never reaches Google until the
 * next deploy.
 */
async function revalidateConsoleSurfaces(slug?: string | null, manufacturerSlug?: string | null) {
    if (!slug) return;

    revalidatePath('/sitemap.xml');
    revalidatePath('/');
    revalidatePath('/consoles');
    revalidatePath(`/consoles/${slug}`);
    if (manufacturerSlug) {
        revalidatePath('/fabricators');
        revalidatePath(`/fabricators/${manufacturerSlug}`);
    }

    const base = 'https://theretrocircuit.com';
    const urls = [`${base}/consoles/${slug}`, `${base}/consoles`, `${base}/sitemap.xml`];
    if (manufacturerSlug) urls.push(`${base}/fabricators/${manufacturerSlug}`);
    await submitToIndexNow(urls);
}

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
        // Draft/archived rows are no longer readable by the anon role (RLS is
        // published-only), so an includeHidden read must go through the cookie-aware
        // client as the signed-in admin. includeHidden=false keeps supabaseAnon, which
        // is what allows the public pages to stay statically generated.
        const supabase = includeHidden ? await createClient() : supabaseAnon;
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
        // Public search always enforces published status.
        // The date filter and release-date sort operate on the *default variant's* release_date,
        // which lives on console_variants (not the consoles row), so they can't be expressed in a
        // single parent query. Instead we fetch the full set matching the column-level filters
        // (manufacturer / form factor), then filter + sort + paginate in memory. This keeps the
        // returned `count` consistent with the rows actually returned. The dataset is small
        // (~dozens of consoles), so this is cheap.
        let query = supabase.from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*, variant_input_profile(*))')
            .eq('status', 'published');

        if (filters.manufacturer_id) query = query.eq('manufacturer_id', filters.manufacturer_id);

        if (filters.form_factors.length > 0) query = query.in('form_factor', filters.form_factors);

        const { data, error } = await query.order('name', { ascending: true });

        if (error) {
            console.error('[API] fetchConsolesFiltered DB Error:', error.message);
            return { data: [], count: 0 };
        }

        let normalizedData = normalizeConsoleList(data);

        // Apply the year filter on the default variant's release date.
        if (filters.minYear > 1970 || filters.maxYear < new Date().getFullYear()) {
            normalizedData = normalizedData.filter((item: any) => {
                const dateStr = item.specs?.release_date;
                const year = dateStr ? new Date(dateStr).getFullYear() : 9999;
                return year >= filters.minYear && year <= filters.maxYear;
            });
        }

        // Sort newest-first by release date across the whole filtered set.
        normalizedData.sort((a: any, b: any) => {
            const dateA = a.specs?.release_date ? new Date(a.specs.release_date).getTime() : 0;
            const dateB = b.specs?.release_date ? new Date(b.specs.release_date).getTime() : 0;
            return dateB - dateA;
        });

        // Count reflects the fully-filtered set, then paginate.
        const count = normalizedData.length;
        const from = (page - 1) * limit;
        const paginated = normalizedData.slice(from, from + limit);

        return { data: paginated as ConsoleDetails[], count };

    } catch (e) {
        console.error('[API] Fetch Consoles Exception:', e);
        return { data: [], count: 0 };
    }
};

export const fetchConsoleList = async (includeHidden: boolean = false): Promise<{ name: string, slug: string, id: string, status?: string, updated_at?: string, manufacturer?: { name: string, slug: string } }[]> => {
    // See fetchAllConsoles: hidden rows require the authenticated client under the
    // published-only RLS policy; the anon path stays SSG-safe.
    const supabase = includeHidden ? await createClient() : supabaseAnon;
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
        // Draft/archived rows are no longer readable by the anon role (RLS is
        // published-only), so an includeHidden read must go through the cookie-aware
        // client as the signed-in admin. includeHidden=false keeps supabaseAnon, which
        // is what allows the public pages to stay statically generated.
        const supabase = includeHidden ? await createClient() : supabaseAnon;
        let query = supabase
            .from('consoles')
            .select(`
                *,
                manufacturer:manufacturer(*),
                variants:console_variants(*, emulation_profiles(*), variant_input_profile(*)),
                links:console_links(*), og_icon_url
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

/** Admin-only lookup by id — cookie-aware for the same draft-visibility reason as below. */
export const getConsoleSpecs = async (consoleId: string): Promise<ConsoleSpecs | null> => {
    try {
        const supabase = await createClient();
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

/**
 * Admin-only: every variant of a console, used to offer an existing variant as the starting
 * template for a new one.
 *
 * Must use the cookie-aware client. RLS only lets `anon` see variants whose console is
 * PUBLISHED, so on a draft console the anon client returns an empty list — which looked
 * exactly like "this console has no variants" and silently removed the template picker.
 */
export const getVariantsByConsole = async (consoleId: string): Promise<ConsoleVariant[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*), emulation_profiles(*)')
            .eq('console_id', consoleId)
            .order('is_default', { ascending: false });
        if (error) throw error;
        return (data || []).map(normalizeVariant) as ConsoleVariant[];
    } catch (err) {
        // Swallowing this is what hid the RLS denial in the first place.
        console.error(`getVariantsByConsole(${consoleId}) failed:`, err);
        return [];
    }
};

/** Admin-only lookup by id — cookie-aware for the same draft-visibility reason as above. */
export const getVariantById = async (variantId: string): Promise<ConsoleVariant | null> => {
    try {
        const supabase = await createClient();
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

        const { data: newConsole, error: consoleError } = await supabase.from('consoles').insert([consoleData]).select('id, status, slug, manufacturer:manufacturer_id(slug)').single();
        if (consoleError) {
            console.error('SUPABASE CONSOLE INSERT ERROR:', consoleError.code, consoleError.message, consoleError.details);
            return { success: false, message: consoleError.message || "Failed to create console record" };
        }
        if (!newConsole) return { success: false, message: "No data returned from insert" };

        if (newConsole.status === 'published' && newConsole.slug) {
            await revalidateConsoleSurfaces(newConsole.slug, (newConsole.manufacturer as any)?.slug);
        }

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


        // Check if status is being updated to 'published'
        const isPublishing = cleanData.status === 'published';
        let previousStatus = null;
        let consoleSlugInfo = null;

        if (isPublishing) {
            const { data: prevConsole } = await supabase
                .from("consoles")
                .select("status, slug, manufacturer:manufacturer_id(slug)")
                .eq("id", id)
                .single();
            previousStatus = prevConsole?.status;
            consoleSlugInfo = prevConsole;
        }

        const { error } = await supabase.from("consoles").update(cleanData).eq("id", id);
        if (error) return { success: false, message: error.message };

        // `id` is a console id, so look the console up directly. The previous version
        // queried console_variants by this id, which never matched a row — meaning no
        // update ever revalidated anything.
        const { data: updated } = await supabase
            .from('consoles')
            .select('slug, manufacturer:manufacturer_id(slug)')
            .eq('id', id)
            .maybeSingle();

        const cSlug = updated?.slug || consoleSlugInfo?.slug || cleanData.slug;
        const mSlug = (updated?.manufacturer as any)?.slug
            || (consoleSlugInfo?.manufacturer as any)?.slug;

        // On a publish this is what puts the URL into the sitemap Google reads.
        if (isPublishing && previousStatus !== 'published') {
            await revalidateConsoleSurfaces(cSlug, mSlug);
        } else if (cSlug) {
            revalidatePath(`/consoles/${cSlug}`);
        }

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

        if (mainVariantData.console_id) {
            const { data: parentConsole } = await supabase.from('consoles').select('slug, manufacturer:manufacturer(slug, name)').eq('id', mainVariantData.console_id).single();
            if (parentConsole?.slug) {
                revalidatePath(`/consoles/${parentConsole.slug}`);
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

        const { data: updatedVariant } = await supabase.from('console_variants').select('console_id, consoles(slug, manufacturer:manufacturer(slug, name))').eq('id', id).single();
        if ((updatedVariant?.consoles as any)?.slug) {
            revalidatePath(`/consoles/${(updatedVariant?.consoles as any).slug}`);
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

export interface ConsoleImage {
    id: string;
    url: string;
    alt_text: string | null;
    kind: string | null;
    sort_order: number;
}

/**
 * Gallery shots for a console, ordered.
 *
 * Returns [] if the console_images table has not been migrated yet, so the detail page
 * renders exactly as before instead of erroring on an unmigrated database.
 */
export const fetchConsoleImages = async (consoleId: string): Promise<ConsoleImage[]> => {
    if (!consoleId) return [];
    try {
        const { data, error } = await supabaseAnon
            .from('console_images')
            .select('id, url, alt_text, kind, sort_order')
            .eq('console_id', consoleId)
            .order('sort_order', { ascending: true });

        if (error) {
            // 42P01 = undefined_table: migration not applied yet. Anything else is worth surfacing.
            if (error.code !== '42P01') console.error('[API] fetchConsoleImages:', error.message);
            return [];
        }
        return (data || []) as ConsoleImage[];
    } catch (e: any) {
        console.error('[API] fetchConsoleImages exception:', e?.message);
        return [];
    }
};

/** Admin: gallery images for a console, regardless of publish status. */
export const fetchConsoleImagesAdmin = async (consoleId: string): Promise<ConsoleImage[]> => {
    if (!consoleId) return [];
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('console_images')
            .select('id, url, alt_text, kind, sort_order')
            .eq('console_id', consoleId)
            .order('sort_order', { ascending: true });
        if (error) {
            if (error.code !== '42P01') console.error('[API] fetchConsoleImagesAdmin:', error.message);
            return [];
        }
        return (data || []) as ConsoleImage[];
    } catch {
        return [];
    }
};

export const addConsoleImage = async (
    consoleId: string,
    url: string,
    altText: string,
    kind: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const supabase = await createClient();
        const { data: last } = await supabase
            .from('console_images')
            .select('sort_order')
            .eq('console_id', consoleId)
            .order('sort_order', { ascending: false })
            .limit(1)
            .maybeSingle();

        const { error } = await supabase.from('console_images').insert([{
            console_id: consoleId,
            url,
            alt_text: altText || null,
            kind: kind || 'other',
            sort_order: (last?.sort_order ?? -1) + 1,
        }]);
        if (error) return { success: false, message: error.message };

        const { data: c } = await supabase
            .from('consoles')
            .select('slug, status, manufacturer:manufacturer_id(slug)')
            .eq('id', consoleId)
            .maybeSingle();
        if (c?.status === 'published' && c.slug) revalidatePath(`/consoles/${c.slug}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const deleteConsoleImage = async (
    imageId: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const supabase = await createClient();
        const { data: img } = await supabase
            .from('console_images')
            .select('console_id')
            .eq('id', imageId)
            .maybeSingle();

        const { error } = await supabase.from('console_images').delete().eq('id', imageId);
        if (error) return { success: false, message: error.message };

        if (img?.console_id) {
            const { data: c } = await supabase
                .from('consoles')
                .select('slug, status')
                .eq('id', img.console_id)
                .maybeSingle();
            if (c?.status === 'published' && c.slug) revalidatePath(`/consoles/${c.slug}`);
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export interface AsinRow {
    variant_id: string;
    variant_name: string | null;
    amazon_asin: string | null;
    console_slug: string;
    console_name: string;
    brand: string | null;
    status: string;
}

/** Admin: every variant with its ASIN, published devices first — the backfill worklist. */
export const fetchAsinWorklist = async (): Promise<AsinRow[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('console_variants')
            .select('id, variant_name, amazon_asin, consoles!inner(slug, name, status, manufacturer:manufacturer_id(name))')
            .order('variant_name');

        if (error) { console.error('[API] fetchAsinWorklist:', error.message); return []; }

        return (data || []).map((v: any) => ({
            variant_id: v.id,
            variant_name: v.variant_name,
            amazon_asin: v.amazon_asin,
            console_slug: v.consoles?.slug,
            console_name: v.consoles?.name,
            brand: v.consoles?.manufacturer?.name ?? null,
            status: v.consoles?.status,
        }));
    } catch (e: any) {
        console.error('[API] fetchAsinWorklist exception:', e?.message);
        return [];
    }
};

/** Admin: set or clear a variant's Amazon ASIN. */
export const setVariantAsin = async (
    variantId: string,
    asin: string | null
): Promise<{ success: boolean; message?: string }> => {
    const clean = asin?.trim().toUpperCase() || null;
    // Amazon ASINs are 10 alphanumeric characters. Rejecting anything else here stops a
    // pasted URL or partial code from silently producing a dead product link.
    if (clean && !/^[A-Z0-9]{10}$/.test(clean)) {
        return { success: false, message: 'ASIN must be exactly 10 letters or digits.' };
    }
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('console_variants')
            .update({ amazon_asin: clean })
            .eq('id', variantId);
        if (error) return { success: false, message: error.message };

        const { data: v } = await supabase
            .from('console_variants')
            .select('consoles!inner(slug, status)')
            .eq('id', variantId)
            .maybeSingle();
        const c: any = (v as any)?.consoles;
        if (c?.status === 'published' && c.slug) revalidatePath(`/consoles/${c.slug}`);

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

// --- Buy-link worklist -------------------------------------------------------------

export interface BuyLinkRow {
    console_id: string;
    slug: string;
    name: string;
    brand: string | null;
    status: string;
    has_asin: boolean;
    vendor_count: number;
}

/**
 * Admin: published consoles first, worst-off first — the ones with no buy path at all.
 *
 * The spreadsheet import attached 1,332 vendor links, but every one landed on a DRAFT
 * console. None of the published pages gained a buy path from it, so this list is how the
 * live pages get one.
 */
export const fetchBuyLinkWorklist = async (): Promise<BuyLinkRow[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('consoles')
            .select(`id, slug, name, status,
                     manufacturer:manufacturer_id(name),
                     console_links(id, kind),
                     console_variants(amazon_asin)`);

        if (error) { console.error('[API] fetchBuyLinkWorklist:', error.message); return []; }

        const rows: BuyLinkRow[] = (data || []).map((c: any) => ({
            console_id: c.id,
            slug: c.slug,
            name: c.name,
            brand: c.manufacturer?.name ?? null,
            status: c.status,
            has_asin: (c.console_variants || []).some((v: any) => !!v.amazon_asin),
            vendor_count: (c.console_links || []).filter((l: any) => l.kind === 'vendor').length,
        }));

        // Published-and-empty is the only group costing money today; everything else follows.
        const rank = (r: BuyLinkRow) =>
            r.status === 'published' && !r.has_asin && r.vendor_count === 0 ? 0
            : r.status === 'published' ? 1
            : 2;
        return rows.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
    } catch (e: any) {
        console.error('[API] fetchBuyLinkWorklist exception:', e?.message);
        return [];
    }
};

/** Admin: attach a vendor link to a console. */
export const addConsoleVendorLink = async (
    consoleId: string,
    url: string,
    label: string
): Promise<{ success: boolean; message?: string }> => {
    const clean = url.trim();
    if (!/^https?:\/\/\S+$/i.test(clean)) {
        return { success: false, message: 'Enter a full http(s) URL.' };
    }
    // The sheets arrived carrying other people's affiliate IDs. Refuse to store one rather
    // than silently hand our outbound clicks to somebody else's account.
    if (/[?&](tag|aff|affiliate_id|clickid|irclickid|custlinkid|pubid|publisher)=/i.test(clean)
        || /(s\.click\.aliexpress|rover\.ebay|affiliate-transfer|amzn\.to)/i.test(clean)) {
        return {
            success: false,
            message: 'That URL carries affiliate tracking. Paste the plain product URL — the site adds our own tag.',
        };
    }

    try {
        const supabase = await createClient();
        const { data: last } = await supabase
            .from('console_links')
            .select('sort_order')
            .eq('console_id', consoleId)
            .order('sort_order', { ascending: false })
            .limit(1)
            .maybeSingle();

        const { error } = await supabase.from('console_links').insert([{
            console_id: consoleId,
            kind: 'vendor',
            url: clean,
            label: label.trim() || null,
            sort_order: (last?.sort_order ?? -1) + 1,
        }]);
        if (error) return { success: false, message: error.message };

        const { data: c } = await supabase
            .from('consoles')
            .select('slug, status')
            .eq('id', consoleId)
            .maybeSingle();
        if (c?.status === 'published' && c.slug) revalidatePath(`/consoles/${c.slug}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
