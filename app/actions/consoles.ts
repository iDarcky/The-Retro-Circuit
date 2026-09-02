"use server";

import { createClient } from "../../lib/supabase/server";
import { siteConfig } from '../../config/site';
import { submitToIndexNow } from "../../lib/indexnow";
import { supabaseAnon } from "../../lib/supabase/anon";
import { ConsoleDetails, ConsoleVariant, VariantInputProfile } from "../../lib/types";
import { normalizeConsoleList, normalizeVariant } from "../../lib/normalize";
import { revalidatePath } from "next/cache";

/**
 * Refresh every cached surface that renders a console's *own* content.
 *
 * Public pages are `revalidate = false`, so nothing regenerates on a timer — an edit
 * stays invisible until each surface is explicitly invalidated. This is the cheap set
 * and it runs on every save, not just on publish: the previous version only refreshed
 * the detail page unless the status flipped to `published`, so a spec or image change
 * on an already-published console never reached `/consoles`, the homepage or the
 * brand page.
 *
 * The OG card is its own route segment and has its own cache entry, so a changed
 * image or name needs it invalidated separately or social previews stay stale.
 */
function revalidateConsoleContent(slug?: string | null, manufacturerSlug?: string | null) {
    if (!slug) return;

    revalidatePath(`/consoles/${slug}`);
    revalidatePath(`/consoles/${slug}/opengraph-image`);
    revalidatePath('/consoles');
    revalidatePath('/');
    if (manufacturerSlug) {
        revalidatePath('/fabricators');
        revalidatePath(`/fabricators/${manufacturerSlug}`);
    }
}

/**
 * Refresh the derived collections a console is ranked or grouped into.
 *
 * These enumerate the whole catalogue, so they are addressed by route pattern rather
 * than by URL — one call marks every prebuilt instance stale and each regenerates
 * lazily on its next request. That is why this is safe to call on an ordinary save:
 * the cost lands on the next reader, not on the admin write.
 */
function revalidateCatalogueCollections() {
    revalidatePath('/best/[slug]', 'page');
    revalidatePath('/consoles/[facet]/[value]', 'page');
    revalidatePath('/arena/[[...versus]]', 'page');
}

/**
 * Everything above, plus the search-engine surfaces. Reserved for changes that alter
 * which URLs exist — publish, unpublish, slug change, delete.
 *
 * `/sitemap.xml` matters most: it is how Google discovers the URL at all. IndexNow
 * only reaches Bing/Yandex, so without this a publish never reaches Google until the
 * next deploy.
 */
async function revalidateConsoleSurfaces(slug?: string | null, manufacturerSlug?: string | null) {
    if (!slug) return;

    revalidateConsoleContent(slug, manufacturerSlug);
    revalidateCatalogueCollections();
    revalidatePath('/sitemap.xml');

    const base = siteConfig.url;
    const urls = [`${base}/consoles/${slug}`, `${base}/consoles`, `${base}/sitemap.xml`];
    if (manufacturerSlug) urls.push(`${base}/fabricators/${manufacturerSlug}`);
    await submitToIndexNow(urls);
}

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
                // Specs live on the variant, so a new configuration changes the console's
                // listing card and its ranking in every derived collection, not just its
                // detail page.
                revalidateConsoleContent(parentConsole.slug, (parentConsole.manufacturer as any)?.slug);
                revalidateCatalogueCollections();
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
        const parentConsole = updatedVariant?.consoles as any;
        if (parentConsole?.slug) {
            // This is the path most edits take — screen, chip, price and emulation grades
            // are all variant columns, and they feed the listing card, the OG image and
            // the ranked collections as well as the detail page.
            revalidateConsoleContent(parentConsole.slug, parentConsole.manufacturer?.slug);
            revalidateCatalogueCollections();
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

/**
 * Delete one variant.
 *
 * Refuses to remove the last variant of a console: a console with no variant has no
 * specs at all and renders as an empty page, which is worse than a stale one. Delete
 * the console instead. `variant_input_profile` and `emulation_profiles` both cascade
 * on the foreign key, so there is nothing else to clean up.
 */
export const deleteConsoleVariant = async (id: string): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();

        const { data: variant, error: fetchError } = await supabase
            .from('console_variants')
            .select('console_id, variant_name, is_default')
            .eq('id', id)
            .single();
        if (fetchError) return { success: false, message: fetchError.message };

        const { count, error: countError } = await supabase
            .from('console_variants')
            .select('id', { count: 'exact', head: true })
            .eq('console_id', variant.console_id);
        if (countError) return { success: false, message: countError.message };
        if ((count ?? 0) <= 1) {
            return { success: false, message: 'This is the only variant. Delete the console instead.' };
        }

        const { error } = await supabase.from('console_variants').delete().eq('id', id);
        if (error) return { success: false, message: error.message };

        // Promote another variant so the console still has a default to render.
        if (variant.is_default) {
            const { data: next } = await supabase
                .from('console_variants')
                .select('id')
                .eq('console_id', variant.console_id)
                .order('created_at', { ascending: true })
                .limit(1)
                .maybeSingle();
            if (next?.id) {
                await supabase.from('console_variants').update({ is_default: true }).eq('id', next.id);
            }
        }

        const { data: parent } = await supabase
            .from('consoles').select('slug, manufacturer:manufacturer(slug)').eq('id', variant.console_id).maybeSingle();
        if (parent?.slug) {
            revalidateConsoleContent(parent.slug, (parent.manufacturer as any)?.slug);
            revalidateCatalogueCollections();
        }

        return { success: true, message: `Deleted "${variant.variant_name}".` };
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
        // A gallery image can become the card image and the OG card, so refresh the
        // listing surfaces too, not just the detail page.
        if (c?.status === 'published' && c.slug) {
            revalidateConsoleContent(c.slug, (c.manufacturer as any)?.slug);
        }
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
                .select('slug, status, manufacturer:manufacturer_id(slug)')
                .eq('id', img.console_id)
                .maybeSingle();
            if (c?.status === 'published' && c.slug) {
                revalidateConsoleContent(c.slug, (c.manufacturer as any)?.slug);
            }
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
        // Buy paths render on the arena bar and the buying guides as well as the
        // console page, so the ranked collections have to go stale with it.
        if (c?.status === 'published' && c.slug) {
            revalidatePath(`/consoles/${c.slug}`);
            revalidateCatalogueCollections();
        }

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
            // Typed in by hand, so it is approved by the act of adding it. Only the
            // spreadsheet import lands unapproved.
            approved: true,
            approved_at: new Date().toISOString(),
        }]);
        if (error) return { success: false, message: error.message };

        const { data: c } = await supabase
            .from('consoles')
            .select('slug, status')
            .eq('id', consoleId)
            .maybeSingle();
        // Buy paths render on the arena bar and the buying guides as well as the
        // console page, so the ranked collections have to go stale with it.
        if (c?.status === 'published' && c.slug) {
            revalidatePath(`/consoles/${c.slug}`);
            revalidateCatalogueCollections();
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
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

/* ---------------------------------------------------------------------------
 * LINK REVIEW
 *
 * Every console_links row arrived with a spreadsheet import: 821 video reviews pointing
 * at other people's channels, 433 vendor links, 78 written reviews. None of it was
 * chosen. The public pages now render only what someone has greenlit, and this is where
 * the greenlighting happens.
 * ------------------------------------------------------------------------- */

export interface LinkReviewRow {
    id: string;
    kind: string;
    url: string;
    label: string | null;
    approved: boolean;
    domain: string;
}

export interface LinkReviewConsole {
    id: string;
    name: string;
    slug: string;
    status: string;
    brand: string;
    links: LinkReviewRow[];
    approvedCount: number;
}

const domainOf = (url: string): string => {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return '—'; }
};

/**
 * Every console that has imported links, with the links themselves.
 *
 * Published consoles first, then most links: the pages that are live and showing nothing
 * are the ones worth triaging first.
 */
export const fetchLinkReview = async (): Promise<LinkReviewConsole[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('consoles')
            .select(`
                id, name, slug, status,
                manufacturer:manufacturer(name),
                console_links(id, kind, url, label, approved, sort_order)
            `)
            .order('name');
        if (error) throw error;

        const rows: LinkReviewConsole[] = (data || [])
            .map((c: any) => {
                const mfg = Array.isArray(c.manufacturer) ? c.manufacturer[0] : c.manufacturer;
                const links: LinkReviewRow[] = (c.console_links || [])
                    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                    .map((l: any) => ({
                        id: l.id,
                        kind: String(l.kind),
                        url: l.url,
                        label: l.label,
                        approved: Boolean(l.approved),
                        domain: domainOf(l.url),
                    }));
                return {
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    status: c.status ?? 'draft',
                    brand: mfg?.name ?? '',
                    links,
                    approvedCount: links.filter(l => l.approved).length,
                };
            })
            .filter(c => c.links.length > 0);

        const rank = (s: string) => (s === 'published' ? 0 : s === 'review' ? 1 : 2);
        rows.sort((a, b) => rank(a.status) - rank(b.status) || b.links.length - a.links.length);
        return rows;
    } catch (e: any) {
        console.error('[API] fetchLinkReview error:', e?.message ?? e);
        return [];
    }
};

/** Greenlight or pull one link. Revalidates the console page when it is live. */
export const setLinkApproval = async (
    linkId: string,
    approved: boolean,
): Promise<{ success: boolean; message?: string }> => {
    try {
        const supabase = await createClient();
        const { data: link, error: fetchError } = await supabase
            .from('console_links')
            .select('console_id')
            .eq('id', linkId)
            .single();
        if (fetchError) return { success: false, message: fetchError.message };

        const { error } = await supabase
            .from('console_links')
            .update({ approved, approved_at: approved ? new Date().toISOString() : null })
            .eq('id', linkId);
        if (error) return { success: false, message: error.message };

        const { data: c } = await supabase
            .from('consoles').select('slug, status').eq('id', link.console_id).maybeSingle();
        // Buy paths render on the arena bar and the buying guides as well as the
        // console page, so the ranked collections have to go stale with it.
        if (c?.status === 'published' && c.slug) {
            revalidatePath(`/consoles/${c.slug}`);
            revalidateCatalogueCollections();
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

/** Approve or pull every link on one console at once. */
export const setConsoleLinksApproval = async (
    consoleId: string,
    approved: boolean,
    kind?: string,
): Promise<{ success: boolean; message?: string }> => {
    try {
        const supabase = await createClient();
        let q = supabase
            .from('console_links')
            .update({ approved, approved_at: approved ? new Date().toISOString() : null })
            .eq('console_id', consoleId);
        if (kind) q = q.eq('kind', kind);
        const { error } = await q;
        if (error) return { success: false, message: error.message };

        const { data: c } = await supabase
            .from('consoles').select('slug, status').eq('id', consoleId).maybeSingle();
        // Buy paths render on the arena bar and the buying guides as well as the
        // console page, so the ranked collections have to go stale with it.
        if (c?.status === 'published' && c.slug) {
            revalidatePath(`/consoles/${c.slug}`);
            revalidateCatalogueCollections();
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
