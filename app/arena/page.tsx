'use client';

import { useState, useEffect, Suspense, useRef, type Dispatch, type SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchConsoleList, fetchConsoleBySlug } from '../../app/actions';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { METRICS } from '../../lib/config/arena-metrics';
import { ComparisonRow } from '../../components/arena/ComparisonRow';
import { ConsoleSearch } from '../../components/arena/ConsoleSearch';
import { VariantSelector } from '../../components/arena/VariantSelector';
import { GlanceComparison } from '../../components/arena/GlanceComparison';
import { ArenaStickyHeader } from '../../components/arena/ArenaStickyHeader';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

function VSModeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const matchSummaryRef = useRef<HTMLDivElement>(null);

    const [allConsoles, setAllConsoles] = useState<{ name: string, slug: string }[]>([]);

    const [selectionA, setSelectionA] = useState<SelectionState>({ slug: null, details: null, selectedVariant: null, loading: false });
    const [selectionB, setSelectionB] = useState<SelectionState>({ slug: null, details: null, selectedVariant: null, loading: false });

    const [showDiffOnly, setShowDiffOnly] = useState(false);
    const [isArenaMode, setIsArenaMode] = useState(false);
    const [isSpecsOpen, setIsSpecsOpen] = useState(false); // Accordion State

    useEffect(() => {
        fetchConsoleList().then((list) => setAllConsoles(list));

        // Auto-enter arena mode if both players are present in URL on mount
        const p1 = searchParams?.get('p1');
        const p2 = searchParams?.get('p2');
        if (p1 && p2) {
            setIsArenaMode(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Selecting a new fighter resets Arena Mode
        setIsArenaMode(false);
        if (isPlayer1) {
            updateUrl(slug, null, undefined, undefined);
        } else {
            updateUrl(undefined, undefined, slug, null);
        }
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

    const handleChangeFighter = (isPlayer1: boolean) => {
        setIsArenaMode(false);
        if (isPlayer1) {
            setSelectionA({ slug: null, details: null, selectedVariant: null, loading: false });
            updateUrl(null, null, undefined, undefined);
        } else {
            setSelectionB({ slug: null, details: null, selectedVariant: null, loading: false });
            updateUrl(undefined, undefined, null, null);
        }
    };

    const handleFight = () => {
        if (selectionA.selectedVariant && selectionB.selectedVariant) {
            setIsArenaMode(true);
            // Smooth scroll to match readout on fight
            setTimeout(() => {
                matchSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const handleNewMatch = () => {
        setIsArenaMode(false);
        setSelectionA({ slug: null, details: null, selectedVariant: null, loading: false });
        setSelectionB({ slug: null, details: null, selectedVariant: null, loading: false });
        router.replace('?', { scroll: false });
    };

    return (
        <div className="w-full relative min-h-screen">

            {/* Sticky Header */}
            {isArenaMode && (
                <ArenaStickyHeader
                    selectionA={selectionA}
                    selectionB={selectionB}
                    onReset={handleNewMatch}
                />
            )}

            <div className="w-full max-w-7xl mx-auto p-4 flex flex-col min-h-screen">
                <h1 className="text-3xl md:text-5xl font-pixel text-center text-white mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    VS MODE <span className="text-white/50">ARENA</span>
                </h1>

                {/* HERO / SELECTION AREA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 mb-12 relative z-30">
                    {/* VS Badge - Centered */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center">
                        <div className="hidden md:flex w-20 h-20 bg-black items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-sm">
                            <span className="font-pixel text-2xl italic text-white drop-shadow-md">VS</span>
                        </div>
                    </div>

                    {/* Player 1 Card - Cyan */}
                    <div className={`
                        border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent relative transition-all z-10
                        ${isArenaMode ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]' : 'hover:border-cyan-500/30'}
                    `}>
                        <div className="p-6 md:p-10 flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="font-pixel text-[10px] md:text-sm text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">[ PLAYER 1 ]</h2>
                                {isArenaMode && selectionA.details && (
                                     <span className="font-mono text-xs text-cyan-400/50 animate-pulse">READY</span>
                                )}
                            </div>

                            {!selectionA.details && (
                                <ConsoleSearch
                                    consoles={allConsoles}
                                    onSelect={(slug) => handleSelect(setSelectionA, true)(slug)}
                                    themeColor="cyan"
                                />
                            )}

                            {selectionA.loading ? (
                                <div className="flex-1 flex items-center justify-center text-cyan-400 font-mono animate-pulse text-[10px] md:text-base mt-4">LOADING...</div>
                            ) : selectionA.details ? (
                                <div className="mt-4 flex-1 flex flex-col md:items-center animate-fadeIn">
                                    <Link
                                        href={`/consoles/${selectionA.details.slug}`}
                                        className="flex flex-row md:flex-col items-center gap-6 mb-6 group w-full"
                                    >
                                        <div className="relative w-20 h-20 md:w-full md:h-56 flex-shrink-0 bg-black/40 md:bg-transparent border border-white/5 md:border-0 p-4 transition-transform group-hover:scale-105 duration-500">
                                            {(selectionA.selectedVariant?.image_url || selectionA.details.image_url) ? (
                                                <img src={selectionA.selectedVariant?.image_url || selectionA.details.image_url} alt={selectionA.details.name} className="w-full h-full object-contain drop-shadow-2xl" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-cyan-500 opacity-50 font-pixel text-[8px] md:text-xs">NO IMG</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                            <h3 className="font-pixel text-lg md:text-3xl text-white truncate group-hover:text-cyan-400 transition-colors drop-shadow-lg">{selectionA.details.name}</h3>
                                            <div className="font-mono text-xs md:text-sm text-cyan-400 truncate mt-1">{selectionA.details.manufacturer?.name}</div>
                                        </div>
                                    </Link>

                                    <VariantSelector
                                        variants={selectionA.details.variants || []}
                                        selectedSlug={selectionA.selectedVariant?.slug || ''}
                                        onSelect={handleVariantChange(setSelectionA, true)}
                                        themeColor="cyan"
                                    />

                                    {!isArenaMode && (
                                        <button
                                            onClick={() => handleChangeFighter(true)}
                                            className="mt-6 text-[10px] text-white/40 hover:text-cyan-400 hover:underline font-mono uppercase tracking-wider transition-colors"
                                        >
                                            [CHANGE FIGHTER]
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-white/10 font-pixel text-[8px] md:text-xs mt-4">SELECT FIGHTER</div>
                            )}
                        </div>
                    </div>

                    {/* Player 2 Card - Orange */}
                    <div className={`
                        border border-orange-500/20 bg-gradient-to-bl from-orange-500/5 to-transparent relative transition-all z-0
                        ${isArenaMode ? 'border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.15)]' : 'hover:border-orange-500/30'}
                    `}>
                        <div className="p-6 md:p-10 flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="font-pixel text-[10px] md:text-sm text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)] text-left md:text-right w-full">[ PLAYER 2 ]</h2>
                                {isArenaMode && selectionB.details && (
                                     <span className="font-mono text-xs text-orange-400/50 order-first md:order-last animate-pulse">READY</span>
                                )}
                            </div>

                            {!selectionB.details && (
                                <ConsoleSearch
                                    consoles={allConsoles}
                                    onSelect={(slug) => handleSelect(setSelectionB, false)(slug)}
                                    themeColor="orange"
                                />
                            )}
                            {selectionB.loading ? (
                                <div className="flex-1 flex items-center justify-center text-orange-400 font-mono animate-pulse text-[10px] md:text-base mt-4">LOADING...</div>
                            ) : selectionB.details ? (
                                <div className="mt-4 flex-1 flex flex-col md:items-center animate-fadeIn">
                                    <Link
                                        href={`/consoles/${selectionB.details.slug}`}
                                        className="flex flex-row md:flex-col items-center gap-6 mb-6 group w-full"
                                    >
                                        <div className="relative w-20 h-20 md:w-full md:h-56 flex-shrink-0 bg-black/40 md:bg-transparent border border-white/5 md:border-0 p-4 transition-transform group-hover:scale-105 duration-500">
                                            {(selectionB.selectedVariant?.image_url || selectionB.details.image_url) ? (
                                                <img src={selectionB.selectedVariant?.image_url || selectionB.details.image_url} alt={selectionB.details.name} className="w-full h-full object-contain drop-shadow-2xl" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-orange-500 opacity-50 font-pixel text-[8px] md:text-xs">NO IMG</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                            <h3 className="font-pixel text-lg md:text-3xl text-white truncate group-hover:text-orange-400 transition-colors drop-shadow-lg">{selectionB.details.name}</h3>
                                            <div className="font-mono text-xs md:text-sm text-orange-400 truncate mt-1">{selectionB.details.manufacturer?.name}</div>
                                        </div>
                                    </Link>

                                    <VariantSelector
                                        variants={selectionB.details.variants || []}
                                        selectedSlug={selectionB.selectedVariant?.slug || ''}
                                        onSelect={handleVariantChange(setSelectionB, false)}
                                        themeColor="orange"
                                    />

                                    {!isArenaMode && (
                                        <button
                                            onClick={() => handleChangeFighter(false)}
                                            className="mt-6 text-[10px] text-white/40 hover:text-orange-400 hover:underline font-mono uppercase tracking-wider transition-colors"
                                        >
                                            [CHANGE FIGHTER]
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-white/10 font-pixel text-[8px] md:text-xs mt-4">SELECT FIGHTER</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FIGHT / NEW MATCH CONTROL BAR */}
                <div className="w-full flex flex-col items-center justify-center mb-16 relative z-20">
                    {!isArenaMode ? (
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={handleFight}
                                disabled={!selectionA.details || !selectionB.details}
                                className={`
                                font-pixel text-xl md:text-3xl px-16 py-6 border-2 transition-all duration-300 uppercase tracking-widest
                                ${selectionA.details && selectionB.details
                                        ? 'bg-white text-black border-white hover:bg-black hover:text-white cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105'
                                        : 'bg-black border-white/10 text-white/10 cursor-not-allowed'}
                            `}
                            >
                                [ F I G H T ]
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleNewMatch}
                            className="font-mono text-xs md:text-sm px-8 py-3 border border-white/20 text-white/50 hover:text-white hover:border-white transition-all bg-black/50 uppercase tracking-widest hover:bg-white/5"
                        >
                            Start New Match
                        </button>
                    )}
                </div>

                {selectionA.selectedVariant && selectionB.selectedVariant && isArenaMode && (
                    <>
                        <div ref={matchSummaryRef} className="scroll-mt-32 w-full max-w-6xl mx-auto">
                            {/* GLANCE COMPARISON (TALE OF THE TAPE) */}
                            <GlanceComparison
                                variantA={selectionA.selectedVariant}
                                variantB={selectionB.selectedVariant}
                            />

                            {/* TECHNICAL SPECS ACCORDION */}
                            <div className="border-t border-b border-white/10 mt-12">
                                <button
                                    onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                                    className="w-full py-6 flex items-center justify-center gap-3 group hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-pixel text-sm md:text-base text-white/60 group-hover:text-white uppercase tracking-widest transition-colors">
                                        {isSpecsOpen ? 'HIDE TECHNICAL SPECIFICATIONS' : 'VIEW FULL TECHNICAL SPECIFICATIONS'}
                                    </span>
                                    {isSpecsOpen ? (
                                        <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white" />
                                    )}
                                </button>

                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSpecsOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="bg-black/40 p-4 md:p-8 pt-0">
                                        <div className="flex justify-end items-center mb-6 pt-4 border-b border-white/5 pb-2">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={showDiffOnly}
                                                    onChange={() => setShowDiffOnly(!showDiffOnly)}
                                                    className="accent-white w-4 h-4 bg-transparent border-white/20"
                                                />
                                                <span className="font-mono text-[10px] text-white/40 uppercase group-hover:text-white transition-colors">Diff Only</span>
                                            </label>
                                        </div>
                                        <div className="space-y-0">
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
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/50 font-mono">LOADING ARENA...</div>}>
            <VSModeContent />
        </Suspense>
    );
}
