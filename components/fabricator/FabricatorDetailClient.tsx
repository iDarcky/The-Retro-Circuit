'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails, Manufacturer, ConsoleFilterState } from '../../lib/types';
import AdminEditTrigger from '../admin/AdminEditTrigger';
import { hexToRgb } from '../../lib/utils/colors';
import { formatReleaseDate } from '../../lib/utils/date-formatter';
import { SwissHeader } from '../ui/SwissHeader';
import { LayoutGrid, List, Search, SlidersHorizontal, Globe, MapPin, Calendar, HardDrive } from 'lucide-react';
import { SwissDropdown } from '../ui/SwissDropdown';
import SwissButton from '@/components/console/swiss/SwissButton';

interface Props {
    profile: Manufacturer;
    consoles: ConsoleDetails[];
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

export default function FabricatorDetailClient({ profile, consoles }: Props) {
    // --- COLOR & THEME SETUP ---
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

    // --- STATE ---
    const [filteredConsoles, setFilteredConsoles] = useState<ConsoleDetails[]>(consoles);

    // View Mode State
    const [viewMode, setViewMode] = useState<'swiss' | 'classic'>('swiss');
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOption>('release_desc');

    // Pagination State
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = viewMode === 'swiss' ? 24 : 12;

    // Filter State
    const [filters, setFilters] = useState<ConsoleFilterState>({
        minYear: 1980,
        maxYear: new Date().getFullYear(),
        generations: [],
        form_factors: [],
        manufacturer_id: null,
        panel_types: []
    });

    // --- EFFECTS ---

    // Scroll to top on page change
    useEffect(() => {
        // Only scroll if we are not at the top to avoid jarring jumps on initial load if navigated to anchor
        // The shell scrolls an inner div, so window.scrollTo is a no-op here.
        const root = document.querySelector<HTMLElement>('[data-scroll-root]');
        if (root && root.scrollTop > 500) root.scrollTo({ top: 500, behavior: 'smooth' });
        else if (!root && window.scrollY > 500) window.scrollTo({ top: 500, behavior: 'smooth' });
    }, [page]);

    // Filter & Sort Logic
    useEffect(() => {
        let result = [...consoles];

        // 1. Timeline Filter
        result = result.filter(c => {
            let year = 9999;
            const specs: any = c.specs || {};
            if (specs.release_date) {
                const dateYear = parseInt(specs.release_date.substring(0, 4));
                if (!isNaN(dateYear)) year = dateYear;
            }
            if (year === 9999) return true; // Keep TBA/Unknown dates
            return year >= filters.minYear && year <= filters.maxYear;
        });

        // 2. Form Factor Filter
        if (filters.form_factors.length > 0) {
            result = result.filter(c => {
                if (!c.form_factor) return false;
                return filters.form_factors.some(ff => c.form_factor?.toLowerCase() === ff.toLowerCase());
            });
        }

        // 3. Panel Type Filter
        if (filters.panel_types.length > 0) {
            result = result.filter(c => {
                const variants = c.variants || [];
                return variants.some(v => {
                    const displayType = (v.display_type || '').toLowerCase();
                    return filters.panel_types.some(pt => displayType.includes(pt.toLowerCase()));
                });
            });
        }

        // 4. Sorting
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
                    if (pA === 999999) return 1;
                    if (pB === 999999) return -1;
                    return pB - pA;
                default:
                    return 0;
            }
        });

        setFilteredConsoles(result);
        setPage(1); // Reset to page 1 on filter change
    }, [filters, consoles, sortOrder]);

    // --- HELPERS ---

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

    // --- PAGINATION DATA ---
    const totalPages = Math.ceil(filteredConsoles.length / ITEMS_PER_PAGE);
    const paginatedConsoles = filteredConsoles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-32 animate-[fadeIn_0.5s_ease-in-out]" style={cssVars}>

            {/* --- HEADER --- */}
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
                subtitle=""
                borderColor={brandColor}
            />

            {/* --- INTRO SECTION (Swapped Layout) --- */}
            <div className="max-w-[1800px] mx-auto p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12 items-start">

                    {/* Left: Brand Identity & Stats (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">

                        {/* Logo Container */}
                        <div className="w-full aspect-video bg-black/40 border-t border-b border-[var(--brand-color)] flex items-center justify-center p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-color)]/10 to-transparent opacity-50"></div>
                            {profile.image_url ? (
                                // Light plate so solid-black brand logos stay visible on the dark hero
                                <div className="relative z-10 w-[80%] h-[80%] bg-white/90 rounded-sm p-4">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={profile.image_url}
                                            alt={profile.name}
                                            fill
                                            sizes="(max-width: 1024px) 90vw, 30vw"
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className="font-pixel text-4xl text-white/20">?</span>
                            )}
                        </div>

                        {/* Stats Data */}
                        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                            <div className="bg-[#09090b] p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2"><MapPin size={10} /> Origin</span>
                                <span className="text-sm font-mono text-zinc-200">{profile.country || 'N/A'}</span>
                            </div>
                            <div className="bg-[#09090b] p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={10} /> Est.</span>
                                <span className="text-sm font-mono text-zinc-200">{profile.founded_year || 'N/A'}</span>
                            </div>
                            <div className="bg-[#09090b] p-4 flex items-center justify-between col-span-2">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2"><HardDrive size={10} /> Hardware Output</span>
                                <span className="text-xl font-pixel text-[var(--brand-color)]">{consoles.length}</span>
                            </div>
                        </div>

                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                className="w-full py-4 bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs uppercase hover:bg-[var(--brand-color)] hover:text-black hover:border-[var(--brand-color)] transition-all flex items-center justify-between px-6 group"
                            >
                                <span>Official Frequency</span>
                                <Globe size={14} className="opacity-50 group-hover:opacity-100" />
                            </a>
                        )}

                        {/* KEY DEVICES */}
                        {consoles.some(c => c.is_featured) && (
                            <div className="flex flex-col gap-4 mt-4">
                                <h3 className="font-pixel text-lg text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[var(--brand-color)] shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]"></span>
                                    KEY DEVICES
                                </h3>
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                                    {consoles.filter(c => c.is_featured).slice(0, 3).map(consoleItem => {
                                        let imageUrl = consoleItem.image_url;
                                        if (!imageUrl && consoleItem.variants && consoleItem.variants.length > 0) {
                                            const defaultVar = consoleItem.variants.find(v => v.is_default) || consoleItem.variants[0];
                                            imageUrl = defaultVar?.image_url;
                                        }

                                        let price = 0;
                                        if (consoleItem.variants && consoleItem.variants.length > 0) {
                                            const defaultVar = consoleItem.variants.find(v => v.is_default) || consoleItem.variants[0];
                                            price = defaultVar?.price_launch_usd || 0;
                                        } else {
                                            price = consoleItem.specs?.price_launch_usd || 0;
                                        }

                                        return (
                                            <Link href={`/consoles/${consoleItem.slug}`} key={consoleItem.id} className="group border border-white/10 bg-black/40 p-3 hover:border-[var(--brand-color)] hover:bg-white/[0.02] transition-colors flex flex-col">
                                                <div className="aspect-video bg-white/5 border border-white/5 mb-3 p-2 flex items-center justify-center relative overflow-hidden group-hover:bg-white/10 transition-colors">
                                                    {imageUrl ? (
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={imageUrl.startsWith('http') ? imageUrl : `/${imageUrl.replace(/^\//, '')}`}
                                                                alt={consoleItem.name}
                                                                fill
                                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                                className="object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="font-pixel text-zinc-600">?</span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-white text-xs truncate group-hover:text-[var(--brand-color)] transition-colors">{consoleItem.name}</h4>
                                                <div className="flex justify-between items-center mt-1 pt-2 border-t border-white/5">
                                                    <span className="font-mono text-[10px] text-zinc-500">{consoleItem.form_factor || 'UNKNOWN'}</span>
                                                    <span className="font-mono text-[10px] text-[var(--brand-color)]">{price ? `$${price}` : 'N/A'}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Narrative (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col justify-start gap-8 lg:pt-4">
                        <div className="relative">
                            {/* Decorative Line */}
                            <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--brand-color)] to-transparent opacity-50 hidden lg:block"></div>

                            <h2 className="text-3xl md:text-5xl font-pixel text-white leading-tight uppercase mb-8 tracking-tight">
                                {profile.description ? profile.description.split('.')[0] + '.' : `The archives for ${profile.name} are currently classified.`}
                            </h2>

                            {profile.description && profile.description.split('.').length > 1 && (
                                <div className="text-lg md:text-xl font-mono text-zinc-400 leading-relaxed space-y-6">
                                    <p>{profile.description.split('.').slice(1).join('.').trim()}</p>
                                </div>
                            )}

                            {/* KNOWN FOR & WHO IT'S FOR */}
                            {(profile.known_for?.length || profile.who_its_for) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-8">
                                    {/* 1. KNOWN FOR */}
                                    {profile.known_for && profile.known_for.length > 0 && (
                                        <div className="flex flex-col gap-4">
                                            <h3 className="font-pixel text-lg text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[var(--brand-color)] shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]"></span>
                                                KNOWN FOR
                                            </h3>
                                            <ul className="space-y-3 font-mono text-sm text-zinc-400">
                                                {profile.known_for.map((item, idx) => (
                                                    <li key={idx} className="flex gap-3 leading-relaxed">
                                                        <span className="text-[var(--brand-color)] font-bold opacity-75 mt-0.5">›</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 2. WHO IT'S FOR */}
                                    {profile.who_its_for && (
                                        <div className="flex flex-col gap-4">
                                            <h3 className="font-pixel text-lg text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[var(--brand-color)] shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]"></span>
                                                WHO IT&apos;S FOR
                                            </h3>
                                            <div className="font-mono text-sm leading-relaxed text-zinc-400 bg-white/[0.02] p-4 border border-white/5 border-l-2 border-l-[var(--brand-color)]">
                                                {profile.who_its_for}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* --- CONTROLS BAR (Sticky) --- */}
            <div className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-y border-white/10 px-6 md:px-12 py-4">
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

                            <SwissDropdown
                                value={sortOrder}
                                onChange={setSortOrder}
                                options={SORT_OPTIONS}
                            />
                        </div>

                        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <span className="text-[var(--brand-color)]">{filteredConsoles.length}</span> UNITS FOUND
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10 self-end md:self-auto">
                        <button
                            onClick={() => { setViewMode('swiss'); setPage(1); }}
                            className={`p-2 rounded transition-colors ${viewMode === 'swiss' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                            title="Grid View"
                            aria-label="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => { setViewMode('classic'); setPage(1); }}
                            className={`p-2 rounded transition-colors ${viewMode === 'classic' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                            title="List View"
                            aria-label="List View"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- EXPANDABLE FILTERS --- */}
            <div className={`w-full bg-black/40 backdrop-blur-md border-b border-white/10 p-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
                {/* ... existing filter content ... */}
                <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center justify-between flex-wrap">

                    {/* Timeline */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold uppercase text-white tracking-wider">Timeline</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                className="bg-transparent border-b border-white/20 text-white font-mono text-xs py-1 w-16 text-center focus:border-[var(--brand-color)] outline-none"
                                value={filters.minYear}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, minYear: Number(e.target.value) })}
                            />
                            <span className="text-zinc-600">-</span>
                            <input
                                type="number"
                                className="bg-transparent border-b border-white/20 text-white font-mono text-xs py-1 w-16 text-center focus:border-[var(--brand-color)] outline-none"
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
                                        ? 'border-[var(--brand-color)] text-[var(--brand-color)] bg-[rgba(var(--brand-rgb),0.1)]'
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
                                        ? 'border-[var(--brand-color)] text-[var(--brand-color)] bg-[rgba(var(--brand-rgb),0.1)]'
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

            {/* --- MAIN GRID --- */}
            <div className="px-6 md:px-12 py-12 max-w-[1800px] mx-auto min-h-[50vh]">
                {paginatedConsoles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                        <Search className="w-12 h-12 text-zinc-700 mb-4" />
                        <p className="font-mono text-zinc-500">NO UNITS FOUND IN ARCHIVE.</p>
                        <button onClick={() => setFilters({
                            minYear: 1980,
                            maxYear: new Date().getFullYear(),
                            generations: [],
                            form_factors: [],
                            panel_types: [],
                            manufacturer_id: null
                        })} className="mt-4 text-[var(--brand-color)] hover:text-white text-xs font-mono uppercase underline">
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
                                // SWISS STYLE CARD (Manufacturer Themed)
                                return (
                                    <Link
                                        href={`/consoles/${console.slug}`}
                                        key={console.id}
                                        className="group relative flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-[var(--brand-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[0_0_15px_rgba(var(--brand-rgb),0.1)] rounded-xl overflow-hidden"
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
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{console.generation || 'UNKNOWN GEN'}</span>
                                                <span className="text-[10px] font-mono text-zinc-600">{releaseDisplay.split(' ')[0]}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-[var(--brand-color)] transition-colors truncate">
                                                {console.name}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            } else {
                                // CLASSIC STYLE CARD (Manufacturer Themed)
                                return (
                                    <Link
                                        href={`/consoles/${console.slug}`}
                                        key={console.id}
                                        className="group block bg-black border border-zinc-800 hover:border-[var(--brand-color)] transition-all relative overflow-hidden"
                                    >
                                        <div className="flex flex-row h-32">
                                            <div className="w-1/3 bg-zinc-900/50 relative flex items-center justify-center p-2 border-r border-zinc-800">
                                                {console.image_url ? (
                                                    <div className="relative w-full h-full">
                                                        <Image src={console.image_url} alt={console.name} fill sizes="(max-width: 768px) 33vw, 15vw" className="object-contain group-hover:scale-105 transition-transform" />
                                                    </div>
                                                ) : (
                                                    <span className="font-pixel text-zinc-700 text-xl">?</span>
                                                )}
                                            </div>
                                            <div className="w-2/3 p-4 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{console.generation || 'GEN ?'}</span>
                                                        {console.form_factor && (
                                                            <span className={`text-[9px] px-1 border ${getFormFactorColor(console.form_factor)} opacity-70`}>
                                                                {console.form_factor}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-lg text-white group-hover:text-[var(--brand-color)] mt-1">{console.name}</h3>
                                                </div>
                                                <div className="flex justify-between items-end border-t border-zinc-800 pt-2 mt-2">
                                                    <span className="text-[10px] font-mono text-zinc-500">{releaseDisplay}</span>
                                                    <span className="text-[10px] text-[var(--brand-color)] group-hover:underline">VIEW DATA &gt;</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }
                        })}
                    </div>
                )}

                {/* --- PAGINATION --- */}
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
            </div>
        </div>
    );
}
