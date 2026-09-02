'use client';

import { useState, useMemo, type FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setLinkApproval, setConsoleLinksApproval } from '../../app/actions/commerce';
import type { LinkReviewConsole } from '../../app/actions/commerce';

/* Triage for the 1,332 imported links.
 *
 * None of them were chosen: 821 video reviews pointing at other people's channels, 433
 * vendor links, 78 written reviews, all inherited from a spreadsheet and rendering on
 * live product pages. Nothing is public now, and this is where it earns its way back.
 *
 * Grouped by console rather than listed flat, because the decision is per device: "are
 * these the right links for the Thor" is answerable, "is link 704 of 1332 good" is not.
 * Published consoles sort first, since those are the pages currently showing nothing.
 */

const KIND_LABEL: Record<string, string> = {
    vendor: 'Buy',
    official: 'Official',
    video_review: 'Video',
    written_review: 'Article',
    other: 'Other',
};

const KIND_TONE: Record<string, string> = {
    vendor: 'text-emerald-400 border-emerald-500/40',
    official: 'text-cyan-400 border-cyan-500/40',
    video_review: 'text-violet-400 border-violet-500/40',
    written_review: 'text-violet-400 border-violet-500/40',
    other: 'text-gray-500 border-white/15',
};

type StatusFilter = 'ALL' | 'PUBLISHED' | 'DRAFT';
type KindFilter = 'ALL' | 'vendor' | 'video_review' | 'written_review';

const LinkReviewClient: FC<{ initial: LinkReviewConsole[] }> = ({ initial }) => {
    const router = useRouter();
    const [rows, setRows] = useState(initial);
    const [busy, setBusy] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusFilter>('PUBLISHED');
    const [kind, setKind] = useState<KindFilter>('ALL');
    const [search, setSearch] = useState('');
    const [openId, setOpenId] = useState<string | null>(initial[0]?.id ?? null);
    const [error, setError] = useState<string | null>(null);

    const totals = useMemo(() => {
        let links = 0, approved = 0;
        for (const c of rows) { links += c.links.length; approved += c.approvedCount; }
        return { links, approved, consoles: rows.length };
    }, [rows]);

    const visible = useMemo(() => rows.filter(c => {
        if (status === 'PUBLISHED' && c.status !== 'published') return false;
        if (status === 'DRAFT' && c.status === 'published') return false;
        if (kind !== 'ALL' && !c.links.some(l => l.kind === kind)) return false;
        const q = search.trim().toLowerCase();
        if (q && !`${c.brand} ${c.name}`.toLowerCase().includes(q)) return false;
        return true;
    }), [rows, status, kind, search]);

    /* Optimistic, because a toggle that waits on a round trip makes triaging a hundred
     * links feel broken. Reverted in place if the write fails. */
    const applyLocal = (consoleId: string, linkIds: string[], approved: boolean) => {
        setRows(prev => prev.map(c => {
            if (c.id !== consoleId) return c;
            const links = c.links.map(l => (linkIds.includes(l.id) ? { ...l, approved } : l));
            return { ...c, links, approvedCount: links.filter(l => l.approved).length };
        }));
    };

    const toggleOne = async (consoleId: string, linkId: string, next: boolean) => {
        setBusy(linkId); setError(null);
        applyLocal(consoleId, [linkId], next);
        const res = await setLinkApproval(linkId, next);
        setBusy(null);
        if (!res.success) {
            applyLocal(consoleId, [linkId], !next);
            setError(res.message ?? 'Could not save that.');
        } else {
            router.refresh();
        }
    };

    const toggleConsole = async (c: LinkReviewConsole, next: boolean, onlyKind?: string) => {
        const ids = c.links.filter(l => !onlyKind || l.kind === onlyKind).map(l => l.id);
        if (ids.length === 0) return;
        setBusy(c.id); setError(null);
        applyLocal(c.id, ids, next);
        const res = await setConsoleLinksApproval(c.id, next, onlyKind);
        setBusy(null);
        if (!res.success) {
            applyLocal(c.id, ids, !next);
            setError(res.message ?? 'Could not save that.');
        } else {
            router.refresh();
        }
    };

    const chip = 'px-3 py-1.5 border font-mono text-[10px] uppercase tracking-wider transition-colors';
    const on = 'border-white bg-white text-black';
    const off = 'border-gray-700 text-gray-500 hover:text-white hover:border-gray-500';

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
            <div className="mb-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                    {totals.approved} of {totals.links} links approved &middot; {totals.consoles} consoles
                </div>
                <h1 className="font-pixel text-lg text-white uppercase tracking-widest">Link review</h1>
                <p className="font-sans text-sm text-gray-400 max-w-[70ch] mt-3">
                    Every link here came from the spreadsheet import. None of it shows on the site
                    until you approve it, and each one you approve appears on that console&apos;s page
                    straight away.
                </p>
            </div>

            {error && (
                <div className="border border-rose-500/40 bg-rose-500/10 text-rose-300 font-mono text-xs p-3 mb-4">
                    {error}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-6">
                {(['PUBLISHED', 'DRAFT', 'ALL'] as StatusFilter[]).map(s => (
                    <button key={s} type="button" onClick={() => setStatus(s)}
                            className={`${chip} ${status === s ? on : off}`}>
                        {s === 'PUBLISHED' ? 'Live consoles' : s === 'DRAFT' ? 'Not live' : 'All'}
                    </button>
                ))}
                <span className="w-px h-5 bg-white/10 mx-1" aria-hidden="true" />
                {(['ALL', 'vendor', 'video_review', 'written_review'] as KindFilter[]).map(k => (
                    <button key={k} type="button" onClick={() => setKind(k)}
                            className={`${chip} ${kind === k ? on : off}`}>
                        {k === 'ALL' ? 'Any kind' : KIND_LABEL[k]}
                    </button>
                ))}
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Filter by name"
                    className="ml-auto bg-black border border-gray-700 text-white font-mono text-xs px-3 py-2
                               outline-none focus:border-white min-w-[200px]"
                />
            </div>

            <div className="space-y-2">
                {visible.map(c => {
                    const open = openId === c.id;
                    const shown = kind === 'ALL' ? c.links : c.links.filter(l => l.kind === kind);
                    return (
                        <div key={c.id} className="border border-white/10 bg-black/40">
                            <div className="flex flex-wrap items-center gap-3 p-3">
                                <button
                                    type="button"
                                    onClick={() => setOpenId(open ? null : c.id)}
                                    className="flex items-baseline gap-2.5 text-left min-w-0 flex-1"
                                    aria-expanded={open}
                                >
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600 shrink-0">
                                        {c.brand}
                                    </span>
                                    <span className="font-mono text-[13px] text-white truncate">{c.name}</span>
                                    {c.status === 'published' && (
                                        <span className="font-mono text-[8.5px] uppercase tracking-widest text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 shrink-0">
                                            Live
                                        </span>
                                    )}
                                </button>

                                <span className="font-mono text-[10px] tabular-nums text-gray-500 shrink-0">
                                    {c.approvedCount}/{c.links.length}
                                </span>
                                <Link
                                    href={`/consoles/${c.slug}`}
                                    target="_blank"
                                    className="font-mono text-[9px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors shrink-0"
                                >
                                    View &rarr;
                                </Link>
                                <button
                                    type="button"
                                    disabled={busy === c.id}
                                    onClick={() => toggleConsole(c, c.approvedCount === c.links.length ? false : true)}
                                    className={`${chip} ${off} shrink-0 disabled:opacity-40`}
                                >
                                    {c.approvedCount === c.links.length ? 'Pull all' : 'Approve all'}
                                </button>
                            </div>

                            {open && (
                                <ul className="border-t border-white/10 divide-y divide-white/[0.06]">
                                    {shown.map(l => (
                                        <li key={l.id} className="flex flex-wrap items-center gap-3 p-3 pl-4">
                                            <span className={`font-mono text-[8.5px] uppercase tracking-widest border px-1.5 py-0.5 shrink-0 ${KIND_TONE[l.kind] ?? KIND_TONE.other}`}>
                                                {KIND_LABEL[l.kind] ?? l.kind}
                                            </span>
                                            <span className="font-mono text-[12px] text-gray-300 truncate min-w-0 flex-1">
                                                {l.label || <span className="text-gray-600">no label</span>}
                                            </span>
                                            <a
                                                href={l.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-mono text-[10px] text-gray-600 hover:text-cyan-400 transition-colors truncate max-w-[220px] shrink-0"
                                                title={l.url}
                                            >
                                                {l.domain} &nearr;
                                            </a>
                                            <button
                                                type="button"
                                                disabled={busy === l.id}
                                                onClick={() => toggleOne(c.id, l.id, !l.approved)}
                                                aria-pressed={l.approved}
                                                className={`${chip} shrink-0 disabled:opacity-40 ${
                                                    l.approved
                                                        ? 'border-emerald-500 bg-emerald-500 text-black'
                                                        : 'border-gray-700 text-gray-500 hover:border-emerald-500 hover:text-emerald-400'
                                                }`}
                                            >
                                                {l.approved ? 'Approved' : 'Approve'}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}

                {visible.length === 0 && (
                    <div className="border border-dashed border-white/10 p-10 text-center font-mono text-xs text-gray-600">
                        No consoles match those filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkReviewClient;
