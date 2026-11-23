'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RATING, SYSTEMS, type HomeDevice, type HomeGuide, type SystemKey } from './home-types';

const BUDGETS = [
    { label: 'Any price', max: Infinity },
    { label: 'Under $100', max: 100 },
    { label: 'Under $200', max: 200 },
    { label: 'Under $400', max: 400 },
];
const RATING_DOT = ['bg-zinc-500', 'bg-rose-500', 'bg-orange-500', 'bg-emerald-500', 'bg-emerald-500'];
const SHOWN = 5;

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500';

function Toggle({ on, onClick, children, active }: { on: boolean; onClick: () => void; children: string; active: string }) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 font-mono text-sm transition-colors ${focus} ${on ? active : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'}`}
        >
            {children}
        </button>
    );
}

/**
 * "Which one is right for you?": pick systems and a budget, see the best matches as a
 * ranked table. The default (PS2, under $200) is rendered on the server, so the first
 * paint already shows results and links.
 */
export default function HandheldPicker({ devices, guides }: { devices: HomeDevice[]; guides: HomeGuide[] }) {
    const [systems, setSystems] = useState<SystemKey[]>(['ps2']);
    const [budget, setBudget] = useState(2);

    const results = useMemo(() => {
        const max = BUDGETS[budget].max;
        const score = (d: HomeDevice) => systems.reduce((n, k) => n + d.emu[k], 0);
        return devices
            .filter((d) => systems.every((k) => d.emu[k] >= 2))
            .filter((d) => max === Infinity || (d.price !== null && d.price <= max))
            .sort((a, b) => score(b) - score(a) || (a.price ?? 9999) - (b.price ?? 9999));
    }, [devices, systems, budget]);

    const first = systems[0];
    const firstLabel = first ? SYSTEMS.find((s) => s.key === first)!.label : null;

    return (
        <section className="px-5 md:px-12 pt-14 md:pt-28" aria-labelledby="picker-heading">
            <div className="max-w-[1200px] mx-auto">
                <h2 id="picker-heading" className="text-[28px] leading-tight sm:text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">Which one is right for you?</h2>
                <p className="mt-3 text-base sm:text-lg text-text-secondary">Pick what you want to play and what you want to spend.</p>

                <div className="mt-6 md:mt-8 flex flex-col items-stretch sm:items-start gap-3">
                    <div role="group" aria-label="Systems" className="flex sm:inline-flex sm:flex-wrap overflow-x-auto no-scrollbar border border-white/10 p-1 gap-1">
                        {SYSTEMS.map((s) => (
                            <Toggle
                                key={s.key}
                                on={systems.includes(s.key)}
                                active="bg-white text-black"
                                onClick={() => setSystems((cur) => (cur.includes(s.key) ? cur.filter((k) => k !== s.key) : [...cur, s.key]))}
                            >
                                {s.label}
                            </Toggle>
                        ))}
                    </div>
                    <div role="group" aria-label="Budget" className="flex sm:inline-flex sm:flex-wrap overflow-x-auto no-scrollbar border border-white/10 p-1 gap-1">
                        {BUDGETS.map((b, i) => (
                            <Toggle key={b.label} on={budget === i} active="bg-violet-600 text-white" onClick={() => setBudget(i)}>
                                {b.label}
                            </Toggle>
                        ))}
                    </div>
                </div>

                <div className="mt-6 md:mt-8 border border-white/10">
                    <p className="px-4 sm:px-5 py-3 text-sm text-text-secondary border-b border-white/10" aria-live="polite">
                        {results.length} {results.length === 1 ? 'match' : 'matches'}
                        {results.length > SHOWN ? ', best five first' : ''}
                    </p>
                    {results.length === 0 ? (
                        <p className="px-4 sm:px-5 py-10">Nothing fits yet. Raise the budget or drop a system.</p>
                    ) : (
                        <ol>
                            {results.slice(0, SHOWN).map((d, i) => (
                                <li key={d.slug} className="border-b border-white/10 last:border-b-0">
                                    <Link
                                        href={`/consoles/${d.slug}`}
                                        className={`grid grid-cols-[1.25rem_3.5rem_1fr_auto] md:grid-cols-[2rem_4rem_1.4fr_1fr_0.6fr_0.8fr_5rem] items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-white/[0.04] ${focus} focus-visible:-outline-offset-2`}
                                    >
                                        <span className="font-mono text-sm text-text-secondary">{i + 1}</span>
                                        <span className="relative w-14 h-10">
                                            {d.image && <Image src={d.image} alt="" fill sizes="56px" className="object-contain" />}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block font-semibold text-[15px] sm:text-base leading-snug md:truncate">{d.label}</span>
                                            {first && (
                                                <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${RATING_DOT[d.emu[first]]}`} />
                                                    {firstLabel} {RATING[d.emu[first]].toLowerCase()}
                                                </span>
                                            )}
                                        </span>
                                        <span className="hidden md:block font-mono text-sm text-cyan-400 truncate">{d.chip ?? 'Not listed'}</span>
                                        <span className="hidden md:block font-mono text-sm text-cyan-400">{d.screenIn ? `${d.screenIn}"` : 'Not listed'}</span>
                                        <span className="hidden md:block font-mono text-sm text-cyan-400">{d.batteryMah ? `${d.batteryMah} mAh` : 'Not listed'}</span>
                                        <span className="font-mono text-sm text-right">{d.price ? `$${d.price}` : 'Not listed'}</span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">
                    Or see a ranked guide:{' '}
                    {guides.map((g, i) => (
                        <span key={g.href}>
                            <Link href={g.href} title={g.title} className={`text-violet-400 hover:text-white underline-offset-4 hover:underline ${focus}`}>
                                {g.label}
                            </Link>
                            {i < guides.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
}
