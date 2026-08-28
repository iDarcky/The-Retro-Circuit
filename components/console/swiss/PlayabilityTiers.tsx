'use client';

import { useState, type FC } from 'react';
import { SYSTEM_TIERS, SCORE_MAP } from '../../../lib/config/emulation';
import type { EmulationProfile } from '../../../lib/types';

/* Playability, one row per tier.
 *
 * 23 systems fit no single row at any width, and an auto-fit grid left ragged gaps.
 * A row per tier fills naturally and makes the tier structure visible instead of
 * implied — which matters because the tier is what the Circuit Score's Reach measures.
 *
 * Ungraded systems are hidden rather than shown empty: a blank cell reads as "bad at
 * Xbox" when it means "nobody has tested it". The count of what is hidden is printed
 * underneath so the omission is visible. */

const GRADE_CLASS: Record<number, string> = {
    5: 'bg-emerald-400',
    4: 'bg-cyan-400',
    3: 'bg-violet-500',
    2: 'bg-orange-500',
    1: 'bg-rose-500',
};

/** Minimum grade each filter admits. */
const FILTERS = [
    { key: 'all', label: 'All graded', min: 1 },
    { key: 'playable', label: 'Playable+', min: 3 },
    { key: 'great', label: 'Great+', min: 4 },
    { key: 'perfect', label: 'Perfect', min: 5 },
] as const;

type FilterKey = typeof FILTERS[number]['key'];

const PlayabilityTiers: FC<{ profile?: EmulationProfile | null }> = ({ profile }) => {
    const [filter, setFilter] = useState<FilterKey>('all');
    if (!profile) return null;

    const min = FILTERS.find(f => f.key === filter)?.min ?? 1;

    const rows = SYSTEM_TIERS.map((tier, i) => {
        const systems = tier.systems
            .map(sys => ({ ...sys, grade: String((profile as any)[sys.key] ?? '') }))
            .filter(s => s.grade && SCORE_MAP[s.grade] > 0);
        return { n: i + 1, title: tier.title.replace(/^TIER \d+:\s*/, ''), systems };
    }).filter(r => r.systems.length > 0);

    if (rows.length === 0) return null;

    const shown = rows.reduce((n, r) => n + r.systems.length, 0);
    const total = SYSTEM_TIERS.reduce((n, t) => n + t.systems.length, 0);

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Playability by system
                </span>
                <div className="flex gap-px ml-auto" role="group" aria-label="Filter systems by grade">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => setFilter(f.key)}
                            aria-pressed={filter === f.key}
                            className={`px-2.5 py-1.5 border font-mono text-[9px] uppercase tracking-wider transition-colors ${
                                filter === f.key
                                    ? 'border-white text-white'
                                    : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border border-white/10">
                {rows.map(row => (
                    <div key={row.n} className="grid grid-cols-1 sm:grid-cols-[130px_1fr] border-b border-white/10 last:border-b-0">
                        <div className="px-4 py-3 bg-white/[0.02] border-b sm:border-b-0 sm:border-r border-white/10">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-600">Tier {row.n}</div>
                            <div className="font-mono text-[11px] text-gray-400 mt-1">{row.title}</div>
                        </div>

                        {/* Horizontally scrollable rather than reflowing: a tier is a unit. */}
                        <div className="flex overflow-x-auto">
                            {row.systems.map(sys => {
                                const value = SCORE_MAP[sys.grade] ?? 0;
                                const dim = value < min;
                                return (
                                    <div
                                        key={sys.key}
                                        title={`${sys.label} — ${sys.grade}`}
                                        className={`flex-1 min-w-[92px] px-3 py-3 border-r border-white/10 last:border-r-0 transition-opacity ${
                                            dim ? 'opacity-25' : ''
                                        }`}
                                    >
                                        <div className="font-mono text-[9.5px] text-gray-400 truncate">{sys.label}</div>
                                        <div className="flex gap-0.5 mt-2" aria-hidden="true">
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <span
                                                    key={n}
                                                    className={`h-1.5 flex-1 ${n <= value ? GRADE_CLASS[value] : 'bg-white/10'}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="font-mono text-[8.5px] uppercase tracking-wider text-gray-600 mt-1.5">
                                            {sys.grade}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="font-mono text-[9px] uppercase tracking-wider text-gray-600 mt-3">
                {shown} of {total} systems graded
                {shown < total && <> · the rest are untested, not unplayable</>}
            </div>
        </div>
    );
};

export default PlayabilityTiers;
