'use client';
/* PROTOTYPE (throwaway): Mockup B "What do you want to play?". The hero is a live filter:
 * pick systems and a budget, and the matching handhelds update underneath. Below it, a
 * mixed-size grid of guides, matchups and the newest devices. */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SYSTEMS, type HomeData, type SystemKey } from './data';

const BUDGETS = [
    { label: 'Any budget', max: Infinity },
    { label: 'Under $100', max: 100 },
    { label: 'Under $200', max: 200 },
    { label: 'Under $400', max: 400 },
];
const RATING = ['Unknown', 'Struggles', 'Playable', 'Great', 'Perfect'];

export default function VariantPlay({ data }: { data: HomeData }) {
    const [systems, setSystems] = useState<SystemKey[]>(['ps2']);
    const [budget, setBudget] = useState(2);
    const toggle = (k: SystemKey) =>
        setSystems((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

    const results = useMemo(() => {
        const max = BUDGETS[budget].max;
        return data.all
            .filter((d) => systems.every((k) => d.emu[k] >= 2))
            .filter((d) => max === Infinity || (d.price !== null && d.price <= max))
            .sort((a, b) => {
                const sa = systems.reduce((n, k) => n + a.emu[k], 0);
                const sb = systems.reduce((n, k) => n + b.emu[k], 0);
                return sb - sa || (a.price ?? 9999) - (b.price ?? 9999);
            });
    }, [data.all, systems, budget]);

    const sysNames = systems.map((k) => SYSTEMS.find((s) => s.key === k)!.label);
    const summary =
        `${results.length} ${results.length === 1 ? 'handheld plays' : 'handhelds play'} ` +
        (sysNames.length ? sysNames.join(' and ') : 'anything') +
        (BUDGETS[budget].max === Infinity ? '' : ` ${BUDGETS[budget].label.toLowerCase()}`);

    return (
        <div className="bg-black text-white min-h-screen">
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-12 max-w-[1600px] mx-auto">
                <p className="font-mono text-sm text-zinc-400 mb-6">
                    {data.counts.consoles} retro handhelds, every spec, side by side
                </p>
                <h1 className="font-pixel text-3xl sm:text-5xl xl:text-6xl leading-[1.2]">What do you want to play?</h1>

                <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Systems">
                    {SYSTEMS.map((s) => {
                        const on = systems.includes(s.key);
                        return (
                            <button
                                key={s.key}
                                aria-pressed={on}
                                onClick={() => toggle(s.key)}
                                className={`px-4 py-2.5 border font-mono text-sm transition-colors ${on ? 'bg-violet-500 border-violet-500 text-white' : 'border-white/20 text-zinc-300 hover:border-white'}`}
                            >
                                {s.label}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Budget">
                    {BUDGETS.map((b, i) => (
                        <button
                            key={b.label}
                            aria-pressed={budget === i}
                            onClick={() => setBudget(i)}
                            className={`px-4 py-2.5 border font-mono text-sm transition-colors ${budget === i ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/20 text-zinc-300 hover:border-white'}`}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>

                <p className="mt-12 text-2xl md:text-4xl font-bold tracking-tight" aria-live="polite">{summary}</p>
                {results.length === 0 ? (
                    <p className="mt-6 text-zinc-400">Nothing fits yet. Raise the budget or drop a system.</p>
                ) : (
                    <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
                        {results.slice(0, 8).map((d) => (
                            <li key={d.slug} className="bg-black">
                                <Link href={`/consoles/${d.slug}`} className="group flex flex-col h-full hover:bg-white hover:text-black">
                                    <div className="relative aspect-[4/3]">
                                        {d.image && <Image src={d.image} alt="" fill sizes="25vw" className="object-contain p-5" />}
                                    </div>
                                    <div className="p-4 mt-auto">
                                        <p className="font-semibold truncate">{d.name}</p>
                                        <p className="font-mono text-xs text-zinc-400 group-hover:text-zinc-700 mt-1">
                                            {d.price ? `$${d.price}` : 'Price not listed'}
                                            {systems[0] ? `, ${SYSTEMS.find((s) => s.key === systems[0])!.label} ${RATING[d.emu[systems[0]]].toLowerCase()}` : ''}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/finder" className="bg-white text-black font-mono text-sm px-6 py-3.5 hover:bg-violet-500 hover:text-white">Get a ranked shortlist</Link>
                    <Link href="/consoles" className="border border-white/30 font-mono text-sm px-6 py-3.5 hover:bg-white hover:text-black">Browse all {data.counts.consoles}</Link>
                </div>
            </header>

            {/* Mixed-size grid */}
            <section className="px-5 md:px-12 pb-20 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-px bg-white/10 border border-white/10">
                    <div className="md:col-span-3 md:row-span-2 bg-black p-6 md:p-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">Popular head-to-heads</h2>
                        <ul className="divide-y divide-white/10">
                            {data.pairs.slice(0, 8).map((p) => (
                                <li key={p.href}>
                                    <Link href={p.href} className="flex justify-between gap-4 py-3 hover:text-violet-400">
                                        <span>{p.a.name}</span>
                                        <span className="font-mono text-xs text-zinc-500 self-center">vs</span>
                                        <span className="text-right">{p.b.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {data.guides.slice(0, 4).map((g) => (
                        <Link key={g.href} href={g.href} className="md:col-span-3 lg:col-span-3 bg-black p-6 md:p-8 group hover:bg-white hover:text-black flex items-center gap-6">
                            <div className="flex -space-x-6 shrink-0">
                                {g.picks.slice(0, 3).map((d) => (
                                    <div key={d.slug} className="relative w-16 h-16">
                                        {d.image && <Image src={d.image} alt="" fill sizes="64px" className="object-contain" />}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-xl font-bold tracking-tight">{g.label}</p>
                                <p className="text-sm text-zinc-400 group-hover:text-zinc-700">{g.picks.length} picks, ranked</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
