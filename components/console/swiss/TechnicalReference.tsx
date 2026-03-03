'use client';

import { ConsoleSpecs, ConsoleVariant } from '../../../lib/types';
import { formatInputEnum } from '../../../lib/utils/formatters';

import { createContext, useContext } from 'react';
const TechViewContext = createContext<'grid' | 'table' | 'ribbon'>('grid');


interface TechnicalReferenceProps {
    viewMode?: 'grid' | 'table' | 'ribbon';
    mergedSpecs: Partial<ConsoleSpecs> & Partial<ConsoleVariant>;
}





const SpecRow = ({ label, value, unit }: { label: string, value: string | number | undefined | null | React.ReactNode, unit?: string }) => {
    const viewMode = useContext(TechViewContext);
    if (value === undefined || value === null || value === '') return null;

    if (viewMode === 'ribbon') {
        return (
            <div className="flex flex-col border-r border-white/10 px-4 min-w-max last:border-r-0 hover:bg-white/[0.04] transition-colors justify-center py-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-end">{label}</span>
                <span className="font-mono text-xs text-white break-words">
                    {value} {unit && <span className="text-xs font-mono text-gray-500 ml-0.5">{unit}</span>}
                </span>
            </div>
        );
    }

    if (viewMode === 'table') {
        return (
            <div className="flex flex-row items-center border border-white/10 bg-[#09090b] hover:bg-white/[0.04] transition-colors w-max overflow-hidden">
                <span className="px-3 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-white/[0.02] border-r border-white/10">{label}</span>
                <span className="px-3 py-1.5 font-mono text-xs text-white">
                    {value} {unit && <span className="text-xs text-gray-500 ml-1">{unit}</span>}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-row items-baseline gap-2 w-max py-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider after:content-[':'] after:ml-0.5">{label}</span>
            <span className="font-mono text-xs text-white break-words">
                {value} {unit && <span className="text-xs font-mono text-gray-500 ml-0.5">{unit}</span>}
            </span>
        </div>
    );
};









const SpecSection = ({ title, children, colorClass = "text-orange-500 border-orange-500/20" }: { title: string, children: React.ReactNode, colorClass?: string }) => {
    const viewMode = useContext(TechViewContext);

    if (viewMode === 'ribbon') {
        return (
            <div className="flex flex-col w-full border border-white/10 bg-black/40 border-t-0 first:border-t first:rounded-t-sm last:rounded-b-sm overflow-hidden -mt-[1px]">
                <div className="flex flex-row">
                    <h3 className={`font-pixel text-[10px] uppercase tracking-widest px-4 py-3 bg-white/[0.02] border-r border-white/10 m-0 w-[160px] shrink-0 flex items-center justify-start ${colorClass}`}>
                        {title}
                    </h3>
                    <div className="flex flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1">
                        {children}
                    </div>
                </div>
            </div>
        );
    }

    if (viewMode === 'table') {
        return (
            <div className="mb-8">
                <h3 className={`font-pixel text-[10px] uppercase tracking-widest mb-4 border-b pb-2 inline-block ${colorClass}`}>
                    {title}
                </h3>
                <div className="flex flex-wrap gap-3">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8 break-inside-avoid">
            <h3 className={`font-pixel text-xs uppercase tracking-widest mb-4 border-b pb-2 ${colorClass}`}>
                {title}
            </h3>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
                {children}
            </div>
        </div>
    );
};





// Helper to check if a section has any data (simplified)
const hasData = (keys: string[], specs: any): boolean => {
    if (!specs) return false;
    return keys.some(key => {
        if (key === 'variant_input_profile') return !!specs.variant_input_profile;
        const val = specs[key];
        return val !== null && val !== undefined && val !== '';
    });
};

export default function TechnicalReference({ mergedSpecs, viewMode = 'grid' }: TechnicalReferenceProps) {

    // --- FORMATTERS ---
    const getDimString = () => {
        if (mergedSpecs.width_mm && mergedSpecs.height_mm && mergedSpecs.depth_mm) {
            return `${mergedSpecs.width_mm} x ${mergedSpecs.height_mm} x ${mergedSpecs.depth_mm}`;
        }
        return null;
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

    // Color formatter
    const formatColors = (colors: string | string[] | undefined) => {
        if (!colors) return null;
        if (Array.isArray(colors)) return colors.join(', ');
        return colors;
    };

    const SECTIONS = {
        SILICON: ['os', 'ui_skin', 'model_no', 'cpu_model', 'cpu_architecture', 'cpu_process_node', 'cpu_cores', 'cpu_threads', 'cpu_clock_max_mhz', 'gpu_model', 'gpu_architecture', 'gpu_cores', 'gpu_compute_units', 'gpu_clock_mhz', 'gpu_teraflops'],
        MEMORY: ['ram_mb', 'ram_type', 'ram_speed_mhz', 'storage_gb', 'storage_type', 'storage_expandable'],
        DISPLAY: ['screen_size_inch', 'screen_resolution_x', 'display_type', 'display_tech', 'refresh_rate_hz', 'brightness_nits', 'touchscreen', 'aspect_ratio', 'ppi', 'second_screen_size', 'second_screen_touch', 'second_screen_ppi', 'second_screen_aspect_ratio', 'second_screen_refresh_rate', 'second_screen_nits'],
        INPUT: ['variant_input_profile', 'input_layout', 'dpad_mechanism', 'thumbstick_mechanism', 'trigger_mechanism', 'haptics'],
        CONNECTIVITY: ['wifi_specs', 'bluetooth_specs', 'other_connectivity', 'cellular_connectivity', 'video_out', 'ports'],
        POWER: ['battery_capacity_mah', 'battery_capacity_wh', 'battery_type', 'charging_speed_w', 'tdp_wattage', 'charging_tech', 'cooling_solution', 'width_mm', 'weight_g', 'body_material', 'available_colors'],
        AUDIO: ['audio_speakers', 'has_headphone_jack', 'has_microphone', 'biometrics', 'camera_specs']
    };

    return (
        <TechViewContext.Provider value={viewMode}>
        <div className={
            viewMode === 'ribbon' ? "flex flex-col rounded-sm overflow-hidden" :
            viewMode === 'table' ? "flex flex-col" :
            "columns-1 md:columns-2 gap-12"
        }>

             {/* SILICON CORE */}
             {hasData(SECTIONS.SILICON, mergedSpecs) && (
                <SpecSection title="Silicon Architecture" colorClass="text-orange-500 border-orange-500/20">
                    <SpecRow label="OS / Firmware" value={mergedSpecs.os} />
                    <SpecRow label="UI Skin" value={mergedSpecs.ui_skin} />
                    <SpecRow label="Model No" value={mergedSpecs.model_no} />
                    <SpecRow label="CPU Model" value={mergedSpecs.cpu_model} />
                    <SpecRow label="Architecture" value={mergedSpecs.cpu_architecture} />
                    <SpecRow label="Process Node" value={mergedSpecs.cpu_process_node} />
                    <SpecRow label="CPU Cores" value={mergedSpecs.cpu_cores} />
                    <SpecRow label="CPU Threads" value={mergedSpecs.cpu_threads} />
                    <SpecRow label="CPU Clock" value={cpuClockData.value} unit={cpuClockData.unit} />
                    <SpecRow label="GPU Model" value={mergedSpecs.gpu_model} />
                    <SpecRow label="GPU Arch" value={mergedSpecs.gpu_architecture} />
                    <SpecRow label="GPU Cores" value={mergedSpecs.gpu_cores} />
                    <SpecRow label="Compute Units" value={mergedSpecs.gpu_compute_units} />
                    <SpecRow label="GPU Clock" value={mergedSpecs.gpu_clock_mhz} unit="MHz" />
                    <SpecRow label="GPU Perf" value={mergedSpecs.gpu_teraflops} unit="TFLOPS" />
                </SpecSection>
            )}

            {/* MEMORY & STORAGE */}
            {hasData(SECTIONS.MEMORY, mergedSpecs) && (
                <SpecSection title="Memory & Storage" colorClass="text-blue-400 border-blue-400/20">
                    <SpecRow label="RAM" value={ramData?.val} unit={ramData?.unit} />
                    <SpecRow label="RAM Type" value={mergedSpecs.ram_type} />
                    <SpecRow label="RAM Speed" value={mergedSpecs.ram_speed_mhz} unit="MHz" />
                    <SpecRow label="Storage" value={mergedSpecs.storage_gb} unit="GB" />
                    <SpecRow label="Storage Type" value={mergedSpecs.storage_type} />
                    <SpecRow label="Expandable" value={mergedSpecs.storage_expandable ? 'YES' : 'NO'} />
                </SpecSection>
            )}

            {/* DISPLAY */}
            {hasData(SECTIONS.DISPLAY, mergedSpecs) && (
                <SpecSection title="Display Matrix" colorClass="text-cyan-500 border-cyan-500/20">
                    <SpecRow label="Size" value={mergedSpecs.screen_size_inch} unit='"' />
                    <SpecRow label="Resolution" value={`${mergedSpecs.screen_resolution_x} x ${mergedSpecs.screen_resolution_y}`} />
                    <SpecRow label="Panel Type" value={mergedSpecs.display_type} />
                    <SpecRow label="Technology" value={mergedSpecs.display_tech} />
                    <SpecRow label="Refresh Rate" value={mergedSpecs.refresh_rate_hz} unit="Hz" />
                    <SpecRow label="Brightness" value={mergedSpecs.brightness_nits} unit="nits" />
                    <SpecRow label="Touchscreen" value={mergedSpecs.touchscreen ? 'YES' : 'NO'} />
                    <SpecRow label="Aspect Ratio" value={mergedSpecs.aspect_ratio} />
                    <SpecRow label="PPI" value={mergedSpecs.ppi} />
                    {mergedSpecs.second_screen_size && (
                        <>
                             <div className="py-2 border-b border-white/10 text-[10px] font-mono text-gray-500 uppercase mt-2">Secondary Display</div>
                             <SpecRow label="Size 2" value={mergedSpecs.second_screen_size} unit='"' />
                             <SpecRow label="Res 2" value={`${mergedSpecs.second_screen_resolution_x} x ${mergedSpecs.second_screen_resolution_y}`} />
                             <SpecRow label="Touch 2" value={mergedSpecs.second_screen_touch ? 'YES' : 'NO'} />
                             <SpecRow label="Aspect Ratio 2" value={mergedSpecs.second_screen_aspect_ratio} />
                             <SpecRow label="PPI 2" value={mergedSpecs.second_screen_ppi} />
                             <SpecRow label="Refresh 2" value={mergedSpecs.second_screen_refresh_rate} unit="Hz" />
                             <SpecRow label="Brightness 2" value={mergedSpecs.second_screen_nits} unit="nits" />
                        </>
                    )}
                </SpecSection>
            )}

            {/* INPUT */}
            {hasData(SECTIONS.INPUT, mergedSpecs) && (
                <SpecSection title="Input Interface" colorClass="text-violet-500 border-violet-500/20">
                    {mergedSpecs.variant_input_profile ? (
                        <>
                            <SpecRow label="D-Pad Shape" value={formatInputEnum('rc_dpad_shape', mergedSpecs.variant_input_profile.dpad_shape)} />
                            <SpecRow label="D-Pad Tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.dpad_tech)} />
                            <SpecRow label="D-Pad Pos" value={formatInputEnum('rc_placement', mergedSpecs.variant_input_profile.dpad_placement)} />
                            <SpecRow label="Face Buttons" value={mergedSpecs.variant_input_profile.face_button_count} />
                            <SpecRow label="Face Tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.face_button_tech)} />
                            <SpecRow label="Face Labels" value={formatInputEnum('rc_label_scheme', mergedSpecs.variant_input_profile.face_label_scheme)} />
                            <SpecRow label="Sticks" value={mergedSpecs.variant_input_profile.stick_count} />
                            <SpecRow label="Stick Layout" value={formatInputEnum('rc_stick_layout', mergedSpecs.variant_input_profile.stick_layout)} />
                            <SpecRow label="Stick Tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.stick_tech)} />
                            <SpecRow label="Stick Clicks" value={mergedSpecs.variant_input_profile.stick_clicks ? 'YES' : 'NO'} />
                            <SpecRow label="Stick Cap" value={formatInputEnum('rc_stick_cap', mergedSpecs.variant_input_profile.stick_cap)} />
                            <SpecRow label="Triggers" value={formatInputEnum('rc_trigger_type', mergedSpecs.variant_input_profile.trigger_type)} />
                            <SpecRow label="Trigger Tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.trigger_tech)} />
                            <SpecRow label="Trigger Layout" value={formatInputEnum('rc_trigger_layout', mergedSpecs.variant_input_profile.trigger_layout)} />
                            <SpecRow label="Bumper Tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.bumper_tech)} />
                            <SpecRow label="Back Buttons" value={mergedSpecs.variant_input_profile.back_button_count} />
                            <SpecRow label="System Buttons" value={formatInputEnum('rc_system_button_set', mergedSpecs.variant_input_profile.system_button_set)} />
                            <SpecRow label="System Labels" value={mergedSpecs.variant_input_profile.system_buttons_text} />
                            <SpecRow label="Gyro" value={mergedSpecs.variant_input_profile.has_gyro ? 'YES' : 'NO'} />
                            <SpecRow label="Touchpads" value={mergedSpecs.variant_input_profile.touchpad_count} />
                            <SpecRow label="Pad Clicks" value={mergedSpecs.variant_input_profile.touchpad_clickable ? 'YES' : 'NO'} />
                            <SpecRow label="Keyboard" value={mergedSpecs.variant_input_profile.has_keyboard ? 'YES' : 'NO'} />
                            <SpecRow label="Confidence" value={formatInputEnum('rc_confidence', mergedSpecs.variant_input_profile.input_confidence)} />
                            {mergedSpecs.variant_input_profile.input_notes && <SpecRow label="Input Notes" value={mergedSpecs.variant_input_profile.input_notes} />}
                        </>
                    ) : (
                        <div className="text-xs font-mono text-gray-600 py-2">[ NO INPUT DATA ]</div>
                    )}
                     <SpecRow label="Haptics" value={mergedSpecs.haptics ? 'YES' : null} />
                </SpecSection>
            )}

            {/* CONNECTIVITY */}
            {hasData(SECTIONS.CONNECTIVITY, mergedSpecs) && (
                <SpecSection title="Connectivity" colorClass="text-yellow-500 border-yellow-500/20">
                    <SpecRow label="Wi-Fi" value={mergedSpecs.wifi_specs} />
                    <SpecRow label="Bluetooth" value={mergedSpecs.bluetooth_specs} />
                    <SpecRow label="Cellular" value={mergedSpecs.cellular_connectivity ? 'YES' : 'NO'} />
                    <SpecRow label="Video Out" value={mergedSpecs.video_out} />
                    <SpecRow label="Ports" value={mergedSpecs.ports} />
                    <SpecRow label="Other" value={mergedSpecs.other_connectivity} />
                </SpecSection>
            )}

            {/* POWER & CHASSIS */}
            {hasData(SECTIONS.POWER, mergedSpecs) && (
                <SpecSection title="Power & Chassis" colorClass="text-emerald-500 border-emerald-500/20">
                    <SpecRow label="Battery Cap" value={mergedSpecs.battery_capacity_mah} unit="mAh" />
                    <SpecRow label="Battery Energy" value={mergedSpecs.battery_capacity_wh} unit="Wh" />
                    <SpecRow label="Type" value={mergedSpecs.battery_type} />
                    <SpecRow label="Charging" value={mergedSpecs.charging_speed_w} unit="W" />
                    <SpecRow label="TDP" value={mergedSpecs.tdp_wattage} unit="W" />
                    <SpecRow label="Cooling" value={mergedSpecs.cooling_solution} />
                    <SpecRow label="Dimensions" value={getDimString()} unit="mm" />
                    <SpecRow label="Weight" value={mergedSpecs.weight_g} unit="g" />
                    <SpecRow label="Material" value={mergedSpecs.body_material} />
                    <SpecRow label="Colors" value={formatColors(mergedSpecs.available_colors)} />
                </SpecSection>
            )}

            {/* AUDIO & EXTRAS */}
            {hasData(SECTIONS.AUDIO, mergedSpecs) && (
                <SpecSection title="Audio & Extras" colorClass="text-pink-500 border-pink-500/20">
                    <SpecRow label="Speakers" value={mergedSpecs.audio_speakers} />
                    <SpecRow label="Headphone Jack" value={mergedSpecs.has_headphone_jack ? 'YES' : 'NO'} />
                    <SpecRow label="Microphone" value={mergedSpecs.has_microphone ? 'YES' : 'NO'} />
                    <SpecRow label="Biometrics" value={mergedSpecs.biometrics} />
                    <SpecRow label="Camera" value={mergedSpecs.camera_specs} />
                </SpecSection>
            )}

        </div>
        </TechViewContext.Provider>
    );
}
