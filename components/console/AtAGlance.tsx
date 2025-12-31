export default function AtAGlance() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Strengths */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-pixel text-[10px] text-secondary uppercase mb-3">Strengths</h4>
                <ul className="space-y-2">
                    <li className="font-mono text-[10px] text-gray-400 border-l border-secondary/30 pl-2">
                        Exceptional battery life
                    </li>
                    <li className="font-mono text-[10px] text-gray-400 border-l border-secondary/30 pl-2">
                        OLED Display
                    </li>
                </ul>
            </div>

            {/* Limitations */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-pixel text-[10px] text-accent uppercase mb-3">Limitations</h4>
                <ul className="space-y-2">
                    <li className="font-mono text-[10px] text-gray-400 border-l border-accent/30 pl-2">
                        Mono Speaker
                    </li>
                    <li className="font-mono text-[10px] text-gray-400 border-l border-accent/30 pl-2">
                        Limited PS2 Support
                    </li>
                </ul>
            </div>

            {/* Notable Traits */}
            <div className="bg-bg-primary border border-border-normal p-4">
                <h4 className="font-pixel text-[10px] text-primary uppercase mb-3">Notable Traits</h4>
                <ul className="space-y-2">
                    <li className="font-mono text-[10px] text-gray-400 border-l border-primary/30 pl-2">
                        Hall Effect Joysticks
                    </li>
                    <li className="font-mono text-[10px] text-gray-400 border-l border-primary/30 pl-2">
                        Active Cooling
                    </li>
                </ul>
            </div>
        </div>
    );
}
