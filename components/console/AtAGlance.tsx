export default function AtAGlance() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Strengths */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-pixel text-[10px] text-secondary uppercase mb-3">Strengths</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>

            {/* Limitations */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-pixel text-[10px] text-accent uppercase mb-3">Limitations</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>

            {/* Notable Traits */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-pixel text-[10px] text-primary uppercase mb-3">Notable Traits</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>
        </div>
    );
}
