'use client';

import Link from 'next/link';
import { Manufacturer } from '../../lib/types';
import { hexToRgb } from '../../lib/utils/colors';

interface Props {
    manufacturers: Manufacturer[];
}

export default function FabricatorListClient({ manufacturers }: Props) {
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
        // Hybrid Style: Green Box, Brand Circle, White Text
        // Circle background is hardcoded to Gray (#e5e7eb) for "Coin" look

        return {
            container: "group relative flex flex-col items-center justify-center transition-all duration-300 overflow-hidden min-h-[300px] cursor-pointer bg-bg-primary border-2 border-secondary hover:bg-secondary/5 hover:shadow-[0_0_25px_rgba(0,255,136,0.2)]",
            text: "font-pixel text-2xl text-white mb-8 text-center uppercase tracking-widest transition-colors",
            circle: "w-32 h-32 rounded-full border-4 border-[var(--brand-color)] flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform bg-gray-200 relative",
            circleText: "font-pixel text-5xl text-black", // Black text on Gray Coin
            button: "mt-auto font-mono text-xs border border-dashed border-secondary px-6 py-2 text-gray-400 group-hover:text-secondary group-hover:border-solid group-hover:bg-secondary/10 transition-all",
            corner: "absolute top-0 right-0 p-2 border-b border-l border-secondary bg-black/50 text-secondary"
        };
    };

    return (
        <div className="w-full">

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

                        return (
                            <Link
                                href={`/fabricators/${brand.slug}`}
                                key={brand.id}
                                style={cssVars}
                                className={styles.container}
                            >
                                {/* Decorative Corner */}
                                <div className={styles.corner}>
                                    <span className="font-mono text-[10px] text-gray-500 group-hover:text-secondary transition-colors">EST. {brand.founded_year}</span>
                                </div>

                                {/* Avatar Circle */}
                                <div className={styles.circle}>
                                    {/* Pulse removed for cleaner look or could be re-added as secondary color pulse?
                                        Keeping it clean as per "Coin" concept. */}

                                    {brand.image_url ? (
                                        <div className="w-full h-full rounded-full overflow-hidden p-4 flex items-center justify-center relative z-10">
                                            <img
                                                src={brand.image_url}
                                                alt={brand.name}
                                                // Coin Mode: No filter, just natural logo on gray bg
                                                className="w-full h-full object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.5)] transition-all duration-300"
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
