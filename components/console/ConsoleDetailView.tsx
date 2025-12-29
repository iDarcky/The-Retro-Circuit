'use client';

import { useState, useEffect, type FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails } from '../../lib/types';
import ConsoleIdentitySection from './ConsoleIdentitySection';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
}

// --- MAIN COMPONENT ---

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const variants = consoleData.variants || [];
    const hasVariants = variants.length > 0;

    // --- VARIANT SELECTION LOGIC ---

    const getInitialVariantId = () => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) return variant.id;
        }
        if (hasVariants) {
            const defaultVar = variants.find(v => v.is_default);
            return defaultVar ? defaultVar.id : variants[0].id;
        }
        return 'base';
    };

    const [selectedVariantId, setSelectedVariantId] = useState<string>(getInitialVariantId);
    
    useEffect(() => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) setSelectedVariantId(variant.id);
        }
    }, [searchParams, variants, hasVariants]);

    const handleVariantChange = (id: string) => {
        setSelectedVariantId(id);
        const params = new URLSearchParams(searchParams?.toString());
        if (id === 'base') {
            params.delete('variant');
        } else {
            const v = variants.find(v => v.id === id);
            if (v?.slug) params.set('variant', v.slug);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full animate-fadeIn relative">
             <ConsoleIdentitySection
                console={consoleData}
                manufacturer={consoleData.manufacturer || null}
                variants={variants}
                selectedVariantId={selectedVariantId}
                onVariantChange={(slug) => {
                     // Reverse lookup ID
                     const v = variants.find(v => v.slug === slug);
                     if (v) handleVariantChange(v.id);
                }}
             />

             {/* Placeholders for future sections */}
             <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col gap-12">
                 <div id="analysis" className="min-h-[400px] border border-white/10 flex items-center justify-center bg-white/5">
                     <span className="font-mono text-gray-500 uppercase tracking-widest">[ SECTION II: ANALYSIS PENDING ]</span>
                 </div>

                 <div id="playability" className="min-h-[400px] border border-white/10 flex items-center justify-center bg-white/5">
                     <span className="font-mono text-gray-500 uppercase tracking-widest">[ EMULATION MATRIX PENDING ]</span>
                 </div>

                 <div id="tech" className="min-h-[400px] border border-white/10 flex items-center justify-center bg-white/5">
                     <span className="font-mono text-gray-500 uppercase tracking-widest">[ TECH SPECS PENDING ]</span>
                 </div>

                 <div id="buy" className="min-h-[200px] border border-white/10 flex items-center justify-center bg-white/5">
                     <span className="font-mono text-gray-500 uppercase tracking-widest">[ ACQUISITION CHANNELS PENDING ]</span>
                 </div>
             </div>
        </div>
    );
};

export default ConsoleDetailView;
