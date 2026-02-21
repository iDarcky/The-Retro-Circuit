'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import { ChevronDown } from 'lucide-react';
import { ConsoleVariant } from '../../lib/types';

interface VariantSelectorProps {
    variants: ConsoleVariant[];
    selectedSlug: string;
    onSelect: (slug: string) => void;
    themeColor: 'primary' | 'secondary' | 'cyan' | 'pink';
}

export const VariantSelector: FC<VariantSelectorProps> = ({ variants, selectedSlug, onSelect, themeColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedVariant = variants.find(v => v.slug === selectedSlug) || variants[0];

    // Theme styles
    const isPrimary = themeColor === 'primary' || themeColor === 'cyan';
    const textColor = isPrimary ? 'text-color-primary' : 'text-color-secondary';
    const borderColor = isPrimary ? 'border-color-primary' : 'border-color-secondary';

    // Simplification: Standard scrollbar classes from global.css should suffice, but keeping custom ones for specificity
    const scrollbarColor = isPrimary
        ? '[&::-webkit-scrollbar-thumb]:bg-color-primary [&::-webkit-scrollbar-track]:border-color-primary/30'
        : '[&::-webkit-scrollbar-thumb]:bg-color-secondary [&::-webkit-scrollbar-track]:border-color-secondary/30';

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
        onSelect(slug);
        setIsOpen(false);
    };

    if (!variants || variants.length <= 1) return null;

    return (
        <div className="relative inline-block w-full md:w-auto" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-2 font-mono text-[10px] md:text-xs text-text-primary outline-none w-full md:w-auto hover:bg-bg-card p-1 rounded-sm transition-colors`}
            >
                <span className="opacity-70 text-text-muted">VARIANT:</span>
                <span className={`underline decoration-1 underline-offset-4 ${textColor} font-bold truncate`}>
                    {selectedVariant?.variant_name}
                </span>
                <ChevronDown className={`w-3 h-3 ${textColor} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute left-0 top-full mt-2 w-full md:w-48 max-h-48 overflow-y-auto bg-bg-secondary border ${borderColor} z-50 ${scrollbarColor} shadow-xl glass-panel`}>
                    {variants.map(v => (
                        <div
                            key={v.id}
                            onClick={() => handleSelect(v.slug || '')}
                            className={`p-3 text-[10px] md:text-xs font-mono cursor-pointer ${textColor} border-b border-border-subtle last:border-0 hover:bg-white/10 ${v.slug === selectedSlug ? 'bg-white/5' : ''} transition-colors`}
                        >
                            {v.variant_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
