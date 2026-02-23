export default function MissionProfile() {
    return (
        <div className="border border-white/10 p-6 bg-white/[0.01]">
            <h3 className="font-pixel text-xs text-orange-500 uppercase tracking-widest mb-6 border-b border-orange-500/20 pb-2">
                Mission Profile
            </h3>
            <div className="font-mono text-xs text-gray-500 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="tracking-wider">STATUS</span>
                    <span className="text-white bg-white/10 px-2 py-0.5 text-[10px]">CLASSIFIED</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="tracking-wider">OPERATOR</span>
                    <span className="text-gray-400">UNKNOWN</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="tracking-wider">ORIGIN</span>
                    <span className="text-gray-400">N/A</span>
                </div>
                <div className="pt-2 text-[10px] opacity-50 leading-relaxed">
                    // NOTE: Full operational history is currently unavailable. Data mining in progress.
                </div>
            </div>
        </div>
    );
}
