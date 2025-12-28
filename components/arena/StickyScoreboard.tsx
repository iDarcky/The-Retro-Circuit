'use client';

import { useEffect, useState } from 'react';
import { ConsoleVariant } from '../../lib/types';

interface StickyScoreboardProps {
    visible: boolean;
    variantA: ConsoleVariant | null;
    variantB: ConsoleVariant | null;
    activeSection: string;
}

export const StickyScoreboard = ({ visible, variantA, variantB, activeSection }: StickyScoreboardProps) => {
    const [shouldRender, setShouldRender] = useState(visible);

    // Handle exit animation
    useEffect(() => {
        if (visible) setShouldRender(true);
        else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!shouldRender) return null;

    return (
        <div
            className={`
                fixed top-0 left-0 right-0 z-50
                bg-black/90 border-b border-white/10 backdrop-blur-md
                transition-transform duration-300 ease-in-out
                ${visible ? 'translate-y-0' : '-translate-y-full'}
            `}
        >
            <div className="max-w-7xl mx-auto px-4 h-12 md:h-14 flex items-center justify-between">

                {/* Left: Active Section */}
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
                    <span className="font-pixel text-[10px] md:text-xs text-white tracking-widest uppercase">
                        {activeSection}
                    </span>
                </div>

                {/* Right: Matchup */}
                <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs md:text-sm text-primary truncate max-w-[100px] md:max-w-[200px] text-right">
                            {variantA?.variant_name || 'PLAYER 1'}
                        </span>
                    </div>

                    <span className="font-pixel text-[8px] md:text-[10px] text-gray-500">VS</span>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs md:text-sm text-accent truncate max-w-[100px] md:max-w-[200px]">
                            {variantB?.variant_name || 'PLAYER 2'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
