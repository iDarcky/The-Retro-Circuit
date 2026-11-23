'use client';
/* PROTOTYPE (throwaway): Mockup C "Arena". The hero is a live head-to-head: two handhelds
 * face off, spec by spec, and the better number on each row lights up. Pick another
 * popular matchup from the tabs. */
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomeData, HomeDevice } from './data';

type Row = { label: string; a: number | null; b: number | null; fmt: (n: number) => string; lowerWins?: boolean };
const RATING = ['Unknown', 'Struggles', 'Playable', 'Great', 'Perfect'];

const rows = (a: HomeDevice, b: HomeDevice): Row[] => [
    { label: 'Screen', a: a.screenIn, b: b.screenIn, fmt: (n) => `${n}"` },
    { label: 'Pixels', a: a.pixels, b: b.pixels, fmt: (n) => `${(n / 1e6).toFixed(2)} MP` },
    { label: 'RAM', a: a.ramGb, b: b.ramGb, fmt: (n) => `${n} GB` },
    { label: 'Battery', a: a.batteryMah, b: b.batteryMah, fmt: (n) => `${n} mAh` },
    { label: 'Weight', a: a.weightG, b: b.weightG, fmt: (n) => `${n} g`, lowerWins: true },
    { label: 'Launch price', a: a.price, b: b.price, fmt: (n) => `$${n}`, lowerWins: true },
    { label: 'PS2', a: a.emu.ps2 || null, b: b.emu.ps2 || null, fmt: (n) => RATING[n] },
    { label: 'GameCube', a: a.emu.gamecube || null, b: b.emu.gamecube || null, fmt: (n) => RATING[n] },
];

function Side({ d, color, align }: { d: HomeDevice; color: string; align: 'left' | 'right' }) {
    return (
        <Link href={`/consoles/${d.slug}`} className={`group flex flex-col ${align === 'right' ? 'items-end text-right' : ''}`}>
            <div className="relative w-full aspect-square max-h-[42vh]">
                {d.image && <Image src={d.image} alt={d.name} fill priority sizes="40vw" className="object-contain" />}
            </div>
            <p className={`font-mono text-xs mt-4 ${color}`}>{d.brand}</p>
            <p className="text-2xl md:text-5xl font-black tracking-tighter leading-none mt-1 group-hover:underline">{d.name}</p>
        </Link>
    );
}

export default function VariantArena({ data }: { data: HomeData }) {
    const [i, setI] = useState(0);
    const pair = data.pairs[i];
    if (!pair) return null;
    const { a, b } = pair;

    return (
        <div className="bg-black text-white min-h-screen">
            <header className="px-5 md:px-12 pt-10 md:pt-14 pb-14 max-w-[1600px] mx-auto">
                <h1 className="font-pixel text-xl sm:text-3xl leading-snug max-w-3xl">Which handheld wins? Put any two side by side.</h1>

                <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Popular matchups">
                    {data.pairs.slice(0, 8).map((p, j) => (
                        <button
                            key={p.href}
                            role="tab"
                            aria-selected={i === j}
                            onClick={() => setI(j)}
                            className={`shrink-0 px-3 py-2 border font-mono text-xs ${i === j ? 'bg-white text-black border-white' : 'border-white/20 text-zinc-400 hover:border-white hover:text-white'}`}
                        >
                            {p.a.name} vs {p.b.name}
                        </button>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-end gap-4 md:gap-10">
                    <Side d={a} color="text-cyan-400" align="left" />
                    <span className="font-pixel text-2xl md:text-5xl text-zinc-600 pb-2">VS</span>
                    <Side d={b} color="text-violet-400" align="right" />
                </div>

                <table className="w-full mt-10 border-t border-white/10 text-sm md:text-base">
                    <caption className="sr-only">{a.name} compared with {b.name}</caption>
                    <tbody>
                        {rows(a, b).map((r) => {
                            const both = r.a !== null && r.b !== null && r.a !== r.b;
                            const aWins = both && (r.lowerWins ? r.a! < r.b! : r.a! > r.b!);
                            const bWins = both && !aWins;
                            return (
                                <tr key={r.label} className="border-b border-white/10">
                                    <td className={`py-3 pr-4 font-mono w-[40%] ${aWins ? 'text-black bg-cyan-400 pl-3' : 'text-zinc-300'}`}>
                                        {r.a !== null ? r.fmt(r.a) : 'Not listed'}
                                    </td>
                                    <th scope="row" className="py-3 px-2 font-normal text-zinc-500 text-center text-xs md:text-sm">{r.label}</th>
                                    <td className={`py-3 pl-4 font-mono text-right w-[40%] ${bWins ? 'text-white bg-violet-600 pr-3' : 'text-zinc-300'}`}>
                                        {r.b !== null ? r.fmt(r.b) : 'Not listed'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={pair.href} className="bg-white text-black font-mono text-sm px-6 py-3.5 hover:bg-violet-500 hover:text-white">See the full comparison</Link>
                    <Link href="/arena" className="border border-white/30 font-mono text-sm px-6 py-3.5 hover:bg-white hover:text-black">Pick your own two</Link>
                </div>
            </header>

            <section className="border-t border-white/10 px-5 md:px-12 py-14 max-w-[1600px] mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Just added</h2>
                <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-white/10 border border-white/10">
                    {data.newest.map((d) => (
                        <li key={d.slug} className="bg-black">
                            <Link href={`/consoles/${d.slug}`} className="group block hover:bg-white hover:text-black">
                                <div className="relative aspect-square">{d.image && <Image src={d.image} alt="" fill sizes="12vw" className="object-contain p-4" />}</div>
                                <p className="px-3 pb-3 text-sm font-semibold truncate">{d.name}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="border-t border-white/10 px-5 md:px-12 py-14 max-w-[1600px] mx-auto grid md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Buying guides</h2>
                    <ul className="grid grid-cols-2 gap-x-6">
                        {data.guides.map((g) => (
                            <li key={g.href} className="border-b border-white/10">
                                <Link href={g.href} className="block py-3 hover:text-violet-400">{g.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-cyan-400 text-black p-8 flex flex-col justify-between gap-6">
                    <p className="text-2xl md:text-3xl font-black tracking-tight">Not sure which two to compare? Let the Finder pick.</p>
                    <Link href="/finder" className="self-start bg-black text-white font-mono text-sm px-6 py-3.5 hover:bg-white hover:text-black">Start the Finder</Link>
                </div>
            </section>
        </div>
    );
}
