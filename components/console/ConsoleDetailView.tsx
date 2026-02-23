'use client';

import { useState, useEffect, type FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant } from '../../lib/types';
import { getConsoleImage } from '../../lib/utils';

// Swiss Design Components
import ConsoleHeader from './swiss/ConsoleHeader';
import PhotoGallery from './swiss/PhotoGallery';
import SystemAnalysis from './swiss/SystemAnalysis';
import KeyMetrics from './swiss/KeyMetrics';
import SwissAcquisition from './swiss/SwissAcquisition';
import TechnicalReference from './swiss/TechnicalReference';
import PlayabilityMatrix from './PlayabilityMatrix';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
}

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
        <div className="w-full animate-fadeIn relative">
             <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">

                {/* 1. HEADER (Swiss Simplified) */}
                <ConsoleHeader
                    console={consoleData}
                    manufacturer={consoleData.manufacturer || null}
                    variants={variants}
                    selectedVariantId={selectedVariantId}
                    onVariantChange={(slug) => {
                        const v = variants.find(v => v.slug === slug);
                        if (v) handleVariantChange(v.id);
                    }}
                />

                {/* 2. PHOTO GALLERY */}
                <div className="mb-12">
                    <PhotoGallery imageUrl={currentImage} altText={consoleData.name} />
                </div>

                {/* 3. SYSTEM ANALYSIS + KEY METRICS */}
                <div className="mb-12">
                    <SystemAnalysis description={consoleData.description || ''} />
                    <KeyMetrics specs={mergedSpecs} releaseDate={currentVariant?.release_date || null} />
                </div>

                {/* 4. EMULATION MATRIX */}
                <div className="mb-12">
                    <PlayabilityMatrix profile={mergedSpecs.emulation_profile || (mergedSpecs as any).emulation_profiles} />
                </div>

                {/* 5. ACQUISITION */}
                <div className="mb-12">
                    <SwissAcquisition />
                </div>

                {/* 6. TECHNICAL REFERENCE */}
                <div className="mb-12">
                    <TechnicalReference mergedSpecs={mergedSpecs} />
                </div>

            </div>
        </div>
    );
};

export default ConsoleDetailView;
