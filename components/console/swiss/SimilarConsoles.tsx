'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails } from '../../../lib/types';
import { fetchVaultConsoles } from '../../../app/actions';

interface SimilarConsolesProps {
    currentConsole: ConsoleDetails;
}

export default function SimilarConsoles({ currentConsole }: SimilarConsolesProps) {
    const [similarConsoles, setSimilarConsoles] = useState<ConsoleDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadSimilar() {
            try {
                // Fetch all published consoles
                const allConsoles = await fetchVaultConsoles();

                // 1. Filter out the current console
                const otherConsoles = allConsoles.filter(c => c.id !== currentConsole.id);

                // 2. Determine current console's base traits
                const currentFormFactor = currentConsole.form_factor;

                // Get base variant price or default to 0
                let currentPrice = 0;
                if (currentConsole.variants && currentConsole.variants.length > 0) {
                    const defaultVar = currentConsole.variants.find(v => v.is_default) || currentConsole.variants[0];
                    currentPrice = defaultVar?.price_launch_usd || 0;
                } else {
                    currentPrice = currentConsole.specs?.price_launch_usd || 0;
                }

                // 3. Score the remaining consoles
                const scoredConsoles = otherConsoles.map(c => {
                    let score = 0;

                    let price = 0;
                    if (c.variants && c.variants.length > 0) {
                        const defaultVar = c.variants.find(v => v.is_default) || c.variants[0];
                        price = defaultVar?.price_launch_usd || 0;
                    } else {
                        price = c.specs?.price_launch_usd || 0;
                    }

                    const formFactor = c.form_factor;

                    // Form Factor match (High weight)
                    if (formFactor === currentFormFactor) {
                        score += 50;
                    }

                    // Price proximity match (within $50)
                    if (currentPrice > 0 && price > 0) {
                        const priceDiff = Math.abs(currentPrice - price);
                        if (priceDiff <= 50) {
                            // Up to 50 points based on how close the price is
                            score += Math.max(0, 50 - priceDiff);
                        } else if (priceDiff <= 100) {
                            score += 20; // Some points if within $100
                        }
                    }

                    // Category/Manufacturer match (Bonus)
                    if (c.manufacturer?.id === currentConsole.manufacturer?.id) {
                        score += 10;
                    }

                    return { ...c, _similarityScore: score, _displayPrice: price };
                });

                // 4. Sort by score (descending) and take top 3
                // Also require at least some similarity score to show up
                const topPicks = scoredConsoles
                    .filter(c => c._similarityScore > 0)
                    .sort((a, b) => b._similarityScore - a._similarityScore)
                    .slice(0, 4);  // four fits the 4-up grid; three left a gap

                setSimilarConsoles(topPicks);
            } catch (err) {
                console.error("Failed to load similar consoles", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadSimilar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentConsole.id]); // Omit price obj from deps

    if (isLoading) {
        return (
            <div className="w-full h-48 flex items-center justify-center border border-white/10 bg-white/[0.02]">
                <div className="font-mono text-zinc-500 text-sm animate-pulse">ANALYZING DATABASE FOR MATCHES...</div>
            </div>
        );
    }

    if (similarConsoles.length === 0) {
        return null; // Don't show the section if no similar consoles are found
    }


    return (
        /* Small, dense cards. These were 192px-tall image wells with 24px padding and two
         * full-width buttons each, so three of them ran longer than the specification
         * section they follow. An alternative is a glance, not a landing page: the whole
         * card is the link, and the comparison is a hairline row underneath. */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--rc-hair)] border border-white/10">
            {similarConsoles.map(consoleItem => {
                const displayPrice = (consoleItem as any)._displayPrice;

                let imageUrl = consoleItem.image_url;
                if (!imageUrl && consoleItem.variants && consoleItem.variants.length > 0) {
                    const defaultVar = consoleItem.variants.find(v => v.is_default) || consoleItem.variants[0];
                    imageUrl = defaultVar?.image_url;
                }

                return (
                    <div key={consoleItem.id} className="rc-cell group">
                        <Link href={`/consoles/${consoleItem.slug}`} className="block p-3 hover:bg-white/[0.03] transition-colors">
                            <div className="rc-bed relative h-[74px] flex items-center justify-center border border-white/[0.07] mb-2.5">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl.startsWith('http') ? imageUrl : `/${imageUrl.replace(/^\//, '')}`}
                                        alt={consoleItem.name}
                                        fill
                                        sizes="140px"
                                        className="object-contain p-2 opacity-85 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <span className="font-pixel text-lg text-zinc-800">?</span>
                                )}
                            </div>

                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-600 truncate">
                                {consoleItem.manufacturer?.name || 'Unknown'}
                            </div>
                            <div className="font-mono text-[12.5px] text-white truncate mt-0.5 group-hover:text-violet-300 transition-colors">
                                {consoleItem.name}
                            </div>
                            <div className="flex items-baseline justify-between gap-2 mt-2">
                                <span className="font-mono text-[13px] font-bold text-emerald-400 tabular-nums">
                                    {displayPrice > 0 ? `$${displayPrice}` : <span className="text-gray-700">&mdash;</span>}
                                </span>
                                {consoleItem.form_factor && (
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-gray-600 truncate">
                                        {consoleItem.form_factor}
                                    </span>
                                )}
                            </div>
                        </Link>

                        <Link
                            href={`/arena/${currentConsole.slug}-vs-${consoleItem.slug}`}
                            className="block border-t border-white/[0.07] px-3 py-2 font-mono text-[9px] uppercase
                                       tracking-widest text-gray-600 hover:bg-white hover:text-black transition-colors"
                        >
                            Compare &rarr;
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
