'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { ConsoleDetails, ConsoleSpecs, ConsoleVariant, EmulationProfile } from '../../../lib/types';
import { SYSTEM_TIERS } from '../../../lib/config/emulation';
import { getBuyUrl } from '../../../lib/affiliate';

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
    onEmulationDetails: () => void;
}

/** Highest tier with at least one playable system, plus the systems that qualified. */
function topTier(profile?: EmulationProfile | null) {
    if (!profile) return null;
    for (let i = SYSTEM_TIERS.length - 1; i >= 0; i--) {
        const tier = SYSTEM_TIERS[i];
        const playable = tier.systems.filter(sys => {
            const s = (profile as any)[sys.key];
            return s === 'Playable' || s === 'Great' || s === 'Perfect';
        });
        if (playable.length > 0) {
            return { n: i + 1, title: tier.title.replace(/^TIER \d+:\s*/, ''), systems: playable.map(s => s.label) };
        }
    }
    return null;
}

const Chip: FC<{ children: React.ReactNode; tone?: 'violet' | 'cyan' | 'orange' | 'plain' }> = ({ children, tone = 'plain' }) => {
    const tones = {
        violet: 'text-violet-400 border-violet-500/40',
        cyan: 'text-cyan-400 border-cyan-500/40',
        orange: 'text-orange-500 border-orange-500/50',
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
    isPixelFallback, compareUrl, onShare, shareCopied, onEmulationDetails,
}) => {
    const brand = consoleData.manufacturer?.name;
    const brandSlug = consoleData.manufacturer?.slug;
    const shot = shots[Math.min(heroIndex, Math.max(shots.length - 1, 0))];
    const tier = topTier(profile);

    // Street price is the one to show; launch price is the reference it is measured against.
    const street = variant?.price_avg_usd ?? null;
    const launch = variant?.price_launch_usd ?? null;
    const price = street ?? launch;
    // Both are populated on no variant today (the importer wrote one, the form the other),
    // so this delta stays hidden until they overlap rather than showing a fake 0%.
    const delta = street && launch && launch > 0 ? Math.round(((street - launch) / launch) * 100) : null;

    const res = specs.screen_resolution_y ? `${specs.screen_resolution_y}p` : null;
    const screen = [specs.screen_size_inch ? `${specs.screen_size_inch}"` : null, res].filter(Boolean).join(' · ');
    const os = [specs.os_family, specs.os_version].filter(Boolean).join(' ') || specs.os;
    const year = variant?.release_date ? variant.release_date.slice(0, 4) : null;
    const isNew = year ? Number(year) >= new Date().getFullYear() - 1 : false;

    const buyUrl = getBuyUrl({
        asin: variant?.amazon_asin,
        name: consoleData.name,
        manufacturer: brand,
    });

    const specCards = [
        { k: 'CPU', v: specs.soc_name || specs.cpu_model, sub: [specs.soc_vendor, specs.soc_gen].filter(Boolean).join(' ') || specs.cpu_architecture },
        { k: 'GPU', v: specs.gpu_name || specs.gpu_model, sub: specs.gpu_clock_mhz ? `${(specs.gpu_clock_mhz / 1000).toFixed(2).replace(/\.?0+$/, '')} GHz` : specs.gpu_vendor },
        { k: 'RAM', v: specs.ram_mb ? (specs.ram_mb >= 1024 ? `${Math.round(specs.ram_mb / 1024)} GB` : `${specs.ram_mb} MB`) : null, sub: specs.ram_type },
        { k: 'Storage', v: specs.storage_gb ? `${specs.storage_gb} GB` : null, sub: specs.storage_expandable ? '+ microSD' : specs.storage_type },
    ].filter(c => c.v);

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
                    <div className="relative w-full aspect-[4/3] md:aspect-video border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
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
                </div>

                {/* ---- IDENTITY & DECISION -------------------------------------- */}
                <div className="lg:col-span-5">
                    {brand && (
                        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">{brand}</div>
                    )}
                    <h1 className="font-pixel text-3xl md:text-5xl text-white uppercase leading-none tracking-tighter break-words">
                        {consoleData.name}
                        <span className="text-violet-500">_</span>
                    </h1>
                    <div className="w-24 h-0.5 bg-violet-500 mt-4 mb-5" aria-hidden="true" />

                    <div className="flex flex-wrap gap-2 mb-6">
                        {consoleData.device_category && (
                            <Chip tone="violet">
                                <span className="w-1.5 h-1.5 bg-violet-500 inline-block" aria-hidden="true" />
                                {String(consoleData.device_category).replace('_', ' ')}
                            </Chip>
                        )}
                        {year && (
                            <Chip tone={isNew ? 'cyan' : 'plain'}>
                                {isNew && <span className="w-1.5 h-1.5 bg-cyan-400 inline-block" aria-hidden="true" />}
                                {isNew ? `New · ${year}` : year}
                            </Chip>
                        )}
                        {screen && <Chip tone="orange">{screen}</Chip>}
                        {os && <Chip>{os}</Chip>}
                    </div>

                    {/* The two numbers the decision turns on, side by side. */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="border border-white/10 bg-white/[0.02] p-4">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Price</div>
                            {price ? (
                                <>
                                    <div className="font-pixel text-2xl md:text-3xl text-emerald-400 leading-none">${price}</div>
                                    {delta !== null && delta !== 0 && (
                                        <div className="font-mono text-[10px] text-gray-500 mt-2">
                                            {delta < 0 ? '↓' : '↑'} {Math.abs(delta)}% vs MSRP
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="font-pixel text-lg text-gray-600 leading-none">—</div>
                            )}
                        </div>

                        <div className="border border-white/10 bg-white/[0.02] p-4">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Emulation Tier</div>
                            {tier ? (
                                <>
                                    <div className="font-pixel text-2xl md:text-3xl text-violet-400 leading-none">T{tier.n}</div>
                                    <div className="font-mono text-[10px] text-gray-500 mt-2 uppercase">{tier.title}</div>
                                </>
                            ) : (
                                <div className="font-pixel text-lg text-gray-600 leading-none">Untested</div>
                            )}
                        </div>
                    </div>

                    {/* Comparing devices is what the site is for, so it is the primary action. */}
                    <div className="flex flex-wrap items-stretch gap-2">
                        <Link
                            href={compareUrl}
                            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500
                                       text-white font-mono text-[11px] uppercase tracking-widest transition-colors"
                        >
                            Add to Arena
                        </Link>
                        {buyUrl && (
                            <a
                                href={buyUrl}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="flex-1 min-w-[130px] flex items-center justify-center px-4 py-3 border border-cyan-500/60 text-cyan-400
                                           hover:bg-cyan-500 hover:text-black font-mono text-[11px] uppercase tracking-widest transition-colors"
                            >
                                Check Price
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

            {/* ---- SPEC CARDS ---------------------------------------------------- */}
            {specCards.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                    {specCards.map(c => (
                        <div key={c.k} className="border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                                <span className="w-1 h-1 bg-cyan-500 inline-block" aria-hidden="true" />
                                {c.k}
                            </div>
                            <div className="font-mono text-sm md:text-base text-white truncate" title={String(c.v)}>{c.v}</div>
                            {c.sub && <div className="font-mono text-[10px] text-gray-500 mt-1 truncate">{c.sub}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* ---- EMULATION BANNER ---------------------------------------------- */}
            {tier && (
                <button
                    type="button"
                    onClick={onEmulationDetails}
                    className="w-full mt-3 border border-violet-500/40 bg-violet-500/[0.07] hover:bg-violet-500/[0.12] transition-colors
                               px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-left"
                >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Emulation</span>
                    <span className="font-pixel text-lg text-violet-400 leading-none">T{tier.n}</span>
                    <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
                        {tier.title} · {tier.systems.slice(0, 4).join(', ')}
                    </span>
                    <span className="flex gap-1 ml-auto" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} className={`w-4 h-3 ${n <= tier.n ? (n === tier.n ? 'bg-cyan-400' : 'bg-violet-500') : 'bg-white/10'}`} />
                        ))}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Details →</span>
                </button>
            )}
        </div>
    );
};

export default ConsoleHero;
