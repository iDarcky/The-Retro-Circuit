import { type FC } from 'react';
import { ConsoleVariant } from '../../lib/types';
import { METRICS } from '../../lib/config/arena-metrics';

interface ComparisonRowProps {
    metric: typeof METRICS[0];
    varA: ConsoleVariant;
    varB: ConsoleVariant;
    showDiffOnly: boolean;
}

const ComparisonRow: FC<ComparisonRowProps> = ({
    metric,
    varA,
    varB,
    showDiffOnly
}) => {
    const rawA = varA[metric.key];
    const rawB = varB[metric.key];

    const exists = (v: any) => v !== undefined && v !== null && v !== '';
    const hasA = exists(rawA);
    const hasB = exists(rawB);

    if (!hasA && !hasB) return null;
    if (showDiffOnly && rawA === rawB) return null;

    let winner: 'A' | 'B' | 'TIE' | null = null;

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

    const formatValue = (val: any, variant: ConsoleVariant) => {
        if (!exists(val)) return <span className="text-gray-700">---</span>;

        // Smart RAM Formatting
        if (metric.key === 'ram_mb') {
            const mb = Number(val);
            if (!isNaN(mb) && mb >= 1024) {
                return `${(mb / 1024).toFixed(0)} GB`;
            }
            return `${mb} MB`;
        }

        // Charging Tech Combination
        if (metric.key === 'charging_speed_w') {
            const tech = variant.charging_tech;
            return (
                <span>
                    {val}W
                    {tech && <span className="text-[10px] text-gray-500 ml-1 block md:inline">({tech})</span>}
                </span>
            );
        }

        if (metric.type === 'boolean') return (val === true || val === 'true') ? 'YES' : 'NO';
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution' && variant.screen_resolution_y) return `${val}p`;

        return `${val}${metric.unit ? metric.unit : ''}`;
    };

    const getResString = (v: ConsoleVariant) => {
        if (v.screen_resolution_x && v.screen_resolution_y) return `${v.screen_resolution_x} x ${v.screen_resolution_y}`;
        return '---';
    };

    const valDisplayA = metric.type === 'resolution' ? getResString(varA) : formatValue(rawA, varA);
    const valDisplayB = metric.type === 'resolution' ? getResString(varB) : formatValue(rawB, varB);

    const winClassA = "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] font-bold";
    const winClassB = "text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)] font-bold";
    const loseClass = "text-gray-400 opacity-80";
    const tieClass = "text-white";

    const classA = winner === 'A' ? winClassA : (winner === 'TIE' ? tieClass : loseClass);
    const classB = winner === 'B' ? winClassB : (winner === 'TIE' ? tieClass : loseClass);

    return (
        <div className="grid grid-cols-12 gap-2 py-3 border-b border-white/5 items-center hover:bg-white/5 transition-colors group">
            <div className={`col-span-4 text-right font-mono text-xs md:text-sm flex justify-end items-center gap-2 ${classA}`}>
                {winner === 'A' && <span className="text-[10px]">▲</span>}
                {valDisplayA}
            </div>
            <div className="col-span-4 text-center">
                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest group-hover:text-white transition-colors">{metric.label}</span>
            </div>
            <div className={`col-span-4 text-left font-mono text-xs md:text-sm flex justify-start items-center gap-2 ${classB}`}>
                {valDisplayB}
                {winner === 'B' && <span className="text-[10px]">▲</span>}
            </div>
        </div>
    );
};

export default ComparisonRow;
