'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RATING, type HomeDevice, type HomePair } from './home-types';

type Row = { label: string; a: number | null; b: number | null; fmt: (n: number) => string; lowerWins?: boolean };

const rows = (a: HomeDevice, b: HomeDevice): Row[] => [
    { label: 'Screen', a: a.screenIn, b: b.screenIn, fmt: (n) => `${n}"` },
    { label: 'RAM', a: a.ramGb, b: b.ramGb, fmt: (n) => `${n} GB` },
    { label: 'Battery', a: a.batteryMah, b: b.batteryMah, fmt: (n) => `${n} mAh` },
    { label: 'Weight', a: a.weightG, b: b.weightG, fmt: (n) => `${n} g`, lowerWins: true },
    { label: 'Launch price', a: a.price, b: b.price, fmt: (n) => `$${n}`, lowerWins: true },
    { label: 'PS2', a: a.emu.ps2 || null, b: b.emu.ps2 || null, fmt: (n) => RATING[n] },
];

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500';
const TABS = 6;

function Thumb({ d }: { d: HomeDevice }) {
    return (
        <span className="relative w-14 h-10 shrink-0">
            {d.image && <Image src={d.image} alt="" fill sizes="56px" className="object-contain" />}
        </span>
    );
}

/**
 * The most searched comparisons: pick one on the left, see a short spec comparison on the
 * right with the better number on each row marked. Every matchup is also a plain link
 * (the full comparison below the table and the "more" list), so crawlers reach them all.
 */
export default function HeadToHead({ pairs }: { pairs: HomePair[] }) {
    const [ix, setIx] = useState(0);
    const pair = pairs[ix];
    if (!pair) return null;
    const { a, b } = pair;

    return (
        <section className="px-5 md:px-12 pt-16 md:pt-36" aria-labelledby="vs-heading">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                <div className="lg:col-span-4 min-w-0">
                    <h2 id="vs-heading" className="text-[28px] leading-tight sm:text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">Head to head.</h2>
                    <p className="mt-3 text-base sm:text-lg text-text-secondary">The comparisons people look up most.</p>
                    <div className="mt-6 lg:mt-8 flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto no-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0" role="tablist" aria-label="Matchups">
                        {pairs.slice(0, TABS).map((p, i) => (
                            <button
                                key={p.href}
                                type="button"
                                role="tab"
                                id={`vs-tab-${i}`}
                                aria-selected={i === ix}
                                aria-controls="vs-panel"
                                onClick={() => setIx(i)}
                                className={`shrink-0 lg:shrink text-left whitespace-nowrap lg:whitespace-normal px-3 lg:px-0 py-2 lg:py-2.5 border lg:border-0 lg:border-b border-white/10 text-sm lg:text-[15px] ${focus} ${i === ix ? 'bg-white text-black lg:bg-transparent lg:text-white font-semibold' : 'text-text-secondary hover:text-white'}`}
                            >
                                {p.a.label} vs {p.b.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div id="vs-panel" role="tabpanel" aria-labelledby={`vs-tab-${ix}`} className="lg:col-span-8 min-w-0 border border-white/10 self-start">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 border-b border-white/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                            <Thumb d={a} />
                            <p className="font-bold text-sm sm:text-base leading-snug sm:truncate">{a.label}</p>
                        </div>
                        <span className="font-pixel text-[10px] text-text-secondary">VS</span>
                        <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center justify-end gap-2 sm:gap-3 min-w-0">
                            <p className="font-bold text-sm sm:text-base leading-snug sm:truncate text-right">{b.label}</p>
                            <Thumb d={b} />
                        </div>
                    </div>
                    <table className="w-full text-sm">
                        <caption className="sr-only">{a.label} compared with {b.label}. The better value on each row is marked.</caption>
                        <tbody>
                            {rows(a, b).map((r) => {
                                const both = r.a !== null && r.b !== null && r.a !== r.b;
                                const aWins = both && (r.lowerWins ? r.a! < r.b! : r.a! > r.b!);
                                const bWins = both && !aWins;
                                return (
                                    <tr key={r.label} className="border-b border-white/10 last:border-b-0">
                                        <td className={`px-4 sm:px-5 py-3 font-mono w-[38%] sm:w-[40%] ${aWins ? 'text-violet-400' : ''}`}>
                                            {r.a !== null ? r.fmt(r.a) : 'Not listed'}
                                            {aWins && <span aria-label="better"> ✓</span>}
                                        </td>
                                        <th scope="row" className="py-3 font-normal text-xs sm:text-sm text-text-secondary text-center">{r.label}</th>
                                        <td className={`px-4 sm:px-5 py-3 font-mono text-right w-[38%] sm:w-[40%] ${bWins ? 'text-violet-400' : ''}`}>
                                            {bWins && <span aria-label="better">✓ </span>}
                                            {r.b !== null ? r.fmt(r.b) : 'Not listed'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <Link href={pair.href} className={`block px-4 sm:px-5 py-4 border-t border-white/10 font-mono text-sm text-violet-400 hover:bg-white hover:text-black ${focus} focus-visible:-outline-offset-2`}>
                        See the full comparison
                    </Link>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto mt-8">
                {pairs.length > TABS && (
                    <>
                        <h3 className="font-mono text-sm text-text-secondary">Also compared often</h3>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {pairs.slice(TABS).map((p) => (
                                <li key={p.href}>
                                    <Link href={p.href} className={`block px-3 py-2 border border-white/10 text-sm hover:bg-white hover:text-black transition-colors ${focus}`}>
                                        {p.a.label} vs {p.b.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <Link href="/arena" className={`inline-block mt-4 font-mono text-sm text-violet-400 hover:text-white ${focus}`}>
                    Or pick any two yourself
                </Link>
            </div>
        </section>
    );
}
