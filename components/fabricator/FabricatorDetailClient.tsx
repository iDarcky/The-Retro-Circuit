'use client';

import Link from 'next/link';
import { ConsoleDetails, Manufacturer } from '../../lib/types';
import AdminEditTrigger from '../admin/AdminEditTrigger';
import RetroStatusBar from '../ui/RetroStatusBar';
import { getDocVersion } from '../../lib/utils/doc-version';
import { hexToRgb, ensureHighContrast } from '../../lib/utils/colors';
import { formatReleaseDate } from '../../lib/utils/date-formatter';

interface Props {
    profile: Manufacturer;
    consoles: ConsoleDetails[];
}

export default function FabricatorDetailClient({ profile, consoles }: Props) {
    // Color Setup
    const staticHexMap: Record<string, string> = {
        'Nintendo': '#ef4444',
        'Sega': '#3b82f6',
        'Sony': '#facc15',
        'Atari': '#f97316',
        'Microsoft': '#22c55e',
        'NEC': '#c084fc',
        'SNK': '#2dd4bf',
    };

    const brandColor = profile.brand_color || staticHexMap[profile.name] || '#00ff9d';
    const brandRgb = hexToRgb(brandColor);
    const highContrastText = ensureHighContrast(brandColor);

    // Accent Style Logic (Hardcoded)
    const getStyles = (elementType: 'title' | 'subtitle' | 'text' | 'container' | 'card_text') => {
        const base = "transition-all duration-300";

        switch (elementType) {
            case 'title':
                return `${base} text-white border-l-8 border-[var(--brand-color)] pl-4`;
            case 'subtitle':
                return `${base} text-white border-b-2 border-[var(--brand-color)] inline-block pb-1`;
            case 'card_text':
                return `text-white group-hover:text-white group-hover:border-b group-hover:border-[var(--brand-color)]`;
            default:
                return base;
        }
    };

    const cssVars = {
        '--brand-color': brandColor,
        '--brand-rgb': brandRgb,
        '--hc-color': highContrastText,
    } as React.CSSProperties;

    return (
        <div className="w-full animate-[fadeIn_0.5s_ease-in-out]" style={cssVars}>
            <RetroStatusBar
                rcPath={`RC://RETRO_CIRCUIT/VAULT/MANUFACTURERS/${profile.slug.toUpperCase()}`}
                docId={`FABRICATOR_PROFILE_${profile.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}${getDocVersion(profile.slug)}`}
            />

            <div className="max-w-7xl mx-auto p-4">
                {/* Header / Dossier */}
                <div className={`border-l-8 bg-bg-primary p-6 md:p-8 mb-8 shadow-lg border-[var(--brand-color)] shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)]`}>
                    <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-800 pb-6 mb-6 gap-6">
                        {/* Left Column: Title & Identity */}
                        <div className="flex-1 w-full">
                            <div className="flex flex-wrap gap-2 mb-2 items-center justify-between md:justify-start">
                                <div className="font-mono text-xs text-gray-500">
                                    <Link href="/" className="hover:text-white">HOME</Link> &gt; <Link href="/fabricators" className="hover:text-white">FABRICATORS</Link> &gt; {profile.name.toUpperCase()}
                                </div>
                                <div className={`font-mono text-xs border px-2 py-0.5 border-[var(--brand-color)] text-[var(--brand-color)]`}>CONFIDENTIAL</div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                {profile.image_url && (
                                    <div className="bg-black/20 p-2 border border-gray-700 rounded md:hidden">
                                        <img src={profile.image_url} className="h-12 w-auto object-contain" />
                                    </div>
                                )}
                                <h1 className={`text-3xl sm:text-4xl md:text-6xl font-pixel opacity-90 break-words leading-tight ${getStyles('title')}`}>
                                    {profile.name}
                                </h1>

                                <AdminEditTrigger
                                    id={profile.id}
                                    type="fabricator"
                                    displayMode="inline"
                                    className="mt-1"
                                />
                            </div>

                            {profile.website && (
                                <a href={profile.website} target="_blank" className="font-mono text-xs text-gray-500 hover:text-white mt-2 inline-block break-all">
                                    [ {profile.website.replace('https://', '').replace('http://', '')} ]
                                </a>
                            )}
                        </div>

                        {/* Right Column: Stats & Logo (Desktop) */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                            {profile.image_url && (
                                <img src={profile.image_url} className="hidden md:block h-20 lg:h-24 w-auto object-contain mb-4" />
                            )}
                            <div className="flex flex-col md:items-end">
                                <div className="font-mono text-gray-500 text-[10px] uppercase">FOUNDED</div>
                                <div className="font-pixel text-white text-lg">{profile.founded_year}</div>
                            </div>
                            <div className="flex flex-col md:items-end">
                                <div className="font-mono text-gray-500 text-[10px] uppercase">HQ ORIGIN</div>
                                <div className="font-pixel text-white text-lg">{profile.country}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h3 className={`font-pixel text-lg mb-4 ${getStyles('subtitle')}`}>CORPORATE HISTORY</h3>
                            <p className="font-mono text-gray-300 text-sm md:text-base leading-relaxed border-l-2 border-gray-700 pl-4 whitespace-pre-line">
                                {profile.description}
                            </p>
                        </div>

                        <div className={`bg-black/30 p-6 border border-gray-800 h-fit`}>
                            <div className="mb-0">
                                <h4 className="font-pixel text-xs text-gray-500 mb-4 border-b border-gray-800 pb-2">KEY FRANCHISES</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.key_franchises || "").split(',').map((f: string) => (
                                        <span key={f.trim()} className={`font-mono text-xs border px-2 py-1 bg-black/50 border-[var(--brand-color)] text-[var(--brand-color)]`}>
                                            {f.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hardware Grid */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className={`font-pixel text-xl md:text-2xl ${getStyles('subtitle')}`}>KNOWN HARDWARE UNITS</h3>
                        <div className="flex-1 h-px bg-gray-800"></div>
                    </div>

                    {consoles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {consoles.map((console) => (
                                <Link
                                    href={`/consoles/${console.slug}`}
                                    key={console.id}
                                    className={`group block border border-border-normal bg-bg-primary relative overflow-hidden transition-all hover:bg-[rgba(var(--brand-rgb),0.2)]`}
                                >
                                    <div className="h-32 bg-black/40 flex items-center justify-center p-4 relative">
                                        {console.image_url ? (
                                            <img src={console.image_url} className="max-h-full object-contain" />
                                        ) : (
                                            <span className="font-pixel text-gray-700 text-2xl">?</span>
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-border-normal">
                                        <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                                            <span>{formatReleaseDate(console.specs?.release_date, console.specs?.release_date_precision) || 'TBA'}</span>
                                            <span>{console.generation}</span>
                                        </div>
                                        <h3 className={`font-pixel text-xs truncate ${getStyles('card_text')}`}>
                                            {console.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 border-2 border-dashed border-gray-800 text-center font-mono text-gray-500">
                            NO UNITS DECLASSIFIED IN DATABASE.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
