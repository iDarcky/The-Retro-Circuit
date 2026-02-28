'use client';

import { useEffect, useState, type FC } from 'react';
import Link from 'next/link';
import { retroAuth } from '../../lib/auth';

interface AdminEditTriggerProps {
    id: string;
    type: 'variant' | 'console' | 'fabricator';
    label?: string;
    slug?: string; // Optional slug for prettier URLs
    displayMode?: 'fixed' | 'inline';
    color?: 'cyan' | 'amber' | 'pink';
    className?: string;
}

const AdminEditTrigger: FC<AdminEditTriggerProps> = ({ 
    id, 
    type, 
    label, 
    slug,
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
        pink: "border-accent text-accent shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:bg-accent",
    };

    const dotColors = {
        cyan: "bg-cyan-400",
        amber: "bg-amber-400",
        pink: "bg-accent",
    };

    const selectedColor = colors[color];
    const selectedDot = dotColors[color];

    const defaultLabel = label || `EDIT ${type.toUpperCase()}`;

    // Determine URL based on new Admin Structure
    let url = '#';
    if (type === 'console') {
        url = slug ? `/admin/consoles/${slug}` : '/admin/consoles';
    } else if (type === 'fabricator') {
        url = `/admin/fabricators?edit_id=${id}`;
    } else {
        // Fallback for variants or unknown types
        url = '/admin/consoles';
    }

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
                bg-bg-primary/90 border px-3 py-1.5 flex items-center gap-2
                transition-all duration-300 backdrop-blur-sm clip-path-slant hover:text-black
                ${selectedColor}
            `}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse group-hover:bg-bg-primary ${selectedDot}`}></div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest">
                    {defaultLabel}
                </span>
            </div>
        </Link>
    );
};

export default AdminEditTrigger;
