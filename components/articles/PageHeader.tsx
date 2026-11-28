import type { ReactNode } from 'react';
import { NEWS_COLOR, NEWS_COLOR_LIGHT } from './theme';

/**
 * The News & Guides page header: pixel-font title, the last part in the page colour
 * gradient with a blinking cursor, then a plain subtitle. Matches the header pattern
 * agreed for every main page.
 */
export default function PageHeader({
    lead,
    accent,
    sub,
    above,
    children,
}: {
    lead: string;
    accent: string;
    sub?: string;
    above?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <header className="border-b border-white/10">
            <div className="max-w-[1240px] mx-auto px-4 md:px-[4vw] pt-10 md:pt-20 pb-8 md:pb-10">
                {above}
                <h1 className="font-pixel text-[22px] md:text-[38px] leading-[1.35] text-white m-0 text-balance">
                    {lead ? `${lead} ` : null}
                    <span
                        className="text-transparent bg-clip-text"
                        style={{ backgroundImage: `linear-gradient(90deg, ${NEWS_COLOR}, ${NEWS_COLOR_LIGHT})` }}
                    >
                        {accent}
                    </span>
                    <span className="animate-pulse motion-reduce:animate-none" style={{ color: NEWS_COLOR }}>_</span>
                </h1>
                {sub && <p className="mt-4 mb-0 text-lg text-gray-400 max-w-[60ch]">{sub}</p>}
                {children}
            </div>
        </header>
    );
}
