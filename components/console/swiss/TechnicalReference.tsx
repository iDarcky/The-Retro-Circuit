
'use client';

import { ConsoleSpecs, ConsoleVariant } from '../../../lib/types';
import { formatInputEnum } from '../../../lib/utils/formatters';

import { createContext, useContext } from 'react';
const TechViewContext = createContext<'grid' | 'table' | 'ribbon'>('grid');

interface TechnicalReferenceProps {
    viewMode?: 'grid' | 'table' | 'ribbon';
    mergedSpecs: Partial<ConsoleSpecs> & Partial<ConsoleVariant>;
}


const SpecRow = ({ label, value, unit }: { label: string, value: string | number | undefined | null | React.ReactNode, unit?: string | null }) => {
    const viewMode = useContext(TechViewContext);
    if (value === undefined || value === null || value === '') return null;

    if (viewMode === 'ribbon') {
        return (
            <div className="flex flex-col border-r border-white/10 px-4 min-w-max last:border-r-0 hover:bg-white/[0.04] transition-colors justify-center py-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-end">{label}</span>
                <span className="font-mono text-sm text-white break-words">
                    {value} {unit && <span className="text-xs font-mono text-gray-500 ml-0.5">{unit}</span>}
                </span>
            </div>
        );
    }

    if (viewMode === 'table') {
        return (
            <tr className="border-b border-white/10 hover:bg-white/[0.04] transition-colors last:border-b-0 odd:bg-white/[0.02] even:bg-transparent">
                <td className="py-2.5 pr-6 pl-4 text-xs text-gray-400 uppercase tracking-wider bg-white/[0.02] border-r border-white/10 align-top w-1/3 min-w-[140px]">{label}</td>
                <td className="py-2.5 pl-4 pr-4 font-mono text-sm text-white align-top">
                    {value} {unit && <span className="text-xs text-gray-500 ml-1">{unit}</span>}
                </td>
            </tr>
        );
    }

    return (
        <div className="flex flex-row items-baseline justify-between border-b border-white/5 py-2.5 px-2 last:border-0 hover:bg-white/[0.04] odd:bg-white/[0.02] even:bg-transparent transition-colors">
            <span className="text-xs text-gray-500 uppercase tracking-wider pr-4">{label}</span>
            <span className="font-mono text-sm text-white text-right break-words max-w-[60%]">
                {value} {unit && <span className="text-xs font-mono text-gray-500 ml-0.5">{unit}</span>}
            </span>
        </div>
    );
};


const SpecSection = ({ title, children, colorClass = "text-orange-500 border-orange-500/20" }: { title: string, children: React.ReactNode, colorClass?: string }) => {
    const viewMode = useContext(TechViewContext);

    if (viewMode === 'ribbon') {
        return (
            <div className="flex flex-col w-full border-x border-b border-white/10 bg-black/40 first:border-t first:rounded-t-sm last:rounded-b-sm overflow-hidden">
                <h3 className={`font-pixel text-[10px] uppercase tracking-widest px-4 py-3 bg-white/[0.02] border-b m-0 ${colorClass}`}>
                    {title}
                </h3>
                <div className="flex flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {children}
                </div>
            </div>
        );
    }

    if (viewMode === 'table') {
        return (
            <>
                <tr>
                    <td colSpan={2} className={`font-pixel text-[10px] uppercase tracking-widest px-4 py-3 bg-white/[0.02] border-b border-t border-t-white/10 m-0 ${colorClass}`}>
                        <span className={`${colorClass.split(" ")[0]}`}>{title}</span>
                    </td>
                </tr>
                {children}
            </>
        );
    }

    return (
        <div className="mb-8 break-inside-avoid border border-white/5 bg-black/20 rounded-sm p-4 hover:border-white/20 transition-colors shadow-xl">
            <h3 className={`font-pixel text-xs uppercase tracking-widest mb-4 border-b pb-2 ${colorClass}`}>
                {title}
            </h3>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    );
};

// `os_family` + `os_version` are the structured truth; `os` is the display
// string. Where `os` adds nothing over the two ("Android 13"), prefer the
// structured pair — but keep `os` when it carries a distro or a dual boot
// ("Linux (RetroPie)", "Windows 11 / SteamOS", "OpenDingux").
// Clusters render one line each. "Cortex-A76 / Cortex-A55  2x / 6x" interleaved two
// facts and read as neither.
const formatClusters = (clusters: any): React.ReactNode | null => {
    if (!Array.isArray(clusters) || clusters.length === 0) return null;
    const lines = clusters
        .filter(c => c && (c.core || c.count))
        .map((c, i) => {
            const head = [c.count ? `${c.count} \u00d7` : null, c.core].filter(Boolean).join(' ');
            const clock = c.clock_mhz
                ? (c.clock_mhz >= 1000 ? `${(c.clock_mhz / 1000).toFixed(2).replace(/\.?0+$/, '')} GHz` : `${c.clock_mhz} MHz`)
                : null;
            return (
                <span key={i} className="block">
                    {head}
                    {clock && <em className="not-italic text-gray-500"> @ {clock}</em>}
                </span>
            );
        });
    return lines.length > 0 ? <>{lines}</> : null;
};

const TITLE_CASE: Record<string, string> = {
    passive: 'Passive', active: 'Active', hybrid: 'Hybrid',
    mono: 'Mono', stereo: 'Stereo', surround: 'Surround',
    front: 'Front-facing', bottom: 'Bottom-firing', rear: 'Rear-facing',
    top: 'Top-firing', side: 'Side-firing', front_side: 'Front & side', internal: 'Internal',
    usb_c: 'USB-C', micro_usb: 'Micro USB', mini_usb: 'Mini USB',
    barrel_dc: 'DC barrel', proprietary: 'Proprietary', none: 'None',
    microsd: 'microSD', sd: 'SD', memory_stick: 'Memory Stick', cfexpress: 'CFexpress',
    tempered_glass: 'Tempered glass', gorilla_glass: 'Gorilla Glass', plastic: 'Plastic',
    multiple: 'Multiple', back: 'Back',
};
const label = (v: any): string | null => (v ? (TITLE_CASE[String(v)] ?? String(v)) : null);

// "Active — 1 fan, heatpipe, vents" out of the structured columns, falling back to the
// original free text for rows the backfill could not read.
const formatCooling = (s: any): string | null => {
    if (!s.cooling_type) return s.cooling_solution || null;
    const parts: string[] = [];
    if (s.cooling_fan_count > 0) parts.push(`${s.cooling_fan_count} fan${s.cooling_fan_count > 1 ? 's' : ''}`);
    if (s.cooling_vapor_chamber) parts.push('vapor chamber');
    if (s.cooling_heatpipe) parts.push('heatpipe');
    if (s.cooling_heatsink) parts.push('heatsink');
    if (s.cooling_vents) parts.push('vents');
    return parts.length > 0 ? `${label(s.cooling_type)} \u2014 ${parts.join(', ')}` : label(s.cooling_type);
};

// "2 \u00d7 stereo, front-facing" — one standard phrasing for what was 48 spellings.
const formatSpeakers = (s: any): string | null => {
    if (!s.speaker_config && !s.speaker_count) return s.audio_speakers || null;
    const head = [s.speaker_count ? `${s.speaker_count} \u00d7` : null, label(s.speaker_config)?.toLowerCase()]
        .filter(Boolean).join(' ');
    const place = label(s.speaker_placement)?.toLowerCase();
    return [head || null, place].filter(Boolean).join(', ') || null;
};

const formatChargePort = (s: any): string | null => {
    if (!s.charge_port) return null;
    const head = s.charge_port_count > 1 ? `${s.charge_port_count} \u00d7 ${label(s.charge_port)}` : label(s.charge_port);
    const pos = s.charge_port_position ? `${label(s.charge_port_position)?.toLowerCase()}` : null;
    return [head, pos].filter(Boolean).join(', ');
};

const formatExpansion = (s: any): string | null => {
    if (!s.expansion_card_type) return s.microsd_type || null;
    const head = s.expansion_slot_count > 1
        ? `${s.expansion_slot_count} \u00d7 ${label(s.expansion_card_type)}`
        : label(s.expansion_card_type);
    return [head, s.expansion_speed_class].filter(Boolean).join(' \u00b7 ');
};

const formatLens = (s: any): string | null => {
    if (!s.lens_material) return s.screen_lens || null;
    return s.lens_laminated ? `${label(s.lens_material)} (OCA laminated)` : label(s.lens_material);
};

const formatSoc = (s: any): string | null => {
    const built = [s.soc_vendor, s.soc_name, s.soc_gen].filter(Boolean).join(' ');
    return built || s.soc || null;
};

const formatGpu = (s: any): string | null => {
    const built = [s.gpu_vendor, s.gpu_name].filter(Boolean).join(' ');
    return built || s.gpu_model || null;
};

const formatOs = (specs: any): string | null => {
    const family = specs.os_family ? String(specs.os_family) : '';
    const version = specs.os_version ? String(specs.os_version) : '';
    const free = specs.os ? String(specs.os).trim() : '';

    const structured = [family, version].filter(Boolean).join(' ');
    if (!free) return structured || null;
    if (!structured) return free;

    const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, '');
    return norm(free) === norm(structured)
        ? free.charAt(0).toUpperCase() + free.slice(1)
        : free;
};

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

    const formatRam = () => {
        if (!mergedSpecs.ram_mb) return null;
        if (mergedSpecs.ram_mb >= 1024) {
            return { val: parseFloat((mergedSpecs.ram_mb / 1024).toFixed(2)), unit: 'GB' };
        }
        return { val: mergedSpecs.ram_mb, unit: 'MB' };
    };
    const ramData = formatRam();

    const formatCpuClock = (min?: number, max?: number) => {
        if (!max && !min) return { value: null, unit: null };
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

    const formatColors = (colors: string | string[] | undefined) => {
        if (!colors) return null;
        if (Array.isArray(colors)) return colors.join(', ');
        return colors;
    };

    const SECTIONS = {
        // Section order and membership mirror VARIANT_FORM_GROUPS one for one, so a field
        // you fill in under a heading in the admin appears under the same heading here.
        PLATFORM: ['os', 'os_family', 'os_version', 'ui_skin', 'model_no'],
        SILICON: ['soc', 'soc_vendor', 'soc_name', 'cpu_model', 'cpu_clusters', 'cpu_architecture', 'cpu_process_node', 'cpu_cores', 'cpu_threads', 'cpu_clock_max_mhz', 'gpu_model', 'gpu_vendor', 'gpu_name', 'gpu_architecture', 'gpu_cores', 'gpu_compute_units', 'gpu_clock_mhz', 'gpu_teraflops', 'benchmark_score', 'performance_grade'],
        MEMORY: ['ram_mb', 'ram_type', 'ram_speed_mhz', 'storage_gb', 'storage_type', 'storage_expandable'],
        DISPLAY: ['screen_size_inch', 'screen_resolution_x', 'display_type', 'display_tech', 'refresh_rate_hz', 'brightness_nits', 'touchscreen', 'aspect_ratio', 'ppi', 'second_screen_size', 'second_screen_touch', 'second_screen_ppi', 'second_screen_aspect_ratio', 'second_screen_refresh_rate', 'second_screen_nits'],
        INPUT: ['variant_input_profile'],
        CONNECTIVITY: ['wifi_specs', 'bluetooth_specs', 'other_connectivity', 'cellular_connectivity', 'video_out'],
        POWER: ['battery_capacity_mah', 'battery_capacity_wh', 'battery_type', 'charging_speed_w', 'tdp_wattage', 'charging_tech', 'charge_port', 'cooling_solution', 'cooling_type'],
        CHASSIS: ['width_mm', 'height_mm', 'depth_mm', 'weight_g', 'body_material', 'available_colors', 'ports'],
        AUDIO: ['audio_speakers', 'speaker_config', 'has_headphone_jack', 'has_microphone', 'biometrics', 'camera_specs', 'sensors']
    };

    const content = (
        <TechViewContext.Provider value={viewMode}>
            {/* PLATFORM / OS */}
            {hasData(SECTIONS.PLATFORM, mergedSpecs) && (
                <SpecSection title="Platform" colorClass="text-orange-500 border-orange-500/20">
                    <SpecRow label="OS / Firmware" value={formatOs(mergedSpecs)} />
                    <SpecRow label="UI Skin" value={mergedSpecs.ui_skin} />
                    <SpecRow label="Model No" value={mergedSpecs.model_no} />
                </SpecSection>
            )}

            {/* SILICON */}
            {hasData(SECTIONS.SILICON, mergedSpecs) && (
                <SpecSection title="Silicon" colorClass="text-orange-500 border-orange-500/20">
                    <SpecRow label="SoC / Chipset" value={formatSoc(mergedSpecs)} />
                    <SpecRow label="CPU" value={formatClusters(mergedSpecs.cpu_clusters) ?? mergedSpecs.cpu_model} />
                    <SpecRow label="CPU Arch" value={mergedSpecs.cpu_arch} />
                    <SpecRow label="Architecture" value={mergedSpecs.cpu_architecture} />
                    <SpecRow label="Process Node" value={mergedSpecs.cpu_process_node} />
                    <SpecRow label="CPU Cores" value={mergedSpecs.cpu_cores} />
                    <SpecRow label="CPU Threads" value={mergedSpecs.cpu_threads} />
                    <SpecRow label="CPU Clock" value={cpuClockData.value} unit={cpuClockData.unit} />
                    <SpecRow label="GPU" value={formatGpu(mergedSpecs)} />
                    <SpecRow label="GPU Driver" value={mergedSpecs.gpu_driver} />
                    <SpecRow label="Vulkan" value={mergedSpecs.vulkan_support} />
                    <SpecRow label="GPU Arch" value={mergedSpecs.gpu_architecture} />
                    <SpecRow label="GPU Cores" value={mergedSpecs.gpu_cores} />
                    <SpecRow label="Compute Units" value={mergedSpecs.gpu_compute_units} />
                    <SpecRow label="GPU Clock" value={mergedSpecs.gpu_clock_mhz} unit="MHz" />
                    <SpecRow label="GPU Perf" value={mergedSpecs.gpu_teraflops} unit="TFLOPS" />
                    <SpecRow label="Benchmark" value={mergedSpecs.benchmark_score} />
                    <SpecRow label="Performance Rating" value={mergedSpecs.performance_grade} />
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
                    <SpecRow label="Card Slot" value={formatExpansion(mergedSpecs)} />
                </SpecSection>
            )}

            {/* DISPLAY */}
            {hasData(SECTIONS.DISPLAY, mergedSpecs) && (
                <SpecSection title="Display" colorClass="text-cyan-500 border-cyan-500/20">
                    <SpecRow label="Size" value={mergedSpecs.screen_size_inch} unit='"' />
                    <SpecRow label="Resolution" value={`${mergedSpecs.screen_resolution_x} x ${mergedSpecs.screen_resolution_y}`} />
                    <SpecRow label="Panel Type" value={mergedSpecs.display_type} />
                    <SpecRow label="Technology" value={mergedSpecs.display_tech} />
                    <SpecRow label="Refresh Rate" value={mergedSpecs.refresh_rate_hz} unit="Hz" />
                    <SpecRow label="Brightness" value={mergedSpecs.brightness_nits} unit="nits" />
                    <SpecRow label="Touchscreen" value={mergedSpecs.touchscreen ? 'YES' : 'NO'} />
                    <SpecRow label="Aspect Ratio" value={mergedSpecs.aspect_ratio} />
                    <SpecRow label="PPI" value={mergedSpecs.ppi} />
                    <SpecRow label="Screen Lens" value={formatLens(mergedSpecs)} />
                    {mergedSpecs.second_screen_size && (
                        <>
                             {viewMode === 'grid' && <div className="py-2 border-b border-white/10 text-[10px] font-mono text-gray-500 uppercase mt-2">Secondary Display</div>}
                             <SpecRow label="Size 2" value={mergedSpecs.second_screen_size} unit='"' />
                             <SpecRow label="Res 2" value={`${mergedSpecs.second_screen_resolution_x} x ${mergedSpecs.second_screen_resolution_y}`} />
                             <SpecRow label="Panel 2" value={mergedSpecs.second_screen_display_type} />
                             <SpecRow label="Technology 2" value={mergedSpecs.second_screen_tech} />
                             <SpecRow label="Lens 2" value={mergedSpecs.second_screen_lens} />
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
                <SpecSection title="Input" colorClass="text-violet-500 border-violet-500/20">
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
                            <SpecRow label="Stick Pos" value={formatInputEnum('rc_placement', mergedSpecs.variant_input_profile.stick_placement)} />
                            <SpecRow label="Stick Tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.stick_tech)} />
                            <SpecRow label="Stick Clicks" value={mergedSpecs.variant_input_profile.stick_clicks ? 'YES' : 'NO'} />
                            <SpecRow label="Stick Cap" value={formatInputEnum('rc_stick_cap', mergedSpecs.variant_input_profile.stick_cap)} />
                            <SpecRow label="Triggers" value={formatInputEnum('rc_trigger_type', mergedSpecs.variant_input_profile.trigger_type)} />
                            <SpecRow label="Trigger Tech" value={formatInputEnum('rc_button_tech', mergedSpecs.variant_input_profile.trigger_tech)} />
                            <SpecRow label="Trigger Layout" value={formatInputEnum('rc_trigger_layout', mergedSpecs.variant_input_profile.trigger_layout)} />
                            <SpecRow label="Bumpers" value={formatInputEnum('rc_trigger_type', mergedSpecs.variant_input_profile.bumper_type)} />
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
                        <div className="text-xs font-mono text-gray-600 py-2 px-4">[ NO INPUT DATA ]</div>
                    )}
                </SpecSection>
            )}

            {/* CONNECTIVITY */}
            {hasData(SECTIONS.CONNECTIVITY, mergedSpecs) && (
                <SpecSection title="Connectivity" colorClass="text-yellow-500 border-yellow-500/20">
                    <SpecRow label="Wi-Fi" value={mergedSpecs.wifi_specs} />
                    <SpecRow label="Bluetooth" value={mergedSpecs.bluetooth_specs} />
                    <SpecRow label="Cellular" value={mergedSpecs.cellular_connectivity ? 'YES' : 'NO'} />
                    <SpecRow label="Video Out" value={mergedSpecs.video_out} />
                    <SpecRow label="Other" value={mergedSpecs.other_connectivity} />
                </SpecSection>
            )}

            {/* POWER & CHASSIS */}
            {hasData(SECTIONS.POWER, mergedSpecs) && (
                <SpecSection title="Power & Thermals" colorClass="text-emerald-500 border-emerald-500/20">
                    <SpecRow label="Battery Cap" value={mergedSpecs.battery_capacity_mah} unit="mAh" />
                    <SpecRow label="Battery Energy" value={mergedSpecs.battery_capacity_wh} unit="Wh" />
                    <SpecRow label="Type" value={mergedSpecs.battery_type} />
                    <SpecRow label="Charge Port" value={formatChargePort(mergedSpecs)} />
                    <SpecRow label="Charging" value={mergedSpecs.charging_speed_w} unit="W" />
                    <SpecRow label="Charging Tech" value={mergedSpecs.charging_tech} />
                    <SpecRow label="TDP" value={mergedSpecs.tdp_wattage} unit="W" />
                    <SpecRow label="Cooling" value={formatCooling(mergedSpecs)} />
                </SpecSection>
            )}

            {/* CHASSIS */}
            {hasData(SECTIONS.CHASSIS, mergedSpecs) && (
                <SpecSection title="Chassis" colorClass="text-emerald-500 border-emerald-500/20">
                    <SpecRow label="Dimensions" value={getDimString()} unit="mm" />
                    <SpecRow label="Weight" value={mergedSpecs.weight_g} unit="g" />
                    <SpecRow label="Material" value={mergedSpecs.body_material} />
                    <SpecRow label="Colors" value={formatColors(mergedSpecs.available_colors)} />
                    <SpecRow label="Ports" value={mergedSpecs.ports} />
                </SpecSection>
            )}

            {/* AUDIO & EXTRAS */}
            {hasData(SECTIONS.AUDIO, mergedSpecs) && (
                <SpecSection title="Audio & Sensors" colorClass="text-pink-500 border-pink-500/20">
                    <SpecRow label="Speakers" value={formatSpeakers(mergedSpecs)} />
                    <SpecRow label="Audio Output" value={mergedSpecs.audio_tech} />
                    <SpecRow label="Sensors" value={mergedSpecs.sensors} />
                    <SpecRow label="Headphone Jack" value={mergedSpecs.has_headphone_jack ? 'YES' : 'NO'} />
                    <SpecRow label="Microphone" value={mergedSpecs.has_microphone ? 'YES' : 'NO'} />
                    <SpecRow label="Biometrics" value={mergedSpecs.biometrics} />
                    <SpecRow label="Camera" value={mergedSpecs.camera_specs} />
                </SpecSection>
            )}

        </TechViewContext.Provider>
    );

    if (viewMode === 'table') {
        return (
            <div className="overflow-x-auto w-full border border-white/10 rounded-sm bg-[#09090b]">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <tbody>
                        {content}
                    </tbody>
                </table>
            </div>
        );
    }

    if (viewMode === 'ribbon') {
        return (
            <div className="flex flex-col rounded-sm overflow-hidden">
                {content}
            </div>
        );
    }

    // Default Grid (Masonry Columns)
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pb-12">
            {content}
        </div>
    );
}
