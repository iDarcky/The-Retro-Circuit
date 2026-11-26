import Link from 'next/link';
import Image from 'next/image';

/* A brand as a folder, after the owner's Figma folder collection: a back panel with a tab in
 * the brand's colour, the brand's handhelds tucked inside and peeking over the top, and a
 * frosted glass front with the name, tagline and count. Hovering slides the glass down a
 * little so the handhelds rise out of the folder. */

export interface BrandFolderProps {
    href: string;
    name: string;
    meta: string;
    tagline: string | null;
    count: number;
    color: string; // the brand colour, any CSS colour
    logo: string | null;
    devices: string[]; // image URLs, up to three
}

export default function BrandFolder({ href, name, meta, tagline, count, color, logo, devices }: BrandFolderProps) {
    return (
        <Link
            href={href}
            style={{ ['--brand' as string]: color }}
            className="group relative block aspect-[5/4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500 rounded-[26px]"
        >
            {/* Back panel: tab on the left, then the body, in the brand colour with a soft sheen */}
            <svg aria-hidden viewBox="0 0 160 30" preserveAspectRatio="none" className="absolute left-0 top-0 w-[46%] h-[30px]">
                <path d="M0 30 V14 Q0 0 14 0 H112 Q122 0 128 8 L140 24 Q144 30 152 30 Z" fill="var(--brand)" />
            </svg>
            <span aria-hidden className="absolute inset-x-0 bottom-0 top-[29px] rounded-[26px] rounded-tl-none" style={{ background: 'linear-gradient(150deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 55%, black) 100%)' }} />
            <span aria-hidden className="absolute inset-x-0 bottom-0 top-[29px] rounded-[26px] rounded-tl-none bg-[radial-gradient(120%_80%_at_80%_0%,rgba(255,255,255,0.28),transparent_60%)]" />

            {/* The handhelds inside, peeking over the glass */}
            <span aria-hidden className="absolute left-[8%] right-[8%] top-[16%] h-[34%] flex items-end justify-center gap-[4%] transition-transform duration-500 ease-out group-hover:-translate-y-3">
                {devices.slice(0, 3).map((src, i) => (
                    <span key={src} className={`relative flex-1 h-full ${i === 1 ? 'z-10 scale-110' : 'opacity-90'}`}>
                        <Image src={src} alt="" fill sizes="120px" className="object-contain object-bottom" />
                    </span>
                ))}
            </span>

            {/* Glass front, with its own tab notch on the right like the Figma folders */}
            <span className="absolute inset-x-0 bottom-0 top-[42%] transition-transform duration-500 ease-out group-hover:translate-y-2">
                <svg aria-hidden viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute right-0 -top-[17px] w-[58%] h-[18px]">
                    <path d="M0 20 Q6 20 10 13 L14 6 Q18 0 26 0 H88 Q100 0 100 12 V20 Z" fill="rgba(18,18,24,0.55)" />
                </svg>
                <span className="absolute inset-0 rounded-[26px] rounded-tr-none border border-white/15 bg-[rgba(18,18,24,0.55)] backdrop-blur-xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]" />
                <span className="relative h-full flex flex-col p-5 md:p-6">
                    <span className="flex items-center gap-3">
                        <span className="relative w-9 h-9 shrink-0 rounded-[10px] bg-white p-1">
                            {logo ? <span className="relative block w-full h-full"><Image src={logo} alt="" fill sizes="36px" className="object-contain" /></span>
                                : <span className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-black">{name.charAt(0)}</span>}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-lg font-semibold leading-tight tracking-[-0.02em] text-white truncate">{name}</span>
                            <span className="block font-mono text-[11px] text-white/50 truncate">{meta}</span>
                        </span>
                    </span>
                    {tagline && <span className="mt-3 text-sm text-white/70 leading-snug line-clamp-2">{tagline}</span>}
                    <span className="mt-auto flex items-end justify-between gap-3">
                        <span className="font-mono text-xs text-white/50"><span className="text-3xl font-sans font-semibold tracking-[-0.04em] text-white tabular-nums mr-1.5">{count}</span>{count === 1 ? 'handheld' : 'handhelds'}</span>
                        {/* the pill button from the Figma folders, three dots that light in turn on hover */}
                        <span aria-hidden className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                            {[0, 1, 2].map((k) => (
                                <span key={k} className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-[var(--brand)] transition-colors" style={{ transitionDelay: `${k * 90}ms` }} />
                            ))}
                        </span>
                    </span>
                </span>
            </span>
        </Link>
    );
}
