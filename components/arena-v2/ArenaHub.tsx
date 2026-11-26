'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { pairKey } from '../../lib/arena/indexable';
import DevicePicker, { type PickerConsole } from './DevicePicker';
import { PageTitle } from '../layout/PageTitle';

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500';

function Slot({ n, value, others, onPick, onClear }: {
    n: 1 | 2;
    value: PickerConsole | null;
    others: PickerConsole[];
    onPick: (c: PickerConsole) => void;
    onClear: () => void;
}) {
    return (
        <div className="p-5 md:p-8 min-h-[14rem] flex flex-col">
            <p className="font-pixel text-[10px] text-text-secondary">HANDHELD {n}</p>
            {value ? (
                <div className="mt-5 flex-1 flex flex-col">
                    <span className="relative w-full h-24 md:h-32">{value.image && <Image src={value.image} alt="" fill sizes="200px" className="object-contain" />}</span>
                    <p className="mt-4 text-lg md:text-2xl font-bold leading-tight">{value.label}</p>
                    <button type="button" onClick={onClear} className={`mt-3 self-start font-mono text-xs text-violet-400 hover:text-white ${focus}`}>Change</button>
                </div>
            ) : (
                <div className="mt-4"><DevicePicker consoles={others} onPick={onPick} label={n === 1 ? 'First handheld' : 'Second handheld'} /></div>
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

                <div className="mt-8 md:mt-10 grid md:grid-cols-[1fr_auto_1fr] border border-white/10">
                    <Slot n={1} value={one} others={consoles.filter((c) => c.slug !== two?.slug)} onPick={setOne} onClear={() => setOne(null)} />
                    <div className="flex md:flex-col items-center justify-center border-y md:border-y-0 md:border-x border-white/10 px-4 py-3">
                        <span className="font-pixel text-xs text-text-secondary">VS</span>
                    </div>
                    <Slot n={2} value={two} others={consoles.filter((c) => c.slug !== one?.slug)} onPick={setTwo} onClear={() => setTwo(null)} />
                </div>
                {one && two ? (
                    <Link href={`${base}/${pairKey(one.slug, two.slug)}`} className={`block text-center bg-violet-600 hover:bg-white hover:text-black text-white font-mono text-sm px-6 py-4 transition-colors ${focus}`}>
                        Compare {one.label} and {two.label}
                    </Link>
                ) : (
                    <p className="border border-t-0 border-white/10 px-5 py-4 font-mono text-sm text-text-secondary text-center">Pick two to compare</p>
                )}

                <section className="mt-16 md:mt-24" aria-labelledby="popular-heading">
                    <h2 id="popular-heading" className="font-pixel text-base md:text-xl leading-snug text-sky-400">Popular comparisons</h2>
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
