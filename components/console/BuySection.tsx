import BuyButton from './BuyButton';
import { getAmazonSearchUrl } from '../../lib/affiliate';
import AffiliateLink from './AffiliateLink';
import type { ConsoleLink } from '../../lib/types';

interface BuySectionProps {
    asin?: string | null;
    /** Product name used to build an Amazon search fallback when no direct ASIN is available. */
    searchQuery?: string | null;
    /** Real retail channels for this device, from `console_links`. */
    vendorLinks?: ConsoleLink[];
}

export default function BuySection({ asin, searchQuery, vendorLinks = [] }: BuySectionProps) {
    const searchUrl = searchQuery ? getAmazonSearchUrl(searchQuery) : null;

    // Most devices in this category never reach Amazon — it is the smallest channel in the
    // catalogue, behind AliExpress, brand-direct and crowdfunding. Sending someone to an
    // Amazon search for a device Amazon does not stock returns unrelated products, so the
    // search fallback is only a last resort: a known vendor always beats a blind search.
    const knownVendors = vendorLinks.filter((l) => !l.url.toLowerCase().includes('amazon'));
    const showAmazonSearchFallback = !asin && knownVendors.length === 0 && !!searchUrl;

    return (
        <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                Acquisition
            </h3>

            <div className="space-y-4">
                {asin && <BuyButton asin={asin} productName={searchQuery} />}

                {!asin && knownVendors.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                            Sold at
                        </p>
                        {knownVendors.slice(0, 4).map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow sponsored"
                                className="group flex items-center justify-between p-3 border border-white/10 hover:bg-white/[0.04] hover:border-cyan-500/50 transition-colors"
                            >
                                <span className="font-mono text-xs text-gray-300 group-hover:text-white truncate">
                                    {link.label || 'Vendor'}
                                </span>
                                <span className="shrink-0 font-mono text-[9px] text-cyan-500/70 uppercase tracking-wider">
                                    [ EXTERNAL ]
                                </span>
                            </a>
                        ))}
                    </div>
                )}

                {showAmazonSearchFallback && (
                    <div className="flex flex-col gap-3 w-full">
                        <p className="text-xs text-gray-500 font-mono tracking-widest text-left">
                            As an Amazon Associate I earn from qualifying purchases.
                        </p>
                        <AffiliateLink
                            href={searchUrl}
                            productName={searchQuery || 'unknown'}
                            linkType="search"
                            placement="console_detail"
                            className="group flex items-center justify-between p-4 border border-dashed border-orange-500/50 bg-orange-500/[0.02] hover:bg-orange-500/[0.05] hover:border-orange-500 transition-colors w-full"
                        >
                            <div className="flex flex-col gap-1 text-left">
                                <span className="font-pixel text-base text-white group-hover:text-orange-400 transition-colors">Find on Amazon</span>
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Live listings — best price</span>
                            </div>
                            <div className="whitespace-nowrap shrink-0 text-[10px] font-mono text-orange-500/80 uppercase px-2 py-1 bg-orange-500/5 border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors">
                                [ EXTERNAL ]
                            </div>
                        </AffiliateLink>
                    </div>
                )}

                {!asin && knownVendors.length === 0 && !showAmazonSearchFallback && (
                    <p className="text-[10px] font-mono text-gray-600 text-center uppercase tracking-wider py-2">
                        Retail listing not available yet
                    </p>
                )}
            </div>
        </div>
    );
}
