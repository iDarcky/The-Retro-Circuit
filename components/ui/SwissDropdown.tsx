'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

export interface SwissDropdownOption<T extends string | number> {
    value: T;
    label: string;
}

interface SwissDropdownProps<T extends string | number> {
    value: T;
    onChange: (val: T) => void;
    options: SwissDropdownOption<T>[];
    labelPrefix?: string;
    className?: string;
    buttonClassName?: string;
    menuClassName?: string;
    compact?: boolean;
    inverted?: boolean;
}

export function SwissDropdown<T extends string | number>({
    value,
    onChange,
    options,
    labelPrefix = "SORT",
    className = "",
    buttonClassName = "",
    menuClassName = "z-[100]",
    compact = false,
    inverted = true
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

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    const showPrefix = labelPrefix && labelPrefix.length > 0;

    return (
        <div className={`relative inline-block ${className}`} ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full gap-2 font-mono uppercase tracking-wider border transition-all
                    ${compact ? 'px-2 py-1 text-[10px]' : 'px-4 py-2 text-xs'}
                    ${inverted
                        ? (isOpen
                            ? 'bg-white text-black border-white'
                            : 'text-white border-white/20 hover:border-white/50 bg-black/40')
                        : (isOpen
                            ? 'bg-zinc-800 text-white border-white'
                            : 'text-zinc-300 border-zinc-700 hover:border-zinc-500 bg-zinc-900/50')
                    }
                    ${buttonClassName}
                `}
            >
                <div className="flex items-center gap-2 truncate">
                    {!compact && <ArrowUpDown size={14} className="shrink-0" />}
                    {showPrefix ? (
                        <>
                            <span className="hidden md:inline truncate">{labelPrefix}: {selectedLabel}</span>
                            <span className="md:hidden truncate">{labelPrefix}</span>
                        </>
                    ) : (
                        <span className="truncate">{selectedLabel}</span>
                    )}
                </div>
                <ChevronDown size={compact ? 10 : 12} className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute top-[calc(100%+4px)] right-0 min-w-full w-max bg-[#09090b] border border-white/20 shadow-2xl flex flex-col ${menuClassName}`}>
                    {options.map((option) => (
                        <button
                            key={String(option.value)}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`text-left font-mono uppercase tracking-wider border-l-4 transition-colors flex items-center justify-between whitespace-nowrap gap-4
                                ${compact ? 'px-3 py-2 text-[10px]' : 'px-4 py-3 text-xs'}
                                ${value === option.value
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
