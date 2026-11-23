'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { chipOf, playsByRating, priceOf, ramGb, RATING_LABEL, specList, text, untested, variantLabel } from '../../lib/arena/compare-view';
import { pairKey } from '../../lib/arena/indexable';
import AffiliateLink from '../console/AffiliateLink';
import DevicePicker, { type PickerConsole } from '../arena-v2/DevicePicker';
import type { BuyTarget } from '../../lib/affiliate';

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500';
const H2 = 'text-2xl md:text-4xl font-extrabold tracking-[-0.03em]';
const METER = ['bg-rose-500', 'bg-rose-500', 'bg-orange-500', 'bg-emerald-500', 'bg-emerald-500'];

interface Score {
    score: number;
    reach: number;
    pct: number | null;
    medianScore: number | null;
    pricePct: number | null;
    medianPrice: number | null;
    tierSize: number;
}

function Meter({ rank }: { rank: number }) {
    return (
        <span className="inline-flex gap-[3px]" aria-hidden>
            {[1, 2, 3, 4].map((i) => <span key={i} className={`w-4 h-3 ${i <= rank ? METER[rank] : 'bg-white/10'}`} />)}
        </span>
    );
}

/** "Higher than 3 in 4" reads better than "top 14%" and survives new devices being added. */
function share(pct: number): string {
    if (pct >= 0.9) return 'higher than 9 in 10';
    if (pct >= 0.75) return 'higher than 3 in 4';
    if (pct >= 0.5) return 'higher than half';
    if (pct >= 0.25) return 'lower than half';
    return 'lower than 3 in 4';
}

export default function ConsoleView(p: {
    slug: string;
    brand: string;
    brandSlug: string | null;
    name: string;
    label: string;
    image: string | null;
    formFactor: string | null;
    releaseStatus: string | null;
    year: string | null;
    variants: Record<string, any>[];
    description: string | null;
    summary: string | null;
    score: Score | null;
    buy: BuyTarget | null;
    reviews: { url: string; label: string }[];
    similar: { slug: string; label: string; image: string | null; price: number | null; screen: number | null }[];
    comparisons: { href: string; label: string }[];
    consoles: PickerConsole[];
}) {
    const [iv, setIv] = useState(0);
    const [comparing, setComparing] = useState(false);
    const v = useMemo(() => p.variants[iv] ?? {}, [p.variants, iv]);
    const price = priceOf(v);
    const specs = useMemo(() => specList(v), [v]);
    const plays = useMemo(() => playsByRating(v), [v]);
    const notTested = useMemo(() => untested(v), [v]);

    // Specs that change between configurations, for the configuration table.
    const configRows = useMemo(() => {
        if (p.variants.length < 2) return [];
        const lists = p.variants.map((x) => new Map(specList(x).flatMap((g) => g.rows.map((r) => [r.label, r.value] as const))));
        const labels = [...new Set(lists.flatMap((m) => [...m.keys()]))];
        const rows = labels.filter((l) => new Set(lists.map((m) => m.get(l) ?? '')).size > 1).map((l) => ({ label: l, values: lists.map((m) => m.get(l) ?? null) }));
        return [{ label: 'Launch price', values: p.variants.map((x) => (priceOf(x) ? `$${priceOf(x)}` : null)) }, ...rows].filter((r) => new Set(r.values).size > 1 || r.label === 'Launch price');
    }, [p.variants]);

    const quick = [
        { k: 'Screen', v: [v.screen_size_inch ? `${v.screen_size_inch}"` : null, text(v.display_type), v.refresh_rate_hz ? `${v.refresh_rate_hz} Hz` : null].filter(Boolean).join(' ') || null },
        { k: 'Chip', v: chipOf(v) },
        { k: 'Memory', v: [ramGb(v) ? `${ramGb(v)} GB` : null, v.storage_gb ? `${v.storage_gb} GB` : null].filter(Boolean).join(' / ') || null },
        { k: 'Battery', v: v.battery_capacity_mah ? `${v.battery_capacity_mah} mAh` : v.battery_capacity_wh ? `${v.battery_capacity_wh} Wh` : null },
        { k: 'Weight', v: v.weight_g ? `${v.weight_g} g` : null },
        { k: 'Software', v: text(v.os_family) && v.os_version ? `${text(v.os_family)} ${v.os_version}` : text(v.os) },
    ];

    // Sticky bar once the hero has scrolled away.
    const hero = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    const [top, setTop] = useState(0);
    useEffect(() => {
        const measure = () => {
            const h = Array.from(document.querySelectorAll<HTMLElement>('[data-site-header]')).find((x) => x.offsetHeight > 0);
            setTop(h ? Math.max(0, h.getBoundingClientRect().bottom) : 0);
        };
        measure();
        const io = new IntersectionObserver(([e]) => { measure(); setStuck(!e.isIntersecting && e.boundingClientRect.top < 0); });
        if (hero.current) io.observe(hero.current);
        window.addEventListener('resize', measure);
        return () => { io.disconnect(); window.removeEventListener('resize', measure); };
    }, []);

    const status = p.releaseStatus === 'upcoming' || p.releaseStatus === 'rumoured' ? 'Not out yet' : p.releaseStatus === 'discontinued' ? 'Discontinued' : null;

    const BuyButton = ({ small }: { small?: boolean }) =>
        p.buy ? (
            <AffiliateLink
                href={p.buy.url}
                productName={p.label}
                linkType={p.buy.confidence === 'direct' ? 'product' : 'search'}
                placement="console_detail"
                className={`inline-block text-center bg-white text-black font-mono ${small ? 'text-xs px-3 py-2' : 'text-sm px-6 py-3'} hover:bg-violet-500 hover:text-white transition-colors ${focus}`}
            >
                {p.buy.confidence === 'direct' ? `Buy on ${p.buy.vendor}` : `Find on ${p.buy.vendor}`}
            </AffiliateLink>
        ) : null;

    return (
        <div className="bg-bg-primary text-text-primary font-sans min-h-screen">
            {/* Follows the reader down the page */}
            <div aria-hidden={!stuck} style={{ top }} className={`fixed inset-x-0 z-40 bg-bg-primary border-b border-white/10 transition-transform duration-200 ${stuck ? 'translate-y-0' : '-translate-y-[200%]'}`}>
                <div className="max-w-[1100px] mx-auto flex items-center gap-3 px-5 py-2">
                    <span className="relative w-9 h-7 shrink-0">{p.image && <Image src={p.image} alt="" fill sizes="36px" className="object-contain" />}</span>
                    <span className="font-semibold text-sm truncate">{p.label}</span>
                    {price && <span className="font-mono text-sm text-cyan-400">${price}</span>}
                    <span className="ml-auto hidden sm:block"><BuyButton small /></span>
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto px-5 pt-6 md:pt-10 pb-24">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="font-mono text-xs text-text-secondary flex flex-wrap items-center gap-1">
                    <Link href="/consoles" className="hover:text-white">Handhelds</Link>
                    <ChevronRight size={12} aria-hidden />
                    {p.brandSlug ? <Link href={`/fabricators/${p.brandSlug}`} className="hover:text-white">{p.brand}</Link> : <span>{p.brand}</span>}
                    <ChevronRight size={12} aria-hidden />
                    <span className="text-zinc-300">{p.name}</span>
                </nav>

                {/* Hero */}
                <div ref={hero} className="mt-6 md:mt-8 grid md:grid-cols-[4fr_6fr] gap-8 md:gap-12 items-start">
                    <div className="border border-white/10 aspect-[16/9] md:aspect-[4/3] relative">
                        {p.image && <Image src={p.image} alt={p.label} fill sizes="(min-width: 768px) 480px, 100vw" className="object-contain p-8 md:p-16" priority />}
                        {status && <span className="absolute top-3 left-3 font-mono text-xs text-orange-400 border border-orange-500/50 px-2 py-1">{status}</span>}
                    </div>

                    <div>
                        <p className="font-mono text-sm text-text-secondary">{[p.brand, p.year].filter(Boolean).join(', ')}</p>
                        <h1 className="mt-2 text-4xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.02]">{p.label}</h1>

                        <div className="mt-6 flex items-baseline gap-3">
                            <span className="font-mono text-4xl md:text-5xl text-white">{price ? `$${price}` : 'Price not listed'}</span>
                            {price && <span className="text-text-secondary">at launch</span>}
                        </div>
                        {Number(v.price_avg_usd) >= 20 && Math.round(Number(v.price_avg_usd)) !== price && (
                            <p className="mt-1 text-sm text-zinc-300">Usually sells for about ${Math.round(Number(v.price_avg_usd))} now.</p>
                        )}
                        {p.score?.pricePct != null && p.score.medianPrice && (
                            <p className="mt-1 text-sm text-text-secondary">
                                Devices that play the same systems launched at ${p.score.medianPrice} on average.
                            </p>
                        )}

                        {p.score && (
                            <div className="mt-6 border border-white/10 p-4 flex items-center gap-4">
                                <span className="font-pixel text-2xl md:text-3xl text-violet-400 shrink-0">{p.score.score}</span>
                                <span className="text-sm text-zinc-300 leading-snug">
                                    <span className="font-semibold text-white">Circuit Score out of 100.</span>{' '}
                                    {p.score.pct != null ? `That's ${share(p.score.pct)} of the ${p.score.tierSize} devices that play the same systems.` : 'Measured from what it plays and how well.'}
                                </span>
                            </div>
                        )}

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <BuyButton />
                            <button type="button" onClick={() => setComparing(!comparing)} aria-expanded={comparing} className={`border border-white/20 font-mono text-sm px-6 py-3 text-violet-400 hover:bg-white hover:text-black transition-colors ${focus}`}>
                                Compare with another
                            </button>
                        </div>
                        {p.buy && <p className="mt-3 text-xs text-text-secondary">We may earn a commission from this link. It never changes the specs or scores.</p>}
                        {comparing && (
                            <div className="mt-4">
                                <DevicePicker consoles={p.consoles} hrefFor={(s) => `/arena-preview/${pairKey(p.slug, s)}`} label={`Compare the ${p.label} with`} autoFocus />
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick facts */}
                <dl className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-t border-white/10">
                    {quick.map((q) => (
                        <div key={q.k} className="border-r border-b border-white/10 px-4 py-4">
                            <dt className="text-xs text-text-secondary">{q.k}</dt>
                            <dd className={`mt-1 font-mono text-sm leading-snug ${q.v ? 'text-cyan-400' : 'text-zinc-600'}`}>{q.v ?? 'Not listed'}</dd>
                        </div>
                    ))}
                </dl>

                {/* Configurations */}
                {p.variants.length > 1 && (
                    <section className="mt-16 md:mt-24" aria-labelledby="config-heading">
                        <h2 id="config-heading" className={H2}>Which configuration</h2>
                        <p className="mt-2 text-text-secondary">It comes in {p.variants.length} versions. Pick one and the whole page updates.</p>
                        <div className="mt-6 overflow-x-auto border border-white/10">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 text-left text-text-secondary">
                                        <th className="font-normal px-4 py-3">Configuration</th>
                                        {configRows.map((r) => <th key={r.label} className="font-normal px-3 py-3 whitespace-nowrap">{r.label === 'Launch price' ? 'Price' : r.label}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {p.variants.map((x, j) => (
                                        <tr key={x.id ?? j} className={`border-b border-white/10 last:border-b-0 ${iv === j ? 'bg-white/[0.06]' : ''}`}>
                                            <td className="px-2 py-2">
                                                <button type="button" aria-pressed={iv === j} onClick={() => setIv(j)} className={`w-full text-left px-2 py-1.5 flex items-center gap-2.5 ${focus}`}>
                                                    <span className={`w-3.5 h-3.5 shrink-0 border ${iv === j ? 'bg-violet-500 border-violet-500' : 'border-white/30'}`} aria-hidden />
                                                    <span className={`font-mono text-xs sm:text-sm ${iv === j ? 'text-white' : 'text-zinc-300'}`}>{variantLabel(x, j)}</span>
                                                </button>
                                            </td>
                                            {configRows.map((r) => (
                                                <td key={r.label} className={`px-3 py-2 font-mono text-xs sm:text-sm ${iv === j ? 'text-white' : 'text-zinc-400'}`}>{r.values[j] ?? 'Not listed'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {configRows.length <= 1 && <p className="mt-3 text-sm text-text-secondary">We have not recorded any spec differences between these yet.</p>}
                    </section>
                )}

                {/* What it plays */}
                {plays.length > 0 && (
                    <section className="mt-16 md:mt-24" aria-labelledby="plays-heading">
                        <h2 id="plays-heading" className={H2}>What it plays</h2>
                        <p className="mt-2 text-text-secondary">Tested system by system. Four blocks means perfect, one means it struggles.</p>
                        <div className="mt-6 border border-white/10 divide-y divide-white/10">
                            {plays.map(({ rank, systems }) => (
                                <div key={rank} className="px-4 md:px-5 py-4 grid md:grid-cols-[12rem_1fr] gap-2 md:gap-6 items-baseline">
                                    <span className="flex items-center gap-3"><Meter rank={rank} /><span className="font-semibold text-sm">{RATING_LABEL[rank]}</span></span>
                                    <span className="text-[15px] text-zinc-300 leading-relaxed">{systems.join(', ')}</span>
                                </div>
                            ))}
                            {notTested.length > 0 && (
                                <div className="px-4 md:px-5 py-4 grid md:grid-cols-[12rem_1fr] gap-2 md:gap-6 items-baseline">
                                    <span className="text-sm text-text-secondary">Not tested yet</span>
                                    <span className="text-[15px] text-text-secondary leading-relaxed">{notTested.join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* About */}
                {(p.description || p.summary) && (
                    <section className="mt-16 md:mt-24 grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12" aria-labelledby="about-heading">
                        <h2 id="about-heading" className={H2}>About it</h2>
                        <div>
                            <p className="text-lg leading-relaxed text-zinc-300 max-w-[62ch]">{p.description ?? p.summary}</p>
                            {!p.description && <p className="mt-3 text-xs text-text-secondary">Written from the spec sheet.</p>}
                        </div>
                    </section>
                )}

                {/* Every spec */}
                <section className="mt-16 md:mt-24" aria-labelledby="specs-heading">
                    <h2 id="specs-heading" className={H2}>Every spec</h2>
                    {p.variants.length > 1 && <p className="mt-2 text-text-secondary">For the {variantLabel(v, iv)} configuration.</p>}
                    <div className="mt-6 grid md:grid-cols-2 gap-x-8 gap-y-8">
                        {specs.map((g) => (
                            <div key={g.title}>
                                <h3 className="font-mono text-sm text-cyan-400 mb-2">{g.title}</h3>
                                <dl className="border border-white/10 divide-y divide-white/10">
                                    {g.rows.map((r) => (
                                        <div key={r.label} className="grid grid-cols-[9rem_1fr] gap-4 px-4 py-2.5">
                                            <dt className="text-sm text-text-secondary">{r.label}</dt>
                                            <dd className="font-mono text-sm">{r.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reviews */}
                {p.reviews.length > 0 && (
                    <section className="mt-16 md:mt-24" aria-labelledby="reviews-heading">
                        <h2 id="reviews-heading" className={H2}>Reviews and videos</h2>
                        <ul className="mt-6 border border-white/10 divide-y divide-white/10">
                            {p.reviews.map((r) => (
                                <li key={r.url}><a href={r.url} rel="nofollow noopener" target="_blank" className={`block px-4 py-3 text-sm hover:bg-white/[0.04] ${focus}`}>{r.label}</a></li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Compare */}
                <section className="mt-16 md:mt-24" aria-labelledby="compare-heading">
                    <h2 id="compare-heading" className={H2}>Compare it</h2>
                    {p.comparisons.length > 0 && (
                        <ul className="mt-6 flex flex-wrap gap-2">
                            {p.comparisons.map((c) => (
                                <li key={c.href}><Link href={c.href} className={`block px-3 py-2 border border-white/10 text-sm hover:bg-white hover:text-black transition-colors ${focus}`}>{p.label} {c.label}</Link></li>
                            ))}
                        </ul>
                    )}
                    {p.similar.length > 0 && (
                        <>
                            <h3 className="mt-10 font-semibold">Similar handhelds</h3>
                            <ul className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                                {p.similar.map((s) => (
                                    <li key={s.slug} className="bg-bg-primary flex flex-col">
                                        <Link href={`/consoles-preview/${s.slug}`} className={`flex-1 block p-4 hover:bg-white/[0.04] ${focus} focus-visible:-outline-offset-2`}>
                                            <span className="relative block w-full h-20">{s.image && <Image src={s.image} alt="" fill sizes="160px" className="object-contain" />}</span>
                                            <span className="mt-3 block font-semibold text-sm leading-snug">{s.label}</span>
                                            <span className="mt-1 block font-mono text-xs text-cyan-400">{[s.screen ? `${s.screen}"` : null, s.price ? `$${s.price}` : null].filter(Boolean).join(', ')}</span>
                                        </Link>
                                        <Link href={`/arena-preview/${pairKey(p.slug, s.slug)}`} className={`border-t border-white/10 px-4 py-2.5 font-mono text-xs text-violet-400 hover:bg-white hover:text-black ${focus} focus-visible:-outline-offset-2`}>
                                            Compare
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
