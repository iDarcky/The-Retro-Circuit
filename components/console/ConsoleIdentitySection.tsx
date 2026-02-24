'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { ConsoleDetails, ConsoleVariant, Manufacturer } from '../../lib/types';
import { IconVS } from '../ui/Icons';
import SwissButton from './swiss/SwissButton';

interface ConsoleIdentitySectionProps {
    console: ConsoleDetails;
    manufacturer: Manufacturer | null;
    variants: ConsoleVariant[];
    selectedVariantId: string;
    onVariantChange: (slug: string) => void;
}

interface VariantDropdownProps {
    compact?: boolean;
    variants: ConsoleVariant[];
    selectedVariantId: string;
    onVariantChange: (slug: string) => void;
}

const VariantDropdown = ({ compact = false, variants, selectedVariantId, onVariantChange }: VariantDropdownProps) => {
    if (variants.length <= 1) return null;

    return (
        <div className="relative group shrink-0">
            <select
                value={selectedVariantId}
                onChange={(e) => {
                    const slug = variants.find(v => v.id === e.target.value)?.slug;
                    if (slug) onVariantChange(slug);
                }}
                className={`
                    appearance-none bg-transparent border text-white font-mono outline-none cursor-pointer hover:bg-white hover:text-black uppercase transition-colors
                    ${compact
                        ? 'text-[10px] px-2 py-1 pr-4 border-white/20'
                        : 'text-xs px-4 py-2 pr-8 border-white/20 min-w-[200px]'}
                `}
            >
                {variants.map(v => (
                    <option key={v.id} value={v.id} className="bg-black text-white">
                        {v.variant_name}
                    </option>
                ))}
            </select>
            {/* Custom Arrow */}
            <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${compact ? 'right-1' : 'right-3'}`}>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white" />
            </div>
        </div>
    );
};

interface JumpLinksProps {
    compact?: boolean;
    scrollToSection: (id: string) => void;
}

const JumpLinks = ({ compact = false, scrollToSection }: JumpLinksProps) => (
    <div className={`flex items-center shrink-0 ${compact ? 'gap-3' : 'gap-4'}`}>
        {['Tech', 'Playability', 'Buy'].map((link) => (
            <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase())}
                className={`
                    font-mono hover:text-orange-500 uppercase transition-colors whitespace-nowrap
                    ${compact ? 'text-[10px] text-gray-400' : 'text-xs text-gray-500'}
                `}
            >
                {`[ ${link} ]`}
            </button>
        ))}
    </div>
);

interface CompareButtonProps {
    compact?: boolean;
    compareUrl: string;
}

const CompareButton = ({ compact = false, compareUrl }: CompareButtonProps) => {
    if (compact) {
        return (
            <Link href={compareUrl}>
                <SwissButton
                    variant="secondary"
                    className="px-2 py-1 text-[10px] h-[26px] bg-violet-600 border-violet-500 text-white hover:bg-violet-500 hover:border-violet-400"
                >
                    <IconVS className="w-3 h-3" />
                    VS
                </SwissButton>
            </Link>
        );
    }

    return (
        <div className="relative group inline-block">
            <Link href={compareUrl}>
                 <SwissButton variant="secondary" className="relative !border-violet-500 !text-violet-400 hover:!bg-violet-500/10 hover:!text-violet-300">
                    <IconVS className="w-4 h-4" />
                    COMPARE
                </SwissButton>
            </Link>
        </div>
    );
};

export default function ConsoleIdentitySection({
    console: consoleData,
    manufacturer,
    variants,
    selectedVariantId,
    onVariantChange
}: ConsoleIdentitySectionProps) {
    const [isSticky, setIsSticky] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const currentVariant = variants.find(v => v.id === selectedVariantId) || null;
    const compareUrl = `/arena/${consoleData.slug}${currentVariant?.slug ? `-${currentVariant.slug}` : ''}-vs-select`;

    const fabName = manufacturer?.name || 'UNKNOWN';

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 64);
            },
            { root: null, threshold: 0, rootMargin: '-64px 0px 0px 0px' }
        );

        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <>
            {/* --- STATE A: NORMAL FLOW --- */}
            <div className="relative w-full border-b border-white/10 bg-[#09090b] z-20">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 flex flex-col gap-6">

                    {/* Breadcrumb */}
                    <Link href="/consoles" className="text-gray-500 font-mono text-xs hover:text-white transition-colors w-fit">
                        ← RETURN TO ARCHIVE
                    </Link>

                    {/* HEADLINE */}
                    <div className="flex flex-col gap-2">
                        {manufacturer && (
                            <Link href={`/fabricators/${manufacturer.slug}`} className="block font-pixel text-xl md:text-2xl text-gray-600 hover:text-white transition-colors">
                                {fabName}
                            </Link>
                        )}
                        <h1 className="font-pixel text-4xl md:text-6xl lg:text-6xl text-white uppercase leading-none tracking-tighter break-words">
                            {consoleData.name}
                        </h1>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">

                        <div className="flex items-center gap-4">
                            <VariantDropdown
                                variants={variants}
                                selectedVariantId={selectedVariantId}
                                onVariantChange={onVariantChange}
                            />
                            <div className="hidden md:block w-px h-6 bg-white/10"></div>
                            <div className="hidden md:block">
                                <JumpLinks scrollToSection={scrollToSection} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CompareButton compareUrl={compareUrl} />
                            <SwissButton variant="secondary" onClick={handleShare} className="relative">
                                <Share2 className="w-4 h-4" />
                                {showShareTooltip && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] bg-white text-black px-2 py-1 font-mono whitespace-nowrap">
                                        COPIED
                                    </span>
                                )}
                            </SwissButton>
                        </div>
                    </div>
                </div>

                {/* SENTINEL */}
                <div ref={sentinelRef} className="absolute bottom-0 left-0 w-full h-px pointer-events-none opacity-0" />
            </div>

            {/* --- STATE B: STICKY BAR --- */}
            <div
                className={`
                    fixed top-0 left-0 w-full z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-white/10 py-2 transition-transform duration-300 ease-out
                    ${isSticky ? 'translate-y-[64px]' : '-translate-y-full'}
                `}
            >
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                         <h2 className="font-pixel text-xs md:text-sm text-white uppercase tracking-wider">
                            <span className="text-gray-500 mr-2">{fabName}</span>
                            {consoleData.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <VariantDropdown
                            compact
                            variants={variants}
                            selectedVariantId={selectedVariantId}
                            onVariantChange={onVariantChange}
                        />
                        <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
                        <CompareButton compact compareUrl={compareUrl} />
                    </div>
                </div>
            </div>
        </>
    );
}
