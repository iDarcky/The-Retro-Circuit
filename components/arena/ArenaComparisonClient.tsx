'use client';

import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { fetchConsoleList, fetchConsoleBySlug } from '../../app/actions';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { buildArenaPath, buildArenaToken } from '../../lib/arena/resolve';
import { GlanceComparison } from './GlanceComparison';
import { SpecTable } from './SpecTable';
import { FighterCard } from './FighterCard';
import { ArenaStickyHeader } from './ArenaStickyHeader';
import { ArenaRivals } from './ArenaRivals';
import ArenaBuyBar from './ArenaBuyBar';

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

const EMPTY: SelectionState = { slug: null, details: null, selectedVariant: null, loading: false };

export default function ArenaComparisonClient({
    initialConsoleList = [],
    initialSelectionA,
    initialSelectionB,
}: ArenaComparisonClientProps) {
    const router = useRouter();
    const matchSummaryRef = useRef<HTMLDivElement>(null);

    const [allConsoles, setAllConsoles] = useState<{ name: string, slug: string }[]>(initialConsoleList);
    const [selectionA, setSelectionA] = useState<SelectionState>(initialSelectionA || EMPTY);
    const [selectionB, setSelectionB] = useState<SelectionState>(initialSelectionB || EMPTY);
    const [isArenaMode, setIsArenaMode] = useState(!!initialSelectionA?.details && !!initialSelectionB?.details);

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
        loadSelection(slug, null, setter);
    };

    const handleVariantChange = (setter: Dispatch<SetStateAction<SelectionState>>, isPlayer1: boolean) => (slug: string) => {
        const selection = isPlayer1 ? selectionA : selectionB;
        const variant = selection.details?.variants?.find(v => v.slug === slug) || null;
        setter(prev => ({ ...prev, selectedVariant: variant }));
    };

    const handleChangeFighter = (isPlayer1: boolean) => {
        setIsArenaMode(false);
        (isPlayer1 ? setSelectionA : setSelectionB)(EMPTY);
    };

    /** The token for one side: the console alone, or console~variant off the default. */
    const tokenFor = (selection: SelectionState) => {
        const details = selection.details!;
        const defaultSlug = details.variants?.find(v => v.is_default)?.slug;
        const chosen = selection.selectedVariant?.slug;
        return buildArenaToken(details.slug, chosen && chosen !== defaultSlug ? chosen : null);
    };

    const handleCompare = () => {
        if (!selectionA.details || !selectionB.details) return;
        setIsArenaMode(true);

        /* buildArenaPath, not string concatenation.
         *
         * This used to join the console and variant slugs with a hyphen, which
         * lib/arena/resolve.ts documents as the ambiguous legacy form: `anbernic-rg-vita`
         * has a `pro` variant and `anbernic-rg-vita-pro` is also a real console, so the
         * console won and the configuration was unreachable. The canonical separator is
         * `~`, and buildArenaPath also sorts the two sides so one comparison has one URL,
         * matching the canonical the page declares.
         */
        const path = buildArenaPath(tokenFor(selectionA), tokenFor(selectionB));
        window.history.pushState(null, '', path);

        requestAnimationFrame(() => {
            matchSummaryRef.current?.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'start',
            });
        });
    };

    const handleNewMatch = () => {
        setIsArenaMode(false);
        setSelectionA(EMPTY);
        setSelectionB(EMPTY);
        router.replace('/arena', { scroll: false });
    };

    const ready = !!selectionA.details && !!selectionB.details;
    const nameA = selectionA.details ? `${selectionA.details.manufacturer?.name ?? ''} ${selectionA.details.name}`.trim() : '';
    const nameB = selectionB.details ? `${selectionB.details.manufacturer?.name ?? ''} ${selectionB.details.name}`.trim() : '';

    return (
        <div className="min-h-screen w-full bg-bg-primary pb-32 text-text-primary">

            {isArenaMode && (
                <ArenaStickyHeader
                    selectionA={selectionA}
                    selectionB={selectionB}
                    onReset={handleNewMatch}
                />
            )}

            <header className="border-b border-border-subtle px-6 py-10 md:px-12 md:py-12">
                <div className="mx-auto max-w-[1600px]">
                    <h1 className="text-balance font-pixel text-[7vw] uppercase leading-[1.35] tracking-tight text-white sm:text-[26px] lg:text-[32px]">
                        {isArenaMode && nameA && nameB ? (
                            <>
                                <span className="text-blue-400">{nameA}</span>
                                <span className="text-text-muted"> vs </span>
                                <span className="text-red-400">{nameB}</span>
                            </>
                        ) : (
                            <>Arena<span className="text-violet-500">_</span></>
                        )}
                    </h1>
                    <p className="mt-4 max-w-2xl text-text-secondary">
                        {isArenaMode
                            ? 'Every spec on record for both configurations, differences first.'
                            : 'Pick two devices and see every spec side by side, down to the SoC generation and the emulation grade per system.'}
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-[1600px] px-6 py-8 md:px-12">

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <FighterCard
                        side="A"
                        selection={selectionA}
                        consoles={allConsoles}
                        onSelect={handleSelect(setSelectionA)}
                        onVariantChange={handleVariantChange(setSelectionA, true)}
                        onClear={() => handleChangeFighter(true)}
                        locked={isArenaMode}
                    />
                    <FighterCard
                        side="B"
                        selection={selectionB}
                        consoles={allConsoles}
                        onSelect={handleSelect(setSelectionB)}
                        onVariantChange={handleVariantChange(setSelectionB, false)}
                        onClear={() => handleChangeFighter(false)}
                        locked={isArenaMode}
                    />
                </div>

                {!isArenaMode && (
                    <div className="mb-12 flex flex-col items-center gap-3">
                        <button
                            type="button"
                            onClick={handleCompare}
                            disabled={!ready}
                            aria-describedby={ready ? undefined : 'arena-compare-hint'}
                            className="w-full touch-manipulation border border-white bg-white px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:border-border-normal disabled:bg-transparent disabled:text-text-muted md:w-auto md:px-16"
                        >
                            {ready ? 'Compare' : 'Pick two devices'}
                        </button>
                        {!ready && (
                            <p id="arena-compare-hint" className="sr-only">
                                Choose a device for Player 1 and Player 2 to enable the comparison.
                            </p>
                        )}
                    </div>
                )}

                {selectionA.selectedVariant && selectionB.selectedVariant && isArenaMode && (
                    <div ref={matchSummaryRef} className="w-full scroll-mt-32">
                        <GlanceComparison
                            variantA={selectionA.selectedVariant}
                            variantB={selectionB.selectedVariant}
                        />

                        <SpecTable
                            variantA={selectionA.selectedVariant}
                            variantB={selectionB.selectedVariant}
                            nameA={nameA}
                            nameB={nameB}
                        />

                        <div className="mt-12">
                            <ArenaBuyBar
                                a={{ details: selectionA.details, variant: selectionA.selectedVariant }}
                                b={{ details: selectionB.details, variant: selectionB.selectedVariant }}
                            />
                        </div>

                        <ArenaRivals
                            currentA={selectionA.details?.slug}
                            currentB={selectionB.details?.slug}
                            allConsoles={allConsoles}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
