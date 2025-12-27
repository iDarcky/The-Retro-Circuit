'use client';

import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { useSound } from '../ui/SoundContext';

interface ConsoleSearchProps {
    consoles: {name: string, slug: string}[];
    onSelect: (slug: string, name: string) => void;
    placeholder?: string;
    themeColor: 'cyan' | 'pink';
    currentSelection?: string;
}

export const ConsoleSearch: FC<ConsoleSearchProps> = ({ consoles, onSelect, placeholder = "SELECT SYSTEM...", themeColor, currentSelection }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { playHover } = useSound();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = consoles.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const borderColor = themeColor === 'cyan' ? 'border-primary' : 'border-accent';
    const textColor = themeColor === 'cyan' ? 'text-primary' : 'text-accent';
    const focusColor = themeColor === 'cyan' ? 'focus:border-primary' : 'focus:border-accent';
    const scrollbarColor = themeColor === 'cyan'
        ? '[&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:border-primary/30'
        : '[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:border-accent/30';

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <input 
                type="text"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder={currentSelection || placeholder}
                className={`w-full bg-black/80 border-b-2 ${borderColor} p-2 font-mono text-xs md:text-sm text-white outline-none ${focusColor} transition-colors placeholder-gray-500`}
            />
            {isOpen && (
                <div className={`absolute left-0 right-0 top-full max-h-60 overflow-y-auto bg-black border border-gray-700 z-[100] ${scrollbarColor}`}>
                    {filtered.map(c => (
                        <div 
                            key={c.slug}
                            onClick={() => {
                                onSelect(c.slug, c.name);
                                setSearchTerm('');
                                setIsOpen(false);
                            }}
                            onMouseEnter={playHover}
                            className={`p-2 text-xs font-mono cursor-pointer hover:bg-white/10 ${textColor} border-b border-white/5`}
                        >
                            {c.name}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-2 text-xs font-mono text-gray-600">NO MATCHES</div>
                    )}
                </div>
            )}
        </div>
    );
};
