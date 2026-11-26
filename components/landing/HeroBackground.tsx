'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/* BETA ONLY: four hero backgrounds with a small switcher, so the owner can pick one.
 * Once chosen, keep that one and delete the rest along with the switcher. */

export type HeroSprite = { slug: string; image: string };

const SPRITE_SPOTS = [
    'left-[3%] top-[10%] w-24 md:w-32',
    'left-[40%] top-[5%] w-16 md:w-20 hidden md:block',
    'right-[5%] top-[8%] w-20 md:w-28',
    'left-[6%] bottom-[16%] w-20 md:w-28 hidden sm:block',
    'left-[46%] bottom-[10%] w-16 md:w-24 hidden md:block',
    'right-[3%] bottom-[12%] w-24 md:w-32 hidden lg:block',
];

const OPTIONS = [
    { id: 'A', label: 'Dot grid' },
    { id: 'B', label: 'Dots + handhelds' },
    { id: 'C', label: 'Purple block' },
    { id: 'D', label: 'Game Boy photo' },
] as const;
type Opt = (typeof OPTIONS)[number]['id'];

const DOTS = (alpha: number): React.CSSProperties => ({
    backgroundImage: `radial-gradient(rgba(255,255,255,${alpha}) 1px, transparent 1.3px)`,
    backgroundSize: '22px 22px',
});

export default function HeroBackground({ sprites }: { sprites: HeroSprite[] }) {
    const [bg, setBg] = useState<Opt>('B');

    // Tell the hero which background is on, so text colours can follow (purple block).
    useEffect(() => {
        document.documentElement.dataset.heroBg = bg;
    }, [bg]);

    return (
        <>
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                {bg === 'A' && <div className="absolute inset-0" style={DOTS(0.1)} />}
                {bg === 'B' && (
                    <>
                        <div className="absolute inset-0" style={DOTS(0.09)} />
                        {sprites.slice(0, SPRITE_SPOTS.length).map((d, i) => (
                            <span
                                key={d.slug}
                                className={`absolute aspect-[4/3] opacity-[0.2] motion-safe:animate-[spriteBob_1.8s_steps(2,jump-none)_infinite] ${SPRITE_SPOTS[i]}`}
                                style={{ animationDelay: `${i * 260}ms` }}
                            >
                                <Image src={d.image} alt="" fill sizes="128px" className="object-contain" />
                            </span>
                        ))}
                    </>
                )}
                {bg === 'C' && <div className="absolute inset-0 bg-violet-700" style={DOTS(0.14)} />}
                {bg === 'D' && (
                    <>
                        <Image src="/gameboy_color.webp" alt="" fill priority className="object-cover opacity-40" />
                        <div className="absolute inset-0 bg-bg-primary/60" />
                    </>
                )}
            </div>

            <div className="absolute right-3 top-3 z-20 flex items-center gap-1 bg-black/80 border border-white/20 p-1 font-mono text-[11px]">
                <span className="px-2 text-zinc-400">Beta, background:</span>
                {OPTIONS.map((o) => (
                    <button
                        key={o.id}
                        type="button"
                        title={o.label}
                        aria-pressed={bg === o.id}
                        onClick={() => setBg(o.id)}
                        className={`px-2 py-1 ${bg === o.id ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/10'}`}
                    >
                        {o.id} <span className="hidden lg:inline">{o.label}</span>
                    </button>
                ))}
            </div>
        </>
    );
}
