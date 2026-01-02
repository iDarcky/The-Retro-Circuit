'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { ConsoleDetails, ConsoleVariant, Manufacturer } from '../../lib/types';
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
    console: consoleData,
    manufacturer,
    variants,
    selectedVariantId,
    onVariantChange
}: ConsoleIdentitySectionProps) {
    const [isSticky, setIsSticky] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Sentinel ref for Intersection Observer (Placed at the bottom of the main section)
    const sentinelRef = useRef<HTMLDivElement>(null);

    const currentVariant = variants.find(v => v.id === selectedVariantId) || null;
    // Section I Icon: STRICTLY Console Image only. No variant fallback.
    const consoleIcon = consoleData.image_url;
    const currentYear = currentVariant?.release_date ? new Date(currentVariant.release_date).getFullYear() : 'XXXX';
    const compareUrl = `/arena/${consoleData.slug}${currentVariant?.slug ? `-${currentVariant.slug}` : ''}-vs-select`;

    // Metadata Construction
    const fabName = manufacturer?.name || 'UNKNOWN';
    const formFactor = consoleData.form_factor || 'N/A';
    const deviceCategory = consoleData.device_category || 'SYSTEM';

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // sticky is active ONLY when the sentinel (bottom of section) has scrolled UP out of view
                // entry.boundingClientRect.top < 64 means it has passed the header line
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 64);
            },
            {
                root: null,
                threshold: 0,
                // Offset top by 64px (header height) so it triggers exactly when the section clears the header
                rootMargin: '-64px 0px 0px 0px'
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) observer.unobserve(sentinelRef.current);
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            // Adjust scroll position to account for sticky header + global header (~130px total)
            const y = el.getBoundingClientRect().top + window.scrollY - 140;
            const scrollContainer = document.querySelector('main > div.overflow-y-auto');
            if (scrollContainer) {
                 scrollContainer.scrollTo({ top: scrollContainer.scrollTop + el.getBoundingClientRect().top - 140, behavior: 'smooth' });
            } else {
                 // Fallback
                 window.scrollTo({ top: y, behavior: 'smooth' });
            }
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

    // Shared Components
    const VariantDropdown = ({ compact = false }: { compact?: boolean }) => {
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
                        appearance-none bg-black border border-white/20 text-white font-mono outline-none cursor-pointer hover:border-secondary uppercase transition-colors
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
        <div className={`flex items-center shrink-0 ${compact ? 'gap-3' : 'gap-2'}`}>
            {!compact && <span className="font-mono text-[12px] text-gray-500 uppercase tracking-widest">[ JUMP TO ] :</span>}
            {['Analysis', 'Emulation', 'Tech', 'Buy'].map((link) => (
                <button
                    key={link}
                    onClick={() => scrollToSection(link === 'Emulation' ? 'playability' : link.toLowerCase())}
                    className={`
                        font-mono text-gray-400 hover:text-secondary uppercase transition-colors whitespace-nowrap
                        ${compact ? 'text-[10px]' : 'text-[12px] border-b border-transparent hover:border-secondary'}
                    `}
                >
                    {compact ? `[ ${link} ]` : `[ ${link} ]`}
                </button>
            ))}
        </div>
    );

    const CompareButton = ({ compact = false }: { compact?: boolean }) => (
        <Link href={compareUrl}>
            <Button
                variant="secondary"
                className={`
                    flex items-center justify-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold tracking-widest transition-colors
                    ${compact ? 'text-[10px] px-3 py-1 h-[26px] min-w-[80px]' : 'text-xs px-6 py-2'}
                `}
            >
                <IconVS className={compact ? "w-3 h-3" : "w-4 h-4"} />
                {compact ? 'COMPARE' : 'COMPARE'}
            </Button>
        </Link>
    );

    return (
        <>
            {/* --- STATE A: NORMAL FLOW --- */}
            <div className="relative w-full">
                <div className="w-full px-4 md:px-8 pt-8 pb-4 flex flex-col gap-2">

                    {/* BACK LINK */}
                    <Link href="/consoles" className="text-primary font-mono text-xs hover:text-white transition-colors inline-block w-fit mb-2">
                        &lt; BACK TO CONSOLE VAULT
                    </Link>

                    {/* ROW 1: Icon + (Title & Metadata) */}
                    <div className="flex gap-4">
                        {/* Icon - Left of the stack */}
                        <div className="shrink-0 pt-1">
                            {consoleIcon && (
                                <img
                                    src={consoleIcon}
                                    alt="Icon"
                                    className="w-[64px] h-[64px] object-contain drop-shadow-lg"
                                />
                            )}
                        </div>

                        {/* Text Stack: Title above Metadata */}
                        <div className="flex flex-col gap-1">
                            <h1
                                className="font-pixel text-[32px] md:text-[40px] text-white leading-none tracking-tight uppercase"
                                style={{
                                    textShadow: '4px 4px 0px rgba(0, 255, 157, 0.5)',
                                }}
                            >
                                <span className="block md:inline mr-0 md:mr-4 text-white">{fabName}</span>
                                <span>{consoleData.name}</span>
                            </h1>

                            {/* Metadata - Aligned with H1 */}
                            <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] text-gray-400 uppercase tracking-widest">
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
                        </div>
                    </div>

                    {/* ROW 3: Controls & Jump Links */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <VariantDropdown />

                        {/* Divider if Variants exist */}
                        {variants.length > 1 && <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>}

                        <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                            <div className="text-[10px]">
                                <JumpLinks />
                            </div>

                            <div className="flex items-center gap-4">
                                <CompareButton />
                                <Button variant="secondary" onClick={handleShare} className="text-xs px-6 py-2 border-gray-600 text-gray-400 hover:text-white hover:border-white relative">
                                    {showShareTooltip ? 'COPIED!' : 'SHARE'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* CUSTOM DIVIDER (Full Width) */}
                    <div className="w-full flex flex-col mt-4">
                        <div className="w-full h-[2px] bg-[#2F323C]"></div>
                        <div className="w-full h-[2px] bg-[#2E303A]"></div>
                    </div>

                </div>

                {/* SENTINEL: Placed at the very bottom of the content flow */}
                <div ref={sentinelRef} className="absolute bottom-0 left-0 w-full h-px pointer-events-none opacity-0" />
            </div>

            {/* --- STATE B: STICKY COMPACT (Fixed Overlay) --- */}
            {/* Positioned at top-[64px] to sit below global header.
                Hidden by sliding UP behind the global header. */}
            <div
                className={`
                    fixed top-[64px] md:top-[65px] left-0 w-full z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] py-3 transition-transform duration-500 ease-out
                    ${isSticky ? 'translate-y-0' : '-translate-y-[200%]'}
                `}
            >
                <div className="w-full px-4 md:px-8 flex items-center justify-between gap-4">

                    {/* SECTION 1: IDENTITY {Title} (Icon + Fabricator + Console) */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="shrink-0 hidden sm:block">
                            {consoleIcon && <img src={consoleIcon} alt="Icon" className="w-8 h-8 object-contain" />}
                        </div>
                        <h2
                            className="font-pixel text-[14px] md:text-[18px] text-white uppercase leading-tight"
                            style={{ textShadow: '2px 2px 0px rgba(0, 255, 157, 0.5)' }}
                        >
                            <span className="hidden md:inline mr-2">{fabName}</span>
                            {consoleData.name}
                        </h2>
                    </div>

                    {/* SECTION 2: NAVIGATION {Jump To} (Variants + Links) */}
                    <div className="flex-1 flex items-center justify-center min-w-0 px-4">
                        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar mask-gradient px-2 max-w-full">

                            <VariantDropdown compact />

                            <div className="h-4 w-px bg-white/10 shrink-0"></div>

                            <JumpLinks compact />
                        </div>
                    </div>

                    {/* SECTION 3: ACTIONS {Compare} (Compare + Share) */}
                    <div className="flex items-center gap-2 shrink-0">
                        <CompareButton compact />

                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center border border-gray-600 text-gray-400 hover:text-white hover:border-white bg-transparent h-[26px] px-3 transition-colors relative"
                            title="Share Page"
                        >
                            <Share2 className="w-3 h-3" />
                            {showShareTooltip && (
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] bg-secondary text-black px-2 py-1 font-mono font-bold whitespace-nowrap z-50">
                                    COPIED!
                                </span>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
