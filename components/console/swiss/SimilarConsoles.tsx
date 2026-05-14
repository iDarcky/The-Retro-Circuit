import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails } from '../../../lib/types';
import { fetchVaultConsoles } from '../../../app/actions/consoles';
import SwissButton from './SwissButton';

interface SimilarConsolesProps {
    currentConsole: ConsoleDetails;
}

function getDisplayPrice(c: ConsoleDetails): number {
    if (c.variants && c.variants.length > 0) {
        const defaultVar = c.variants.find(v => v.is_default) || c.variants[0];
        return defaultVar?.price_launch_usd || 0;
    }
    return c.specs?.price_launch_usd || 0;
}

function getDisplayImage(c: ConsoleDetails): string | null {
    if (c.image_url) return c.image_url;
    if (c.variants && c.variants.length > 0) {
        const defaultVar = c.variants.find(v => v.is_default) || c.variants[0];
        return defaultVar?.image_url || null;
    }
    return null;
}

export default async function SimilarConsoles({ currentConsole }: SimilarConsolesProps) {
    const allConsoles = await fetchVaultConsoles();
    const otherConsoles = allConsoles.filter(c => c.id !== currentConsole.id);

    const currentFormFactor = currentConsole.form_factor;
    const currentPrice = getDisplayPrice(currentConsole);

    const scoredConsoles = otherConsoles
        .map(c => {
            let score = 0;
            const price = getDisplayPrice(c);

            if (c.form_factor === currentFormFactor) score += 50;

            if (currentPrice > 0 && price > 0) {
                const priceDiff = Math.abs(currentPrice - price);
                if (priceDiff <= 50) score += Math.max(0, 50 - priceDiff);
                else if (priceDiff <= 100) score += 20;
            }

            if (c.manufacturer?.id === currentConsole.manufacturer?.id) score += 10;

            return { console: c, score, displayPrice: price };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (scoredConsoles.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scoredConsoles.map(({ console: consoleItem, displayPrice }) => {
                const rawImg = getDisplayImage(consoleItem);
                const imageUrl = rawImg
                    ? (rawImg.startsWith('http') ? rawImg : `/${rawImg.replace(/^\//, '')}`)
                    : null;

                return (
                    <div key={consoleItem.id} className="border border-white/10 bg-white/[0.02] p-6 flex flex-col relative group hover:border-white/30 transition-colors">
                        <div className="absolute top-0 right-0 bg-white/10 text-zinc-300 font-mono text-[10px] px-3 py-1 uppercase tracking-wider">
                            SIMILAR MATCH
                        </div>

                        <div className="h-48 bg-black/20 flex items-center justify-center mb-6 p-4 border border-white/5 relative">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
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
