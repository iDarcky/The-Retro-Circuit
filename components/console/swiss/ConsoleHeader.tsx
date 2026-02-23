'use client';

import { ConsoleDetails, ConsoleVariant, Manufacturer } from '../../../lib/types';
import Link from 'next/link';

interface ConsoleHeaderProps {
    console: ConsoleDetails;
    manufacturer: Manufacturer | null;
    variants: ConsoleVariant[];
    selectedVariantId: string;
    onVariantChange: (slug: string) => void;
}

export default function ConsoleHeader({
    console: consoleData,
    manufacturer,
    variants,
    selectedVariantId,
    onVariantChange
}: ConsoleHeaderProps) {
    const fabName = manufacturer?.name || 'UNKNOWN';
    const formFactor = consoleData.form_factor || 'SYSTEM';

    return (
        <header className="w-full border-b border-white/10 pb-6 mb-8 relative">
            {/* Top Metadata Row */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    <Link href="/consoles" className="hover:text-white transition-colors">
                        VAULT
                    </Link>
                    <span>/</span>
                    {manufacturer ? (
                        <Link href={`/fabricators/${manufacturer.slug}`} className="hover:text-secondary transition-colors">
                            {fabName}
                        </Link>
                    ) : (
                        <span>{fabName}</span>
                    )}
                    <span>/</span>
                    <span className="text-secondary">{formFactor}</span>
                </div>

                {/* Variant Selector (if needed) */}
                {variants.length > 1 && (
                    <div className="relative group">
                        <select
                            value={selectedVariantId}
                            onChange={(e) => {
                                const v = variants.find(v => v.id === e.target.value);
                                if (v?.slug) onVariantChange(v.slug);
                            }}
                            className="appearance-none bg-black border border-white/20 text-white font-mono text-[10px] uppercase py-1 px-3 pr-6 hover:border-secondary cursor-pointer outline-none transition-colors"
                        >
                            {variants.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.variant_name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-gray-500">▼</div>
                    </div>
                )}
            </div>

            {/* Main Title */}
            <h1 className="font-pixel text-4xl md:text-6xl text-white uppercase leading-none tracking-tight">
                {consoleData.name}
            </h1>
        </header>
    );
}
