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

    // New Fields
    const os = specs.os || '---';
    const cpu = specs.cpu_model || '---';

    let ram = '---';
    if (specs.ram_mb) {
        ram = specs.ram_mb >= 1024
            ? `${(specs.ram_mb / 1024).toFixed(specs.ram_mb % 1024 === 0 ? 0 : 1)} GB`
            : `${specs.ram_mb} MB`;
    }

    return (
        <div className="space-y-8">
             {/* KEY METRICS GRID */}
             <div className="grid grid-cols-2 gap-2">
                <MetricCell label="RELEASE" value={releaseYear} />
                <MetricCell label="PRICE" value={price} />

                <MetricCell label="DISPLAY" value={specs.screen_size_inch} unit={'"'} />
                <MetricCell label="RESOLUTION" value={resolution} />
            </div>

            {/* SPECS LIST (Text Data) */}
            <div className="grid grid-cols-1 gap-4 font-mono text-xs">

                {/* Category */}
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">CATEGORY</span>
                    <span className="text-white uppercase text-right">{category}</span>
                </div>

                {/* Form Factor */}
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">FORM FACTOR</span>
                    <span className="text-white uppercase text-right">{formFactor}</span>
                </div>

                 {/* OS */}
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">OS</span>
                    <span className="text-white uppercase text-right">{os}</span>
                </div>

                 {/* CPU */}
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">CPU</span>
                    <span className="text-white uppercase text-right">{cpu}</span>
                </div>

                 {/* RAM */}
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">RAM</span>
                    <span className="text-white uppercase text-right">{ram}</span>
                </div>

            </div>
        </div>
    );
}
