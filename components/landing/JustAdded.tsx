'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type HomeDevice } from './home-types';

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:-outline-offset-2';

/**
 * The newest consoles as a sideways strip with arrow buttons. The links are rendered on the
 * server; the arrows only scroll the strip and grey out at either end.
 */
export default function JustAdded({ devices }: { devices: HomeDevice[] }) {
    const strip = useRef<HTMLDivElement>(null);
    const [edge, setEdge] = useState({ start: true, end: false });

    const update = () => {
        const el = strip.current;
        if (!el) return;
        setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    };

    useEffect(() => {
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const move = (dir: 1 | -1) => {
        const el = strip.current;
        if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
    };

    const arrow = `shrink-0 w-11 flex items-center justify-center border-white/10 text-white hover:bg-white hover:text-black transition-colors disabled:text-zinc-700 disabled:hover:bg-transparent ${focus}`;

    return (
        <div className="border-y border-white/10 flex flex-wrap sm:flex-nowrap items-stretch">
            <h2 className="w-full sm:w-auto shrink-0 flex items-center px-5 md:px-8 py-2 sm:py-0 font-mono text-xs sm:text-sm text-text-secondary border-b sm:border-b-0 sm:border-r border-white/10 whitespace-nowrap">
                Just added
            </h2>
            <button type="button" aria-label="Scroll back" onClick={() => move(-1)} disabled={edge.start} className={`${arrow} border-r`}>
                <ChevronLeft size={20} aria-hidden />
            </button>
            <div ref={strip} onScroll={update} className="flex-1 min-w-0 flex items-stretch overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {devices.map((d) => (
                    <Link
                        key={d.slug}
                        href={`/consoles/${d.slug}`}
                        className={`shrink-0 snap-start flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-r border-white/10 hover:bg-white/[0.04] ${focus}`}
                    >
                        <span className="relative w-12 h-9 sm:w-14 sm:h-10 shrink-0">
                            {d.image && <Image src={d.image} alt="" fill sizes="56px" className="object-contain" />}
                        </span>
                        <span className="text-left">
                            <span className="block font-semibold text-sm sm:text-base whitespace-nowrap">{d.label}</span>
                            <span className="block font-mono text-xs text-cyan-400 whitespace-nowrap">
                                {[d.screenIn ? `${d.screenIn}"` : null, d.price ? `$${d.price}` : null].filter(Boolean).join(', ') || 'See specs'}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
            <button type="button" aria-label="Scroll forward" onClick={() => move(1)} disabled={edge.end} className={`${arrow} border-l`}>
                <ChevronRight size={20} aria-hidden />
            </button>
        </div>
    );
}
