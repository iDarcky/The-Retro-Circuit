'use server';

import { createClient } from '../../lib/supabase/server';

/* Gap counts for the admin hub.
 *
 * Same definition of "gap" the console index uses, computed once for the whole
 * catalogue so the hub can say what is blocking work instead of listing links.
 * Admin-only and behind the middleware role check, so it uses the cookie-aware
 * server client and never touches a public page. */

export type GapKey = 'NO_IMAGE' | 'NO_VARIANT' | 'NO_PRICE' | 'READY' | 'RELEASE_PASSED';

export interface WorklistRow {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    gaps: string[];
    releaseDate?: string | null;
}

export interface AdminDashboard {
    totals: { consoles: number; published: number; draft: number; variants: number };
    gaps: Record<GapKey, number>;
    revenue: { variantsWithAsin: number; variantsTotal: number; publishedWithoutBuyPath: number };
    ready: WorklistRow[];
    imageOnly: WorklistRow[];
    releasePassed: WorklistRow[];
}

type Row = {
    id: string;
    name: string;
    slug: string;
    status: string | null;
    image_url: string | null;
    release_status: string | null;
    manufacturer: { name: string } | { name: string }[] | null;
    variants: {
        id: string;
        image_url: string | null;
        price_launch_usd: number | null;
        price_avg_usd: number | null;
        amazon_asin: string | null;
        release_date: string | null;
    }[] | null;
};

const brandOf = (m: Row['manufacturer']): string | null =>
    Array.isArray(m) ? (m[0]?.name ?? null) : (m?.name ?? null);

/** A console's unmet publish conditions. Mirrors getGaps() in ConsoleIndexClient,
 *  except price also counts the street price the importer wrote. */
function gapsFor(c: Row): string[] {
    const gaps: string[] = [];
    const variants = c.variants || [];
    const hasImage = Boolean(c.image_url) || variants.some(v => v.image_url);
    if (!hasImage) gaps.push('IMAGE');
    if (variants.length === 0) gaps.push('VARIANT');
    else if (!variants.some(v => (v.price_launch_usd ?? 0) > 0 || (v.price_avg_usd ?? 0) > 0)) gaps.push('PRICE');
    return gaps;
}

const toRow = (c: Row, gaps: string[]): WorklistRow => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    brand: brandOf(c.manufacturer),
    gaps,
});

const EMPTY: AdminDashboard = {
    totals: { consoles: 0, published: 0, draft: 0, variants: 0 },
    gaps: { NO_IMAGE: 0, NO_VARIANT: 0, NO_PRICE: 0, READY: 0, RELEASE_PASSED: 0 },
    revenue: { variantsWithAsin: 0, variantsTotal: 0, publishedWithoutBuyPath: 0 },
    ready: [],
    imageOnly: [],
    releasePassed: [],
};

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('consoles')
            .select(`
                id, name, slug, status, image_url, release_status,
                manufacturer:manufacturer(name),
                variants:console_variants(id, image_url, price_launch_usd, price_avg_usd, amazon_asin, release_date)
            `)
            .order('name');

        if (error) throw error;
        const rows = (data || []) as unknown as Row[];

        const today = new Date().toISOString().slice(0, 10);

        const totals = { consoles: rows.length, published: 0, draft: 0, variants: 0 };
        const gaps: Record<GapKey, number> = { NO_IMAGE: 0, NO_VARIANT: 0, NO_PRICE: 0, READY: 0, RELEASE_PASSED: 0 };
        const revenue = { variantsWithAsin: 0, variantsTotal: 0, publishedWithoutBuyPath: 0 };

        const ready: WorklistRow[] = [];
        const imageOnly: WorklistRow[] = [];
        const releasePassed: WorklistRow[] = [];

        for (const c of rows) {
            const variants = c.variants || [];
            totals.variants += variants.length;
            revenue.variantsTotal += variants.length;
            revenue.variantsWithAsin += variants.filter(v => v.amazon_asin).length;

            const isPublished = c.status === 'published';
            if (isPublished) {
                totals.published += 1;
                if (!variants.some(v => v.amazon_asin)) revenue.publishedWithoutBuyPath += 1;
            }

            // An Upcoming console whose earliest dated variant has shipped. Surfaced
            // rather than flipped automatically: public pages are statically rendered,
            // so a silent status change would not reach the site until a rebuild.
            if (c.release_status === 'upcoming') {
                const shipped = variants
                    .map(v => v.release_date)
                    .filter((d): d is string => Boolean(d) && d! <= today)
                    .sort()[0];
                if (shipped) {
                    gaps.RELEASE_PASSED += 1;
                    releasePassed.push({ ...toRow(c, []), releaseDate: shipped });
                }
            }

            // Gap counts describe the draft backlog; a published console has no gap left
            // to close by definition.
            if (isPublished) continue;
            totals.draft += 1;

            const g = gapsFor(c);
            if (g.includes('IMAGE')) gaps.NO_IMAGE += 1;
            if (g.includes('VARIANT')) gaps.NO_VARIANT += 1;
            if (g.includes('PRICE')) gaps.NO_PRICE += 1;

            if (g.length === 0) {
                gaps.READY += 1;
                if (ready.length < 12) ready.push(toRow(c, g));
            } else if (g.length === 1 && g[0] === 'IMAGE' && imageOnly.length < 12) {
                imageOnly.push(toRow(c, g));
            }
        }

        return { totals, gaps, revenue, ready, imageOnly, releasePassed: releasePassed.slice(0, 12) };
    } catch (e: any) {
        console.error('[API] fetchAdminDashboard error:', e?.message ?? e);
        return EMPTY;
    }
}

/** Flip a console from Upcoming to Released once its date has passed, and purge the
 *  static pages that show the badge. */
export async function markConsoleReleased(id: string): Promise<{ success: boolean; message?: string }> {
    try {
        const supabase = await createClient();

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
            .single();
        if (profile?.role !== 'admin') return { success: false, message: 'Not authorised.' };

        const { error } = await supabase
            .from('consoles')
            .update({ release_status: 'released' })
            .eq('id', id);
        if (error) throw error;

        const { revalidatePath } = await import('next/cache');
        const { data: c } = await supabase.from('consoles').select('slug').eq('id', id).single();
        if (c?.slug) revalidatePath(`/consoles/${c.slug}`);
        revalidatePath('/consoles');
        revalidatePath('/admin');

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e?.message ?? 'Update failed.' };
    }
}

/** Publish several consoles at once from the index. Each goes through updateConsole so
 *  the publish path — sitemap revalidation, IndexNow — runs exactly as it does for one. */
export async function bulkSetConsoleStatus(
    ids: string[],
    status: 'draft' | 'review' | 'published' | 'archived',
): Promise<{ success: boolean; updated: number; failed: string[]; message?: string }> {
    const failed: string[] = [];
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase
            .from('profiles').select('role').eq('id', user?.id ?? '').single();
        if (profile?.role !== 'admin') return { success: false, updated: 0, failed: ids, message: 'Not authorised.' };

        // Sequential rather than parallel: each publish revalidates paths and may ping
        // IndexNow, and a burst of those is worse than a slightly slower loop.
        const { updateConsole } = await import('./consoles');
        let updated = 0;
        for (const id of ids) {
            const res = await updateConsole(id, { status } as any);
            if (res.success) updated += 1; else failed.push(id);
        }

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/admin');
        revalidatePath('/admin/consoles');

        return { success: failed.length === 0, updated, failed };
    } catch (e: any) {
        return { success: false, updated: 0, failed: ids, message: e?.message ?? 'Bulk update failed.' };
    }
}
