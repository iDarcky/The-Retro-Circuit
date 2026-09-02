"use server";

/**
 * Console reads and console-row writes.
 *
 * Split out of a single 1,070-line module that also carried variant CRUD, the image
 * gallery, the ASIN worklist and the link-approval queue — 29 exports, and therefore 29
 * RPC endpoints, in one file. The rest live in variants.ts, images.ts and commerce.ts;
 * app/actions/index.ts re-exports all of them, so no caller changed.
 */

import { createClient } from "../../lib/supabase/server";
import { supabaseAnon } from "../../lib/supabase/anon";
import { ConsoleDetails } from "../../lib/types";
import { normalizeConsoleList } from "../../lib/normalize";
import {
    revalidateConsoleContent,
    revalidateCatalogueCollections,
    revalidateConsoleSurfaces,
} from "../../lib/revalidate-console";


/**
 * Strip joined relations out of a payload bound for `consoles`.
 *
 * The admin form seeds its state with the whole object returned by `fetchConsoleBySlug`
 * — joins included — and posts all of it back. PostgREST rejects the write with
 * "Could not find the 'x' column of 'consoles' in the schema cache", which blocks *every*
 * console edit, not just the field being changed. Adding `links:console_links(*)` to that
 * select did exactly this.
 *
 * A blacklist of relation names alone is what failed: it has to be updated by hand every
 * time a join is added, and forgetting takes the whole admin down. So also drop anything
 * shaped like a relation — an object, or an array of objects. No `consoles` column is
 * jsonb, and `pros`/`cons` are text[], so nothing legitimate matches that test.
 */
const CONSOLE_RELATION_KEYS = ['manufacturer', 'variants', 'specs', 'links', 'gallery', 'images'];

function stripConsoleRelations<T extends Record<string, any>>(payload: T): Partial<T> {
    const clean: Record<string, any> = {};
    const dropped: string[] = [];

    for (const [key, value] of Object.entries(payload)) {
        const isRelationName = CONSOLE_RELATION_KEYS.includes(key);
        const isEmbeddedRow =
            (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) ||
            (Array.isArray(value) && value.some((v) => v !== null && typeof v === 'object'));

        if (isRelationName || isEmbeddedRow) {
            dropped.push(key);
            continue;
        }
        clean[key] = value;
    }

    if (dropped.length && process.env.NODE_ENV !== 'production') {
        console.debug('stripConsoleRelations dropped:', dropped.join(', '));
    }
    return clean as Partial<T>;
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

export const addConsole = async (
    consoleData: Omit<ConsoleDetails, 'id' | 'manufacturer' | 'specs' | 'variants'>
): Promise<{ success: boolean, message?: string, id?: string }> => {
    try {
        const supabase = await createClient();

        // Same guard as updateConsole: the form posts its whole state, and "duplicate this
        // console" seeds that state from a fetched row complete with joins.
        const insertData = stripConsoleRelations(consoleData as any);

        const { data: newConsole, error: consoleError } = await supabase.from('consoles').insert([insertData]).select('id, status, slug, manufacturer:manufacturer_id(slug)').single();
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
        const cleanData = stripConsoleRelations(consoleData as any) as any;


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

        // On a publish this is what puts the URL into the sitemap Google reads. On an
        // ordinary edit the sitemap is unchanged, but every surface that renders the
        // console's content still has to be invalidated or the edit is invisible.
        if (isPublishing && previousStatus !== 'published') {
            await revalidateConsoleSurfaces(cSlug, mSlug);
        } else if (cSlug) {
            revalidateConsoleContent(cSlug, mSlug);
            revalidateCatalogueCollections();
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

/**
 * Newest still-sold device from the same brand.
 *
 * A discontinued console page has no buy path and nothing to click, which makes it a
 * dead end for the reader and worth nothing commercially. This is what they actually
 * came for: the model that replaced it. Anon client, so the page stays static.
 */
export const fetchSuccessor = async (
    manufacturerId: string | null | undefined,
    excludeConsoleId: string,
): Promise<{ name: string; slug: string } | null> => {
    if (!manufacturerId) return null;
    try {
        const { data, error } = await supabaseAnon
            .from('consoles')
            .select('name, slug, variants:console_variants(release_date)')
            .eq('manufacturer_id', manufacturerId)
            .eq('status', 'published')
            .neq('id', excludeConsoleId)
            .neq('release_status', 'discontinued');
        if (error) throw error;

        const dated = (data || []).map((c: any) => ({
            name: c.name,
            slug: c.slug,
            released: (c.variants || [])
                .map((v: any) => v.release_date)
                .filter(Boolean)
                .sort()
                .slice(-1)[0] ?? '',
        }));
        if (dated.length === 0) return null;

        // Newest first; undated sinks rather than winning on an empty string.
        dated.sort((a, b) => (b.released || '').localeCompare(a.released || ''));
        const best = dated[0];
        return best ? { name: best.name, slug: best.slug } : null;
    } catch (e: any) {
        console.error('[API] fetchSuccessor error:', e?.message ?? e);
        return null;
    }
};
