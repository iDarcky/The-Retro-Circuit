'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails } from '../../../lib/types';
import { fetchVaultConsoles } from '../../../app/actions';
import SwissButton from './SwissButton';

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
                    .slice(0, 3);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarConsoles.map(consoleItem => {
                const displayPrice = (consoleItem as any)._displayPrice;

                // Construct proper image URL logic
                let imageUrl = consoleItem.image_url;
                if (!imageUrl && consoleItem.variants && consoleItem.variants.length > 0) {
                    const defaultVar = consoleItem.variants.find(v => v.is_default) || consoleItem.variants[0];
                    imageUrl = defaultVar?.image_url;
                }

                return (
                    <div key={consoleItem.id} className="border border-white/10 bg-white/[0.02] p-6 flex flex-col relative group hover:border-white/30 transition-colors">
                        <div className="absolute top-0 right-0 bg-white/10 text-zinc-300 font-mono text-[10px] px-3 py-1 uppercase tracking-wider">
                            SIMILAR MATCH
                        </div>

                        <div className="h-48 bg-black/20 flex items-center justify-center mb-6 p-4 border border-white/5 relative">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl.startsWith('http') ? imageUrl : `/${imageUrl.replace(/^\//, '')}`}
                                    alt={consoleItem.name}
                                    fill
                                    className="object-contain drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity p-4"
                                />
                            ) : (
                                <span className="font-pixel text-4xl text-zinc-800">?</span>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                                {consoleItem.manufacturer?.name || 'UNKNOWN'}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-4 leading-tight">
                                {consoleItem.name}
                            </h4>

                            <div className="grid grid-cols-2 gap-2 mb-6 font-mono text-[10px] text-zinc-500">
                                <div className="bg-white/[0.02] p-2 text-center border border-white/5">
                                    <span className="block text-white mb-0.5">{displayPrice > 0 ? `$${displayPrice}` : 'N/A'}</span>
                                    PRICE
                                </div>
                                <div className="bg-white/[0.02] p-2 text-center border border-white/5">
                                    <span className="block text-white mb-0.5">{consoleItem.form_factor?.toUpperCase() || 'N/A'}</span>
                                    FORM
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                                <Link href={`/consoles/${consoleItem.slug}`} className="w-full">
                                    <SwissButton variant="orange" className="w-full text-xs">
                                        VIEW DETAILS
                                    </SwissButton>
                                </Link>

                                {/* COMPARE BUTTON */}
                                <Link href={`/arena/${currentConsole.slug}-vs-${consoleItem.slug}`} className="w-full">
                                    <button className="w-full py-3 border border-white/20 text-zinc-400 text-xs font-mono uppercase hover:bg-white hover:text-black hover:border-white transition-all">
                                        COMPARE VS {currentConsole.name.toUpperCase()}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
