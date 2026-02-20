
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
        <div className={`
            bg-white/[0.02] border border-white/5 p-6 md:p-8 h-full relative overflow-hidden group
            transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]
            ${className}
        `}>
            {/* Header: Subtle, Clean */}
            <div
                className={`flex justify-between items-center mb-6 ${collapsible ? 'cursor-pointer' : ''}`}
                onClick={toggle}
            >
                <h3 className="font-sans text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
                    {title}
                </h3>
                {collapsible && (
                    <div className="text-gray-600 group-hover:text-white transition-colors">
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                )}
            </div>

            {/* Content: Structured Grid Feel */}
            {(!collapsible || isOpen) && (
                <div className="space-y-3 animate-fadeIn">
                    {children}
                </div>
            )}

            {/* Subtle decorative corner */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
};
