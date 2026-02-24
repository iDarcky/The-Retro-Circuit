'use client';

import { ConsoleVariant } from '../../lib/types';

interface GlanceComparisonProps {
    variantA: ConsoleVariant;
    variantB: ConsoleVariant;
}

const StatBar = ({ value, max, color }: { value: number; max: number; color: 'blue' | 'red' }) => {
    if (!value || !max) return null;
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const bgClass = color === 'blue' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';

    return (
        <div className="w-full h-1.5 bg-white/10 mt-2 rounded-sm overflow-hidden flex justify-start">
            <div
                className={`h-full ${bgClass} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

const TaleRow = ({
    label,
    valueA,
    subA,
    numA,
    valueB,
    subB,
    numB,
    lowerIsBetter = false,
    showBar = false
}: {
    label: string;
    valueA: string | number | undefined;
    subA?: string;
    numA?: number;
    valueB: string | number | undefined;
    subB?: string;
    numB?: number;
    lowerIsBetter?: boolean;
    showBar?: boolean;
}) => {
    // Determine Winner
    let winner: 'A' | 'B' | null = null;
    if (numA !== undefined && numB !== undefined && numA !== numB) {
        if (lowerIsBetter) {
            winner = numA < numB ? 'A' : 'B';
        } else {
            winner = numA > numB ? 'A' : 'B';
        }
    }

    // Styles - Updated to Blue/Red
    const baseColorA = "text-blue-400";
    const baseColorB = "text-red-400";
    const winColorA = "text-blue-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] font-black scale-105";
    const winColorB = "text-red-300 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)] font-black scale-105";
    const dimColor = "opacity-60 grayscale-[0.5]";

    const classA = winner === 'A' ? winColorA : (winner === 'B' ? `${baseColorA} ${dimColor}` : baseColorA);
    const classB = winner === 'B' ? winColorB : (winner === 'A' ? `${baseColorB} ${dimColor}` : baseColorB);

    const maxVal = (showBar && numA && numB) ? Math.max(numA, numB) : 0;

    return (
        <div className="group flex flex-col md:flex-row items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors relative">

            {/* Player A (Left) */}
            <div className="w-full md:w-5/12 text-center md:text-right order-2 md:order-1 px-4 flex flex-col items-center md:items-end">
                <div className={`font-mono text-xl md:text-3xl font-bold leading-tight transition-all duration-300 ${classA}`}>
                    {valueA || '---'}
                    {winner === 'A' && <span className="ml-2 text-xs md:text-sm align-top">◀</span>}
                </div>
                {subA && <div className="font-mono text-[10px] md:text-xs text-blue-300/60 mt-1 uppercase tracking-wider">{subA}</div>}

                {showBar && numA !== undefined && (
                    <div className="w-24 md:w-48 flex justify-end">
                        <StatBar value={numA} max={maxVal} color="blue" />
                    </div>
                )}
            </div>

            {/* Label (Center) */}
            <div className="w-full md:w-2/12 text-center order-1 md:order-2 mb-2 md:mb-0 relative">
                <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="font-pixel text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors relative z-10">
                    {label}
                </span>
            </div>

            {/* Player B (Right) */}
            <div className="w-full md:w-5/12 text-center md:text-left order-3 md:order-3 px-4 flex flex-col items-center md:items-start">
                <div className={`font-mono text-xl md:text-3xl font-bold leading-tight transition-all duration-300 ${classB}`}>
                    {winner === 'B' && <span className="mr-2 text-xs md:text-sm align-top">▶</span>}
                    {valueB || '---'}
                </div>
                {subB && <div className="font-mono text-[10px] md:text-xs text-red-300/60 mt-1 uppercase tracking-wider">{subB}</div>}

                {showBar && numB !== undefined && (
                    <div className="w-24 md:w-48 flex justify-start">
                        <StatBar value={numB} max={maxVal} color="red" />
                    </div>
                )}
            </div>

        </div>
    );
};

export const GlanceComparison = ({ variantA, variantB }: GlanceComparisonProps) => {

    // Format Helpers
    const formatPrice = (p?: number) => p ? `$${p}` : '---';
    const formatStorage = (gb?: number) => gb ? (gb >= 1000 ? `${gb/1000}TB` : `${gb}GB`) : '---';
    const formatRam = (mb?: number) => mb ? (mb >= 1024 ? `${(mb/1024).toFixed(0)}GB` : `${mb}MB`) : '---';
    const formatBattery = (mah?: number) => mah ? `${mah} mAh` : '---';
    const formatWeight = (g?: number) => g ? `${g}g` : '---';
    const formatDim = (w?: number, h?: number, d?: number) => (w && h && d) ? `${w} × ${h} × ${d}` : '---';

    // Parse numeric RAM for bars comparison (simplified)
    const ramA = variantA.ram_mb;
    const ramB = variantB.ram_mb;

    // Parse numeric Storage
    const storageA = variantA.storage_gb;
    const storageB = variantB.storage_gb;

    // Parse Battery
    const battA = variantA.battery_capacity_mah;
    const battB = variantB.battery_capacity_mah;

    return (
        <div className="w-full mb-12 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                <h3 className="font-pixel text-xl md:text-3xl text-white text-center tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    TALE OF THE TAPE
                </h3>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
            </div>

            <div className="flex flex-col border-t border-b border-white/10 bg-black/20 backdrop-blur-sm">

                {/* 1. Launch Price */}
                <TaleRow
                    label="LAUNCH PRICE"
                    valueA={formatPrice(variantA.price_launch_usd)}
                    subA={variantA.release_date ? new Date(variantA.release_date).getFullYear().toString() : ''}
                    numA={variantA.price_launch_usd}
                    valueB={formatPrice(variantB.price_launch_usd)}
                    subB={variantB.release_date ? new Date(variantB.release_date).getFullYear().toString() : ''}
                    numB={variantB.price_launch_usd}
                    lowerIsBetter
                />

                {/* 2. Display */}
                <TaleRow
                    label="DISPLAY"
                    valueA={variantA.screen_size_inch ? `${variantA.screen_size_inch}"` : '---'}
                    subA={`${variantA.display_tech || ''} ${variantA.refresh_rate_hz ? `(${variantA.refresh_rate_hz}Hz)` : ''}`}
                    numA={variantA.screen_size_inch}
                    valueB={variantB.screen_size_inch ? `${variantB.screen_size_inch}"` : '---'}
                    subB={`${variantB.display_tech || ''} ${variantB.refresh_rate_hz ? `(${variantB.refresh_rate_hz}Hz)` : ''}`}
                    numB={variantB.screen_size_inch}
                />

                {/* 3. Processing */}
                <TaleRow
                    label="CPU ENGINE"
                    valueA={variantA.cpu_model || 'Unknown CPU'}
                    subA={`${variantA.cpu_cores || '?'} Cores @ ${variantA.cpu_clock_max_mhz ? (variantA.cpu_clock_max_mhz/1000).toFixed(1) + 'GHz' : ''}`}
                    numA={variantA.cpu_clock_max_mhz} // Rough proxy for "better" just for highlight
                    valueB={variantB.cpu_model || 'Unknown CPU'}
                    subB={`${variantB.cpu_cores || '?'} Cores @ ${variantB.cpu_clock_max_mhz ? (variantB.cpu_clock_max_mhz/1000).toFixed(1) + 'GHz' : ''}`}
                    numB={variantB.cpu_clock_max_mhz}
                />

                 {/* 4. GPU */}
                 <TaleRow
                    label="GRAPHICS"
                    valueA={variantA.gpu_model || '---'}
                    subA={variantA.gpu_teraflops ? `${variantA.gpu_teraflops} TFLOPS` : ''}
                    numA={variantA.gpu_teraflops}
                    valueB={variantB.gpu_model || '---'}
                    subB={variantB.gpu_teraflops ? `${variantB.gpu_teraflops} TFLOPS` : ''}
                    numB={variantB.gpu_teraflops}
                />

                {/* 5. Memory */}
                <TaleRow
                    label="MEMORY"
                    valueA={`${formatRam(variantA.ram_mb)}`}
                    subA={variantA.ram_type}
                    numA={ramA}
                    valueB={`${formatRam(variantB.ram_mb)}`}
                    subB={variantB.ram_type}
                    numB={ramB}
                    showBar
                />

                {/* 6. Storage */}
                 <TaleRow
                    label="STORAGE"
                    valueA={`${formatStorage(variantA.storage_gb)}`}
                    subA={variantA.storage_expandable ? '+ MicroSD Support' : 'Fixed Storage'}
                    numA={storageA}
                    valueB={`${formatStorage(variantB.storage_gb)}`}
                    subB={variantB.storage_expandable ? '+ MicroSD Support' : 'Fixed Storage'}
                    numB={storageB}
                    showBar
                />

                {/* 7. Power */}
                <TaleRow
                    label="BATTERY"
                    valueA={formatBattery(variantA.battery_capacity_mah)}
                    subA={variantA.charging_speed_w ? `${variantA.charging_speed_w}W Fast Charge` : ''}
                    numA={battA}
                    valueB={formatBattery(variantB.battery_capacity_mah)}
                    subB={variantB.charging_speed_w ? `${variantB.charging_speed_w}W Fast Charge` : ''}
                    numB={battB}
                    showBar
                />

                {/* 8. Dimensions */}
                <TaleRow
                    label="WEIGHT"
                    valueA={formatWeight(variantA.weight_g)}
                    subA={`${formatDim(variantA.width_mm, variantA.height_mm, variantA.depth_mm)} mm`}
                    numA={variantA.weight_g}
                    valueB={formatWeight(variantB.weight_g)}
                    subB={`${formatDim(variantB.width_mm, variantB.height_mm, variantB.depth_mm)} mm`}
                    numB={variantB.weight_g}
                    lowerIsBetter
                />

            </div>
        </div>
    );
};
