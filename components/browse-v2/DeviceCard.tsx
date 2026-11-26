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

export default function DeviceCard({ d, priority = false }: { d: CardDevice; priority?: boolean }) {
    const shape = (d.shape ?? '').toLowerCase();
    return (
        <Link
            href={`/consoles/${d.slug}`}
            className="group relative flex flex-col bg-bg-primary border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500"
        >
            <span className="relative block aspect-[4/3] m-6 mb-2 group-hover:motion-safe:animate-[spriteBob_0.5s_steps(2,jump-none)_infinite]">
                {d.image ? (
                    <Image src={d.image} alt="" fill sizes="(min-width: 1024px) 200px, 45vw" className="object-contain" priority={priority} />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-pixel text-zinc-700">?</span>
                )}
            </span>
            <span className="px-5 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-text-secondary">
                {SHAPE_COLOR[shape] && <span className={`w-2 h-2 ${SHAPE_COLOR[shape]}`} title={d.shape ?? undefined} />}
                <span className="truncate">{d.brand}</span>
                {d.year && <span className="ml-auto font-mono text-zinc-600">{d.year}</span>}
            </span>
            <span className="px-5 mt-1 font-bold leading-snug group-hover:text-violet-300 transition-colors">{d.name}</span>
            <span className="px-5 pb-5 mt-auto pt-3 font-pixel text-sm text-white">{d.price ? `$${d.price}` : <span className="font-mono text-xs text-zinc-600">Price not listed</span>}</span>
        </Link>
    );
}
