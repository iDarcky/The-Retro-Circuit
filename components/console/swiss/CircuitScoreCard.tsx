'use client';

import { type FC } from 'react';
import {
    SCORE_WEIGHTS, BAND_LABELS, bandOf, MIN_POPULATION_FOR_RANK,
    type CircuitScore,
} from '../../../lib/scoring/circuit-score';

/* The score, its parts, and where it stands.
 *
 * The stacked bar is the formula made visible: a device at 84 built from Reach 40 /
 * Polish 26 / Feel 18 is a different proposition from one at 84 built from Reach 24 /
 * Polish 35 / Feel 25, and the bar says so without a word. */

interface Props {
    score: CircuitScore;
    percentile: number | null;
    tierSize: number;
    medianScore: number | null;
    compact?: boolean;
}

const PART_COLOURS = {
    reach: 'bg-violet-500',
    polish: 'bg-cyan-400',
    feel: 'bg-emerald-400',
} as const;

const CircuitScoreCard: FC<Props> = ({ score, percentile, tierSize, medianScore, compact = false }) => {
    const total = SCORE_WEIGHTS.reach + SCORE_WEIGHTS.polish + SCORE_WEIGHTS.feel;
    const rankable = percentile !== null && tierSize >= MIN_POPULATION_FOR_RANK;
    const topPct = rankable ? Math.max(1, Math.round((1 - percentile!) * 100)) : null;

    return (
        <div className="border border-white/10 bg-white/[0.02] p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-3">
                Circuit Score
            </div>

            <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-pixel text-3xl md:text-4xl text-violet-400 leading-none tabular-nums">
                    {score.score}
                </span>
                <span className="font-mono text-xs text-gray-600">/ 100</span>
                {rankable && (
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                        Top {topPct}% of Tier {score.reach}
                    </span>
                )}
            </div>

            {/* Parts, to scale against the full 100 so the empty space is legible too. */}
            <div
                className="flex h-2 mt-4 border border-white/10"
                role="img"
                aria-label={`Reach ${score.parts.reach}, Polish ${score.parts.polish}, Feel ${score.parts.feel} out of ${total}`}
            >
                <span className={PART_COLOURS.reach} style={{ width: `${score.parts.reach}%` }} />
                <span className={PART_COLOURS.polish} style={{ width: `${score.parts.polish}%` }} />
                <span className={PART_COLOURS.feel} style={{ width: `${score.parts.feel}%` }} />
            </div>

            {!compact && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                    <span><i className={`inline-block w-2 h-2 mr-1.5 ${PART_COLOURS.reach}`} />Reach {score.parts.reach}</span>
                    <span><i className={`inline-block w-2 h-2 mr-1.5 ${PART_COLOURS.polish}`} />Polish {score.parts.polish}</span>
                    {score.feel !== null
                        ? <span><i className={`inline-block w-2 h-2 mr-1.5 ${PART_COLOURS.feel}`} />Feel {score.parts.feel}</span>
                        : <span className="text-gray-600">Feel not scored — weights rescaled</span>}
                </div>
            )}

            <div className="font-mono text-[10px] text-gray-500 mt-3 leading-relaxed">
                Reach T{score.reach}
                {score.graded > 0 && <> · {Math.round(score.polish * 100)}% of {score.graded} systems Great+</>}
                {medianScore !== null && tierSize >= MIN_POPULATION_FOR_RANK && (
                    <> · tier median {medianScore}</>
                )}
            </div>
        </div>
    );
};

export default CircuitScoreCard;

/* A price card that also says where the price sits, and what the score costs. */
export const PriceCard: FC<{
    price: number | null;
    percentile: number | null;
    tierSize: number;
    medianPrice: number | null;
    valuePercentile: number | null;
}> = ({ price, percentile, tierSize, medianPrice, valuePercentile }) => {
    const rankable = percentile !== null && tierSize >= MIN_POPULATION_FOR_RANK;
    // Cheap is good, so the price band is inverted before it is labelled.
    const band = rankable ? bandOf(1 - percentile!) : null;

    return (
        <div className="border border-white/10 bg-white/[0.02] p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-3">Price</div>
            {price ? (
                <>
                    <div className="font-pixel text-3xl md:text-4xl text-emerald-400 leading-none tabular-nums">
                        ${price}
                    </div>
                    {band !== null && (
                        <div className="flex gap-1 mt-4" aria-hidden="true">
                            {[1, 2, 3, 4].map(n => (
                                <span key={n} className={`h-1.5 flex-1 ${n <= band ? 'bg-emerald-400' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    )}
                    <div className="font-mono text-[10px] text-gray-500 mt-3 leading-relaxed">
                        {band !== null
                            ? <>{BAND_LABELS[band]} for Tier price{medianPrice ? <> · median ${medianPrice}</> : null}</>
                            : <>Not enough published devices in this tier to rank</>}
                        {valuePercentile !== null && valuePercentile >= 0.75 && (
                            <span className="text-emerald-400"> · strong value</span>
                        )}
                    </div>
                </>
            ) : (
                <div className="font-pixel text-lg text-gray-600 leading-none">—</div>
            )}
        </div>
    );
};
