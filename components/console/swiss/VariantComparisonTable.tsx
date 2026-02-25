'use client';

import { useMemo } from 'react';
import { ConsoleSpecs, ConsoleVariant } from '../../../lib/types';
import { formatInputEnum } from '../../../lib/utils/formatters';

interface VariantComparisonTableProps {
    variants: ConsoleVariant[];
    baseSpecs: ConsoleSpecs | Partial<ConsoleVariant>;
}

// Helper to determine if a value is "empty"
const isEmpty = (val: any) => val === undefined || val === null || val === '';

// Spec Definition Type
type SpecDef = {
    key: string;
    label: string;
    unit?: string;
    formatter?: (val: any) => string;
};

export default function VariantComparisonTable({ variants, baseSpecs }: VariantComparisonTableProps) {

    // 1. Merge Base Specs into Variants to get "Full" objects
    const fullVariants = useMemo(() => {
        return variants.map(v => {
            // Priority: Variant > Base
            // We need to carefully merge because some base specs might be in 'specs' object
            // but for comparison we treat them flat.
            return { ...baseSpecs, ...v };
        });
    }, [variants, baseSpecs]);

    // 2. Define Rows (Categorized)
    const SECTIONS: { title: string; specs: SpecDef[] }[] = [
        {
            title: 'Display & Visuals',
            specs: [
                { key: 'screen_size_inch', label: 'Screen Size', unit: '"' },
                { key: 'display_type', label: 'Panel Type' },
                { key: 'screen_resolution_y', label: 'Resolution', formatter: (val) => val ? `${val}p` : '-' },
                { key: 'refresh_rate_hz', label: 'Refresh Rate', unit: 'Hz' },
                { key: 'brightness_nits', label: 'Brightness', unit: 'nits' },
                { key: 'touchscreen', label: 'Touchscreen', formatter: (val) => val ? 'YES' : 'NO' },
            ]
        },
        {
            title: 'Performance & Silicon',
            specs: [
                { key: 'cpu_model', label: 'CPU Model' },
                { key: 'cpu_clock_max_mhz', label: 'CPU Clock', unit: 'MHz' },
                { key: 'gpu_model', label: 'GPU Model' },
                { key: 'ram_mb', label: 'RAM', formatter: (val) => val ? (val >= 1024 ? `${(val/1024).toFixed(1)} GB` : `${val} MB`) : '-' },
                { key: 'storage_gb', label: 'Storage', unit: 'GB' },
            ]
        },
         {
            title: 'Power & Chassis',
            specs: [
                { key: 'battery_capacity_mah', label: 'Battery', unit: 'mAh' },
                { key: 'battery_capacity_wh', label: 'Energy', unit: 'Wh' },
                { key: 'weight_g', label: 'Weight', unit: 'g' },
                { key: 'available_colors', label: 'Colors', formatter: (val) => Array.isArray(val) ? val.join(', ') : val },
                 { key: 'body_material', label: 'Material' },
            ]
        },
        {
            title: 'Launch Info',
            specs: [
                { key: 'release_date', label: 'Release Date' },
                { key: 'price_launch_usd', label: 'Launch Price', formatter: (val) => val ? `$${val}` : '-' },
            ]
        }
    ];

    // 3. Render
    return (
        <div className="w-full overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b border-white/20">
                        <th className="p-4 w-[200px] bg-[#09090b] sticky left-0 z-10 font-pixel text-xs text-orange-500 uppercase tracking-widest border-r border-white/10">
                            Specification
                        </th>
                        {fullVariants.map(v => (
                            <th key={v.id} className="p-4 min-w-[200px] font-pixel text-xs text-white uppercase tracking-wider text-center border-r border-white/10 last:border-0">
                                {v.variant_name}
                                {v.is_default && <span className="block text-[9px] text-gray-500 mt-1 font-mono tracking-tight">(DEFAULT)</span>}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="font-mono text-xs">
                    {SECTIONS.map((section) => (
                        <div key={section.title} className="contents group">
                            {/* Section Header */}
                            <tr className="bg-white/[0.03]">
                                <td className="p-2 pl-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] sticky left-0 bg-[#111113] border-r border-white/10 z-10" colSpan={1}>
                                    {section.title}
                                </td>
                                <td colSpan={fullVariants.length} className="bg-white/[0.03]"></td>
                            </tr>

                            {/* Spec Rows */}
                            {section.specs.map((spec) => {
                                // Calculate if values differ across variants
                                const values = fullVariants.map(v => (v as any)[spec.key]);
                                const firstVal = values[0];
                                const hasDiff = values.some(val => val !== firstVal);

                                // Skip empty rows if ALL variants are empty for this spec
                                const allEmpty = values.every(isEmpty);
                                if (allEmpty) return null;

                                return (
                                    <tr key={spec.key} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        {/* Label */}
                                        <td className="p-3 pl-4 text-gray-400 sticky left-0 bg-[#09090b] border-r border-white/10 z-10">
                                            {spec.label}
                                        </td>

                                        {/* Values */}
                                        {fullVariants.map((v, idx) => {
                                            const rawVal = (v as any)[spec.key];
                                            let displayVal: React.ReactNode = rawVal;

                                            if (isEmpty(rawVal)) {
                                                displayVal = <span className="text-gray-700">-</span>;
                                            } else {
                                                if (spec.formatter) {
                                                    displayVal = spec.formatter(rawVal);
                                                } else if (spec.unit) {
                                                    displayVal = `${rawVal} ${spec.unit}`;
                                                }
                                            }

                                            return (
                                                <td
                                                    key={v.id}
                                                    className={`
                                                        p-3 text-center border-r border-white/10 last:border-0
                                                        ${hasDiff ? 'text-orange-400 font-bold bg-orange-500/[0.03]' : 'text-gray-300'}
                                                    `}
                                                >
                                                    {displayVal}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </div>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
