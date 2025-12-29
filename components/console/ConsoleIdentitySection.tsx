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
    const sentinelRef = useRef<HTMLDivElement>(null);

    const currentVariant = variants.find(v => v.id === selectedVariantId) || null;
    const currentImage = getConsoleImage({ console, variant: currentVariant });
    const currentYear = currentVariant?.release_date ? new Date(currentVariant.release_date).getFullYear() : 'XXXX';
    const compareUrl = `/arena/${console.slug}${currentVariant?.slug ? `-${currentVariant.slug}` : ''}-vs-select`;

    // Metadata Construction
    const fabName = manufacturer?.name || 'UNKNOWN';
    const formFactor = console.form_factor || 'N/A';
    const deviceCategory = console.device_category || 'SYSTEM';

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Trigger sticky state when the sentinel (top of the section) leaves the viewport upwards.
                // We use a negative rootMargin to delay the trigger until the header height is scrolled past.
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            {
                threshold: [0],
                rootMargin: '-300px 0px 0px 0px', // Adjusted to allow full header to scroll away before switching
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
            const headerOffset = 140;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Shared Components
    const VariantDropdown = ({ compact = false }: { compact?: boolean }) => {
        if (variants.length <= 1) return null;

        return (
            <div className="relative group">
                <select
                    value={selectedVariantId}
                    onChange={(e) => {
                        const slug = variants.find(v => v.id === e.target.value)?.slug;
                        if (slug) onVariantChange(slug);
                    }}
                    className={`
                        appearance-none bg-black border border-white/20 text-white font-mono outline-none cursor-pointer hover:border-secondary uppercase
                        ${compact ? 'text-[10px] px-2 py-1 pr-6 w-32 truncate' : 'text-sm px-4 py-2 pr-8 min-w-[240px]'}
                    `}
                >
                    {variants.map(v => (
                        <option key={v.id} value={v.id}>
                            {v.variant_name}
                        </option>
                    ))}
                </select>
                <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-white/50 ${compact ? 'right-1 text-[8px]' : 'right-3 text-[10px]'}`}>▼</div>
            </div>
        );
    };

    const JumpLinks = ({ compact = false }: { compact?: boolean }) => (
        <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
            {!compact && <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">[ JUMP TO ] :</span>}
            {['Analysis', 'Emulation', 'Tech', 'Buy'].map((link) => (
                <button
                    key={link}
                    onClick={() => scrollToSection(link === 'Emulation' ? 'playability' : link.toLowerCase())}
                    className={`
                        font-mono text-gray-400 hover:text-secondary uppercase transition-colors
                        ${compact ? 'text-[10px]' : 'text-xs border-b border-transparent hover:border-secondary'}
                    `}
                >
                    {compact ? link : `[ ${link} ]`}
                </button>
            ))}
        </div>
    );

    const CompareButton = ({ compact = false }: { compact?: boolean }) => (
        <Link href={compareUrl}>
            <Button
                variant="secondary"
                className={`
                    flex items-center justify-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold tracking-widest
                    ${compact ? 'text-[10px] px-3 py-1 h-auto' : 'text-xs px-6 py-2'}
                `}
            >
                <IconVS className={compact ? "w-3 h-3" : "w-4 h-4"} />
                {compact ? 'VS' : 'COMPARE'}
            </Button>
        </Link>
    );

    return (
        <>
            {/* Sentinel for Scroll Detection */}
            <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-[1px] pointer-events-none opacity-0" />

            {/* HEADER WRAPPER */}
            <div className="relative w-full border-b border-white/10 bg-bg-primary">

                {/* --- STATE A: FULL HEADER (Normal Flow) --- */}
                {/* This stays in the document flow and scrolls away naturally */}
                <div className={`w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-6 ${isSticky ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>

                    {/* ROW 1: Icon + Title */}
                    <div className="flex items-center gap-6">
                        <div className="w-[64px] h-[64px] relative bg-white/5 p-1 border border-white/10 shrink-0">
                            {currentImage ? (
                                <img src={currentImage} alt="Icon" className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full bg-gray-800" />
                            )}
                        </div>
                        <h1
                            className="font-pixel text-3xl md:text-5xl lg:text-6xl text-white leading-none tracking-tight capitalize"
                            style={{
                                textShadow: '2px 2px 0px #00FF88', // Green Shadow
                                WebkitTextStroke: '1px #00FF88',   // Green Outline
                                color: 'transparent'               // Hollow text effect (optional, or keep filled with stroke)
                            }}
                        >
                            {/* If preferred filled with outline: remove color:transparent */}
                            <span style={{ color: 'white', WebkitTextStroke: '0px', textShadow: 'none' }} className="capitalize">{fabName} {console.name}</span>
                        </h1>
                    </div>

                    {/* ROW 2: Metadata */}
                    <div className="flex items-center gap-3 font-mono text-sm md:text-base text-gray-400 uppercase tracking-widest pl-[88px]">
                        <span className="text-white">{fabName}</span>
                        <span className="text-gray-700">•</span>
                        <span>{formFactor}</span>
                        <span className="text-gray-700">•</span>
                        <span>{deviceCategory}</span>
                        <span className="text-gray-700">•</span>
                        <span className="text-accent">{currentYear}</span>
                    </div>

                    {/* ROW 3: Controls */}
                    <div className="flex flex-wrap items-center gap-6 pl-[88px] mt-2">
                        <VariantDropdown />
                        {variants.length > 1 && <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>}
                        <CompareButton />
                        <Button variant="secondary" className="text-xs px-6 py-2 border-gray-600 text-gray-400 hover:text-white hover:border-white">
                            SHARE
                        </Button>
                    </div>

                    {/* ROW 4: Jump Links */}
                    <div className="pl-[88px] mt-2 border-t border-white/5 pt-6">
                        <JumpLinks />
                    </div>

                </div>
            </div>

            {/* --- STATE B: STICKY COMPACT (Fixed Overlay) --- */}
            <div
                className={`
                    fixed top-[57px] md:top-[64px] left-0 w-full z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-2 transition-transform duration-300
                    ${isSticky ? 'translate-y-0' : '-translate-y-full'}
                `}
            >
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">

                    {/* Left: Identity */}
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-8 h-8 relative bg-white/5 p-0.5 border border-white/10 shrink-0">
                            {currentImage && <img src={currentImage} alt="Icon" className="w-full h-full object-contain" />}
                        </div>
                        <h2 className="font-pixel text-sm md:text-lg text-white truncate capitalize">
                            <span className="hidden md:inline opacity-70 mr-2">{fabName}</span>
                            {console.name}
                        </h2>
                    </div>

                    {/* Middle: Controls + Nav */}
                    <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
                        <div className="shrink-0">
                            <VariantDropdown compact />
                        </div>

                        <div className="hidden lg:block h-6 w-px bg-white/10"></div>

                        <div className="hidden md:block">
                            <JumpLinks compact />
                        </div>
                    </div>

                    {/* Right: Compare */}
                    <div className="shrink-0">
                        <CompareButton compact />
                    </div>

                </div>
            </div>
        </>
    );
}
