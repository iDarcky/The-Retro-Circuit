'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ConsoleDetails, ConsoleVariant, Manufacturer } from '../../lib/types';
import { getConsoleImage } from '../../lib/utils';
import { IconVS } from '../ui/Icons';
import Button from '../ui/Button';

interface ConsoleIdentitySectionProps {
    console: ConsoleDetails;
    manufacturer: Manufacturer | null;
    variants: ConsoleVariant[];
    selectedVariantId: string;
    onVariantChange: (slug: string) => void;
}

export default function ConsoleIdentitySection({
    console,
    manufacturer,
    variants,
    selectedVariantId,
    onVariantChange
}: ConsoleIdentitySectionProps) {
    const [isSticky, setIsSticky] = useState(false);

    // We use a sentinel element to detect when to switch to compact mode
    const sentinelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentVariant = variants.find(v => v.id === selectedVariantId) || null;
    const currentImage = getConsoleImage({ console, variant: currentVariant });
    const currentYear = currentVariant?.release_date ? new Date(currentVariant.release_date).getFullYear() : 'XXXX';
    const compareUrl = `/arena/${console.slug}${currentVariant?.slug ? `-${currentVariant.slug}` : ''}-vs-select`;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If sentinel is NOT intersecting and bounding rect is above viewport, we are scrolled past
                // The sentinel is placed absolutely at the top of the container with negative offset
                // Actually, a better approach for "Sticky" detection:
                // If the container is position: sticky, we can't easily detect "stuck" state with just CSS.
                // Standard trick: sentinel is placed at top:-1px of the sticky container in the document flow.
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            {
                threshold: [0, 1],
                rootMargin: '-70px 0px 0px 0px', // Adjust for global header height (~64px)
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            // Offset for sticky header height
            const headerOffset = 180; // Approx height of sticky header + global header
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            {/* Sentinel for Scroll Detection */}
            <div ref={sentinelRef} className="absolute top-0 w-full h-px -translate-y-20 pointer-events-none opacity-0" />

            {/* Sticky Container */}
            <div
                ref={containerRef}
                className={`sticky top-[57px] md:top-[65px] z-40 w-full transition-all duration-300 border-b border-white/10
                    ${isSticky
                        ? 'bg-black/90 backdrop-blur-md shadow-2xl py-2'
                        : 'bg-bg-primary py-8 md:py-12'
                    }
                `}
            >
                <div className={`mx-auto px-4 md:px-8 w-full transition-all duration-500`}>

                    {/* FULL MODE CONTENT */}
                    <div className={`flex flex-col gap-6 ${isSticky ? 'hidden' : 'flex'}`}>

                        {/* Row 1: Identity */}
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 opacity-70">
                                    {/* Icon */}
                                    <div className="w-6 h-6 relative bg-white/5 rounded-full overflow-hidden p-0.5">
                                        {currentImage ? (
                                            <img src={currentImage} alt="Icon" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700" />
                                        )}
                                    </div>
                                    <span className="font-mono text-sm tracking-widest uppercase text-gray-400">
                                        {manufacturer?.name || 'UNKNOWN'}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-pixel text-white leading-tight uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                                    {console.name}
                                </h1>
                            </div>
                        </div>

                        {/* Row 2: Metadata */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-mono text-gray-400 uppercase tracking-wide border-t border-white/10 pt-4 w-full">
                            <span className="text-white">{manufacturer?.name}</span>
                            <span className="text-gray-600">•</span>
                            <span>{console.form_factor || 'N/A'}</span>
                            <span className="text-gray-600">•</span>
                            <span>{console.device_category || 'SYSTEM'}</span>
                            <span className="text-gray-600">•</span>
                            <span>{currentYear}</span>
                        </div>

                        {/* Row 3: Controls & Jump Links */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-2">

                            {/* Left: Variant & Actions */}
                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                {/* Variant Dropdown */}
                                <div className="relative group">
                                    <select
                                        value={selectedVariantId}
                                        onChange={(e) => {
                                            const slug = variants.find(v => v.id === e.target.value)?.slug;
                                            if (slug) onVariantChange(slug);
                                        }}
                                        className="appearance-none bg-black border border-gray-700 text-white font-mono text-xs px-4 py-2 pr-8 focus:border-secondary outline-none cursor-pointer hover:border-gray-500 min-w-[200px] uppercase"
                                    >
                                        {variants.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {v.variant_name} {v.is_default ? '(BASE)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                                </div>

                                <Link href={compareUrl}>
                                    <Button variant="secondary" className="text-xs px-4 py-2 h-[34px] flex items-center gap-2 border-gray-600 text-gray-400 hover:text-black hover:border-secondary hover:bg-secondary">
                                        <IconVS className="w-3 h-3" />
                                        COMPARE
                                    </Button>
                                </Link>

                                <Button variant="secondary" className="text-xs px-4 py-2 h-[34px] border-gray-600 text-gray-400 hover:text-white hover:border-white">
                                    SHARE
                                </Button>
                            </div>

                            {/* Right: Jump Links */}
                            <div className="flex items-center gap-1 md:gap-2">
                                {['Analysis', 'Playability', 'Tech', 'Buy'].map((link) => (
                                    <button
                                        key={link}
                                        onClick={() => scrollToSection(link.toLowerCase())}
                                        className="px-3 py-1 font-mono text-xs text-gray-500 hover:text-secondary hover:bg-secondary/10 transition-colors uppercase"
                                    >
                                        [{link}]
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* COMPACT MODE CONTENT (Sticky) */}
                    <div className={`flex items-center justify-between w-full ${isSticky ? 'flex animate-fadeIn' : 'hidden'}`}>

                        {/* Left: Identity */}
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 relative bg-white/5 rounded p-0.5 border border-white/10">
                                {currentImage && <img src={currentImage} alt="Icon" className="w-full h-full object-contain" />}
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-pixel text-sm md:text-lg text-white leading-none mb-0.5">{console.name}</h2>
                                <span className="font-mono text-[10px] text-gray-500 uppercase">{currentVariant?.variant_name}</span>
                            </div>
                        </div>

                        {/* Center: Jump Links (Hidden on small mobile) */}
                        <div className="hidden md:flex items-center gap-4 mx-8 border-l border-r border-white/10 px-6">
                             {['Analysis', 'Playability', 'Tech', 'Buy'].map((link) => (
                                <button
                                    key={link}
                                    onClick={() => scrollToSection(link.toLowerCase())}
                                    className="text-[10px] font-mono text-gray-400 hover:text-secondary uppercase transition-colors"
                                >
                                    {link}
                                </button>
                            ))}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                             <div className="hidden md:block relative group">
                                <select
                                    value={selectedVariantId}
                                    onChange={(e) => {
                                        const slug = variants.find(v => v.id === e.target.value)?.slug;
                                        if (slug) onVariantChange(slug);
                                    }}
                                    className="appearance-none bg-black/50 border border-gray-800 text-gray-300 font-mono text-[10px] px-3 py-1.5 pr-6 focus:border-secondary outline-none cursor-pointer hover:border-gray-600 uppercase w-32 truncate"
                                >
                                    {variants.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.variant_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 text-[8px]">▼</div>
                            </div>

                            <Link href={compareUrl}>
                                <Button variant="secondary" className="text-[10px] px-3 py-1.5 flex items-center gap-2 border-secondary text-secondary hover:bg-secondary hover:text-black">
                                    COMPARE
                                </Button>
                            </Link>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
