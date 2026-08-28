'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { markConsoleReleased, type AdminDashboard, type WorklistRow } from '../../app/actions/dashboard';

/* The hub leads with what is missing, not with where to go.
 *
 * Every counter is a link into the console index pre-filtered to that gap, so the
 * number and the work it names are one click apart. The old navigation cards moved
 * to a strip at the bottom — still one click, but no longer the whole page. */

const NAV = [
    { href: '/admin/consoles', label: 'Consoles', hint: 'Index' },
    { href: '/admin/fabricators', label: 'Fabricators', hint: 'Brands' },
    { href: '/admin/asins', label: 'ASINs', hint: 'Worklist' },
    { href: '/admin/buy-links', label: 'Buy links', hint: 'Worklist' },
    { href: '/admin/reviews', label: 'Reviews', hint: 'Editorial' },
    { href: '/admin/news', label: 'News', hint: 'Editorial' },
    { href: '/admin/signals', label: 'Signals', hint: 'Editorial' },
    { href: '/admin/roadmap', label: 'Roadmap', hint: 'Planning' },
    { href: '/admin/broadcast', label: 'Broadcast', hint: 'Email' },
    { href: '/design', label: 'Design system', hint: 'Reference' },
];

function Tile({ n, label, sub, href, tone = 'plain' }: {
    n: number; label: string; sub: string; href: string;
    tone?: 'plain' | 'blocking' | 'done';
}) {
    const quiet = n === 0;
    const numberColor =
        quiet ? 'text-gray-600'
        : tone === 'blocking' ? 'text-primary'
        : tone === 'done' ? 'text-emerald-500'
        : 'text-white';
    const edge = quiet ? 'border-l-transparent'
        : tone === 'blocking' ? 'border-l-primary'
        : tone === 'done' ? 'border-l-emerald-500'
        : 'border-l-transparent';

    return (
        <Link
            href={href}
            className={`block p-5 border-r border-b border-border-subtle border-l-[3px] ${edge}
                        hover:bg-white/[0.04] transition-colors group ${quiet ? 'opacity-50' : ''}`}
        >
            <div className={`font-mono font-bold text-3xl leading-none tabular-nums mb-2.5 ${numberColor}`}>{n}</div>
            <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-gray-400 group-hover:text-white transition-colors">
                {label}
            </div>
            <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-gray-600 mt-1.5">{sub}</div>
        </Link>
    );
}

function RowLink({ row, right }: { row: WorklistRow; right?: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle last:border-b-0 hover:bg-white/[0.04] transition-colors">
            <Link href={`/admin/consoles/${row.slug}`} className="flex-1 min-w-0 group">
                <div className="font-mono text-xs text-white truncate group-hover:underline">{row.name}</div>
                {row.brand && (
                    <div className="font-mono text-[9px] uppercase tracking-wider text-gray-600 mt-0.5">{row.brand}</div>
                )}
            </Link>
            {right}
        </div>
    );
}

function Panel({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
    return (
        <div className="border border-border-subtle">
            <div className="flex justify-between items-center px-4 py-3 border-b border-border-subtle">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500">{title}</span>
                {typeof count === 'number' && (
                    <span className="font-mono text-[10px] text-gray-600 tabular-nums">{count}</span>
                )}
            </div>
            {children}
        </div>
    );
}

export default function AdminHubClient({ data }: { data: AdminDashboard }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [busyId, setBusyId] = useState<string | null>(null);
    const { totals, gaps, revenue, ready, imageOnly, releasePassed } = data;

    const release = (id: string) => {
        setBusyId(id);
        startTransition(async () => {
            await markConsoleReleased(id);
            setBusyId(null);
            router.refresh();
        });
    };

    // Proportions of the whole catalogue, for the one-line status bar.
    const blocked = Math.max(totals.draft - gaps.READY, 0);
    const pct = (n: number) => (totals.consoles > 0 ? (n / totals.consoles) * 100 : 0);

    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 animate-fadeIn min-h-screen">

            <header className="pt-8 pb-6 mb-10 border-b-2 border-border-normal">
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-pixel text-white leading-none tracking-tighter">
                            ADMIN_HUB
                        </h1>
                        <p className="font-mono text-[10px] md:text-xs text-gray-500 mt-3 tracking-widest uppercase">
                            {totals.consoles} consoles &middot; {totals.published} published &middot; {totals.draft} draft &middot; {totals.variants} variants
                        </p>
                    </div>
                    <Link
                        href="/admin/consoles"
                        className="font-mono text-[10px] uppercase tracking-widest border border-white px-4 py-2
                                   text-white hover:bg-white hover:text-black transition-colors"
                    >
                        Console index
                    </Link>
                </div>
            </header>

            {/* Catalogue at a glance ------------------------------------------------ */}
            <div className="mb-10">
                <div className="flex h-6 border border-border-normal" role="img"
                    aria-label={`${totals.consoles} consoles: ${totals.published} published, ${gaps.READY} ready to publish, ${blocked} blocked`}>
                    <span className="bg-emerald-500" style={{ width: `${pct(totals.published)}%` }} />
                    <span className="bg-white" style={{ width: `${pct(gaps.READY)}%` }} />
                    <span className="bg-primary" style={{ width: `${pct(blocked)}%` }} />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-gray-600">
                    <span><i className="inline-block w-2 h-2 mr-2 bg-emerald-500" />{totals.published} published</span>
                    <span><i className="inline-block w-2 h-2 mr-2 bg-white" />{gaps.READY} ready</span>
                    <span><i className="inline-block w-2 h-2 mr-2 bg-primary" />{blocked} blocked</span>
                </div>
            </div>

            {/* Gap counters --------------------------------------------------------- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-l border-border-subtle mb-10">
                <Tile n={gaps.NO_IMAGE} label="No image" sub="Blocks publish" tone="blocking"
                    href="/admin/consoles?status=DRAFT&gap=NO_IMAGE" />
                <Tile n={revenue.variantsTotal - revenue.variantsWithAsin} label="No ASIN" sub="Search-link fallback"
                    href="/admin/asins" />
                <Tile n={gaps.NO_PRICE} label="No price" sub="Drafts"
                    href="/admin/consoles?status=DRAFT&gap=NO_PRICE" />
                <Tile n={gaps.NO_VARIANT} label="No variant" sub="Drafts"
                    href="/admin/consoles?status=DRAFT&gap=NO_VARIANT" />
                <Tile n={gaps.RELEASE_PASSED} label="Release passed" sub={gaps.RELEASE_PASSED === 0 ? 'Nothing waiting' : 'Still marked upcoming'}
                    href="/admin#release-passed" tone="blocking" />
            </div>

            {/* Worklists ------------------------------------------------------------ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="lg:col-span-2 space-y-6">
                    <Panel title="Ready to publish" count={gaps.READY}>
                        {ready.length === 0 ? (
                            <div className="px-4 py-6 font-mono text-[11px] text-gray-600">
                                Nothing is fully ready. The list below is one step away.
                            </div>
                        ) : ready.map(r => (
                            <RowLink key={r.id} row={r} right={
                                <Link href={`/admin/consoles/${r.slug}`}
                                    className="font-mono text-[9px] uppercase tracking-widest border border-white bg-white text-black px-3 py-1.5 hover:bg-transparent hover:text-white transition-colors">
                                    Open
                                </Link>
                            } />
                        ))}
                    </Panel>

                    <Panel title="Closest to ready — image only" count={gaps.NO_IMAGE}>
                        {imageOnly.length === 0 ? (
                            <div className="px-4 py-6 font-mono text-[11px] text-gray-600">No consoles blocked on an image alone.</div>
                        ) : imageOnly.map(r => (
                            <RowLink key={r.id} row={r} right={
                                <>
                                    <span className="font-mono text-[9px] uppercase tracking-widest border border-primary text-primary px-2 py-1">
                                        Needs image
                                    </span>
                                    <Link href={`/admin/consoles/${r.slug}`}
                                        className="font-mono text-[9px] uppercase tracking-widest border border-border-normal text-gray-400 px-3 py-1.5 hover:border-white hover:text-white transition-colors">
                                        Open
                                    </Link>
                                </>
                            } />
                        ))}
                    </Panel>
                </div>

                <div className="space-y-6">
                    <div id="release-passed">
                        <Panel title="Release date passed" count={gaps.RELEASE_PASSED}>
                            {releasePassed.length === 0 ? (
                                <div className="px-4 py-6 font-mono text-[11px] text-gray-600">
                                    No console marked Upcoming has shipped yet.
                                </div>
                            ) : releasePassed.map(r => (
                                <RowLink key={r.id} row={r} right={
                                    <button
                                        type="button"
                                        onClick={() => release(r.id)}
                                        disabled={pending && busyId === r.id}
                                        className="font-mono text-[9px] uppercase tracking-widest border border-emerald-500 text-emerald-500 px-3 py-1.5
                                                   hover:bg-emerald-500 hover:text-black transition-colors disabled:opacity-40"
                                    >
                                        {pending && busyId === r.id ? 'Saving' : 'Mark released'}
                                    </button>
                                } />
                            ))}
                        </Panel>
                    </div>

                    <Panel title="Revenue">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-border-subtle font-mono text-[11px]">
                            <span className="text-gray-400">Published pages earning nothing</span>
                            <span className="text-amber-500 tabular-nums">{revenue.publishedWithoutBuyPath}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 font-mono text-[11px]">
                            <span className="text-gray-400">Variants with a real ASIN</span>
                            <span className="text-gray-500 tabular-nums">
                                {revenue.variantsWithAsin} / {revenue.variantsTotal}
                            </span>
                        </div>
                    </Panel>
                </div>
            </div>

            {/* Everything else ------------------------------------------------------ */}
            <div className="border-t border-border-normal pt-6 pb-12">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-600 mb-4">Sections</div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border-subtle border border-border-subtle">
                    {NAV.map(item => (
                        <Link key={item.href} href={item.href}
                            className="bg-bg-primary px-4 py-4 hover:bg-white/[0.04] transition-colors group">
                            <div className="font-mono text-[11px] text-gray-300 group-hover:text-white transition-colors">
                                {item.label}
                            </div>
                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-600 mt-1">{item.hint}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
