'use client';

import { ConsoleVariant, EmulationProfile } from '../../lib/types';
import { SYSTEM_TIERS, SCORE_MAP } from '../../lib/config/emulation';

interface MatchSummaryProps {
    variantA: ConsoleVariant;
    variantB: ConsoleVariant;
    profileA?: EmulationProfile | null;
    profileB?: EmulationProfile | null;
}

const formatDisplay = (v: ConsoleVariant): string => {
    // Priority: Size -> Refresh Rate (if present) -> Tech/Type OR Resolution
    // Goal: Keep it short (~28-32 chars)
    const parts: string[] = [];

    // 1. Size
    if (v.screen_size_inch) {
        parts.push(`${v.screen_size_inch}"`);
    }

    // 2. Refresh Rate (if > 60Hz or noteworthy, though "if present" is the rule)
    if (v.refresh_rate_hz) {
        parts.push(`${v.refresh_rate_hz}Hz`);
    }

    // 3. Tech OR Resolution
    // Prefer Tech (OLED, IPS, LTPS)
    // Fallback to Resolution (e.g. 1080p) if tech unknown
    // Or if tech is just "LCD", maybe resolution is better? Prompt says "Always show Display Tech... Fallback to Resolution".

    let thirdVal = '';

    // Tech normalization
    const tech = v.display_tech || v.display_type;
    if (tech) {
        // Simple mapping to keep it short
        if (tech.match(/oled/i)) thirdVal = 'OLED';
        else if (tech.match(/amoled/i)) thirdVal = 'AMOLED';
        else if (tech.match(/ips/i)) thirdVal = 'IPS';
        else if (tech.match(/ltps/i)) thirdVal = 'LTPS';
        else if (tech.match(/mini-led/i)) thirdVal = 'MiniLED';
        else if (tech.match(/lcd/i)) thirdVal = 'LCD';
        else thirdVal = tech; // truncated later if needed?
    }

    // Fallback to Resolution if no tech
    if (!thirdVal && v.screen_resolution_y) {
        if (v.screen_resolution_y >= 2160) thirdVal = '4K';
        else if (v.screen_resolution_y >= 1440) thirdVal = '1440p';
        else if (v.screen_resolution_y >= 1080) thirdVal = '1080p';
        else if (v.screen_resolution_y >= 720) thirdVal = '720p';
        else if (v.screen_resolution_y >= 480) thirdVal = '480p';
        else thirdVal = `${v.screen_resolution_y}p`;
    }

    if (thirdVal) parts.push(thirdVal);

    if (parts.length === 0) return '—';
    return parts.join(' · ');
};

const getMaxTier = (profile?: EmulationProfile | null): string => {
    if (!profile) return '—';

    let maxTier = 0;

    // Iterate through tiers
    for (let i = 0; i < SYSTEM_TIERS.length; i++) {
        const tier = SYSTEM_TIERS[i];
        const tierNum = i + 1;

        // Check if ANY system in this tier is Playable (score >= 3)
        const hasPlayable = tier.systems.some(sys => {
            const status = (profile as any)[sys.key];
            const score = SCORE_MAP[status] || 0;
            return score >= 3; // 3 = Playable
        });

        if (hasPlayable) {
            maxTier = tierNum;
        }
    }

    if (maxTier === 0) return '—';
    return `TIER ${maxTier}`;
};

const formatStorage = (v: ConsoleVariant): string => {
    if (!v.storage_gb) return '—';
    const type = v.storage_type ? ` ${v.storage_type}` : '';
    // if storage_gb >= 1024, maybe format as TB? But prompts says "storage capacity + type".
    // Stick to GB for consistency unless massive.
    return `${v.storage_gb}GB${type}`;
};

const formatMemory = (v: ConsoleVariant): string => {
    if (!v.ram_mb) return '—';
    const gb = v.ram_mb / 1024;
    // Format: "16GB LPDDR5" or "16GB"
    const type = v.ram_type ? ` ${v.ram_type}` : '';

    // Check if integer
    const size = Number.isInteger(gb) ? gb : gb.toFixed(1);
    return `${size}GB${type}`;
};

const formatBattery = (a: ConsoleVariant, b: ConsoleVariant): { label: string, valA: string, valB: string } | null => {
    // Check if matching units exist
    const hasMah = a.battery_capacity_mah && b.battery_capacity_mah;
    const hasWh = a.battery_capacity_wh && b.battery_capacity_wh;

    if (hasMah) {
        return {
            label: 'BATTERY',
            valA: `${a.battery_capacity_mah} mAh`,
            valB: `${b.battery_capacity_mah} mAh`
        };
    }

    if (hasWh) {
         return {
            label: 'BATTERY',
            valA: `${a.battery_capacity_wh} Wh`,
            valB: `${b.battery_capacity_wh} Wh`
        };
    }

    // Mismatch or missing data -> Hide
    return null;
};

const Row = ({ label, valA, valB, highlightDiff = false }: { label: string, valA: string, valB: string, highlightDiff?: boolean }) => {
    // Simple check for difference if highlight requested
    const isDifferent = highlightDiff && valA !== valB && valA !== '—' && valB !== '—';

    return (
        <div className="flex flex-col md:contents border-b border-gray-800 md:border-none last:border-0">
            {/* Mobile: Stacked Label */}
            <div className="md:hidden pt-3 pb-1 text-[10px] font-mono text-gray-500 uppercase tracking-widest px-4 bg-gray-900/30">
                {label}
            </div>

            {/* Desktop: Table Row */}
            <div className="grid grid-cols-2 md:contents">
                {/* Label Column (Desktop Only) */}
                <div className="hidden md:flex items-center py-3 text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-gray-800/50">
                    {label}
                </div>

                {/* Value A */}
                <div className={`px-4 py-2 md:py-3 text-sm md:text-sm font-mono text-left md:border-b md:border-gray-800/50 flex items-center ${isDifferent ? 'text-primary' : 'text-gray-300'}`}>
                    <span className="truncate">{valA || '—'}</span>
                </div>

                {/* Value B */}
                <div className={`px-4 py-2 md:py-3 text-sm md:text-sm font-mono text-left md:border-b md:border-gray-800/50 flex items-center ${isDifferent ? 'text-accent' : 'text-gray-300'}`}>
                    <span className="truncate">{valB || '—'}</span>
                </div>
            </div>
        </div>
    );
};

export const MatchSummary = ({ variantA, variantB, profileA, profileB }: MatchSummaryProps) => {
    // Pre-calculate rows
    const rows = [
        { label: 'PLATFORM', valA: variantA.os, valB: variantB.os },
        { label: 'CHIPSET', valA: variantA.cpu_model, valB: variantB.cpu_model },
        { label: 'GPU', valA: variantA.gpu_model, valB: variantB.gpu_model },
        { label: 'DISPLAY', valA: formatDisplay(variantA), valB: formatDisplay(variantB) },
        { label: 'MEMORY', valA: formatMemory(variantA), valB: formatMemory(variantB) },
        { label: 'STORAGE', valA: formatStorage(variantA), valB: formatStorage(variantB) },
        // Battery handled dynamically below
        { label: 'EMULATION CAP', valA: getMaxTier(profileA), valB: getMaxTier(profileB) },
        { label: 'LAUNCH PRICE', valA: variantA.price_launch_usd ? `$${variantA.price_launch_usd}` : '—', valB: variantB.price_launch_usd ? `$${variantB.price_launch_usd}` : '—' }
    ];

    const batteryRow = formatBattery(variantA, variantB);

    return (
        <div className="w-full max-w-5xl mx-auto mb-12 animate-fadeIn">
            {/* Header / Terminal Bar */}
            <div className="bg-gray-900 border-t border-l border-r border-gray-700 p-2 flex justify-between items-center">
                <div className="font-pixel text-xs text-secondary tracking-widest pl-2">MATCH READOUT</div>
                <div className="flex gap-1 pr-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-black/80 border border-gray-700 shadow-2xl backdrop-blur-sm">

                {/* Desktop Grid Layout Setup */}
                <div className="md:grid md:grid-cols-[140px_1fr_1fr] md:gap-x-8 md:px-6">

                    {/* Render Rows Explicitly for control */}
                    <Row label="PLATFORM" valA={variantA.os || '—'} valB={variantB.os || '—'} />
                    <Row label="CHIPSET" valA={variantA.cpu_model || '—'} valB={variantB.cpu_model || '—'} />
                    <Row label="GPU" valA={variantA.gpu_model || '—'} valB={variantB.gpu_model || '—'} />
                    <Row label="DISPLAY" valA={formatDisplay(variantA)} valB={formatDisplay(variantB)} />
                    <Row label="MEMORY" valA={formatMemory(variantA)} valB={formatMemory(variantB)} />
                    <Row label="STORAGE" valA={formatStorage(variantA)} valB={formatStorage(variantB)} />

                    {batteryRow && (
                        <Row label={batteryRow.label} valA={batteryRow.valA} valB={batteryRow.valB} />
                    )}

                    <Row label="EMULATION CAP" valA={getMaxTier(profileA)} valB={getMaxTier(profileB)} highlightDiff={true} />

                    {(variantA.price_launch_usd || variantB.price_launch_usd) && (
                        <Row
                            label="LAUNCH PRICE"
                            valA={variantA.price_launch_usd ? `$${variantA.price_launch_usd}` : '—'}
                            valB={variantB.price_launch_usd ? `$${variantB.price_launch_usd}` : '—'}
                        />
                    )}

                </div>
            </div>
        </div>
    );
};
