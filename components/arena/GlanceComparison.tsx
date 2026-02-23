'use client';

import { ConsoleVariant } from '../../lib/types';

interface GlanceComparisonProps {
    variantA: ConsoleVariant;
    variantB: ConsoleVariant;
}

const TaleRow = ({
    label,
    valueA,
    subA,
    valueB,
    subB,
    highlight = false
}: {
    label: string;
    valueA: string | number | undefined;
    subA?: string;
    valueB: string | number | undefined;
    subB?: string;
    highlight?: boolean;
}) => {
    // "Pop" colors: Brighter 400 with drop shadow
    const colorA = highlight
        ? "text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] font-black"
        : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";

    const colorB = highlight
        ? "text-orange-300 drop-shadow-[0_0_12px_rgba(251,146,60,0.8)] font-black"
        : "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]";
    const labelColor = "text-white/60";

    return (
        <div className="group flex flex-col md:flex-row items-center justify-between py-4 border-b border-white/10 hover:bg-white/5 transition-colors relative">

            {/* Player A (Left) */}
            <div className="w-full md:w-5/12 text-center md:text-right order-2 md:order-1 px-4">
                <div className={`font-mono text-lg md:text-2xl font-bold leading-tight ${colorA}`}>
                    {valueA || '---'}
                </div>
                {subA && <div className="font-mono text-[10px] md:text-xs text-cyan-300/60 mt-1 uppercase tracking-wider">{subA}</div>}
            </div>

            {/* Label (Center) */}
            <div className="w-full md:w-2/12 text-center order-1 md:order-2 mb-2 md:mb-0">
                <span className={`font-pixel text-[10px] md:text-xs uppercase tracking-widest ${labelColor} group-hover:text-white transition-colors`}>
                    {label}
                </span>
            </div>

            {/* Player B (Right) */}
            <div className="w-full md:w-5/12 text-center md:text-left order-3 md:order-3 px-4">
                <div className={`font-mono text-lg md:text-2xl font-bold leading-tight ${colorB}`}>
                    {valueB || '---'}
                </div>
                {subB && <div className="font-mono text-[10px] md:text-xs text-orange-300/60 mt-1 uppercase tracking-wider">{subB}</div>}
            </div>

        </div>
    );
};

export const GlanceComparison = ({ variantA, variantB }: GlanceComparisonProps) => {

    // Format Helpers
    const formatPrice = (p?: number) => p ? `$${p}` : '---';
    const formatStorage = (gb?: number) => gb ? (gb >= 1000 ? `${gb/1000}TB` : `${gb}GB`) : '---';
    const formatRam = (mb?: number) => mb ? (mb >= 1024 ? `${mb/1024}GB` : `${mb}MB`) : '---';
    const formatBattery = (mah?: number) => mah ? `${mah} mAh` : '---';
    const formatWeight = (g?: number) => g ? `${g}g` : '---';
    const formatDim = (w?: number, h?: number, d?: number) => (w && h && d) ? `${w} × ${h} × ${d}` : '---';

    return (
        <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                <h3 className="font-pixel text-xl md:text-2xl text-white text-center tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    TALE OF THE TAPE
                </h3>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
            </div>

            <div className="flex flex-col border-t border-white/10">

                {/* 1. Launch Price */}
                <TaleRow
                    label="LAUNCH PRICE"
                    valueA={formatPrice(variantA.price_launch_usd)}
                    subA={variantA.release_date ? new Date(variantA.release_date).getFullYear().toString() : ''}
                    valueB={formatPrice(variantB.price_launch_usd)}
                    subB={variantB.release_date ? new Date(variantB.release_date).getFullYear().toString() : ''}
                    highlight
                />

                {/* 2. Display */}
                <TaleRow
                    label="DISPLAY"
                    valueA={variantA.screen_size_inch ? `${variantA.screen_size_inch}"` : '---'}
                    subA={`${variantA.display_tech || ''} ${variantA.refresh_rate_hz ? `(${variantA.refresh_rate_hz}Hz)` : ''}`}
                    valueB={variantB.screen_size_inch ? `${variantB.screen_size_inch}"` : '---'}
                    subB={`${variantB.display_tech || ''} ${variantB.refresh_rate_hz ? `(${variantB.refresh_rate_hz}Hz)` : ''}`}
                />

                {/* 3. Processing */}
                <TaleRow
                    label="CPU ENGINE"
                    valueA={variantA.cpu_model || 'Unknown CPU'}
                    subA={`${variantA.cpu_cores || '?'} Cores @ ${variantA.cpu_clock_max_mhz ? (variantA.cpu_clock_max_mhz/1000).toFixed(1) + 'GHz' : ''}`}
                    valueB={variantB.cpu_model || 'Unknown CPU'}
                    subB={`${variantB.cpu_cores || '?'} Cores @ ${variantB.cpu_clock_max_mhz ? (variantB.cpu_clock_max_mhz/1000).toFixed(1) + 'GHz' : ''}`}
                />

                 {/* 4. GPU */}
                 <TaleRow
                    label="GRAPHICS"
                    valueA={variantA.gpu_model || '---'}
                    subA={variantA.gpu_teraflops ? `${variantA.gpu_teraflops} TFLOPS` : ''}
                    valueB={variantB.gpu_model || '---'}
                    subB={variantB.gpu_teraflops ? `${variantB.gpu_teraflops} TFLOPS` : ''}
                />

                {/* 5. Memory */}
                <TaleRow
                    label="MEMORY"
                    valueA={`${formatRam(variantA.ram_mb)} / ${formatStorage(variantA.storage_gb)}`}
                    subA={variantA.storage_expandable ? '+ MicroSD Support' : 'Fixed Storage'}
                    valueB={`${formatRam(variantB.ram_mb)} / ${formatStorage(variantB.storage_gb)}`}
                    subB={variantB.storage_expandable ? '+ MicroSD Support' : 'Fixed Storage'}
                />

                {/* 6. Power */}
                <TaleRow
                    label="BATTERY"
                    valueA={formatBattery(variantA.battery_capacity_mah)}
                    subA={variantA.charging_speed_w ? `${variantA.charging_speed_w}W Fast Charge` : ''}
                    valueB={formatBattery(variantB.battery_capacity_mah)}
                    subB={variantB.charging_speed_w ? `${variantB.charging_speed_w}W Fast Charge` : ''}
                />

                {/* 7. Dimensions */}
                <TaleRow
                    label="FORM FACTOR"
                    valueA={formatWeight(variantA.weight_g)}
                    subA={`${formatDim(variantA.width_mm, variantA.height_mm, variantA.depth_mm)} mm`}
                    valueB={formatWeight(variantB.weight_g)}
                    subB={`${formatDim(variantB.width_mm, variantB.height_mm, variantB.depth_mm)} mm`}
                />

            </div>
        </div>
    );
};
