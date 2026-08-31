'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant, EmulationProfile } from '../../../lib/types';
import { pickBuyTarget } from '../../../lib/affiliate';
import { circuitScore, percentileOf, scorePerDollar } from '../../../lib/scoring/circuit-score';
import CircuitScoreCard, { PriceCard } from './CircuitScoreCard';
import type { CatalogueStats } from '../../../app/actions/scoring';
import { buildVerdict, buildTags } from '../../../lib/scoring/verdict';
import { MIN_POPULATION_FOR_RANK } from '../../../lib/scoring/circuit-score';

/* The console page is where the buy / no-buy call gets made, so the fold carries the
 * four things that decide it: the device, what it costs, what it can emulate, and the
 * two actions. Everything else moves below the tab bar.
 *
 * The old layout gave 60% of the fold to an image frame the device occupied a fifth of,
 * printed the specs as right-aligned annotations beside it, and buried the price in a
 * 2x2 metrics grid. */

export interface HeroShot { id: string; url: string; alt_text: string | null; kind: string | null }

interface Props {
    consoleData: ConsoleDetails;
    specs: Partial<ConsoleSpecs> & Partial<ConsoleVariant>;
    variant?: ConsoleVariant | null;
    profile?: EmulationProfile | null;
    shots: HeroShot[];
    heroIndex: number;
    onHeroIndex: (i: number) => void;
    isPixelFallback: boolean;
    compareUrl: string;
    onShare: () => void;
    shareCopied: boolean;
    catalogueStats?: CatalogueStats;
    /**
     * Rendered under the image, in the left column.
     *
     * The image box is short and the identity column is tall, so at anything under about
     * 1400px the fold was a small photo with a large empty rectangle beneath it. Prose is
     * the right thing to fill that with: it is the one block whose height can absorb
     * whatever the column has spare.
     */
    belowImage?: React.ReactNode;
}


const Chip: FC<{ children: React.ReactNode; tone?: 'violet' | 'cyan' | 'orange' | 'emerald' | 'plain' }> = ({ children, tone = 'plain' }) => {
    const tones = {
        violet: 'text-violet-400 border-violet-500/40',
        cyan: 'text-cyan-400 border-cyan-500/40',
        orange: 'text-orange-500 border-orange-500/50',
        emerald: 'text-emerald-400 border-emerald-500/40',
        plain: 'text-gray-400 border-white/15',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${tones[tone]}`}>
            {children}
        </span>
    );
};

const ConsoleHero: FC<Props> = ({
    consoleData, specs, variant, profile, shots, heroIndex, onHeroIndex,
    isPixelFallback, compareUrl, onShare, shareCopied, catalogueStats, belowImage,
}) => {
    const brand = consoleData.manufacturer?.name;
    const brandSlug = consoleData.manufacturer?.slug;
    const shot = shots[Math.min(heroIndex, Math.max(shots.length - 1, 0))];

    // Street price is the one to show; launch price is the reference it is measured against.
    const street = variant?.price_avg_usd ?? null;
    const launch = variant?.price_launch_usd ?? null;
    // Street price where it exists, launch price otherwise. The old "vs MSRP" delta is
    // gone: the price card now ranks against the tier, which is the more useful read and
    // does not need both columns populated — which no variant currently is.
    const price = street ?? launch;


    /* Circuit Score and its standing. Every rank is drawn from the same reach tier, and
     * suppressed entirely when that tier holds too few published devices to mean
     * anything — a percentile over three samples is decoration, not information. */
    const score = circuitScore(profile, consoleData.setup_ease_score, consoleData.community_score);
    const tierStats = score && catalogueStats ? catalogueStats[score.reach] : undefined;
    const tierSize = tierStats?.scores.length ?? 0;

    const scorePercentile = score && tierStats?.scores.length
        ? percentileOf(score.score, tierStats.scores) : null;
    const pricePercentile = price && tierStats?.prices.length
        ? percentileOf(price, tierStats.prices) : null;
    const valuePercentile = score && price && tierStats?.values.length
        ? percentileOf(scorePerDollar(score.score, price) ?? 0, tierStats.values) : null;

    const rankable = tierSize >= MIN_POPULATION_FOR_RANK;

    const verdict = buildVerdict({
        profile,
        reach: score?.reach ?? null,
        formFactor: consoleData.form_factor,
        pricePercentile,
        tierSize,
        rankable,
    });

    const tags = buildTags({
        deviceCategory: consoleData.device_category,
        formFactor: consoleData.form_factor,
        screenInch: specs.screen_size_inch,
        screenResY: specs.screen_resolution_y,
        osFamily: specs.os_family,
        osVersion: specs.os_version,
        osText: specs.os,
        releaseDate: variant?.release_date,
        weightG: specs.weight_g,
    });

    /* A button that says "Check Price" and silently runs an Amazon search for a device
     * Amazon does not stock is worse than no button. Name the retailer, show the price we
     * hold, and mark a search as a search. */
    const buy = pickBuyTarget({
        asin: variant?.amazon_asin,
        name: consoleData.name,
        manufacturer: brand,
        links: (consoleData as any).links,
    });


    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6">

            {/* Breadcrumb — the brand carries the product, so it is a real link. */}
            <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-widest text-gray-600 mb-6">
                <Link href="/consoles" className="hover:text-white transition-colors">Vault_</Link>
                {brand && brandSlug && (
                    <>
                        <span className="mx-2 text-gray-700">/</span>
                        <Link href={`/fabricators/${brandSlug}`} className="hover:text-white transition-colors">{brand}</Link>
                    </>
                )}
                <span className="mx-2 text-gray-700">/</span>
                <span className="text-gray-400">{consoleData.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* ---- IMAGE ---------------------------------------------------- */}
                <div className="lg:col-span-7">
                    <div className="rc-bed relative w-full aspect-[4/3] md:aspect-video border border-white/10 flex items-center justify-center overflow-hidden">
                        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest text-white/25">FIG. 01</span>
                        <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest text-white/25 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-violet-500 inline-block" aria-hidden="true" />
                            In Vault
                        </span>

                        {shot ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                key={shot.url}
                                src={shot.url}
                                alt={shot.alt_text || consoleData.name}
                                fetchPriority={heroIndex === 0 ? 'high' : 'auto'}
                                decoding="async"
                                className={`max-w-[78%] max-h-[78%] object-contain ${isPixelFallback ? '[image-rendering:pixelated]' : ''}`}
                            />
                        ) : (
                            <span className="font-pixel text-xl text-zinc-700">NO SIGNAL</span>
                        )}

                        <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-widest text-white/25 uppercase">
                            {[consoleData.form_factor, specs.screen_size_inch ? `${specs.screen_size_inch}"` : null].filter(Boolean).join(' · ')}
                        </span>
                        <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-widest text-white/25">SCALE 1:1</span>
                    </div>

                    {shots.length > 1 && (
                        <ul className="mt-3 grid grid-cols-6 gap-2">
                            {shots.slice(0, 6).map((s, i) => (
                                <li key={s.id}>
                                    <button
                                        type="button"
                                        onClick={() => onHeroIndex(i)}
                                        aria-current={i === heroIndex}
                                        aria-label={s.alt_text || `View ${s.kind || 'image'} of ${consoleData.name}`}
                                        className={`flex aspect-video w-full items-center justify-center overflow-hidden border bg-black/40 transition-colors ${
                                            i === heroIndex ? 'border-violet-500' : 'border-white/10 hover:border-white/40'
                                        }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={s.url} alt="" loading="lazy" decoding="async" className="max-h-[80%] max-w-[80%] object-contain" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {belowImage && <div className="mt-6">{belowImage}</div>}
                </div>

                {/* ---- IDENTITY & DECISION -------------------------------------- */}
                <div className="lg:col-span-5">
                    {brand && (
                        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">{brand}</div>
                    )}
                    {/* The cursor is the brand's own mark — the logo is RETRO CIRCUIT_. A rule
                        underneath it would be a second, generic device saying the same thing. */}
                    <h1 className="font-pixel text-3xl md:text-5xl text-white uppercase leading-none tracking-tighter break-words mb-5">
                        {consoleData.name}
                        <span className="text-violet-500 motion-safe:animate-pulse">_</span>
                    </h1>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map(t => (
                            <Chip key={t.label} tone={t.tone}>
                                {t.dot && <span className="w-1.5 h-1.5 bg-current inline-block" aria-hidden="true" />}
                                {t.label}
                            </Chip>
                        ))}
                    </div>

                    {/* The two numbers the decision turns on, each with where it stands. */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        <PriceCard
                            price={price ?? null}
                            percentile={pricePercentile}
                            tierSize={tierSize}
                            medianPrice={tierStats?.medianPrice ?? null}
                            valuePercentile={valuePercentile}
                        />
                        {score ? (
                            <CircuitScoreCard
                                score={score}
                                percentile={scorePercentile}
                                tierSize={tierSize}
                                medianScore={tierStats?.medianScore ?? null}
                            />
                        ) : (
                            <div className="border border-white/10 bg-white/[0.02] p-4">
                                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-3">Circuit Score</div>
                                <div className="font-pixel text-lg text-gray-600 leading-none">Untested</div>
                                <div className="font-mono text-[10px] text-gray-500 mt-3">No graded emulation profile yet</div>
                            </div>
                        )}
                    </div>

                    {verdict && (
                        <div className="border-l-[3px] border-violet-500 bg-violet-500/[0.07] px-4 py-3 mb-5">
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-300 mb-2">
                                The short version
                            </div>
                            <p className="font-mono text-[13px] text-gray-200 leading-relaxed m-0">{verdict}</p>
                        </div>
                    )}

                    {/* Comparing devices is what the site is for, so it is the primary action. */}
                    <div className="flex flex-wrap items-stretch gap-2">
                        <Link
                            href={compareUrl}
                            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500
                                       text-white font-mono text-[11px] uppercase tracking-widest transition-colors"
                        >
                            Add to Arena
                        </Link>
                        {buy && (
                            <a
                                href={buy.url}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className={`flex-1 min-w-[150px] flex flex-col items-center justify-center px-4 py-2.5 font-mono
                                            text-[11px] uppercase tracking-widest transition-colors ${
                                    buy.confidence === 'direct'
                                        ? 'border border-cyan-500/60 text-cyan-400 hover:bg-cyan-500 hover:text-black'
                                        : 'border border-dashed border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-black'
                                }`}
                            >
                                <span>
                                    {buy.confidence === 'direct' ? `Buy on ${buy.vendor}` : `Search ${buy.vendor}`}
                                </span>
                                <span className="text-[9px] tracking-wider opacity-70 normal-case mt-0.5">
                                    {price ? `from $${price}` : buy.confidence === 'direct' ? 'live listing' : 'no direct listing yet'}
                                </span>
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onShare}
                            aria-label="Copy link to this console"
                            className="relative px-4 py-3 border border-white/15 text-gray-400 hover:border-white hover:text-white transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            {shareCopied && (
                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 font-mono text-[9px] whitespace-nowrap">
                                    COPIED
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ConsoleHero;
