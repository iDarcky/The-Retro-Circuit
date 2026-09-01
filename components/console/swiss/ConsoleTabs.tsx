'use client';

import { useEffect, useState, type FC } from 'react';

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
    const [scrolled, setScrolled] = useState(false);

    /* Stick directly beneath the site header, measured rather than guessed.
     *
     * This was a hardcoded top-[48px] md:top-[64px], which missed both headers by the
     * 2px violet border and left page content visible in the seam. Measuring means it
     * also survives anyone changing the header height later. Both headers are in the DOM
     * with one hidden per breakpoint, so the taller of the two is the live one. */
    const [headerH, setHeaderH] = useState(66);

    useEffect(() => {
        const measure = () => {
            const els = Array.from(document.querySelectorAll<HTMLElement>('[data-site-header]'));
            const h = Math.max(0, ...els.map(el => el.getBoundingClientRect().height));
            if (h > 0) setHeaderH(Math.round(h));
        };
        measure();
        const ro = new ResizeObserver(measure);
        document.querySelectorAll('[data-site-header]').forEach(el => ro.observe(el));
        window.addEventListener('resize', measure);
        return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 420);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
        // Clear the site header and this bar, plus a little breathing room.
        const y = el.getBoundingClientRect().top + window.scrollY - (headerH + 60);
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    return (
        <div
            style={{ top: headerH }}
            className="sticky z-30 bg-[#09090b] border-b border-white/10 mt-10"
        >
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
