'use client';

import { useState, useEffect, Suspense, type Dispatch, type SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchConsoleList, fetchConsoleBySlug } from '../../lib/api';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { useSound } from '../../components/ui/SoundContext';
import { METRICS } from '../../lib/config/arena-metrics';
import { ComparisonRow } from '../../components/arena/ComparisonRow';
import { ConsoleSearch } from '../../components/arena/ConsoleSearch';
import { VariantSelector } from '../../components/arena/VariantSelector';
import RetroStatusBar from '../../components/ui/RetroStatusBar';

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

function VSModeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playClick } = useSound();

    const [allConsoles, setAllConsoles] = useState<{name: string, slug: string}[]>([]);
    
    const [selectionA, setSelectionA] = useState<SelectionState>({ slug: null, details: null, selectedVariant: null, loading: false });
    const [selectionB, setSelectionB] = useState<SelectionState>({ slug: null, details: null, selectedVariant: null, loading: false });
    
    const [showDiffOnly, setShowDiffOnly] = useState(false);

    useEffect(() => {
        fetchConsoleList().then((list) => setAllConsoles(list));
    }, []);

    const loadSelection = async (slug: string, variantSlug: string | null, setSelection: Dispatch<SetStateAction<SelectionState>>) => {
        setSelection(prev => ({ ...prev, loading: true, slug }));
        const { data: details } = await fetchConsoleBySlug(slug);
        if (details) {
            const variants = details.variants || [];
            let variant = variantSlug ? variants.find(v => v.slug === variantSlug) : null;
            if (!variant) {
                variant = variants.find(v => v.is_default) || variants[0] || null;
            }
            setSelection({ slug, details, selectedVariant: variant, loading: false });
        } else {
            setSelection(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        const p1 = searchParams?.get('p1');
        const v1 = searchParams?.get('v1');
        const p2 = searchParams?.get('p2');
        const v2 = searchParams?.get('v2');

        if (p1 && p1 !== selectionA.slug) {
            loadSelection(p1, v1 || null, setSelectionA);
        } else if (selectionA.details && v1 && v1 !== selectionA.selectedVariant?.slug) {
            const variant = selectionA.details.variants?.find(v => v.slug === v1) || null;
            setSelectionA(prev => ({ ...prev, selectedVariant: variant }));
        }

        if (p2 && p2 !== selectionB.slug) {
            loadSelection(p2, v2 || null, setSelectionB);
        } else if (selectionB.details && v2 && v2 !== selectionB.selectedVariant?.slug) {
            const variant = selectionB.details.variants?.find(v => v.slug === v2) || null;
            setSelectionB(prev => ({ ...prev, selectedVariant: variant }));
        }
    }, [searchParams]);

    const updateUrl = (p1?: string | null, v1?: string | null, p2?: string | null, v2?: string | null) => {
        const params = new URLSearchParams();
        const finalP1 = p1 !== undefined ? p1 : selectionA.slug;
        const finalV1 = v1 !== undefined ? v1 : selectionA.selectedVariant?.slug;
        const finalP2 = p2 !== undefined ? p2 : selectionB.slug;
        const finalV2 = v2 !== undefined ? v2 : selectionB.selectedVariant?.slug;

        if (finalP1) params.set('p1', finalP1);
        if (finalV1) params.set('v1', finalV1);
        if (finalP2) params.set('p2', finalP2);
        if (finalV2) params.set('v2', finalV2);

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleSelect = (setter: Dispatch<SetStateAction<SelectionState>>, isPlayer1: boolean) => (slug: string) => {
        setter(prev => ({ ...prev, loading: true }));
        if (isPlayer1) {
            updateUrl(slug, null, undefined, undefined);
        } else {
            updateUrl(undefined, undefined, slug, null);
        }
        playClick();
    };

    const handleVariantChange = (setter: Dispatch<SetStateAction<SelectionState>>, isPlayer1: boolean) => (slug: string) => {
        const selection = isPlayer1 ? selectionA : selectionB;
        const variant = selection.details?.variants?.find(v => v.slug === slug) || null;
        setter(prev => ({ ...prev, selectedVariant: variant }));
        if (isPlayer1) {
            updateUrl(undefined, slug, undefined, undefined);
        } else {
            updateUrl(undefined, undefined, undefined, slug);
        }
    };

    return (
        <div className="w-full">
            <div className="hidden md:block">
                <RetroStatusBar
                    rcPath="RC://RETRO_CIRCUIT/ARENA/VS"
                    docId="VS_PROTOCOL_V1"
                />
            </div>

        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col min-h-screen">
            <h1 className="text-3xl md:text-5xl font-pixel text-center text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                VS MODE <span className="text-secondary">ARENA</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8 relative z-10">
                {/* VS Badge - Centered */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center">
                    <div className="hidden md:flex w-16 h-16 bg-black rounded-full items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        <span className="font-pixel text-xl italic text-white">VS</span>
                    </div>
                </div>

                {/* Player 1 Card - Cyan */}
                <div className="border border-primary bg-primary/5 relative shadow-lg hover:shadow-primary/20 transition-shadow md:-skew-x-10 z-10">
                     <div className="md:skew-x-10 p-2 md:p-6 flex flex-col h-full">
                        <h2 className="font-pixel text-[10px] md:text-base text-primary mb-2 text-left">[ PLAYER 1 ]</h2>
                        <ConsoleSearch 
                            consoles={allConsoles} 
                            onSelect={(slug) => handleSelect(setSelectionA, true)(slug)} 
                            themeColor="cyan"
                            currentSelection={selectionA.details?.name}
                        />
                        {selectionA.loading ? (
                             <div className="flex-1 flex items-center justify-center text-primary font-mono animate-pulse text-[10px] md:text-base mt-4">LOADING...</div>
                        ) : selectionA.details ? (
                             <div className="mt-2 md:mt-6 flex-1 flex flex-col md:items-center animate-fadeIn">
                                 <Link
                                    href={`/consoles/${selectionA.details.slug}`}
                                    className="flex flex-row md:flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4 group w-full"
                                 >
                                     <div className="relative w-10 h-10 md:w-full md:h-32 flex-shrink-0">
                                         {(selectionA.selectedVariant?.image_url || selectionA.details.image_url) ? (
                                             <img src={selectionA.selectedVariant?.image_url || selectionA.details.image_url} alt={selectionA.details.name} className="w-full h-full object-contain drop-shadow-lg" />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center text-primary opacity-50 font-pixel text-[8px] md:text-xs">NO IMG</div>
                                         )}
                                     </div>
                                     <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                         <h3 className="font-pixel text-[10px] md:text-xl text-white truncate group-hover:text-primary transition-colors">{selectionA.details.name}</h3>
                                         <div className="font-mono text-[8px] md:text-xs text-primary truncate">{selectionA.details.manufacturer?.name}</div>
                                     </div>
                                 </Link>

                                 <VariantSelector
                                    variants={selectionA.details.variants || []}
                                    selectedSlug={selectionA.selectedVariant?.slug || ''}
                                    onSelect={handleVariantChange(setSelectionA, true)}
                                    themeColor="cyan"
                                 />
                             </div>
                        ) : (
                             <div className="flex-1 flex items-center justify-center text-gray-600 font-pixel text-[8px] md:text-xs opacity-50 mt-4">SELECT FIGHTER</div>
                        )}
                     </div>
                </div>

                {/* Player 2 Card - Pink */}
                <div className="border border-accent bg-accent/5 relative shadow-lg hover:shadow-accent/20 transition-shadow md:skew-x-10 z-0">
                     <div className="md:-skew-x-10 p-2 md:p-6 flex flex-col h-full">
                        <h2 className="font-pixel text-[10px] md:text-base text-accent mb-2 text-left md:text-right">[ PLAYER 2 ]</h2>
                        <ConsoleSearch 
                            consoles={allConsoles} 
                            onSelect={(slug) => handleSelect(setSelectionB, false)(slug)} 
                            themeColor="pink"
                            currentSelection={selectionB.details?.name}
                        />
                        {selectionB.loading ? (
                             <div className="flex-1 flex items-center justify-center text-accent font-mono animate-pulse text-[10px] md:text-base mt-4">LOADING...</div>
                        ) : selectionB.details ? (
                             <div className="mt-2 md:mt-6 flex-1 flex flex-col md:items-center animate-fadeIn">
                                 <Link
                                    href={`/consoles/${selectionB.details.slug}`}
                                    className="flex flex-row md:flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4 group w-full"
                                 >
                                     <div className="relative w-10 h-10 md:w-full md:h-32 flex-shrink-0">
                                         {(selectionB.selectedVariant?.image_url || selectionB.details.image_url) ? (
                                             <img src={selectionB.selectedVariant?.image_url || selectionB.details.image_url} alt={selectionB.details.name} className="w-full h-full object-contain drop-shadow-lg" />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center text-accent opacity-50 font-pixel text-[8px] md:text-xs">NO IMG</div>
                                         )}
                                     </div>
                                     <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                         <h3 className="font-pixel text-[10px] md:text-xl text-white truncate group-hover:text-accent transition-colors">{selectionB.details.name}</h3>
                                         <div className="font-mono text-[8px] md:text-xs text-accent truncate">{selectionB.details.manufacturer?.name}</div>
                                     </div>
                                 </Link>

                                 <VariantSelector
                                    variants={selectionB.details.variants || []}
                                    selectedSlug={selectionB.selectedVariant?.slug || ''}
                                    onSelect={handleVariantChange(setSelectionB, false)}
                                    themeColor="pink"
                                 />
                             </div>
                        ) : (
                             <div className="flex-1 flex items-center justify-center text-gray-600 font-pixel text-[8px] md:text-xs opacity-50 mt-4">SELECT FIGHTER</div>
                        )}
                     </div>
                </div>
            </div>

            {selectionA.selectedVariant && selectionB.selectedVariant && (
                <div className="bg-black/80 border border-gray-800 p-4 mb-12 animate-slideDown shadow-2xl">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                        <h3 className="font-pixel text-lg text-white">TALE OF THE TAPE</h3>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={showDiffOnly} 
                                onChange={() => setShowDiffOnly(!showDiffOnly)}
                                className="accent-secondary"
                            />
                            <span className="font-mono text-xs text-gray-400 uppercase">Show Differences Only</span>
                        </label>
                    </div>
                    <div className="space-y-1">
                        {METRICS.map(metric => (
                            <ComparisonRow 
                                key={metric.key} 
                                metric={metric} 
                                varA={selectionA.selectedVariant!} 
                                varB={selectionB.selectedVariant!}
                                showDiffOnly={showDiffOnly}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-secondary font-mono">LOADING ARENA...</div>}>
            <VSModeContent />
        </Suspense>
    );
}
