'use client';

import { useState, useEffect, type FC, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import { SwissDropdown } from '../ui/SwissDropdown';
import ConsoleHero from './swiss/ConsoleHero';
import type { CatalogueStats } from '../../app/actions/scoring';
import ConsoleTabs from './swiss/ConsoleTabs';
import PlayabilityTiers from './swiss/PlayabilityTiers';
import TierComparison from './swiss/TierComparison';
import { circuitScore, percentileOf } from '../../lib/scoring/circuit-score';
import PlayabilityMatrix from './PlayabilityMatrix';
import BuySection from './BuySection';
import { getConsoleImage } from '../../lib/utils';

// Swiss Design Components
import SystemAnalysis from './swiss/SystemAnalysis';
import TechnicalReference from './swiss/TechnicalReference';
import SwissModal from './swiss/SwissModal';
import VariantComparisonTable from './swiss/VariantComparisonTable';
import SimilarConsoles from './swiss/SimilarConsoles';
import ConsoleLinks from './ConsoleLinks';

interface ConsoleDetailViewProps {
    /** Extra shots from console_images; empty until a console has a gallery. */
    galleryImages?: { id: string; url: string; alt_text: string | null; kind: string | null }[];
    /** Per-tier score and price distributions, for the standings. */
    catalogueStats?: CatalogueStats;
  consoleData: ConsoleDetails;
}

// --- MAIN COMPONENT ---

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData, galleryImages = [], catalogueStats }) => {
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

    // The carousel is real photographs only. `currentImage` is the pixel-art cover — an
    // identity mark rather than a picture of the device — so it renders as an icon beside
    // the name instead of as a slide.
    //
    // Almost no console has photos yet, so when there are none the pixel art still fills
    // the hero as a single static image; otherwise those pages would read "NO SIGNAL".
    const heroShots = galleryImages.length
        ? galleryImages
        : currentImage
          ? [{ id: 'cover', url: currentImage, alt_text: consoleData.name, kind: 'cover' }]
          : [];
    const isPixelFallback = galleryImages.length === 0 && !!currentImage;
    const [heroIndex, setHeroIndex] = useState(0);

    const emulationProfile = mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles;

    const compareUrl = `/arena/${consoleData.slug}${currentVariant?.slug ? `-${currentVariant.slug}` : ''}-vs-select`;

    const [shareCopied, setShareCopied] = useState(false);
    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href).then(() => {
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 1600);
        }).catch(() => {});
    };

    const TABS = [
        { id: 'playability', label: 'Playability' },
        { id: 'compare', label: 'Compare' },
        { id: 'analysis', label: 'Analysis' },
        { id: 'tech', label: 'Specification' },
        { id: 'buy', label: 'Buy' },
        { id: 'similar', label: 'Similar' },
    ];

    // Recomputed here so the comparison strip can stand on its own; the hero does the
    // same arithmetic for its cards. Both read the one formula in lib/scoring.
    const heroScore = circuitScore(
        emulationProfile,
        consoleData.setup_ease_score,
        consoleData.community_score,
    );
    const heroTierStats = heroScore && catalogueStats ? catalogueStats[heroScore.reach] : undefined;
    const heroPrice = currentVariant?.price_avg_usd ?? currentVariant?.price_launch_usd ?? null;

    return (
        <div className="w-full min-h-screen bg-[#09090b] text-white selection:bg-orange-500/30 selection:text-white pb-20">

             {/* FOLD: the device, the price, the tier, the two actions. */}
             <ConsoleHero
                consoleData={consoleData}
                specs={mergedSpecs}
                variant={currentVariant}
                profile={emulationProfile}
                shots={heroShots}
                heroIndex={heroIndex}
                onHeroIndex={setHeroIndex}
                isPixelFallback={isPixelFallback}
                compareUrl={compareUrl}
                onShare={handleShare}
                shareCopied={shareCopied}
                onEmulationDetails={() => setIsEmulationModalOpen(true)}
                catalogueStats={catalogueStats}
             />

             {/* Variant switch and comparison, only where there is a choice to make. */}
             {variants.length > 1 && (
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-6 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Variant</span>
                    <SwissDropdown
                        value={selectedVariantId}
                        onChange={(val) => handleVariantChange(String(val))}
                        options={variants.map(v => ({ label: v.variant_name || 'Base', value: v.id }))}
                        labelPrefix=""
                        inverted={false}
                        className="min-w-[190px]"
                        buttonClassName="bg-black border border-white/15 px-3 py-2 text-white font-mono text-xs h-[38px] flex justify-between items-center hover:border-white transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setIsVariantModalOpen(true)}
                        className="px-3 py-2 border border-white/15 text-gray-400 hover:border-white hover:text-white
                                   font-mono text-[10px] uppercase tracking-widest transition-colors h-[38px]"
                    >
                        Compare {variants.length} variants
                    </button>
                </div>
             )}

             <ConsoleTabs tabs={TABS} />

             <main className="max-w-[1600px] mx-auto px-4 md:px-8 mt-10 space-y-8 animate-fadeIn">
                {/* PLAYABILITY — the site's one unique asset, so it leads. */}
                <section id="playability" className="scroll-mt-32">
                    <PlayabilityTiers profile={emulationProfile} />
                </section>

                {/* COMPARE */}
                {heroScore && (
                    <section id="compare" className="border-t border-white/10 pt-8 scroll-mt-32">
                        <TierComparison
                            reach={heroScore.reach}
                            stats={heroTierStats}
                            price={heroPrice ? Number(heroPrice) : null}
                            pricePercentile={heroPrice && heroTierStats?.prices.length
                                ? percentileOf(Number(heroPrice), heroTierStats.prices) : null}
                            score={heroScore.score}
                            scorePercentile={heroTierStats?.scores.length
                                ? percentileOf(heroScore.score, heroTierStats.scores) : null}
                            batteryMah={mergedSpecs.battery_capacity_mah}
                            batteryWh={mergedSpecs.battery_capacity_wh}
                            batteryPercentile={null}
                        />
                    </section>
                )}

                {/* SPECIFICATION */}
                <section id="tech" className="border-t border-white/10 pt-8 scroll-mt-32">
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

                {/* ANALYSIS + ACQUISITION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/10 pt-8">
                    <section id="analysis" className="lg:col-span-8 scroll-mt-32">
                        <h2 className="font-pixel text-sm text-orange-500 mb-6 uppercase tracking-widest">SYSTEM ANALYSIS</h2>
                        <SystemAnalysis description={consoleData.description || ''} />
                    </section>

                    <section id="buy" className="lg:col-span-4 scroll-mt-32">
                        <BuySection
                            asin={currentVariant?.amazon_asin || null}
                            searchQuery={[consoleData.manufacturer?.name, consoleData.name].filter(Boolean).join(' ')}
                            vendorLinks={(consoleData.links || []).filter((l) => l.kind === 'vendor')}
                        />
                    </section>
                </div>

                {/* ROW 4: LINKS — reviews and retail */}
                {consoleData.links && consoleData.links.length > 0 && (
                    <section id="links" className="border-t border-white/10 pt-8 mt-12">
                        <ConsoleLinks
                            links={consoleData.links}
                            productName={consoleData.name}
                            manufacturerName={consoleData.manufacturer?.name}
                        />
                    </section>
                )}

                {/* ROW 5: SIMILAR CONSOLES */}
                <section id="similar" className="border-t border-white/10 pt-8 mt-12 scroll-mt-32">
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
