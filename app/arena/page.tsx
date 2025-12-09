
'use client';

import { useState, useEffect, useRef, type ChangeEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchConsoleList, fetchConsoleBySlug } from '../../lib/api';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { useSound } from '../../components/ui/SoundContext';

// --- TYPES & CONFIG ---

type ComparisonMetric = {
    key: keyof ConsoleVariant;
    label: string;
    type: 'number' | 'string' | 'boolean' | 'currency' | 'resolution';
    unit?: string;
    lowerIsBetter?: boolean;
    category?: string;
};

const METRICS: ComparisonMetric[] = [
    // IDENTITY
    { label: 'Release Year', key: 'release_year', type: 'number', category: 'Identity' },
    { label: 'Launch Price', key: 'price_launch_usd', type: 'currency', lowerIsBetter: true, category: 'Identity' },
    { label: 'Model No.', key: 'model_no', type: 'string', category: 'Identity' },

    // SILICON
    { label: 'CPU Model', key: 'cpu_model', type: 'string', category: 'Silicon' },
    { label: 'CPU Cores', key: 'cpu_cores', type: 'number', category: 'Silicon' },
    { label: 'CPU Clock', key: 'cpu_clock_mhz', type: 'number', unit: 'MHz', category: 'Silicon' },
    { label: 'Architecture', key: 'cpu_architecture', type: 'string', category: 'Silicon' },
    
    { label: 'GPU Model', key: 'gpu_model', type: 'string', category: 'Silicon' },
    { label: 'GPU Cores', key: 'gpu_cores', type: 'number', category: 'Silicon' },
    { label: 'Performance', key: 'gpu_teraflops', type: 'number', unit: 'TFLOPS', category: 'Silicon' },
    
    // MEMORY
    { label: 'RAM Size', key: 'ram_gb', type: 'number', unit: 'GB', category: 'Memory' },
    { label: 'RAM Type', key: 'ram_type', type: 'string', category: 'Memory' },
    { label: 'Storage', key: 'storage_gb', type: 'number', unit: 'GB', category: 'Memory' },

    // DISPLAY
    { label: 'Screen Size', key: 'screen_size_inch', type: 'number', unit: '"', category: 'Display' },
    { label: 'Resolution', key: 'screen_resolution_x', type: 'resolution', category: 'Display' },
    { label: 'Panel Type', key: 'display_type', type: 'string', category: 'Display' },
    { label: 'Refresh Rate', key: 'refresh_rate_hz', type: 'number', unit: 'Hz', category: 'Display' },
    { label: 'Pixel Density', key: 'ppi', type: 'number', unit: 'PPI', category: 'Display' },

    // POWER
    { label: 'Battery (Wh)', key: 'battery_wh', type: 'number', unit: 'Wh', category: 'Power' },
    { label: 'Battery (mAh)', key: 'battery_mah', type: 'number', unit: 'mAh', category: 'Power' },

    // PHYSICAL
    { label: 'Weight', key: 'weight_g', type: 'number', unit: 'g', lowerIsBetter: true, category: 'Physical' },
    { label: 'Material', key: 'body_material', type: 'string', category: 'Physical' },
];

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

// --- HELPER COMPONENTS ---

const ComparisonRow = ({ 
    metric, 
    varA, 
    varB,
    showDiffOnly
}: { 
    metric: ComparisonMetric, 
    varA: ConsoleVariant, 
    varB: ConsoleVariant, 
    showDiffOnly: boolean
}) => {
    const rawA = varA[metric.key];
    const rawB = varB[metric.key];

    const exists = (v: any) => v !== undefined && v !== null && v !== '';
    const hasA = exists(rawA);
    const hasB = exists(rawB);

    if (!hasA && !hasB) return null;
    if (showDiffOnly && rawA === rawB) return null;

    let winner: 'A' | 'B' | 'TIE' | null = null;

    if ((metric.type === 'number' || metric.type === 'currency' || metric.type === 'resolution') && hasA && hasB) {
        const numA = Number(rawA);
        const numB = Number(rawB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            if (numA !== numB) {
                if (metric.lowerIsBetter) {
                    winner = numA < numB ? 'A' : 'B';
                } else {
                    winner = numA > numB ? 'A' : 'B';
                }
            } else if (numA > 0) {
                winner = 'TIE';
            }
        }
    }

    const formatValue = (val: any) => {
        if (!exists(val)) return <span className="text-gray-700">---</span>;
        if (metric.type === 'boolean') return (val === true || val === 'true') ? 'YES' : 'NO';
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution' && varA.screen_resolution_y) return `${val}p`; 
        return `${val}${metric.unit ? metric.unit : ''}`;
    };

    const getResString = (v: ConsoleVariant) => {
        if (v.screen_resolution_x && v.screen_resolution_y) return `${v.screen_resolution_x} x ${v.screen_resolution_y}`;
        return '---';
    };

    const valDisplayA = metric.type === 'resolution' ? getResString(varA) : formatValue(rawA);
    const valDisplayB = metric.type === 'resolution' ? getResString(varB) : formatValue(rawB);

    const winClassA = "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] font-bold";
    const winClassB = "text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)] font-bold";
    const loseClass = "text-gray-400 opacity-80";
    const tieClass = "text-white";

    const classA = winner === 'A' ? winClassA : (winner === 'TIE' ? tieClass : loseClass);
    const classB = winner === 'B' ? winClassB : (winner === 'TIE' ? tieClass : loseClass);

    return (
        <div className="grid grid-cols-12 gap-2 py-3 border-b border-white/5 items-center hover:bg-white/5 transition-colors group">
            <div className={`col-span-4 text-right font-mono text-xs md:text-sm flex justify-end items-center gap-2 ${classA}`}>
                {winner === 'A' && <span className="text-[10px]">▲</span>}
                {valDisplayA}
            </div>
            <div className="col-span-4 text-center">
                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest group-hover:text-retro-blue transition-colors">
                    {metric.label}
                </span>
            </div>
            <div className={`col-span-4 text-left font-mono text-xs md:text-sm flex justify-start items-center gap-2 ${classB}`}>
                {valDisplayB}
                {winner === 'B' && <span className="text-[10px]">▲</span>}
            </div>
        </div>
    );
};

// --- DROPDOWN COMPONENTS ---

const ConsoleSearch = ({ 
    onSelect, 
    consoles,
    themeColor = 'cyan',
    currentSelection
}: { 
    onSelect: (slug: string, name: string) => void, 
    consoles: {name: string, slug: string}[],
    themeColor?: 'cyan' | 'pink',
    currentSelection?: string | null
}) => {
    const [query, setQuery] = useState(currentSelection || '');
    const [filtered, setFiltered] = useState<{name: string, slug: string}[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Styling configuration
    const styles = themeColor === 'cyan' ? {
        border: 'border-cyan-400',
        focusBorder: 'focus:border-cyan-400',
        text: 'text-cyan-400',
        hoverBg: 'hover:bg-cyan-900/30'
    } : {
        border: 'border-fuchsia-500',
        focusBorder: 'focus:border-fuchsia-500',
        text: 'text-fuchsia-500',
        hoverBg: 'hover:bg-fuchsia-900/30'
    };

    useEffect(() => {
        if (currentSelection) setQuery(currentSelection);
    }, [currentSelection]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 0) {
            const matches = consoles.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 10);
            setFiltered(matches);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (slug: string, name: string) => {
        setQuery(name);
        setIsOpen(false);
        onSelect(slug, name);
    };

    return (
        <div className="relative w-full z-50" ref={wrapperRef}>
            <input 
                type="text" 
                placeholder="TYPE CONSOLE..."
                className={`w-full bg-black/80 border ${styles.border} ${styles.focusBorder} p-2 font-mono text-sm text-white placeholder-gray-500 outline-none uppercase transition-all shadow-inner`}
                value={query}
                onChange={handleSearch}
                onFocus={() => { if(query.length > 0) setIsOpen(true); }}
            />
            {isOpen && filtered.length > 0 && (
                <ul className={`absolute top-full left-0 right-0 bg-black border-l border-r border-b ${styles.border} z-[100] max-h-48 overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.9)]`}>
                    {filtered.map(c => (
                        <li key={c.slug}>
                            <button 
                                type="button"
                                onClick={() => handleSelect(c.slug, c.name)}
                                className={`w-full text-left p-3 font-mono text-xs text-gray-300 ${styles.hoverBg} border-b border-gray-900 last:border-0 uppercase flex justify-between group transition-colors`}
                            >
                                <span className="group-hover:text-white font-bold">{c.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const VariantSelect = ({
    variants,
    selectedId,
    onSelect,
    themeColor = 'cyan'
}: {
    variants: ConsoleVariant[],
    selectedId: string | null,
    onSelect: (id: string) => void,
    themeColor?: 'cyan' | 'pink'
}) => {
    if (variants.length <= 1) return null;

    const styles = themeColor === 'cyan' ? {
        border: 'border-cyan-400',
        text: 'text-cyan-400',
        bg: 'bg-cyan-900/10'
    } : {
        border: 'border-fuchsia-500',
        text: 'text-fuchsia-500',
        bg: 'bg-fuchsia-900/10'
    };

    return (
        <select
            value={selectedId || ''}
            onChange={(e) => onSelect(e.target.value)}
            className={`w-full bg-black border ${styles.border} ${styles.text} p-2 font-mono text-[10px] md:text-xs outline-none cursor-pointer uppercase mt-2 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        >
            {variants.map(v => (
                <option key={v.id} value={v.id}>
                    {v.variant_name} {v.is_default ? '(DEFAULT)' : ''}
                </option>
            ))}
        </select>
    );
};

// --- MAIN PAGE CONTENT ---

function ArenaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playClick } = useSound();

    const [allConsoles, setAllConsoles] = useState<{name: string, slug: string}[]>([]);
    
    // State initialization helper
    const getInitialState = (paramKey: string): SelectionState => ({
        slug: searchParams?.get(paramKey) || null,
        details: null,
        selectedVariant: null,
        loading: false
    });

    const [left, setLeft] = useState<SelectionState>(() => getInitialState('a'));
    const [right, setRight] = useState<SelectionState>(() => getInitialState('b'));
    const [showDiffOnly, setShowDiffOnly] = useState(false);

    // Load console list once
    useEffect(() => {
        fetchConsoleList().then(list => setAllConsoles(list as any));
    }, []);

    // Load Left/Right logic (refactored to avoid repetition)
    const loadSide = async (side: 'a' | 'b', current: SelectionState, setter: Function) => {
        const slug = searchParams?.get(side);
        const variantSlug = searchParams?.get(side === 'a' ? 'varA' : 'varB');
        
        if (slug && slug !== current.details?.slug) {
            setter((prev: any) => ({ ...prev, loading: true, slug }));
            const details = await fetchConsoleBySlug(slug);
            if (details) {
                const variants = details.variants || [];
                const activeVar = variantSlug 
                    ? variants.find(v => v.slug === variantSlug)
                    : (variants.find(v => v.is_default) || variants[0]);

                setter({
                    slug,
                    details,
                    selectedVariant: activeVar || null,
                    loading: false
                });
            } else {
                setter((prev: any) => ({ ...prev, loading: false }));
            }
        }
    };

    useEffect(() => { loadSide('a', left, setLeft); }, [searchParams?.get('a')]);
    useEffect(() => { loadSide('b', right, setRight); }, [searchParams?.get('b')]);

    // Handle variant changes without reloading console
    useEffect(() => {
        const varA = searchParams?.get('varA');
        if (left.details && varA && left.selectedVariant?.slug !== varA) {
            const v = left.details.variants?.find(v => v.slug === varA);
            if(v) setLeft(prev => ({ ...prev, selectedVariant: v }));
        }
        
        const varB = searchParams?.get('varB');
        if (right.details && varB && right.selectedVariant?.slug !== varB) {
            const v = right.details.variants?.find(v => v.slug === varB);
            if(v) setRight(prev => ({ ...prev, selectedVariant: v }));
        }
    }, [searchParams, left.details, right.details]);

    // Update URL Helper
    const updateUrl = (side: 'a' | 'b', slug: string, variantSlug?: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set(side, slug);
        // Reset variant when changing console unless specified
        params.delete(side === 'a' ? 'varA' : 'varB'); 
        if(variantSlug) params.set(side === 'a' ? 'varA' : 'varB', variantSlug);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSelect = (side: 'a' | 'b', slug: string, name: string) => {
        playClick();
        updateUrl(side, slug);
    };

    const handleVariantSelect = (side: 'a' | 'b', variantId: string) => {
        const state = side === 'a' ? left : right;
        const variant = state.details?.variants?.find(v => v.id === variantId);
        if (variant && variant.slug) {
            const params = new URLSearchParams(searchParams?.toString());
            params.set(side === 'a' ? 'varA' : 'varB', variant.slug);
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    };

    const resetBattle = () => router.push('/arena');

    return (
        <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
            
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="font-pixel text-2xl md:text-3xl text-gray-500 mb-2">SELECT YOUR FIGHTERS</h1>
            </div>

            {/* BATTLE STAGE: THE RHOMBUS LAYOUT */}
            <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-0 mt-8 mb-16 min-h-[450px]">

                {/* VS Badge (Absolute Center) */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
                    <div className="font-pixel text-4xl md:text-8xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-pulse italic transform -skew-x-12">
                        VS
                    </div>
                </div>

                {/* Mobile VS Badge */}
                <div className="md:hidden text-center font-pixel text-4xl text-white animate-pulse mb-4">VS</div>

                {/* PLAYER 1 (LEFT) - Slanted / */}
                {/* Outer container applies the skew shape (-skew-x-6 -> /) */}
                <div className="w-full md:w-1/2 relative z-10 focus-within:z-50 transition-all duration-300 md:pr-12">
                    <div className="h-full transform md:-skew-x-6 border-4 border-cyan-400 bg-black shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] transition-all overflow-visible flex flex-col relative group">
                        
                        {/* Glow Overlay */}
                        <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none group-hover:bg-cyan-400/10 transition-colors"></div>

                        {/* Content Wrapper (Counter-skew to keep text straight) */}
                        <div className="transform md:skew-x-6 p-8 md:p-12 flex flex-col h-full items-center text-center relative z-10">
                            <h2 className="font-pixel text-2xl md:text-3xl text-cyan-400 mb-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">PLAYER 1</h2>

                            {/* Search Input */}
                            <div className="w-full mb-6 relative">
                                <ConsoleSearch 
                                    consoles={allConsoles}
                                    onSelect={(slug, name) => handleSelect('a', slug, name)}
                                    themeColor="cyan"
                                    currentSelection={left.details?.name}
                                />
                            </div>

                            {/* Image Stage */}
                            <div className="flex-1 w-full flex items-center justify-center my-6 min-h-[180px] relative">
                                {left.details ? (
                                    <div className="relative w-full h-full flex items-center justify-center animate-fadeIn">
                                        <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full opacity-50"></div>
                                        <img 
                                            src={left.selectedVariant?.image_url || left.details.image_url} 
                                            className="max-w-full max-h-[200px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10 hover:scale-105 transition-transform duration-300" 
                                            alt="Player 1"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center opacity-30 select-none">
                                        <div className="font-pixel text-6xl text-cyan-400 mb-2">?</div>
                                        <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest">SELECT SYSTEM</div>
                                    </div>
                                )}
                            </div>

                            {/* Variant Selector */}
                            {left.details && (
                                <div className="w-full mt-auto border-t border-cyan-400/30 pt-4">
                                    <div className="text-[10px] font-mono text-cyan-400 mb-1 uppercase tracking-widest text-left">
                                        Hardware Spec
                                    </div>
                                    <VariantSelect 
                                        variants={left.details.variants || []}
                                        selectedId={left.selectedVariant?.id || null}
                                        onSelect={(id) => handleVariantSelect('a', id)}
                                        themeColor="cyan"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PLAYER 2 (RIGHT) - Slanted \ */}
                {/* Outer container applies the skew shape (skew-x-6 -> \) */}
                <div className="w-full md:w-1/2 relative z-10 focus-within:z-50 transition-all duration-300 md:pl-12">
                     <div className="h-full transform md:skew-x-6 border-4 border-fuchsia-500 bg-black shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:shadow-[0_0_50px_rgba(217,70,239,0.3)] transition-all overflow-visible flex flex-col relative group">
                        
                        {/* Glow Overlay */}
                        <div className="absolute inset-0 bg-fuchsia-500/5 pointer-events-none group-hover:bg-fuchsia-500/10 transition-colors"></div>

                        {/* Content Wrapper (Counter-skew) */}
                        <div className="transform md:-skew-x-6 p-8 md:p-12 flex flex-col h-full items-center text-center relative z-10">
                            <h2 className="font-pixel text-2xl md:text-3xl text-fuchsia-500 mb-8 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]">PLAYER 2</h2>
                            
                            {/* Search Input */}
                            <div className="w-full mb-6 relative">
                                <ConsoleSearch 
                                    consoles={allConsoles}
                                    onSelect={(slug, name) => handleSelect('b', slug, name)}
                                    themeColor="pink"
                                    currentSelection={right.details?.name}
                                />
                            </div>

                            {/* Image Stage */}
                             <div className="flex-1 w-full flex items-center justify-center my-6 min-h-[180px] relative">
                                {right.details ? (
                                    <div className="relative w-full h-full flex items-center justify-center animate-fadeIn">
                                        <div className="absolute inset-0 bg-fuchsia-500/20 blur-2xl rounded-full opacity-50"></div>
                                        <img 
                                            src={right.selectedVariant?.image_url || right.details.image_url} 
                                            className="max-w-full max-h-[200px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10 hover:scale-105 transition-transform duration-300" 
                                            alt="Player 2"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center opacity-30 select-none">
                                        <div className="font-pixel text-6xl text-fuchsia-500 mb-2">?</div>
                                        <div className="font-mono text-xs text-fuchsia-500 uppercase tracking-widest">SELECT SYSTEM</div>
                                    </div>
                                )}
                            </div>

                            {/* Variant Selector */}
                            {right.details && (
                                <div className="w-full mt-auto border-t border-fuchsia-500/30 pt-4">
                                    <div className="text-[10px] font-mono text-fuchsia-500 mb-1 uppercase tracking-widest text-left">
                                        Hardware Spec
                                    </div>
                                    <VariantSelect 
                                        variants={right.details.variants || []}
                                        selectedId={right.selectedVariant?.id || null}
                                        onSelect={(id) => handleVariantSelect('b', id)}
                                        themeColor="pink"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* FIGHT BUTTON */}
            {(left.details || right.details) && (
                <div className="flex justify-center mb-12 animate-fadeIn">
                    <button 
                        onClick={resetBattle}
                        className="font-pixel text-xs bg-red-600 text-white px-8 py-3 hover:bg-red-500 border-2 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all uppercase tracking-widest"
                    >
                        RESET MATCH
                    </button>
                </div>
            )}
            
            {/* BATTLE REPORT (Comparison Table) */}
            {left.selectedVariant && right.selectedVariant && (
                <div className="animate-slideDown border-2 border-white/20 bg-black/80 backdrop-blur-md shadow-2xl relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500"></div>
                    
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-pixel text-sm md:text-lg text-white">BATTLE REPORT</h3>
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-mono text-gray-400 uppercase cursor-pointer">Diff Only</label>
                            <input 
                                type="checkbox" 
                                checked={showDiffOnly}
                                onChange={(e) => setShowDiffOnly(e.target.checked)}
                                className="accent-retro-neon"
                            />
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        {/* Headers */}
                        <div className="grid grid-cols-12 gap-2 mb-6 font-pixel text-xs md:text-sm text-gray-500 uppercase border-b border-white/10 pb-2">
                            <div className="col-span-4 text-right text-cyan-400 truncate pr-2">{left.details?.name}</div>
                            <div className="col-span-4 text-center">Metric</div>
                            <div className="col-span-4 text-left text-fuchsia-500 truncate pl-2">{right.details?.name}</div>
                        </div>

                        {/* Categories */}
                        {['Identity', 'Silicon', 'Memory', 'Display', 'Power', 'Physical'].map(cat => {
                            const catMetrics = METRICS.filter(m => m.category === cat);
                            // Only show category if it has visible rows
                            const hasVisibleRows = catMetrics.some(m => {
                                const vA = left.selectedVariant?.[m.key];
                                const vB = right.selectedVariant?.[m.key];
                                if (!vA && !vB) return false;
                                if (showDiffOnly && vA === vB) return false;
                                return true;
                            });

                            if (!hasVisibleRows) return null;

                            return (
                                <div key={cat} className="mb-8">
                                    <div className="text-[10px] font-mono text-retro-neon uppercase tracking-widest mb-3 pl-2 border-l-2 border-retro-neon opacity-70">
                                        {cat}
                                    </div>
                                    <div className="space-y-1">
                                        {catMetrics.map(metric => (
                                            <ComparisonRow 
                                                key={metric.key} 
                                                metric={metric} 
                                                varA={left.selectedVariant!} 
                                                varB={right.selectedVariant!}
                                                showDiffOnly={showDiffOnly}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-pixel text-white">LOADING ARENA...</div>}>
            <ArenaContent />
        </Suspense>
    );
}
