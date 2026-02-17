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
                winner = 'TIE'; // Might not need to highlight ties, but logic exists
            }
        }
    }

    const getDisplayValue = (val: any, variant: ConsoleVariant) => {
        if (!exists(val)) return <span className="text-text-muted">---</span>;

        if (metric.key === 'ram_mb') {
             const mb = Number(val);
             if (!isNaN(mb) && mb >= 1024) return `${(mb / 1024).toFixed(0)} GB`;
             return `${mb} MB`;
        }
        if (metric.key === 'charging_speed_w') {
            return (
                <span>
                    {val}W
                    {variant.charging_tech && <span className="text-[10px] text-text-muted ml-1 hidden md:inline">({variant.charging_tech})</span>}
                </span>
            );
        }
        if (metric.type === 'boolean') return (val === true || val === 'true') ? 'YES' : 'NO';
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution') {
             if (variant.screen_resolution_x && variant.screen_resolution_y) {
                 return `${variant.screen_resolution_x} x ${variant.screen_resolution_y}`;
             }
             return '---';
        }
        
        return `${val}${metric.unit || ''}`;
    };

    const displayA = getDisplayValue(rawA, varA);
    const displayB = getDisplayValue(rawB, varB);

    // Styling Logic
    const winClassA = "text-color-primary font-bold";
    const winClassB = "text-color-secondary font-bold";
    const loseClass = "text-text-secondary opacity-80";
    const tieClass = "text-text-primary";

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
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-border-subtle items-center hover:bg-white/5 transition-colors group px-2">

            {/* Player A (Left) */}
            <div className={`col-span-4 text-right font-mono text-xs md:text-sm flex justify-end items-center gap-2 ${classA}`}>
                {winner === 'A' && <span className="text-[10px] animate-pulse">▲</span>}
                {displayA}
            </div>

            {/* Label (Center) */}
            <div className="col-span-4 text-center border-l border-r border-border-subtle/30 h-full flex items-center justify-center">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">
                    {metric.label}
                </span>
            </div>

            {/* Player B (Right) */}
            <div className={`col-span-4 text-left font-mono text-xs md:text-sm flex justify-start items-center gap-2 ${classB}`}>
                {displayB}
                {winner === 'B' && <span className="text-[10px] animate-pulse">▲</span>}
            </div>
        </div>
    );
};
