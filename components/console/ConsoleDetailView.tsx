'use client';

import { useState, useEffect, type FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import ConsoleIdentitySection from './ConsoleIdentitySection';
import PlayabilityMatrix from './PlayabilityMatrix';
import MissionProfile from './MissionProfile';
import AtAGlance from './AtAGlance';
import BuySection from './BuySection';
import { SpecCard } from '../ui/specs/SpecCard';
import { SpecField } from '../ui/specs/SpecField';
import { TechBadge } from '../ui/specs/TechBadge';
import { formatInputEnum } from '../../lib/utils/formatters';
import { getConsoleImage } from '../../lib/utils';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
}

// --- HELPERS ---

const hasData = (keys: string[], specs: any): boolean => {
    if (!specs) return false;
    return keys.some(key => {
        if (key === 'variant_input_profile') {
             const profile = specs.variant_input_profile;
             if (!profile) return false;
             return Object.entries(profile).some(([k, v]) => {
                 if (k === 'variant_id' || k === 'created_at' || k === 'updated_at') return false;
                 if (k === 'input_confidence' && v === 'unknown') return false;
                 if (k === 'system_button_set') return false;
                 return v !== null && v !== undefined && v !== '';
             });
        }
        const val = specs[key];
        return val !== null && val !== undefined && val !== '';
    });
};

// --- MAIN COMPONENT ---

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const variants = consoleData.variants || [];
    const hasVariants = variants.length > 0;

    // --- VARIANT LOGIC ---
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
    
    type MergedSpecs = Partial<ConsoleSpecs> & Partial<ConsoleVariant>;
    const getMergedSpecs = (varId: string): MergedSpecs => {
        const baseSpecs = consoleData.specs || {};
        if (varId === 'base') return baseSpecs;
        const variant = variants.find(x => x.id === varId);
        if (!variant) return baseSpecs;
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
    const currentImage = getConsoleImage({ console: consoleData, variant: currentVariant });

    // --- FORMATTERS ---
    const getDimString = () => {
        if (mergedSpecs.width_mm && mergedSpecs.height_mm && mergedSpecs.depth_mm) {
            return `${mergedSpecs.width_mm} x ${mergedSpecs.height_mm} x ${mergedSpecs.depth_mm} mm`;
        }
        return '---';
    };

    const formatRam = (mb?: number) => {
        if (!mb) return null;
        if (mb >= 1024) return { val: Math.round((mb / 1024) * 100) / 100, unit: 'GB' };
        return { val: mb, unit: 'MB' };
    };
    const ramData = formatRam(mergedSpecs.ram_mb);

    const formatCpuClock = (min?: number, max?: number) => {
        if (!min && !max) return { value: undefined, unit: 'MHz' };
        const refValue = max || min || 0;
        const useGhz = refValue >= 1000;
        const unit = useGhz ? 'GHz' : 'MHz';
        const divisor = useGhz ? 1000 : 1;
        const formatNum = (n: number) => parseFloat((n / divisor).toFixed(2));

        if (min && max && min !== max) {
            return { value: `${formatNum(min)} - ${formatNum(max)}`, unit };
        }
        return { value: formatNum(max || min || 0), unit };
    };
    const cpuClockData = formatCpuClock(mergedSpecs.cpu_clock_min_mhz, mergedSpecs.cpu_clock_max_mhz);

    const SECTIONS = {
        SILICON: ['os', 'ui_skin', 'cpu_model', 'cpu_architecture', 'cpu_process_node', 'cpu_cores', 'cpu_clock_max_mhz', 'gpu_model', 'gpu_architecture', 'gpu_compute_units', 'gpu_clock_mhz', 'gpu_teraflops'],
        MEMORY: ['ram_mb', 'ram_type', 'ram_speed_mhz', 'storage_gb', 'storage_type', 'storage_expandable'],
        DISPLAY: ['screen_size_inch', 'screen_resolution_x', 'display_type', 'display_tech', 'refresh_rate_hz', 'brightness_nits', 'touchscreen', 'second_screen_size'],
        INPUT: ['variant_input_profile', 'input_layout', 'dpad_mechanism', 'thumbstick_mechanism', 'trigger_mechanism', 'haptics'],
        CONNECTIVITY: ['wifi_specs', 'bluetooth_specs', 'other_connectivity', 'cellular_connectivity', 'video_out', 'ports'],
        POWER: ['battery_capacity_mah', 'battery_capacity_wh', 'battery_type', 'charging_speed_w', 'tdp_wattage', 'charging_tech', 'cooling_solution', 'width_mm', 'weight_g', 'body_material', 'available_colors'],
        AUDIO: ['audio_speakers', 'has_headphone_jack', 'has_microphone', 'biometrics', 'camera_specs']
    };

    return (
        <div className="w-full animate-fadeIn relative">
             {/* SECTION I: IDENTITY (Sticky) */}
             <ConsoleIdentitySection
                console={consoleData}
                manufacturer={consoleData.manufacturer || null}
                variants={variants}
                selectedVariantId={selectedVariantId}
                onVariantChange={(slug) => {
                     const v = variants.find(v => v.slug === slug);
                     if (v) handleVariantChange(v.id);
                }}
             />

             {/* MAIN CONTENT GRID */}
             <div className="w-full mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 relative">

                    {/* --- LEFT COLUMN: STICKY SIDEBAR (lg:col-span-4) --- */}
                    <div className="lg:col-span-4">
                        {/* Sticky Container */}
                        {/* top-[120px] accounts for global header (64px) + typical compact bar height (~50px) */}
                        <div className="sticky top-[120px] space-y-6">

                            {/* 1. PHOTO */}
                            <div className="bg-black border-2 border-border-normal p-8 flex items-center justify-center min-h-[200px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)] group overflow-hidden">
                                {currentImage ? (
                                    <img src={currentImage} alt={consoleData.name} className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10" key={currentImage} />
                                ) : (
                                    <div className="text-muted font-pixel text-4xl opacity-50">NO SIGNAL</div>
                                )}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
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

                            {/* 2. MISSION PROFILE */}
                            <MissionProfile />

                            {/* 3. BUY */}
                            <div id="buy">
                                <BuySection />
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: SCROLLABLE CONTENT (lg:col-span-8) --- */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. SYSTEM ANALYSIS */}
                        <div id="analysis" className="bg-bg-primary border border-border-normal p-6 relative">
                            <h3 className="font-pixel text-[10px] text-primary mb-4 uppercase">System Analysis</h3>
                            <p className="font-mono text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                                {consoleData.description}
                            </p>
                        </div>

                        {/* 2. AT A GLANCE */}
                        <AtAGlance />

                        {/* 3. EMULATION MATRIX */}
                        <div id="playability">
                            <PlayabilityMatrix profile={mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles} />
                        </div>

                        {/* 4. TECHNICAL REFERENCE (Collapsible Grid) */}
                        <div id="tech" className="space-y-4">
                            <h3 className="font-pixel text-lg text-white uppercase mb-4 border-b border-white/10 pb-2">Technical Reference</h3>

                             {/* SILICON CORE */}
                             {hasData(SECTIONS.SILICON, mergedSpecs) ? (
                                <SpecCard title="SILICON CORE">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <SpecField label="OS / Firmware" value={mergedSpecs.os} />
                                            <SpecField label="UI Skin" value={mergedSpecs.ui_skin} small />
                                            <SpecField label="CPU Model" value={mergedSpecs.cpu_model} />
                                            <SpecField label="Architecture" value={mergedSpecs.cpu_architecture} />
                                            <SpecField label="Process Node" value={mergedSpecs.cpu_process_node} />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <SpecField label="Cores" value={mergedSpecs.cpu_cores} small />
                                                <SpecField label="Clock" value={cpuClockData.value} unit={cpuClockData.unit} small highlight />
                                            </div>
                                            <div className="pt-3 border-t border-white/5">
                                                <SpecField label="GPU Model" value={mergedSpecs.gpu_model} />
                                                <SpecField label="Architecture" value={mergedSpecs.gpu_architecture} />
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <SpecField label="Compute Units" value={mergedSpecs.gpu_compute_units} small />
                                                    <SpecField label="Clock" value={mergedSpecs.gpu_clock_mhz} unit="MHz" small />
                                                </div>
                                                <SpecField label="Performance" value={mergedSpecs.gpu_teraflops} unit="TFLOPS" highlight />
                                            </div>
                                        </div>
                                    </div>
                                </SpecCard>
                            ) : null}

                            {/* MEMORY & STORAGE */}
                            {hasData(SECTIONS.MEMORY, mergedSpecs) ? (
                                <SpecCard title="MEMORY & STORAGE">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <SpecField label="RAM" value={ramData?.val} unit={ramData?.unit} highlight />
                                                <SpecField label="Type" value={mergedSpecs.ram_type} small />
                                            </div>
                                            <SpecField label="Speed" value={mergedSpecs.ram_speed_mhz} unit="MHz" />
                                        </div>
                                        <div className="space-y-3">
                                            <SpecField label="Storage" value={mergedSpecs.storage_gb} unit="GB" highlight />
                                            <SpecField label="Type" value={mergedSpecs.storage_type} />
                                            <div className="flex justify-between items-center py-1">
                                                <span className="font-mono text-[10px] text-gray-500 uppercase">MicroSD Slot</span>
                                                <TechBadge label="EXPANDABLE" active={mergedSpecs.storage_expandable} />
                                            </div>
                                        </div>
                                    </div>
                                </SpecCard>
                            ) : null}

                            {/* DISPLAY */}
                            {hasData(SECTIONS.DISPLAY, mergedSpecs) ? (
                                <SpecCard title="DISPLAY">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="font-mono text-2xl text-white">{mergedSpecs.screen_size_inch}&quot;</span>
                                                <span className="font-mono text-xs text-primary border border-primary px-1.5">{mergedSpecs.display_type}</span>
                                            </div>
                                            <SpecField label="Resolution" value={`${mergedSpecs.screen_resolution_x} x ${mergedSpecs.screen_resolution_y}`} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <SpecField label="Refresh Rate" value={mergedSpecs.refresh_rate_hz} unit="Hz" highlight />
                                                <SpecField label="Brightness" value={mergedSpecs.brightness_nits} unit="nits" />
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <TechBadge label="TOUCHSCREEN" active={mergedSpecs.touchscreen} />
                                                {mergedSpecs.display_tech && <span className="text-[9px] font-mono text-gray-500 border border-gray-800 px-1">{mergedSpecs.display_tech}</span>}
                                            </div>
                                        </div>

                                        {mergedSpecs.second_screen_size && (
                                            <div className="space-y-3 border-l border-white/5 pl-4">
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
                                    </div>
                                </SpecCard>
                            ) : null}

                            {/* INPUT & CONTROLS */}
                            {hasData(SECTIONS.INPUT, mergedSpecs) ? (
                                <SpecCard title="INPUT & CONTROLS">
                                    {mergedSpecs.variant_input_profile ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Left Column: Dpad & Face */}
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <SpecField label="D-pad shape" value={formatInputEnum('rc_dpad_shape', mergedSpecs.variant_input_profile.dpad_shape)} small />
                                                        <SpecField label="D-pad tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.dpad_tech)} small />
                                                    </div>
                                                    {mergedSpecs.variant_input_profile.dpad_placement && (
                                                        <SpecField label="D-pad placement" value={formatInputEnum('rc_placement', mergedSpecs.variant_input_profile.dpad_placement)} small />
                                                    )}
                                                </div>

                                                <div className="pt-2 border-t border-white/5">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <SpecField label="Face buttons" value={mergedSpecs.variant_input_profile.face_button_count} small />
                                                        <SpecField label="Face button tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.face_button_tech)} small />
                                                    </div>
                                                    <div className="mt-1">
                                                        <SpecField label="Button labels" value={formatInputEnum('rc_label_scheme', mergedSpecs.variant_input_profile.face_label_scheme)} small />
                                                    </div>
                                                </div>

                                                {(mergedSpecs.variant_input_profile.stick_count !== undefined && mergedSpecs.variant_input_profile.stick_count !== null) && (
                                                    <div className="pt-2 border-t border-white/5">
                                                        <div className="text-[9px] text-gray-500 uppercase mb-1">Analog sticks ({mergedSpecs.variant_input_profile.stick_count})</div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <SpecField label="Stick layout" value={formatInputEnum('rc_stick_layout', mergedSpecs.variant_input_profile.stick_layout)} small />
                                                            <SpecField label="Stick tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.stick_tech)} small />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 mt-1">
                                                            <SpecField label="Stick cap" value={formatInputEnum('rc_stick_cap', mergedSpecs.variant_input_profile.stick_cap)} small />
                                                            <div className="flex items-center">
                                                                <span className="font-mono text-[10px] text-gray-500 uppercase mr-2">Stick clicks</span>
                                                                <TechBadge label="YES" active={mergedSpecs.variant_input_profile.stick_clicks} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Column: Triggers & Extras */}
                                            <div className="space-y-4">
                                                <div>
                                                    <SpecField label="Bumper tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.bumper_tech)} small />
                                                    <div className="grid grid-cols-2 gap-4 mt-1">
                                                        <SpecField label="Trigger type" value={formatInputEnum('rc_trigger_type', mergedSpecs.variant_input_profile.trigger_type)} small />
                                                        <SpecField label="Trigger tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.trigger_tech)} small />
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-white/5">
                                                    {mergedSpecs.variant_input_profile.back_button_count && mergedSpecs.variant_input_profile.back_button_count > 0 ? (
                                                        <SpecField label="Back buttons" value={mergedSpecs.variant_input_profile.back_button_count} small />
                                                    ) : null}

                                                    {mergedSpecs.variant_input_profile.has_gyro === true && (
                                                        <div className="flex items-center justify-between py-1 border-b border-white/5 mb-2">
                                                            <span className="font-mono text-[10px] text-gray-500 uppercase">Gyro</span>
                                                            <TechBadge label="ENABLED" active={true} />
                                                        </div>
                                                    )}

                                                    {mergedSpecs.variant_input_profile.has_keyboard === true && (
                                                        <div className="flex items-center justify-between py-1 border-b border-white/5 mb-2">
                                                            <span className="font-mono text-[10px] text-gray-500 uppercase">Keyboard</span>
                                                            <TechBadge label="YES" active={true} />
                                                        </div>
                                                    )}

                                                    {mergedSpecs.variant_input_profile.touchpad_count && mergedSpecs.variant_input_profile.touchpad_count > 0 ? (
                                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                                            <SpecField label="Touchpads" value={mergedSpecs.variant_input_profile.touchpad_count} small />
                                                            {mergedSpecs.variant_input_profile.touchpad_clickable !== null && (
                                                                <div className="flex items-center">
                                                                    <span className="font-mono text-[10px] text-gray-500 uppercase mr-2">Clicks</span>
                                                                    <TechBadge label="YES" active={mergedSpecs.variant_input_profile.touchpad_clickable} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="opacity-50 text-xs font-mono text-gray-500 text-center py-4">No Input Profile Data</div>
                                    )}
                                </SpecCard>
                            ) : null}

                            {/* CONNECTIVITY & POWER */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hasData(SECTIONS.CONNECTIVITY, mergedSpecs) ? (
                                    <SpecCard title="CONNECTIVITY">
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
                                ) : null}

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

                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <SpecField label="Dimensions" value={getDimString()} small />
                                            <SpecField label="Weight" value={mergedSpecs.weight_g} unit="g" small />
                                            <SpecField label="Material" value={mergedSpecs.body_material} small />
                                        </div>
                                    </SpecCard>
                                ) : null}
                            </div>
                        </div>

                    </div>
                </div>
             </div>
        </div>
    );
};

export default ConsoleDetailView;
