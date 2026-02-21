'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { IconHome, IconChip, IconDatabase, IconVS } from '../ui/Icons';

type NavVariant = 'docked-swiss' | 'floating-swiss' | 'minimal-pill';

const MobileBottomNav = () => {
    const pathname = usePathname();
    const [variant, setVariant] = useState<NavVariant>('docked-swiss');

    const navItems = [
        { label: 'Home', icon: IconHome, path: '/', exact: true },
        { label: 'Fabricators', icon: IconChip, path: '/fabricators' },
        { label: 'Consoles', icon: IconDatabase, path: '/consoles' },
        { label: 'VS Mode', icon: IconVS, path: '/arena' },
    ];

    const toggleVariant = () => {
        setVariant(prev => {
            if (prev === 'docked-swiss') return 'floating-swiss';
            if (prev === 'floating-swiss') return 'minimal-pill';
            return 'docked-swiss';
        });
    };

    // --- VARIANT CONFIGURATIONS ---

    const getWrapperStyles = () => {
        switch (variant) {
            case 'docked-swiss':
                return "fixed bottom-0 left-0 right-0 bg-bg-primary border-t-2 border-violet-500 z-50 flex items-center justify-around pb-safe pt-3";
            case 'floating-swiss':
                return "fixed bottom-6 left-4 right-4 h-16 bg-bg-primary border border-white/20 shadow-lg z-50 flex items-center justify-around px-2";
            case 'minimal-pill':
                return "fixed bottom-6 left-6 right-6 h-14 bg-bg-primary/90 backdrop-blur-md border border-white/10 rounded-full shadow-lg z-50 flex items-center justify-around px-4";
            default:
                return "";
        }
    };

    const getItemStyles = (isActive: boolean) => {
        switch (variant) {
            case 'docked-swiss':
                return `relative flex flex-col items-center justify-center w-16 h-full transition-colors duration-200 group ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`;
            case 'floating-swiss':
                return `relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-200 ${
                    isActive ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-300'
                }`;
            case 'minimal-pill':
                return `relative flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-gray-200'
                }`;
            default:
                return "";
        }
    };

    return (
        <>
            {/* TEMPORARY TOGGLE BUTTON */}
            <button
                onClick={toggleVariant}
                className="md:hidden fixed bottom-24 right-4 z-[60] bg-black border border-white/20 text-[10px] text-white px-3 py-1.5 uppercase font-mono tracking-wider opacity-60 hover:opacity-100 transition-opacity backdrop-blur-sm shadow-lg"
            >
                Style: {variant.replace('-', ' ')}
            </button>

            {/* NAVIGATION BAR */}
            <div className={`md:hidden ${getWrapperStyles()}`}>
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.path
                        : pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={getItemStyles(isActive)}
                        >
                            {/* Icon Container */}
                            <div className={`transition-transform duration-200 ${isActive && variant !== 'docked-swiss' ? 'scale-105' : ''}`}>
                                <item.icon className={`${variant === 'minimal-pill' ? 'w-5 h-5' : 'w-6 h-6'}`} />
                            </div>

                            {/* Active Indicators */}

                            {/* Docked: Top Border Indicator (Desktop Style) */}
                            {variant === 'docked-swiss' && isActive && (
                                <span className="absolute top-[-2px] left-0 right-0 h-[2px] bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                            )}

                            {/* Floating Swiss: Subtle Bottom Border */}
                            {variant === 'floating-swiss' && isActive && (
                                <span className="absolute bottom-0 w-8 h-[2px] bg-white" />
                            )}

                            {/* Minimal Pill: Small Dot */}
                            {variant === 'minimal-pill' && isActive && (
                                <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default MobileBottomNav;
