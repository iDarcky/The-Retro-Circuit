'use client';

import { useMemo, useState, useTransition } from 'react';
import { setVariantAsin } from '../../app/actions/commerce';
import { type AsinRow } from '../../app/actions/commerce';

type Filter = 'MISSING' | 'HAS' | 'ALL';

/**
 * ASIN backfill worklist.
 *
 * Only 13 of 273 variants carry an ASIN, so nearly every buy button falls back to an
 * Amazon *search* link. Amazon pays on qualifying sales and search links convert far
 * worse, which makes this the highest-value data gap on the site. Published devices
 * sort first because they are the only ones anyone can currently reach.
 */
export default function AsinWorklistClient({ rows }: { rows: AsinRow[] }) {
    const [filter, setFilter] = useState<Filter>('MISSING');
    const [search, setSearch] = useState('');
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState<Record<string, 'ok' | string>>({});
    const [pending, startTransition] = useTransition();

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows
            .filter((r) => (filter === 'ALL' ? true : filter === 'HAS' ? !!r.amazon_asin : !r.amazon_asin))
            .filter((r) => !q || `${r.brand} ${r.console_name} ${r.variant_name}`.toLowerCase().includes(q))
            .sort((a, b) => {
                if (a.status !== b.status) return a.status === 'published' ? -1 : 1;
                return `${a.brand} ${a.console_name}`.localeCompare(`${b.brand} ${b.console_name}`);
            });
    }, [rows, filter, search]);

    const counts = useMemo(() => ({
        missing: rows.filter((r) => !r.amazon_asin).length,
        has: rows.filter((r) => r.amazon_asin).length,
        publishedMissing: rows.filter((r) => !r.amazon_asin && r.status === 'published').length,
    }), [rows]);

    const save = (r: AsinRow) => {
        const value = drafts[r.variant_id] ?? r.amazon_asin ?? '';
        startTransition(async () => {
            const res = await setVariantAsin(r.variant_id, value || null);
            setSaved((s) => ({ ...s, [r.variant_id]: res.success ? 'ok' : res.message || 'failed' }));
        });
    };

    /* Keyboard path: Enter saves and moves to the next row, Escape reverts the field.
     * At 501 rows the difference between four seconds and fifteen is an afternoon. */
    const focusRow = (index: number) => {
        const next = visible[index];
        if (!next) return;
        const el = document.querySelector<HTMLInputElement>(`input[data-asin-row="${next.variant_id}"]`);
        el?.focus();
        el?.select();
    };

    const onFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: AsinRow, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            save(r);
            focusRow(index + 1);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const el = e.currentTarget;
            el.value = r.amazon_asin || '';
            setDrafts((d) => ({ ...d, [r.variant_id]: r.amazon_asin || '' }));
            el.blur();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-6 border border-white/10 p-4">
                <Stat label="Missing" value={counts.missing} tone="rose" />
                <Stat label="Published & missing" value={counts.publishedMissing} tone="orange" />
                <Stat label="Have an ASIN" value={counts.has} tone="green" />
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                <span><kbd className="border border-white/15 px-1.5 py-0.5">Enter</kbd> save &amp; next row</span>
                <span><kbd className="border border-white/15 px-1.5 py-0.5">Esc</kbd> revert</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {(['MISSING', 'HAS', 'ALL'] as Filter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition-colors ${
                            filter === f
                                ? 'bg-white text-black border-white'
                                : 'border-white/10 text-gray-400 hover:border-white/40'
                        }`}
                    >
                        [ {f} ]
                    </button>
                ))}
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter by brand or device…"
                    className="flex-1 min-w-[220px] bg-transparent border border-white/10 px-3 py-2 font-mono text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500"
                />
            </div>

            <div className="overflow-x-auto border border-white/10">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10">
                            <Th>Device</Th><Th>Variant</Th><Th>Status</Th><Th>ASIN</Th><Th> </Th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((r, rowIndex) => {
                            const state = saved[r.variant_id];
                            return (
                                <tr key={r.variant_id} className="border-b border-white/5">
                                    <td className="px-4 py-3">
                                        <a
                                            href={`https://www.amazon.com/s?k=${encodeURIComponent(`${r.brand ?? ''} ${r.console_name}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:bg-white hover:text-black"
                                        >
                                            {r.brand} {r.console_name}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.variant_name || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-mono text-[10px] uppercase ${
                                            r.status === 'published' ? 'text-green-400' : 'text-gray-500'
                                        }`}>{r.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            data-asin-row={r.variant_id}
                                            defaultValue={r.amazon_asin || ''}
                                            onChange={(e) => setDrafts((d) => ({ ...d, [r.variant_id]: e.target.value }))}
                                            onKeyDown={(e) => onFieldKeyDown(e, r, rowIndex)}
                                            aria-label={`Amazon ASIN for ${r.console_name} ${r.variant_name || ''}`}
                                            placeholder="B0XXXXXXXX"
                                            maxLength={10}
                                            className="w-36 bg-transparent border border-white/10 px-2 py-1 font-mono text-xs uppercase text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500"
                                        />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button
                                            onClick={() => save(r)}
                                            disabled={pending}
                                            className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-white/10 text-gray-300 hover:bg-white hover:text-black disabled:opacity-40"
                                        >
                                            Save
                                        </button>
                                        {state === 'ok' && <span className="ml-2 font-mono text-[10px] text-green-400">saved</span>}
                                        {state && state !== 'ok' && <span className="ml-2 font-mono text-[10px] text-rose-500">{state}</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {visible.length === 0 && (
                    <p className="px-4 py-6 font-mono text-xs text-gray-500">Nothing matches that filter.</p>
                )}
            </div>
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-gray-500">{children}</th>;
}

function Stat({ label, value, tone }: { label: string; value: number; tone: 'rose' | 'orange' | 'green' }) {
    const color = tone === 'rose' ? 'text-rose-500' : tone === 'orange' ? 'text-orange-500' : 'text-green-400';
    return (
        <div className="flex flex-col gap-1">
            <span className={`font-mono text-2xl font-bold ${color}`}>{value}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{label}</span>
        </div>
    );
}
