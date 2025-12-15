
'use client';

import { useState, useEffect, type FC } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import AdminEditTrigger from '../admin/AdminEditTrigger';
import { IconVS } from '../ui/Icons';
import Button from '../ui/Button';
import EmulationGrid from './EmulationGrid';
import { SpecCard } from '../ui/specs/SpecCard';
import { SpecField } from '../ui/specs/SpecField';
import { TechBadge } from '../ui/specs/TechBadge';
import { getConsoleImage } from '../../lib/utils';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
}

// --- MAIN COMPONENT ---

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData }) => {
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
    
    // Get the correct image using the centralized helper
    const currentImage = getConsoleImage({ console: consoleData, variant: currentVariant });
    const currentYear = currentVariant?.release_year || consoleData.release_year;
    
    // Construct VS Mode URL (Using p1 as requested)
    const compareUrl = `/arena?p1=${consoleData.slug}${currentVariant?.slug ? `&v1=${currentVariant.slug}` : ''}`;
    
    // Construct Dimensions String
    const getDimString = () => {
        if (mergedSpecs.width_mm && mergedSpecs.height_mm && mergedSpecs.depth_mm) {
            return `${mergedSpecs.width_mm} x ${mergedSpecs.height_mm} x ${mergedSpecs.depth_mm} mm`;
        }
        return '---';
    };

    // Helper for RAM Display
    const formatRam = (mb?: number) => {
        if (!mb) return null;
        if (mb >= 1024) return { val: Math.round((mb / 1024) * 100) / 100, unit: 'GB' };
        return { val: mb, unit: 'MB' };
    };
    
    const ramData = formatRam(mergedSpecs.ram_mb);

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
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href={compareUrl}>
                        <Button variant="secondary" className="flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                            <IconVS className="w-4 h-4" />
                            COMPARE
                        </Button>
                    </Link>
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
                        
                        {/* Form Factor & Feature Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                            <div className="bg-retro-neon text-black font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                                {consoleData.form_factor?.toUpperCase() || 'SYSTEM'}
                            </div>
                            {consoleData.chassis_features && (
                                <div className="bg-black/90 text-retro-neon border border-retro-neon font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                                    {consoleData.chassis_features.toUpperCase()}
                                </div>
                            )}
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

                    {/* Quick Stats Summary Card */}
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
                                        px-4 py-2 font-mono text-xs border-t border-l-2 border-r uppercase transition-all
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

                    {/* EMULATION PERFORMANCE GRID */}
                    <EmulationGrid profile={mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* 1. SILICON CORE */}
                        <SpecCard title="SILICON CORE">
                            <div className="mb-2 border-b border-white/5 pb-2">
                                <SpecField label="OS / Firmware" value={mergedSpecs.os} />
                                <SpecField label="UI Skin" value={mergedSpecs.ui_skin} small />
                            </div>

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
                                    <SpecField label="Compute Units" value={mergedSpecs.gpu_compute_units} small />
                                    <SpecField label="Clock" value={mergedSpecs.gpu_clock_mhz} unit="MHz" small />
                                </div>
                                <SpecField label="Performance" value={mergedSpecs.gpu_teraflops} unit="TFLOPS" highlight />
                            </div>
                        </SpecCard>

                        {/* 2. MEMORY & STORAGE */}
                        <SpecCard title="MEMORY & STORAGE">
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="RAM" value={ramData?.val} unit={ramData?.unit} highlight />
                                <SpecField label="Type" value={mergedSpecs.ram_type} small />
                            </div>
                            <SpecField label="Speed" value={mergedSpecs.ram_speed_mhz} unit="MHz" />
                            
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <SpecField label="Storage" value={mergedSpecs.storage_gb} unit="GB" highlight />
                                <SpecField label="Type" value={mergedSpecs.storage_type} />
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-mono text-[10px] text-gray-500 uppercase">MicroSD Slot</span>
                                    <TechBadge label="EXPANDABLE" active={mergedSpecs.storage_expandable} />
                                </div>
                            </div>
                        </SpecCard>

                        {/* 3. DISPLAY */}
                        <SpecCard title="DISPLAY">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-mono text-2xl text-white">{mergedSpecs.screen_size_inch}"</span>
                                <span className="font-mono text-xs text-retro-blue border border-retro-blue px-1.5">{mergedSpecs.display_type}</span>
                            </div>
                            <SpecField label="Resolution" value={`${mergedSpecs.screen_resolution_x} x ${mergedSpecs.screen_resolution_y}`} />
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="PPI" value={mergedSpecs.ppi} small />
                                <SpecField label="Aspect Ratio" value={mergedSpecs.aspect_ratio} small />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="Refresh Rate" value={mergedSpecs.refresh_rate_hz} unit="Hz" highlight />
                                <SpecField label="Brightness" value={mergedSpecs.brightness_nits} unit="nits" />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <TechBadge label="TOUCHSCREEN" active={mergedSpecs.touchscreen} />
                                {mergedSpecs.display_tech && <span className="text-[9px] font-mono text-gray-500 border border-gray-800 px-1">{mergedSpecs.display_tech}</span>}
                            </div>
                            
                            {/* Dual Screen Info */}
                            {mergedSpecs.second_screen_size && (
                                <div className="mt-3 pt-2 border-t border-white/5">
                                    <div className="text-[9px] text-gray-500 uppercase mb-1">Secondary Display</div>
                                    <SpecField label="Size" value={mergedSpecs.second_screen_size} unit='"' small />
                                    <SpecField label="Resolution" value={`${mergedSpecs.second_screen_resolution_x} x ${mergedSpecs.second_screen_resolution_y}`} small />
                                </div>
                            )}
                        </SpecCard>

                        {/* 4. INPUT & CONTROLS */}
                        <SpecCard title="INPUT & CONTROLS">
                            <SpecField label="Layout" value={mergedSpecs.input_layout} />
                            <SpecField label="Buttons" value={mergedSpecs.other_buttons} small />
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <SpecField label="D-Pad" value={mergedSpecs.dpad_mechanism} small />
                                <SpecField label="Face Btn" value={mergedSpecs.action_button_mechanism} small />
                            </div>
                            
                            <div className="mt-3 pt-2 border-t border-white/5">
                                <div className="text-[9px] text-gray-500 uppercase mb-1">Analog Sticks</div>
                                <SpecField label="Tech" value={mergedSpecs.thumbstick_mechanism} small />
                                <SpecField label="Layout" value={mergedSpecs.thumbstick_layout} small />
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-mono text-[10px] text-gray-500 uppercase">L3/R3</span>
                                    <TechBadge label="CLICKABLE" active={mergedSpecs.has_stick_clicks} />
                                </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-2 gap-4">
                                    <SpecField label="L1/R1" value={mergedSpecs.bumper_mechanism} small />
                                    <SpecField label="L2/R2" value={mergedSpecs.trigger_mechanism} small />
                                </div>
                                <SpecField label="Shoulder Style" value={mergedSpecs.shoulder_layout} small />
                            </div>

                            <div className="mt-3 pt-2 border-t border-white/5">
                                <SpecField label="Haptics" value={mergedSpecs.haptics} small />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <TechBadge label="GYROSCOPE" active={mergedSpecs.gyro} />
                                    <TechBadge label="BACK BUTTONS" active={mergedSpecs.has_back_buttons} />
                                </div>
                            </div>
                        </SpecCard>

                        {/* 5. CONNECTIVITY & IO */}
                        <SpecCard title="CONNECTIVITY & IO">
                            <SpecField label="Wi-Fi" value={mergedSpecs.wifi_specs} small />
                            <SpecField label="Bluetooth" value={mergedSpecs.bluetooth_specs} small />
                            <SpecField label="Other" value={mergedSpecs.other_connectivity} small />
                            <div className="flex justify-between items-center py-1">
                                <span className="font-mono text-[10px] text-gray-500 uppercase">Cellular</span>
                                <TechBadge label="5G / 4G LTE" active={mergedSpecs.cellular_connectivity} />
                            </div>
                            
                            <div className="mt-2 pt-2 border-t border-white/5">
                                <SpecField label="Video Out" value={mergedSpecs.video_out} small />
                                <div className="mt-2">
                                    <span className="text-[9px] text-gray-500 uppercase block mb-1">Ports</span>
                                    <p className="font-mono text-xs text-gray-300 leading-tight">{mergedSpecs.ports || 'N/A'}</p>
                                </div>
                            </div>
                        </SpecCard>

                        {/* 6. POWER & BODY */}
                        <SpecCard title="POWER & CHASSIS">
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="Capacity" value={mergedSpecs.battery_capacity_mah} unit="mAh" highlight />
                                <SpecField label="Energy" value={mergedSpecs.battery_capacity_wh} unit="Wh" />
                            </div>
                            <SpecField label="Battery Type" value={mergedSpecs.battery_type} small />
                            <div className="grid grid-cols-2 gap-4">
                                <SpecField label="Charging" value={mergedSpecs.charging_speed_w} unit="W" />
                                <SpecField label="TDP" value={mergedSpecs.tdp_wattage} unit="W" />
                            </div>
                            <SpecField label="Charge Tech" value={mergedSpecs.charging_tech} small />
                            <SpecField label="Cooling" value={mergedSpecs.cooling_solution} small />
                            
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <SpecField label="Dimensions" value={getDimString()} small />
                                <SpecField label="Weight" value={mergedSpecs.weight_g} unit="g" small />
                                <SpecField label="Material" value={mergedSpecs.body_material} small />
                                <SpecField label="Colors" value={mergedSpecs.available_colors} small />
                            </div>
                        </SpecCard>

                        {/* 7. AUDIO & MISC */}
                        <SpecCard title="AUDIO & MISC">
                            <SpecField label="Speakers" value={mergedSpecs.audio_speakers} />
                            <div className="flex flex-wrap gap-2 mt-2">
                                <TechBadge label="HEADPHONE JACK" active={mergedSpecs.has_headphone_jack} />
                                <TechBadge label="MICROPHONE" active={mergedSpecs.has_microphone} />
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <SpecField label="Biometrics" value={mergedSpecs.biometrics} small />
                                <SpecField label="Camera" value={mergedSpecs.camera_specs} small />
                            </div>
                        </SpecCard>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ConsoleDetailView;
