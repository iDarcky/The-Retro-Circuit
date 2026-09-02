'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import AsinWorklistClient from './AsinWorklistClient';
import BuyLinkWorklistClient from './BuyLinkWorklistClient';
import LinkReviewClient from './LinkReviewClient';
import type { AsinRow, BuyLinkRow, LinkReviewConsole } from '../../app/actions/commerce';

/**
 * The three catalogue-wide buy-path queues, on one screen.
 *
 * They were three nav items for one job, which made the admin look bigger than the work
 * actually is. They are also three angles on the same question — "which of the 79
 * published consoles can a reader actually buy?" — so seeing all three counts at once
 * says more than any one of them alone.
 *
 * Per-console work does not belong here at all any more: setting one console's ASIN or
 * vendor link happens in that console's editor, where you already are when you know the
 * answer. These are backlog sweeps.
 *
 * The tab lives in the URL so the hub can deep-link a counter straight to the queue it
 * counts, and so a half-done sweep survives a reload.
 */

const TABS = [
    { id: 'no-path', label: 'No buy path', blurb: 'Published pages where the buy button falls back to an Amazon search.' },
    { id: 'asins', label: 'Needs ASIN', blurb: 'Configurations with no Amazon product id. Copy it from the product URL (/dp/B0XXXXXXXX).' },
    { id: 'imported', label: 'Imported links', blurb: 'Links the spreadsheet attached. All hidden until greenlit here, one at a time.' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function RevenueClient({
    asinRows,
    buyLinkRows,
    linkReview,
}: {
    asinRows: AsinRow[];
    buyLinkRows: BuyLinkRow[];
    linkReview: LinkReviewConsole[];
}) {
    const router = useRouter();
    const params = useSearchParams();

    const raw = params?.get('tab');
    const active: TabId = TABS.some(t => t.id === raw) ? (raw as TabId) : 'no-path';

    const counts: Record<TabId, number> = {
        'no-path': buyLinkRows.length,
        asins: asinRows.length,
        imported: linkReview.reduce((n, c) => n + c.links.filter(l => !l.approved).length, 0),
    };

    const select = useCallback(
        (id: TabId) => {
            // replace, not push: flicking between tabs should not fill the back button
            // with steps you have to walk out of to leave the screen.
            router.replace(id === 'no-path' ? '/admin/revenue' : `/admin/revenue?tab=${id}`, { scroll: false });
        },
        [router],
    );

    const current = TABS.find(t => t.id === active)!;

    return (
        <>
            <div className="flex flex-wrap border border-border-normal" role="tablist" aria-label="Buy path queues">
                {TABS.map(tab => {
                    const on = tab.id === active;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            onClick={() => select(tab.id)}
                            className={`flex-1 min-w-[10rem] flex items-baseline justify-between gap-3 px-4 py-3 border-r border-border-normal last:border-r-0 transition-colors ${
                                on ? 'bg-white/[0.06] text-white' : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                            }`}
                        >
                            <span className="font-mono text-[10px] uppercase tracking-widest">{tab.label}</span>
                            <span
                                className={`font-mono text-lg font-bold tabular-nums leading-none ${
                                    counts[tab.id] === 0 ? 'text-gray-700' : on ? 'text-orange-500' : 'text-gray-400'
                                }`}
                            >
                                {counts[tab.id]}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="font-sans text-sm text-gray-400 max-w-[70ch]">{current.blurb}</p>

            {active === 'no-path' && <BuyLinkWorklistClient rows={buyLinkRows} />}
            {active === 'asins' && <AsinWorklistClient rows={asinRows} />}
            {active === 'imported' && <LinkReviewClient initial={linkReview} />}
        </>
    );
}
