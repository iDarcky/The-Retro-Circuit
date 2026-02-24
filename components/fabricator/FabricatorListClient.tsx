'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Manufacturer } from '../../lib/types';
import Button from '../ui/Button';
import { LayoutGrid, List, Search } from 'lucide-react';

interface Props {
    manufacturers: Manufacturer[];
}

export default function FabricatorListClient({ manufacturers }: Props) {
    const [viewMode, setViewMode] = useState<'swiss' | 'classic'>('swiss');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredManufacturers, setFilteredManufacturers] = useState<Manufacturer[]>(manufacturers);
    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = viewMode === 'swiss' ? 24 : 12;

    useEffect(() => {
        let result = manufacturers;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(lowerTerm)
            );
        }

        // Sort alphabetically by name
        result.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredManufacturers(result);
        setPage(1);
    }, [searchTerm, manufacturers]);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const totalPages = Math.ceil(filteredManufacturers.length / ITEMS_PER_PAGE);
    const paginatedManufacturers = filteredManufacturers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-32">
            {/* HEADER */}
            <div className="relative pt-24 pb-12 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                 {/* Background Effects */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

                 <div className="max-w-[1800px] mx-auto relative z-10">
                    <div className="flex flex-col items-start gap-4">
                         <h1 className="text-4xl md:text-6xl font-pixel font-bold tracking-tighter text-white uppercase drop-shadow-lg leading-tight">
                            Fabricator <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Archives</span><span className="text-emerald-500 animate-pulse">_</span>
                         </h1>
                         <p className="text-lg md:text-xl text-zinc-400 max-w-2xl font-light font-mono">
                            AUTHORIZED HARDWARE MANUFACTURERS. INDEX OF CORPORATE ENTITIES AND FABRICATION PLANTS.
                         </p>
                    </div>
                 </div>
            </div>

            {/* CONTROLS BAR */}
            <div className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-4">
                 <div className="max-w-[1800px] mx-auto flex justify-between items-center gap-4">

                     {/* Search Input */}
                     <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME..."
                            value={searchTerm}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-b border-white/20 pl-6 py-2 text-sm font-mono text-white focus:border-emerald-500 outline-none placeholder:text-zinc-600 transition-colors"
                        />
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <span className="text-emerald-500">{filteredManufacturers.length}</span> UNITS FOUND
                        </div>

                         <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
                             <button
                                onClick={() => { setViewMode('swiss'); setPage(1); }}
                                className={`p-2 rounded transition-colors ${viewMode === 'swiss' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                                title="Grid View"
                             >
                                <LayoutGrid size={16} />
                             </button>
                             <button
                                onClick={() => { setViewMode('classic'); setPage(1); }}
                                className={`p-2 rounded transition-colors ${viewMode === 'classic' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                                title="List View"
                             >
                                <List size={16} />
                             </button>
                         </div>
                     </div>
                 </div>
            </div>

            {/* MAIN GRID */}
            <div className="px-6 md:px-12 py-8 max-w-[1800px] mx-auto min-h-[50vh]">
                {paginatedManufacturers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                        <Search className="w-12 h-12 text-zinc-700 mb-4" />
                        <p className="font-mono text-zinc-500">NO ENTITY FOUND.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-emerald-400 hover:text-emerald-300 text-xs font-mono uppercase underline">
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${
                        viewMode === 'swiss'
                        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                        : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                    }`}>
                        {paginatedManufacturers.map((manufacturer) => {
                            if (viewMode === 'swiss') {
                                // SWISS STYLE CARD
                                return (
                                    <Link
                                        href={`/fabricators/${manufacturer.slug}`}
                                        key={manufacturer.id}
                                        className="group relative flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 rounded-xl overflow-hidden"
                                    >
                                        <div className="aspect-square p-8 flex items-center justify-center relative bg-gradient-to-b from-transparent to-black/20">
                                             {manufacturer.image_url ? (
                                                 <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                                                    <Image
                                                        src={manufacturer.image_url}
                                                        alt={manufacturer.name}
                                                        fill
                                                        className="object-contain drop-shadow-xl"
                                                        sizes="(max-width: 768px) 50vw, 20vw"
                                                    />
                                                 </div>
                                             ) : (
                                                 <div className="text-zinc-700 font-mono text-xl font-bold">{manufacturer.name.charAt(0)}</div>
                                             )}
                                        </div>

                                        <div className="p-4 border-t border-white/5 bg-white/[0.01] mt-auto">
                                            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-emerald-300 transition-colors truncate mb-1">
                                                {manufacturer.name}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-zinc-600">
                                                    EST. {manufacturer.founded_year || 'UNKNOWN'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            } else {
                                // CLASSIC STYLE CARD
                                return (
                                    <Link
                                        href={`/fabricators/${manufacturer.slug}`}
                                        key={manufacturer.id}
                                        className="group block bg-black border border-zinc-800 hover:border-emerald-500 transition-all relative overflow-hidden"
                                    >
                                        <div className="flex flex-row h-24">
                                            <div className="w-24 bg-zinc-900/50 relative flex items-center justify-center p-4 border-r border-zinc-800 shrink-0">
                                                 {manufacturer.image_url ? (
                                                     <div className="relative w-full h-full">
                                                        <Image
                                                            src={manufacturer.image_url}
                                                            alt={manufacturer.name}
                                                            fill
                                                            className="object-contain group-hover:scale-105 transition-transform"
                                                        />
                                                     </div>
                                                 ) : (
                                                     <span className="font-pixel text-zinc-700 text-xl">{manufacturer.name.charAt(0)}</span>
                                                 )}
                                            </div>
                                            <div className="flex-1 p-4 flex flex-col justify-center">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 leading-none">{manufacturer.name}</h3>
                                                </div>
                                                <div className="flex justify-between items-end border-t border-zinc-800 pt-2 mt-2">
                                                    <span className="text-[10px] font-mono text-zinc-500">EST. {manufacturer.founded_year || 'UNKNOWN'}</span>
                                                    <span className="text-[10px] text-emerald-500 group-hover:underline">ACCESS &gt;</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 py-16 border-t border-white/5 mt-16">
                        <Button
                            variant="secondary"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="scale-75 origin-right"
                        >
                            &lt; PREV
                        </Button>

                        <div className="font-mono text-xs text-zinc-400 px-4 py-2">
                            PAGE {page} / {totalPages}
                        </div>

                        <Button
                            variant="secondary"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="scale-75 origin-left"
                        >
                            NEXT &gt;
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
