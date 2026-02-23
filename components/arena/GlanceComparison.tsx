'use client';

import { ConsoleVariant } from '../../lib/types';
import { Cpu, Monitor, HardDrive, Ruler, DollarSign, Zap } from 'lucide-react';

interface GlanceComparisonProps {
    variantA: ConsoleVariant;
    variantB: ConsoleVariant;
}

const GlanceCard = ({
    title,
    icon: Icon,
    valueA,
    subA,
    valueB,
    subB,
    highlight = false
}: {
    title: string;
    icon: any;
    valueA: string | number | undefined;
    subA?: string;
    valueB: string | number | undefined;
    subB?: string;
    highlight?: boolean;
}) => {
    return (
        <div className="border border-white/10 bg-white/5 p-4 flex flex-col gap-3 group hover:border-white/20 transition-colors">
            <div className="flex items-center gap-2 text-white/50 border-b border-white/5 pb-2 mb-1">
                <Icon size={14} />
                <span className="font-mono text-[10px] uppercase tracking-widest">{title}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 h-full">
                {/* Player A */}
                <div className="flex flex-col justify-start border-r border-white/5 pr-2">
                    <span className={`font-mono text-sm md:text-lg text-cyan-500 leading-tight ${highlight ? 'font-bold' : ''}`}>
                        {valueA || '---'}
                    </span>
                    {subA && <span className="text-[10px] text-white/40 font-mono mt-1">{subA}</span>}
                </div>

                {/* Player B */}
                <div className="flex flex-col justify-start pl-2 text-right">
                    <span className={`font-mono text-sm md:text-lg text-orange-500 leading-tight ${highlight ? 'font-bold' : ''}`}>
                        {valueB || '---'}
                    </span>
                    {subB && <span className="text-[10px] text-white/40 font-mono mt-1">{subB}</span>}
                </div>
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
    const formatDim = (w?: number, h?: number, d?: number) => (w && h && d) ? `${w}x${h}x${d}` : '---';

    return (
        <div className="w-full mb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <h3 className="font-pixel text-lg md:text-xl text-white text-center">AT A GLANCE</h3>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* 1. Price */}
                <GlanceCard
                    title="Launch Price"
                    icon={DollarSign}
                    valueA={formatPrice(variantA.price_launch_usd)}
                    subA={variantA.release_date ? new Date(variantA.release_date).getFullYear().toString() : ''}
                    valueB={formatPrice(variantB.price_launch_usd)}
                    subB={variantB.release_date ? new Date(variantB.release_date).getFullYear().toString() : ''}
                    highlight
                />

                {/* 2. Display */}
                <GlanceCard
                    title="Display"
                    icon={Monitor}
                    valueA={variantA.screen_size_inch ? `${variantA.screen_size_inch}"` : '---'}
                    subA={`${variantA.display_tech || ''} ${variantA.refresh_rate_hz ? `(${variantA.refresh_rate_hz}Hz)` : ''}`}
                    valueB={variantB.screen_size_inch ? `${variantB.screen_size_inch}"` : '---'}
                    subB={`${variantB.display_tech || ''} ${variantB.refresh_rate_hz ? `(${variantB.refresh_rate_hz}Hz)` : ''}`}
                />

                {/* 3. Performance (CPU/GPU) - Combined for Glance */}
                <GlanceCard
                    title="Processing"
                    icon={Cpu}
                    valueA={variantA.cpu_model || 'Unknown CPU'}
                    subA={`${variantA.cpu_cores || '?'} Cores @ ${variantA.cpu_clock_max_mhz ? (variantA.cpu_clock_max_mhz/1000).toFixed(1) + 'GHz' : ''}`}
                    valueB={variantB.cpu_model || 'Unknown CPU'}
                    subB={`${variantB.cpu_cores || '?'} Cores @ ${variantB.cpu_clock_max_mhz ? (variantB.cpu_clock_max_mhz/1000).toFixed(1) + 'GHz' : ''}`}
                />

                {/* 4. Memory */}
                <GlanceCard
                    title="Memory & Storage"
                    icon={HardDrive}
                    valueA={`${formatRam(variantA.ram_mb)} / ${formatStorage(variantA.storage_gb)}`}
                    subA={variantA.storage_expandable ? '+ MicroSD' : 'Fixed Storage'}
                    valueB={`${formatRam(variantB.ram_mb)} / ${formatStorage(variantB.storage_gb)}`}
                    subB={variantB.storage_expandable ? '+ MicroSD' : 'Fixed Storage'}
                />

                {/* 5. Power */}
                <GlanceCard
                    title="Power"
                    icon={Zap}
                    valueA={formatBattery(variantA.battery_capacity_mah)}
                    subA={variantA.charging_speed_w ? `${variantA.charging_speed_w}W Charging` : ''}
                    valueB={formatBattery(variantB.battery_capacity_mah)}
                    subB={variantB.charging_speed_w ? `${variantB.charging_speed_w}W Charging` : ''}
                />

                {/* 6. Dimensions */}
                <GlanceCard
                    title="Portability"
                    icon={Ruler}
                    valueA={formatWeight(variantA.weight_g)}
                    subA={`${formatDim(variantA.width_mm, variantA.height_mm, variantA.depth_mm)} mm`}
                    valueB={formatWeight(variantB.weight_g)}
                    subB={`${formatDim(variantB.width_mm, variantB.height_mm, variantB.depth_mm)} mm`}
                />

            </div>
        </div>
    );
};
