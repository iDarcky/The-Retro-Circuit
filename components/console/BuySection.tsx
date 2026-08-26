import BuyButton from './BuyButton';
import { getAmazonSearchUrl } from '../../lib/affiliate';
import AffiliateLink from './AffiliateLink';

interface BuySectionProps {
    asin?: string | null;
    /** Product name used to build an Amazon search fallback when no direct ASIN is available. */
    searchQuery?: string | null;
}

export default function BuySection({ asin, searchQuery }: BuySectionProps) {
    const searchUrl = searchQuery ? getAmazonSearchUrl(searchQuery) : null;

    return (
        <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                Acquisition
            </h3>

            <div className="space-y-4">
                {asin ? (
                    <BuyButton asin={asin} productName={searchQuery} />
                ) : searchUrl ? (
                    // No direct listing yet — fall back to an affiliate search so the buy path
                    // still works (and still earns) instead of showing a dead placeholder.
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
                ) : (
                    <p className="text-[10px] font-mono text-gray-600 text-center uppercase tracking-wider py-2">
                        Retail listing not available yet
                    </p>
                )}
            </div>
        </div>
    );
}
