
'use client';

import { useState, useEffect, type FC } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import AdminEditTrigger from '../admin/AdminEditTrigger';
import { IconVS } from '../ui/Icons';
import Button from '../ui/Button';
import PlayabilityMatrix from './PlayabilityMatrix';
import { SpecCard } from '../ui/specs/SpecCard';
import { SpecField } from '../ui/specs/SpecField';
import { TechBadge } from '../ui/specs/TechBadge';
import { getConsoleImage } from '../../lib/utils';
import { getDocVersion } from '../../lib/utils/doc-version';
import { formatInputEnum } from '../../lib/utils/formatters';
import RetroStatusBar from '../ui/RetroStatusBar';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
}

// --- HELPERS ---

// Helper to check if any field in the section has data
const hasData = (keys: string[], specs: any): boolean => {
    if (!specs) return false;
    return keys.some(key => {
        // Special Handling for nested VariantInputProfile
        if (key === 'variant_input_profile') {
             // We treat input profile as 'having data' if the object exists AND has at least one meaningful field
             const profile = specs.variant_input_profile;
             if (!profile) return false;

             // Check if ANY value in the profile object is truthy (excluding id, timestamps, etc if needed, but loosely checking keys is safer)
             // We exclude 'variant_id' and 'input_confidence' being 'unknown'
             return Object.entries(profile).some(([k, v]) => {
                 if (k === 'variant_id' || k === 'created_at' || k === 'updated_at') return false;
                 if (k === 'input_confidence' && v === 'unknown') return false;
                 return v !== null && v !== undefined && v !== '';
             });
        }

        const val = specs[key];
        // Check for null, undefined, empty string.
        // Note: 'false' is valid data (e.g. touchscreen: false), so we don't exclude it.
        // We only filter out null, undefined, empty strings.
        return val !== null && val !== undefined && val !== '';
    });
};

const SectionPlaceholder = ({ title }: { title: string }) => (
    <div className="bg-black/20 border border-white/5 h-full min-h-[200px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-pixel text-xs text-primary uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]">
                {title}
            </h3>
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex items-start">
            <span className="font-mono text-sm text-gray-500 italic">
                Inputs not documented yet.
            </span>
        </div>
    </div>
);


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
    const compareUrl = `/arena/${consoleData.slug}${currentVariant?.slug ? `-${currentVariant.slug}` : ''}-vs-select`;
    
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

    // Helper for CPU Clock Display
    const formatCpuClock = (min?: number, max?: number) => {
        if (!min && !max) return { value: undefined, unit: 'MHz' };

        // Determine target unit based on Max (or Min if Max missing)
        const refValue = max || min || 0;
        const useGhz = refValue >= 1000;

        const unit = useGhz ? 'GHz' : 'MHz';
        const divisor = useGhz ? 1000 : 1;

        const formatNum = (n: number) => {
            const val = n / divisor;
            return parseFloat(val.toFixed(2));
        };

        if (min && max && min !== max) {
            return { value: `${formatNum(min)} - ${formatNum(max)}`, unit };
        }

        return { value: formatNum(max || min || 0), unit };
    };

    const cpuClockData = formatCpuClock(mergedSpecs.cpu_clock_min_mhz, mergedSpecs.cpu_clock_max_mhz);

    // Helper for Device Category Label
    const getSystemTypeLabel = (cat?: string) => {
        switch (cat) {
            case 'emulation': return 'EMULATION';
            case 'pc_gaming': return 'PC GAMING';
            case 'fpga': return 'FPGA';
            case 'legacy': return 'ORIGINAL HARDWARE';
            default: return 'SYSTEM';
        }
    };

    // --- DATA CHECK LISTS ---
    const SECTIONS = {
        SILICON: ['os', 'ui_skin', 'cpu_model', 'cpu_architecture', 'cpu_process_node', 'cpu_cores', 'cpu_clock_max_mhz', 'gpu_model', 'gpu_architecture', 'gpu_compute_units', 'gpu_clock_mhz', 'gpu_teraflops'],
        MEMORY: ['ram_mb', 'ram_type', 'ram_speed_mhz', 'storage_gb', 'storage_type', 'storage_expandable'],
        DISPLAY: ['screen_size_inch', 'screen_resolution_x', 'display_type', 'display_tech', 'refresh_rate_hz', 'brightness_nits', 'touchscreen', 'second_screen_size'],
        INPUT: ['variant_input_profile', 'input_layout', 'dpad_mechanism', 'thumbstick_mechanism', 'trigger_mechanism', 'haptics'],
        CONNECTIVITY: ['wifi_specs', 'bluetooth_specs', 'other_connectivity', 'cellular_connectivity', 'video_out', 'ports'],
        POWER: ['battery_capacity_mah', 'battery_capacity_wh', 'battery_type', 'charging_speed_w', 'tdp_wattage', 'charging_tech', 'cooling_solution', 'width_mm', 'weight_g', 'body_material', 'available_colors'],
        AUDIO: ['audio_speakers', 'has_headphone_jack', 'has_microphone', 'biometrics', 'camera_specs']
    };

    // --- RENDER ---

    return (
        <div className="w-full animate-fadeIn relative">
            <RetroStatusBar
                rcPath={`RC://RETRO_CIRCUIT/VAULT/CONSOLES/${consoleData.slug.toUpperCase()}`}
                docId={`HW_${consoleData.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_${consoleData.release_year || 'XXXX'}${getDocVersion(consoleData.slug)}`}
            />
            
            <div className="max-w-7xl mx-auto p-4">
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
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start border-b-4 border-border-normal pb-6 gap-6">
                <div className="flex-1">
                     <Link href="/consoles" className="inline-block text-xs font-mono text-primary hover:text-secondary transition-colors mb-2">
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
                        <Link href={`/fabricators/${consoleData.manufacturer?.slug}`} className="hover:text-secondary transition-colors border-b border-transparent hover:border-secondary">
                            {consoleData.manufacturer?.name.toUpperCase()}
                        </Link>
                        <span>{'//'}</span>
                        <span className="text-accent">{currentYear || 'TBA'}</span>
                        <span>{'//'}</span>
                        <span>{getSystemTypeLabel(consoleData.device_category)}</span>
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
                    <div className="bg-black border-2 border-border-normal p-8 flex items-center justify-center min-h-[300px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)] group overflow-hidden">
                        {currentImage ? (
                            <img src={currentImage} alt={consoleData.name} className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10" key={currentImage} />
                        ) : (
                            <div className="text-muted font-pixel text-4xl opacity-50">NO SIGNAL</div>
                        )}
                        
                        {/* Background Grid Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                        
                        {/* Form Factor & Feature Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                            <div className="bg-secondary text-black font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                                {consoleData.form_factor?.toUpperCase() || 'SYSTEM'}
                            </div>
                            {consoleData.chassis_features && (
                                <div className="bg-black/90 text-secondary border border-secondary font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                                    {consoleData.chassis_features.toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description Text */}
                    <div className="bg-bg-primary border border-border-normal p-6 relative">
                        <div className="absolute top-0 right-0 p-1">
                            <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z"/></svg>
                        </div>
                        <h3 className="font-pixel text-[10px] text-primary mb-4 uppercase">System Analysis</h3>
                        <p className="font-mono text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                            {consoleData.description}
                        </p>
                    </div>

                    {/* Quick Stats Summary Card */}
                    <div className="grid grid-cols-2 gap-px bg-bg-secondary border border-border-normal">
                        <div className="bg-bg-primary p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Model No.</div>
                            <div className="text-white font-mono text-sm">{mergedSpecs.model_no || 'N/A'}</div>
                        </div>
                        <div className="bg-bg-primary p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Launch Price</div>
                            <div className="text-secondary font-mono text-sm">{mergedSpecs.price_launch_usd ? `$${mergedSpecs.price_launch_usd}` : 'N/A'}</div>
                        </div>
                        <div className="bg-bg-primary p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">System Type</div>
                            <div className="text-white font-mono text-sm">{getSystemTypeLabel(consoleData.device_category)}</div>
                        </div>
                        <div className="bg-bg-primary p-3">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Release</div>
                            <div className="text-white font-mono text-sm">{currentYear || 'TBA'}</div>
                        </div>
                    </div>

                    {/* EMULATION PERFORMANCE GRID (MOVED TO LEFT COLUMN) */}
                    <PlayabilityMatrix profile={mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles} />
                </div>

                {/* RIGHT COLUMN: TECHNICAL SPECS (lg:col-span-8) */}
                <div className="lg:col-span-8">
                    
                    {/* VARIANT SELECTOR TABS */}
                    {hasVariants && (
                        <div className="mb-6 flex flex-wrap gap-2 border-b border-border-normal pb-2">
                            {variants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => handleVariantChange(variant.id)}
                                    className={`
                                        px-4 py-2 font-mono text-xs border-t border-l-2 border-r uppercase transition-all
                                        ${selectedVariantId === variant.id 
                                            ? 'bg-secondary text-black border-secondary font-bold shadow-[0_-2px_10px_rgba(0,255,157,0.3)]'
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
                        {hasData(SECTIONS.SILICON, mergedSpecs) ? (
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
                                    <SpecField
                                        label="Clock"
                                        value={cpuClockData.value}
                                        unit={cpuClockData.unit}
                                        small
                                        highlight
                                    />
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
                        ) : <SectionPlaceholder title="SILICON CORE" />}

                        {/* 2. MEMORY & STORAGE */}
                        {hasData(SECTIONS.MEMORY, mergedSpecs) ? (
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
                        ) : <SectionPlaceholder title="MEMORY & STORAGE" />}

                        {/* 3. DISPLAY */}
                        {hasData(SECTIONS.DISPLAY, mergedSpecs) ? (
                            <SpecCard title="DISPLAY">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-mono text-2xl text-white">{mergedSpecs.screen_size_inch}&quot;</span>
                                    <span className="font-mono text-xs text-primary border border-primary px-1.5">{mergedSpecs.display_type}</span>
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
                                        <div className="grid grid-cols-2 gap-4">
                                            <SpecField label="Size" value={mergedSpecs.second_screen_size} unit="&quot;" small />
                                            <SpecField label="Resolution" value={`${mergedSpecs.second_screen_resolution_x} x ${mergedSpecs.second_screen_resolution_y}`} small />
                                            <SpecField label="Refresh Rate" value={mergedSpecs.second_screen_refresh_rate} unit="Hz" small />
                                            <SpecField label="Brightness" value={mergedSpecs.second_screen_nits} unit="nits" small />
                                            <div className="col-span-2 flex items-center gap-2 mt-1">
                                                <span className="font-mono text-[10px] text-gray-500 uppercase">Touch Support</span>
                                                <TechBadge label="TOUCHSCREEN" active={mergedSpecs.second_screen_touch} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SpecCard>
                        ) : <SectionPlaceholder title="DISPLAY" />}

                        {/* 4. INPUT & CONTROLS */}
                        {hasData(SECTIONS.INPUT, mergedSpecs) ? (
                            <SpecCard title="INPUT & CONTROLS">
                                {/* NEW PROFILE DATA */}
                                {mergedSpecs.variant_input_profile ? (
                                    <>
                                        {/* D-Pad */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <SpecField label="D-pad shape" value={formatInputEnum('rc_dpad_shape', mergedSpecs.variant_input_profile.dpad_shape)} small />
                                            <SpecField label="D-pad tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.dpad_tech)} small />
                                        </div>
                                        {mergedSpecs.variant_input_profile.dpad_placement && (
                                            <SpecField label="D-pad placement" value={formatInputEnum('rc_placement', mergedSpecs.variant_input_profile.dpad_placement)} small />
                                        )}

                                        {/* Face Buttons */}
                                        <div className="mt-3 pt-2 border-t border-white/5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <SpecField label="Face buttons" value={mergedSpecs.variant_input_profile.face_button_count} small />
                                                <SpecField label="Face button tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.face_button_tech)} small />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-1">
                                                <SpecField label="Button labels" value={formatInputEnum('rc_label_scheme', mergedSpecs.variant_input_profile.face_label_scheme)} small />
                                            </div>
                                        </div>

                                        {/* Analog Sticks */}
                                        {(mergedSpecs.variant_input_profile.stick_count !== undefined && mergedSpecs.variant_input_profile.stick_count !== null) && (
                                            <div className="mt-3 pt-2 border-t border-white/5">
                                                <div className="text-[9px] text-gray-500 uppercase mb-1">Analog sticks ({mergedSpecs.variant_input_profile.stick_count})</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <SpecField label="Stick layout" value={formatInputEnum('rc_stick_layout', mergedSpecs.variant_input_profile.stick_layout)} small />
                                                    <SpecField label="Stick tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.stick_tech)} small />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-1">
                                                    <SpecField label="Stick cap" value={formatInputEnum('rc_stick_cap', mergedSpecs.variant_input_profile.stick_cap)} small />
                                                    <div className="flex items-center">
                                                        <span className="font-mono text-[10px] text-gray-500 uppercase mr-2">Stick clicks (L3/R3)</span>
                                                        <TechBadge label="YES" active={mergedSpecs.variant_input_profile.stick_clicks} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bumpers & Triggers */}
                                        <div className="mt-3 pt-2 border-t border-white/5">
                                            <SpecField label="Bumper tech (L1/R1)" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.bumper_tech)} small />
                                            <div className="grid grid-cols-2 gap-4 mt-1">
                                                <SpecField label="Trigger type (L2/R2)" value={formatInputEnum('rc_trigger_type', mergedSpecs.variant_input_profile.trigger_type)} small />
                                                <SpecField label="Trigger tech (L2/R2)" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.trigger_tech)} small />
                                            </div>
                                            <SpecField label="Trigger layout" value={formatInputEnum('rc_trigger_layout', mergedSpecs.variant_input_profile.trigger_layout)} small />
                                        </div>

                                        {/* Extra Inputs */}
                                        <div className="mt-3 pt-2 border-t border-white/5">
                                            <SpecField label="Back buttons" value={mergedSpecs.variant_input_profile.back_button_count} small />

                                            {mergedSpecs.variant_input_profile.has_gyro !== null && (
                                                <div className="flex items-center justify-between py-1 border-b border-white/5 mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 uppercase">Gyro / motion controls</span>
                                                    <TechBadge label="ENABLED" active={mergedSpecs.variant_input_profile.has_gyro} />
                                                </div>
                                            )}

                                            {mergedSpecs.variant_input_profile.has_keyboard && (
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <div className="flex items-center">
                                                        <span className="font-mono text-[10px] text-gray-500 uppercase mr-2">Keyboard</span>
                                                        <TechBadge label="YES" active={true} />
                                                    </div>
                                                    <SpecField label="Keyboard type" value={formatInputEnum('rc_keyboard_type', mergedSpecs.variant_input_profile.keyboard_type)} small />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <SpecField label="System buttons" value={formatInputEnum('rc_system_button_set', mergedSpecs.variant_input_profile.system_button_set)} small />
                                                <SpecField label="Extra buttons (details)" value={mergedSpecs.variant_input_profile.system_buttons_text} small />
                                            </div>

                                            {mergedSpecs.variant_input_profile.touchpad_count ? (
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <SpecField label="Touchpads" value={mergedSpecs.variant_input_profile.touchpad_count} small />
                                                    <div className="flex items-center">
                                                        <span className="font-mono text-[10px] text-gray-500 uppercase mr-2">Touchpad clicks</span>
                                                        <TechBadge label="YES" active={mergedSpecs.variant_input_profile.touchpad_clickable} />
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Meta */}
                                        {(mergedSpecs.variant_input_profile.input_notes || mergedSpecs.variant_input_profile.input_confidence) && (
                                            <div className="mt-3 pt-2 border-t border-white/5">
                                                {mergedSpecs.variant_input_profile.input_confidence && (
                                                    <div className="text-[9px] font-mono text-gray-500 mb-1">
                                                        Data confidence: <span className={mergedSpecs.variant_input_profile.input_confidence === 'confirmed' ? 'text-secondary' : 'text-accent'}>{(formatInputEnum('rc_confidence', mergedSpecs.variant_input_profile.input_confidence) || '').toUpperCase()}</span>
                                                    </div>
                                                )}
                                                {mergedSpecs.variant_input_profile.input_notes && (
                                                    <div className="mt-1">
                                                        <span className="text-[9px] font-mono text-gray-500 uppercase block">Notes</span>
                                                        <p className="text-[10px] font-mono text-gray-400 italic">
                                                            "{mergedSpecs.variant_input_profile.input_notes}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="opacity-50 text-xs font-mono text-gray-500 text-center py-4">
                                        No Input Profile Data
                                    </div>
                                )}
                            </SpecCard>
                        ) : <SectionPlaceholder title="INPUT & CONTROLS" />}

                        {/* 5. CONNECTIVITY & IO */}
                        {hasData(SECTIONS.CONNECTIVITY, mergedSpecs) ? (
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
                        ) : <SectionPlaceholder title="CONNECTIVITY & IO" />}

                        {/* 6. POWER & BODY */}
                        {hasData(SECTIONS.POWER, mergedSpecs) ? (
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
                        ) : <SectionPlaceholder title="POWER & CHASSIS" />}

                        {/* 7. AUDIO & MISC */}
                        {hasData(SECTIONS.AUDIO, mergedSpecs) ? (
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
                        ) : <SectionPlaceholder title="AUDIO & MISC" />}
                    </div>

                </div>

            </div>

        </div>
        </div>
    );
};

export default ConsoleDetailView;
