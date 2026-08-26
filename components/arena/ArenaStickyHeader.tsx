'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';

interface ArenaStickyHeaderProps {
    selectionA: { details: ConsoleDetails | null, selectedVariant: ConsoleVariant | null };
    selectionB: { details: ConsoleDetails | null, selectedVariant: ConsoleVariant | null };
    onReset: () => void;
}

export const ArenaStickyHeader = ({ selectionA, selectionB, onReset }: ArenaStickyHeaderProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Show header after scrolling past the main hero section (approx 400px)
            setIsVisible(scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!selectionA.details || !selectionB.details) return null;

    return (
        <div 
            className={`
                fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out
                ${isVisible ? 'translate-y-0' : '-translate-y-full'}
            `}
        >
            <div className="bg-black/80 backdrop-blur-md border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                        
                        {/* Player A (Left) */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 flex-shrink-0 relative overflow-hidden hidden sm:block">
                                {(selectionA.selectedVariant?.image_url || selectionA.details.image_url) ? (
                                    <Image
                                        src={(selectionA.selectedVariant?.image_url || selectionA.details.image_url) as string}
                                        alt={selectionA.details.name}
                                        fill
                                        sizes="40px"
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-white/20">IMG</div>
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-pixel text-[10px] sm:text-xs text-blue-400 truncate uppercase tracking-wide">
                                    {selectionA.details.name}
                                </span>
                                <span className="font-mono text-[10px] text-white/50 truncate hidden sm:inline">
                                    {selectionA.selectedVariant?.variant_name || 'Base Model'}
                                </span>
                            </div>
                        </div>

                        {/* Center - VS / Reset */}
                        <div className="flex flex-col items-center justify-center gap-1">
                            <span className="font-pixel text-white/20 text-xs">VS</span>
                            <button 
                                onClick={onReset}
                                className="text-[10px] font-mono text-white/50 hover:text-white underline decoration-dotted transition-colors uppercase"
                            >
                                CHANGE
                            </button>
                        </div>

                        {/* Player B (Right) */}
                        <div className="flex items-center justify-end gap-3 min-w-0">
                            <div className="flex flex-col items-end min-w-0">
                                <span className="font-pixel text-[10px] sm:text-xs text-red-400 truncate uppercase tracking-wide text-right">
                                    {selectionB.details.name}
                                </span>
                                <span className="font-mono text-[10px] text-white/50 truncate hidden sm:inline text-right">
                                    {selectionB.selectedVariant?.variant_name || 'Base Model'}
                                </span>
                            </div>
                            <div className="w-10 h-10 bg-white/5 border border-white/10 flex-shrink-0 relative overflow-hidden hidden sm:block">
                                {(selectionB.selectedVariant?.image_url || selectionB.details.image_url) ? (
                                    <Image
                                        src={(selectionB.selectedVariant?.image_url || selectionB.details.image_url) as string}
                                        alt={selectionB.details.name}
                                        fill
                                        sizes="40px"
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-white/20">IMG</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
