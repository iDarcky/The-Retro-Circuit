'use client';

import { ConsoleSpecs, ConsoleVariant } from '../../../lib/types';

interface KeyMetricsProps {
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

export default function KeyMetrics({ specs, releaseDate }: KeyMetricsProps) {
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '????';

    // Resolution logic
    let resolution = '---';
    if (specs.screen_resolution_x && specs.screen_resolution_y) {
        resolution = `${specs.screen_resolution_x}x${specs.screen_resolution_y}`;
    } else if (specs.screen_resolution_x) {
         resolution = `${specs.screen_resolution_x}w`;
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            <MetricCell label="RELEASE" value={releaseYear} />
            <MetricCell label="DISPLAY" value={specs.screen_size_inch} unit={'"'} />
            <MetricCell label="RESOLUTION" value={resolution} />
            <MetricCell label="BATTERY" value={specs.battery_capacity_mah} unit={'mAh'} />
        </div>
    );
}
