import type { ConsoleLink } from '../../lib/types';
import { getBuyUrl } from '../../lib/affiliate';
import AffiliateLink from './AffiliateLink';
import AffiliateDisclosure from './swiss/AffiliateDisclosure';

interface ConsoleLinksProps {
    links?: ConsoleLink[] | null;
    /** Used to rebuild an Amazon URL through our affiliate tag. */
    productName?: string | null;
    manufacturerName?: string | null;
}

/** Pulls the ASIN out of an Amazon product URL (/dp/ASIN or /gp/product/ASIN). */
function extractAsin(url: string): string | null {
    const m = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i);
    return m ? m[1].toUpperCase() : null;
}

function isAmazon(url: string): boolean {
    try {
        return new URL(url).hostname.toLowerCase().includes('amazon.');
    } catch {
        return false;
    }
}

/**
 * Review and retail links for a console.
 *
 * Vendor links arrive from the import as RAW urls carrying no affiliate tag, so every
 * Amazon one is rebuilt through `getBuyUrl` — rendering the stored url directly would
 * send the visitor to Amazon with no tag attached and earn nothing on the sale.
 *
 * Non-Amazon vendors (AliExpress, Anbernic, Indiegogo…) have no programme wired up, so
 * they render as plain outbound links. Reviews are third-party editorial: `nofollow` so
 * we do not pass ranking signal to 100+ external domains from every console page.
 */
export default function ConsoleLinks({ links, productName, manufacturerName }: ConsoleLinksProps) {
    /* Only greenlit links are rendered.
     *
     * Every row here arrived with a spreadsheet import and none of it was chosen, so an
     * uncurated list of other people's videos was being published on our own product
     * pages by inheritance. `approved` defaults to false, which means this section shows
     * nothing until someone has been through /admin/links, and turns itself back on one
     * link at a time as they do. */
    const approved = (links ?? []).filter((l) => l.approved);
    if (approved.length === 0) return null;

    const sorted = [...approved].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const vendors = sorted.filter((l) => l.kind === 'vendor' || l.kind === 'official');
    const reviews = sorted.filter((l) => l.kind === 'video_review' || l.kind === 'written_review');

    return (
        <div className="space-y-8">
            {vendors.length > 0 && (
                <section>
                    <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                        Where to buy
                    </h3>
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {vendors.map((link) => {
                            const label = link.label || 'Vendor';

                            if (isAmazon(link.url)) {
                                const asin = extractAsin(link.url);
                                const href = getBuyUrl({
                                    asin,
                                    name: productName,
                                    manufacturer: manufacturerName,
                                });
                                if (!href) return null;
                                return (
                                    <li key={link.id}>
                                        <AffiliateLink
                                            href={href}
                                            productName={productName || label}
                                            linkType={asin ? 'product' : 'search'}
                                            placement="console_detail"
                                            className="block p-3 border border-violet-500/30 bg-violet-500/[0.03] hover:bg-violet-500/[0.08] hover:border-violet-500 transition-colors font-mono text-[11px] text-violet-300 uppercase tracking-wider truncate"
                                        >
                                            {label}
                                        </AffiliateLink>
                                    </li>
                                );
                            }

                            return (
                                <li key={link.id}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow sponsored"
                                        className="block p-3 border border-white/10 hover:bg-white/[0.04] hover:border-white/30 transition-colors font-mono text-[11px] text-gray-300 uppercase tracking-wider truncate"
                                    >
                                        {label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            {reviews.length > 0 && (
                <section>
                    <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                        Reviews elsewhere
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {reviews.map((link) => (
                            <li key={link.id}>
                                {/* nofollow, because pointing a hundred consoles at other
                                    people's channels should not pass ranking signal. */}
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="flex items-center justify-between gap-3 p-3 border border-white/10
                                               hover:bg-white/[0.04] hover:border-white/30 transition-colors"
                                >
                                    <span className="font-mono text-[11px] text-gray-300 truncate">
                                        {link.label || 'Review'}
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600 shrink-0">
                                        {link.kind === 'video_review' ? 'Video' : 'Article'}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <AffiliateDisclosure className="mt-4" />
        </div>
    );
}
