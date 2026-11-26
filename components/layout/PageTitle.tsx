import type { ReactNode } from 'react';

/* Each main page has a signal colour. The page title's second part takes the colour as a
 * gradient (the owner allows gradients on these page titles only), the blinking cursor and
 * section titles take it solid. */
export const PAGE_COLORS = {
    home: { grad: 'from-violet-400 to-fuchsia-400', solid: 'text-violet-400', bar: 'bg-violet-500' },
    vault: { grad: 'from-cyan-300 to-sky-500', solid: 'text-cyan-400', bar: 'bg-cyan-500' },
    best: { grad: 'from-yellow-300 to-amber-500', solid: 'text-yellow-400', bar: 'bg-yellow-400' },
    fabricators: { grad: 'from-emerald-300 to-green-500', solid: 'text-emerald-400', bar: 'bg-emerald-500' },
    vs: { grad: 'from-blue-500 to-red-500', solid: 'text-red-500', bar: 'bg-red-500' },
    news: { grad: 'from-orange-300 to-orange-500', solid: 'text-orange-400', bar: 'bg-orange-500' },
} as const;
export type PageColor = keyof typeof PAGE_COLORS;

/** "CONSOLE VAULT_": white lead, coloured gradient tail, blinking cursor. */
export function PageTitle({ lead, accent, color, size = 'page', className = '' }: {
    lead?: ReactNode; accent: ReactNode; color: PageColor; size?: 'page' | 'hero'; className?: string;
}) {
    const c = PAGE_COLORS[color];
    const sizes = size === 'hero'
        ? 'text-[26px] sm:text-[40px] lg:text-[52px] xl:text-[60px] leading-[1.25]'
        : 'text-[26px] sm:text-4xl md:text-5xl leading-[1.2]';
    return (
        <h1 className={`font-pixel uppercase text-white ${sizes} ${className}`}>
            {lead && <>{lead}{' '}</>}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${c.grad}`}>{accent}</span>
            <span aria-hidden className={`${c.solid} motion-safe:animate-pulse`}>_</span>
        </h1>
    );
}

/** A section title inside a page: small pixel type in the page colour. */
export function SectionTitle({ id, color, children, className = '' }: { id?: string; color: PageColor; children: ReactNode; className?: string }) {
    return (
        <h2 id={id} className={`font-pixel text-base md:text-xl leading-snug ${PAGE_COLORS[color].solid} ${className}`}>
            {children}
        </h2>
    );
}
