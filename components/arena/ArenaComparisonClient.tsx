'use client';

import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchConsoleList, fetchConsoleBySlug } from '../../app/actions';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { METRICS } from '../../lib/config/arena-metrics';
import { ComparisonRow } from '../../components/arena/ComparisonRow';
import { ConsoleSearch } from '../../components/arena/ConsoleSearch';
import { VariantSelector } from '../../components/arena/VariantSelector';
import { GlanceComparison } from '../../components/arena/GlanceComparison';
import RetroStatusBar from '../../components/ui/RetroStatusBar';

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

// Helper to construct URL
const constructArenaUrl = (p1?: string | null, v1?: string | null, p2?: string | null, v2?: string | null) => {
    const params = new URLSearchParams();
    if (p1) params.set('p1', p1);
    if (v1) params.set('v1', v1);
    if (p2) params.set('p2', p2);
    if (v2) params.set('v2', v2);
    return `/arena?${params.toString()}`;
};

type ArenaComparisonClientProps = {
    initialConsoleList?: { name: string, slug: string }[];
    initialSelectionA?: SelectionState;
    initialSelectionB?: SelectionState;
    version: string;
};

export default function ArenaComparisonClient({
    initialConsoleList = [],
    initialSelectionA,
    initialSelectionB,
    version
}: ArenaComparisonClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [allConsoles, setAllConsoles] = useState<{ name: string, slug: string }[]>(initialConsoleList);

    // Initialize state
    const [selectionA, setSelectionA] = useState<SelectionState>(initialSelectionA || { slug: null, details: null, selectedVariant: null, loading: false });
    const [selectionB, setSelectionB] = useState<SelectionState>(initialSelectionB || { slug: null, details: null, selectedVariant: null, loading: false });

    const [showDiffOnly, setShowDiffOnly] = useState(false);
    const [isArenaMode, setIsArenaMode] = useState(
        (!!initialSelectionA?.details && !!initialSelectionB?.details) ||
        (!!searchParams?.get('p1') && !!searchParams?.get('p2'))
    );

    useEffect(() => {
        if (allConsoles.length === 0) {
            fetchConsoleList().then((list) => setAllConsoles(list));
        }
    }, [allConsoles.length]);

    useEffect(() => {
        const p1 = searchParams?.get('p1');
        const v1 = searchParams?.get('v1');
        const p2 = searchParams?.get('p2');
        const v2 = searchParams?.get('v2');

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

        if (p1 && p2) {
            setIsArenaMode(true);
        }
    }, [searchParams, selectionA.slug, selectionA.details, selectionA.selectedVariant?.slug, selectionB.slug, selectionB.details, selectionB.selectedVariant?.slug]);

    const updateUrl = (p1?: string | null, v1?: string | null, p2?: string | null, v2?: string | null) => {
        const finalP1 = p1 !== undefined ? p1 : selectionA.slug;
        const finalV1 = v1 !== undefined ? v1 : selectionA.selectedVariant?.slug;
        const finalP2 = p2 !== undefined ? p2 : selectionB.slug;
        const finalV2 = v2 !== undefined ? v2 : selectionB.selectedVariant?.slug;

        const url = constructArenaUrl(finalP1, finalV1, finalP2, finalV2);
        router.replace(url, { scroll: false });
    };

    const handleSelect = (setter: Dispatch<SetStateAction<SelectionState>>, isPlayer1: boolean) => (slug: string) => {
        setter(prev => ({ ...prev, loading: true }));
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
        }
    };

    const handleNewMatch = () => {
        setIsArenaMode(false);
        setSelectionA({ slug: null, details: null, selectedVariant: null, loading: false });
        setSelectionB({ slug: null, details: null, selectedVariant: null, loading: false });
        router.replace('/arena', { scroll: false });
    };

    return (
        <div className="w-full bg-bg-primary min-h-screen">
            <div className="hidden md:block">
                <RetroStatusBar
                    rcPath="RC://RETRO_CIRCUIT/ARENA/VS"
                    docId="VS_PROTOCOL_V1"
                    archiveVersion={version}
                />
            </div>

            <div className="w-full max-w-7xl mx-auto p-4 flex flex-col min-h-screen">
                <h1 className="text-3xl md:text-5xl font-sans font-bold text-center text-text-primary mb-8 tracking-tighter">
                    VS MODE <span className="text-color-primary">ARENA</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8 relative z-30">
                    {/* VS Badge */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center">
                        <div className="hidden md:flex w-16 h-16 bg-bg-tertiary rounded-full items-center justify-center border-4 border-bg-primary shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <span className="font-mono text-xl italic text-text-primary">VS</span>
                        </div>
                    </div>

                    {/* Player 1 Card - Primary (Amber) */}
                    <div className="border border-color-primary/30 bg-color-primary/5 relative shadow-lg hover:shadow-color-primary/10 transition-shadow rounded-sm z-10">
                        <div className="p-4 md:p-8 flex flex-col h-full relative">
                            <h2 className="font-mono text-xs md:text-sm text-color-primary mb-4 text-left uppercase tracking-widest">[ PLAYER 1 ]</h2>
                            {!selectionA.details && (
                                <ConsoleSearch
                                    consoles={allConsoles}
                                    onSelect={(slug) => handleSelect(setSelectionA, true)(slug)}
                                    themeColor="primary"
                                />
                            )}
                            {selectionA.loading ? (
                                <div className="flex-1 flex items-center justify-center text-color-primary font-mono animate-pulse text-[10px] md:text-base mt-4">LOADING DATA...</div>
                            ) : selectionA.details ? (
                                <div className="mt-2 md:mt-6 flex-1 flex flex-col md:items-center animate-fade-in">
                                    <Link
                                        href={`/consoles/${selectionA.details.slug}`}
                                        className="flex flex-row md:flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4 group w-full"
                                    >
                                        <div className="relative w-16 h-16 md:w-full md:h-48 flex-shrink-0 bg-bg-card rounded-md flex items-center justify-center">
                                            {(selectionA.selectedVariant?.image_url || selectionA.details.image_url) ? (
                                                <img src={selectionA.selectedVariant?.image_url || selectionA.details.image_url} alt={selectionA.details.name} className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="text-color-primary opacity-50 font-mono text-[8px] md:text-xs">NO IMG</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                            <h3 className="font-bold text-lg md:text-2xl text-text-primary truncate group-hover:text-color-primary transition-colors">{selectionA.details.name}</h3>
                                            <div className="font-mono text-xs text-text-muted truncate">{selectionA.details.manufacturer?.name}</div>
                                        </div>
                                    </Link>

                                    <VariantSelector
                                        variants={selectionA.details.variants || []}
                                        selectedSlug={selectionA.selectedVariant?.slug || ''}
                                        onSelect={handleVariantChange(setSelectionA, true)}
                                        themeColor="primary"
                                    />

                                    {!isArenaMode && (
                                        <button
                                            onClick={() => handleChangeFighter(true)}
                                            className="mt-4 text-xs text-text-muted hover:text-color-primary underline font-mono"
                                        >
                                            [CHANGE DEVICE]
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-text-muted font-mono text-xs opacity-50 mt-4">SELECT DEVICE</div>
                            )}
                        </div>
                    </div>

                    {/* Player 2 Card - Secondary (Cyan) */}
                    <div className="border border-color-secondary/30 bg-color-secondary/5 relative shadow-lg hover:shadow-color-secondary/10 transition-shadow rounded-sm z-0">
                        <div className="p-4 md:p-8 flex flex-col h-full relative">
                            <h2 className="font-mono text-xs md:text-sm text-color-secondary mb-4 text-left md:text-right uppercase tracking-widest">[ PLAYER 2 ]</h2>
                            {!selectionB.details && (
                                <ConsoleSearch
                                    consoles={allConsoles}
                                    onSelect={(slug) => handleSelect(setSelectionB, false)(slug)}
                                    themeColor="secondary"
                                />
                            )}
                            {selectionB.loading ? (
                                <div className="flex-1 flex items-center justify-center text-color-secondary font-mono animate-pulse text-[10px] md:text-base mt-4">LOADING DATA...</div>
                            ) : selectionB.details ? (
                                <div className="mt-2 md:mt-6 flex-1 flex flex-col md:items-center animate-fade-in">
                                    <Link
                                        href={`/consoles/${selectionB.details.slug}`}
                                        className="flex flex-row md:flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4 group w-full"
                                    >
                                        <div className="relative w-16 h-16 md:w-full md:h-48 flex-shrink-0 bg-bg-card rounded-md flex items-center justify-center">
                                            {(selectionB.selectedVariant?.image_url || selectionB.details.image_url) ? (
                                                <img src={selectionB.selectedVariant?.image_url || selectionB.details.image_url} alt={selectionB.details.name} className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="text-color-secondary opacity-50 font-mono text-[8px] md:text-xs">NO IMG</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left md:text-center min-w-0 overflow-hidden w-full">
                                            <h3 className="font-bold text-lg md:text-2xl text-text-primary truncate group-hover:text-color-secondary transition-colors">{selectionB.details.name}</h3>
                                            <div className="font-mono text-xs text-text-muted truncate">{selectionB.details.manufacturer?.name}</div>
                                        </div>
                                    </Link>

                                    <VariantSelector
                                        variants={selectionB.details.variants || []}
                                        selectedSlug={selectionB.selectedVariant?.slug || ''}
                                        onSelect={handleVariantChange(setSelectionB, false)}
                                        themeColor="secondary"
                                    />

                                    {!isArenaMode && (
                                        <button
                                            onClick={() => handleChangeFighter(false)}
                                            className="mt-4 text-xs text-text-muted hover:text-color-secondary underline font-mono"
                                        >
                                            [CHANGE DEVICE]
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-text-muted font-mono text-xs opacity-50 mt-4">SELECT DEVICE</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FIGHT / NEW MATCH CONTROL BAR */}
                <div className="w-full flex flex-col items-center justify-center mb-8 relative z-20">
                    {!isArenaMode ? (
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={handleFight}
                                disabled={!selectionA.details || !selectionB.details}
                                className={`
                                font-bold font-mono text-sm md:text-base px-12 py-4 border transition-all duration-300 rounded-sm uppercase tracking-widest
                                ${selectionA.details && selectionB.details
                                        ? 'bg-color-primary text-black border-color-primary hover:bg-white hover:text-black cursor-pointer shadow-[0_0_20px_rgba(255,153,0,0.3)] hover:shadow-[0_0_40px_rgba(255,153,0,0.5)]'
                                        : 'bg-bg-tertiary border-border-normal text-text-muted cursor-not-allowed opacity-50'}
                            `}
                            >
                                INITIATE ANALYSIS
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleNewMatch}
                            className="font-mono text-sm md:text-base px-6 py-3 border border-border-normal text-text-secondary hover:text-text-primary hover:border-text-primary transition-all bg-bg-card uppercase tracking-widest"
                        >
                            [ NEW MATCH ]
                        </button>
                    )}
                </div>

                {selectionA.selectedVariant && selectionB.selectedVariant && isArenaMode && (
                    <div className="bg-bg-tertiary border border-border-normal p-6 mb-12 animate-fade-in shadow-2xl rounded-sm">

                        {/* GLANCE COMPARISON ADDED HERE */}
                        <div className="mb-8">
                            <GlanceComparison
                                variantA={selectionA.selectedVariant}
                                variantB={selectionB.selectedVariant}
                            />
                        </div>

                        <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4">
                            <h3 className="font-bold text-lg text-text-primary uppercase tracking-wider">TECHNICAL SPECIFICATIONS</h3>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={showDiffOnly}
                                    onChange={() => setShowDiffOnly(!showDiffOnly)}
                                    className="accent-color-primary w-4 h-4 bg-bg-card border-border-normal"
                                />
                                <span className="font-mono text-xs text-text-muted group-hover:text-text-primary transition-colors uppercase">Show Differences Only</span>
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
