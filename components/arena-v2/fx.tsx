'use client';

/* Small pieces of motion and colour shared by the compare and console pages.
 * Everything animates once, when it first scrolls into view, and stands still for
 * anyone who asks the system for reduced motion. */

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function useInView<T extends HTMLElement>(margin = '0px 0px -4% 0px') {
    const ref = useRef<T>(null);
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || seen) return;
        if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: margin });
        io.observe(el);
        return () => io.disconnect();
    }, [margin, seen]);
    return [ref, seen] as const;
}

/** Rises into place the first time it is seen. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    const [ref, seen] = useInView<HTMLDivElement>();
    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out ${seen ? 'opacity-100 translate-y-0' : 'motion-safe:opacity-0 motion-safe:translate-y-6'} ${className}`}
        >
            {children}
        </div>
    );
}

/** Pixel eyebrow over a section heading: "02  WHAT IT PLAYS". */
export function SectionHead({ n, eyebrow, title, sub, id, color = 'text-violet-400' }: { n: number; eyebrow: string; title: string; sub?: ReactNode; id: string; color?: string }) {
    return (
        <div>
            <p className={`font-pixel text-[10px] ${color}`}>
                <span className="text-text-secondary">{String(n).padStart(2, '0')}</span>&nbsp;&nbsp;{eyebrow.toUpperCase()}
            </p>
            <h2 id={id} className="mt-3 text-2xl md:text-4xl font-extrabold tracking-[-0.03em]">{title}</h2>
            {sub && <p className="mt-2 text-text-secondary">{sub}</p>}
        </div>
    );
}

const METER = ['bg-rose-500', 'bg-rose-500', 'bg-orange-500', 'bg-emerald-500', 'bg-emerald-500'];

/** Four blocks, like a health bar, lighting up one after another. */
export function BlockMeter({ rank, align = 'left', size = 'md' }: { rank: number; align?: 'left' | 'right'; size?: 'md' | 'lg' }) {
    const [ref, seen] = useInView<HTMLSpanElement>();
    const dims = size === 'lg' ? 'w-5 h-4' : 'w-3 h-3 md:w-4 md:h-3';
    return (
        <span ref={ref} className={`inline-flex gap-[3px] ${align === 'right' ? 'flex-row-reverse' : ''}`} aria-hidden>
            {[1, 2, 3, 4].map((i) => (
                <span
                    key={i}
                    style={{ transitionDelay: `${i * 90}ms` }}
                    className={`${dims} motion-safe:transition-colors motion-safe:duration-300 ${i <= rank && seen ? METER[rank] : 'bg-white/10'}`}
                />
            ))}
        </span>
    );
}

/** A number that counts up from zero when it comes into view. */
export function CountUp({ to, className = '' }: { to: number; className?: string }) {
    const [ref, seen] = useInView<HTMLSpanElement>();
    const [n, setN] = useState(to);
    useEffect(() => {
        if (!seen) { setN(0); return; }
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setN(to); return; }
        let raf = 0;
        const start = performance.now();
        const tick = (t: number) => {
            const k = Math.min(1, (t - start) / 900);
            setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [seen, to]);
    return <span ref={ref} className={className}>{n}</span>;
}

/** A row of segments filling up to a share, for a 0–100 score. */
export function SegmentBar({ value, segments = 20, color = 'bg-violet-400' }: { value: number; segments?: number; color?: string }) {
    const [ref, seen] = useInView<HTMLSpanElement>();
    const lit = Math.round((value / 100) * segments);
    return (
        <span ref={ref} className="flex gap-[2px]" aria-hidden>
            {Array.from({ length: segments }, (_, i) => (
                <span key={i} style={{ transitionDelay: `${i * 35}ms` }} className={`h-2.5 flex-1 motion-safe:transition-colors motion-safe:duration-200 ${seen && i < lit ? color : 'bg-white/10'}`} />
            ))}
        </span>
    );
}

/**
 * Tug of war between two numbers: each side's share of the bar, in its own colour.
 * For "lower is better" rows the shares are flipped so the bigger bar is always the winner.
 */
export function TugBar({ a, b, lowerWins = false, colorA, colorB }: { a: number; b: number; lowerWins?: boolean; colorA: string; colorB: string }) {
    const [ref, seen] = useInView<HTMLSpanElement>();
    const [x, y] = lowerWins ? [1 / a, 1 / b] : [a, b];
    // Lean by the relative gap, so a 15% difference is visible rather than a 46/54 split.
    const share = Math.max(10, Math.min(90, 50 + ((x - y) / Math.max(x, y)) * 75));
    return (
        <span ref={ref} className="flex h-1.5 w-full bg-white/10" aria-hidden>
            <span style={{ width: seen ? `${share}%` : '50%' }} className={`${colorA} motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out`} />
            <span className="w-[2px] bg-bg-primary" />
            <span className={`flex-1 ${colorB}`} />
        </span>
    );
}

/** The four signal colours set out like a controller's face buttons. */
export function FaceButtons({ size = 9 }: { size?: number }) {
    const dot = { width: size, height: size };
    return (
        <span aria-hidden className="inline-grid grid-cols-3 gap-[2px] motion-safe:animate-[faceTurn_6s_cubic-bezier(.5,1.8,.5,1)_infinite]">
            <span /><span style={dot} className="rounded-full bg-violet-500" /><span />
            <span style={dot} className="rounded-full bg-cyan-500" /><span /><span style={dot} className="rounded-full bg-rose-500" />
            <span /><span style={dot} className="rounded-full bg-orange-500" /><span />
        </span>
    );
}

/** Dot-matrix texture for colour blocks, like an LCD's pixel grid. */
export const DOT_GRID: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.2px)',
    backgroundSize: '14px 14px',
};
