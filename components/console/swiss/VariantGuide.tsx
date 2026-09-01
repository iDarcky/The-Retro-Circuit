'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { buildArenaToken, buildArenaPath } from '../../../lib/arena/resolve';
import type { ConsoleVariant } from '../../../lib/types';

/* Which configuration to actually buy.
 *
 * 38 of the published consoles ship in more than one configuration, and on every one of
 * them the variant count equals the distinct price count, so the choice always costs
 * money. Retro Catalog lists the base model, or the Pro if there is one, and cannot
 * answer this at all. It is the one question this site is uniquely able to settle, and
 * until now the page did not even show the configurations side by side.
 *
 * Deliberately not a recommendation. It shows what changes between configurations and
 * what each step costs, then lets the reader decide. Calling a winner would be
 * opinionated copy, which has to be human-written, and the right answer genuinely
 * depends on what the buyer wants to run.
 */

interface Row {
    key: string;
    label: string;
    /** Rendered per variant. Return null to leave the cell blank. */
    value: (v: any) => string | null;
}

/* Only the axes buyers actually choose between. A spec that is identical across every
 * configuration is noise here: the full table is one click away. */
const CANDIDATE_ROWS: Row[] = [
    { key: 'ram', label: 'RAM', value: v => v.ram_mb ? (v.ram_mb >= 1024 ? `${Math.round(v.ram_mb / 1024)} GB` : `${v.ram_mb} MB`) : null },
    {
        key: 'storage', label: 'Storage', value: v => {
            const mb = v.storage_mb ?? (v.storage_gb ? v.storage_gb * 1024 : null);
            if (!mb) return null;
            if (mb >= 1024 * 1024) return `${+(mb / 1024 / 1024).toFixed(2)} TB`;
            if (mb >= 1024) return `${Math.round(mb / 1024)} GB`;
            return `${mb} MB`;
        },
    },
    { key: 'soc', label: 'Chip', value: v => [v.soc_vendor, v.soc_name].filter(Boolean).join(' ') || v.soc || null },
    { key: 'screen', label: 'Screen', value: v => v.screen_size_inch ? `${v.screen_size_inch}"` : null },
    { key: 'res', label: 'Resolution', value: v => (v.screen_resolution_x && v.screen_resolution_y) ? `${v.screen_resolution_x} x ${v.screen_resolution_y}` : null },
    { key: 'battery', label: 'Battery', value: v => v.battery_capacity_wh ? `${v.battery_capacity_wh} Wh` : v.battery_capacity_mah ? `${v.battery_capacity_mah} mAh` : null },
    { key: 'colour', label: 'Colour', value: v => Array.isArray(v.colors) ? v.colors.join(', ') : (v.colors || null) },
];

const priceOf = (v: any): number | null => {
    const p = v.price_avg_usd ?? v.price_launch_usd ?? null;
    return typeof p === 'number' && p > 0 ? p : null;
};

const VariantGuide: FC<{
    variants: ConsoleVariant[];
    selectedId?: string;
    onSelect?: (id: string) => void;
    /** Needed to build the configuration comparison URLs. */
    consoleSlug?: string;
}> = ({ variants, selectedId, onSelect, consoleSlug }) => {
    if (!variants || variants.length < 2) return null;

    // Cheapest first, so the price steps read as upgrades rather than an arbitrary order.
    const ordered = [...variants].sort((a, b) => (priceOf(a) ?? Infinity) - (priceOf(b) ?? Infinity));

    // Keep only the rows where configurations actually differ.
    const rows = CANDIDATE_ROWS.filter(r => {
        const values = ordered.map(v => r.value(v));
        const filled = values.filter(Boolean);
        return filled.length > 0 && new Set(filled).size > 1;
    });

    const base = priceOf(ordered[0]);

    /* Consecutive pairs, cheapest upward: the comparison a buyer actually makes is
     * "is the next one up worth it", not every combination against every other. */
    const steps: [{ slug: string; name: string; price: number | null }, { slug: string; name: string; price: number | null }][] = [];
    const addressable = ordered
        .map(v => ({ slug: (v as any).slug as string | undefined, name: v.variant_name || 'Base', price: priceOf(v) }))
        .filter((v): v is { slug: string; name: string; price: number | null } => Boolean(v.slug));
    for (let i = 0; i + 1 < addressable.length; i++) {
        steps.push([addressable[i], addressable[i + 1]]);
    }

    if (rows.length === 0) {
        return (
            <div className="border border-white/10 bg-white/[0.02] p-4 font-mono text-[11px] text-gray-500">
                {ordered.length} configurations are listed, but the specs recorded for them are
                identical. If they differ in the real world, that is a gap in our data.
            </div>
        );
    }

    return (
        <div>
            <div className="overflow-x-auto border border-white/10">
                <table className="w-full border-collapse min-w-[520px]">
                    <thead>
                        <tr>
                            <th className="rc-panel sticky left-0 z-10 text-left align-bottom p-3 border-b border-r border-white/10 w-[110px]">
                                <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Configuration</span>
                            </th>
                            {ordered.map(v => {
                                const price = priceOf(v);
                                const isSel = v.id === selectedId;
                                return (
                                    <th key={v.id} className={`p-0 text-left align-bottom border-b border-r border-white/10 last:border-r-0 ${isSel ? 'bg-white' : ''}`}>
                                        <button
                                            type="button"
                                            onClick={() => onSelect?.(v.id)}
                                            className="w-full text-left group p-3 transition-colors hover:bg-white/[0.04]"
                                            aria-pressed={isSel}
                                        >
                                            <span className={`block font-mono text-[10px] uppercase tracking-wider mb-1 transition-colors ${isSel ? 'text-black/60' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                                {v.variant_name || 'Base'}
                                            </span>
                                            <span className={`block font-mono text-[17px] font-bold tabular-nums ${isSel ? 'text-black' : 'text-white'}`}>
                                                {price ? `$${price}` : '--'}
                                            </span>
                                            {price && base && price > base && (
                                                <span className={`block font-mono text-[9.5px] mt-0.5 tabular-nums ${isSel ? 'text-black/60' : 'text-emerald-400'}`}>
                                                    +${price - base}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => {
                            const values = ordered.map(v => r.value(v));
                            // Highlight only where a cell differs from the cheapest one.
                            const baseVal = values[0];
                            return (
                                <tr key={r.key}>
                                    <th scope="row" className="rc-panel sticky left-0 z-10 text-left p-3 border-b border-r border-white/10 font-mono text-[10px] uppercase tracking-wider text-gray-500 font-normal">
                                        {r.label}
                                    </th>
                                    {values.map((val, i) => (
                                        <td
                                            key={ordered[i].id}
                                            className={`p-3 border-b border-r border-white/10 last:border-r-0 font-mono text-xs tabular-nums ${
                                                ordered[i].id === selectedId ? 'bg-white/[0.06]' : ''
                                            } ${val && val !== baseVal ? 'text-white' : 'text-gray-500'}`}
                                        >
                                            {val || <span className="text-gray-700">&mdash;</span>}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="font-mono text-[9.5px] text-gray-600 mt-3 leading-relaxed">
                Only the specs that change between configurations are shown. Values in white
                differ from the cheapest option. Pick one to update the rest of the page.
            </p>

            {/* Each step up, as its own comparison page.
             *
             * These are the pages nothing else on the internet has: a competitor that
             * lists the base model, or the Pro if there is one, cannot compare two
             * configurations of the same device. The consecutive steps are the ones
             * prebuilt in lib/arena/pairs.ts, so every link here lands on static HTML. */}
            {consoleSlug && steps.length > 0 && (
                <div className="mt-5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2.5">
                        Compare the steps
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {steps.map(([a, b]) => (
                            <Link
                                key={`${a.slug}-${b.slug}`}
                                href={buildArenaPath(
                                    buildArenaToken(consoleSlug, a.slug),
                                    buildArenaToken(consoleSlug, b.slug),
                                )}
                                className="flex items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[10.5px]
                                           text-gray-400 hover:border-violet-500/60 hover:text-violet-300 transition-colors"
                            >
                                <span>{a.name} vs {b.name}</span>
                                {a.price && b.price && (
                                    <span className="text-[9px] text-emerald-400 tabular-nums">+${b.price - a.price}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantGuide;
