'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

interface SwissDropdownOption<T extends string> {
    value: T;
    label: string;
}

interface SwissDropdownProps<T extends string> {
    value: T;
    onChange: (val: T) => void;
    options: SwissDropdownOption<T>[];
    labelPrefix?: string;
}

export function SwissDropdown<T extends string>({
    value,
    onChange,
    options,
    labelPrefix = "SORT"
}: SwissDropdownProps<T>) {
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

    const selectedLabel = options.find(o => o.value === value)?.label || 'SELECT';

    return (
        <div className="relative inline-block" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${isOpen ? 'bg-white text-black border-white' : 'text-white border-white/20 hover:border-white/50 bg-black/40'}`}
            >
                <ArrowUpDown size={14} />
                <span className="hidden md:inline">{labelPrefix}: {selectedLabel}</span>
                <span className="md:hidden">{labelPrefix}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] right-0 min-w-full w-max bg-black border border-white/20 shadow-2xl z-[100] flex flex-col">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-3 text-left text-xs font-mono uppercase tracking-wider border-l-4 transition-colors flex items-center justify-between whitespace-nowrap gap-4 ${
                                value === option.value
                                ? 'bg-white/5 text-white border-violet-500'
                                : 'text-zinc-500 border-transparent hover:bg-white/5 hover:text-white hover:border-white/50'
                            }`}
                        >
                            {option.label}
                            {value === option.value && <span className="text-violet-500 font-bold">_</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
