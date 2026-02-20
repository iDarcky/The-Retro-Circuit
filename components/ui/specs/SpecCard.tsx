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
        <div className={`${className} ${collapsible ? 'py-4 border-t border-border-normal first:border-t-0' : 'pb-0'}`}>
            {/* Header: Simple Text + Interaction */}
            <div
                className={`flex justify-between items-center mb-4 ${collapsible ? 'cursor-pointer group' : ''}`}
                onClick={toggle}
            >
                <h3 className="font-sans text-sm font-black text-white uppercase tracking-wider group-hover:text-secondary transition-colors">
                    {title}
                </h3>
                {collapsible && (
                    <div className="text-gray-500 group-hover:text-white transition-colors">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                )}
            </div>

            {/* Content: Direct Flow */}
            {(!collapsible || isOpen) && (
                <div className="space-y-4 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};
