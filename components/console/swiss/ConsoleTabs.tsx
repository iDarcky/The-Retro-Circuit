'use client';

import { useEffect, useState, type FC } from 'react';
import { useScrollRoot } from '../../../lib/hooks/useScrollRoot';

/* The page had section anchors but rendered them as 9px grey text floating between the
 * title and the body — the navigation existed, it just wasn't visible as navigation.
 * These are the same anchors promoted to a real tab bar that tracks scroll position. */

export interface TabDef { id: string; label: string }

interface Props {
    tabs: TabDef[];
    /* Identity, revealed inside this same bar once the fold scrolls away.
     *
     * This was briefly a second fixed bar of its own, which pinned to the same offset as
     * the tabs and collided with them, leaving an empty band under the site header. One
     * bar that gains the device name is both the fix and the better design: it costs no
     * extra vertical space on a page that is already long. */
    device?: {
        name: string;
        brand?: string | null;
        variantName?: string | null;
        price?: number | null;
        buyUrl?: string | null;
        buyLabel?: string;
    };
}

const ConsoleTabs: FC<Props> = ({ tabs, device }) => {
    const [active, setActive] = useState(tabs[0]?.id);
    /* The shell scrolls an inner div, not the window, so window.scrollY never moves and
     * this bar never revealed the device. See lib/hooks/useScrollRoot. */
    const { ref: barRef, past: scrolled, scrollToEl, root: scrollRoot } = useScrollRoot(420);

    useEffect(() => {
        const sections = tabs
            .map(t => document.getElementById(t.id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (sections.length === 0) return;

        // rootMargin pins the trigger line just below the sticky bar, so the tab flips
        // when a section reaches the bar rather than when it enters the viewport.
        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (visible) setActive(visible.target.id);
            },
            // Observe against the scrolling container, not the viewport: with the shell
            // scrolling an inner div the default root measures the wrong box.
            { root: scrollRoot, rootMargin: '-120px 0px -65% 0px', threshold: 0 }
        );

        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, [tabs, scrollRoot]);

    const go = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        // Clear this bar, plus a little breathing room. The site header is outside the
        // scrolling container, so it does not enter the sum.
        scrollToEl(el, (barRef.current?.offsetHeight ?? 52) + 16);
    };

    return (
        /* top-0, not the header height. This bar lives inside the scrolling container,
           which already starts below the site header; offsetting by the header pushed it
           down and opened the gap it was meant to close. */
        <div ref={barRef} className="sticky top-0 z-30 bg-[#09090b] border-b border-white/10 mt-10">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center gap-4">
                {device && (
                    <div
                        className={`hidden md:flex items-baseline gap-2.5 min-w-0 shrink-0 overflow-hidden transition-all duration-200
                                    motion-reduce:transition-none ${scrolled ? 'max-w-[420px] opacity-100 mr-2' : 'max-w-0 opacity-0'}`}
                        aria-hidden={!scrolled}
                    >
                        <span className="font-mono text-[12.5px] text-white truncate">{device.name}</span>
                        {device.variantName && (
                            <span className="font-mono text-[9.5px] uppercase tracking-wider text-violet-400 shrink-0">
                                {device.variantName}
                            </span>
                        )}
                        <span className="w-px h-4 bg-white/15 shrink-0" aria-hidden="true" />
                    </div>
                )}

                <nav className="flex items-center gap-1 overflow-x-auto min-w-0" aria-label="Console sections">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => go(t.id)}
                            aria-current={active === t.id ? 'true' : undefined}
                            className={`px-3 md:px-4 py-3.5 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                                active === t.id
                                    ? 'text-white border-violet-500'
                                    : 'text-gray-500 border-transparent hover:text-white'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </nav>
                <div className="ml-auto flex items-center gap-3 shrink-0">
                    {device?.price && scrolled && (
                        <span className="font-mono text-[13px] font-bold text-emerald-400 tabular-nums">${device.price}</span>
                    )}
                    {device?.buyUrl && scrolled ? (
                        <a
                            href={device.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="flex items-center px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white
                                       font-mono text-[10px] uppercase tracking-widest transition-colors"
                        >
                            {device.buyLabel || 'Check price'}
                        </a>
                    ) : (
                        <span className="hidden lg:block font-mono text-[10px] uppercase tracking-widest text-gray-600">
                            Scroll for specs ↓
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsoleTabs;
