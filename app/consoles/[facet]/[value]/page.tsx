import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAnon } from '../../../../lib/supabase/anon';
import { FACETS, getFacet, fetchFacetValues, fetchAllFacetPaths, type FacetDef } from '../../../../lib/config/facets';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
    return fetchAllFacetPaths();
}

/** Published consoles whose default variant matches this facet value. */
async function fetchMatches(facet: FacetDef, value: string) {
    const { data, error } = await supabaseAnon
        .from('console_variants')
        .select(`
            ${facet.column}, price_avg_usd, price_launch_usd, ram_mb, screen_size_inch, soc_name,
            console:consoles!inner(id, name, slug, image_url, status, manufacturer:manufacturer(name))
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
            });
        }
    }
    const rows = Array.from(byConsole.values()).sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    return { rows, label };
}

export async function generateMetadata(props: { params: Promise<{ facet: string; value: string }> }): Promise<Metadata> {
    const { facet: facetSlug, value } = await props.params;
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

export default async function FacetPage(props: { params: Promise<{ facet: string; value: string }> }) {
    const { facet: facetSlug, value } = await props.params;
    const facet = getFacet(facetSlug);
    if (!facet) notFound();

    const { rows, label } = await fetchMatches(facet, value);
    if (rows.length === 0) notFound();

    // Sibling values, so each page links onward rather than being a leaf.
    const siblings = (await fetchFacetValues(facet)).filter(v => v.param !== value).slice(0, 12);

    return (
        <div className="w-full min-h-screen bg-[#09090b] text-white pb-20">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6">
                <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
                    <ol className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                        <li><Link href="/consoles" className="text-gray-500 hover:text-white transition-colors">Vault</Link></li>
                        <li className="flex items-center gap-1.5" aria-current="page">
                            <span className="text-gray-700" aria-hidden="true">&rsaquo;</span>
                            <span className="text-gray-300">{facet.toLabel(value)}</span>
                        </li>
                    </ol>
                </nav>

                <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                    {rows.length} device{rows.length === 1 ? '' : 's'} &middot; by {facet.label}
                </div>
                <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-white uppercase leading-tight tracking-tight mb-4">
                    {facet.title(label)}
                </h1>
                <p className="font-sans text-sm text-gray-400 max-w-[68ch] mb-10">
                    {facet.description(label, rows.length)}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--rc-hair)] border border-white/10">
                    {rows.map(r => (
                        <Link key={r.id} href={`/consoles/${r.slug}`} className="rc-cell group block p-3 hover:bg-white/[0.03] transition-colors">
                            <div className="rc-bed relative h-[110px] flex items-center justify-center border border-white/[0.07] mb-2.5">
                                {r.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={r.image} alt="" loading="lazy" decoding="async"
                                         className="max-h-[85%] max-w-[85%] object-contain opacity-85 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <span className="font-pixel text-lg text-zinc-800">?</span>
                                )}
                            </div>
                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-600 truncate">{r.brand || 'Unknown'}</div>
                            <div className="font-mono text-[12.5px] text-white truncate mt-0.5 group-hover:text-violet-300 transition-colors">{r.name}</div>
                            <div className="flex items-baseline justify-between gap-2 mt-2">
                                <span className="font-mono text-[13px] font-bold text-emerald-400 tabular-nums">
                                    {r.price > 0 ? `$${r.price}` : <span className="text-gray-700">&mdash;</span>}
                                </span>
                                {r.ram > 0 && (
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-gray-600">
                                        {r.ram >= 1024 ? `${Math.round(r.ram / 1024)} GB` : `${r.ram} MB`}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {siblings.length > 0 && (
                    <div className="rc-rule-top pt-[18px] mt-16">
                        <h2 className="font-pixel text-[13px] md:text-[15px] text-violet-500 uppercase tracking-widest mb-5">
                            Other {facet.label}s
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {siblings.map(sib => (
                                <Link key={sib.param} href={`/consoles/${facet.slug}/${sib.param}`}
                                      className="flex items-baseline gap-2 border border-white/10 px-3 py-2 font-mono text-[11px]
                                                 text-gray-400 hover:border-violet-500/60 hover:text-violet-300 transition-colors">
                                    {sib.label}
                                    <span className="text-[9px] text-gray-600 tabular-nums">{sib.count}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="rc-rule-top pt-[18px] mt-16">
                    <h2 className="font-pixel text-[13px] md:text-[15px] text-violet-500 uppercase tracking-widest mb-5">Browse by</h2>
                    <div className="flex flex-wrap gap-2">
                        {FACETS.filter(f => f.slug !== facet.slug).map(f => (
                            <Link key={f.slug} href="/consoles"
                                  className="border border-white/10 px-3 py-2 font-mono text-[11px] uppercase tracking-wider
                                             text-gray-400 hover:border-white hover:text-white transition-colors">
                                {f.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
