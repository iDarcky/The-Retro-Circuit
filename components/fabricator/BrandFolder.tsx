import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';

/* A brand as a folder, after the owner's Figma folder collection. Four shapes, each copied from
 * one folder there:
 *   'sheet' folder 4  - tab on the left, white sheet tucked in, frosted glass front, black pill
 *   'tab'   folder 3  - dark folder whose glass front has its own tab carrying the name
 *   'tilt'  folder 10 - tab on the right, glass front tilted, name on a pill, round button
 *   'wave'  folder 11 - tab on the right, glass front with a dipped top edge, "+ count" pill
 * The back panel is painted rather than flat: the brand colour, the brand's first handheld blown
 * up and blurred into a wash, and a fine dot grid. The contents (the logo, huge, or three
 * handhelds) stay inside the folder outline and blur behind the glass. */

export type FolderShape = 'sheet' | 'tab' | 'tilt' | 'wave';

export interface BrandFolderProps {
    href: string;
    name: string;
    tagline: string | null;
    count: number;
    color: string; // the brand colour, any CSS colour
    logo: string | null;
    devices: string[]; // image URLs, up to three
    fill?: 'logo' | 'handhelds';
    shape?: FolderShape;
}

// Every path uses a 125 x 100 box, the card's own 5:4 ratio, so corners stay round when scaled.
const BACK: Record<FolderShape, string> = {
    sheet: 'M0 7 Q0 0 7 0 H44 Q48.5 0 51 3.5 L54 8 Q56.5 11 61 11 H118 Q125 11 125 18 V93 Q125 100 118 100 H7 Q0 100 0 93 Z',
    tab: 'M11 4 H114 Q122 4 122 12 V92 H3 V12 Q3 4 11 4 Z',
    tilt: 'M125 7 Q125 0 118 0 H81 Q76.5 0 74 3.5 L71 8 Q68.5 11 64 11 H7 Q0 11 0 18 V93 Q0 100 7 100 H118 Q125 100 125 93 Z',
    wave: 'M125 7 Q125 0 118 0 H81 Q76.5 0 74 3.5 L71 8 Q68.5 11 64 11 H7 Q0 11 0 18 V93 Q0 100 7 100 H118 Q125 100 125 93 Z',
};
const FRONT: Record<FolderShape, string> = {
    sheet: 'M10 50 H115 Q122.5 50 122.5 57.5 V90 Q122.5 97.5 115 97.5 H10 Q2.5 97.5 2.5 90 V57.5 Q2.5 50 10 50 Z',
    tab: 'M7 46 H56 Q61 46 64 42 L68 37 Q71 33 77 33 H118 Q125 33 125 40 V91 Q125 100 116 100 H9 Q0 100 0 91 V53 Q0 46 7 46 Z',
    tilt: 'M10 46 H115 Q122 46 122 53 V90 Q122 97 115 97 H10 Q3 97 3 90 V53 Q3 46 10 46 Z',
    wave: 'M9 44 H48 Q54 44 60 46.5 L80 54.5 Q87 57.5 94 54.5 L114 46 Q123 42 123 51 V91 Q123 98 116 98 H9 Q2 98 2 91 V51 Q2 44 9 44 Z',
};
// Where the folder's inside sits, as insets in percent of the card.
const INSIDE: Record<FolderShape, string> = {
    sheet: 'left-[3%] right-[3%] top-[16%] bottom-[4%]',
    tab: 'left-[5%] right-[5%] top-[8%] bottom-[10%]',
    tilt: 'left-[3%] right-[3%] top-[16%] bottom-[4%]',
    wave: 'left-[3%] right-[3%] top-[16%] bottom-[4%]',
};

const svgUrl = (d: string) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 125 100' preserveAspectRatio='none'><path d='${d}'/></svg>`)}")`;

/** A frosted pane in the shape of `d`: real backdrop blur, masked to the path, with a hairline edge. */
function Glass({ d, tone, className = '', style, children }: { d: string; tone: 'dark' | 'light'; className?: string; style?: CSSProperties; children?: ReactNode }) {
    const mask = svgUrl(d);
    return (
        <span className={`absolute inset-0 ${className}`} style={style}>
            <span
                aria-hidden
                className={`absolute inset-0 backdrop-blur-md ${tone === 'dark' ? 'bg-[rgba(14,14,18,0.72)]' : 'bg-white/[0.07]'}`}
                style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
            />
            <span
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-b ${tone === 'dark' ? 'from-white/[0.06] to-transparent' : 'from-white/[0.10] to-black/45'}`}
                style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
            />
            <svg aria-hidden viewBox="0 0 125 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                <path d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            {children}
        </span>
    );
}

function Dots({ brand }: { brand: boolean }) {
    return (
        <span aria-hidden className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 border border-white/10">
            {[0, 1, 2].map((k) => (
                <span key={k} className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${brand ? 'border-white/40 group-hover:border-[var(--brand)]' : 'border-white/40'}`} style={{ transitionDelay: `${k * 90}ms` }} />
            ))}
        </span>
    );
}

export default function BrandFolder({ href, name, tagline, count, color, logo, devices, fill = 'handhelds', shape = 'sheet' }: BrandFolderProps) {
    const id = `bf-${shape}-${fill}-${href.replace(/[^a-z0-9]/gi, '')}`;
    const art = devices[0] ?? logo;
    const handhelds = `${count} ${count === 1 ? 'handheld' : 'handhelds'}`;
    const dark = shape === 'tab';

    return (
        <Link
            href={href}
            style={{ ['--brand' as string]: color }}
            className="group relative block aspect-[5/4] rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
        >
            {/* Back panel: brand colour, a blurred wash of the brand's handheld, a dot grid and a sheen */}
            <svg aria-hidden viewBox="0 0 125 100" className="absolute inset-0 w-full h-full">
                <defs>
                    <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor={dark ? 'color-mix(in srgb, var(--brand) 35%, #0b0b0f)' : 'var(--brand)'} />
                        <stop offset="1" stopColor={dark ? '#08080a' : 'color-mix(in srgb, var(--brand) 40%, black)'} />
                    </linearGradient>
                    <radialGradient id={`${id}-s`} cx="0.8" cy="0.05" r="0.75">
                        <stop offset="0" stopColor="white" stopOpacity="0.28" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <pattern id={`${id}-d`} width="3" height="3" patternUnits="userSpaceOnUse">
                        <circle cx="1.5" cy="1.5" r="0.35" fill="white" fillOpacity="0.16" />
                    </pattern>
                    <filter id={`${id}-b`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
                    <clipPath id={`${id}-c`}><path d={BACK[shape]} /></clipPath>
                </defs>
                <g clipPath={`url(#${id}-c)`}>
                    <rect width="125" height="100" fill={`url(#${id}-g)`} />
                    {art && <image href={art} x="-10" y="-20" width="150" height="130" preserveAspectRatio="xMidYMid slice" filter={`url(#${id}-b)`} opacity={dark ? 0.35 : 0.55} style={{ mixBlendMode: 'soft-light' }} />}
                    <rect width="125" height="100" fill={`url(#${id}-d)`} />
                    <rect width="125" height="100" fill={`url(#${id}-s)`} />
                </g>
                <path d={BACK[shape]} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />
            </svg>

            {/* Inside the folder, clipped so nothing escapes the outline */}
            <span aria-hidden className={`absolute overflow-hidden rounded-[18px] ${INSIDE[shape]}`}>
                <span className={`absolute left-[5%] right-[5%] top-[6%] bottom-0 rounded-[14px] transition-transform duration-500 ease-out group-hover:-translate-y-[4%] ${shape === 'tilt' ? 'rotate-[4deg]' : ''} ${dark ? 'bg-zinc-200' : 'bg-white/95'}`}>
                    {fill === 'logo' && (
                        <span className="absolute inset-x-[5%] top-[6%] h-[56%] -rotate-[6deg] transition-transform duration-500 ease-out group-hover:-rotate-[3deg] group-hover:scale-105">
                            {logo ? (
                                <Image src={logo} alt="" fill sizes="(min-width: 1024px) 25vw, 80vw" className="object-contain" />
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center font-pixel text-2xl md:text-3xl text-black uppercase">{name}</span>
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

            {/* Glass front and its text, one layout per shape */}
            {shape === 'sheet' && (
                <Glass d={FRONT.sheet} tone="light">
                    <span className="absolute left-[2%] right-[2%] top-[50%] bottom-[2.5%] flex flex-col px-[6%] py-[5%]">
                        <span className="text-lg md:text-xl font-semibold leading-tight tracking-[-0.02em] text-white truncate">{name}</span>
                        {tagline && <span className="mt-1 text-xs md:text-[13px] text-white/65 leading-snug line-clamp-1">{tagline}</span>}
                        <span className="mt-auto flex items-end justify-between gap-3">
                            <span className="text-white"><span className="text-2xl font-bold tracking-[-0.03em] tabular-nums">{count}</span><span className="ml-1 text-sm text-white/70">{count === 1 ? 'handheld' : 'handhelds'}</span></span>
                            <Dots brand />
                        </span>
                    </span>
                </Glass>
            )}

            {shape === 'tab' && (
                <Glass d={FRONT.tab} tone="dark">
                    {/* the name rides on the front's own tab, like "My Files" in folder 3 */}
                    <span className="absolute left-[63%] right-[3%] top-[35%] flex flex-col">
                        <span className="text-lg md:text-xl font-semibold leading-tight tracking-[-0.02em] text-white truncate">{name}</span>
                        <span className="mt-0.5 font-mono text-[11px] md:text-xs text-white/60 uppercase tracking-wider truncate">{handhelds}</span>
                    </span>
                    <span className="absolute left-[6%] right-[6%] bottom-[7%] flex items-end justify-between gap-3">
                        {tagline && <span className="text-xs md:text-[13px] text-white/60 leading-snug line-clamp-2 max-w-[60%]">{tagline}</span>}
                        <span className="w-2 h-2 rounded-full bg-[var(--brand)] opacity-60 group-hover:opacity-100 transition-opacity" />
                    </span>
                </Glass>
            )}

            {shape === 'tilt' && (
                <Glass d={FRONT.tilt} tone="light" className="origin-bottom-left -rotate-[4deg] transition-transform duration-500 ease-out group-hover:-rotate-[2deg]">
                    <span className="absolute left-[6%] right-[6%] top-[52%] bottom-[7%] flex flex-col">
                        <span className="text-xs md:text-[13px] text-white/65 leading-snug line-clamp-1">{tagline}</span>
                        <span className="mt-auto flex items-end justify-between gap-3">
                            <span className="flex flex-col gap-1.5">
                                <span className="self-start rounded-lg border border-white/15 bg-black/45 px-3 py-1.5 text-base md:text-lg font-semibold text-white">{name}</span>
                                <span className="font-mono text-[11px] text-white/60 uppercase tracking-wider">{handhelds}</span>
                            </span>
                            {/* the round metal button from folder 10 */}
                            <span aria-hidden className="w-11 h-11 rounded-full bg-gradient-to-b from-zinc-100 to-zinc-400 border border-white/60 flex items-center justify-center">
                                <span className="w-4 h-4 rounded-full bg-zinc-500 border-2 border-zinc-200 group-hover:bg-[var(--brand)] transition-colors" />
                            </span>
                        </span>
                    </span>
                </Glass>
            )}

            {shape === 'wave' && (
                <Glass d={FRONT.wave} tone="light">
                    <span className="absolute left-[6%] right-[5%] top-[49%] bottom-[6%] flex flex-col">
                        <span className="text-lg md:text-xl font-semibold leading-tight tracking-[-0.02em] text-white truncate max-w-[50%]">{name}</span>
                        {tagline && <span className="mt-1 text-xs md:text-[13px] text-white/65 leading-snug line-clamp-1 max-w-[55%]">{tagline}</span>}
                        <span className="mt-auto self-end flex items-center gap-2 rounded-full bg-black/85 border border-white/10 pl-2 pr-4 py-2 text-white">
                            <span className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center text-sm leading-none group-hover:bg-[var(--brand)] group-hover:border-transparent transition-colors">+</span>
                            <span className="text-sm font-medium">{handhelds}</span>
                        </span>
                    </span>
                </Glass>
            )}
        </Link>
    );
}
