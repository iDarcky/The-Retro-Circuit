import BuyButton from './BuyButton';
import BuySearchButton from './BuySearchButton';

interface BuySectionProps {
    asin?: string | null;
    searchQuery?: string | null;
}

export default function BuySection({ asin, searchQuery }: BuySectionProps) {
    return (
        <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                Acquisition
            </h3>

            <div className="space-y-4">
                {asin ? (
                    <BuyButton asin={asin} />
                ) : searchQuery ? (
                    <BuySearchButton query={searchQuery} />
                ) : (
                    <p className="text-[10px] font-mono text-gray-600 text-center uppercase tracking-wider">
                        [ NO LISTINGS AVAILABLE ]
                    </p>
                )}
            </div>
        </div>
    );
}
