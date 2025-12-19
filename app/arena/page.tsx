'use client';

import { useState, useEffect, Suspense, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchConsoleList, fetchConsoleBySlug } from '../../lib/api';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { useSound } from '../../components/ui/SoundContext';
import { METRICS } from '../../lib/config/arena-metrics';
import { ComparisonRow } from '../../components/arena/ComparisonRow';
import { ConsoleSearch } from '../../components/arena/ConsoleSearch';

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
        const details = await fetchConsoleBySlug(slug);
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

    const handleVariantChange = (setter: Dispatch<SetStateAction<SelectionState>>, isPlayer1: boolean) => (e: ChangeEvent<HTMLSelectElement>) => {
        const slug = e.target.value;
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
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col min-h-screen">
            <h1 className="text-3xl md:text-5xl font-pixel text-center text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                VS MODE <span className="text-secondary">ARENA</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative">
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-black rounded-full items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    <span className="font-pixel text-xl italic text-white">VS</span>
                </div>

                {/* Player 1 Card */}
                <div className="border-2 border-secondary bg-secondary/5 relative min-h-[300px] -skew-x-10 overflow-hidden shadow-lg hover:shadow-secondary/20 transition-shadow">
                     <div className="skew-x-10 p-6 flex flex-col h-full">
                        <h2 className="font-pixel text-secondary mb-4">PLAYER 1</h2>
                        <ConsoleSearch 
                            consoles={allConsoles} 
                            onSelect={(slug) => handleSelect(setSelectionA, true)(slug)} 
                            themeColor="cyan"
                            currentSelection={selectionA.details?.name}
                        />
                        {selectionA.loading ? (
                             <div className="flex-1 flex items-center justify-center text-secondary font-mono animate-pulse">LOADING SPEC SHEET...</div>
                        ) : selectionA.details ? (
                             <div className="mt-6 flex-1 flex flex-col items-center animate-fadeIn">
                                 <div className="relative w-full h-32 mb-4">
                                     {(selectionA.selectedVariant?.image_url || selectionA.details.image_url) ? (
                                         <img src={selectionA.selectedVariant?.image_url || selectionA.details.image_url} alt={selectionA.details.name} className="w-full h-full object-contain drop-shadow-lg" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center text-secondary opacity-50 font-pixel">NO IMAGE</div>
                                     )}
                                 </div>
                                 <h3 className="font-pixel text-xl text-white text-center mb-1">{selectionA.details.name}</h3>
                                 <div className="font-mono text-xs text-secondary mb-4">{selectionA.details.manufacturer?.name}</div>
                                 {selectionA.details.variants && selectionA.details.variants.length > 1 && (
                                     <select 
                                        className="w-full bg-black border border-secondary text-secondary font-mono text-xs p-2 outline-none"
                                        value={selectionA.selectedVariant?.slug || ''}
                                        onChange={handleVariantChange(setSelectionA, true)}
                                     >
                                         {selectionA.details.variants.map(v => <option key={v.id} value={v.slug || ''}>{v.variant_name}</option>)}
                                     </select>
                                 )}
                             </div>
                        ) : (
                             <div className="flex-1 flex items-center justify-center text-gray-600 font-pixel text-xs opacity-50">SELECT FIGHTER</div>
                        )}
                     </div>
                </div>

                {/* Player 2 Card */}
                <div className="border-2 border-accent bg-accent/5 relative min-h-[300px] skew-x-10 overflow-hidden shadow-lg hover:shadow-accent/20 transition-shadow">
                     <div className="-skew-x-10 p-6 flex flex-col h-full">
                        <h2 className="font-pixel text-accent mb-4 text-right">PLAYER 2</h2>
                        <ConsoleSearch 
                            consoles={allConsoles} 
                            onSelect={(slug) => handleSelect(setSelectionB, false)(slug)} 
                            themeColor="pink"
                            currentSelection={selectionB.details?.name}
                        />
                        {selectionB.loading ? (
                             <div className="flex-1 flex items-center justify-center text-accent font-mono animate-pulse">LOADING SPEC SHEET...</div>
                        ) : selectionB.details ? (
                             <div className="mt-6 flex-1 flex flex-col items-center animate-fadeIn">
                                 <div className="relative w-full h-32 mb-4">
                                     {(selectionB.selectedVariant?.image_url || selectionB.details.image_url) ? (
                                         <img src={selectionB.selectedVariant?.image_url || selectionB.details.image_url} alt={selectionB.details.name} className="w-full h-full object-contain drop-shadow-lg" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center text-accent opacity-50 font-pixel">NO IMAGE</div>
                                     )}
                                 </div>
                                 <h3 className="font-pixel text-xl text-white text-center mb-1">{selectionB.details.name}</h3>
                                 <div className="font-mono text-xs text-accent mb-4">{selectionB.details.manufacturer?.name}</div>
                                 {selectionB.details.variants && selectionB.details.variants.length > 1 && (
                                     <select 
                                        className="w-full bg-black border border-accent text-accent font-mono text-xs p-2 outline-none"
                                        value={selectionB.selectedVariant?.slug || ''}
                                        onChange={handleVariantChange(setSelectionB, false)}
                                     >
                                         {selectionB.details.variants.map(v => <option key={v.id} value={v.slug || ''}>{v.variant_name}</option>)}
                                     </select>
                                 )}
                             </div>
                        ) : (
                             <div className="flex-1 flex items-center justify-center text-gray-600 font-pixel text-xs opacity-50">SELECT FIGHTER</div>
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
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-secondary font-mono">LOADING ARENA...</div>}>
            <VSModeContent />
        </Suspense>
    );
}
