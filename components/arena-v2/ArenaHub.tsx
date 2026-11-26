'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { pairKey } from '../../lib/arena/indexable';
import DevicePicker, { type PickerConsole } from './DevicePicker';
import { PageTitle } from '../layout/PageTitle';

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500';

const SIDE = {
    1: { label: '[ PLAYER 1 ]', text: 'text-blue-400', panel: 'border-blue-500/30 bg-blue-950/30', ready: 'border-blue-500 bg-blue-900/30', line: 'via-blue-500', glow: 'rgba(37,99,235,0.35)' },
    2: { label: '[ PLAYER 2 ]', text: 'text-red-400', panel: 'border-red-500/30 bg-red-950/30', ready: 'border-red-500 bg-red-900/30', line: 'via-red-500', glow: 'rgba(220,38,38,0.35)' },
} as const;

/* The old arena's player panels, brought back: blue and red glass with a lit top edge,
 * "READY" once a handheld is picked, and the handheld's name in pixel type. */
function Slot({ n, value, others, onPick, onClear }: {
    n: 1 | 2;
    value: PickerConsole | null;
    others: PickerConsole[];
    onPick: (c: PickerConsole) => void;
    onClear: () => void;
}) {
    const s = SIDE[n];
    return (
        <div className={`relative isolate focus-within:z-20 rounded-3xl border-2 backdrop-blur-xl p-5 md:p-8 min-h-[18rem] flex flex-col transition-colors duration-500 ${value ? s.ready : s.panel}`}>
            <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent ${s.line} to-transparent opacity-70`} />
            <span aria-hidden className="absolute inset-0 -z-10 overflow-hidden rounded-3xl"><span className={`absolute left-1/2 top-1/2 w-64 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-500 ${value ? 'opacity-100' : 'opacity-40'}`} style={{ background: s.glow }} /></span>
            <div className={`flex items-center justify-between gap-3 ${n === 2 ? 'md:flex-row-reverse' : ''}`}>
                <p className={`font-pixel text-[10px] md:text-xs ${s.text}`}>{s.label}</p>
                {value && <span className={`font-mono text-xs font-bold tracking-widest ${s.text} motion-safe:animate-pulse`}>READY</span>}
            </div>
            {value ? (
                <div className={`mt-6 flex-1 flex flex-col ${n === 2 ? 'md:items-end md:text-right' : ''}`}>
                    <span className="relative w-full h-28 md:h-40 motion-safe:animate-[spriteBob_1.2s_steps(2,jump-none)_infinite]">{value.image && <Image src={value.image} alt="" fill sizes="240px" className="object-contain" />}</span>
                    <p className="mt-5 font-pixel text-sm md:text-lg leading-snug text-white">{value.label}</p>
                    <button type="button" onClick={onClear} className={`mt-4 self-start ${n === 2 ? 'md:self-end' : ''} font-mono text-xs text-white/50 hover:text-white hover:underline ${focus}`}>Change</button>
                </div>
            ) : (
                <div className="mt-5">
                    <DevicePicker consoles={others} onPick={onPick} label={n === 1 ? 'Pick the first handheld' : 'Pick the challenger'} />
                    <p className={`mt-6 font-pixel text-[9px] ${s.text} opacity-50 motion-safe:animate-pulse`}>AWAITING {n === 1 ? 'PLAYER' : 'CHALLENGER'}</p>
                </div>
            )}
        </div>
    );
}

/** /arena with nothing picked: choose two, or start from a comparison people already make. */
export default function ArenaHub({ consoles, popular, base }: {
    consoles: PickerConsole[];
    popular: { href: string; a: string; b: string; label: string }[];
    base: string;
}) {
    const [one, setOne] = useState<PickerConsole | null>(null);
    const [two, setTwo] = useState<PickerConsole | null>(null);
    const img = new Map(consoles.map((c) => [c.slug, c.image]));
    const name = new Map(consoles.map((c) => [c.slug, c.label]));

    return (
        <div className="bg-bg-primary text-text-primary font-sans min-h-screen">
            <div className="max-w-[1100px] mx-auto px-5 pt-10 md:pt-16 pb-24">
                <PageTitle lead="VS" accent="Mode" color="vs" />
                <p className="mt-4 text-base md:text-lg text-text-secondary max-w-[52ch]">
                    Pick any two of {consoles.length} handhelds. See who wins, spec by spec.
                </p>

                <div className="mt-8 md:mt-10 grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-stretch">
                    <Slot n={1} value={one} others={consoles.filter((c) => c.slug !== two?.slug)} onPick={setOne} onClear={() => setOne(null)} />
                    <div className="flex md:flex-col items-center justify-center py-1">
                        <span className="font-pixel text-xl md:text-3xl italic text-white motion-safe:animate-pulse">VS</span>
                    </div>
                    <Slot n={2} value={two} others={consoles.filter((c) => c.slug !== one?.slug)} onPick={setTwo} onClear={() => setTwo(null)} />
                </div>
                {one && two ? (
                    <Link href={`${base}/${pairKey(one.slug, two.slug)}`} className={`mt-4 block rounded-2xl text-center bg-gradient-to-r from-blue-600 to-red-600 hover:from-white hover:to-white hover:text-black text-white font-pixel text-xs md:text-sm px-6 py-5 transition-colors ${focus}`}>
                        FIGHT: {one.label} vs {two.label}
                    </Link>
                ) : (
                    <p className="mt-4 rounded-2xl border border-white/10 px-5 py-4 font-mono text-sm text-text-secondary text-center">Pick two to compare</p>
                )}

                <section className="mt-16 md:mt-24" aria-labelledby="popular-heading">
                    <h2 id="popular-heading" className="font-pixel text-base md:text-xl leading-snug text-blue-400">Popular comparisons</h2>
                    <ul className="mt-6 grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                        {popular.map((p) => (
                            <li key={p.href} className="bg-bg-primary">
                                <Link href={p.href} className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 hover:bg-white/[0.04] ${focus} focus-visible:-outline-offset-2`}>
                                    <span className="flex -space-x-1">
                                        {[p.a, p.b].map((s) => (
                                            <span key={s} className="relative w-10 h-7">{img.get(s) && <Image src={img.get(s)!} alt="" fill sizes="40px" className="object-contain" />}</span>
                                        ))}
                                    </span>
                                    <span className="text-sm md:text-[15px] leading-snug">
                                        {name.get(p.a)} <span className="text-text-secondary">vs</span> {name.get(p.b)}
                                    </span>
                                    <span className="font-mono text-xs text-violet-400" aria-hidden>→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
