import SwissButton from './swiss/SwissButton';
import BuyButton from './BuyButton';

interface BuySectionProps {
    asin?: string | null;
}

export default function BuySection({ asin }: BuySectionProps) {
    return (
        <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                Acquisition
            </h3>

            <div className="space-y-4">
                {asin ? (
                    <BuyButton asin={asin} />
                ) : (
                    <>
                        <SwissButton variant="secondary" className="w-full justify-center opacity-50 cursor-not-allowed">
                            CHECK AVAILABILITY
                        </SwissButton>
                        <p className="text-[10px] font-mono text-gray-600 text-center mt-3 uppercase tracking-wider">
                            [ NO LIVE DATA FEEDS ]
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
