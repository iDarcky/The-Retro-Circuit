'use client';

import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';

interface ConsoleSearchProps {
    consoles: {name: string, slug: string}[];
    onSelect: (slug: string, name: string) => void;
    placeholder?: string;
    themeColor: 'primary' | 'secondary' | 'cyan' | 'pink'; // Backwards compatibility if needed
    currentSelection?: string;
    textColor?: 'default' | 'white';
}

export const ConsoleSearch: FC<ConsoleSearchProps> = ({ consoles, onSelect, placeholder = "SELECT SYSTEM...", themeColor, currentSelection, textColor = 'default' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
    
    // Theme mapping - In "Swiss", Primary is Orange, Secondary is White. Both are just "Active" borders.
    const isPrimary = themeColor === 'primary' || themeColor === 'cyan';
    const activeBorder = isPrimary ? 'focus:border-color-primary' : 'focus:border-white';
    const activeRing = isPrimary ? 'focus:ring-1 focus:ring-color-primary' : 'focus:ring-1 focus:ring-white';

    // Determine input text color
    const inputTextColor = textColor === 'white' ? 'text-white' : 'text-text-primary';
    // Determine icon color
    const iconColor = textColor === 'white' ? 'text-white/50 group-focus-within:text-white' : 'text-text-muted group-focus-within:text-text-primary';

    return (
        <div className="relative w-full group" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={currentSelection || placeholder}
                    className={`w-full bg-transparent border border-border-normal p-4 pl-10 font-mono text-sm ${inputTextColor} uppercase tracking-wider outline-none rounded-none transition-all placeholder:text-text-muted ${activeBorder} ${activeRing}`}
                />
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${iconColor}`}>
                    <Search size={14} strokeWidth={1.5} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%-1px)] max-h-[300px] overflow-y-auto bg-bg-primary border border-border-normal border-t-transparent z-[9999] shadow-xl">
                    {filtered.map(c => (
                        <div 
                            key={c.slug}
                            onClick={() => {
                                onSelect(c.slug, c.name);
                                setSearchTerm('');
                                setIsOpen(false);
                            }}
                            className={`p-3 px-4 text-xs font-mono cursor-pointer hover:bg-bg-tertiary hover:text-white text-text-secondary border-b border-border-subtle last:border-0 flex justify-between items-center group transition-colors uppercase tracking-wide`}
                        >
                            <span>{c.name}</span>
                            <span className={`opacity-0 group-hover:opacity-100 text-[10px] text-color-primary`}>SELECT</span>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-4 text-xs font-mono text-text-muted text-center italic uppercase">NO MATCHES</div>
                    )}
                </div>
            )}
        </div>
    );
};
