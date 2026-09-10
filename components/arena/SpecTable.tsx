'use client';

import { useMemo, useState } from 'react';
import { ConsoleVariant } from '../../lib/types';
import { METRICS } from '../../lib/config/arena-metrics';
import { ComparisonRow, rowIsVisible } from './ComparisonRow';

interface SpecTableProps {
    variantA: ConsoleVariant;
    variantB: ConsoleVariant;
    nameA: string;
    nameB: string;
}

/* The full specification comparison.
 *
 * Two decisions carry this component, both of them about what a comparison page is for.
 *
 * It is open. The table used to sit inside a collapsed accordion, so somebody arriving
 * from a search for "pocket s vs odin 3" — which is most of this page's traffic — landed
 * on a page whose comparison was one click away and invisible.
 *
 * It shows differences first. On a page whose whole job is telling two devices apart,
 * the rows where they agree are the noise, not the signal. "Diff only" existed before as
 * an unchecked box buried inside the collapsed panel; here it is the default, and the
 * control that turns it off says how many identical rows it would add.
 *
 * The 76 metrics render in the ten groups the config already named, rather than as one
 * undifferentiated run of hairlines.
 */
export function SpecTable({ variantA, variantB, nameA, nameB }: SpecTableProps) {
    const [showDiffOnly, setShowDiffOnly] = useState(true);

    const { groups, diffCount, totalCount } = useMemo(() => {
        const order: string[] = [];
        const byCategory = new Map<string, typeof METRICS>();

        for (const metric of METRICS) {
            const category = metric.category ?? 'Other';
            if (!byCategory.has(category)) {
                byCategory.set(category, []);
                order.push(category);
            }
            byCategory.get(category)!.push(metric);
        }

        const diffs = METRICS.filter((m) => rowIsVisible(m, variantA, variantB, true)).length;
        const total = METRICS.filter((m) => rowIsVisible(m, variantA, variantB, false)).length;

        return {
            groups: order.map((category) => ({ category, metrics: byCategory.get(category)! })),
            diffCount: diffs,
            totalCount: total,
        };
    }, [variantA, variantB]);

    const identicalCount = totalCount - diffCount;
    const visibleGroups = groups
        .map((group) => ({
            ...group,
            metrics: group.metrics.filter((m) => rowIsVisible(m, variantA, variantB, showDiffOnly)),
        }))
        .filter((group) => group.metrics.length > 0);

    return (
        <section className="border border-border-subtle" aria-labelledby="spec-table-heading">
            <div className="flex flex-col gap-3 border-b border-border-subtle px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                <div>
                    <h2 id="spec-table-heading" className="font-mono text-lg font-bold tracking-tight text-white">
                        Full specifications
                    </h2>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-text-muted">
                        {diffCount} {diffCount === 1 ? 'difference' : 'differences'} on record
                    </p>
                </div>

                <div className="flex" role="group" aria-label="Which rows to show">
                    <button
                        type="button"
                        onClick={() => setShowDiffOnly(true)}
                        aria-pressed={showDiffOnly}
                        className={`touch-manipulation border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                            showDiffOnly
                                ? 'border-white bg-white text-black'
                                : 'border-border-normal text-text-secondary hover:text-white'
                        }`}
                    >
                        Differences
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowDiffOnly(false)}
                        aria-pressed={!showDiffOnly}
                        className={`-ml-px touch-manipulation border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                            !showDiffOnly
                                ? 'border-white bg-white text-black'
                                : 'border-border-normal text-text-secondary hover:text-white'
                        }`}
                    >
                        All {totalCount}
                    </button>
                </div>
            </div>

            {/* Which column is which, restated here because the table is long enough to
              * scroll the device header off the screen. */}
            <div className="grid grid-cols-[1fr_6.5rem_1fr] items-center gap-px border-b border-border-subtle bg-bg-secondary/40 md:grid-cols-[1fr_11rem_1fr]">
                <div className="min-w-0 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-blue-400 md:text-right">
                    <span className="line-clamp-1">{nameA}</span>
                </div>
                <div aria-hidden className="px-2 py-2 text-center font-mono text-[11px] uppercase tracking-widest text-text-muted">
                    vs
                </div>
                <div className="min-w-0 px-3 py-2 text-right font-mono text-[11px] font-bold uppercase tracking-widest text-red-400 md:text-left">
                    <span className="line-clamp-1">{nameB}</span>
                </div>
            </div>

            {visibleGroups.length === 0 ? (
                <p className="px-4 py-10 text-center text-text-secondary md:px-6">
                    These two configurations match on every spec on record.{' '}
                    <button
                        type="button"
                        onClick={() => setShowDiffOnly(false)}
                        className="border-b border-violet-500 font-mono text-sm text-white transition-colors hover:text-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                    >
                        Show all {totalCount} rows
                    </button>
                </p>
            ) : (
                visibleGroups.map((group) => (
                    <div key={group.category}>
                        <h3 className="border-b border-border-subtle bg-bg-secondary/60 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-text-secondary">
                            {group.category}
                        </h3>
                        {group.metrics.map((metric) => (
                            <ComparisonRow
                                key={`${metric.key}-${metric.label}`}
                                metric={metric}
                                varA={variantA}
                                varB={variantB}
                                showDiffOnly={showDiffOnly}
                            />
                        ))}
                    </div>
                ))
            )}

            {showDiffOnly && identicalCount > 0 && visibleGroups.length > 0 && (
                <div className="border-t border-border-subtle px-4 py-4 text-center md:px-6">
                    <button
                        type="button"
                        onClick={() => setShowDiffOnly(false)}
                        className="touch-manipulation border border-border-normal px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                    >
                        Show {identicalCount} identical {identicalCount === 1 ? 'row' : 'rows'}
                    </button>
                </div>
            )}
        </section>
    );
}
