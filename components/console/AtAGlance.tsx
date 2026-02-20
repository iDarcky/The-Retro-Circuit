export default function AtAGlance() {
    return (
        <div className="grid grid-cols-3 divide-x divide-border-normal mb-12">
            {/* Strengths */}
            <div className="px-4 first:pl-0">
                <h4 className="font-sans text-xs font-bold text-secondary uppercase mb-3 tracking-wide">Strengths</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>

            {/* Limitations */}
            <div className="px-4">
                <h4 className="font-sans text-xs font-bold text-accent uppercase mb-3 tracking-wide">Limitations</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>

            {/* Notable Traits */}
            <div className="px-4 last:pr-0">
                <h4 className="font-sans text-xs font-bold text-primary uppercase mb-3 tracking-wide">Notable Traits</h4>
                <div className="font-mono text-[10px] text-gray-500 italic">
                    [ PENDING ]
                </div>
            </div>
        </div>
    );
}
