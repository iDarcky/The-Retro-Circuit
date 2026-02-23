import SwissButton from './swiss/SwissButton';

export default function BuySection() {
    return (
        <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="font-pixel text-xs text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                Acquisition
            </h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-dashed border-white/20 bg-white/[0.02]">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Market Price</span>
                        <span className="font-pixel text-lg text-white">---</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase px-2 py-1 bg-white/5 border border-white/10">
                        UNLISTED
                    </div>
                </div>

                <div className="pt-2">
                     <SwissButton variant="secondary" className="w-full justify-center opacity-50 cursor-not-allowed">
                        CHECK AVAILABILITY
                     </SwissButton>
                     <p className="text-[10px] font-mono text-gray-600 text-center mt-3 uppercase tracking-wider">
                        [ NO LIVE DATA FEEDS ]
                     </p>
                </div>
            </div>
        </div>
    );
}
