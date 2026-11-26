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

/** Image tile fills, by shape: solid and light, so the pixel-art photo sits on colour like a widget. */
const TILE: Record<string, string> = {
    horizontal: 'bg-violet-300',
    vertical: 'bg-cyan-200',
    clamshell: 'bg-rose-200',
};

/* Widget-style card: a rounded shell holding two tiles, the photo on a colour fill and the
 * name block underneath. Owner approved rounded tiles for the new direction (2026-11-27). */
export default function DeviceCard({ d, priority = false }: { d: CardDevice; priority?: boolean }) {
    const shape = (d.shape ?? '').toLowerCase();
    return (
        <Link
            href={`/consoles/${d.slug}`}
            className="group flex flex-col gap-1.5 p-1.5 rounded-[22px] bg-[#1c1c22] hover:bg-[#26262e] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
            <span className={`relative block aspect-[5/4] rounded-2xl border-2 border-black ${TILE[shape] ?? 'bg-amber-100'}`}>
                <span className="absolute inset-[18%] group-hover:motion-safe:animate-[spriteBob_0.5s_steps(2,jump-none)_infinite]">
                    {d.image ? (
                        <Image src={d.image} alt="" fill sizes="(min-width: 1024px) 140px, 30vw" className="object-contain" priority={priority} />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-pixel text-black/30">?</span>
                    )}
                </span>
                {d.year && <span className="absolute top-2.5 right-3 font-mono text-[10px] text-black/50">{d.year}</span>}
            </span>
            <span className="flex flex-col rounded-2xl border-2 border-black bg-[#0e0e12] px-4 pt-3 pb-3.5 min-h-[92px]">
                <span className="text-xs text-text-secondary truncate">{d.brand}</span>
                <span className="mt-0.5 font-semibold leading-snug group-hover:text-violet-300 transition-colors">{d.name}</span>
                <span className="mt-auto pt-2 text-2xl font-semibold tracking-[-0.03em] tabular-nums text-white">
                    {d.price ? `$${d.price}` : <span className="text-xs font-normal tracking-normal text-zinc-600">Price not listed</span>}
                </span>
            </span>
        </Link>
    );
}
