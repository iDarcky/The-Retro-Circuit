import Link from 'next/link';
import Image from 'next/image';

/* A brand as a small desktop folder icon, after folder 11 of the owner's Figma set (tab on the
 * right, glass front with a dipped top edge). The brand's logo sits on a sheet inside. The back
 * is the brand colour broken into a pixel dither, to match the site's pixel type. On hover or
 * keyboard focus the folder opens: the glass front swings down and the sheet with the logo
 * rises out. The label sits under the icon, like a file name on a desktop. */

export interface BrandFolderIconProps {
    href: string;
    name: string;
    count: number;
    color: string;
    logo: string | null;
}

const BACK = 'M125 7 Q125 0 118 0 H81 Q76.5 0 74 3.5 L71 8 Q68.5 11 64 11 H7 Q0 11 0 18 V93 Q0 100 7 100 H118 Q125 100 125 93 Z';
const FRONT = 'M9 40 H46 Q53 40 59 43 L79 53 Q86 56.5 93 53 L114 42.5 Q123 38 123 48 V92 Q123 99 116 99 H9 Q2 99 2 92 V47 Q2 40 9 40 Z';
const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 125 100' preserveAspectRatio='none'><path d='${FRONT}'/></svg>`)}")`;

export default function BrandFolderIcon({ href, name, count, color, logo }: BrandFolderIconProps) {
    const id = `bfi-${href.replace(/[^a-z0-9]/gi, '')}`;
    return (
        <Link
            href={href}
            style={{ ['--brand' as string]: color }}
            className="group flex flex-col items-center gap-3 rounded-xl p-3 outline-none hover:bg-white/[0.04] focus-visible:bg-white/[0.06] focus-visible:ring-1 focus-visible:ring-emerald-400/60 transition-colors"
        >
            <span className="relative w-full max-w-[140px] aspect-[5/4] [perspective:600px]">
                {/* Back: brand colour, pixel dither fading to dark, thin edge */}
                <svg aria-hidden viewBox="0 0 125 100" className="absolute inset-0 w-full h-full">
                    <defs>
                        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="var(--brand)" />
                            <stop offset="1" stopColor="color-mix(in srgb, var(--brand) 35%, #050507)" />
                        </linearGradient>
                        <pattern id={`${id}-p`} width="5" height="5" patternUnits="userSpaceOnUse">
                            <rect width="2.5" height="2.5" fill="black" fillOpacity="0.28" />
                            <rect x="2.5" y="2.5" width="2.5" height="2.5" fill="black" fillOpacity="0.28" />
                        </pattern>
                        <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0.15" stopColor="white" stopOpacity="0" />
                            <stop offset="1" stopColor="white" stopOpacity="1" />
                        </linearGradient>
                        <mask id={`${id}-m`}><rect width="125" height="100" fill={`url(#${id}-f)`} /></mask>
                    </defs>
                    <path d={BACK} fill={`url(#${id}-g)`} />
                    <path d={BACK} fill={`url(#${id}-p)`} mask={`url(#${id}-m)`} />
                    <path d={BACK} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                </svg>

                {/* Sheet with the logo, rises when the folder opens */}
                <span aria-hidden className="absolute left-[9%] right-[9%] top-[18%] bottom-[6%] rounded-[8px] bg-white shadow-none transition-transform duration-300 ease-out group-hover:-translate-y-[22%] group-focus-visible:-translate-y-[22%] group-hover:-rotate-3 group-focus-visible:-rotate-3">
                    <span className="absolute inset-x-[10%] top-[8%] h-[38%]">
                        {logo ? (
                            <Image src={logo} alt="" fill sizes="120px" className="object-contain" />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-pixel text-[9px] text-black uppercase text-center leading-tight">{name}</span>
                        )}
                    </span>
                </span>

                {/* Glass front with the dipped edge, swings down to open */}
                <span aria-hidden className="absolute inset-0 origin-bottom transition-transform duration-300 ease-out group-hover:[transform:rotateX(38deg)] group-focus-visible:[transform:rotateX(38deg)]">
                    <span className="absolute inset-0 backdrop-blur-[6px] bg-white/[0.10]" style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }} />
                    <span className="absolute inset-0 bg-gradient-to-b from-white/[0.18] to-black/50" style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }} />
                    <svg viewBox="0 0 125 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                        <path d={FRONT} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="absolute right-[7%] bottom-[9%] font-mono text-[10px] leading-none text-white/80 tabular-nums">{count}</span>
                </span>
            </span>
            <span className="max-w-full text-center">
                <span className="block font-mono text-xs text-white truncate group-hover:text-emerald-300 transition-colors">{name}</span>
            </span>
        </Link>
    );
}
