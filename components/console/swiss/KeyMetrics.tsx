'use client';

import { ConsoleSpecs, ConsoleVariant } from '../../../lib/types';

interface KeyMetricsProps {
    specs: Partial<ConsoleSpecs> & Partial<ConsoleVariant>;
    releaseDate: string | null;
}

const MetricCard = ({ label, value, unit }: { label: string, value: string | number | undefined, unit?: string }) => {
    return (
        <div className="bg-bg-primary border border-white/10 p-4 relative group hover:border-white/20 transition-colors">
            <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2 tracking-widest group-hover:text-secondary transition-colors">
                {label}
            </span>
            <div className="font-pixel text-xl md:text-2xl text-white truncate" title={value ? String(value) : ''}>
                {value ? (
                    <>
                        {value}
                        {unit && <span className="text-[10px] font-mono text-gray-500 ml-1 align-top">{unit}</span>}
                    </>
                ) : (
                    <span className="text-gray-700">---</span>
                )}
            </div>

            {/* Corner Accent */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-gray-800 rounded-full group-hover:bg-accent transition-colors"></div>
        </div>
    );
};

export default function KeyMetrics({ specs, releaseDate }: KeyMetricsProps) {
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : undefined;

    // Fallback logic for release year if date is missing but we have a year in specs?
    // Usually specs don't have year, the variant does.

    const year = releaseYear || '????';
    const screenSize = specs.screen_size_inch;

    let resolution = '---';
    if (specs.screen_resolution_x && specs.screen_resolution_y) {
        resolution = `${specs.screen_resolution_x} x ${specs.screen_resolution_y}`;
    } else if (specs.screen_resolution_x) {
         resolution = `${specs.screen_resolution_x}w`;
    }

    const battery = specs.battery_capacity_mah;

    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <MetricCard label="RELEASE" value={year} />
            <MetricCard label="DISPLAY" value={screenSize} unit={'"'} />
            <MetricCard label="RESOLUTION" value={resolution} />
            <MetricCard label="BATTERY" value={battery} unit={'mAh'} />
        </section>
    );
}
