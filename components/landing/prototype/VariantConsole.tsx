'use client';
/* PROTOTYPE (throwaway): Mockups E and F, "Apple meets 90s Nintendo".
 * An Apple-style product page built from 90s console parts: grey plastic panels, the four
 * coloured face buttons as the only accents, and a Game Boy green screen as the spec
 * readout was dropped after review. E is light plastic, F dark, G the site's own theme. */
import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SYSTEMS, type HomeData, type SystemKey } from './data';

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
            <header className="px-5 pt-16 md:pt-24 text-center">
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

            </header>

            {/* Picker, right under the hero headline */}
            <section className="px-5 text-center" aria-label="Find a handheld">
                <p className="mt-12 text-lg md:text-xl font-semibold">What do you want to play, and what do you want to spend?</p>
                <div className="mt-6 flex flex-col items-center gap-3">
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
                <p className="mt-8 text-[var(--mute)]" aria-live="polite">
                    {results.length} {results.length === 1 ? 'match' : 'matches'}
                    {results.length > 4 ? ', top four shown' : ''}
                </p>

                {results.length === 0 ? (
                    <p className="mt-10 text-xl">Nothing fits yet. Raise the budget or drop a system.</p>
                ) : (
                    <div className="mt-10 max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 text-center">
                        {results.slice(0, 4).map((x) => (
                            <div key={x.slug} className="flex flex-col items-center">
                                <div className="relative w-36 h-28">
                                    {x.image && <Image src={x.image} alt="" fill sizes="144px" className="object-contain" />}
                                </div>
                                <h3 className="mt-6 text-xl md:text-2xl font-bold tracking-[-0.02em]">{x.label}</h3>
                                <p className="mt-1 text-[var(--mute)]">{x.price ? `$${x.price} at launch` : 'Price not listed'}</p>
                                <Link href={`/consoles/${x.slug}`} className="mt-4 pill rounded-[var(--r-pill)] bg-[var(--pill)] text-[var(--pill-ink)] px-5 py-2 text-sm font-medium hover:opacity-85">See specs</Link>
                                <dl className="mt-8 w-full max-w-[240px] divide-y divide-[var(--line)] border-t border-[var(--line)] text-sm">
                                    {first && (
                                        <div className="py-4">
                                            <dt className="sr-only">{sysLabel(first)}</dt>
                                            <dd className="flex items-center justify-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ background: RATING_COLOR[x.emu[first]] }} />
                                                {sysLabel(first)} runs {RATING[x.emu[first]].toLowerCase()}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="py-4"><dt className="text-[var(--mute)]">Screen</dt><dd className="font-mono text-base text-[var(--data)]">{x.screenIn ? `${x.screenIn}"` : 'Not listed'}</dd></div>
                                    <div className="py-4"><dt className="text-[var(--mute)]">Chip</dt><dd className="font-mono text-base text-[var(--data)]">{x.chip ?? 'Not listed'}</dd></div>
                                    <div className="py-4"><dt className="text-[var(--mute)]">Battery</dt><dd className="font-mono text-base text-[var(--data)]">{x.batteryMah ? `${x.batteryMah} mAh` : 'Not listed'}</dd></div>
                                </dl>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-12 flex justify-center items-center gap-6">
                    <Link href="/consoles" className="pill rounded-[var(--r-pill)] bg-[var(--pill)] text-[var(--pill-ink)] px-6 py-3 text-[15px] font-medium hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--a-blue)]">
                        Browse handhelds
                    </Link>
                    <Link href="/arena" className="text-[15px] font-medium hover:underline" style={{ color: BLUE }}>Compare two ›</Link>
                </div>
            </section>

            {/* Newest */}
            <section className="px-5 pt-28 md:pt-40" aria-labelledby="new-heading">
                <div className="max-w-[1200px] mx-auto">
                    <h2 id="new-heading" className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] text-center">Just added.</h2>
                    <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)]">
                        {data.newest.map((n) => (
                            <li key={n.slug} className="bg-[var(--shell)]">
                                <Link href={`/consoles/${n.slug}`} className="group flex items-center gap-4 p-4 h-full hover:bg-[var(--panel)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--a-blue)]">
                                    <div className="relative w-16 h-12 shrink-0">{n.image && <Image src={n.image} alt="" fill sizes="64px" className="object-contain" />}</div>
                                    <div className="min-w-0 text-left">
                                        <p className="font-semibold truncate">{n.label}</p>
                                        <p className="font-mono text-xs text-[var(--data)]">{[n.screenIn ? `${n.screenIn}"` : null, n.price ? `$${n.price}` : null].filter(Boolean).join(', ') || 'See specs'}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Head-to-heads */}
            <section className="px-5 pt-28 md:pt-40" aria-labelledby="vs-heading">
                <div className="max-w-[1200px] mx-auto">
                    <h2 id="vs-heading" className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] text-center">Head to head.</h2>
                    <p className="mt-4 text-lg md:text-xl text-[var(--mute)] text-center">The comparisons people look up most.</p>
                    <div className="mt-12 grid md:grid-cols-2 gap-5">
                        {data.pairs.slice(0, 4).map((p) => (
                            <Link key={p.href} href={p.href} className="group rounded-[var(--r-lg)] bg-[var(--card)] border border-[var(--line)] p-8 flex flex-col items-center text-center hover:border-[var(--ink)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--a-blue)]">
                                <div className="flex items-center justify-center gap-4 w-full">
                                    <div className="relative w-28 h-24">{p.a.image && <Image src={p.a.image} alt="" fill sizes="112px" className="object-contain" />}</div>
                                    <span className="font-pixel text-xs text-[var(--mute)]">VS</span>
                                    <div className="relative w-28 h-24">{p.b.image && <Image src={p.b.image} alt="" fill sizes="112px" className="object-contain" />}</div>
                                </div>
                                <p className="mt-6 text-xl font-bold tracking-[-0.02em]">{p.a.label} vs {p.b.label}</p>
                                <p className="mt-2 text-[15px] font-medium group-hover:underline" style={{ color: BLUE }}>Compare ›</p>
                            </Link>
                        ))}
                    </div>
                    <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px]">
                        {data.pairs.slice(4, 12).map((p) => (
                            <li key={p.href}><Link href={p.href} className="hover:underline" style={{ color: BLUE }}>{p.a.label} vs {p.b.label}</Link></li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Guides */}
            <section className="px-5 pt-28 md:pt-40" aria-labelledby="guides-heading">
                <div className="max-w-[1200px] mx-auto">
                    <h2 id="guides-heading" className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] text-center">The best, ranked.</h2>
                    <p className="mt-4 text-lg md:text-xl text-[var(--mute)] text-center">Buying guides that update as new handhelds arrive.</p>
                    <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {data.guides.map((g) => (
                            <li key={g.href}>
                                <Link href={g.href} title={g.title} className="group h-full rounded-[var(--r-lg)] bg-[var(--panel)] border border-[var(--line)] p-6 flex flex-col gap-5 hover:border-[var(--ink)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--a-blue)]">
                                    <div className="flex -space-x-2 h-16">
                                        {g.picks.slice(0, 3).map((x) => (
                                            <div key={x.slug} className="relative w-14 h-16">{x.image && <Image src={x.image} alt="" fill sizes="64px" className="object-contain" />}</div>
                                        ))}
                                    </div>
                                    <p className="text-xl md:text-2xl font-bold tracking-[-0.02em] leading-tight">{g.label}</p>
                                    <p className="mt-auto text-sm text-[var(--mute)]">{g.picks.length} picks</p>
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
