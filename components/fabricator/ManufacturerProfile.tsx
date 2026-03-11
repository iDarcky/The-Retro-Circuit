'use client';

import { Manufacturer, ConsoleDetails } from '../../lib/types';
import KeyDevices from './KeyDevices';

interface ManufacturerProfileProps {
    manufacturer: Manufacturer;
    featuredConsoles: ConsoleDetails[];
}

export default function ManufacturerProfile({ manufacturer, featuredConsoles }: ManufacturerProfileProps) {
    const hasKnownFor = manufacturer.known_for && manufacturer.known_for.length > 0;
    const hasWhoItsFor = !!manufacturer.who_its_for;
    const hasFeatured = featuredConsoles && featuredConsoles.length > 0;

    if (!hasKnownFor && !hasWhoItsFor && !hasFeatured) {
        return null;
    }

    return (
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 pb-24 font-mono mt-12 border-t border-white/10 pt-16">
            <div className="border-b-2 border-white/20 pb-4 mb-12">
                 <h2 className="text-2xl md:text-3xl font-pixel text-white uppercase tracking-wider flex items-center gap-4">
                     MANUFACTURER PROFILE
                 </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Text Content */}
                <div className="lg:col-span-4 flex flex-col gap-12">
                    {/* KNOWN FOR */}
                    {hasKnownFor && (
                        <div>
                            <div className="text-[var(--brand-color)] text-xs font-bold uppercase tracking-widest mb-6">
                                [ KNOWN FOR ]
                            </div>
                            <ul className="space-y-4">
                                {manufacturer.known_for!.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className="text-[var(--brand-color)] opacity-50 text-lg mt-[-4px]">■</div>
                                        <div className="text-zinc-300 text-sm leading-relaxed">{item}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* WHO IT'S FOR */}
                    {hasWhoItsFor && (
                        <div>
                            <div className="text-[var(--brand-color)] text-xs font-bold uppercase tracking-widest mb-6">
                                [ WHO IT&apos;S FOR ]
                            </div>
                            <div className="text-zinc-400 text-sm leading-relaxed border-l-2 border-white/10 pl-6 bg-white/[0.01] p-6">
                                {manufacturer.who_its_for}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Key Devices */}
                {hasFeatured && (
                    <div className="lg:col-span-8">
                        <div className="text-[var(--brand-color)] text-xs font-bold uppercase tracking-widest mb-6">
                            [ KEY DEVICES ]
                        </div>
                        <KeyDevices consoles={featuredConsoles} />
                    </div>
                )}
            </div>
        </div>
    );
}
