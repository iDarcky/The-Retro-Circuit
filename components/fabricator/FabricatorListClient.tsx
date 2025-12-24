'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Manufacturer } from '../../lib/types';
import RetroStatusBar from '../ui/RetroStatusBar';
import { hexToRgb } from '../../lib/utils/colors';

type ListMode = 'accent' | 'neon' | 'slab' | 'border' | 'sticker';
type LogoMode = 'original' | 'white' | 'coin' | 'glow';

interface Props {
    manufacturers: Manufacturer[];
}

export default function FabricatorListClient({ manufacturers }: Props) {
    const [mode, setMode] = useState<ListMode>('accent');
    const [logoMode, setLogoMode] = useState<LogoMode>('original');

    // Map existing static themes to Hex for fallback consistency
    const staticHexMap: Record<string, string> = {
        'Nintendo': '#ef4444',
        'Sega': '#3b82f6',
        'Sony': '#facc15',
        'Atari': '#f97316',
        'Microsoft': '#22c55e',
        'NEC': '#c084fc',
        'SNK': '#2dd4bf',
    };

    const getCardStyles = () => {
        const base = "group relative flex flex-col items-center justify-center transition-all duration-300 overflow-hidden min-h-[300px] cursor-pointer";

        // Base Circle Style (can be overridden by LogoMode)
        let circleBase = `w-32 h-32 rounded-full border-4 border-[var(--brand-color)] flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform bg-black relative`;
        let circleTextBase = `font-pixel text-5xl text-white`; // Reduced from 6xl to 5xl

        // Logo Mode Overrides for Circle/Text
        if (logoMode === 'coin') {
            circleBase = circleBase.replace('bg-black', 'bg-white');
            circleTextBase = circleTextBase.replace('text-white', 'text-black');
        }

        switch (mode) {
            case 'accent': // Hollow Card (White Text + Colored Border)
                return {
                    container: `${base} bg-bg-primary border-2 border-[var(--brand-color)] hover:bg-[rgba(var(--brand-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--brand-rgb),0.3)]`,
                    text: `font-pixel text-2xl text-white mb-8 text-center uppercase tracking-widest group-hover:text-white transition-colors`,
                    circle: circleBase,
                    circleText: circleTextBase,
                    button: `mt-auto font-mono text-xs border border-dashed border-[var(--brand-color)] px-6 py-2 text-gray-400 group-hover:text-white group-hover:border-solid group-hover:bg-[var(--brand-color)] group-hover:text-black transition-all`,
                    corner: `absolute top-0 right-0 p-2 border-b border-l border-[var(--brand-color)] bg-black/50`
                };

            case 'neon': // Glowing Text + Dark Card
                return {
                    container: `${base} bg-black border border-gray-800 hover:border-[var(--brand-color)] shadow-[inset_0_0_20px_rgba(0,0,0,1)] hover:shadow-[0_0_20px_rgba(var(--brand-rgb),0.4)]`,
                    text: `font-pixel text-2xl text-[var(--brand-color)] mb-8 text-center uppercase tracking-widest drop-shadow-[0_0_8px_var(--brand-color)] transition-all`,
                    circle: circleBase.replace('border-4', 'border-2').replace('bg-black', 'bg-black/50') + ' shadow-[0_0_15px_var(--brand-color)]',
                    circleText: `font-pixel text-5xl text-[var(--brand-color)] drop-shadow-[0_0_10px_var(--brand-color)]`,
                    button: `mt-auto font-mono text-xs text-[var(--brand-color)] px-6 py-2 border border-[var(--brand-color)] hover:bg-[var(--brand-color)] hover:text-black transition-all shadow-[0_0_10px_rgba(var(--brand-rgb),0.4)]`,
                    corner: `absolute top-0 right-0 p-2 text-[var(--brand-color)] font-mono text-[10px]`
                };

            case 'slab': // Split Background
                return {
                    container: `${base} bg-black border border-gray-800 hover:border-[var(--brand-color)] group`,
                    text: `font-pixel text-2xl text-white mb-8 text-center uppercase tracking-widest relative z-10 mt-8`,
                    circle: `w-full h-32 bg-[var(--brand-color)] absolute top-0 left-0 flex items-center justify-center mb-0 rounded-none shadow-lg`,
                    circleText: `font-pixel text-6xl text-black mix-blend-multiply opacity-70`, // Keep slab text big
                    button: `mt-auto font-mono text-xs border border-white/20 px-6 py-2 text-gray-400 group-hover:text-white group-hover:border-white transition-all mb-8`,
                    corner: `hidden`
                };

            case 'border': // Left Border Badge
                return {
                    container: `${base} bg-bg-primary border-l-8 border-[var(--brand-color)] items-start pl-8 hover:bg-white/5`,
                    text: `font-pixel text-3xl text-white mb-2 text-left uppercase tracking-widest`,
                    circle: `hidden`, // No circle in this minimal mode
                    circleText: `hidden`,
                    button: `mt-8 font-mono text-xs text-gray-400 group-hover:text-[var(--brand-color)] transition-all flex items-center gap-2 before:content-['>'] before:text-[var(--brand-color)]`,
                    corner: `absolute top-4 right-4 font-mono text-[10px] text-gray-600`
                };

            case 'sticker': // Pill Label
                return {
                    container: `${base} bg-[#111] border border-[#222] rounded-xl hover:border-[var(--brand-color)] hover:-translate-y-1 hover:shadow-xl`,
                    text: `font-pixel text-xl text-black bg-[var(--brand-color)] px-6 py-2 rounded-full mb-8 text-center uppercase tracking-widest shadow-[0_0_15px_rgba(var(--brand-rgb),0.4)] transform rotate-[-2deg] group-hover:rotate-0 transition-all`,
                    circle: `w-24 h-24 rounded-full bg-[#000] border border-gray-800 flex items-center justify-center mb-6`,
                    circleText: `font-pixel text-4xl text-gray-600 group-hover:text-white transition-colors`,
                    button: `mt-auto font-mono text-xs text-gray-500 group-hover:text-white transition-all border-b border-transparent group-hover:border-white pb-1`,
                    corner: `hidden`
                };
        }
        return {} as any;
    };

    const getLogoStyle = () => {
        switch (logoMode) {
            case 'white':
                return 'brightness-0 invert';
            case 'glow':
                return 'drop-shadow-[0_0_8px_var(--brand-color)]';
            case 'coin':
            case 'original':
            default:
                return 'drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]'; // Default subtle lift
        }
    };

    return (
        <div className="w-full">
            <RetroStatusBar
                rcPath="RC://RETRO_CIRCUIT/VAULT/MANUFACTURERS"
                docId="FABRICATORS_INDEX_V1"
            />

            {/* DEBUGGER */}
            <div className="fixed bottom-20 right-4 z-[9999] flex flex-col items-end gap-2 pointer-events-none">
                <div className="bg-black/90 border border-secondary p-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-lg max-w-[200px] pointer-events-auto">
                     <h4 className="font-pixel text-[10px] text-secondary mb-2 border-b border-gray-800 pb-1">CARD_STYLE</h4>
                     <div className="grid grid-cols-2 gap-2 mb-4">
                        {(['accent', 'neon', 'slab', 'border', 'sticker'] as ListMode[]).map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`
                                    text-[9px] font-mono px-2 py-1 border text-left uppercase transition-all
                                    ${mode === m
                                        ? 'bg-secondary text-black border-secondary font-bold'
                                        : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white'}
                                `}
                            >
                                {m}
                            </button>
                        ))}
                     </div>

                     <h4 className="font-pixel text-[10px] text-secondary mb-2 border-b border-gray-800 pb-1">LOGO_MODE</h4>
                     <div className="grid grid-cols-2 gap-2">
                        {(['original', 'white', 'coin', 'glow'] as LogoMode[]).map(m => (
                             <button
                                key={m}
                                onClick={() => setLogoMode(m)}
                                className={`
                                    text-[9px] font-mono px-2 py-1 border text-left uppercase transition-all
                                    ${logoMode === m
                                        ? 'bg-secondary text-black border-secondary font-bold'
                                        : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white'}
                                `}
                            >
                                {m}
                            </button>
                        ))}
                     </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-pixel text-secondary mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        FABRICATOR ARCHIVES
                    </h2>
                    <p className="font-mono text-gray-400">AUTHORIZED HARDWARE MANUFACTURERS</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {manufacturers.map((brand) => {
                        const initial = brand.name.charAt(0).toUpperCase();

                        // Resolve Colors
                        const rawBrandColor = brand.brand_color || staticHexMap[brand.name] || '#00ff9d';
                        const brandRgb = hexToRgb(rawBrandColor);

                        const styles = getCardStyles();

                        const cssVars = {
                            '--brand-color': rawBrandColor,
                            '--brand-rgb': brandRgb,
                        } as React.CSSProperties;

                        const logoClass = getLogoStyle();

                        return (
                            <Link
                                href={`/fabricators/${brand.slug}`}
                                key={brand.id}
                                style={cssVars}
                                className={styles.container}
                            >
                                {/* Decorative Corner */}
                                <div className={styles.corner}>
                                    <span className="font-mono text-[10px] text-gray-500 group-hover:text-white transition-colors">EST. {brand.founded_year}</span>
                                </div>

                                {/* Avatar Circle */}
                                <div className={styles.circle}>
                                    {mode === 'accent' && logoMode !== 'coin' && <div className={`absolute inset-0 rounded-full border-2 border-[var(--brand-color)] opacity-50 animate-pulse`}></div>}
                                    {brand.image_url ? (
                                        <div className="w-full h-full rounded-full overflow-hidden p-4 flex items-center justify-center relative z-10">
                                            <img
                                                src={brand.image_url}
                                                alt={brand.name}
                                                className={`w-full h-full object-contain filter transition-all duration-300 ${logoClass}`}
                                            />
                                        </div>
                                    ) : (
                                        <span className={styles.circleText}>{initial}</span>
                                    )}
                                </div>

                                {/* Name */}
                                <h3 className={styles.text}>
                                    {brand.name}
                                </h3>

                                {/* Extra info for Border Mode */}
                                {mode === 'border' && (
                                    <p className="font-mono text-xs text-gray-500 max-w-[80%] mb-4 line-clamp-2">
                                        {brand.description?.substring(0, 100)}...
                                    </p>
                                )}

                                {/* Button */}
                                <div className={styles.button}>
                                    ACCESS FOLDER &gt;
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
