'use client';

import { useState, useEffect, type FC, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import ConsoleIdentitySection from './ConsoleIdentitySection';
import PlayabilityMatrix from './PlayabilityMatrix';
import BuySection from './BuySection';
import { getConsoleImage } from '../../lib/utils';
import EmulationSummary from './EmulationSummary';

// Swiss Design Components
import SystemAnalysis from './swiss/SystemAnalysis';
import CombinedMetrics from './swiss/CombinedMetrics';
import TechnicalReference from './swiss/TechnicalReference';
import SwissModal from './swiss/SwissModal';
import VariantComparisonTable from './swiss/VariantComparisonTable';
import SimilarConsoles from './swiss/SimilarConsoles';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
}

// --- MAIN COMPONENT ---

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const variants = useMemo(() => consoleData.variants || [], [consoleData.variants]);
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
    const getMergedSpecs = useCallback((varId: string): MergedSpecs => {
        const baseSpecs = consoleData.specs || {};
        if (varId === 'base') return baseSpecs;
        const variant = variants.find(x => x.id === varId);
        if (!variant) return baseSpecs;
        return { ...baseSpecs, ...variant };
    }, [consoleData.specs, variants]);

    const [mergedSpecs, setMergedSpecs] = useState<MergedSpecs>(() => getMergedSpecs(getInitialVariantId()));

    // Modal State
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isEmulationModalOpen, setIsEmulationModalOpen] = useState(false);
    const [techViewMode, setTechViewMode] = useState<'grid' | 'table' | 'ribbon'>('grid');

    useEffect(() => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug && hasVariants) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) setSelectedVariantId(variant.id);
        }
    }, [searchParams, variants, hasVariants]);

    useEffect(() => {
        setMergedSpecs(getMergedSpecs(selectedVariantId));
    }, [selectedVariantId, getMergedSpecs]);

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

    const emulationProfile = mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles;

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
                onCompareVariants={() => setIsVariantModalOpen(true)}
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
                        
                        {/* COMBINED METRICS & EMULATION SUMMARY */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="font-pixel text-sm text-orange-500 mb-6 uppercase tracking-widest">KEY METRICS</h2>
                                <CombinedMetrics
                                    console={consoleData}
                                    specs={mergedSpecs}
                                    releaseDate={currentVariant?.release_date || null}
                                />
                            </div>

                            {/* EMULATION SCORE CARD (Moved Here) */}
                            <EmulationSummary
                                profile={emulationProfile}
                                onClick={() => setIsEmulationModalOpen(true)}
                            />
                        </div>
                    </div>
                </div>

                {/* ROW 2: ANALYSIS & LOGISTICS (Rearranged) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/10 pt-8">
                    {/* System Analysis (Span 8) */}
                    <section className="lg:col-span-8">
                        <h2 className="font-pixel text-sm text-orange-500 mb-6 uppercase tracking-widest">SYSTEM ANALYSIS</h2>
                        <SystemAnalysis description={consoleData.description || ''} />
                    </section>

                    {/* Acquisition (Span 4) */}
                    <section id="buy" className="lg:col-span-4">
                        <BuySection
                            asin={currentVariant?.amazon_asin || null}
                            searchQuery={[consoleData.manufacturer?.name, consoleData.name].filter(Boolean).join(' ') || null}
                        />
                    </section>
                </div>

                {/* ROW 3: TECHNICAL REFERENCE */}
                <section id="tech" className="border-t border-white/10 pt-8">
                     <div className="flex items-center justify-between mb-6">
                         <h2 className="font-pixel text-sm text-orange-500 uppercase tracking-widest">FULL SPECIFICATIONS</h2>
                         <div className="flex flex-wrap font-mono text-[10px] md:text-xs gap-2 md:gap-4 text-gray-500">
                             <button
                                onClick={() => setTechViewMode('grid')}
                                className={`transition-colors hover:text-white pb-1 ${techViewMode === 'grid' ? 'text-white border-b border-orange-500' : ''}`}
                             >[ GRID ]</button>
                             <button
                                onClick={() => setTechViewMode('table')}
                                className={`transition-colors hover:text-white pb-1 ${techViewMode === 'table' ? 'text-white border-b border-orange-500' : ''}`}
                             >[ TABLE ]</button>
                             <button
                                onClick={() => setTechViewMode('ribbon')}
                                className={`transition-colors hover:text-white pb-1 ${techViewMode === 'ribbon' ? 'text-white border-b border-orange-500' : ''}`}
                             >[ RIBBON ]</button>
                         </div>
                     </div>
                     <hr className="border-t border-white/10 mb-8" />
                     <TechnicalReference mergedSpecs={mergedSpecs} viewMode={techViewMode as 'grid' | 'table' | 'ribbon'} />
                </section>

                {/* ROW 4: SIMILAR CONSOLES */}
                <section id="similar" className="border-t border-white/10 pt-8 mt-12">
                     <h2 className="font-pixel text-sm text-orange-500 mb-6 uppercase tracking-widest">SIMILAR HARDWARE</h2>
                     <SimilarConsoles currentConsole={consoleData} />
                </section>

             </main>

            {/* VARIANT COMPARISON MODAL */}
            <SwissModal
                isOpen={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                title={`VARIANT COMPARISON // ${consoleData.name}`}
            >
                <VariantComparisonTable variants={variants} baseSpecs={consoleData.specs || {}} />
            </SwissModal>

            {/* EMULATION MATRIX MODAL */}
            <SwissModal
                isOpen={isEmulationModalOpen}
                onClose={() => setIsEmulationModalOpen(false)}
                title={`EMULATION MATRIX // ${consoleData.name}`}
            >
                <div className="p-4 md:p-8">
                     <PlayabilityMatrix profile={emulationProfile} />
                </div>
            </SwissModal>
        </div>
    );
};

export default ConsoleDetailView;
