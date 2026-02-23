'use client';

import { useState, useEffect, type FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import ConsoleIdentitySection from './ConsoleIdentitySection';
import PlayabilityMatrix from './PlayabilityMatrix';
import MissionProfile from './MissionProfile';
import BuySection from './BuySection';
import { getConsoleImage } from '../../lib/utils';

// Swiss Design Components
import SystemAnalysis from './swiss/SystemAnalysis';
import KeyMetrics from './swiss/KeyMetrics';
import TechnicalReference from './swiss/TechnicalReference';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
}

// --- MAIN COMPONENT ---

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const variants = consoleData.variants || [];
    const hasVariants = variants.length > 0;

    // --- VARIANT LOGIC ---
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
    
    type MergedSpecs = Partial<ConsoleSpecs> & Partial<ConsoleVariant>;
    const getMergedSpecs = (varId: string): MergedSpecs => {
        const baseSpecs = consoleData.specs || {};
        if (varId === 'base') return baseSpecs;
        const variant = variants.find(x => x.id === varId);
        if (!variant) return baseSpecs;
        return { ...baseSpecs, ...variant };
    };

    const [mergedSpecs, setMergedSpecs] = useState<MergedSpecs>(() => getMergedSpecs(getInitialVariantId()));

    useEffect(() => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) setSelectedVariantId(variant.id);
        }
    }, [searchParams, variants, hasVariants]);

    useEffect(() => {
        setMergedSpecs(getMergedSpecs(selectedVariantId));
    }, [selectedVariantId, consoleData.specs, variants]);

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

    const currentVariant = variants.find(v => v.id === selectedVariantId);
    const currentImage = getConsoleImage({ console: consoleData, variant: currentVariant });

    return (
        <div className="w-full min-h-screen bg-[#09090b] text-white selection:bg-orange-500/30 selection:text-white pb-20">

             {/* SECTION I: IDENTITY & HEADER */}
             <ConsoleIdentitySection
                console={consoleData}
                manufacturer={consoleData.manufacturer || null}
                variants={variants}
                selectedVariantId={selectedVariantId}
                onVariantChange={(slug) => {
                     const v = variants.find(v => v.slug === slug);
                     if (v) handleVariantChange(v.id);
                }}
             />

             {/* MAIN CONTENT GRID */}
             <main className="max-w-[1600px] mx-auto px-4 md:px-8 mt-8 space-y-8 animate-fadeIn">

                {/* ROW 1: VISUALS + BRIEFING */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* VISUALS (Left - Span 8) */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <div className="relative w-full aspect-video bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden group">
                            {/* Technical Markings */}
                            <div className="absolute top-4 left-4 text-[10px] font-mono text-white/30 tracking-widest">FIG. 01 // {consoleData.name.toUpperCase()}</div>
                            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/30 tracking-widest">SCALE 1:1</div>
                            <div className="absolute top-4 right-4 text-[10px] font-mono text-white/30 tracking-widest">
                                {consoleData.form_factor?.toUpperCase() || 'SYSTEM'}
                            </div>

                            {/* Image */}
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={consoleData.name}
                                    className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                                    key={currentImage}
                                />
                            ) : (
                                <div className="text-zinc-700 font-pixel text-2xl">NO SIGNAL</div>
                            )}
                        </div>
                    </div>

                    {/* BRIEFING (Right - Span 4) */}
                    <div className="lg:col-span-4 flex flex-col h-full border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-8 pt-8 lg:pt-0">
                        {/* Renamed Header as requested */}
                        <h2 className="font-pixel text-sm text-orange-500 mb-6 uppercase tracking-widest">QUICK GLANCE</h2>

                        {/* Description */}
                        <div className="mb-8">
                            <SystemAnalysis description={consoleData.description || ''} />
                        </div>

                        {/* Metrics Grid */}
                        <div className="mt-auto">
                            <KeyMetrics specs={mergedSpecs} releaseDate={currentVariant?.release_date || null} />
                        </div>
                    </div>
                </div>

                {/* ROW 2: EMULATION & LOGISTICS (Moved Up) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-white/10 pt-8">
                    {/* Playability */}
                    <section id="playability">
                        <PlayabilityMatrix profile={mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles} />
                    </section>

                    {/* Logistics */}
                    <section className="space-y-8">
                        <MissionProfile />
                        <div id="buy">
                            <BuySection />
                        </div>
                    </section>
                </div>

                {/* ROW 3: TECHNICAL REFERENCE (Moved Down) */}
                <section id="tech" className="border-t border-white/10 pt-8">
                     <TechnicalReference mergedSpecs={mergedSpecs} />
                </section>

             </main>
        </div>
    );
};

export default ConsoleDetailView;
