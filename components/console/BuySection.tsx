import BuyButton from './BuyButton';
import { ExternalLink, Search } from 'lucide-react';

const AFFILIATE_TAG = 'theretrocircu-20';

interface BuySectionProps {
    asin?: string | null;
    consoleName?: string;
    manufacturerName?: string;
}

/**
 * Generates an Amazon search URL with the affiliate tag.
 * Uses the console name (and optionally manufacturer) as the search query.
 */
function buildAmazonSearchUrl(consoleName: string, manufacturerName?: string): string {
    const query = manufacturerName
        ? `${manufacturerName} ${consoleName}`
        : consoleName;
    const encoded = encodeURIComponent(query);
    return `https://www.amazon.com/s?k=${encoded}&tag=${AFFILIATE_TAG}`;
}

export default function BuySection({ asin, consoleName, manufacturerName }: BuySectionProps) {
    return (
        <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                Acquisition
            </h3>

            <div className="space-y-4">
                {asin ? (
                    <BuyButton asin={asin} />
                ) : consoleName ? (
                    /* FALLBACK: Dynamic Amazon search link when no ASIN is stored */
                    <div className="flex flex-col gap-3 w-full">
                        <p className="text-xs text-gray-500 font-mono tracking-widest text-left">
                            As an Amazon Associate I earn from qualifying purchases.
                        </p>
                        <a
                            href={buildAmazonSearchUrl(consoleName, manufacturerName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-4 border border-dashed border-violet-500/50 bg-violet-500/[0.02] hover:bg-violet-500/[0.05] hover:border-violet-500 transition-colors w-full"
                        >
                            <div className="flex flex-col gap-1 text-left">
                                <span className="font-pixel text-base text-white group-hover:text-violet-400 transition-colors flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Search on Amazon
                                </span>
                                <span className="text-[10px] font-mono text-zinc-500">
                                    Results for &quot;{manufacturerName ? `${manufacturerName} ${consoleName}` : consoleName}&quot;
                                </span>
                            </div>
                            <div className="whitespace-nowrap shrink-0 text-[10px] font-mono text-violet-500/80 uppercase px-2 py-1 bg-violet-500/5 border border-violet-500/20 group-hover:bg-violet-500/20 group-hover:text-violet-400 group-hover:border-violet-500/40 transition-colors flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                Search
                            </div>
                        </a>
                    </div>
                ) : (
                    /* TRUE FALLBACK: No name available at all (shouldn't happen in practice) */
                    <div className="p-4 border border-white/5 bg-white/[0.01] text-center">
                        <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
                            [ No purchase links available ]
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
