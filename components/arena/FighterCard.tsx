'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { ConsoleSearch } from './ConsoleSearch';
import { VariantSelector } from './VariantSelector';

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

interface FighterCardProps {
    side: 'A' | 'B';
    selection: SelectionState;
    consoles: { name: string; slug: string }[];
    onSelect: (slug: string) => void;
    onVariantChange: (slug: string) => void;
    onClear: () => void;
    locked: boolean;
}

/* One side of the match.
 *
 * This was two near-identical ninety-line blocks inside ArenaComparisonClient, differing
 * only in colour and which state they read. Anything fixed in one had to be fixed twice,
 * and a couple of things had only been fixed once.
 *
 * The device image is deliberately smaller than the h-64 it used to be: on this page the
 * comparison is the content, and two large product shots pushed the first spec row below
 * the fold on every phone.
 */
export function FighterCard({
    side,
    selection,
    consoles,
    onSelect,
    onVariantChange,
    onClear,
    locked,
}: FighterCardProps) {
    const isA = side === 'A';
    const label = isA ? 'Player 1' : 'Player 2';
    const inputId = isA ? 'arena-fighter-1' : 'arena-fighter-2';
    const accent = isA ? 'text-blue-400' : 'text-red-400';
    const border = isA ? 'border-blue-500/40' : 'border-red-500/40';
    const theme = isA ? 'blue' : 'red';
    const image = selection.selectedVariant?.image_url || selection.details?.image_url;

    return (
        <div className={`flex min-w-0 flex-col border ${selection.details ? border : 'border-border-subtle'} bg-bg-secondary/30 p-5 md:p-6`}>
            <div className={`mb-4 flex items-baseline justify-between gap-3 border-b ${selection.details ? border : 'border-border-subtle'} pb-3`}>
                <span className={`font-mono text-xs font-bold uppercase tracking-widest ${accent}`}>
                    {label}
                </span>
                {selection.details && !locked && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="touch-manipulation font-mono text-[11px] uppercase tracking-widest text-text-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                    >
                        Change
                    </button>
                )}
            </div>

            {!selection.details && !selection.loading && (
                <div className="flex flex-col gap-2">
                    <label htmlFor={inputId} className={`font-mono text-[11px] uppercase tracking-widest ${accent}`}>
                        Pick a device
                    </label>
                    <ConsoleSearch
                        consoles={consoles}
                        onSelect={onSelect}
                        id={inputId}
                        placeholder={`Search ${consoles.length || ''} devices…`}
                        themeColor={theme}
                        textColor="white"
                        highlightSelection
                    />
                </div>
            )}

            {selection.loading && (
                <p role="status" className="py-8 text-center font-mono text-sm text-text-secondary">
                    Loading…
                </p>
            )}

            {selection.details && !selection.loading && (
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <Link
                        href={`/consoles/${selection.details.slug}`}
                        className="group flex min-w-0 items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                    >
                        <div className="relative h-20 w-20 shrink-0 border border-border-subtle bg-bg-primary md:h-28 md:w-28">
                            {image ? (
                                <Image
                                    src={image}
                                    alt={selection.details.name}
                                    fill
                                    sizes="(max-width: 768px) 80px, 112px"
                                    className="object-contain p-2"
                                />
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-text-muted">
                                    No image
                                </span>
                            )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                                {selection.details.manufacturer?.name}
                            </span>
                            <span className="truncate font-mono text-lg font-bold tracking-tight text-white transition-colors group-hover:text-violet-300 md:text-2xl">
                                {selection.details.name}
                            </span>
                        </div>
                    </Link>

                    <VariantSelector
                        variants={selection.details.variants || []}
                        selectedSlug={selection.selectedVariant?.slug || ''}
                        onSelect={onVariantChange}
                        themeColor={theme}
                    />
                </div>
            )}

            {!selection.details && !selection.loading && (
                <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-text-muted">
                    Nothing picked yet
                </p>
            )}
        </div>
    );
}
