"use server";

/**
 * Everything that puts a buy path on a console: Amazon ASINs, vendor links, and the
 * approval queue for the imported console_links rows, which default to unapproved and
 * render nowhere until someone greenlights them at /admin/revenue.
 */

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { revalidateCatalogueCollections } from "../../lib/revalidate-console";

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
/**
 * Every link on one console, for the buy-path panel in its editor.
 *
 * The three commerce screens are catalogue-wide sweeps — they answer "which of the 462
 * consoles still needs work". This answers "what does THIS console have", which is the
 * question you actually have while editing one, and which nothing could answer before.
 */
export const fetchConsoleLinks = async (consoleId: string): Promise<LinkReviewRow[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('console_links')
            .select('id, kind, url, label, approved, sort_order')
            .eq('console_id', consoleId)
            .order('approved', { ascending: false })
            .order('sort_order', { ascending: true });
        if (error) throw error;

        return (data ?? []).map((l: any) => ({
            id: l.id,
            kind: l.kind,
            url: l.url,
            label: l.label,
            approved: Boolean(l.approved),
            domain: domainOf(l.url),
        }));
    } catch (e: any) {
        console.error('[API] fetchConsoleLinks error:', e?.message ?? e);
        return [];
    }
};

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
