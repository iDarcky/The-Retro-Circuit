'use client';

import { useState, useMemo } from 'react';
import { addConsoleVendorLink } from '../../app/actions/consoles';
import type { BuyLinkRow } from '../../app/actions/consoles';

type Filter = 'urgent' | 'published' | 'all';

export default function BuyLinkWorklistClient({ rows }: { rows: BuyLinkRow[] }) {
    const [filter, setFilter] = useState<Filter>('urgent');
    const [draft, setDraft] = useState<Record<string, { url: string; label: string }>>({});
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<Record<string, number>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const visible = useMemo(() => {
        if (filter === 'all') return rows;
        if (filter === 'published') return rows.filter((r) => r.status === 'published');
        return rows.filter((r) => r.status === 'published' && !r.has_asin && r.vendor_count === 0);
    }, [rows, filter]);

    const urgentCount = rows.filter(
        (r) => r.status === 'published' && !r.has_asin && r.vendor_count === 0
    ).length;

    const save = async (row: BuyLinkRow) => {
        const d = draft[row.console_id];
        if (!d?.url) return;
        setSaving(row.console_id);
        setErrors((e) => ({ ...e, [row.console_id]: '' }));

        const res = await addConsoleVendorLink(row.console_id, d.url, d.label || '');
        setSaving(null);

        if (!res.success) {
            setErrors((e) => ({ ...e, [row.console_id]: res.message || 'Failed' }));
            return;
        }
        setSaved((s) => ({ ...s, [row.console_id]: (s[row.console_id] ?? row.vendor_count) + 1 }));
        setDraft((d2) => ({ ...d2, [row.console_id]: { url: '', label: '' } }));
    };

    const TABS: { key: Filter; label: string }[] = [
        { key: 'urgent', label: `NO BUY PATH (${urgentCount})` },
        { key: 'published', label: `PUBLISHED (${rows.filter((r) => r.status === 'published').length})` },
        { key: 'all', label: `ALL (${rows.length})` },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4 border-b border-white/10 pb-3">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setFilter(t.key)}
                        className={`font-mono text-xs uppercase tracking-widest pb-1 transition-colors ${
                            filter === t.key
                                ? 'text-white border-b border-orange-500'
                                : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <ul className="flex flex-col gap-2">
                {visible.map((row) => {
                    const count = saved[row.console_id] ?? row.vendor_count;
                    const d = draft[row.console_id] || { url: '', label: '' };
                    const err = errors[row.console_id];

                    return (
                        <li key={row.console_id} className="border border-white/10 p-4 bg-white/[0.01]">
                            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                                <div className="flex items-baseline gap-3 min-w-0">
                                    <a
                                        href={`/consoles/${row.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-sm text-white hover:text-cyan-400 truncate"
                                    >
                                        {row.brand ? `${row.brand} ` : ''}{row.name}
                                    </a>
                                    <span className="font-mono text-[10px] text-gray-600 uppercase">{row.status}</span>
                                </div>
                                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider shrink-0">
                                    <span className={row.has_asin ? 'text-green-500' : 'text-gray-600'}>
                                        {row.has_asin ? 'ASIN ✓' : 'NO ASIN'}
                                    </span>
                                    <span className={count > 0 ? 'text-green-500' : 'text-rose-500'}>
                                        {count} VENDOR{count === 1 ? '' : 'S'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <input
                                    type="url"
                                    value={d.url}
                                    onChange={(e) =>
                                        setDraft((s) => ({ ...s, [row.console_id]: { ...d, url: e.target.value } }))
                                    }
                                    placeholder="https://  full product URL, no affiliate tags"
                                    className="flex-1 min-w-[240px] bg-black border border-gray-700 focus:border-cyan-500 outline-none p-2 font-mono text-xs text-white"
                                />
                                <input
                                    type="text"
                                    value={d.label}
                                    onChange={(e) =>
                                        setDraft((s) => ({ ...s, [row.console_id]: { ...d, label: e.target.value } }))
                                    }
                                    placeholder="Label (e.g. AliExpress)"
                                    className="w-[180px] bg-black border border-gray-700 focus:border-cyan-500 outline-none p-2 font-mono text-xs text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => save(row)}
                                    disabled={!d.url || saving === row.console_id}
                                    className="px-4 py-2 border border-cyan-500/50 text-cyan-400 font-mono text-xs uppercase tracking-wider hover:bg-cyan-500 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cyan-400 transition-colors"
                                >
                                    {saving === row.console_id ? 'SAVING' : 'ADD'}
                                </button>
                            </div>

                            {err && (
                                <p className="mt-2 font-mono text-[10px] text-rose-500 uppercase tracking-wider">! {err}</p>
                            )}
                        </li>
                    );
                })}
            </ul>

            {visible.length === 0 && (
                <p className="font-mono text-xs text-gray-600 uppercase tracking-wider py-8 text-center">
                    Nothing in this bucket.
                </p>
            )}
        </div>
    );
}
