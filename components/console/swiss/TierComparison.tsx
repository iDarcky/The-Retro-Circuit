'use client';

import { type FC } from 'react';
import { BAND_LABELS, bandOf, MIN_POPULATION_FOR_RANK } from '../../../lib/scoring/circuit-score';
import type { TierStats } from '../../../app/actions/scoring';

/* Where this device stands against the ones it competes with.
 *
 * Comparison is the site's reason to exist, and until now the console page did none of
 * it. Everything here is drawn from the same reach tier — comparing a Tier 1 handheld
 * against a Steam Deck would flatter or damn it for no useful reason.
 *
 * Bands rather than bare percentages: a quartile survives new consoles far better than
 * "cheaper than 78%" does, which matters because these pages are statically rendered
 * and may sit unbuilt for a while. The exact figure rides along as detail. */

interface Row {
    label: string;
    value: string;
    /** 0–1, higher is better. Price is inverted before it gets here. */
    percentile: number | null;
    detail?: string | null;
    tone: 'emerald' | 'violet' | 'cyan';
}

const TONE = {
    emerald: { text: 'text-emerald-400', fill: 'bg-emerald-400' },
    violet: { text: 'text-violet-400', fill: 'bg-violet-500' },
    cyan: { text: 'text-cyan-400', fill: 'bg-cyan-400' },
} as const;

const Bands: FC<{ band: number; fill: string }> = ({ band, fill }) => (
    <div className="flex gap-1 mt-3" aria-hidden="true">
        {[1, 2, 3, 4].map(n => (
            <span key={n} className={`h-1.5 flex-1 ${n <= band ? fill : 'bg-white/10'}`} />
        ))}
    </div>
);

const TierComparison: FC<{
    reach: number;
    stats?: TierStats;
    price: number | null;
    pricePercentile: number | null;
    score: number;
    scorePercentile: number | null;
    batteryMah?: number | null;
    batteryWh?: number | null;
    batteryPercentile: number | null;
}> = ({ reach, stats, price, pricePercentile, score, scorePercentile, batteryMah, batteryWh, batteryPercentile }) => {
    const tierSize = stats?.scores.length ?? 0;
    if (tierSize < MIN_POPULATION_FOR_RANK) {
        return (
            <div className="border border-white/10 bg-white/[0.02] p-4 font-mono text-[11px] text-gray-500">
                Only {tierSize} published Tier {reach} device{tierSize === 1 ? '' : 's'} to compare against —
                rankings appear once there are {MIN_POPULATION_FOR_RANK}.
            </div>
        );
    }

    const rows: Row[] = [];

    if (price !== null && pricePercentile !== null) {
        rows.push({
            label: 'Price',
            value: `$${price}`,
            // Cheap is good, so invert before banding.
            percentile: 1 - pricePercentile,
            detail: stats?.medianPrice ? `median $${stats.medianPrice}` : null,
            tone: 'emerald',
        });
    }

    if (scorePercentile !== null) {
        rows.push({
            label: 'Circuit Score',
            value: `${score} / 100`,
            percentile: scorePercentile,
            detail: stats?.medianScore ? `median ${stats.medianScore}` : null,
            tone: 'violet',
        });
    }

    // Wh where it is recorded, mAh otherwise. Converting mAh at an assumed 3.7 V would
    // be inventing a measurement, and it breaks exactly where it matters — the
    // multi-cell PC handhelds.
    const battery = batteryWh ? `${batteryWh} Wh` : batteryMah ? `${batteryMah} mAh` : null;
    if (battery && batteryPercentile !== null) {
        const med = batteryWh ? stats?.medianBatteryWh : stats?.medianBatteryMah;
        rows.push({
            label: 'Battery',
            value: battery,
            percentile: batteryPercentile,
            detail: med ? `median ${med} ${batteryWh ? 'Wh' : 'mAh'}` : null,
            tone: 'cyan',
        });
    }

    if (rows.length === 0) return null;

    return (
        <div>
            <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Against Tier {reach} devices
                </span>
                <span className="ml-auto font-mono text-[9.5px] uppercase tracking-wider text-gray-600">
                    {tierSize} published
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10">
                {rows.map(row => {
                    const band = bandOf(row.percentile!);
                    const tone = TONE[row.tone];
                    return (
                        <div key={row.label} className="bg-[#09090b] p-4">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">
                                {row.label}
                            </div>
                            <div className={`font-mono text-base font-bold tabular-nums ${tone.text}`}>{row.value}</div>
                            <Bands band={band} fill={tone.fill} />
                            <div className="font-mono text-[10px] text-gray-500 mt-2.5">
                                {BAND_LABELS[band]}
                                {row.detail && <> · {row.detail}</>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TierComparison;
