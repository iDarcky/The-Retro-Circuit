import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * The facet landing page body, shared by /consoles/chip, /consoles/os and
 * /consoles/vendor.
 *
 * These used to be one route, `app/consoles/[facet]/[value]`, sitting beside
 * `app/consoles/[slug]`. Next.js forbids two dynamic segments with different names at
 * the same position — "You cannot use different slug names for the same dynamic path
 * ('facet' !== 'slug')" — and it threw that at request time across the whole /consoles
 * tree, the homepage and /arena.
 *
 * `chip`, `os` and `vendor` are literal strings, so making them static segments removes
 * the conflict and keeps every URL byte-identical. Adding a fourth facet means adding a
 * folder here as well as an entry in lib/config/facets.ts — the cost of the fix, and
 * cheap against a site-wide 500.
 */
import DeviceCard from '../browse-v2/DeviceCard';
import { supabaseAnon } from '../../lib/supabase/anon';
import { FACETS, getFacet, fetchFacetValues, type FacetDef } from '../../lib/config/facets';

/** Published consoles whose default variant matches this facet value. */
async function fetchMatches(facet: FacetDef, value: string) {
    const { data, error } = await supabaseAnon
        .from('console_variants')
        .select(`
            ${facet.column}, price_avg_usd, price_launch_usd, ram_mb, screen_size_inch, soc_name, os_family, release_date,
            console:consoles!inner(id, name, slug, image_url, status, form_factor, manufacturer:manufacturer(name))
        `)
        .eq('console.status', 'published')
        .not(facet.column, 'is', null);
    if (error) throw error;

    const byConsole = new Map<string, any>();
    let label = '';
    for (const row of (data || []) as any[]) {
        const raw = String(row[facet.column] ?? '').trim();
        if (!raw || facet.toParam(raw) !== value) continue;
        label ||= facet.toLabel(raw);
        const c = Array.isArray(row.console) ? row.console[0] : row.console;
        if (!c?.id) continue;
        const price = row.price_avg_usd || row.price_launch_usd || 0;
        const existing = byConsole.get(c.id);
        // Cheapest configuration represents the device in a listing.
        if (!existing || (price > 0 && price < existing.price)) {
            const mfg = Array.isArray(c.manufacturer) ? c.manufacturer[0] : c.manufacturer;
            byConsole.set(c.id, {
                id: c.id, name: c.name, slug: c.slug, image: c.image_url,
                brand: mfg?.name ?? '', price, ram: row.ram_mb, screen: row.screen_size_inch, soc: row.soc_name,
                shape: c.form_factor ?? null, os: row.os_family ?? null, year: row.release_date ? String(row.release_date).slice(0, 4) : null,
            });
        }
    }
    const rows = Array.from(byConsole.values()).sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    return { rows, label };
}

export async function facetMetadata(facetSlug: string, value: string): Promise<Metadata> {
    const facet = getFacet(facetSlug);
    if (!facet) return { title: 'Not found | The Retro Circuit' };
    try {
        const { rows, label } = await fetchMatches(facet, value);
        if (rows.length === 0) return { title: 'Not found | The Retro Circuit' };
        return {
            title: `${facet.title(label)} | The Retro Circuit`,
            description: facet.description(label, rows.length),
            alternates: { canonical: `/consoles/${facetSlug}/${value}` },
        };
    } catch {
        return { title: 'The Retro Circuit' };
    }
}

export default async function FacetLanding({ facetSlug, value }: { facetSlug: string; value: string }) {
    const facet = getFacet(facetSlug);
    if (!facet) notFound();

    const { rows, label } = await fetchMatches(facet, value);
    if (rows.length === 0) notFound();

    // Sibling values, so each page links onward rather than being a leaf.
    const siblings = (await fetchFacetValues(facet)).filter(v => v.param !== value).slice(0, 12);

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <header className="px-5 md:px-12 pt-10 md:pt-16 pb-8">
                <div className="max-w-[1400px] mx-auto">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                            <li><Link href="/consoles" className="hover:text-white">Every handheld</Link></li>
                            <li aria-hidden>/</li>
                            <li aria-current="page" className="text-white">{label || facet.toLabel(value)}</li>
                        </ol>
                    </nav>
                    <p className="mt-8 font-pixel text-[10px] text-cyan-400">BY {facet.label.toUpperCase()}</p>
                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.045em] leading-[1]">{facet.title(label)}</h1>
                    <p className="mt-4 text-lg text-text-secondary max-w-[60ch]">{facet.description(label, rows.length)}</p>
                    <p className="mt-6 font-mono text-sm"><span className="font-pixel text-white">{rows.length}</span> <span className="text-text-secondary">device{rows.length === 1 ? '' : 's'}, cheapest first</span></p>
                </div>
            </header>

            <section className="px-5 md:px-12" aria-label="Devices">
                <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 border-l border-t border-white/10">
                    {rows.map((r, i) => (
                        <DeviceCard key={r.id} priority={i < 6} d={{ slug: r.slug, name: r.name, brand: r.brand, image: r.image, shape: r.shape, price: r.price >= 20 ? Math.round(r.price) : null, chip: r.soc, screen: r.screen, os: r.os, year: r.year }} />
                    ))}
                </div>
            </section>

            {siblings.length > 0 && (
                <section className="px-5 md:px-12 mt-16">
                    <div className="max-w-[1400px] mx-auto">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em]">Other {facet.label}s</h2>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {siblings.map(sib => (
                                <Link key={sib.param} href={`/consoles/${facet.slug}/${sib.param}`}
                                      className="inline-flex items-baseline gap-2 border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white hover:text-black transition-colors">
                                    {sib.label}
                                    <span className="font-mono text-xs text-zinc-500">{sib.count}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="px-5 md:px-12 mt-12">
                <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-text-secondary mr-2">Browse by</span>
                    {FACETS.filter(f => f.slug !== facet.slug).map(f => (
                        <Link key={f.slug} href="/consoles" className="border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white hover:text-black transition-colors">{f.label}</Link>
                    ))}
                    <Link href="/finder" className="ml-auto bg-violet-500 text-white font-mono text-sm px-4 py-2 hover:bg-white hover:text-black transition-colors">Not sure? Ask the Finder</Link>
                </div>
            </section>
        </main>
    );
}
