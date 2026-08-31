import { supabaseAnon } from '../supabase/anon';

/* Which comparison pages to build ahead of time.
 *
 * Arena produces ~70% of non-brand clicks off 15 pages, but nothing generated them:
 * the route had no generateStaticParams and the sitemap listed only the bare /arena hub,
 * so a comparison existed only after somebody had already found it. This module is the
 * single pair list, used by both the route and the sitemap so they cannot drift.
 *
 * Not the full cross product. 76 published consoles is 2,850 pairs, almost all of them
 * nonsense ("Steam Deck vs SF2000") that would bury the useful ones in thin duplicates.
 * Four rules, each matching a way people actually shop:
 *
 *   1. Successive devices from one brand      "Pocket 5 vs Pocket 6"
 *   2. Any two recent devices from one brand  "Odin 2 Mini vs Odin 3"
 *   3. Cross-brand at a comparable price      "Pocket 6 vs Odin 3"
 *   4. Pairs named in Search Console
 *
 * Slugs are emitted alphabetically sorted, matching the canonical the page already sets.
 */

/** Pairs the query data names outright. Kept first so they always survive the cap. */
const SEARCHED_PAIRS: [string, string][] = [
    ['ayn-odin-2-mini', 'ayn-odin-3'],
    ['ayaneo-pocket-s-1080p', 'ayn-odin-3'],
    ['retroid-pocket-2', 'retroid-pocket-2-plus'],
    ['retroid-pocket-mini', 'retroid-pocket-mini-v2'],
    ['ayn-odin-3', 'ayn-odin-2-portal'],
    ['ayaneo-pocket-s2', 'ayn-odin-3'],
];

/** How many of a brand's newest devices get compared against each other. */
const RECENT_PER_BRAND = 6;
/** A cross-brand pair only makes sense inside this price band. */
const PRICE_TOLERANCE = 0.3;
/* Hard ceiling, so a growing catalogue cannot explode the build.
 *
 * At 76 published consoles the rules produce 459 pairs: 113 within-brand and 346
 * cross-brand. The cap is a safety valve for growth, not a quality filter, so it sits
 * above that. Insertion order is searched -> within-brand -> cross-brand, so if it ever
 * does bite it drops the weakest pairs first. */
const MAX_PAIRS = 600;

interface PairRow {
    slug: string;
    brand: string;
    price: number | null;
    released: string | null;
}

const key = (a: string, b: string) => [a, b].sort().join('-vs-');

export async function fetchArenaPairs(): Promise<string[]> {
    const pairs = new Set<string>();
    for (const [a, b] of SEARCHED_PAIRS) pairs.add(key(a, b));

    try {
        const { data, error } = await supabaseAnon
            .from('consoles')
            .select('slug, manufacturer:manufacturer(name), variants:console_variants(price_launch_usd, price_avg_usd, release_date)')
            .eq('status', 'published');
        if (error) throw error;

        const rows: PairRow[] = (data || []).map((c: any) => {
            const variants = c.variants || [];
            const prices = variants
                .map((v: any) => v.price_avg_usd || v.price_launch_usd || 0)
                .filter((p: number) => p > 0);
            const dates = variants.map((v: any) => v.release_date).filter(Boolean).sort();
            const mfg = Array.isArray(c.manufacturer) ? c.manufacturer[0] : c.manufacturer;
            return {
                slug: c.slug,
                brand: mfg?.name || 'unknown',
                price: prices.length ? Math.min(...prices) : null,
                released: dates[0] || null,
            };
        }).filter((r: PairRow) => Boolean(r.slug));

        // --- 1 & 2: within a brand, newest first.
        const byBrand = new Map<string, PairRow[]>();
        for (const r of rows) {
            if (!byBrand.has(r.brand)) byBrand.set(r.brand, []);
            byBrand.get(r.brand)!.push(r);
        }

        for (const list of byBrand.values()) {
            // Undated devices sort last rather than as year zero.
            const sorted = [...list].sort((a, b) => (b.released || '').localeCompare(a.released || ''));

            // Successive generations, the most searched shape of comparison.
            for (let i = 0; i + 1 < sorted.length; i++) {
                pairs.add(key(sorted[i].slug, sorted[i + 1].slug));
            }

            // Every combination among the newest few, where buying interest sits.
            const recent = sorted.slice(0, RECENT_PER_BRAND);
            for (let i = 0; i < recent.length; i++) {
                for (let j = i + 1; j < recent.length; j++) {
                    pairs.add(key(recent[i].slug, recent[j].slug));
                }
            }
        }

        // --- 3: cross-brand, but only where the price makes them genuine alternatives.
        const priced = rows.filter(r => r.price && r.price > 0);
        for (let i = 0; i < priced.length; i++) {
            for (let j = i + 1; j < priced.length; j++) {
                const a = priced[i], b = priced[j];
                if (a.brand === b.brand) continue;
                const lo = Math.min(a.price!, b.price!);
                const hi = Math.max(a.price!, b.price!);
                if ((hi - lo) / lo <= PRICE_TOLERANCE) pairs.add(key(a.slug, b.slug));
            }
        }
    } catch (e: any) {
        // A failure here must not break the build: the searched pairs still ship, and
        // anything omitted is still rendered on demand because dynamicParams stays on.
        console.error('[arena] pair generation failed:', e?.message ?? e);
    }

    return Array.from(pairs).slice(0, MAX_PAIRS);
}
