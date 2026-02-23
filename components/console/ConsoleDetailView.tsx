'use client';

import { useState, useEffect, type FC, useMemo, useCallback } from 'react';
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

    return (
        <div className="w-full animate-fadeIn relative">
             {/* SECTION I: IDENTITY (Sticky) */}
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
             <div className="w-full mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 relative">

                    {/* --- LEFT COLUMN: STICKY SIDEBAR (lg:col-span-4) --- */}
                    <div className="lg:col-span-4">
                        {/* Sticky Container */}
                        {/* top-[120px] accounts for global header (64px) + typical compact bar height (~50px) */}
                        <div className="sticky top-[120px] space-y-6">

                            {/* 1. PHOTO */}
                            <div className="bg-black border-2 border-border-normal p-8 flex items-center justify-center min-h-[200px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)] group overflow-hidden">
                                {currentImage ? (
                                    <img src={currentImage} alt={consoleData.name} className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10" key={currentImage} />
                                ) : (
                                    <div className="text-muted font-pixel text-4xl opacity-50">NO SIGNAL</div>
                                )}
                                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                                    <div className="bg-secondary text-black font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                                        {consoleData.form_factor?.toUpperCase() || 'SYSTEM'}
                                    </div>
                                    {consoleData.chassis_features && (
                                        <div className="bg-black/90 text-secondary border border-secondary font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                                            {consoleData.chassis_features.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. MISSION PROFILE */}
                            <MissionProfile />

                            {/* 3. BUY */}
                            <div id="buy">
                                <BuySection />
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: SCROLLABLE CONTENT (lg:col-span-8) --- */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. SYSTEM ANALYSIS */}
                        <div id="analysis" className="bg-bg-primary border border-border-normal p-6 relative">
                            <SystemAnalysis description={consoleData.description || ''} />
                        </div>

                        {/* 2. KEY METRICS (Replaces "At A Glance") */}
                        <KeyMetrics specs={mergedSpecs} releaseDate={currentVariant?.release_date || null} />

                        {/* 3. EMULATION MATRIX */}
                        <div id="playability">
                            <PlayabilityMatrix profile={mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles} />
                        </div>

                        {/* 4. TECHNICAL REFERENCE (Collapsible Grid) */}
                        <div id="tech">
                            <TechnicalReference mergedSpecs={mergedSpecs} />
                        </div>

                    </div>
                </div>
             </div>
        </div>
    );
};

export default ConsoleDetailView;
