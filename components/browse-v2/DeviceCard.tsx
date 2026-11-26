import Link from 'next/link';
import Image from 'next/image';

/* One handheld in a listing: small pixel-art photo, name, the three specs people scan
 * for, and the price. Shared by the catalogue and the chip/OS/vendor pages. */

export interface CardDevice {
    slug: string;
    name: string;
    brand?: string | null;
    image?: string | null;
    shape?: string | null;
    price?: number | null;
    chip?: string | null;
    screen?: number | null;
    os?: string | null;
    year?: string | null;
}

/** Shape colour key, the same four signal colours as the face buttons. */
export const SHAPE_COLOR: Record<string, string> = {
    horizontal: 'bg-violet-500',
    vertical: 'bg-cyan-500',
    clamshell: 'bg-rose-500',
};

const OS_LABEL: Record<string, string> = { android: 'Android', linux: 'Linux', windows: 'Windows', steamos: 'SteamOS', proprietary: 'Own OS' };

export function osLabel(os?: string | null) {
    if (!os) return null;
    return OS_LABEL[os.toLowerCase()] ?? os.charAt(0).toUpperCase() + os.slice(1);
}

/* The old Vault card, brought back at the owner's request (2026-11-27) and polished: a square
 * picture area with room around the handheld, then brand, year, name and price underneath. */
export default function DeviceCard({ d, priority = false }: { d: CardDevice; priority?: boolean }) {
    return (
        <Link
            href={`/consoles/${d.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/50 transition-all duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
            <span className="relative aspect-square flex items-center justify-center p-9 bg-gradient-to-b from-transparent to-black/25">
                {d.image ? (
                    <span className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                        <Image src={d.image} alt={d.name} fill sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 45vw" className="object-contain" priority={priority} />
                    </span>
                ) : (
                    <span className="font-mono text-xs text-zinc-700">NO VISUAL</span>
                )}
                <span aria-hidden className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
            </span>
            <span className="flex flex-col gap-1 p-4 border-t border-white/[0.06] bg-white/[0.01]">
                <span className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider truncate">{d.brand}</span>
                    {d.year && <span className="text-[10px] font-mono text-zinc-600">{d.year}</span>}
                </span>
                <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-bold text-white leading-tight truncate group-hover:text-violet-300 transition-colors">{d.name}</span>
                    {d.price ? <span className="shrink-0 font-mono text-xs text-cyan-400 tabular-nums">${d.price}</span> : null}
                </span>
            </span>
        </Link>
    );
}
