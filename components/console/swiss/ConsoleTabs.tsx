'use client';

import { useEffect, useState, type FC } from 'react';

/* The page had section anchors but rendered them as 9px grey text floating between the
 * title and the body — the navigation existed, it just wasn't visible as navigation.
 * These are the same anchors promoted to a real tab bar that tracks scroll position. */

export interface TabDef { id: string; label: string }

interface Props {
    tabs: TabDef[];
    /** Sits under the site header when the bar sticks. Matches the header height. */
    offsetClass?: string;
}

const ConsoleTabs: FC<Props> = ({ tabs, offsetClass = 'top-[48px] md:top-[64px]' }) => {
    const [active, setActive] = useState(tabs[0]?.id);

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
            { rootMargin: '-120px 0px -65% 0px', threshold: 0 }
        );

        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, [tabs]);

    const go = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    return (
        <div className={`sticky ${offsetClass} z-30 bg-[#09090b]/95 backdrop-blur-md border-b border-white/10 mt-10`}>
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
                <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Console sections">
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
                <span className="hidden lg:block font-mono text-[10px] uppercase tracking-widest text-gray-600 shrink-0">
                    Scroll for specs ↓
                </span>
            </div>
        </div>
    );
};

export default ConsoleTabs;
