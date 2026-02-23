'use client';

export default function SwissAcquisition() {
    return (
        <section className="mb-12 border border-white/10 bg-white/[0.02] p-6 relative overflow-hidden group">
            <h3 className="font-pixel text-[10px] text-gray-500 uppercase mb-4 tracking-widest border-b border-white/10 pb-2">
                ACQUISITION
            </h3>

            <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="font-mono text-xs text-gray-500 italic">
                    [ MARKET DATA UNAVAILABLE ]
                </div>
                <div className="text-[10px] font-mono text-gray-600 uppercase border border-gray-800 px-3 py-1 hover:border-gray-600 transition-colors cursor-not-allowed">
                    CHECK PRICE HISTORY
                </div>
            </div>

            {/* Decorative Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none"></div>
        </section>
    );
}
