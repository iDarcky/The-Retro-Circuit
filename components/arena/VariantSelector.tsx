'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import { useSound } from '../ui/SoundContext';
import { ChevronDown } from 'lucide-react';
import { ConsoleVariant } from '../../lib/types';

interface VariantSelectorProps {
    variants: ConsoleVariant[];
    selectedSlug: string;
    onSelect: (slug: string) => void;
    themeColor: 'cyan' | 'pink';
}

export const VariantSelector: FC<VariantSelectorProps> = ({ variants, selectedSlug, onSelect, themeColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { playHover, playClick } = useSound();

    const selectedVariant = variants.find(v => v.slug === selectedSlug) || variants[0];

    // Theme styles
    const textColor = themeColor === 'cyan' ? 'text-primary' : 'text-accent';
    const borderColor = themeColor === 'cyan' ? 'border-primary' : 'border-accent';
    const scrollbarColor = themeColor === 'cyan'
        ? '[&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:border-primary/30'
        : '[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:border-accent/30';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (slug: string) => {
        playClick();
        onSelect(slug);
        setIsOpen(false);
    };

    if (!variants || variants.length <= 1) return null;

    return (
        <div className="relative inline-block w-full md:w-auto" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-2 font-mono text-[10px] md:text-xs text-white outline-none w-full md:w-auto`}
                onMouseEnter={playHover}
            >
                <span className="opacity-70">Variant:</span>
                <span className={`underline decoration-1 underline-offset-4 ${textColor} font-bold truncate`}>
                    {selectedVariant?.variant_name}
                </span>
                <ChevronDown className={`w-3 h-3 ${textColor} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute left-0 top-full mt-2 w-full md:w-48 max-h-48 overflow-y-auto bg-black border ${borderColor} z-50 ${scrollbarColor} shadow-xl`}>
                    {variants.map(v => (
                        <div
                            key={v.id}
                            onClick={() => handleSelect(v.slug || '')}
                            onMouseEnter={playHover}
                            className={`p-2 text-[10px] md:text-xs font-mono cursor-pointer ${textColor} border-b border-white/5 last:border-0 hover:bg-white/10 ${v.slug === selectedSlug ? 'bg-white/5' : ''}`}
                        >
                            {v.variant_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
