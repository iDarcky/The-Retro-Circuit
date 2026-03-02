'use client';

import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchConsoleList, fetchConsoleBySlug } from '../../app/actions';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { METRICS } from '../../lib/config/arena-metrics';
import { ComparisonRow } from '../../components/arena/ComparisonRow';
import { ConsoleSearch } from '../../components/arena/ConsoleSearch';
import { VariantSelector } from '../../components/arena/VariantSelector';
import { GlanceComparison } from '../../components/arena/GlanceComparison';
import { ArenaStickyHeader } from '../../components/arena/ArenaStickyHeader';
import { ArenaRivals } from '../../components/arena/ArenaRivals';
import { ChevronDown, ChevronUp, Swords } from 'lucide-react';
import { SwissHeader } from '../../components/ui/SwissHeader';

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

type ArenaComparisonClientProps = {
    initialConsoleList?: { name: string, slug: string }[];
    initialSelectionA?: SelectionState;
    initialSelectionB?: SelectionState;
};

export default function ArenaComparisonClient({
    initialConsoleList = [],
    initialSelectionA,
    initialSelectionB,

}: ArenaComparisonClientProps) {
    const router = useRouter();

    const matchSummaryRef = useRef<HTMLDivElement>(null);

    const [allConsoles, setAllConsoles] = useState<{ name: string, slug: string }[]>(initialConsoleList);

    const [selectionA, setSelectionA] = useState<SelectionState>(initialSelectionA || { slug: null, details: null, selectedVariant: null, loading: false });
    const [selectionB, setSelectionB] = useState<SelectionState>(initialSelectionB || { slug: null, details: null, selectedVariant: null, loading: false });

    const [showDiffOnly, setShowDiffOnly] = useState(false);
    const [isArenaMode, setIsArenaMode] = useState(!!initialSelectionA?.details && !!initialSelectionB?.details);
    const [isSpecsOpen, setIsSpecsOpen] = useState(false);

    useEffect(() => {
        if (allConsoles.length === 0) {
            fetchConsoleList().then((list) => setAllConsoles(list));
        }
    }, [allConsoles.length]);

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

    const handleSelect = (setter: Dispatch<SetStateAction<SelectionState>>) => (slug: string) => {
        setIsArenaMode(false);
        // We only load it locally into state. URL stays /arena
        loadSelection(slug, null, setter);
    };

    const handleVariantChange = (setter: Dispatch<SetStateAction<SelectionState>>, isPlayer1: boolean) => (slug: string) => {
        const selection = isPlayer1 ? selectionA : selectionB;
        const variant = selection.details?.variants?.find(v => v.slug === slug) || null;
        setter(prev => ({ ...prev, selectedVariant: variant }));
    };

    const handleChangeFighter = (isPlayer1: boolean) => {
        setIsArenaMode(false);
        if (isPlayer1) {
            setSelectionA({ slug: null, details: null, selectedVariant: null, loading: false });
        } else {
            setSelectionB({ slug: null, details: null, selectedVariant: null, loading: false });
        }
    };

    const handleFight = () => {
        if (selectionA.selectedVariant && selectionB.selectedVariant && selectionA.details && selectionB.details) {
            setIsArenaMode(true);

            // Helper to get manufacturer slug
            const getMfgSlug = (details: ConsoleDetails) => {
                return details.manufacturer?.slug || details.manufacturer?.name.toLowerCase().replace(/\s+/g, '-') || 'unknown';
            };

            // Construct path
            // Format is /arena/[mfg]-[slugA][-variantA]-vs-[mfg]-[slugB][-variantB]
            const mfgA = getMfgSlug(selectionA.details);
            const part1 = selectionA.selectedVariant.slug !== selectionA.details.variants?.find(v => v.is_default)?.slug && selectionA.selectedVariant.slug
                ? `${mfgA}-${selectionA.details.slug}-${selectionA.selectedVariant.slug}`
                : `${mfgA}-${selectionA.details.slug}`;

            const mfgB = getMfgSlug(selectionB.details);
            const part2 = selectionB.selectedVariant.slug !== selectionB.details.variants?.find(v => v.is_default)?.slug && selectionB.selectedVariant.slug
                ? `${mfgB}-${selectionB.details.slug}-${selectionB.selectedVariant.slug}`
                : `${mfgB}-${selectionB.details.slug}`;

            // Use window.history.pushState to completely avoid Next.js hydration flicker
            window.history.pushState(null, '', `/arena/${part1}-vs-${part2}`);

            setTimeout(() => {
                matchSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const handleNewMatch = () => {
        setIsArenaMode(false);
        setSelectionA({ slug: null, details: null, selectedVariant: null, loading: false });
        setSelectionB({ slug: null, details: null, selectedVariant: null, loading: false });
        router.replace('/arena', { scroll: false });
    };

    return (
        <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-32">

            {isArenaMode && (
                <ArenaStickyHeader
                    selectionA={selectionA}
                    selectionB={selectionB}
                    onReset={handleNewMatch}
                />
            )}

            <SwissHeader
                title={
                    <>
                        Comparison <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">Arena</span><span className="text-red-500 animate-pulse">_</span>
                    </>
                }
                subtitle="Head-to-head hardware analysis. Compare technical specifications, dimensions, and performance metrics."
            />

            <div className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-4">
                <div className="max-w-[1800px] mx-auto flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <Swords size={14} className="text-blue-400" />
                        <span className={isArenaMode ? "text-white font-bold" : "text-zinc-500"}>
                            {isArenaMode ? "ACTIVE MATCH" : "SELECT FIGHTERS"}
                        </span>
                    </div>

                    {isArenaMode && (
                        <button
                            onClick={handleNewMatch}
                            className="flex items-center gap-2 text-[10px] font-mono uppercase bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition-colors text-zinc-400 hover:text-white"
                        >
                            Reset Match
                        </button>
                    )}
                </div>
            </div>

            <div className="px-6 md:px-12 py-8 max-w-[1800px] mx-auto min-h-[50vh]">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 mb-12 relative z-30">
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center">
                        <div className="hidden md:flex w-20 h-20 bg-black items-center justify-center border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.2)] backdrop-blur-sm rounded-full animate-pulse-slow">
                            <span className="font-pixel text-2xl italic text-white drop-shadow-md">VS</span>
                        </div>
                    </div>

                    {/* Player 1 Card - Blue */}
                    <div className={`
                        border-2 relative transition-all z-10 rounded-xl border-blue-600/30 bg-blue-900/20
                        ${isArenaMode ? 'border-blue-500 shadow-[0_0_60px_rgba(37,99,235,0.25)]' : 'hover:border-blue-500/50 hover:bg-blue-900/30'}
                    `}>
                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60 rounded-t-xl"></div>

                        <div className="p-6 md:p-10 flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-6 border-b border-blue-500/20 pb-4">
                                <h2 className="font-pixel text-[10px] md:text-sm text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">[ PLAYER 1 ]</h2>
                                {isArenaMode && selectionA.details && (
                                    <span className="font-mono text-xs text-blue-300 animate-pulse font-bold tracking-widest drop-shadow-[0_0_5px_rgba(96,165,250,1)]">READY</span>
                                )}
                            </div>

                            {!selectionA.details && (
                                <ConsoleSearch
                                    consoles={allConsoles}
                                    onSelect={(slug) => handleSelect(setSelectionA)(slug)}
                                    themeColor="blue"
                                />
                            )}

                            {selectionA.loading ? (
                                <div className="flex-1 flex items-center justify-center text-blue-400 font-mono animate-pulse text-[10px] md:text-base mt-4 drop-shadow-lg">LOADING DATA...</div>
                            ) : selectionA.details ? (
                                <div className="mt-4 flex-1 flex flex-col md:items-center animate-fadeIn">
                                    <Link
                                        href={`/consoles/${getMfgSlug(selectionA.details)}-${selectionA.details.slug}`}
                                        className="flex flex-row md:flex-col items-center gap-6 mb-6 group w-full"
                                    >
                                        <div className="relative w-24 h-24 md:w-full md:h-64 flex-shrink-0 bg-black/40 md:bg-transparent border border-blue-500/10 md:border-0 p-4 transition-transform group-hover:scale-105 duration-500 shadow-inner md:shadow-none rounded-lg md:rounded-none">
                                            {(selectionA.selectedVariant?.image_url || selectionA.details.image_url) ? (
                                                <img src={selectionA.selectedVariant?.image_url || selectionA.details.image_url} alt={selectionA.details.name} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-blue-500 opacity-50 font-pixel text-[8px] md:text-xs">NO IMG</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                            <h3 className="font-pixel text-lg md:text-4xl text-white truncate group-hover:text-blue-300 transition-colors drop-shadow-[0_0_10px_rgba(37,99,235,0.6)]">{selectionA.details.name}</h3>
                                            <div className="font-mono text-xs md:text-sm text-blue-400 truncate mt-2 font-bold tracking-wider">{selectionA.details.manufacturer?.name}</div>
                                        </div>
                                    </Link>

                                    <VariantSelector
                                        variants={selectionA.details.variants || []}
                                        selectedSlug={selectionA.selectedVariant?.slug || ''}
                                        onSelect={handleVariantChange(setSelectionA, true)}
                                        themeColor="blue"
                                    />

                                    {!isArenaMode && (
                                        <button
                                            onClick={() => handleChangeFighter(true)}
                                            className="mt-6 text-[10px] text-white/40 hover:text-blue-400 hover:underline font-mono uppercase tracking-wider transition-colors"
                                        >
                                            [CHANGE FIGHTER]
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-blue-500/30 font-pixel text-[8px] md:text-xs mt-4 animate-pulse">AWAITING CHALLENGER</div>
                            )}
                        </div>
                    </div>

                    {/* Player 2 Card - Red */}
                    <div className={`
                        border-2 relative transition-all z-0 rounded-xl border-red-600/30 bg-red-900/20
                        ${isArenaMode ? 'border-red-500 shadow-[0_0_60px_rgba(220,38,38,0.25)]' : 'hover:border-red-500/50 hover:bg-red-900/30'}
                    `}>
                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 rounded-t-xl"></div>

                        <div className="p-6 md:p-10 flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-6 border-b border-red-500/20 pb-4">
                                <h2 className="font-pixel text-[10px] md:text-sm text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] text-left md:text-right w-full">[ PLAYER 2 ]</h2>
                                {isArenaMode && selectionB.details && (
                                    <span className="font-mono text-xs text-red-300 animate-pulse font-bold tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,1)] order-first md:order-last">READY</span>
                                )}
                            </div>

                            {!selectionB.details && (
                                <ConsoleSearch
                                    consoles={allConsoles}
                                    onSelect={(slug) => handleSelect(setSelectionB)(slug)}
                                    themeColor="red"
                                />
                            )}
                            {selectionB.loading ? (
                                <div className="flex-1 flex items-center justify-center text-red-400 font-mono animate-pulse text-[10px] md:text-base mt-4 drop-shadow-lg">LOADING DATA...</div>
                            ) : selectionB.details ? (
                                <div className="mt-4 flex-1 flex flex-col md:items-center animate-fadeIn">
                                    <Link
                                        href={`/consoles/${getMfgSlug(selectionB.details)}-${selectionB.details.slug}`}
                                        className="flex flex-row md:flex-col items-center gap-6 mb-6 group w-full"
                                    >
                                        <div className="relative w-24 h-24 md:w-full md:h-64 flex-shrink-0 bg-black/40 md:bg-transparent border border-red-500/10 md:border-0 p-4 transition-transform group-hover:scale-105 duration-500 shadow-inner md:shadow-none rounded-lg md:rounded-none">
                                            {(selectionB.selectedVariant?.image_url || selectionB.details.image_url) ? (
                                                <img src={selectionB.selectedVariant?.image_url || selectionB.details.image_url} alt={selectionB.details.name} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-red-500 opacity-50 font-pixel text-[8px] md:text-xs">NO IMG</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                            <h3 className="font-pixel text-lg md:text-4xl text-white truncate group-hover:text-red-300 transition-colors drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]">{selectionB.details.name}</h3>
                                            <div className="font-mono text-xs md:text-sm text-red-400 truncate mt-2 font-bold tracking-wider">{selectionB.details.manufacturer?.name}</div>
                                        </div>
                                    </Link>

                                    <VariantSelector
                                        variants={selectionB.details.variants || []}
                                        selectedSlug={selectionB.selectedVariant?.slug || ''}
                                        onSelect={handleVariantChange(setSelectionB, false)}
                                        themeColor="red"
                                    />

                                    {!isArenaMode && (
                                        <button
                                            onClick={() => handleChangeFighter(false)}
                                            className="mt-6 text-[10px] text-white/40 hover:text-red-400 hover:underline font-mono uppercase tracking-wider transition-colors"
                                        >
                                            [CHANGE FIGHTER]
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-red-500/30 font-pixel text-[8px] md:text-xs mt-4 animate-pulse">AWAITING CHALLENGER</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center mb-16 relative z-20">
                    {!isArenaMode ? (
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={handleFight}
                                disabled={!selectionA.details || !selectionB.details}
                                className={`
                                font-pixel text-xl md:text-3xl px-16 py-6 border-2 transition-all duration-300 uppercase tracking-widest relative overflow-hidden group rounded-sm
                                ${selectionA.details && selectionB.details
                                        ? 'bg-white text-black border-white hover:bg-black hover:text-white cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95'
                                        : 'bg-black border-white/10 text-white/10 cursor-not-allowed'}
                            `}
                            >
                                <span className="relative z-10">[ F I G H T ]</span>
                                {selectionA.details && selectionB.details && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                                )}
                            </button>
                        </div>
                    ) : null}
                </div>

                {selectionA.selectedVariant && selectionB.selectedVariant && isArenaMode && (
                    <>
                        <div ref={matchSummaryRef} className="scroll-mt-32 w-full max-w-6xl mx-auto animate-fadeIn">
                            <GlanceComparison
                                variantA={selectionA.selectedVariant}
                                variantB={selectionB.selectedVariant}
                            />

                            <div className="border-t border-b border-white/10 mt-12 mb-12">
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

                            <ArenaRivals
                                currentA={selectionA.details?.slug}
                                currentB={selectionB.details?.slug}
                                allConsoles={allConsoles}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
