
'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant, GameOfTheWeekData } from '../../lib/types';
import CollectionToggle from '../ui/CollectionToggle';
import AdminEditTrigger from '../admin/AdminEditTrigger';
import { IconGames } from '../ui/Icons';

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
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn relative">
            
            {/* ADMIN TRIGGER (FIXED: EDIT VARIANT) */}
            {selectedVariantId !== 'base' && (
                <AdminEditTrigger 
                    id={selectedVariantId} 
                    type="variant"
                    label="EDIT VARIANT"
                    displayMode="fixed"
                />
            )}

            {/* TOP NAVIGATION & HEADER */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start border-b-4 border-retro-grid pb-6 gap-6">
                <div className="flex-1">
                     <Link href="/console" className="inline-block text-xs font-mono text-retro-blue hover:text-retro-neon transition-colors mb-2">
                        &lt; BACK TO CONSOLE VAULT
                     </Link>
                     <div className="flex flex-wrap items-center gap-4">
                        <h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[4px_4px_0_rgba(0,255,157,0.5)] leading-tight uppercase break-words">
                            {consoleData.name}
                        </h1>
                        <AdminEditTrigger 
                            id={consoleData.id} 
                            type="console"
                            label="EDIT FOLDER"
                            displayMode="inline"
                            color="amber"
                            className="mt-2"
                        />
                     </div>
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

                {/* RIGHT COLUMN: TECHNICAL SPECS (lg:col-span-8) */}
                <div className="lg:col-span-8">
                    
                    {/* VARIANT SELECTOR TABS */}
                    {hasVariants && (
                        <div className="mb-6 flex flex-wrap gap-2 border-b border-retro-grid pb-2">
                            {variants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => handleVariantChange(variant.id)}
                                    className={`
                                        px-4 py-2 font-mono text-xs border-t border-l border-r uppercase transition-all
                                        ${selectedVariantId === variant.id 
                                            ? 'bg-retro-neon text-black border-retro-neon font-bold shadow-[0_-2px_10px_rgba(0,255,157,0.3)]' 
                                            : 'bg-black text-gray-500 border-gray-800 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    {variant.variant_name} {variant.is_default && '(Base)'}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* 1. SILICON CORE */}
                        <SpecCard title="SILICON CORE">
                            <SpecField label="CPU Model" value={mergedSpecs.cpu_model} />
                            <SpecField label="Architecture" value={mergedSpecs.cpu_architecture} />
                            <SpecField label="Process Node" value={mergedSpecs.cpu_process_node} />
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="Cores" value={mergedSpecs.cpu_cores} small />
                                <SpecField label="Clock" value={mergedSpecs.cpu_clock_mhz} unit="MHz" small highlight />
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <SpecField label="GPU Model" value={mergedSpecs.gpu_model} />
                                <SpecField label="Architecture" value={mergedSpecs.gpu_architecture} />
                                <div className="grid grid-cols-2 gap-4">
                                    <SpecField label="Compute Units" value={mergedSpecs.gpu_core_unit} small />
                                    <SpecField label="Clock" value={mergedSpecs.gpu_clock_mhz} unit="MHz" small />
                                </div>
                                <SpecField label="Performance" value={mergedSpecs.gpu_teraflops} unit="TFLOPS" highlight />
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-white/5">
                                 <SpecField label="OS / Firmware" value={mergedSpecs.os} />
                            </div>
                        </SpecCard>

                        {/* 2. MEMORY & STORAGE */}
                        <SpecCard title="MEMORY & STORAGE">
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="RAM" value={mergedSpecs.ram_gb} unit="GB" highlight />
                                <SpecField label="Type" value={mergedSpecs.ram_type} small />
                            </div>
                            <SpecField label="Bandwidth/Speed" value={mergedSpecs.ram_speed_mhz} unit="MHz" />
                            
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <SpecField label="Internal Storage" value={mergedSpecs.storage_gb} unit="GB" highlight />
                                <SpecField label="Storage Type" value={mergedSpecs.storage_type} />
                                <div className="mt-2 flex gap-2">
                                    <TechBadge label="SD Expandable" active={mergedSpecs.storage_expandable} />
                                </div>
                            </div>
                        </SpecCard>

                        {/* 3. DISPLAY */}
                        <SpecCard title="DISPLAY">
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="Size" value={mergedSpecs.screen_size_inch} unit='"' highlight />
                                <SpecField label="Type" value={mergedSpecs.display_type} small />
                            </div>
                            <SpecField label="Resolution" value={mergedSpecs.screen_resolution_x && mergedSpecs.screen_resolution_y ? `${mergedSpecs.screen_resolution_x} x ${mergedSpecs.screen_resolution_y}` : null} />
                            <SpecField label="Display Tech" value={mergedSpecs.display_tech} small />
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="PPI" value={mergedSpecs.ppi} small />
                                <SpecField label="Refresh" value={mergedSpecs.refresh_rate_hz} unit="Hz" highlight small />
                            </div>
                            <SpecField label="Peak Brightness" value={mergedSpecs.brightness_nits} unit="nits" />
                            <SpecField label="Aspect Ratio" value={mergedSpecs.aspect_ratio} small />
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                                <TechBadge label="Touchscreen" active={mergedSpecs.touchscreen} />
                            </div>

                            {/* Dual Screen Logic */}
                            {(mergedSpecs.second_screen_size || 0) > 0 && (
                                <div className="mt-4 pt-2 border-t border-dashed border-gray-700">
                                    <div className="text-[9px] text-gray-500 mb-2">SECONDARY SCREEN</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <SpecField label="Size" value={mergedSpecs.second_screen_size} unit='"' small />
                                        <SpecField label="Res" value={mergedSpecs.second_screen_resolution_x && `${mergedSpecs.second_screen_resolution_x}x${mergedSpecs.second_screen_resolution_y}`} small />
                                    </div>
                                    <div className="mt-2">
                                        <TechBadge label="Touch" active={mergedSpecs.second_screen_touch} />
                                    </div>
                                </div>
                            )}
                        </SpecCard>

                        {/* 4. INPUT & CONNECTIVITY */}
                        <SpecCard title="INPUT & CONNECTIVITY">
                             {/* Controls */}
                             <SpecField label="Input Layout" value={mergedSpecs.input_layout} />
                             <SpecField label="D-Pad" value={mergedSpecs.dpad_type} small />
                             <SpecField label="Analog Sticks" value={mergedSpecs.analog_stick_type} small />
                             <SpecField label="Triggers" value={mergedSpecs.shoulder_buttons} small />
                             
                             <div className="mt-4 pt-4 border-t border-white/5">
                                <SpecField label="Wireless" value={mergedSpecs.wireless_connectivity} small />
                                <SpecField label="Ports" value={mergedSpecs.ports} small />
                                <SpecField label="Video Out" value={mergedSpecs.video_out} small />
                                <SpecField label="Haptics" value={mergedSpecs.haptics} small />
                             </div>
                             
                             <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    <TechBadge label="Hall Effect" active={mergedSpecs.analog_stick_type?.toLowerCase().includes('hall') || mergedSpecs.shoulder_buttons?.toLowerCase().includes('hall')} color="bg-retro-blue" />
                                    <TechBadge label="Back Buttons" active={mergedSpecs.has_back_buttons} />
                                    <TechBadge label="Haptics" active={mergedSpecs.haptics ? true : undefined} />
                                    <TechBadge label="Gyro" active={mergedSpecs.gyro} />
                                    <TechBadge label="5G/LTE" active={mergedSpecs.cellular_connectivity} color="bg-retro-pink" />
                                </div>
                             </div>
                        </SpecCard>

                        {/* 5. POWER & CHASSIS */}
                        <SpecCard title="POWER & CHASSIS">
                             {/* Battery Logic: Wh prioritized */}
                             {mergedSpecs.battery_wh ? (
                                  <SpecField label="Battery Energy" value={mergedSpecs.battery_wh} unit="Wh" highlight />
                             ) : (
                                  <SpecField label="Battery Capacity" value={mergedSpecs.battery_mah} unit="mAh" highlight />
                             )}
                             
                             {/* Show secondary battery metric if both exist */}
                             {mergedSpecs.battery_wh && mergedSpecs.battery_mah && (
                                 <SpecField label="Capacity" value={mergedSpecs.battery_mah} unit="mAh" small />
                             )}
 
                             <SpecField label="Charging" value={mergedSpecs.charging_speed_w} unit="W" />
                             <SpecField label="Port" value={mergedSpecs.charging_port} small />
                             <SpecField label="Est. Playtime" value={mergedSpecs.tdp_range_w} />
 
                             <div className="mt-4 pt-4 border-t border-white/5">
                                 <SpecField label="Dimensions" value={mergedSpecs.dimensions} small />
                                 <SpecField label="Weight" value={mergedSpecs.weight_g} unit="g" />
                                 <SpecField label="Material" value={mergedSpecs.body_material} small />
                                 <SpecField label="Cooling" value={mergedSpecs.cooling} small />
                             </div>
                        </SpecCard>

                        {/* 6. AUDIO & MISC */}
                        <SpecCard title="AUDIO & MISC">
                             <SpecField label="Colors" value={mergedSpecs.colors} small />
                             <SpecField label="UI Skin" value={mergedSpecs.ui_skin} />
                             
                             <div className="mt-4 pt-4 border-t border-white/5">
                                <SpecField label="Speakers" value={mergedSpecs.audio_speakers} />
                                <SpecField label="Audio Tech" value={mergedSpecs.audio_tech} small />
                             </div>

                             <div className="mt-4 pt-4 border-t border-white/5">
                                <div className="flex flex-wrap gap-2">
                                    <TechBadge label="3.5mm Jack" active={mergedSpecs.headphone_jack} />
                                    <TechBadge label="Microphone" active={mergedSpecs.microphone} />
                                    <TechBadge label="Camera" active={mergedSpecs.camera} />
                                    <TechBadge label="Biometrics" active={mergedSpecs.biometrics} />
                                </div>
                             </div>
                        </SpecCard>

                    </div>
                </div>
            </div>

            {/* LINKED GAMES SECTION */}
            {games.length > 0 && (
                <div className="mt-12 border-t-2 border-retro-grid pt-12">
                     <div className="flex items-center gap-3 mb-8">
                        <IconGames className="w-6 h-6 text-retro-pink" />
                        <h2 className="font-pixel text-xl md:text-2xl text-white">
                            SOFTWARE LIBRARY <span className="text-retro-pink">({games.length})</span>
                        </h2>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map(game => (
                             <Link 
                                href={`/archive/${game.slug || game.id}`} 
                                key={game.id}
                                className="group flex bg-black border border-retro-grid hover:border-retro-pink transition-all overflow-hidden"
                             >
                                <div className="w-24 h-32 bg-gray-900 relative flex-shrink-0">
                                    {game.image ? (
                                        <img src={game.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-pixel p-2 text-center">NO ART</div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <h3 className="font-pixel text-xs text-white group-hover:text-retro-pink leading-tight mb-2">{game.title}</h3>
                                        <div className="font-mono text-[10px] text-gray-500">
                                            {game.year} // {game.genre}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="text-[10px] font-mono text-retro-blue border border-retro-blue px-2 hover:bg-retro-blue hover:text-black transition-colors">READ INTEL</span>
                                    </div>
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