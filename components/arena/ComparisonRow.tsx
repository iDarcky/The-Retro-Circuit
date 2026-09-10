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

/** Reads a metric off a variant, following `path` for the nested input-profile fields. */
function readMetric(variant: any, metric: ComparisonMetric) {
    if (metric.path && metric.path.length > 0) {
        let current = variant;
        for (const key of metric.path) {
            if (current == null) return undefined;
            current = current[key];
        }
        return current;
    }
    return variant[metric.key];
}

const exists = (v: any) => v !== undefined && v !== null && v !== '';

/** Which side wins, or TIE when both are present and equal, or null when it is not a contest. */
export function decideWinner(metric: ComparisonMetric, rawA: any, rawB: any): 'A' | 'B' | 'TIE' | null {
    if (metric.neutral) return null;
    const numeric = metric.type === 'number' || metric.type === 'currency' || metric.type === 'resolution';
    if (!numeric || !exists(rawA) || !exists(rawB)) return null;

    const numA = Number(rawA);
    const numB = Number(rawB);
    if (Number.isNaN(numA) || Number.isNaN(numB)) return null;

    if (numA === numB) return numA > 0 ? 'TIE' : null;
    if (metric.lowerIsBetter) return numA < numB ? 'A' : 'B';
    return numA > numB ? 'A' : 'B';
}

/** True when the row has something to say — used to size a category before rendering it. */
export function rowIsVisible(metric: ComparisonMetric, varA: any, varB: any, showDiffOnly: boolean) {
    const rawA = readMetric(varA, metric);
    const rawB = readMetric(varB, metric);
    if (!exists(rawA) && !exists(rawB)) return false;
    if (showDiffOnly && rawA === rawB) return false;
    return true;
}

export const ComparisonRow: FC<ComparisonRowProps> = ({ metric, varA, varB, showDiffOnly }) => {
    const rawA = readMetric(varA, metric);
    const rawB = readMetric(varB, metric);

    if (!rowIsVisible(metric, varA, varB, showDiffOnly)) return null;

    const winner = decideWinner(metric, rawA, rawB);

    const getDisplayValue = (val: any, variant: ConsoleVariant) => {
        if (!exists(val)) return <span className="text-text-muted">—</span>;

        if (metric.key === 'ram_mb') {
            const mb = Number(val);
            if (!Number.isNaN(mb) && mb >= 1024) return `${(mb / 1024).toFixed(0)} GB`;
            return `${mb} MB`;
        }
        if (metric.key === 'charging_speed_w') {
            return (
                <span>
                    {val}W
                    {variant.charging_tech && (
                        <span className="ml-1 hidden text-[11px] text-text-muted md:inline">({variant.charging_tech})</span>
                    )}
                </span>
            );
        }
        if (metric.type === 'boolean') return val === true || val === 'true' ? 'Yes' : 'No';
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution') {
            if (variant.screen_resolution_x && variant.screen_resolution_y) {
                return `${variant.screen_resolution_x} × ${variant.screen_resolution_y}`;
            }
            return <span className="text-text-muted">—</span>;
        }

        return `${val}${metric.unit || ''}`;
    };

    /* Weight and a left border carry the win, not a glow. The losing side stays fully
     * legible — it is the other half of the comparison, not a failure state — so it
     * takes a dimmer ink rather than the old grayscale filter. */
    const winA = 'border-l-2 border-blue-500 bg-blue-500/[0.06] font-bold text-white';
    const winB = 'border-l-2 border-red-500 bg-red-500/[0.06] font-bold text-white';
    const neutral = 'border-l-2 border-transparent text-text-secondary';
    const tie = 'border-l-2 border-transparent text-white';

    const classA = winner === 'A' ? winA : winner === 'TIE' ? tie : neutral;
    const classB = winner === 'B' ? winB : winner === 'TIE' ? tie : neutral;

    return (
        <div className="grid grid-cols-[1fr_6.5rem_1fr] items-stretch gap-px border-b border-border-subtle last:border-b-0 md:grid-cols-[1fr_11rem_1fr]">
            <div className={`min-w-0 px-3 py-2.5 font-mono text-sm tabular-nums md:text-right ${classA}`}>
                <span className="break-words">{getDisplayValue(rawA, varA)}</span>
            </div>

            <div className="flex min-w-0 items-center justify-center px-2 py-2.5">
                <span className="text-center font-mono text-[11px] uppercase leading-tight tracking-widest text-text-muted">
                    {metric.label}
                </span>
            </div>

            <div className={`min-w-0 px-3 py-2.5 text-right font-mono text-sm tabular-nums md:text-left ${classB}`}>
                <span className="break-words">{getDisplayValue(rawB, varB)}</span>
            </div>
        </div>
    );
};
