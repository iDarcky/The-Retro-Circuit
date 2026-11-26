import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteConfig } from '../../../config/site';
import { fetchAllConsoles } from '../../actions/consoles';
import { BEST_OF_COLLECTIONS, getCollection, selectForCollection } from '../../../lib/bestof/collections';
import { getBuyUrl } from '../../../lib/affiliate';
import { pairKey } from '../../../lib/arena/indexable';
import AffiliateLink from '../../../components/console/AffiliateLink';
import { DOT_GRID, GUIDE_COLORS, GUIDE_SYSTEM, SYSTEMS, STATE_COLOR, emuState, priceOf } from '../../../components/best-v2/shared';
import type { ConsoleDetails } from '../../../lib/types';

// Beta mockup of a redesigned buying guide. Served on /best/[slug] in the beta branch through a rewrite.
export const revalidate = false;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return BEST_OF_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const g = getCollection((await props.params).slug);
    return {
        title: { absolute: g ? `${g.title} | The Retro Circuit` : 'Guide not found | The Retro Circuit' },
        robots: { index: false, follow: false },
    };
}

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';

function Ratings({ c, highlight, onColor = false }: { c: ConsoleDetails; highlight?: string; onColor?: boolean }) {
    const rows = SYSTEMS.map((s) => ({ ...s, state: emuState(c, s.key) })).filter((s) => s.state);
    if (!rows.length) return null;
    return (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            {rows.map((s) => (
                <li key={s.key} className={s.key === highlight ? 'bg-white text-black px-1.5' : ''}>
                    <span className={s.key === highlight ? '' : onColor ? 'opacity-70' : 'text-zinc-500'}>{s.label}</span>{' '}
                    <span className={s.key === highlight ? 'font-bold' : onColor ? '' : STATE_COLOR[s.state!] ?? ''}>{s.state}</span>
                </li>
            ))}
        </ul>
    );
}

function Buy({ c, placement, className }: { c: ConsoleDetails; placement: 'best_of'; className: string }) {
    const spec: any = (c as any).specs || {};
    const href = getBuyUrl({ asin: spec.amazon_asin, name: c.name, manufacturer: c.manufacturer?.name });
    if (!href) return null;
    return (
        <AffiliateLink href={href} productName={c.name} linkType={spec.amazon_asin ? 'product' : 'search'} placement={placement} className={className}>
            {spec.amazon_asin ? 'Buy on Amazon' : 'Find on Amazon'}
        </AffiliateLink>
    );
}

export default async function BestPreviewGuide(props: Props) {
    const { slug } = await props.params;
    const g = getCollection(slug);
    if (!g) notFound();
    const idx = BEST_OF_COLLECTIONS.findIndex((x) => x.slug === slug);
    const col = GUIDE_COLORS[idx % 4];
    const sys = GUIDE_SYSTEM[slug];

    let consoles: ConsoleDetails[] = [];
    try { consoles = await fetchAllConsoles(); } catch (e) { console.warn('Build Warning: guide preview', e); }
    const picks = selectForCollection(g, consoles, 10);
    const [top, ...rest] = picks;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: g.title,
        url: `${siteConfig.url}/best/${g.slug}`,
        numberOfItems: picks.length,
        itemListElement: picks.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: [c.manufacturer?.name, c.name].filter(Boolean).join(' '), url: `${siteConfig.url}/consoles/${c.slug}` })),
    };

    return (
        <main className="bg-bg-primary min-h-screen text-text-primary font-sans pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="px-5 md:px-12 pt-10 md:pt-16 pb-8">
                <div className="max-w-[1100px] mx-auto">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                            <li><Link href="/best" className="hover:text-white">Buying guides</Link></li>
                            <li aria-hidden>/</li>
                            <li aria-current="page" className="text-white">{g.shortLabel}</li>
                        </ol>
                    </nav>
                    <p className={`mt-8 font-pixel text-[10px] ${col.text}`}>{new Date().getFullYear()} GUIDE</p>
                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.045em] leading-[1]">{g.title}</h1>
                    <p className="mt-4 text-lg text-text-secondary max-w-[60ch]">{g.description}</p>
                    <p className="mt-6 font-mono text-xs text-zinc-500">Ranked from our spec and emulation data. {picks.length} device{picks.length === 1 ? '' : 's'}.</p>
                </div>
            </header>

            {!top ? (
                <p className="max-w-[1100px] mx-auto border border-white/10 p-10 text-center text-text-secondary">No devices match this guide yet.</p>
            ) : (
                <div className="px-5 md:px-12">
                    <div className="max-w-[1100px] mx-auto">
                        {/* The #1 pick, in the guide's colour */}
                        <article className={`${col.bg} text-white grid sm:grid-cols-[minmax(0,240px)_1fr] gap-6 p-6 md:p-10`} style={DOT_GRID}>
                            <div className="relative aspect-[4/3] sm:aspect-square">
                                {top.image_url && (
                                    <span className="absolute inset-0 motion-safe:animate-[spriteBob_1.6s_steps(2,jump-none)_infinite]">
                                        <Image src={top.image_url} alt={top.name} fill sizes="240px" className="object-contain" priority />
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <span className="inline-block bg-white text-black font-pixel text-[9px] px-2 py-1.5">#1 PICK</span>
                                <p className="mt-4 text-sm opacity-80">{top.manufacturer?.name}</p>
                                <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] leading-[1.02]">{top.name}</h2>
                                {priceOf(top) && <p className="mt-3 font-pixel text-2xl">${priceOf(top)}</p>}
                                <div className="mt-5"><Ratings c={top} highlight={sys} onColor /></div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Buy c={top} placement="best_of" className={`bg-white text-black font-mono text-sm px-5 py-3 hover:bg-black hover:text-white ${focus}`} />
                                    <Link href={`/consoles/${top.slug}`} className={`border border-white/40 font-mono text-sm px-5 py-3 hover:bg-white hover:text-black ${focus}`}>Full specs</Link>
                                </div>
                            </div>
                        </article>

                        {/* The rest of the list */}
                        {rest.length > 0 && (
                            <ol className="mt-2 border border-white/10 divide-y divide-white/10">
                                {rest.map((c, i) => (
                                    <li key={c.id} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_96px_1fr_auto] items-center gap-4 sm:gap-6 p-4 sm:p-5 hover:bg-white/[0.03] transition-colors">
                                        <span className={`w-10 h-10 flex items-center justify-center font-pixel text-xs text-black ${i < 2 ? col.chip : 'bg-white'}`}>{i + 2}</span>
                                        <span className="relative hidden sm:block h-20">{c.image_url && <Image src={c.image_url} alt="" fill sizes="96px" className="object-contain" />}</span>
                                        <div className="min-w-0 col-span-1">
                                            <p className="text-xs text-text-secondary">{c.manufacturer?.name}</p>
                                            <h3 className="text-lg md:text-xl font-bold leading-tight">
                                                <Link href={`/consoles/${c.slug}`} className={`hover:text-violet-300 ${focus}`}>{c.name}</Link>
                                                {priceOf(c) && <span className="ml-3 font-pixel text-sm text-white">${priceOf(c)}</span>}
                                            </h3>
                                            <div className="mt-2"><Ratings c={c} highlight={sys} /></div>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs sm:flex-col sm:items-end">
                                            <Link href={`/arena/${pairKey(top.slug, c.slug)}`} className={`text-violet-400 hover:text-white ${focus}`}>Compare with #1</Link>
                                            <Buy c={c} placement="best_of" className={`text-text-secondary hover:text-white ${focus}`} />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}

                        <p className="mt-6 text-center font-mono text-[11px] text-zinc-600">As an Amazon Associate I earn from qualifying purchases.</p>

                        {/* Other guides */}
                        <section className="mt-16">
                            <h2 className="font-pixel text-base md:text-xl leading-snug text-yellow-400">More guides</h2>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {BEST_OF_COLLECTIONS.filter((x) => x.slug !== slug).map((x) => {
                                    const c2 = GUIDE_COLORS[BEST_OF_COLLECTIONS.indexOf(x) % 4];
                                    return (
                                        <Link key={x.slug} href={`/best/${x.slug}`} className={`inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white hover:text-black transition-colors ${focus}`}>
                                            <span className={`w-2 h-2 ${c2.chip}`} />{x.shortLabel}
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="mt-10 border border-white/10 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <p className="text-lg">Not sure which of these fits you?</p>
                                <Link href="/finder" className={`bg-white text-black font-mono text-sm px-6 py-3 hover:bg-violet-500 hover:text-white self-start ${focus}`}>Ask the Finder</Link>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </main>
    );
}
