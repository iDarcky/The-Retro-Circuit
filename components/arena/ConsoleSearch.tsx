'use client';

import { useState, useEffect, useRef, type FC, type ChangeEvent, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';

interface ConsoleSearchProps {
    consoles: {name: string, slug: string}[];
    onSelect: (slug: string, name: string) => void;
    placeholder?: string;
    themeColor: 'primary' | 'secondary' | 'cyan' | 'pink' | 'orange' | 'blue' | 'red';
    currentSelection?: string;
    textColor?: 'default' | 'white';
}

export const ConsoleSearch: FC<ConsoleSearchProps> = ({ consoles, onSelect, placeholder = "SELECT SYSTEM...", themeColor, currentSelection, textColor = 'default' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

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

    // Reset active index when search changes or menu opens
    useEffect(() => {
        setActiveIndex(-1);
    }, [searchTerm, isOpen]);
    
    // Theme Color Logic
    const getThemeClasses = () => {
        switch (themeColor) {
            case 'blue':
            case 'cyan':
            case 'primary':
                return {
                    border: 'focus:border-blue-500',
                    activeItem: 'border-blue-500',
                    text: 'text-blue-500',
                    bgHover: 'hover:bg-blue-500/10',
                    ring: 'focus-visible:ring-blue-500'
                };
            case 'red':
            case 'orange':
            case 'secondary':
                return {
                    border: 'focus:border-red-500',
                    activeItem: 'border-red-500',
                    text: 'text-red-500',
                    bgHover: 'hover:bg-red-500/10',
                    ring: 'focus-visible:ring-red-500'
                };
            case 'pink':
                return {
                    border: 'focus:border-pink-500',
                    activeItem: 'border-pink-500',
                    text: 'text-pink-500',
                    bgHover: 'hover:bg-pink-500/10',
                    ring: 'focus-visible:ring-pink-500'
                };
            default: // Fallback to Violet/System
                return {
                    border: 'focus:border-violet-500',
                    activeItem: 'border-violet-500',
                    text: 'text-violet-500',
                    bgHover: 'hover:bg-violet-500/10',
                    ring: 'focus-visible:ring-violet-500'
                };
        }
    };

    const theme = getThemeClasses();

    // Determine input text color
    const inputTextColor = textColor === 'white' ? 'text-text-primary' : 'text-text-primary';
    // Determine icon color
    const iconColor = textColor === 'white' ? 'text-text-muted group-focus-within:text-text-primary' : 'text-text-muted group-focus-within:text-text-primary';

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < filtered.length) {
                    const selected = filtered[activeIndex];
                    onSelect(selected.slug, selected.name);
                    setSearchTerm('');
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
        }
    };

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const list = listRef.current;
            const element = list.children[activeIndex] as HTMLElement;
            if (element) {
                const listTop = list.scrollTop;
                const listBottom = listTop + list.clientHeight;
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;

                if (elementTop < listTop) {
                    list.scrollTop = elementTop;
                } else if (elementBottom > listBottom) {
                    list.scrollTop = elementBottom - list.clientHeight;
                }
            }
        }
    }, [activeIndex]);

    return (
        <div className="relative w-full group" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentSelection || placeholder}
                    className={`
                        w-full bg-bg-primary/50 border border-border-subtle p-4 pl-10
                        font-mono text-sm ${inputTextColor} uppercase tracking-wider 
                        rounded-none transition-all placeholder:text-border-normal
                        ${theme.border} focus-visible:ring-1 ${theme.ring} focus:outline-none
                    `}
                />
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${iconColor}`}>
                    <Search size={14} strokeWidth={1.5} />
                </div>
            </div>

            {isOpen && (
                <div
                    ref={listRef}
                    className="absolute left-0 right-0 top-[calc(100%-1px)] max-h-[300px] overflow-y-auto bg-bg-primary border border-border-subtle border-t-transparent z-[9999] shadow-xl"
                >
                    {filtered.map((c, idx) => (
                        <div 
                            key={c.slug}
                            onClick={() => {
                                onSelect(c.slug, c.name);
                                setSearchTerm('');
                                setIsOpen(false);
                            }}
                            className={`
                                p-3 px-4 text-xs font-mono cursor-pointer border-b border-border-strong/5 last:border-0 flex justify-between items-center group transition-colors uppercase tracking-wide border-l-4
                                ${idx === activeIndex 
                                    ? `bg-border-subtle text-text-primary ${theme.activeItem}`
                                    : `text-text-muted border-transparent hover:bg-bg-tertiary hover:text-text-primary hover:border-border-normal`}
                            `}
                        >
                            <span>{c.name}</span>
                            <span className={`opacity-0 ${idx === activeIndex ? 'opacity-100' : 'group-hover:opacity-100'} text-[10px] ${theme.text}`}>SELECT</span>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-4 bg-bg-primary/50 border-t border-border-strong/5 flex flex-col items-center justify-center gap-2">
                            <span className="text-xs font-mono text-border-normal text-center uppercase tracking-wider">NO MATCHES FOUND</span>
                            <span className="text-[10px] font-mono text-border-normal text-center uppercase tracking-widest">TRY &apos;GAMEBOY&apos;</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
