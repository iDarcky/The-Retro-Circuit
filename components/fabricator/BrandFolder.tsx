import Link from 'next/link';
import Image from 'next/image';

/* A brand as a folder, copied from folder 3 of the owner's Figma collection ("Scripts"): a back
 * panel with a tab, in the brand's colour; a sheet tucked inside; a frosted glass front with the
 * name, tagline, count and a dark pill button. What sits inside the folder is either the brand's
 * logo, huge and tossed in at an angle, or three of its handhelds. Nothing pokes out of the
 * folder: the contents stay inside its outline and blur behind the glass. */

export interface BrandFolderProps {
    href: string;
    name: string;
    tagline: string | null;
    count: number;
    color: string; // the brand colour, any CSS colour
    logo: string | null;
    devices: string[]; // image URLs, up to three
    fill?: 'logo' | 'handhelds';
}

// Back panel outline. The viewBox matches the card's 5:4 aspect ratio so the corners stay round.
const BACK = 'M0 7 Q0 0 7 0 H44 Q48.5 0 51 3.5 L54 8 Q56.5 11 61 11 H118 Q125 11 125 18 V93 Q125 100 118 100 H7 Q0 100 0 93 Z';

export default function BrandFolder({ href, name, tagline, count, color, logo, devices, fill = 'handhelds' }: BrandFolderProps) {
    const id = `bf-${href.replace(/[^a-z0-9]/gi, '')}`;
    return (
        <Link
            href={href}
            style={{ ['--brand' as string]: color }}
            className="group relative block aspect-[5/4] rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
        >
            {/* Back panel in the brand colour, with a soft sheen like the painted backs in Figma */}
            <svg aria-hidden viewBox="0 0 125 100" className="absolute inset-0 w-full h-full">
                <defs>
                    <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="var(--brand)" />
                        <stop offset="1" stopColor="color-mix(in srgb, var(--brand) 45%, black)" />
                    </linearGradient>
                    <radialGradient id={`${id}-s`} cx="0.75" cy="0.1" r="0.7">
                        <stop offset="0" stopColor="white" stopOpacity="0.3" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id={`${id}-c`}><path d={BACK} /></clipPath>
                </defs>
                <path d={BACK} fill={`url(#${id}-g)`} />
                <path d={BACK} fill={`url(#${id}-s)`} />
            </svg>

            {/* Inside the folder, clipped to the body so nothing escapes the outline */}
            <span aria-hidden className="absolute left-[3%] right-[3%] top-[16%] bottom-[4%] overflow-hidden rounded-[18px]">
                {/* the sheet tucked in */}
                <span className="absolute left-[5%] right-[5%] top-[6%] bottom-0 rounded-[14px] bg-white/95 transition-transform duration-500 ease-out group-hover:-translate-y-[4%]">
                    {fill === 'logo' && (
                        <span className="absolute inset-x-[5%] top-[6%] h-[56%] -rotate-[6deg] transition-transform duration-500 ease-out group-hover:-rotate-[4deg] group-hover:scale-105">
                            {logo ? (
                                <Image src={logo} alt="" fill sizes="(min-width: 1024px) 25vw, 80vw" className="object-contain" />
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center font-pixel text-3xl md:text-4xl text-black uppercase">{name}</span>
                            )}
                        </span>
                    )}
                </span>
                {fill === 'handhelds' && (
                    <span className="absolute left-[8%] right-[8%] top-[10%] h-[50%] flex items-center justify-center gap-[3%] transition-transform duration-500 ease-out group-hover:-translate-y-[6%]">
                        {devices.slice(0, 3).map((src, i) => (
                            <span key={src} className={`relative h-full flex-1 ${i === 1 ? 'z-10 scale-110' : i === 0 ? '-rotate-6' : 'rotate-6'}`}>
                                <Image src={src} alt="" fill sizes="140px" className="object-contain" />
                            </span>
                        ))}
                    </span>
                )}
            </span>

            {/* Frosted glass front */}
            <span className="absolute left-[2%] right-[2%] top-[50%] bottom-[2.5%] rounded-[20px] border border-white/20 bg-white/[0.05] backdrop-blur-md">
                <span className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/[0.08] to-black/45" />
                <span className="relative h-full flex flex-col px-[6%] py-[5%]">
                    <span className="block text-lg md:text-xl font-semibold leading-tight tracking-[-0.02em] text-white truncate">{name}</span>
                    {tagline && <span className="mt-1 block text-xs md:text-[13px] text-white/65 leading-snug line-clamp-1">{tagline}</span>}
                    <span className="mt-auto flex items-end justify-between gap-3">
                        <span className="text-white"><span className="text-2xl font-bold tracking-[-0.03em] tabular-nums">{count}</span><span className="ml-1 text-sm text-white/70">{count === 1 ? 'handheld' : 'handhelds'}</span></span>
                        <span aria-hidden className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 border border-white/10">
                            {[0, 1, 2].map((k) => (
                                <span key={k} className="w-2.5 h-2.5 rounded-full border-2 border-white/40 group-hover:border-[var(--brand)] transition-colors" style={{ transitionDelay: `${k * 90}ms` }} />
                            ))}
                        </span>
                    </span>
                </span>
            </span>
        </Link>
    );
}
