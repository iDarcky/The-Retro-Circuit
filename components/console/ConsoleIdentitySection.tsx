'use client';

import { useState, useEffect } from 'react';
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

    const currentVariant = variants.find(v => v.id === selectedVariantId) || null;
    const currentImage = getConsoleImage({ console, variant: currentVariant });
    const currentYear = currentVariant?.release_date ? new Date(currentVariant.release_date).getFullYear() : 'XXXX';
    const compareUrl = `/arena/${console.slug}${currentVariant?.slug ? `-${currentVariant.slug}` : ''}-vs-select`;

    // Metadata Construction
    const fabName = manufacturer?.name || 'UNKNOWN';
    const formFactor = console.form_factor || 'N/A';
    const deviceCategory = console.device_category || 'SYSTEM';

    useEffect(() => {
        const handleScroll = () => {
            // Trigger sticky state after scrolling past the header (approx 300px)
            setIsSticky(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
            {/* HEADER WRAPPER (State 1) - Normal Flow */}
            <div className="relative w-full">

                <div className={`w-full px-4 md:px-8 pt-8 pb-4 flex flex-col gap-6 transition-opacity duration-300 ${isSticky ? 'opacity-0' : 'opacity-100'}`}>

                    {/* BACK LINK */}
                    <Link href="/consoles" className="text-primary font-mono text-xs hover:text-white transition-colors inline-block w-fit">
                        &lt; BACK TO CONSOLE VAULT
                    </Link>

                    {/* HERO ROW: Icon + Text Column */}
                    <div className="flex flex-row items-end gap-8">
                        {/* Icon (128x128) */}
                        <div className="shrink-0 mb-2">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt="Icon"
                                    className="w-[128px] h-[128px] object-contain drop-shadow-lg"
                                />
                            ) : (
                                <div className="w-[128px] h-[128px] bg-gray-800 rounded-full" />
                            )}
                        </div>

                        {/* Text Column */}
                        <div className="flex flex-col gap-4 flex-1">
                            {/* Title */}
                            <h1
                                className="font-pixel text-[55px] text-white leading-none tracking-tight uppercase"
                                style={{
                                    textShadow: '4px 4px 0px rgba(0, 255, 157, 0.5)',
                                }}
                            >
                                <span className="mr-4 text-white">{fabName}</span>
                                <span>{console.name}</span>
                            </h1>

                            {/* Metadata */}
                            <div className="flex items-center gap-3 font-mono text-sm md:text-base text-gray-400 uppercase tracking-widest">
                                {manufacturer ? (
                                    <Link href={`/fabricators/${manufacturer.slug}`} className="text-white hover:text-secondary transition-colors border-b border-transparent hover:border-secondary">
                                        {fabName}
                                    </Link>
                                ) : (
                                    <span className="text-white">{fabName}</span>
                                )}
                                <span className="text-gray-600 px-1">{'//'}</span>
                                <span>{formFactor}</span>
                                <span className="text-gray-600 px-1">{'//'}</span>
                                <span>{deviceCategory}</span>
                                <span className="text-gray-600 px-1">{'//'}</span>
                                <span className="text-accent">{currentYear}</span>
                            </div>

                            {/* Controls (Above Divider) */}
                            <div className="flex flex-wrap items-center gap-6 mt-2">
                                <VariantDropdown />

                                {/* Divider if Variants exist */}
                                {variants.length > 1 && <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>}

                                <div className="flex-1 flex items-center justify-between">
                                    <JumpLinks />

                                    <div className="flex items-center gap-4">
                                        <CompareButton />
                                        <Button variant="secondary" className="text-xs px-6 py-2 border-gray-600 text-gray-400 hover:text-white hover:border-white">
                                            SHARE
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CUSTOM DIVIDER (Full Width, outside the text flex) */}
                    <div className="w-full flex flex-col mt-4">
                        <div className="w-full h-[2px] bg-[#2F323C]"></div>
                        <div className="w-full h-[2px] bg-[#2E303A]"></div>
                    </div>

                </div>
            </div>

            {/* --- STATE B: STICKY COMPACT (Fixed Overlay) --- */}
            {/* Sticks below the global header (approx 57px-64px) */}
            <div
                className={`
                    fixed top-[57px] md:top-[64px] left-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] py-2 transition-transform duration-300 ease-out
                    ${isSticky ? 'translate-y-0' : '-translate-y-[200%]'}
                `}
            >
                <div className="w-full px-4 md:px-8 flex items-center justify-between gap-4">

                    {/* Left: Identity */}
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="shrink-0">
                            {currentImage && <img src={currentImage} alt="Icon" className="w-8 h-8 object-contain" />}
                        </div>
                        <h2
                            className="font-pixel text-[30px] text-white truncate uppercase"
                            style={{ textShadow: '2px 2px 0px rgba(0, 255, 157, 0.5)' }}
                        >
                            <span className="hidden md:inline mr-2">{fabName}</span>
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
