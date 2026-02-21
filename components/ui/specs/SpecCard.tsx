'use client';

import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SpecCard = ({
    title,
    className = "",
    children,
    collapsible = false,
    defaultOpen = true
}: {
    title: string,
    className?: string,
    children?: ReactNode,
    collapsible?: boolean,
    defaultOpen?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggle = () => {
        if (collapsible) setIsOpen(!isOpen);
    };

    return (
        <div className={`bg-bg-primary border border-border-normal relative overflow-hidden group hover:border-primary/50 transition-colors ${className}`}>
            {/* Header Strip */}
            <div
                className={`bg-black/40 border-b border-border-normal px-4 py-2 flex justify-between items-center ${collapsible ? 'cursor-pointer hover:bg-white/5' : ''}`}
                onClick={toggle}
            >
                <h3 className="font-pixel text-[10px] text-primary uppercase tracking-widest">{title}</h3>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-secondary transition-colors"></div>
                        <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-secondary transition-colors delay-75"></div>
                    </div>
                    {collapsible && (
                        <div className="text-gray-500 hover:text-white transition-colors ml-2">
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                    )}
                </div>
            </div>
            {/* Content Body */}
            {(!collapsible || isOpen) && (
                <div className="p-4 space-y-3 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};
