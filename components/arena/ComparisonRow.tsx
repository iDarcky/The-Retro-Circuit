'use client';

import { FC } from 'react';
import { ConsoleVariant } from '../../lib/types';
import { ComparisonMetric } from '../../lib/config/arena-metrics';

interface ComparisonRowProps {
    metric: ComparisonMetric;
    varA: ConsoleVariant;
    varB: ConsoleVariant;
    showDiffOnly: boolean;
}

export const ComparisonRow: FC<ComparisonRowProps> = ({ 
    metric, 
    varA, 
    varB,
    showDiffOnly
}) => {
    // Helper to deeply access properties
    const getValue = (variant: any, metric: ComparisonMetric) => {
        if (metric.path && metric.path.length > 0) {
            let current = variant;
            for (const key of metric.path) {
                if (current == null) return undefined;
                current = current[key];
            }
            return current;
        }
        return variant[metric.key];
    };

    const rawA = getValue(varA, metric);
    const rawB = getValue(varB, metric);

    const exists = (v: any) => v !== undefined && v !== null && v !== '';
    const hasA = exists(rawA);
    const hasB = exists(rawB);

    if (!hasA && !hasB) return null;
    if (showDiffOnly && rawA === rawB) return null;

    let winner: 'A' | 'B' | 'TIE' | null = null;

    // Determine winner based on metric type
    if ((metric.type === 'number' || metric.type === 'currency' || metric.type === 'resolution') && hasA && hasB) {
        const numA = Number(rawA);
        const numB = Number(rawB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            if (numA !== numB) {
                if (metric.lowerIsBetter) {
                    winner = numA < numB ? 'A' : 'B';
                } else {
                    winner = numA > numB ? 'A' : 'B';
                }
            } else if (numA > 0) {
                winner = 'TIE';
            }
        }
    }

    const getDisplayValue = (val: any, variant: ConsoleVariant) => {
        if (!exists(val)) return <span className="text-white/10 text-xs font-light">---</span>;

        if (metric.key === 'ram_mb') {
             const mb = Number(val);
             if (!isNaN(mb) && mb >= 1024) return `${(mb / 1024).toFixed(0)} GB`;
             return `${mb} MB`;
        }
        if (metric.key === 'charging_speed_w') {
            return (
                <span>
                    {val}W
                    {variant.charging_tech && <span className="text-[10px] text-white/30 ml-1 hidden md:inline">({variant.charging_tech})</span>}
                </span>
            );
        }
        if (metric.type === 'boolean') return (val === true || val === 'true') ? 'YES' : 'NO';
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution') {
             if (variant.screen_resolution_x && variant.screen_resolution_y) {
                 return `${variant.screen_resolution_x} × ${variant.screen_resolution_y}`;
             }
             return '---';
        }
        
        return `${val}${metric.unit || ''}`;
    };

    const displayA = getDisplayValue(rawA, varA);
    const displayB = getDisplayValue(rawB, varB);

    // Styling Logic - Blue/Red Theme
    const winClassA = "text-blue-300 font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]";
    const winClassB = "text-red-300 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";

    const loseClass = "text-white/40 grayscale-[0.3]";
    const tieClass = "text-white/80";

    let classA = loseClass;
    let classB = loseClass;

    if (winner === 'A') {
        classA = winClassA;
        classB = loseClass;
    } else if (winner === 'B') {
        classA = loseClass;
        classB = winClassB;
    } else if (winner === 'TIE') {
        classA = tieClass;
        classB = tieClass;
    }

    return (
        <div className="relative border-b border-white/5 py-4 px-4 hover:bg-white/5 transition-colors group">

            {/* Mobile Label (Top) */}
            <div className="md:hidden text-center mb-3 border-b border-white/5 pb-2">
                <span className="font-pixel text-[10px] text-white/50 uppercase tracking-widest">{metric.label}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center">

                {/* Player A (Left on Mobile, Right on Desktop) */}
                <div className={`col-span-1 md:col-span-4 text-left md:text-right font-mono text-sm md:text-sm flex flex-col md:flex-row md:justify-end items-start md:items-center gap-2 order-2 md:order-1 ${classA}`}>
                    {winner === 'A' && <span className="text-[10px] animate-pulse hidden md:inline text-blue-300">◀</span>}
                    <span className="break-words leading-tight">{displayA}</span>
                </div>

                {/* Desktop Label (Center) */}
                <div className="hidden md:flex col-span-4 items-center justify-center border-l border-r border-white/5 h-full order-2 px-2">
                    <span className="font-pixel text-[10px] text-white/30 uppercase tracking-widest group-hover:text-white transition-colors text-center">
                        {metric.label}
                    </span>
                </div>

                {/* Player B (Right on Mobile, Left on Desktop) */}
                <div className={`col-span-1 md:col-span-4 text-right md:text-left font-mono text-sm md:text-sm flex flex-col md:flex-row md:justify-start items-end md:items-center gap-2 order-3 ${classB}`}>
                    <span className="break-words leading-tight">{displayB}</span>
                    {winner === 'B' && <span className="text-[10px] animate-pulse hidden md:inline text-red-300">▶</span>}
                </div>

            </div>
        </div>
    );
};
