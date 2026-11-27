import Link from 'next/link';
import Image from 'next/image';

/* A brand on the Fabricators index: the same quiet card as the Console Vault, with the brand's
 * logo on a white chip over a soft wash of its colour, then name, tagline and handheld count.
 * Hover lifts it and lights the border in the brand colour. */

export interface BrandCardProps {
    href: string;
    name: string;
    tagline: string | null;
    count: number;
    color: string;
    logo: string | null;
}

export default function BrandCard({ href, name, tagline, count, color, logo }: BrandCardProps) {
    return (
        <Link
            href={href}
            style={{ ['--brand' as string]: color }}
            className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-[var(--brand)] transition-all duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
            <span className="relative h-28 flex items-center justify-center bg-[color-mix(in_srgb,var(--brand)_16%,transparent)]">
                <span className="relative w-[62%] h-14 rounded-lg bg-white px-4 py-2.5 transition-transform duration-300 group-hover:scale-105">
                    {logo ? (
                        <span className="relative block w-full h-full"><Image src={logo} alt={`${name} logo`} fill sizes="200px" className="object-contain" /></span>
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-black uppercase text-center leading-tight px-2">{name}</span>
                    )}
                </span>
                <span aria-hidden className="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--brand)] opacity-60 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="flex flex-col gap-1 p-4">
                <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-bold text-white truncate">{name}</span>
                    <span className="shrink-0 font-mono text-xs text-cyan-400 tabular-nums">{count} {count === 1 ? 'handheld' : 'handhelds'}</span>
                </span>
                {tagline && <span className="text-xs text-zinc-500 leading-snug line-clamp-1">{tagline}</span>}
            </span>
        </Link>
    );
}
