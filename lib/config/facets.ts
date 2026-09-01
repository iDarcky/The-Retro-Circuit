import { supabaseAnon } from '../supabase/anon';

/* Facet landing pages: /consoles/chip/snapdragon-8-gen-2, /consoles/os/android.
 *
 * The cheapest indexable inventory a database site has, and the one thing the competition
 * is visibly beating us with. Dozens of pages come out of one route and columns we
 * already hold, each matching a real query shape ("snapdragon 8 gen 2 handhelds") that no
 * console page or comparison answers.
 *
 * Values come from the data, not a hand-kept list, so a new chip gets a page the day a
 * device carrying it is published. A facet value with only one device is skipped: a
 * listing page showing a single result is a worse answer than the console page itself.
 */

export const MIN_DEVICES_PER_FACET = 2;

export interface FacetDef {
    /** URL segment: /consoles/{slug}/... */
    slug: string;
    /** Column on console_variants this reads. */
    column: string;
    /** "Handhelds with a {label}" in copy. */
    label: string;
    title: (value: string) => string;
    description: (value: string, count: number) => string;
    /** Turn a raw column value into a URL segment. */
    toParam: (value: string) => string;
    /** Human form for display. */
    toLabel: (value: string) => string;
}

const kebab = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const titleCase = (v: string) => v.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const FACETS: FacetDef[] = [
    {
        slug: 'chip',
        column: 'soc_name',
        label: 'chipset',
        title: v => `Handhelds with the ${titleCase(v)}`,
        description: (v, n) => `Every retro handheld built on the ${titleCase(v)}. ${n} devices compared on specs, price and measured emulation performance.`,
        toParam: kebab,
        toLabel: titleCase,
    },
    {
        slug: 'os',
        column: 'os_family',
        label: 'operating system',
        title: v => `${titleCase(v)} handhelds`,
        description: (v, n) => `Every retro handheld running ${titleCase(v)}. ${n} devices compared on specs, price and measured emulation performance.`,
        toParam: kebab,
        toLabel: v => (v.toLowerCase() === 'steamos' ? 'SteamOS' : titleCase(v)),
    },
    {
        slug: 'vendor',
        column: 'soc_vendor',
        label: 'silicon vendor',
        title: v => `Handhelds with ${titleCase(v)} silicon`,
        description: (v, n) => `Every retro handheld using a ${titleCase(v)} chipset. ${n} devices compared on specs, price and measured emulation performance.`,
        toParam: kebab,
        toLabel: titleCase,
    },
];

export const getFacet = (slug: string): FacetDef | undefined => FACETS.find(f => f.slug === slug);

export interface FacetValue { param: string; label: string; count: number }

/** Distinct values for one facet that clear the minimum, most populous first. */
export async function fetchFacetValues(facet: FacetDef): Promise<FacetValue[]> {
    try {
        const { data, error } = await supabaseAnon
            .from('console_variants')
            .select(`${facet.column}, console:consoles!inner(id, status)`)
            .eq('console.status', 'published')
            .not(facet.column, 'is', null);
        if (error) throw error;

        // Count consoles, not variants: four configurations of one device is one device.
        const byValue = new Map<string, { label: string; consoles: Set<string> }>();
        for (const row of (data || []) as any[]) {
            const raw = String(row[facet.column] ?? '').trim();
            if (!raw) continue;
            const consoleRow = Array.isArray(row.console) ? row.console[0] : row.console;
            if (!consoleRow?.id) continue;
            const param = facet.toParam(raw);
            if (!param) continue;
            if (!byValue.has(param)) byValue.set(param, { label: facet.toLabel(raw), consoles: new Set() });
            byValue.get(param)!.consoles.add(consoleRow.id);
        }

        return Array.from(byValue.entries())
            .map(([param, v]) => ({ param, label: v.label, count: v.consoles.size }))
            .filter(v => v.count >= MIN_DEVICES_PER_FACET)
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    } catch (e: any) {
        console.error(`[facets] ${facet.slug} values failed:`, e?.message ?? e);
        return [];
    }
}

/** Every facet page that should exist, for generateStaticParams and the sitemap. */
export async function fetchAllFacetPaths(): Promise<{ facet: string; value: string }[]> {
    const out: { facet: string; value: string }[] = [];
    for (const facet of FACETS) {
        const values = await fetchFacetValues(facet);
        for (const v of values) out.push({ facet: facet.slug, value: v.param });
    }
    return out;
}
