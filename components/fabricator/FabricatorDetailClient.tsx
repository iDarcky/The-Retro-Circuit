'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails, Manufacturer } from '../../lib/types';
import AdminEditTrigger from '../admin/AdminEditTrigger';
import { hexToRgb } from '../../lib/utils/colors';
import { formatReleaseDate } from '../../lib/utils/date-formatter';
import { SwissHeader } from '../ui/SwissHeader';

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

    const cssVars = {
        '--brand-color': brandColor,
        '--brand-rgb': brandRgb,
    } as React.CSSProperties;

    return (
        <div className="w-full animate-[fadeIn_0.5s_ease-in-out]" style={cssVars}>

            {/* Swiss Header */}
            <SwissHeader
                title={
                    <div className="flex items-center gap-4 flex-wrap">
                         {profile.name}
                         <AdminEditTrigger
                            id={profile.id}
                            type="fabricator"
                            displayMode="inline"
                         />
                    </div>
                }
                subtitle={`${profile.country ? profile.country : 'UNKNOWN ORIGIN'} // EST. ${profile.founded_year || '????'}`}
                borderColor={brandColor}
            />

            <div className="max-w-[1600px] mx-auto p-6 md:p-12 space-y-12">

                {/* Introduction Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Description & Logo */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Mobile/Inline Logo if available */}
                         {profile.image_url && (
                             <div className="w-24 h-24 relative mb-4 p-4 border border-white/10 bg-black/20">
                                <Image
                                    src={profile.image_url}
                                    alt={profile.name}
                                    fill
                                    className="object-contain p-2"
                                />
                             </div>
                         )}

                        <div className="space-y-4">
                            <h2 className="font-pixel text-sm text-[var(--brand-color)] uppercase tracking-widest mb-4">Corporate History</h2>
                            <p className="font-mono text-zinc-400 text-sm md:text-base leading-relaxed max-w-4xl whitespace-pre-line">
                                {profile.description || "No historical data available."}
                            </p>
                        </div>
                    </div>

                    {/* Right: Key Franchises & Data */}
                    <div className="lg:col-span-4 space-y-8 border-l border-white/10 pl-0 lg:pl-12 pt-8 lg:pt-0">
                         {profile.website && (
                            <div>
                                <h3 className="font-pixel text-xs text-zinc-500 mb-2 uppercase">Official Channel</h3>
                                <a href={profile.website} target="_blank" className="font-mono text-sm text-[var(--brand-color)] hover:underline break-all">
                                    {profile.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}

                        <div>
                            <h3 className="font-pixel text-xs text-zinc-500 mb-4 uppercase">Key Franchises</h3>
                            <div className="flex flex-wrap gap-2">
                                {(profile.key_franchises || "").split(',').map((f: string) => f.trim() && (
                                    <span key={f.trim()} className="font-mono text-[10px] uppercase border border-white/10 px-2 py-1 text-zinc-300 hover:border-[var(--brand-color)] hover:text-[var(--brand-color)] transition-colors cursor-default">
                                        {f.trim()}
                                    </span>
                                ))}
                                {!(profile.key_franchises) && <span className="font-mono text-xs text-zinc-600">N/A</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hardware Grid */}
                <div className="border-t border-white/10 pt-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-pixel text-sm text-white uppercase tracking-widest">
                            Hardware Catalogue <span className="text-zinc-500 ml-2">({consoles.length})</span>
                        </h2>
                    </div>

                    {consoles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-white/10 border border-white/10">
                            {consoles.map((console) => (
                                <Link
                                    href={`/consoles/${console.slug}`}
                                    key={console.id}
                                    className="group relative block bg-[#09090b] h-full hover:z-10 focus:z-10 outline-none"
                                >
                                    <div className="aspect-[4/3] relative flex items-center justify-center p-6 bg-gradient-to-b from-white/[0.02] to-transparent group-hover:from-[var(--brand-color)]/10 group-hover:to-transparent transition-colors duration-500">
                                         {/* Hover Border Effect */}
                                        <div className="absolute inset-0 border border-transparent group-hover:border-[var(--brand-color)]/50 transition-colors pointer-events-none z-20"></div>

                                        {console.image_url ? (
                                            <Image
                                                src={console.image_url}
                                                alt={console.name}
                                                width={300}
                                                height={225}
                                                className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <span className="font-pixel text-zinc-700 text-3xl">?</span>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3 font-mono text-[9px] text-zinc-500 bg-black/50 px-1.5 py-0.5 backdrop-blur-sm border border-white/5">
                                            {formatReleaseDate(console.specs?.release_date, console.specs?.release_date_precision)?.split(' ')[0] || 'TBA'}
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-white/5 group-hover:border-[var(--brand-color)]/20 transition-colors bg-[#09090b]">
                                        <h3 className="font-pixel text-xs text-white mb-1 truncate group-hover:text-[var(--brand-color)] transition-colors">
                                            {console.name}
                                        </h3>
                                        <div className="flex justify-between items-end">
                                             <span className="font-mono text-[10px] text-zinc-500 uppercase">{console.generation || 'Unknown Gen'}</span>
                                             <span className="font-mono text-[10px] text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-opacity">VIEW_DATA &gt;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 border border-dashed border-white/10 text-center">
                            <p className="font-mono text-zinc-500 text-sm">NO HARDWARE UNITS INDEXED.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
