'use client';
/* PROTOTYPE (throwaway): Mockup A "Showroom". One handheld at a time, shown big like a
 * product launch, with the newest eight as a filmstrip and shelves of picks below. */
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomeData, HomeDevice } from './data';

const spec = (d: HomeDevice) => [
    ['Chip', d.chip],
    ['Screen', d.screenIn ? `${d.screenIn}"` : null],
    ['RAM', d.ramGb ? `${d.ramGb} GB` : null],
    ['Battery', d.batteryMah ? `${d.batteryMah} mAh` : null],
    ['Weight', d.weightG ? `${d.weightG} g` : null],
    ['Launch price', d.price ? `$${d.price}` : null],
] as const;

function Shelf({ title, href, devices }: { title: string; href: string; devices: HomeDevice[] }) {
    if (!devices.length) return null;
    return (
        <section className="py-10 md:py-14 border-t border-white/10">
            <div className="px-5 md:px-12 flex items-baseline justify-between gap-4 mb-5 max-w-[1600px] mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
                <Link href={href} className="font-mono text-sm text-violet-400 hover:text-white whitespace-nowrap">See the guide</Link>
            </div>
            <ul className="flex overflow-x-auto no-scrollbar snap-x px-5 md:px-12 max-w-[1600px] mx-auto">
                {devices.map((d) => (
                    <li key={d.slug} className="snap-start shrink-0 w-[62vw] sm:w-64 border border-white/10 -ml-px first:ml-0">
                        <Link href={`/consoles/${d.slug}`} className="group block hover:bg-white hover:text-black">
                            <div className="relative aspect-square bg-[#0e0e12] group-hover:bg-zinc-100">
                                {d.image && <Image src={d.image} alt="" fill sizes="256px" className="object-contain p-6" />}
                            </div>
                            <div className="p-4">
                                <p className="font-semibold truncate">{d.label}</p>
                                <p className="font-mono text-xs text-zinc-400 group-hover:text-zinc-700">{d.price ? `$${d.price}` : d.brand}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function VariantShowroom({ data }: { data: HomeData }) {
    const [i, setI] = useState(0);
    const d = data.newest[i];
    if (!d) return null;
    const guide = (label: string) => data.guides.find((g) => g.label === label);
    return (
        <div className="bg-black text-white min-h-screen">
            <header className="relative px-5 md:px-12 pt-8 md:pt-12 max-w-[1600px] mx-auto">
                <h1 className="font-mono text-sm text-zinc-400">
                    Retro handheld specs and comparisons, {data.counts.consoles} devices and counting
                </h1>
                <div className="grid lg:grid-cols-12 gap-6 items-center mt-6">
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <p className="font-mono text-xs text-violet-400 mb-3">Just added</p>
                        <p className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9]">{d.name}</p>
                        <p className="text-lg text-zinc-400 mt-3">{d.brand}</p>
                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-8">
                            {spec(d).map(([k, v]) => (
                                <div key={k} className="bg-black p-3">
                                    <dt className="text-xs text-zinc-500">{k}</dt>
                                    <dd className="font-mono text-cyan-400 truncate">{v ?? 'Not listed'}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="flex gap-3 mt-8">
                            <Link href={`/consoles/${d.slug}`} className="bg-white text-black font-mono text-sm px-6 py-3.5 hover:bg-violet-500 hover:text-white">See full specs</Link>
                            <Link href="/arena" className="border border-white/30 font-mono text-sm px-6 py-3.5 hover:bg-white hover:text-black">Compare it</Link>
                        </div>
                    </div>
                    <div key={d.slug} className="lg:col-span-7 order-1 lg:order-2 relative aspect-[4/3] lg:aspect-square max-h-[70vh] w-full">
                        {d.image && <Image src={d.image} alt={d.name} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-contain" />}
                    </div>
                </div>
                <ul className="flex gap-2 overflow-x-auto no-scrollbar mt-10 pb-2" aria-label="Newest handhelds">
                    {data.newest.map((n, j) => (
                        <li key={n.slug}>
                            <button
                                onClick={() => setI(j)}
                                aria-pressed={i === j}
                                aria-label={n.name}
                                className={`relative w-24 h-20 border ${i === j ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-white/50'}`}
                            >
                                {n.image && <Image src={n.image} alt="" fill sizes="96px" className="object-contain p-2" />}
                            </button>
                        </li>
                    ))}
                </ul>
            </header>
            <div className="mt-10">
                {['Under $100', 'PS2 emulation', 'Clamshell', 'Vertical'].map((l) => {
                    const g = guide(l);
                    return g ? <Shelf key={l} title={g.title} href={g.href} devices={g.picks} /> : null;
                })}
            </div>
            <section className="px-5 md:px-12 py-16 bg-violet-600">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <p className="text-3xl md:text-5xl font-black tracking-tighter max-w-2xl">Not sure? Answer 8 questions and get a shortlist.</p>
                    <Link href="/finder" className="bg-black text-white font-mono text-sm px-6 py-4 hover:bg-white hover:text-black self-start">Start the Finder</Link>
                </div>
            </section>
        </div>
    );
}
