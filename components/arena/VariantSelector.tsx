'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import { ChevronDown } from 'lucide-react';
import { ConsoleVariant } from '../../lib/types';

interface VariantSelectorProps {
    variants: ConsoleVariant[];
    selectedSlug: string;
    onSelect: (slug: string) => void;
    themeColor: 'primary' | 'secondary' | 'cyan' | 'pink' | 'orange' | 'blue' | 'red';
}

export const VariantSelector: FC<VariantSelectorProps> = ({ variants, selectedSlug, onSelect, themeColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedVariant = variants.find(v => v.slug === selectedSlug) || variants[0];

    // Theme Logic
    const getThemeClasses = () => {
        switch (themeColor) {
            case 'blue':
            case 'cyan':
            case 'primary':
                return { text: 'text-blue-500', border: 'border-blue-500', hover: 'hover:text-blue-400' };
            case 'red':
            case 'orange':
            case 'secondary':
                return { text: 'text-red-500', border: 'border-red-500', hover: 'hover:text-red-400' };
            case 'pink':
                return { text: 'text-pink-500', border: 'border-pink-500', hover: 'hover:text-pink-400' };
            default:
                return { text: 'text-violet-500', border: 'border-violet-500', hover: 'hover:text-violet-400' };
        }
    };
    const theme = getThemeClasses();

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
        <div className="relative inline-block w-full md:w-auto z-40" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-2 font-mono text-[10px] md:text-xs text-text-primary outline-none w-full md:w-auto hover:bg-bg-tertiary p-1 rounded-none transition-colors border border-transparent hover:border-border-subtle`}
            >
                <span className="opacity-50 uppercase tracking-widest">VARIANT:</span>
                <span className={`underline decoration-1 underline-offset-4 ${theme.text} font-bold truncate uppercase`}>
                    {selectedVariant?.variant_name}
                </span>
                <ChevronDown className={`w-3 h-3 ${theme.text} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute left-0 top-full mt-1 w-full md:w-48 max-h-48 overflow-y-auto bg-bg-primary border ${theme.border} shadow-xl`}>
                    {variants.map(v => (
                        <div
                            key={v.id}
                            onClick={() => handleSelect(v.slug || '')}
                            className={`
                                p-3 text-[10px] md:text-xs font-mono cursor-pointer border-b border-border-subtle last:border-0
                                ${v.slug === selectedSlug ? `bg-border-subtle text-text-primary` : `text-text-muted hover:bg-bg-tertiary hover:text-text-primary`}
                                transition-colors uppercase tracking-wide
                            `}
                        >
                            {v.variant_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
