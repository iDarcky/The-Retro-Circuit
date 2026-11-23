'use client';
/* PROTOTYPE (throwaway): Mockups E and F, "Apple meets 90s Nintendo".
 * An Apple-style product page built from 90s console parts: grey plastic panels, the four
 * coloured face buttons as the only accents, and a Game Boy green screen as the spec
 * readout was dropped after review. E is light plastic, F dark, G the site's own theme. */
import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SYSTEMS, type HomeData, type HomeDevice, type SystemKey } from './data';

const THEMES: Record<'light' | 'dark' | 'site', CSSProperties> = {
    light: {
        ['--shell' as any]: '#E4E2DD',
        ['--panel' as any]: '#F3F2EE',
        ['--card' as any]: '#FFFFFF',
        ['--ink' as any]: '#1D1D1F',
        ['--mute' as any]: '#6E6E73',
        ['--line' as any]: '#D3D0CA',
        ['--pill' as any]: '#1D1D1F',
        ['--pill-ink' as any]: '#FFFFFF',
        ['--r-lg' as any]: '28px',
        ['--r-pill' as any]: '999px',
        ['--a-red' as any]: '#D3352B',
        ['--a-select' as any]: '#D3352B',
        ['--data' as any]: 'var(--ink)',
        ['--a-yellow' as any]: '#E9B021',
        ['--a-blue' as any]: '#2F5FB3',
        ['--a-green' as any]: '#22995A',
        ['--finder-bg' as any]: '#C9C7C2',
        ['--finder-ink' as any]: '#1D1D1F',
        ['--finder-mute' as any]: '#4A4A4F',
        ['--finder-btn' as any]: '#1D1D1F',
        ['--finder-btn-ink' as any]: '#FFFFFF',
        ['--dpad' as any]: '#2B2B30',
        ['--btn-a' as any]: '#8B85C1',
        ['--btn-b' as any]: '#5B5596',
    },
    dark: {
        ['--shell' as any]: '#0E0E10',
        ['--panel' as any]: '#18181B',
        ['--card' as any]: '#1F1F23',
        ['--ink' as any]: '#F5F5F7',
        ['--mute' as any]: '#98989D',
        ['--line' as any]: '#2E2E33',
        ['--pill' as any]: '#F5F5F7',
        ['--pill-ink' as any]: '#0E0E10',
        ['--r-lg' as any]: '28px',
        ['--r-pill' as any]: '999px',
        ['--a-red' as any]: '#D3352B',
        ['--a-select' as any]: '#D3352B',
        ['--data' as any]: 'var(--ink)',
        ['--a-yellow' as any]: '#E9B021',
        ['--a-blue' as any]: '#5B8DEF',
        ['--a-green' as any]: '#22995A',
        ['--finder-bg' as any]: '#C9C7C2',
        ['--finder-ink' as any]: '#1D1D1F',
        ['--finder-mute' as any]: '#4A4A4F',
        ['--finder-btn' as any]: '#1D1D1F',
        ['--finder-btn-ink' as any]: '#FFFFFF',
        ['--dpad' as any]: '#2B2B30',
        ['--btn-a' as any]: '#8B85C1',
        ['--btn-b' as any]: '#5B5596',
    },
    /* The site's own theme: pure black, violet brand, square corners, signal colours. */
    site: {
        ['--shell' as any]: '#09090B',
        ['--panel' as any]: '#0F0F12',
        ['--card' as any]: '#0F0F12',
        ['--ink' as any]: '#FFFFFF',
        ['--mute' as any]: '#A1A1AA',
        ['--line' as any]: 'rgba(255,255,255,0.10)',
        ['--pill' as any]: '#FFFFFF',
        ['--pill-ink' as any]: '#09090B',
        ['--r-lg' as any]: '2px',
        ['--r-pill' as any]: '2px',
        ['--a-red' as any]: '#F43F5E',
        ['--a-select' as any]: '#7C3AED',
        ['--data' as any]: '#22D3EE',
        ['--a-yellow' as any]: '#F97316',
        ['--a-blue' as any]: '#A78BFA',
        ['--a-green' as any]: '#10B981',
        ['--finder-bg' as any]: '#7C3AED',
        ['--finder-ink' as any]: '#FFFFFF',
        ['--finder-mute' as any]: '#DDD6FE',
        ['--finder-btn' as any]: '#FFFFFF',
        ['--finder-btn-ink' as any]: '#09090B',
        ['--dpad' as any]: '#1E1B4B',
        ['--btn-a' as any]: '#06B6D4',
        ['--btn-b' as any]: '#F43F5E',
    },
};

/* The four face buttons, each with one job on this page. */
const RED = 'var(--a-red)';       // budget
const YELLOW = 'var(--a-yellow)'; // middling ratings
const BLUE = 'var(--a-blue)';     // links, comparisons
const GREEN = 'var(--a-green)';   // "runs great"
const RATING = ['Not rated', 'Struggles', 'Playable', 'Great', 'Perfect'];
const RATING_COLOR = ['var(--mute)', RED, YELLOW, GREEN, GREEN];

function Buttons({ size = 10, site }: { size?: number; site?: boolean }) {
    const [top, left, right, bottom] = site ? ['#8B5CF6', '#06B6D4', '#F43F5E', '#F97316'] : [BLUE, GREEN, RED, YELLOW];
    // The diamond of face buttons, used as the page's mark.
    const d = { width: size, height: size };
    return (
        <span aria-hidden className="inline-grid grid-cols-3 gap-[2px]" style={{ width: size * 3 + 4 }}>
            <span /> <span className="rounded-full" style={{ ...d, background: top }} /> <span />
            <span className="rounded-full" style={{ ...d, background: left }} /> <span /> <span className="rounded-full" style={{ ...d, background: right }} />
            <span /> <span className="rounded-full" style={{ ...d, background: bottom }} /> <span />
        </span>
    );
}

type VsRow = { label: string; a: number | null; b: number | null; fmt: (n: number) => string; lowerWins?: boolean };
const vsRows = (a: HomeDevice, b: HomeDevice): VsRow[] => [
    { label: 'Screen', a: a.screenIn, b: b.screenIn, fmt: (n) => `${n}"` },
    { label: 'RAM', a: a.ramGb, b: b.ramGb, fmt: (n) => `${n} GB` },
    { label: 'Battery', a: a.batteryMah, b: b.batteryMah, fmt: (n) => `${n} mAh` },
    { label: 'Weight', a: a.weightG, b: b.weightG, fmt: (n) => `${n} g`, lowerWins: true },
    { label: 'Launch price', a: a.price, b: b.price, fmt: (n) => `$${n}`, lowerWins: true },
    { label: 'PS2', a: a.emu.ps2 || null, b: b.emu.ps2 || null, fmt: (n) => RATING[n] },
];

const BUDGETS = [
    { label: 'Any price', max: Infinity },
    { label: 'Under $100', max: 100 },
    { label: 'Under $200', max: 200 },
    { label: 'Under $400', max: 400 },
];

function Segmented<T extends string | number>({ items, value, onChange, label, accent }: {
    items: { key: T; label: string }[]; value: T[]; onChange: (k: T) => void; label: string; accent?: string;
}) {
    return (
        <div role="group" aria-label={label} className="inline-flex flex-wrap justify-center gap-1 p-1 rounded-[var(--r-lg)] bg-[var(--panel)] border border-[var(--line)]">
            {items.map((it) => {
                const on = value.includes(it.key);
                return (
                    <button
                        key={String(it.key)}
                        aria-pressed={on}
                        onClick={() => onChange(it.key)}
                        className="px-4 py-2 pill rounded-[var(--r-pill)] text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--a-blue)]"
                        style={on ? { background: accent ?? 'var(--pill)', color: accent ? '#fff' : 'var(--pill-ink)' } : { color: 'var(--ink)' }}
                    >
                        {it.label}
                    </button>
                );
            })}
        </div>
    );
}

export default function VariantConsole({ data, theme }: { data: HomeData; theme: 'light' | 'dark' | 'site' }) {
    const [systems, setSystems] = useState<SystemKey[]>(['ps2']);
    const [budget, setBudget] = useState(2);
    const [pairIx, setPairIx] = useState(0);
    const pair = data.pairs[pairIx];

    const results = useMemo(() => {
        const max = BUDGETS[budget].max;
        return data.all
            .filter((x) => systems.every((k) => x.emu[k] >= 2))
            .filter((x) => max === Infinity || (x.price !== null && x.price <= max))
            .sort((a, b) => systems.reduce((n, k) => n + b.emu[k] - a.emu[k], 0) || (a.price ?? 9999) - (b.price ?? 9999));
    }, [data.all, systems, budget]);

    const minPrice = Math.min(...data.all.map((x) => x.price ?? Infinity));
    const first = systems[0];
    const sysLabel = (k: SystemKey) => SYSTEMS.find((s) => s.key === k)!.label;

    return (
        <div style={THEMES[theme]} data-theme={theme} className="console-page bg-[var(--shell)] text-[var(--ink)] min-h-screen font-sans">
            {/* Hero */}
            <header className="px-5 pt-16 md:pt-24 pb-12 md:pb-16 text-center">
                <div className="flex justify-center mb-6"><Buttons size={9} site={theme === 'site'} /></div>
                <h1 className={theme === 'site'
                    ? 'font-pixel text-[26px] leading-[1.35] sm:text-5xl md:text-[64px] md:leading-[1.25]'
                    : 'text-[44px] leading-[1.02] sm:text-7xl md:text-[96px] font-extrabold tracking-[-0.045em]'}>
                    Every handheld.<br />Every spec.
                </h1>
                <p className="mt-6 text-lg md:text-2xl text-[var(--mute)] max-w-[34ch] mx-auto leading-snug tracking-[-0.01em]">
                    {data.counts.consoles} retro handhelds, measured the same way
                    {Number.isFinite(minPrice) ? `, from $${minPrice} pocket players to PS2-class powerhouses.` : '.'}
                </p>
                <div className="mt-8 flex justify-center items-center gap-6">
                    <Link href="/consoles" className="pill rounded-[var(--r-pill)] bg-[var(--pill)] text-[var(--pill-ink)] px-6 py-3 text-[15px] font-medium hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--a-blue)]">
                        Browse handhelds
                    </Link>
                    <Link href="/arena" className="text-[15px] font-medium hover:underline" style={{ color: BLUE }}>Compare two ›</Link>
                </div>
            </header>

            {/* Just added: a sideways strip, full width */}
            <section aria-labelledby="new-heading" className="border-y border-[var(--line)]">
                <div className="flex items-stretch overflow-x-auto no-scrollbar snap-x">
                    <h2 id="new-heading" className="shrink-0 snap-start flex items-center px-5 md:px-8 font-mono text-sm text-[var(--mute)] border-r border-[var(--line)] whitespace-nowrap">
                        Just added
                    </h2>
                    {data.newest.map((n) => (
                        <Link
                            key={n.slug}
                            href={`/consoles/${n.slug}`}
                            className="shrink-0 snap-start flex items-center gap-3 px-5 py-4 border-r border-[var(--line)] hover:bg-[var(--panel)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--a-blue)]"
                        >
                            <div className="relative w-14 h-10 shrink-0">{n.image && <Image src={n.image} alt="" fill sizes="56px" className="object-contain" />}</div>
                            <div className="text-left">
                                <p className="font-semibold whitespace-nowrap">{n.label}</p>
                                <p className="font-mono text-xs text-[var(--data)] whitespace-nowrap">
                                    {[n.screenIn ? `${n.screenIn}"` : null, n.price ? `$${n.price}` : null].filter(Boolean).join(', ') || 'See specs'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Picker: a ranked table, not cards */}
            <section className="px-5 pt-20 md:pt-28" aria-labelledby="fit-heading">
                <div className="max-w-[1200px] mx-auto">
                    <h2 id="fit-heading" className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] text-center">Which one is right for you?</h2>
                    <p className="mt-3 text-lg text-[var(--mute)] text-center">Pick what you want to play and what you want to spend.</p>
                    <div className="mt-8 flex flex-col items-center gap-3">
                        <Segmented
                            label="Systems"
                            items={SYSTEMS.map((s) => ({ key: s.key as SystemKey, label: s.label }))}
                            value={systems}
                            onChange={(k) => setSystems((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))}
                        />
                        <Segmented
                            label="Budget"
                            accent="var(--a-select)"
                            items={BUDGETS.map((b, i) => ({ key: i, label: b.label }))}
                            value={[budget]}
                            onChange={setBudget}
                        />
                    </div>

                    <div className="mt-10 border border-[var(--line)]">
                        <p className="px-5 py-3 text-sm text-[var(--mute)] border-b border-[var(--line)]" aria-live="polite">
                            {results.length} {results.length === 1 ? 'match' : 'matches'}
                            {results.length > 5 ? ', best five first' : ''}
                        </p>
                        {results.length === 0 ? (
                            <p className="px-5 py-10 text-center">Nothing fits yet. Raise the budget or drop a system.</p>
                        ) : (
                            <ol>
                                {results.slice(0, 5).map((x, i) => (
                                    <li key={x.slug} className="border-b border-[var(--line)] last:border-b-0">
                                        <Link href={`/consoles/${x.slug}`} className="grid grid-cols-[1.5rem_3.5rem_1fr_auto] md:grid-cols-[2rem_4rem_1.4fr_1fr_1fr_1fr_5rem] items-center gap-4 px-5 py-3 hover:bg-[var(--panel)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--a-blue)]">
                                            <span className="font-mono text-sm text-[var(--mute)]">{i + 1}</span>
                                            <div className="relative w-14 h-10">{x.image && <Image src={x.image} alt="" fill sizes="56px" className="object-contain" />}</div>
                                            <span className="min-w-0">
                                                <span className="block font-semibold truncate">{x.label}</span>
                                                {first && (
                                                    <span className="flex items-center gap-1.5 text-xs text-[var(--mute)]">
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: RATING_COLOR[x.emu[first]] }} />
                                                        {sysLabel(first)} {RATING[x.emu[first]].toLowerCase()}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="hidden md:block font-mono text-sm text-[var(--data)] truncate">{x.chip ?? 'Not listed'}</span>
                                            <span className="hidden md:block font-mono text-sm text-[var(--data)]">{x.screenIn ? `${x.screenIn}"` : 'Not listed'}</span>
                                            <span className="hidden md:block font-mono text-sm text-[var(--data)]">{x.batteryMah ? `${x.batteryMah} mAh` : 'Not listed'}</span>
                                            <span className="font-mono text-sm text-right">{x.price ? `$${x.price}` : 'Not listed'}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </div>
            </section>

            {/* Head to head: one live comparison, the rest as links */}
            <section className="px-5 pt-24 md:pt-36" aria-labelledby="vs-heading">
                <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <h2 id="vs-heading" className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">Head to head.</h2>
                        <p className="mt-3 text-lg text-[var(--mute)]">The comparisons people look up most.</p>
                        <div className="mt-8 flex flex-col" role="tablist" aria-label="Matchups">
                            {data.pairs.slice(0, 6).map((p, i) => (
                                <button
                                    key={p.href}
                                    role="tab"
                                    aria-selected={i === pairIx}
                                    onClick={() => setPairIx(i)}
                                    className="text-left py-2.5 border-b border-[var(--line)] text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--a-blue)]"
                                    style={{ color: i === pairIx ? 'var(--ink)' : 'var(--mute)', fontWeight: i === pairIx ? 600 : 400 }}
                                >
                                    {p.a.label} vs {p.b.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {pair && (
                        <div className="lg:col-span-8 border border-[var(--line)]">
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-5 border-b border-[var(--line)]">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-14 h-10 shrink-0">{pair.a.image && <Image src={pair.a.image} alt="" fill sizes="56px" className="object-contain" />}</div>
                                    <p className="font-bold truncate">{pair.a.label}</p>
                                </div>
                                <span className="font-pixel text-[10px] text-[var(--mute)]">VS</span>
                                <div className="flex items-center justify-end gap-3 min-w-0">
                                    <p className="font-bold truncate text-right">{pair.b.label}</p>
                                    <div className="relative w-14 h-10 shrink-0">{pair.b.image && <Image src={pair.b.image} alt="" fill sizes="56px" className="object-contain" />}</div>
                                </div>
                            </div>
                            <table className="w-full text-sm">
                                <caption className="sr-only">{pair.a.label} compared with {pair.b.label}</caption>
                                <tbody>
                                    {vsRows(pair.a, pair.b).map((r) => {
                                        const both = r.a !== null && r.b !== null && r.a !== r.b;
                                        const aWins = both && (r.lowerWins ? r.a! < r.b! : r.a! > r.b!);
                                        const bWins = both && !aWins;
                                        return (
                                            <tr key={r.label} className="border-b border-[var(--line)] last:border-b-0">
                                                <td className="px-5 py-3 font-mono w-[40%]" style={{ color: aWins ? 'var(--a-blue)' : 'var(--ink)' }}>
                                                    {r.a !== null ? r.fmt(r.a) : 'Not listed'}{aWins ? ' ✓' : ''}
                                                </td>
                                                <th scope="row" className="py-3 font-normal text-[var(--mute)] text-center">{r.label}</th>
                                                <td className="px-5 py-3 font-mono text-right w-[40%]" style={{ color: bWins ? 'var(--a-blue)' : 'var(--ink)' }}>
                                                    {bWins ? '✓ ' : ''}{r.b !== null ? r.fmt(r.b) : 'Not listed'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <Link href={pair.href} className="block px-5 py-4 border-t border-[var(--line)] text-[15px] font-medium hover:bg-[var(--panel)]" style={{ color: BLUE }}>
                                See the full comparison ›
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Guides: text only */}
            <section className="px-5 pt-24 md:pt-36" aria-labelledby="guides-heading">
                <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <h2 id="guides-heading" className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">The best, ranked.</h2>
                        <p className="mt-3 text-lg text-[var(--mute)]">Buying guides that update as new handhelds arrive.</p>
                    </div>
                    <ul className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 border-t border-[var(--line)]">
                        {data.guides.map((g) => (
                            <li key={g.href} className="border-b border-[var(--line)]">
                                <Link href={g.href} title={g.title} className="group block py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--a-blue)]">
                                    <p className="text-lg font-bold tracking-[-0.01em] group-hover:underline">{g.label}</p>
                                    <p className="mt-1 text-sm text-[var(--mute)] line-clamp-2">{g.description}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Finder, with a controller drawn in CSS */}
            <section className="px-5 pt-28 md:pt-40 pb-28 md:pb-40" aria-labelledby="finder-heading">
                <div className="max-w-[1200px] mx-auto rounded-[var(--r-lg)] bg-[var(--finder-bg)] text-[var(--finder-ink)] px-8 py-14 md:p-20 grid md:grid-cols-[1fr_auto] gap-12 items-center overflow-hidden">
                    <div>
                        <h2 id="finder-heading" className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05]">Still deciding?</h2>
                        <p className="mt-4 text-lg md:text-xl text-[var(--finder-mute)] max-w-[32ch]">Answer eight quick questions and get a ranked shortlist made for you.</p>
                        <Link href="/finder" className="mt-8 inline-block pill rounded-[var(--r-pill)] bg-[var(--finder-btn)] text-[var(--finder-btn-ink)] px-6 py-3 text-[15px] font-medium hover:opacity-85">Start the Finder</Link>
                    </div>
                    <div aria-hidden className="flex items-center gap-12 md:gap-16 justify-center">
                        <div className="relative w-24 h-24">
                            <span className="absolute left-1/3 top-0 w-1/3 h-full bg-[var(--dpad)] rounded-[4px]" />
                            <span className="absolute top-1/3 left-0 h-1/3 w-full bg-[var(--dpad)] rounded-[4px]" />
                        </div>
                        <div className="rotate-[-20deg] flex gap-4">
                            <span className="w-14 h-14 rounded-full" style={{ background: 'var(--btn-a)' }} />
                            <span className="w-14 h-14 rounded-full translate-y-[-14px]" style={{ background: 'var(--btn-b)' }} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
