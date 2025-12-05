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

// --- SUB-COMPONENTS FOR MODULAR UI ---

const SpecCard = ({ title, className = "", children }: { title: string, className?: string, children?: ReactNode }) => (
    <div className={`bg-retro-dark border border-retro-grid relative overflow-hidden group hover:border-retro-blue/50 transition-colors ${className}`}>
        {/* Header Strip */}
        <div className="bg-black/40 border-b border-retro-grid px-4 py-2 flex justify-between items-center">
            <h3 className="font-pixel text-[10px] text-retro-blue uppercase tracking-widest">{title}</h3>
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-retro-neon transition-colors"></div>
                <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-retro-neon transition-colors delay-75"></div>
            </div>
        </div>
        {/* Content Body */}
        <div className="p-4 space-y-3">
            {children}
        </div>
    </div>
);

const SpecField = ({ label, value, unit, highlight = false, small = false }: { label: string, value?: string | number | null, unit?: string, highlight?: boolean, small?: boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between items-end border-b border-white/5 pb-1 last:border-0">
            <span className="font-mono text-[10px] text-gray-500 uppercase">{label}</span>
            <span className={`font-mono text-right ${small ? 'text-xs' : 'text-sm'} ${highlight ? 'text-retro-neon font-bold drop-shadow-[0_0_5px_rgba(0,255,157,0.4)]' : 'text-gray-300'}`}>
                {value} {unit && <span className="text-[10px] text-gray-500 ml-0.5">{unit}</span>}
            </span>
        </div>
    );
};

const TechBadge = ({ label, active, color = "bg-retro-neon" }: { label: string, active?: boolean, color?: string }) => {
    // If active is undefined (null in DB), don't show the badge at all
    if (active === undefined || active === null) return null;

    return (
        <div className={`
            inline-flex items-center gap-2 px-2 py-1 border text-[9px] font-mono uppercase tracking-wider
            ${active ? 'border-retro-grid bg-white/5 text-gray-200' : 'border-transparent text-gray-600 opacity-50'}
        `}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? `${color} animate-pulse shadow-[0_0_5px_currentColor]` : 'bg-gray-700'}`}></span>
            {label}
        </div>
    );
};

// --- MAIN COMPONENT ---

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData, games }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const variants = consoleData.variants || [];
    const hasVariants = variants.length > 0;

    // --- VARIANT SELECTION LOGIC ---

    const getInitialVariantId = () => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) return variant.id;
        }
        if (hasVariants) {
            const defaultVar = variants.find(v => v.is_default);
            return defaultVar ? defaultVar.id : variants[0].id;
        }
        return 'base';
    };

    const [selectedVariantId, setSelectedVariantId] = useState<string>(getInitialVariantId);
    
    // Type Intersection for "Merged" specs
    type MergedSpecs = Partial<ConsoleSpecs> & Partial<ConsoleVariant>;

    const getMergedSpecs = (varId: string): MergedSpecs => {
        const baseSpecs = consoleData.specs || {};
        if (varId === 'base') return baseSpecs;
        
        const variant = variants.find(x => x.id === varId);
        if (!variant) return baseSpecs;

        // Overlay variant specs on top of legacy base specs
        return { ...baseSpecs, ...variant };
    };

    const [mergedSpecs, setMergedSpecs] = useState<MergedSpecs>(() => getMergedSpecs(getInitialVariantId()));

    useEffect(() => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) setSelectedVariantId(variant.id);
        }
    }, [searchParams, variants, hasVariants]);

    useEffect(() => {
        setMergedSpecs(getMergedSpecs(selectedVariantId));
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
    
    // Fallbacks for Image/Year/Price if not on variant
    const currentImage = currentVariant?.image_url || consoleData.image_url;
    const currentYear = currentVariant?.release_year || consoleData.release_year;
    
    // --- RENDER ---

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* TOP NAVIGATION & HEADER */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start border-b-4 border-retro-grid pb-6 gap-6">
                <div className="flex-1">
                     <Link href="/console" className="inline-block text-xs font-mono text-retro-blue hover:text-retro-neon transition-colors mb-2">
                        &lt; BACK TO CONSOLE VAULT
                     </Link>
                     <h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[4px_4px_0_rgba(0,255,157,0.5)] leading-tight uppercase break-words">
                        {consoleData.name}
                     </h1>
                     <div className="flex flex-wrap gap-4 font-mono text-sm text-gray-400 mt-2">
                        <Link href={`/fabricators/${consoleData.manufacturer?.slug}`} className="hover:text-retro-neon transition-colors border-b border-transparent hover:border-retro-neon">
                            {consoleData.manufacturer?.name.toUpperCase()}
                        </Link>
                        <span>//</span>
                        <span className="text-retro-pink">{currentYear || 'TBA'}</span>
                        <span>//</span>
                        <span>{consoleData.generation}</span>
                     </div>
                </div>
                <div className="flex items-center gap-4">
                    <CollectionToggle 
                        itemId={consoleData.slug || consoleData.id} 
                        itemType="CONSOLE" 
                        itemName={consoleData.name} 
                        itemImage={currentImage}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                
                {/* LEFT COLUMN: IMAGE & DESCRIPTION (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Main Image Viewer */}
                    <div className="bg-black border-2 border-retro-grid p-8 flex items-center justify-center min-h-[300px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)] group overflow-hidden">
                        {currentImage ? (
                            <img src={currentImage} alt={consoleData.name} className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10" key={currentImage} />
                        ) : (
                            <div className="text-retro-grid font-pixel text-4xl opacity-50">NO SIGNAL</div>
                        )}
                        
                        {/* Background Grid Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                        
                        {/* Form Factor Badge */}
                        <div className="absolute top-4 left-4 bg-retro-neon text-black font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 z-20">
                            {consoleData.form_factor?.toUpperCase() || 'SYSTEM'}
                        </div>
                    </div>

                    {/* Description Text */}
                    <div className="bg-retro-dark border border-retro-grid p-6 relative">
                        <div className="absolute top-0 right-0 p-1">
                            <svg className="w-4 h-4 text-retro-grid" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z"/></svg>
                        </div>
                        <h3 className="font-pixel text-[10px] text-retro-blue mb-4 uppercase">System Analysis</h3>
                        <p className="font-mono text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                            {consoleData.description}
                        </p>
                    </div>

                    {/* Quick Stats Summary Card (New Header Card) */}
                    <div className="grid grid-cols-2 gap-px bg-retro-grid border border-retro-grid">
                        <div className="bg-retro-dark p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Model No.</div>
                            <div className="text-white font-mono text-sm">{mergedSpecs.model_no || 'N/A'}</div>
                        </div>
                        <div className="bg-retro-dark p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Launch Price</div>
                            <div className="text-retro-neon font-mono text-sm">{mergedSpecs.price_launch_usd ? `$${mergedSpecs.price_launch_usd}` : 'N/A'}</div>
                        </div>
                        <div className="bg-retro-dark p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Generation</div>
                            <div className="text-white font-mono text-sm">{consoleData.generation || 'Unknown'}</div>
                        </div>
                        <div className="bg-retro-dark p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Release</div>
                            <div className="text-white font-mono text-sm">{currentYear || 'TBA'}</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: VARIANT DECK & SPECS (lg:col-span-8) */}
                <div className="lg:col-span-8">
                    
                    {/* 1. VARIANT SELECTOR DECK */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-pixel text-xs text-retro-blue uppercase flex items-center gap-2">
                                <span className="w-2 h-2 bg-retro-blue animate-pulse rounded-full"></span>
                                System Variants
                            </h3>
                            <span className="font-mono text-[10px] text-gray-500">{variants.length} CONFIGURATIONS FOUND</span>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x touch-pan-x">
                            {variants.length > 0 ? (
                                variants.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleVariantChange(v.id)}
                                        className={`
                                            min-w-[160px] p-4 border-2 text-left flex flex-col justify-between transition-all duration-200 snap-start relative group
                                            ${selectedVariantId === v.id 
                                                ? 'border-retro-neon bg-retro-neon/10 shadow-[0_0_15px_rgba(0,255,157,0.2)]' 
                                                : 'border-retro-grid bg-black hover:border-retro-blue hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {v.is_default && (
                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-retro-neon" title="Default Model"></div>
                                        )}
                                        <div className={`font-bold font-mono text-sm mb-2 uppercase ${selectedVariantId === v.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                            {v.variant_name}
                                        </div>
                                        <div className="space-y-0.5">
                                            {v.cpu_model && <div className="font-mono text-[10px] text-gray-500 truncate">{v.cpu_model}</div>}
                                            {v.ram_gb && <div className="font-mono text-[10px] text-gray-500">{v.ram_gb}GB RAM</div>}
                                            {v.screen_size_inch && <div className="font-mono text-[10px] text-gray-500">{v.screen_size_inch}" Display</div>}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="w-full p-4 border-2 border-dashed border-gray-800 text-center font-mono text-xs text-gray-500">
                                    Base Configuration Only
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. MODULAR SPEC GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* SILICON CORE */}
                        {(mergedSpecs.cpu_model || mergedSpecs.gpu_model) && (
                            <SpecCard title="Silicon Core" className="md:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="space-y-2">
                                        <div className="font-pixel text-[10px] text-gray-600 mb-1 border-b border-gray-800">CENTRAL PROCESSING</div>
                                        <SpecField label="CPU Model" value={mergedSpecs.cpu_model} highlight />
                                        <SpecField label="Cores" value={mergedSpecs.cpu_cores} unit="Cores" />
                                        <SpecField label="Threads" value={mergedSpecs.cpu_threads} unit="Threads" />
                                        <SpecField label="Clock Speed" value={mergedSpecs.cpu_clock_mhz} unit="MHz" />
                                        <SpecField label="Architecture" value={mergedSpecs.cpu_architecture} />
                                        <SpecField label="Process Node" value={mergedSpecs.cpu_process_node} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="font-pixel text-[10px] text-gray-600 mb-1 border-b border-gray-800">GRAPHICS PROCESSING</div>
                                        <SpecField label="GPU Model" value={mergedSpecs.gpu_model} highlight />
                                        <SpecField label="Core Count" value={mergedSpecs.gpu_cores} />
                                        <SpecField label="Clock Speed" value={mergedSpecs.gpu_clock_mhz} unit="MHz" />
                                        <SpecField label="Architecture" value={mergedSpecs.gpu_architecture} />
                                        {/* Highlight TFLOPS neon */}
                                        <SpecField label="Performance" value={mergedSpecs.gpu_teraflops} unit="TFLOPS" highlight />
                                    </div>
                                </div>
                            </SpecCard>
                        )}

                        {/* VISUAL INTERFACE */}
                        <SpecCard title="Visual Interface">
                            <SpecField label="Panel Type" value={mergedSpecs.display_type} highlight />
                            <SpecField label="Size" value={mergedSpecs.screen_size_inch} unit='"' />
                            <SpecField label="Resolution" value={mergedSpecs.screen_resolution_x ? `${mergedSpecs.screen_resolution_x} x ${mergedSpecs.screen_resolution_y}` : null} />
                            <SpecField label="Density" value={mergedSpecs.ppi} unit="PPI" />
                            <SpecField label="Refresh Rate" value={mergedSpecs.refresh_rate_hz} unit="Hz" highlight />
                            <SpecField label="Brightness" value={mergedSpecs.brightness_nits} unit="nits" />
                            <SpecField label="Tech" value={mergedSpecs.display_tech} small />
                            
                            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-800">
                                <TechBadge label="Touchscreen" active={mergedSpecs.touchscreen} />
                                <TechBadge label="Dual Screen" active={!!mergedSpecs.second_screen_size} color="bg-retro-blue" />
                            </div>

                            {/* Dual Screen Sub-section */}
                            {mergedSpecs.second_screen_size && (
                                <div className="mt-4 bg-black/30 p-2 border border-dashed border-gray-800">
                                    <div className="text-[9px] text-gray-500 mb-1 uppercase">Secondary Display</div>
                                    <SpecField label="Size" value={mergedSpecs.second_screen_size} unit='"' small />
                                    <SpecField label="Res" value={mergedSpecs.second_screen_resolution_x ? `${mergedSpecs.second_screen_resolution_x} x ${mergedSpecs.second_screen_resolution_y}` : null} small />
                                </div>
                            )}
                        </SpecCard>

                        {/* MEMORY MATRIX */}
                        <SpecCard title="Memory & Storage">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-retro-pink font-bold mb-1">RAM (MEMORY)</div>
                                    <SpecField label="Capacity" value={mergedSpecs.ram_gb} unit="GB" highlight />
                                    <SpecField label="Type" value={mergedSpecs.ram_type} />
                                    <SpecField label="Speed" value={mergedSpecs.ram_speed_mhz} unit="MHz" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-retro-blue font-bold mb-1">STORAGE</div>
                                    <SpecField label="Capacity" value={mergedSpecs.storage_gb} unit="GB" highlight />
                                    <SpecField label="Interface" value={mergedSpecs.storage_type} />
                                    <div className="mt-2">
                                        <TechBadge label="SD Expandable" active={mergedSpecs.storage_expandable} />
                                    </div>
                                </div>
                            </div>
                        </SpecCard>

                        {/* CONTROL DECK & IO */}
                        <SpecCard title="Input & Connectivity">
                            <SpecField label="Layout" value={mergedSpecs.input_layout} />
                            <SpecField label="D-Pad" value={mergedSpecs.dpad_type} small />
                            <SpecField label="Sticks" value={mergedSpecs.analog_stick_type} small />
                            <SpecField label="Wireless" value={mergedSpecs.wireless_connectivity} small />
                            <SpecField label="Video Out" value={mergedSpecs.video_out} small />
                            <div className="mt-2">
                                <SpecField label="Ports" value={mergedSpecs.ports} small />
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-800">
                                <TechBadge label="Haptics" active={!!mergedSpecs.haptics} />
                                <TechBadge label="Gyroscope" active={mergedSpecs.gyro} color="bg-yellow-400" />
                                <TechBadge label="Back Buttons" active={mergedSpecs.has_back_buttons} color="bg-retro-pink" />
                                <TechBadge label="Cellular" active={!!mergedSpecs.cellular_connectivity} color="bg-green-400" />
                            </div>
                        </SpecCard>

                        {/* POWER & CHASSIS */}
                        <SpecCard title="Power & Chassis">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[9px] text-gray-500 uppercase mb-1">Battery</div>
                                    <SpecField label="Capacity" value={mergedSpecs.battery_mah} unit="mAh" />
                                    <SpecField label="Energy" value={mergedSpecs.battery_wh} unit="Wh" />
                                </div>
                                <div>
                                    <div className="text-[9px] text-gray-500 uppercase mb-1">Charging</div>
                                    <SpecField label="Speed" value={mergedSpecs.charging_speed_w} unit="W" highlight />
                                    <SpecField label="Port" value={mergedSpecs.charging_port} small />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                                <SpecField label="Dimensions" value={mergedSpecs.dimensions} small />
                                <SpecField label="Weight" value={mergedSpecs.weight_g} unit="g" />
                                <SpecField label="Material" value={mergedSpecs.body_material} small />
                                <SpecField label="Cooling" value={mergedSpecs.cooling} small />
                            </div>
                        </SpecCard>
                        
                        {/* MULTIMEDIA & SOFTWARE */}
                        <SpecCard title="Multimedia & OS">
                            <SpecField label="OS" value={mergedSpecs.os} highlight />
                            <SpecField label="Skin / UI" value={mergedSpecs.ui_skin} />
                            <SpecField label="Speakers" value={mergedSpecs.audio_speakers} />
                            <SpecField label="Audio Chip" value={mergedSpecs.audio_tech} small />
                            <SpecField label="Camera" value={mergedSpecs.camera} />
                            <SpecField label="Biometrics" value={mergedSpecs.biometrics} />
                            
                            <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-800">
                                <TechBadge label="Microphone" active={mergedSpecs.microphone} />
                                <TechBadge label="Headphone Jack" active={!!mergedSpecs.headphone_jack} color="bg-retro-blue" />
                            </div>
                        </SpecCard>

                    </div>
                </div>
            </div>

            {/* LINKED GAMES SECTION */}
            {games.length > 0 && (
                <div className="mt-16 pt-8 border-t-2 border-retro-grid">
                    <h3 className="font-pixel text-2xl text-retro-pink mb-6 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">NOTABLE SOFTWARE LIBRARY</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {games.map((game) => (
                            <Link 
                                key={game.id} 
                                href={`/archive/${game.slug || game.id}`}
                                className="group block bg-black border border-retro-grid hover:border-retro-pink transition-all relative overflow-hidden"
                            >
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    {game.image ? (
                                        <img src={game.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-pixel text-xs text-center p-2">NO COVER</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <div className="font-pixel text-[10px] text-white truncate group-hover:text-retro-pink">{game.title}</div>
                                    <div className="font-mono text-[9px] text-gray-400">{game.year}</div>
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