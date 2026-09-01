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
    /* Review links are not rendered.
     *
     * The `video_review` and `written_review` rows came in with the spreadsheet import,
     * point at other people's videos, and have no admin screen to curate or remove them
     * one by one. Publishing an uncurated list of competitors on our own product pages
     * is a decision, and it should be made deliberately in an editor rather than
     * inherited from an import. The rows stay in console_links; nothing reads them. */
    if (!links?.length) return null;

    const sorted = [...links].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const vendors = sorted.filter((l) => l.kind === 'vendor' || l.kind === 'official');

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
            <AffiliateDisclosure className="mt-4" />
        </div>
    );
}
