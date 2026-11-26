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

/** A soft glow behind the handheld, by shape, so the glass has colour to pick up. */
const GLOW: Record<string, string> = {
    horizontal: 'rgba(139,92,246,0.35)',
    vertical: 'rgba(6,182,212,0.32)',
    clamshell: 'rgba(244,63,94,0.30)',
};

/* Glass card: a frosted panel over a faint coloured glow, a small handheld icon, then the
 * brand, name and price. Owner asked for transparency and smaller icons (2026-11-27). */
export default function DeviceCard({ d, priority = false }: { d: CardDevice; priority?: boolean }) {
    const shape = (d.shape ?? '').toLowerCase();
    const glow = GLOW[shape] ?? 'rgba(251,191,36,0.25)';
    return (
        <Link
            href={`/consoles/${d.slug}`}
            className="group relative isolate flex flex-col overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.035] backdrop-blur-xl p-4 pt-5 transition-colors duration-300 hover:bg-white/[0.07] hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
            {/* the glow the glass sits on, brighter on hover */}
            <span aria-hidden className="absolute -z-10 left-1/2 top-6 w-32 h-24 -translate-x-1/2 rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
            {/* top sheen, like light on a plastic shell */}
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative mx-auto block w-[62%] aspect-[4/3] group-hover:motion-safe:animate-[spriteBob_0.5s_steps(2,jump-none)_infinite]">
                {d.image ? (
                    <Image src={d.image} alt="" fill sizes="(min-width: 1024px) 110px, 28vw" className="object-contain" priority={priority} />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-pixel text-zinc-700">?</span>
                )}
            </span>
            <span className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
                <span className="truncate">{d.brand}</span>
                {d.year && <span className="ml-auto font-mono text-[10px] text-zinc-600">{d.year}</span>}
            </span>
            <span className="mt-0.5 font-semibold leading-snug group-hover:text-violet-300 transition-colors">{d.name}</span>
            <span className="mt-auto pt-3 text-xl font-semibold tracking-[-0.03em] tabular-nums text-white">
                {d.price ? `$${d.price}` : <span className="text-xs font-normal tracking-normal text-zinc-600">Price not listed</span>}
            </span>
        </Link>
    );
}
