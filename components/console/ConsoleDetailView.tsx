
'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant, GameOfTheWeekData } from '../../lib/types';
import CollectionToggle from '../ui/CollectionToggle';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
  games: GameOfTheWeekData[];
}

// Helper component for table rows
const SpecRow = ({ label, value, highlight = false, unit = '' }: { label: string, value?: string | number | boolean, highlight?: boolean, unit?: string }) => {
    if (value === undefined || value === null || value === '') return null;
    
    let displayValue = value;
    if (typeof value === 'boolean') displayValue = value ? 'YES' : 'NO';
    if (unit && typeof value === 'number') displayValue = `${value} ${unit}`;

    return (
        <tr className="border-b border-retro-grid/50 last:border-0 hover:bg-white/5 transition-colors">
            <td className="py-3 px-2 md:px-4 font-mono text-xs uppercase text-gray-400 w-1/3 md:w-1/4 align-top">
                {label}
            </td>
            <td className={`py-3 px-2 md:px-4 font-mono text-sm ${highlight ? 'text-retro-neon font-bold' : 'text-gray-200'}`}>
                {displayValue}
            </td>
        </tr>
    );
};

const SpecSection = ({ title, children }: { title: string, children?: ReactNode }) => (
    <div className="mb-0 border-b border-retro-grid last:border-0">
        <h3 className="bg-retro-grid/20 text-retro-blue font-pixel text-xs px-4 py-2 uppercase tracking-wider border-b border-retro-grid/30">
            {title}
        </h3>
        <table className="w-full">
            <tbody>{children}</tbody>
        </table>
    </div>
);

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData, games }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const variants = consoleData.variants || [];
    const hasVariants = variants.length > 0;

    // Helper: Determine initial selection logic
    const getInitialVariantId = () => {
        // 1. URL Param Priority
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) return variant.id;
        }

        // 2. Default Variant or First Variant
        if (hasVariants) {
            const defaultVar = variants.find(v => v.is_default);
            return defaultVar ? defaultVar.id : variants[0].id;
        }

        return 'base';
    };

    const [selectedVariantId, setSelectedVariantId] = useState<string>(getInitialVariantId);
    
    // Create a "Merged" spec object type that covers both Base Specs and Variant Specs
    type MergedSpecs = ConsoleSpecs & Partial<ConsoleVariant>;

    const getInitialSpecs = (varId: string): MergedSpecs => {
        if (varId === 'base') return consoleData.specs;
        const v = variants.find(x => x.id === varId);
        return v ? { ...consoleData.specs, ...v } : consoleData.specs;
    };

    const [mergedSpecs, setMergedSpecs] = useState<MergedSpecs>(() => getInitialSpecs(getInitialVariantId()));

    useEffect(() => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) setSelectedVariantId(variant.id);
        }
    }, [searchParams, variants, hasVariants]);

    useEffect(() => {
        if (selectedVariantId === 'base') {
            setMergedSpecs(consoleData.specs);
        } else {
            const variant = variants.find(v => v.id === selectedVariantId);
            if (variant) {
                // Merge base architecture (specs) with variant specific performance numbers
                setMergedSpecs({ ...consoleData.specs, ...variant });
            }
        }
    }, [selectedVariantId, consoleData.specs, variants]);

    const handleVariantChange = (id: string) => {
        setSelectedVariantId(id);
        const params = new URLSearchParams(searchParams?.toString());
        if (id === 'base') {
            params.delete('variant');
        } else {
            const v = variants.find(v => v.id === id);
            if (v?.slug) params.set('variant', v.slug);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const currentVariant = variants.find(v => v.id === selectedVariantId);
    
    // Image Priority: Variant Image -> Console Image
    const currentImage = currentVariant?.image_url || consoleData.image_url;
    const currentYear = currentVariant?.release_year || consoleData.release_year;

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            {/* Navigation & Actions */}
            <div className="mb-8 flex justify-between items-start border-b-4 border-retro-grid pb-6">
                <div>
                     <Link href="/console" className="inline-block text-xs font-mono text-retro-blue hover:text-retro-neon transition-colors mb-2">
                        &lt; BACK TO CONSOLE VAULT
                     </Link>
                     <h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[4px_4px_0_rgba(0,255,157,0.5)] leading-tight uppercase">
                        {consoleData.name}
                     </h1>
                     <div className="flex gap-4 font-mono text-sm text-gray-400 mt-2">
                        <Link href={`/fabricators/${consoleData.manufacturer?.slug}`} className="hover:text-retro-neon transition-colors">
                            {consoleData.manufacturer?.name.toUpperCase()}
                        </Link>
                        <span>//</span>
                        <span>{currentYear}</span>
                        <span>//</span>
                        <span>{consoleData.generation}</span>
                     </div>
                </div>
                <div className="mt-6 md:mt-0">
                    <CollectionToggle 
                        itemId={consoleData.slug} 
                        itemType="CONSOLE" 
                        itemName={consoleData.name} 
                        itemImage={currentImage}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-black border-2 border-retro-grid p-6 flex items-center justify-center min-h-[300px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        {currentImage ? (
                            <img src={currentImage} alt={consoleData.name} className="max-w-full max-h-[300px] object-contain drop-shadow-lg transition-all duration-300" key={currentImage} />
                        ) : (
                            <div className="text-retro-grid font-pixel text-4xl">?</div>
                        )}
                        <div className="absolute top-4 left-4 bg-retro-neon text-black text-xs font-bold px-2 py-1 transform -rotate-2">
                            {consoleData.form_factor?.toUpperCase()}
                        </div>
                    </div>

                    <div className="bg-retro-dark border border-retro-grid p-6">
                        <h3 className="font-pixel text-xs text-retro-blue mb-4">SYSTEM OVERVIEW</h3>
                        <p className="font-mono text-gray-300 leading-relaxed text-sm">
                            {consoleData.description}
                        </p>
                    </div>
                </div>

                {/* Right Column: Specs */}
                <div className="lg:col-span-2">
                    {/* Variant Deck */}
                    <div className="mb-6">
                        <h3 className="font-pixel text-xs text-retro-blue mb-3 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-retro-blue animate-pulse"></span>
                            Available Configurations
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x touch-pan-x">
                            {variants.length > 0 ? (
                                variants.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleVariantChange(v.id)}
                                        className={`
                                            min-w-[150px] md:min-w-[180px] p-4 border-2 text-left flex flex-col justify-between transition-all duration-200 snap-start
                                            ${selectedVariantId === v.id 
                                                ? 'border-retro-neon bg-retro-neon/10 opacity-100 shadow-[0_0_15px_rgba(0,255,157,0.3)] scale-[1.02]' 
                                                : 'border-retro-grid bg-black opacity-60 hover:opacity-100 hover:border-retro-blue'
                                            }
                                        `}
                                    >
                                        <div className={`font-bold font-mono text-sm mb-2 ${selectedVariantId === v.id ? 'text-white' : 'text-gray-300'}`}>
                                            {v.variant_name}
                                        </div>
                                        <div className="space-y-1">
                                            {v.screen_size_inch ? (
                                                <div className="font-mono text-xs text-gray-400">{v.screen_size_inch}" Screen</div>
                                            ) : null}
                                            {v.price_launch_usd ? (
                                                <div className="font-mono text-xs text-retro-neon">${v.price_launch_usd}</div>
                                            ) : null}
                                            {!v.screen_size_inch && !v.price_launch_usd && (
                                                <div className="font-mono text-[10px] text-gray-500">Custom Spec</div>
                                            )}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="w-full p-4 border-2 border-dashed border-gray-800 text-center font-mono text-xs text-gray-500">
                                    No Configurations Found
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-retro-dark border-2 border-retro-grid relative">
                        {/* Decorative Corner */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-retro-neon"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-retro-neon"></div>

                        <div className="bg-retro-grid/20 px-6 py-4 border-b border-retro-grid flex justify-between items-center">
                            <h2 className="font-pixel text-lg text-white">
                                {selectedVariantId === 'base' ? 'TECHNICAL SPECIFICATIONS' : `${currentVariant?.variant_name.toUpperCase()} SPECS`}
                            </h2>
                            <span className="font-mono text-xs text-retro-neon animate-pulse">● DECLASSIFIED</span>
                        </div>
                        
                        <div className="p-0">
                            {/* Architecture (Base Specs) */}
                            <SpecSection title="Architecture">
                                <SpecRow label="CPU Model" value={mergedSpecs.cpu_model} highlight />
                                <SpecRow label="CPU Cores" value={mergedSpecs.cpu_cores} />
                                <SpecRow label="CPU Threads" value={mergedSpecs.cpu_threads} />
                                <SpecRow label="GPU Model" value={mergedSpecs.gpu_model} />
                                <SpecRow label="GPU Cores" value={mergedSpecs.gpu_cores} />
                                <SpecRow label="Operating System" value={mergedSpecs.os} />
                                <SpecRow label="TDP Range" value={mergedSpecs.tdp_range_w} />
                            </SpecSection>
                            
                            {/* Performance (Variant Specific) */}
                            {(mergedSpecs.cpu_clock_mhz || mergedSpecs.ram_gb || mergedSpecs.storage_gb) && (
                                <SpecSection title="Performance">
                                    <SpecRow label="CPU Clock" value={mergedSpecs.cpu_clock_mhz} unit="MHz" />
                                    <SpecRow label="GPU Clock" value={mergedSpecs.gpu_clock_mhz} unit="MHz" />
                                    <SpecRow label="RAM" value={mergedSpecs.ram_gb ? `${mergedSpecs.ram_gb} GB` : undefined} highlight />
                                    <SpecRow label="RAM Type" value={mergedSpecs.ram_type} />
                                    <SpecRow label="RAM Speed" value={mergedSpecs.ram_speed_mhz} unit="MHz" />
                                </SpecSection>
                            )}
                            
                            {/* Storage (Variant Specific) */}
                            {(mergedSpecs.storage_gb || mergedSpecs.storage_type) && (
                                <SpecSection title="Storage">
                                    <SpecRow label="Internal" value={mergedSpecs.storage_gb ? `${mergedSpecs.storage_gb} GB` : undefined} />
                                    <SpecRow label="Type" value={mergedSpecs.storage_type} />
                                    <SpecRow label="Expandable" value={mergedSpecs.storage_expandable} />
                                    <SpecRow label="Physical Media" value={consoleData.media} />
                                </SpecSection>
                            )}

                            {/* Display (Variant Specific) */}
                            {(mergedSpecs.screen_size_inch || mergedSpecs.max_resolution_output) && (
                                <SpecSection title="Display & Output">
                                    <SpecRow label="Max Output" value={mergedSpecs.max_resolution_output} highlight />
                                    <SpecRow label="Display Type" value={mergedSpecs.display_type} />
                                    <SpecRow label="Display Tech" value={mergedSpecs.display_tech} />
                                    <SpecRow label="Screen Size" value={mergedSpecs.screen_size_inch} unit="inch" />
                                    <SpecRow label="Resolution" value={mergedSpecs.screen_resolution_x ? `${mergedSpecs.screen_resolution_x} x ${mergedSpecs.screen_resolution_y}` : undefined} />
                                    <SpecRow label="Refresh Rate" value={mergedSpecs.refresh_rate_hz} unit="Hz" />
                                    <SpecRow label="Brightness" value={mergedSpecs.brightness_nits} unit="nits" />
                                    <SpecRow label="PPI" value={mergedSpecs.resolution_pixel_density} />
                                </SpecSection>
                            )}
                            
                            {(mergedSpecs.second_screen_size) && (
                                <SpecSection title="Second Screen">
                                    <SpecRow label="Size" value={mergedSpecs.second_screen_size} unit="inch" />
                                    <SpecRow label="Resolution" value={`${mergedSpecs.second_screen_resolution_x} x ${mergedSpecs.second_screen_resolution_y}`} />
                                    <SpecRow label="Type" value={mergedSpecs.second_screen_type} />
                                </SpecSection>
                            )}
                            
                            <SpecSection title="Multimedia & Immersion">
                                <SpecRow label="Audio Speakers" value={mergedSpecs.audio_speakers} />
                                <SpecRow label="Audio Tech" value={mergedSpecs.audio_tech} />
                                <SpecRow label="Haptics" value={mergedSpecs.haptics} />
                                <SpecRow label="Gyroscope" value={mergedSpecs.gyro} />
                            </SpecSection>

                             <SpecSection title="Controls & IO">
                                <SpecRow label="Ports" value={mergedSpecs.ports} />
                                <SpecRow label="Connectivity" value={mergedSpecs.connectivity} />
                                <SpecRow label="Input Layout" value={mergedSpecs.input_layout} />
                                <SpecRow label="D-Pad" value={mergedSpecs.dpad_type} />
                                <SpecRow label="Sticks" value={mergedSpecs.analog_stick_type} />
                                <SpecRow label="Shoulder Btns" value={mergedSpecs.shoulder_buttons} />
                                <SpecRow label="Back Btns" value={mergedSpecs.has_back_buttons} />
                            </SpecSection>
                            
                            {(mergedSpecs.weight_g || mergedSpecs.battery_mah || mergedSpecs.price_launch_usd) && (
                                <SpecSection title="Physical & Market">
                                    <SpecRow label="Weight" value={mergedSpecs.weight_g} unit="g" />
                                    <SpecRow label="Battery (mAh)" value={mergedSpecs.battery_mah} unit="mAh" />
                                    <SpecRow label="Battery (Wh)" value={mergedSpecs.battery_wh} unit="Wh" />
                                    <SpecRow label="Launch Price" value={mergedSpecs.price_launch_usd ? `$${mergedSpecs.price_launch_usd}` : undefined} />
                                    <SpecRow label="Units Sold" value={consoleData.units_sold} highlight />
                                </SpecSection>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Linked Games Section */}
            {games.length > 0 && (
                <div className="mt-16 pt-8 border-t-2 border-retro-grid">
                    <h3 className="font-pixel text-2xl text-retro-pink mb-6">NOTABLE SOFTWARE LIBRARY</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {games.map((game) => (
                            <Link 
                                key={game.id} 
                                href={`/archive/${game.slug || game.id}`}
                                className="group block bg-black border border-retro-grid hover:border-retro-pink transition-all"
                            >
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    {game.image ? (
                                        <img src={game.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-pixel text-xs text-center p-2">NO COVER</div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <div className="font-pixel text-[10px] text-white truncate group-hover:text-retro-pink">{game.title}</div>
                                    <div className="font-mono text-[10px] text-gray-500">{game.year}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsoleDetailView;
