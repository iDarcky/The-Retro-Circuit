export default function AtAGlance() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Strengths */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-sans text-xs font-bold text-secondary uppercase mb-3 tracking-wide">Strengths</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>

            {/* Limitations */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-sans text-xs font-bold text-accent uppercase mb-3 tracking-wide">Limitations</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>

            {/* Notable Traits */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-sans text-xs font-bold text-primary uppercase mb-3 tracking-wide">Notable Traits</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>
        </div>
    );
}
