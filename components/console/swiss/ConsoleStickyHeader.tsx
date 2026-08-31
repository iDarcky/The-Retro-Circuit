'use client';

import { useEffect, useState, type FC } from 'react';
import Link from 'next/link';

/* The device follows you down the page.
 *
 * Once the fold scrolls away the page is a long run of specs with nothing saying which
 * console you are looking at or what it costs, and the buy action is thousands of pixels
 * behind you. This carries the name, the configuration, the price and the two actions.
 *
 * Sits below the site header rather than over it, so the two never overlap.
 */

interface Props {
    name: string;
    brand?: string | null;
    variantName?: string | null;
    price?: number | null;
    score?: number | null;
    compareUrl: string;
    buyUrl?: string | null;
    buyLabel?: string;
    /** Scroll distance before it appears. Roughly the height of the fold. */
    threshold?: number;
}

const ConsoleStickyHeader: FC<Props> = ({
    name, brand, variantName, price, score, compareUrl, buyUrl, buyLabel = 'Check price', threshold = 520,
}) => {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const onScroll = () => setShown(window.scrollY > threshold);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return (
        <div
            aria-hidden={!shown}
            className={`fixed left-0 right-0 top-[48px] md:top-[64px] z-40 border-b border-white/10
                        bg-[#09090b]/95 backdrop-blur-sm transition-transform duration-200 ease-out
                        motion-reduce:transition-none ${shown ? 'translate-y-0' : '-translate-y-[200%]'}`}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-[52px] flex items-center gap-4">
                <div className="min-w-0 flex items-baseline gap-2.5">
                    {brand && (
                        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 shrink-0">
                            {brand}
                        </span>
                    )}
                    <span className="font-mono text-[13px] text-white truncate">{name}</span>
                    {variantName && (
                        <span className="hidden md:inline font-mono text-[10px] uppercase tracking-wider text-violet-400 shrink-0">
                            {variantName}
                        </span>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-3 shrink-0">
                    {score !== null && score !== undefined && (
                        <span className="hidden lg:flex items-baseline gap-1.5 font-mono tabular-nums">
                            <span className="text-[9px] uppercase tracking-widest text-gray-500">Score</span>
                            <span className="text-[13px] text-violet-400 font-bold">{score}</span>
                        </span>
                    )}
                    {price ? (
                        <span className="font-mono text-[15px] font-bold text-emerald-400 tabular-nums">${price}</span>
                    ) : null}

                    <Link
                        href={compareUrl}
                        tabIndex={shown ? 0 : -1}
                        className="hidden sm:flex items-center px-3 py-1.5 border border-white/15 text-gray-300
                                   hover:border-white hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors"
                    >
                        Compare
                    </Link>
                    {buyUrl && (
                        <a
                            href={buyUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            tabIndex={shown ? 0 : -1}
                            className="flex items-center px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white
                                       font-mono text-[10px] uppercase tracking-widest transition-colors"
                        >
                            {buyLabel}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsoleStickyHeader;
