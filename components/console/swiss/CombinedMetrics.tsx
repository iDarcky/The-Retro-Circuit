'use client';

import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../../lib/types';

interface CombinedMetricsProps {
    console: ConsoleDetails;
    specs: Partial<ConsoleSpecs> & Partial<ConsoleVariant>;
    releaseDate: string | null;
}

const MetricCell = ({ label, value, unit }: { label: string, value: string | number | undefined, unit?: string }) => {
    return (
        <div className="flex flex-col gap-1 p-4 border border-white/10 hover:border-orange-500/50 transition-colors bg-white/[0.02]">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
            <div className="font-pixel text-lg text-white truncate">
                {value ? (
                    <>
                        {value}
                        {unit && <span className="text-[10px] font-mono text-gray-500 ml-1 align-top">{unit}</span>}
                    </>
                ) : (
                    <span className="text-gray-700">---</span>
                )}
            </div>
        </div>
    );
};

export default function CombinedMetrics({ console, specs, releaseDate }: CombinedMetricsProps) {
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '????';

    // Resolution logic
    let resolution = '---';
    if (specs.screen_resolution_x && specs.screen_resolution_y) {
        resolution = `${specs.screen_resolution_x}x${specs.screen_resolution_y}`;
    } else if (specs.screen_resolution_x) {
         resolution = `${specs.screen_resolution_x}w`;
    }

    // Category & Form Factor
    const category = console.device_category ? console.device_category.replace('_', ' ') : 'SYSTEM';
    const formFactor = console.form_factor ? console.form_factor.replace('_', ' ') : 'N/A';

    // Price Formatting
    const price = specs.price_launch_usd
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(specs.price_launch_usd)
        : '---';

    return (
        <div className="space-y-8">
             {/* KEY METRICS GRID */}
             <div>
                <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">CORE SPECIFICATIONS</h3>
                <div className="grid grid-cols-2 gap-2">
                    <MetricCell label="RELEASE" value={releaseYear} />
                    <MetricCell label="PRICE" value={price} />

                    <MetricCell label="CATEGORY" value={category.toUpperCase()} />
                    <MetricCell label="FORM FACTOR" value={formFactor.toUpperCase()} />

                    <MetricCell label="DISPLAY" value={specs.screen_size_inch} unit={'"'} />
                    <MetricCell label="RESOLUTION" value={resolution} />

                    <MetricCell label="BATTERY" value={specs.battery_capacity_mah} unit={'mAh'} />
                    <MetricCell label="WEIGHT" value={specs.weight_g} unit={'g'} />
                </div>
            </div>

            {/* MISSION PROFILE (Text Data) */}
            <div>
                 <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">MISSION PROFILE</h3>
                 <div className="grid grid-cols-1 gap-4 font-mono text-xs">

                    {/* Status */}
                    <div className="flex items-start justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">STATUS</span>
                        <span className={`uppercase ${console.status === 'published' ? 'text-emerald-500' : 'text-orange-500'}`}>
                            {console.status || 'UNKNOWN'}
                        </span>
                    </div>

                    {/* Dimensions */}
                    <div className="flex items-start justify-between border-b border-white/5 pb-2">
                         <span className="text-gray-500">DIMENSIONS</span>
                         <span className="text-white text-right">
                             {specs.width_mm && specs.height_mm && specs.depth_mm
                                ? `${specs.width_mm} x ${specs.height_mm} x ${specs.depth_mm} mm`
                                : '---'}
                         </span>
                    </div>

                    {/* Connectivity */}
                    <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                        <span className="text-gray-500 mb-1">CONNECTIVITY</span>
                        <div className="text-white text-right opacity-80 leading-relaxed">
                            {[specs.wifi_specs, specs.bluetooth_specs, specs.other_connectivity].filter(Boolean).join(', ') || 'Standard I/O'}
                        </div>
                    </div>

                     {/* I/O Ports */}
                     <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                        <span className="text-gray-500 mb-1">INTERFACES</span>
                        <div className="text-white text-right opacity-80 leading-relaxed">
                             {specs.ports || 'Standard Ports'}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
}
