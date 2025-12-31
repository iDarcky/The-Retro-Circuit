export default function MissionProfile() {
    return (
        <div className="bg-bg-primary border border-border-normal p-6">
            <h3 className="font-pixel text-[10px] text-gray-500 uppercase mb-4 tracking-widest">
                MISSION PROFILE
            </h3>
            <ul className="space-y-3 font-mono text-xs text-gray-400">
                <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">●</span>
                    <span>High-fidelity emulation of 6th-gen consoles.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">●</span>
                    <span>Premium build quality with magnesium alloy chassis.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">●</span>
                    <span>Dual AMOLED displays for authentic DS/3DS experience.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">●</span>
                    <span>Comprehensive I/O including USB-C video out.</span>
                </li>
            </ul>
        </div>
    );
}
