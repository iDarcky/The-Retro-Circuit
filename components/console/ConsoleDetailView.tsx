'use client';

import { useState, useEffect, type FC, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import ConsoleHero from './swiss/ConsoleHero';
import type { CatalogueStats } from '../../app/actions/scoring';
import ConsoleTabs from './swiss/ConsoleTabs';
import PlayabilityTiers from './swiss/PlayabilityTiers';
import Section from './swiss/Section';
import VariantGuide from './swiss/VariantGuide';
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
        ...(variants.length > 1 ? [{ id: 'configurations', label: 'Configurations' }] : []),
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

             <ConsoleTabs tabs={TABS} />

             <main className="max-w-[1600px] mx-auto px-4 md:px-8 mt-10 animate-fadeIn">

                {/* CONFIGURATIONS — the question only this site can answer, so it leads
                    on any device that ships in more than one. */}
                {variants.length > 1 && (
                    <Section
                        id="configurations"
                        first
                        eyebrow={`${variants.length} configurations of this device`}
                        title="WHICH ONE TO BUY"
                        actions={
                            <button
                                type="button"
                                onClick={() => setIsVariantModalOpen(true)}
                                className="px-3 py-2 border border-white/15 text-gray-400 hover:border-white hover:text-white
                                           font-mono text-[10px] uppercase tracking-widest transition-colors"
                            >
                                Full spec table
                            </button>
                        }
                    >
                        <VariantGuide
                            variants={variants}
                            selectedId={selectedVariantId}
                            onSelect={handleVariantChange}
                        />
                    </Section>
                )}

                {/* PLAYABILITY — the site's one unique asset. */}
                <Section
                    id="playability"
                    first={variants.length <= 1}
                    eyebrow="Measured per system, not estimated"
                    title="PLAYABILITY"
                >
                    <PlayabilityTiers profile={emulationProfile} />
                </Section>

                {/* COMPARE */}
                {heroScore && (
                    <Section
                        id="compare"
                        eyebrow={`Against other tier ${heroScore.reach} devices`}
                        title="HOW IT STANDS"
                    >
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
                            batteryPercentile={
                                // Rank against the population that shares this device's unit.
                                mergedSpecs.battery_capacity_wh && heroTierStats?.batteriesWh.length
                                    ? percentileOf(Number(mergedSpecs.battery_capacity_wh), heroTierStats.batteriesWh)
                                    : mergedSpecs.battery_capacity_mah && heroTierStats?.batteriesMah.length
                                        ? percentileOf(Number(mergedSpecs.battery_capacity_mah), heroTierStats.batteriesMah)
                                        : null
                            }
                        />
                    </Section>
                )}

                {/* SPECIFICATION */}
                <Section
                    id="tech"
                    eyebrow="Every recorded field for this configuration"
                    title="FULL SPECIFICATIONS"
                    actions={
                        <div className="flex gap-px" role="group" aria-label="Specification layout">
                            {(['grid', 'table', 'ribbon'] as const).map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setTechViewMode(mode)}
                                    aria-pressed={techViewMode === mode}
                                    className={`px-2.5 py-1.5 border font-mono text-[9px] uppercase tracking-wider transition-colors ${
                                        techViewMode === mode
                                            ? 'border-white bg-white text-black'
                                            : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    }
                >
                     <TechnicalReference mergedSpecs={mergedSpecs} viewMode={techViewMode as 'grid' | 'table' | 'ribbon'} />
                </Section>

                {/* ANALYSIS + ACQUISITION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 rc-rule-top pt-[18px] mt-20">
                    <section id="analysis" className="lg:col-span-8 scroll-mt-32">
                        <h2 className="font-pixel text-[13px] md:text-[15px] text-violet-500 mb-6 uppercase tracking-widest">SYSTEM ANALYSIS</h2>
                        <SystemAnalysis description={consoleData.description || ''} />
                    </section>

                    <section id="buy" className="lg:col-span-4 scroll-mt-32">
                        <h2 className="font-pixel text-[13px] md:text-[15px] text-violet-500 mb-6 uppercase tracking-widest">WHERE TO BUY</h2>
                        <BuySection
                            asin={currentVariant?.amazon_asin || null}
                            searchQuery={[consoleData.manufacturer?.name, consoleData.name].filter(Boolean).join(' ')}
                            vendorLinks={(consoleData.links || []).filter((l) => l.kind === 'vendor')}
                        />
                    </section>
                </div>

                {/* ROW 4: LINKS — reviews and retail */}
                {consoleData.links && consoleData.links.length > 0 && (
                    <Section id="links" eyebrow="Reviews and retail" title="ELSEWHERE">
                        <ConsoleLinks
                            links={consoleData.links}
                            productName={consoleData.name}
                            manufacturerName={consoleData.manufacturer?.name}
                        />
                    </Section>
                )}

                {/* ROW 5: SIMILAR CONSOLES */}
                <Section id="similar" eyebrow="Same tier, comparable price" title="SIMILAR HARDWARE">
                     <SimilarConsoles currentConsole={consoleData} />
                </Section>

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
