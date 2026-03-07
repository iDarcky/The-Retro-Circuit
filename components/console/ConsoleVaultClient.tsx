'use client';

import { useEffect, useState, type ChangeEvent, type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails, ConsoleFilterState, Manufacturer } from '../../lib/types';
import RetroLoader from '../ui/RetroLoader';
import SwissButton from '@/components/console/swiss/SwissButton';
import { formatReleaseDate } from '../../lib/utils/date-formatter';
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react';
import { SwissDropdown } from '../ui/SwissDropdown';

interface ConsoleVaultClientProps {
    initialManufacturers: Manufacturer[];
    initialConsoles: ConsoleDetails[];
}

type SortOption = 'release_desc' | 'release_asc' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: { value: SortOption, label: string }[] = [
    { value: 'release_desc', label: 'NEWEST FIRST' },
    { value: 'release_asc', label: 'OLDEST FIRST' },
    { value: 'name_asc', label: 'NAME (A-Z)' },
    { value: 'name_desc', label: 'NAME (Z-A)' },
    { value: 'price_asc', label: 'PRICE (LOW-HIGH)' },
    { value: 'price_desc', label: 'PRICE (HIGH-LOW)' },
];

const ConsoleVaultClient: FC<ConsoleVaultClientProps> = ({ initialManufacturers, initialConsoles }) => {
        const [allConsoles] = useState<ConsoleDetails[]>(initialConsoles);
    const [filteredConsoles, setFilteredConsoles] = useState<ConsoleDetails[]>(initialConsoles);
    const [manufacturers] = useState<Manufacturer[]>(initialManufacturers);
    const [loading] = useState(false);

    // View Mode State
    const [viewMode, setViewMode] = useState<'swiss' | 'classic'>('swiss');
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOption>('release_desc');

    // Pagination State
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = viewMode === 'swiss' ? 24 : 12; // Show more items in grid view

    // Filter State
    const [filters, setFilters] = useState<ConsoleFilterState>({
        minYear: 1980,
        maxYear: new Date().getFullYear(),
        generations: [],
        form_factors: [],
        manufacturer_id: null,
        panel_types: []
    });

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    // Client-Side Filter Logic
    useEffect(() => {
        let result = [...allConsoles];

        if (filters.manufacturer_id) {
            result = result.filter(c => c.manufacturer_id === filters.manufacturer_id);
        }

        result = result.filter(c => {
            let year = 9999;
            const specs: any = c.specs || {};
            if (specs.release_date) {
                const dateYear = parseInt(specs.release_date.substring(0, 4));
                if (!isNaN(dateYear)) year = dateYear;
            }
            if (year === 9999) return true;
            return year >= filters.minYear && year <= filters.maxYear;
        });

        if (filters.form_factors.length > 0) {
            result = result.filter(c => {
                if (!c.form_factor) return false;
                return filters.form_factors.some(ff => c.form_factor?.toLowerCase() === ff.toLowerCase());
            });
        }

        if (filters.panel_types.length > 0) {
            result = result.filter(c => {
                const variants = c.variants || [];
                return variants.some(v => {
                    const displayType = (v.display_type || '').toLowerCase();
                    return filters.panel_types.some(pt => displayType.includes(pt.toLowerCase()));
                });
            });
        }

        // Sorting Logic
        const getMinPrice = (item: ConsoleDetails) => {
            if (!item.variants || item.variants.length === 0) return 999999;
            const prices = item.variants.map(v => v.price_launch_usd).filter(p => p !== undefined && p !== null);
            return prices.length > 0 ? Math.min(...(prices as number[])) : 999999;
        };

        result.sort((a, b) => {
            switch (sortOrder) {
                case 'release_desc':
                case 'release_asc': {
                    const getDate = (item: ConsoleDetails) => {
                        const specs: any = item.specs || {};
                        return specs.release_date ? new Date(specs.release_date).getTime() : 0;
                    };
                    const dateA = getDate(a);
                    const dateB = getDate(b);
                    return sortOrder === 'release_desc' ? dateB - dateA : dateA - dateB;
                }
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                case 'price_asc':
                    return getMinPrice(a) - getMinPrice(b);
                case 'price_desc':
                    const pA = getMinPrice(a);
                    const pB = getMinPrice(b);
                    if (pA === 999999 && pB === 999999) return 0; // Stability fix
                    if (pA === 999999) return 1;
                    if (pB === 999999) return -1;
                    return pB - pA;
                default:
                    return 0;
            }
        });

        setFilteredConsoles(result);
        setPage(1);
    }, [filters, allConsoles, sortOrder]);

    const toggleFilter = (category: 'form_factors' | 'panel_types', value: string) => {
        setFilters(prev => {
            const current = prev[category];
            const exists = current.includes(value);
            let updated = exists ? current.filter(item => item !== value) : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const getFormFactorColor = (factor: string) => {
        const f = factor.toLowerCase();
        if (f === 'vertical') return 'text-yellow-400 border-yellow-400';
        if (f === 'horizontal') return 'text-primary border-primary';
        if (f === 'clamshell') return 'text-accent border-accent';
        return 'text-gray-400 border-gray-400';
    };

    const totalPages = Math.ceil(filteredConsoles.length / ITEMS_PER_PAGE);
    const paginatedConsoles = filteredConsoles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // --- SUB-COMPONENTS ---

    return (
        <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-32">
            {/* HEADER */}
            <div className="relative pt-24 pb-12 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

                <div className="max-w-[1800px] mx-auto relative z-10">
                    <div className="flex flex-col items-start gap-4">
                        <h1 className="text-4xl md:text-6xl font-pixel font-bold tracking-tighter text-white uppercase drop-shadow-lg leading-tight">
                            Console <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Vault</span><span className="text-violet-500 animate-pulse">_</span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl font-light font-mono">
                            The complete archive of handheld gaming history. Filter by era, form factor, and technical specifications.
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTROLS BAR */}
            <div className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-4">
                <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                    <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${showFilters ? 'bg-white text-black border-white' : 'text-white border-white/20 hover:border-white/50 bg-black/40'}`}
                            >
                                <SlidersHorizontal size={14} />
                                <span className="hidden md:inline">{showFilters ? 'Hide Filters' : 'Filter Data'}</span>
                                <span className="md:hidden">FILTERS</span>
                            </button>

                            {/* SWISS DROPDOWN */}
                            <SwissDropdown
                                value={sortOrder}
                                onChange={setSortOrder}
                                options={SORT_OPTIONS}
                            />
                        </div>

                        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <span className="text-emerald-500">{filteredConsoles.length}</span> UNITS & <span className="text-emerald-500">{filteredConsoles.reduce((acc, c) => acc + (c.variants?.length || 0), 0)}</span> VARIANTS
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10 self-end md:self-auto">
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

            {/* EXPANDABLE FILTERS */}
            <div className={`w-full bg-black/40 backdrop-blur-md relative z-40 border-y border-white/10 p-4 mb-8 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
                <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center justify-between flex-wrap">

                    {/* Manufacturer */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold uppercase text-white tracking-wider">Manufacturer</label>
                        <SwissDropdown
                            value={filters.manufacturer_id || ""}
                            onChange={(val) => setFilters({ ...filters, manufacturer_id: val || null })}
                            options={[{ label: "ALL ENTITIES", value: "" }, ...manufacturers.map(m => ({ label: m.name, value: m.id }))]}
                            labelPrefix="MANUFACTURER"
                            className="min-w-[200px]"
                        />
                        {/* Timeline */}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold uppercase text-white tracking-wider">Timeline</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                className="bg-transparent border-b border-white/20 text-white font-mono text-xs py-1 w-16 text-center focus:border-violet-500 outline-none"
                                value={filters.minYear}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, minYear: Number(e.target.value) })}
                            />
                            <span className="text-zinc-600">-</span>
                            <input
                                type="number"
                                className="bg-transparent border-b border-white/20 text-white font-mono text-xs py-1 w-16 text-center focus:border-violet-500 outline-none"
                                value={filters.maxYear}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, maxYear: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Form Factor Toggles */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold uppercase text-white tracking-wider">Form Factor</label>
                        <div className="flex gap-2">
                            {['Horizontal', 'Vertical', 'Clamshell'].map(ff => (
                                <button
                                    key={ff}
                                    onClick={() => toggleFilter('form_factors', ff)}
                                    className={`text-[10px] px-2 py-1 border transition-colors ${filters.form_factors.includes(ff)
                                            ? 'border-violet-500 text-violet-400 bg-violet-900/20'
                                            : 'border-white/10 text-zinc-500 hover:border-white/30'
                                        }`}
                                >
                                    {ff.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Screen Tech Toggles */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold uppercase text-white tracking-wider">Screen Tech</label>
                        <div className="flex gap-2">
                            {['OLED', 'IPS'].map(pt => (
                                <button
                                    key={pt}
                                    onClick={() => toggleFilter('panel_types', pt)}
                                    className={`text-[10px] px-2 py-1 border transition-colors ${filters.panel_types.includes(pt)
                                            ? 'border-emerald-500 text-emerald-400 bg-emerald-900/20'
                                            : 'border-white/10 text-zinc-500 hover:border-white/30'
                                        }`}
                                >
                                    {pt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reset */}
                    <button
                        onClick={() => setFilters({
                            minYear: 1980,
                            maxYear: new Date().getFullYear(),
                            generations: [],
                            form_factors: [],
                            panel_types: [],
                            manufacturer_id: null
                        })}
                        className="text-[10px] font-mono text-zinc-500 hover:text-white underline decoration-zinc-700 hover:decoration-white underline-offset-4"
                    >
                        RESET SIGNAL
                    </button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="px-6 md:px-12 py-8 max-w-[1800px] mx-auto min-h-[50vh]">
                {loading ? <RetroLoader /> : (
                    <>
                        {paginatedConsoles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                                <Search className="w-12 h-12 text-zinc-700 mb-4" />
                                <p className="font-mono text-zinc-500">NO SIGNAL DETECTED.</p>
                                <button onClick={() => setFilters({
                                    minYear: 1980,
                                    maxYear: new Date().getFullYear(),
                                    generations: [],
                                    form_factors: [],
                                    panel_types: [],
                                    manufacturer_id: null
                                })} className="mt-4 text-violet-400 hover:text-violet-300 text-xs font-mono uppercase underline">
                                    Reset Parameters
                                </button>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'swiss'
                                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                                    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                                }`}>
                                {paginatedConsoles.map((console) => {
                                    const specs: any = console.specs || {};
                                    const releaseDisplay = formatReleaseDate(specs.release_date, specs.release_date_precision) || 'TBA';

                                    if (viewMode === 'swiss') {
                                        // SWISS STYLE CARD
                                        return (
                                            <Link
                                                href={`/consoles/${console.slug}`}
                                                key={console.id}
                                                className="group relative flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 rounded-xl overflow-hidden"
                                            >
                                                <div className="aspect-square p-6 flex items-center justify-center relative bg-gradient-to-b from-transparent to-black/20">
                                                    {console.image_url ? (
                                                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                                                            <Image
                                                                src={console.image_url}
                                                                alt={console.name}
                                                                fill
                                                                className="object-contain drop-shadow-2xl"
                                                                sizes="(max-width: 768px) 50vw, 20vw"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="text-zinc-700 font-mono text-xs">NO VISUAL</div>
                                                    )}

                                                    {/* Status Indicator */}
                                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-colors"></div>
                                                </div>

                                                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{console.manufacturer?.name}</span>
                                                        <span className="text-[10px] font-mono text-zinc-600">{releaseDisplay.split(' ')[0]}</span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white leading-tight group-hover:text-violet-300 transition-colors truncate">
                                                        {console.name}
                                                    </h3>
                                                </div>
                                            </Link>
                                        );
                                    } else {
                                        // CLASSIC STYLE CARD (Updated for full width grid)
                                        return (
                                            <Link
                                                href={`/consoles/${console.slug}`}
                                                key={console.id}
                                                className="group block bg-black border border-zinc-800 hover:border-violet-500 transition-all relative overflow-hidden"
                                            >
                                                <div className="flex flex-row h-32">
                                                    <div className="w-1/3 bg-zinc-900/50 relative flex items-center justify-center p-2 border-r border-zinc-800">
                                                        {console.image_url ? (
                                                            <img src={console.image_url} alt={console.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                                                        ) : (
                                                            <span className="font-pixel text-zinc-700 text-xl">?</span>
                                                        )}
                                                    </div>
                                                    <div className="w-2/3 p-4 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-[10px] font-mono text-zinc-500 uppercase">{console.manufacturer?.name}</span>
                                                                {console.form_factor && (
                                                                    <span className={`text-[9px] px-1 border ${getFormFactorColor(console.form_factor)} opacity-70`}>
                                                                        {console.form_factor}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="font-bold text-lg text-white group-hover:text-violet-400 mt-1">{console.name}</h3>
                                                        </div>
                                                        <div className="flex justify-between items-end border-t border-zinc-800 pt-2 mt-2">
                                                            <span className="text-[10px] font-mono text-zinc-500">{releaseDisplay}</span>
                                                            <span className="text-[10px] text-violet-500 group-hover:underline">VIEW DATA &gt;</span>
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
                                <SwissButton
                                    variant="secondary"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="scale-75 origin-right"
                                >
                                    &lt; PREV
                                </SwissButton>

                                <div className="font-mono text-xs text-zinc-400 px-4 py-2">
                                    PAGE {page} / {totalPages}
                                </div>

                                <SwissButton
                                    variant="secondary"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="scale-75 origin-left"
                                >
                                    NEXT &gt;
                                </SwissButton>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ConsoleVaultClient;
