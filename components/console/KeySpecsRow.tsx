
'use client';

import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { getConsoleImage } from '../../lib/utils';

export const KeySpecsRow = ({
    console: consoleData,
    variant
}: {
    console: ConsoleDetails,
    variant?: ConsoleVariant
}) => {
    // Determine displayed values
    const year = variant?.release_date ? new Date(variant.release_date).getFullYear() : consoleData.generation || 'N/A';
    const screen = variant?.screen_size_inch ? `${variant.screen_size_inch}"` : '---';
    const resolution = variant?.screen_resolution_x ? `${variant.screen_resolution_x}p` : '---';
    const battery = variant?.battery_capacity_mah ? `${variant.battery_capacity_mah}mAh` : '---';

    // Check if we have variant data to display
    if (!variant) return null;

    const SpecItem = ({ label, value }: { label: string, value: string | number }) => (
        <div className="flex flex-col items-center justify-center p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-none">
            <span className="font-sans text-[10px] text-gray-500 uppercase tracking-widest mb-2">{label}</span>
            <span className="font-mono text-xl md:text-3xl font-light text-white tracking-tighter">{value}</span>
        </div>
    );

    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <SpecItem label="RELEASE" value={year} />
            <SpecItem label="DISPLAY" value={screen} />
            <SpecItem label="RESOLUTION" value={resolution} />
            <SpecItem label="BATTERY" value={battery} />
        </div>
    );
};
