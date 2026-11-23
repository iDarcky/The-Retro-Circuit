'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftRight, Check } from 'lucide-react';
import { emulationRows, keySpecs, priceOf, reasons, RATING_LABEL, specGroups, variantLabel, type SpecRow } from '../../lib/arena/compare-view';
import { getBuyUrl } from '../../lib/affiliate';
import { pairKey } from '../../lib/arena/indexable';
import AffiliateLink from '../console/AffiliateLink';
import DevicePicker, { type PickerConsole } from './DevicePicker';

export interface Side {
    slug: string;
    brand: string;
    name: string;
    label: string;
    image: string | null;
    variants: Record<string, any>[];
    initialVariant: number;
}

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500';
const H2 = 'text-2xl md:text-4xl font-extrabold tracking-[-0.03em]';

/* ---------- small pieces ---------- */

function Thumb({ src, className = 'w-14 h-10' }: { src: string | null; className?: string }) {
    return (
        <span className={`relative shrink-0 ${className}`}>
            {src && <Image src={src} alt="" fill sizes="160px" className="object-contain" />}
        </span>
    );
}

function Value({ v, win, align }: { v: string | null; win: boolean; align: 'left' | 'right' }) {
    return (
        <span className={`font-mono text-sm ${win ? 'text-violet-400' : v ? 'text-white' : 'text-zinc-600'} ${align === 'right' ? 'text-right' : ''}`}>
            {win && align === 'right' && <span aria-label="better">✓ </span>}
            {v ?? 'Not listed'}
            {win && align === 'left' && <span aria-label="better"> ✓</span>}
        </span>
    );
}

/** One comparison row: on phones the label sits above the two values, on wider screens between them. */
function Row({ r }: { r: SpecRow }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-[1fr_11rem_1fr] gap-x-4 gap-y-1 px-4 md:px-5 py-3 border-b border-white/10 last:border-b-0 hover:bg-white/[0.03]">
            <span className="col-span-2 md:col-span-1 md:order-2 text-xs md:text-sm text-text-secondary md:text-center self-center">{r.label}</span>
            <span className="md:order-1"><Value v={r.a} win={r.win === 'a'} align="left" /></span>
            <span className="md:order-3 text-right"><Value v={r.b} win={r.win === 'b'} align="right" /></span>
        </div>
    );
}

const METER = ['bg-rose-500', 'bg-rose-500', 'bg-orange-500', 'bg-emerald-500', 'bg-emerald-500'];

/** A four-block meter, like a health bar: Struggles 1 block up to Perfect 4. */
function Meter({ rank, win, align }: { rank: number | null; win: boolean; align: 'left' | 'right' }) {
    if (rank === null) return <span className={`text-xs text-zinc-600 ${align === 'right' ? 'text-right block' : ''}`}>Not rated</span>;
    const blocks = (
        <span className={`inline-flex gap-[3px] ${align === 'right' ? 'flex-row-reverse' : ''}`} aria-hidden>
            {[1, 2, 3, 4].map((i) => (
                <span key={i} className={`w-3 h-3 md:w-4 md:h-3 ${i <= rank ? METER[rank] : 'bg-white/10'}`} />
            ))}
        </span>
    );
    const word = <span className={`text-xs md:text-sm ${win ? 'text-white font-semibold' : 'text-text-secondary'}`}>{RATING_LABEL[rank]}</span>;
    return (
        <span className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
            {align === 'left' ? <>{blocks}{word}</> : <>{word}{blocks}</>}
        </span>
    );
}

/* ---------- the page ---------- */

export default function ArenaView({ a, b, consoles, related, base }: {
    a: Side;
    b: Side;
    consoles: PickerConsole[];
    related: { href: string; label: string }[];
    base: string;
}) {
    const [ia, setIa] = useState(a.initialVariant);
    const [ib, setIb] = useState(b.initialVariant);
    const [diffOnly, setDiffOnly] = useState(false);
    const [picking, setPicking] = useState<'a' | 'b' | null>(null);
    const va = useMemo(() => a.variants[ia] ?? {}, [a.variants, ia]);
    const vb = useMemo(() => b.variants[ib] ?? {}, [b.variants, ib]);

    const keys = useMemo(() => keySpecs(va, vb), [va, vb]);
    const emu = useMemo(() => emulationRows(va, vb), [va, vb]);
    const emuDiff = emu.filter((r) => r.a !== r.b);
    // Systems both rate the same, grouped by rating, best first.
    const emuSame = Object.entries(
        emu.filter((r) => r.a === r.b && r.a !== null).reduce<Record<number, string[]>>((m, r) => ((m[r.a!] ||= []).push(r.label), m), {}),
    ).map(([k, v]) => [Number(k), v] as [number, string[]]).sort((x, y) => y[0] - x[0]);
    const why = useMemo(() => reasons(va, vb), [va, vb]);
    const groups = useMemo(() => specGroups(va, vb), [va, vb]);
    const wins = keys.filter((r) => r.win === 'a').length, losses = keys.filter((r) => r.win === 'b').length;

    // Compact bar that follows the reader once the two device panels scroll away.
    const panels = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    const [top, setTop] = useState(0);
    useEffect(() => {
        const measure = () => {
            const hs = Array.from(document.querySelectorAll<HTMLElement>('[data-site-header]')).filter((h) => h.offsetHeight > 0);
            setTop(hs.length ? Math.max(0, hs[0].getBoundingClientRect().bottom) : 0);
        };
        measure();
        const io = new IntersectionObserver(([e]) => { measure(); setStuck(!e.isIntersecting && e.boundingClientRect.top < 0); });
        if (panels.current) io.observe(panels.current);
        window.addEventListener('resize', measure);
        return () => { io.disconnect(); window.removeEventListener('resize', measure); };
    }, []);

    const sides = [
        { s: a, v: va, i: ia, set: setIa, key: 'a' as const },
        { s: b, v: vb, i: ib, set: setIb, key: 'b' as const },
    ];

    const pickHref = (side: 'a' | 'b', slug: string) => `${base}/${side === 'a' ? pairKey(slug, b.slug) : pairKey(a.slug, slug)}`;

    return (
        <div className="bg-bg-primary text-text-primary font-sans min-h-screen">
            {/* Follows the reader down the page */}
            <div
                aria-hidden={!stuck}
                style={{ top }}
                className={`fixed inset-x-0 z-40 bg-bg-primary border-b border-white/10 transition-transform duration-200 ${stuck ? 'translate-y-0' : '-translate-y-[200%]'}`}
            >
                <div className="max-w-[1100px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-5 py-2">
                    <span className="flex items-center gap-2 min-w-0"><Thumb src={a.image} className="w-9 h-7" /><span className="font-semibold text-sm truncate">{a.label}</span></span>
                    <span className="font-pixel text-[9px] text-text-secondary">VS</span>
                    <span className="flex items-center justify-end gap-2 min-w-0"><span className="font-semibold text-sm truncate text-right">{b.label}</span><Thumb src={b.image} className="w-9 h-7" /></span>
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto px-5 pt-10 md:pt-16 pb-24">
                {/* Title */}
                <p className="font-pixel text-[10px] text-violet-400">HEAD TO HEAD</p>
                <h1 className="mt-4 text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05]">
                    {a.label} <span className="text-text-secondary font-bold">vs</span> {b.label}
                </h1>
                <p className="mt-4 text-base md:text-lg text-text-secondary max-w-[56ch]">
                    Every spec side by side, with the better number marked. Switch a configuration and the whole page updates.
                </p>

                {/* The two devices */}
                <div ref={panels} className="mt-8 md:mt-10 grid grid-cols-2 border border-white/10">
                    {sides.map(({ s, v, i, set, key }) => (
                        <div key={key} className={`p-4 md:p-8 flex flex-col ${key === 'a' ? 'border-r border-white/10' : ''}`}>
                            <Thumb src={v.image_url || s.image} className="w-full h-20 md:h-32" />
                            <p className="mt-4 md:mt-6 font-mono text-xs text-text-secondary">{s.brand}</p>
                            <p className="mt-1 text-lg md:text-2xl font-bold leading-tight">{s.name}</p>
                            <p className="mt-2 font-mono text-sm text-cyan-400">{priceOf(v) ? `$${priceOf(v)} at launch` : 'Price not listed'}</p>

                            {s.variants.length > 1 && (
                                <div className="mt-4" role="group" aria-label={`${s.label} configuration`}>
                                    <p className="text-xs text-text-secondary mb-2">Configuration</p>
                                    <div className="flex flex-wrap gap-1">
                                        {s.variants.map((x, j) => (
                                            <button
                                                key={x.id ?? j}
                                                type="button"
                                                aria-pressed={i === j}
                                                onClick={() => set(j)}
                                                className={`px-2.5 py-1.5 font-mono text-xs border ${focus} ${i === j ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.06]'}`}
                                            >
                                                {variantLabel(x, j)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
                                <button type="button" onClick={() => setPicking(picking === key ? null : key)} className={`inline-flex items-center gap-1.5 text-violet-400 hover:text-white ${focus}`}>
                                    <ArrowLeftRight size={14} aria-hidden /> Swap
                                </button>
                                <Link href={`/consoles-preview/${s.slug}`} className={`text-text-secondary hover:text-white ${focus}`}>Full specs page</Link>
                            </div>
                        </div>
                    ))}
                </div>
                {picking && (
                    <div className="border border-t-0 border-white/10 p-4 md:p-5">
                        <DevicePicker
                            consoles={consoles.filter((c) => c.slug !== a.slug && c.slug !== b.slug)}
                            hrefFor={(slug) => pickHref(picking, slug)}
                            label={`Swap ${picking === 'a' ? a.label : b.label} for`}
                            autoFocus
                        />
                    </div>
                )}

                {/* Where each one wins */}
                <section className="mt-16 md:mt-24" aria-labelledby="wins-heading">
                    <h2 id="wins-heading" className={H2}>Where each one wins</h2>
                    <p className="mt-2 text-text-secondary">
                        {wins === losses ? 'Even on the key specs.' : `${wins > losses ? a.label : b.label} leads on ${Math.max(wins, losses)} of ${keys.filter((r) => r.win).length} key specs.`}
                    </p>
                    <div className="mt-6 grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                        {sides.map(({ s, key }) => (
                            <div key={key} className="bg-bg-primary p-5 md:p-6">
                                <p className="font-semibold">Pick the {s.label} for</p>
                                {why[key].length ? (
                                    <ul className="mt-3 space-y-2">
                                        {why[key].map((r) => (
                                            <li key={r} className="flex gap-2.5 text-[15px] text-zinc-300">
                                                <Check size={16} className="mt-0.5 shrink-0 text-violet-400" aria-hidden />{r}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-3 text-[15px] text-text-secondary">Nothing stands out on the specs we track.</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Key specs */}
                <section className="mt-16 md:mt-24" aria-labelledby="key-heading">
                    <h2 id="key-heading" className={H2}>Key specs</h2>
                    <div className="mt-6 border border-white/10">
                        {keys.map((r) => <Row key={r.label} r={r} />)}
                    </div>
                </section>

                {/* Emulation */}
                {emu.length > 0 && (
                    <section className="mt-16 md:mt-24" aria-labelledby="emu-heading">
                        <h2 id="emu-heading" className={H2}>What it plays</h2>
                        <p className="mt-2 text-text-secondary">How well each system runs, from four blocks (perfect) down to one (struggles). Where they differ comes first.</p>
                        {emuDiff.length > 0 && (
                            <div className="mt-6 border border-white/10">
                                {emuDiff.map((r) => (
                                    <div key={r.label} className="grid grid-cols-2 md:grid-cols-[1fr_11rem_1fr] gap-x-4 gap-y-1.5 px-4 md:px-5 py-3 border-b border-white/10 last:border-b-0">
                                        <span className="col-span-2 md:col-span-1 md:order-2 text-xs md:text-sm text-text-secondary md:text-center self-center">{r.label}</span>
                                        <span className="md:order-1"><Meter rank={r.a} win={r.win === 'a'} align="left" /></span>
                                        <span className="block md:order-3"><Meter rank={r.b} win={r.win === 'b'} align="right" /></span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {emuSame.length > 0 && (
                            <div className={`${emuDiff.length ? 'border-t-0' : 'mt-6'} border border-white/10 divide-y divide-white/10`}>
                                {emuSame.map(([rank, names]) => (
                                    <div key={rank} className="px-4 md:px-5 py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                        <span className="shrink-0 md:w-52"><Meter rank={rank} win={false} align="left" /></span>
                                        <span className="text-sm text-zinc-300"><span className="text-text-secondary">Same on both: </span>{names.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Every spec */}
                <section className="mt-16 md:mt-24" aria-labelledby="all-heading">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <h2 id="all-heading" className={H2}>Every spec</h2>
                        <label className="inline-flex items-center gap-2 font-mono text-sm cursor-pointer select-none">
                            <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} className="accent-violet-500 w-4 h-4" />
                            Only differences
                        </label>
                    </div>
                    <div className="mt-6 space-y-8">
                        {groups.map((g) => {
                            const rows = diffOnly ? g.rows.filter((r) => r.a !== r.b) : g.rows;
                            if (!rows.length) return null;
                            return (
                                <div key={g.title}>
                                    <h3 className="font-mono text-sm text-cyan-400 mb-2">{g.title}</h3>
                                    <div className="border border-white/10">{rows.map((r) => <Row key={r.label} r={r} />)}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Buy */}
                <section className="mt-16 md:mt-24" aria-labelledby="buy-heading">
                    <h2 id="buy-heading" className={H2}>Where to buy</h2>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sides.map(({ s, v, key }) => {
                            const url = getBuyUrl({ asin: v.amazon_asin, name: s.name, manufacturer: s.brand });
                            if (!url) return null;
                            return (
                                <AffiliateLink
                                    key={key}
                                    href={url}
                                    productName={s.label}
                                    linkType={v.amazon_asin ? 'product' : 'search'}
                                    placement={key === 'a' ? 'arena_a' : 'arena_b'}
                                    className={`flex items-center justify-between gap-4 px-5 py-4 border border-white/10 hover:bg-white hover:text-black transition-colors ${focus}`}
                                >
                                    <span className="font-semibold truncate">{s.label}</span>
                                    <span className="font-mono text-xs shrink-0">{v.amazon_asin ? 'On Amazon' : 'Search Amazon'}</span>
                                </AffiliateLink>
                            );
                        })}
                    </div>
                    <p className="mt-3 text-xs text-text-secondary">As an Amazon Associate we earn from qualifying purchases. It never changes the specs or which side wins.</p>
                </section>

                {/* More */}
                {related.length > 0 && (
                    <section className="mt-16 md:mt-24" aria-labelledby="more-heading">
                        <h2 id="more-heading" className={H2}>Other comparisons</h2>
                        <ul className="mt-6 flex flex-wrap gap-2">
                            {related.map((p) => (
                                <li key={p.href}>
                                    <Link href={p.href} className={`block px-3 py-2 border border-white/10 text-sm hover:bg-white hover:text-black transition-colors ${focus}`}>{p.label}</Link>
                                </li>
                            ))}
                        </ul>
                        <Link href={base} className={`inline-block mt-4 font-mono text-sm text-violet-400 hover:text-white ${focus}`}>Or pick any two yourself</Link>
                    </section>
                )}
            </div>
        </div>
    );
}
