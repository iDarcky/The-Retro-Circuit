import Image from 'next/image';

/* A brand as a small desktop folder icon, after folder 11 of the owner's Figma set (tab on the
 * right, glass front with a dipped top edge). The brand's logo sits on a sheet inside. The back
 * is the brand colour broken into a pixel dither, to match the site's pixel type. When the cursor is on it
 * (hover, focus or the arrow keys) the folder opens: the glass front swings down and the sheet with the logo
 * rises out. The label sits under the icon, like a file name on a desktop. */

export interface BrandFolderIconProps {
    name: string;
    count: number;
    color: string;
    logo: string | null;
    selected?: boolean; // the console-style cursor is on it: the folder opens
    onSelect?: () => void;
    onOpen?: () => void;
}

const BACK = 'M125 7 Q125 0 118 0 H81 Q76.5 0 74 3.5 L71 8 Q68.5 11 64 11 H7 Q0 11 0 18 V93 Q0 100 7 100 H118 Q125 100 125 93 Z';
const FRONT = 'M9 40 H46 Q53 40 59 43 L79 53 Q86 56.5 93 53 L114 42.5 Q123 38 123 48 V92 Q123 99 116 99 H9 Q2 99 2 92 V47 Q2 40 9 40 Z';
const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 125 100' preserveAspectRatio='none'><path d='${FRONT}'/></svg>`)}")`;

export default function BrandFolderIcon({ name, count, color, logo, selected = false, onSelect, onOpen }: BrandFolderIconProps) {
    const id = `bfi-${name.replace(/[^a-z0-9]/gi, '')}`;
    return (
        <button
            type="button"
            onMouseEnter={onSelect}
            onFocus={onSelect}
            onClick={onOpen}
            aria-label={`${name}, ${count} ${count === 1 ? 'handheld' : 'handhelds'}`}
            style={{ ['--brand' as string]: color }}
            className={`group relative w-full flex flex-col items-center gap-3 rounded-xl p-3 outline-none transition-colors ${selected ? 'bg-white/[0.06] ring-2 ring-[var(--brand)]' : ''}`}
        >
            {/* the cursor: a pixel arrow bobbing over the selected folder */}
            <span aria-hidden className={`absolute -top-1 left-1/2 -translate-x-1/2 font-pixel text-[10px] text-[var(--brand)] motion-safe:animate-bounce ${selected ? 'opacity-100' : 'opacity-0'}`}>▼</span>
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
                <span aria-hidden className={`absolute left-[9%] right-[9%] top-[18%] bottom-[6%] rounded-[8px] bg-white transition-transform duration-300 ease-out ${selected ? '-translate-y-[22%] -rotate-3' : ''}`}>
                    <span className="absolute inset-x-[10%] top-[8%] h-[38%]">
                        {logo ? (
                            <Image src={logo} alt="" fill sizes="120px" className="object-contain" />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-pixel text-[9px] text-black uppercase text-center leading-tight">{name}</span>
                        )}
                    </span>
                </span>

                {/* Glass front with the dipped edge, swings down to open */}
                <span aria-hidden className={`absolute inset-0 origin-bottom transition-transform duration-300 ease-out ${selected ? '[transform:rotateX(38deg)]' : ''}`}>
                    <span className="absolute inset-0 backdrop-blur-[6px] bg-white/[0.10]" style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }} />
                    <span className="absolute inset-0 bg-gradient-to-b from-white/[0.18] to-black/50" style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }} />
                    <svg viewBox="0 0 125 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                        <path d={FRONT} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="absolute right-[7%] bottom-[9%] font-mono text-[10px] leading-none text-white/80 tabular-nums">{count}</span>
                </span>
            </span>
            <span className="max-w-full text-center">
                <span className={`block font-mono text-xs text-white truncate transition-colors ${selected ? 'text-[var(--brand)]' : ''}`}>{name}</span>
            </span>
        </button>
    );
}
