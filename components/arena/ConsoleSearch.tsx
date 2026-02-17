'use client';

import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { useSound } from '../ui/SoundContext';
import { Search } from 'lucide-react';

interface ConsoleSearchProps {
    consoles: {name: string, slug: string}[];
    onSelect: (slug: string, name: string) => void;
    placeholder?: string;
    themeColor: 'primary' | 'secondary' | 'cyan' | 'pink'; // Backwards compatibility if needed
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
    
    // Theme mapping
    const isPrimary = themeColor === 'primary' || themeColor === 'cyan';

    const focusClass = isPrimary ? 'focus:border-color-primary focus:ring-1 focus:ring-color-primary/50' : 'focus:border-color-secondary focus:ring-1 focus:ring-color-secondary/50';
    const textClass = isPrimary ? 'text-color-primary' : 'text-color-secondary';

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={currentSelection || placeholder}
                    className={`w-full bg-bg-tertiary border border-border-normal rounded-sm p-4 pl-10 font-mono text-sm text-text-primary outline-none ${focusClass} transition-all placeholder:text-text-muted`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                    <Search size={16} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] max-h-[300px] overflow-y-auto bg-bg-secondary border border-border-normal rounded-sm z-[100] shadow-2xl glass-panel">
                    {filtered.map(c => (
                        <div 
                            key={c.slug}
                            onClick={() => {
                                onSelect(c.slug, c.name);
                                setSearchTerm('');
                                setIsOpen(false);
                            }}
                            onMouseEnter={playHover}
                            className={`p-3 px-4 text-sm font-mono cursor-pointer hover:bg-bg-tertiary hover:text-white text-text-secondary border-b border-border-subtle last:border-0 flex justify-between items-center group transition-colors`}
                        >
                            <span>{c.name}</span>
                            <span className={`opacity-0 group-hover:opacity-100 ${textClass} text-xs`}>SELECT</span>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-4 text-sm font-mono text-text-muted text-center italic">NO MATCHING SYSTEMS FOUND</div>
                    )}
                </div>
            )}
        </div>
    );
};
