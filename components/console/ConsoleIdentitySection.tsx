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
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            {
                threshold: [0],
                // Adjusted rootMargin to trigger transition after scrolling past the initial header block
                rootMargin: '-300px 0px 0px 0px',
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

            {/* HEADER WRAPPER (State 1) - Normal Flow */}
            <div className="relative w-full">

                <div className={`w-full px-4 md:px-8 pt-8 pb-8 flex flex-col gap-6 transition-opacity duration-300 ${isSticky ? 'opacity-0' : 'opacity-100'}`}>

                    {/* BACK LINK */}
                    <Link href="/consoles" className="text-primary font-mono text-xs hover:text-white transition-colors inline-block w-fit">
                        &lt; BACK TO CONSOLE VAULT
                    </Link>

                    {/* ROW 1: Icon + Title */}
                    <div className="flex items-center gap-6">
                        <div className="shrink-0">
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
                        <h1
                            className="font-pixel text-[55px] text-white leading-none tracking-tight uppercase"
                            style={{
                                textShadow: '4px 4px 0px rgba(0, 255, 157, 0.5)',
                            }}
                        >
                            <span className="mr-4 text-white">{fabName}</span>
                            <span>{console.name}</span>
                        </h1>
                    </div>

                    {/* ROW 2: Metadata */}
                    <div className="flex items-center gap-3 font-mono text-sm md:text-base text-gray-400 uppercase tracking-widest pl-[160px]">
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

                    {/* ROW 3: Controls & Jump Links (Above Divider) */}
                    <div className="flex flex-wrap items-center gap-6 pl-[160px]">
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

                    {/* CUSTOM DIVIDER (Full Width) */}
                    <div className="w-full flex flex-col mt-2 pl-[160px]">
                        <div className="w-full h-[2px] bg-[#2F323C]"></div>
                        <div className="w-full h-[2px] bg-[#2E303A]"></div>
                    </div>

                </div>
            </div>

            {/* --- STATE B: STICKY COMPACT (Fixed Overlay) --- */}
            <div
                className={`
                    fixed top-[57px] md:top-[64px] left-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] py-2 transition-transform duration-300 ease-out
                    ${isSticky ? 'translate-y-0' : '-translate-y-[200%]'}
                `}
            >
                <div className="w-full px-4 md:px-8 flex items-center gap-8">

                    {/* Name */}
                    <div className="shrink-0">
                        <h2
                            className="font-pixel text-[30px] text-white truncate uppercase"
                            style={{ textShadow: '2px 2px 0px rgba(0, 255, 157, 0.5)' }}
                        >
                            <span className="hidden md:inline mr-2">{fabName}</span>
                            {console.name}
                        </h2>
                    </div>

                    {/* Variant Selector */}
                    <div className="shrink-0">
                        <VariantDropdown compact />
                    </div>

                    {/* Jump Links (Fill remaining space) */}
                    <div className="flex-1 hidden md:flex">
                        <JumpLinks compact />
                    </div>

                </div>
            </div>
        </>
    );
}
