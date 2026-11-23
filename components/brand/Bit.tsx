'use client';

/* Bit, the site's mascot: the neon artwork from the brand guide, traced as a vector
 * so each part can move on its own. The hand waves, the eyes blink, the body bobs
 * and the neon flickers now and then. Limbs are drawn as "tubes": a wide pink stroke
 * with a narrower dark stroke on top, which leaves a neon outline.
 * All motion stops for anyone who asks the system for reduced motion. */

import { useId } from 'react';

const CYAN = '#2EF0FF';
const PINK = '#FF3FD2';
const DARK = '#06101C';

/** Pink outline tubes: every outer stroke first, then every inner one, so shapes merge. */
function Tubes({ paths, w = 44, line = 9 }: { paths: string[]; w?: number; line?: number }) {
    return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {paths.map((d) => <path key={`o${d}`} d={d} stroke={PINK} strokeWidth={w} />)}
            {paths.map((d) => <path key={`i${d}`} d={d} stroke={DARK} strokeWidth={w - line * 2} />)}
        </g>
    );
}

export default function Bit({ size = 160, className = '', title }: { size?: number; className?: string; title?: string }) {
    const glow = `bitglow${useId().replace(/:/g, '')}`;
    return (
        <svg
            viewBox="120 160 860 740"
            width={size}
            height={size * (740 / 860)}
            role={title ? 'img' : undefined}
            aria-label={title}
            aria-hidden={title ? undefined : true}
            className={`group/bit overflow-visible ${className}`}
        >
            <defs>
                <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="7" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            <g filter={`url(#${glow})`} className="motion-safe:animate-[neonFlicker_7s_linear_infinite]">
                {/* Shoes and legs stay planted */}
                {/* Legs and shoes stay planted: one outline each */}
                <g fill={DARK} stroke={PINK} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
                    <path d="M394,716 L379,816 Q336,816 316,836 Q298,860 318,876 Q330,884 360,884 L428,884 Q456,882 454,856 Q452,834 438,818 L448,716" />
                    <path d="M566,716 L560,818 Q546,834 546,856 Q546,882 574,884 L644,884 Q674,884 686,876 Q706,860 688,836 Q668,816 626,816 L620,716" />
                    <path d="M379,816 Q392,818 402,828 M626,816 Q612,818 604,828" fill="none" />
                </g>

                {/* Everything above the legs bobs */}
                <g className="motion-safe:animate-[bitBob_1.4s_ease-in-out_infinite]">
                    {/* Waving arm, behind the body, swinging from the shoulder */}
                    <g
                        style={{ transformBox: 'fill-box', transformOrigin: '11% 99%' }}
                        className="motion-safe:animate-[bitWave_2.8s_ease-in-out_infinite] group-hover/bit:motion-safe:[animation-duration:1s]"
                    >
                        <Tubes w={44} paths={[
                            'M720,520 Q800,512 822,440',
                            'M838,398 L842,298', 'M848,398 L892,312', 'M852,404 L924,356', 'M822,402 L790,336',
                            'M836,402 m-38,0 a38,38 0 1,0 76,0 a38,38 0 1,0 -76,0',
                        ]} />
                        <ellipse cx="826" cy="436" rx="36" ry="12" transform="rotate(-30 826 436)" fill={DARK} stroke={PINK} strokeWidth="9" />
                    </g>

                    {/* Arm on the hip, upper part behind the body */}
                    <Tubes w={44} paths={['M300,490 C210,476 150,540 196,600']} />

                    {/* Body: side panel, then front face */}
                    <path d="M332,196 L292,212 Q258,226 258,262 L258,712 Q258,744 292,744 L336,744" fill={DARK} stroke={CYAN} strokeWidth="11" strokeLinejoin="round" />
                    <rect x="318" y="194" width="418" height="548" rx="40" fill={DARK} stroke={CYAN} strokeWidth="11" />
                    {/* Screen bezel and lit screen */}
                    <rect x="356" y="238" width="338" height="278" rx="24" fill="none" stroke={CYAN} strokeWidth="11" />
                    <rect x="390" y="268" width="276" height="218" rx="12" fill={CYAN} />
                    {/* Face */}
                    <g
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        className="motion-safe:animate-[bitBlink_4.5s_ease-in-out_infinite]"
                    >
                        <ellipse cx="470" cy="346" rx="30" ry="40" fill={DARK} />
                        <ellipse cx="594" cy="346" rx="30" ry="40" fill={DARK} />
                        <circle cx="480" cy="332" r="8" fill={CYAN} />
                        <circle cx="604" cy="332" r="8" fill={CYAN} />
                    </g>
                    <path d="M470,410 Q474,470 532,470 Q590,470 594,410 Q532,428 470,410 Z" fill={DARK} />
                    <ellipse cx="532" cy="452" rx="30" ry="9" fill={CYAN} opacity="0.85" />
                    {/* D-pad, two buttons, speaker */}
                    <path d="M414,550 h42 v38 h38 v42 h-38 v38 h-42 v-38 h-38 v-42 h38 Z" fill="none" stroke={CYAN} strokeWidth="10" strokeLinejoin="round" />
                    <circle cx="607" cy="626" r="32" fill="none" stroke={CYAN} strokeWidth="10" />
                    <circle cx="668" cy="580" r="30" fill="none" stroke={CYAN} strokeWidth="10" />
                    <path d="M480,702 L512,690 M548,702 L580,690" stroke={CYAN} strokeWidth="11" strokeLinecap="round" />

                    {/* Fist resting on the side, in front */}
                    <Tubes w={44} paths={['M196,600 Q210,612 224,612']} />
                    <g fill={DARK} stroke={PINK} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
                        <path d="M228,588 Q244,570 262,586 Q300,600 302,646 Q302,700 250,708 Q222,712 212,694 Q190,690 196,668 Q176,656 190,636 Q176,614 198,602 Q206,584 228,588 Z" />
                        <path d="M212,694 Q224,684 238,688 M196,668 Q212,658 228,662 M190,636 Q204,626 220,630 M228,588 Q234,604 228,614" fill="none" />
                    </g>
                </g>
            </g>
        </svg>
    );
}
