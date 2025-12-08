'use client';

import { useEffect, useState, type FC } from 'react';
import Link from 'next/link';
import { retroAuth } from '../../lib/auth';

interface AdminEditTriggerProps {
    id: string;
    type: 'variant' | 'console' | 'fabricator';
    label?: string;
    displayMode?: 'fixed' | 'inline';
    color?: 'cyan' | 'amber' | 'pink';
    className?: string;
}

const AdminEditTrigger: FC<AdminEditTriggerProps> = ({ 
    id, 
    type, 
    label, 
    displayMode = 'fixed', 
    color = 'cyan',
    className = ''
}) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const admin = await retroAuth.isAdmin();
            setIsAdmin(admin);
        };
        checkAuth();
    }, []);

    if (!isAdmin) return null;

    // Color Styles
    const colors = {
        cyan: "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-400",
        amber: "border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:bg-amber-400",
        pink: "border-retro-pink text-retro-pink shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:bg-retro-pink",
    };

    const dotColors = {
        cyan: "bg-cyan-400",
        amber: "bg-amber-400",
        pink: "bg-retro-pink",
    };

    const selectedColor = colors[color];
    const selectedDot = dotColors[color];

    const defaultLabel = label || `EDIT ${type.toUpperCase()}`;
    const url = `/admin?mode=edit&type=${type}&id=${id}`;

    // Position Styles
    const positionClasses = displayMode === 'fixed' 
        ? "fixed top-24 right-6 z-50" 
        : "inline-block";

    return (
        <Link 
            href={url}
            className={`${positionClasses} group ${className}`}
        >
            <div className={`
                bg-black/90 border px-3 py-1.5 flex items-center gap-2 
                transition-all duration-300 backdrop-blur-sm clip-path-slant hover:text-black
                ${selectedColor}
            `}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse group-hover:bg-black ${selectedDot}`}></div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest">
                    {defaultLabel}
                </span>
            </div>
        </Link>
    );
};

export default AdminEditTrigger;