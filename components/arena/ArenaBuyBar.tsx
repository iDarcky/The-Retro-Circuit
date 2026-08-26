'use client';

import { getBuyUrl } from '../../lib/affiliate';
import AffiliateLink from '../console/AffiliateLink';
import type { ConsoleDetails, ConsoleVariant } from '../../lib/types';

interface Side {
    details: ConsoleDetails | null;
    variant: ConsoleVariant | null;
}

function fullName(d: ConsoleDetails | null) {
    if (!d) return '';
    return [d.manufacturer?.name, d.name].filter(Boolean).join(' ');
}

type Placement = 'arena_a' | 'arena_b';

function BuyCell({ side, placement }: { side: Side; placement: Placement }) {
    const name = fullName(side.details);
    const url = getBuyUrl({
        asin: side.variant?.amazon_asin,
        name: side.details?.name,
        manufacturer: side.details?.manufacturer?.name,
    });
    if (!url || !name) return null;

    const isDirect = Boolean(side.variant?.amazon_asin);

    return (
        <AffiliateLink
            href={url}
            productName={name}
            linkType={isDirect ? 'product' : 'search'}
            placement={placement}
            className="group flex items-center justify-between gap-4 p-4 border border-white/10 bg-white/[0.01] hover:bg-white hover:text-black transition-colors"
        >
            <span className="flex flex-col gap-1 text-left min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-black/60">
                    {isDirect ? 'Buy' : 'Find on Amazon'}
                </span>
                <span className="font-pixel text-xs truncate">{name}</span>
            </span>
            <span className="font-mono text-[10px] uppercase shrink-0 text-orange-500 group-hover:text-black">
                [ &gt; ]
            </span>
        </AffiliateLink>
    );
}

/**
 * Buy path for a head-to-head comparison.
 *
 * Arena pages are the site's best-performing surface — position 5–9 and ~70% of
 * non-homepage clicks — and carried no affiliate link at all. Someone comparing two
 * devices has already decided to buy one of them, so this is the highest-intent
 * placement on the site.
 */
export default function ArenaBuyBar({ a, b }: { a: Side; b: Side }) {
    if (!a.details || !b.details) return null;

    return (
        <section className="w-full mt-12" aria-label="Where to buy">
            <h2 className="font-pixel text-sm text-orange-500 mb-2 uppercase tracking-widest">
                Acquisition
            </h2>
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-6">
                As an Amazon Associate I earn from qualifying purchases
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BuyCell side={a} placement="arena_a" />
                <BuyCell side={b} placement="arena_b" />
            </div>
        </section>
    );
}
