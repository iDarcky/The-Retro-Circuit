
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
    { label: 'Process Node', key: 'cpu_process_node', type: 'string', category: 'Silicon' },
    
    { label: 'GPU Model', key: 'gpu_model', type: 'string', category: 'Silicon' },
    { label: 'GPU Cores', key: 'gpu_cores', type: 'number', category: 'Silicon' },
    { label: 'GPU Unit', key: 'gpu_core_unit', type: 'string', category: 'Silicon' },
    { label: 'GPU Clock', key: 'gpu_clock_mhz', type: 'number', unit: 'MHz', category: 'Silicon' },
    { label: 'Performance', key: 'gpu_teraflops', type: 'number', unit: 'TFLOPS', category: 'Silicon' },
    { label: 'OS', key: 'os', type: 'string', category: 'Silicon' },

    // MEMORY
    { label: 'RAM Size', key: 'ram_gb', type: 'number', unit: 'GB', category: 'Memory' },
    { label: 'RAM Type', key: 'ram_type', type: 'string', category: 'Memory' },
    { label: 'RAM Speed', key: 'ram_speed_mhz', type: 'number', unit: 'MHz', category: 'Memory' },
    { label: 'Storage', key: 'storage_gb', type: 'number', unit: 'GB', category: 'Memory' },
    { label: 'Storage Type', key: 'storage_type', type: 'string', category: 'Memory' },
    { label: 'Expandable?', key: 'storage_expandable', type: 'boolean', category: 'Memory' },

    // DISPLAY
    { label: 'Screen Size', key: 'screen_size_inch', type: 'number', unit: '"', category: 'Display' },
    { label: 'Resolution', key: 'screen_resolution_x', type: 'resolution', category: 'Display' },
    { label: 'Panel Type', key: 'display_type', type: 'string', category: 'Display' },
    { label: 'Refresh Rate', key: 'refresh_rate_hz', type: 'number', unit: 'Hz', category: 'Display' },
    { label: 'Pixel Density', key: 'ppi', type: 'number', unit: 'PPI', category: 'Display' },
    { label: 'Aspect Ratio', key: 'aspect_ratio', type: 'string', category: 'Display' },
    { label: 'Touchscreen', key: 'touchscreen', type: 'boolean', category: 'Display' },
    { label: 'Brightness', key: 'brightness_nits', type: 'number', unit: 'nits', category: 'Display' },
    { label: 'Display Tech', key: 'display_tech', type: 'string', category: 'Display' },

    // CONTROLS
    { label: 'Input Layout', key: 'input_layout', type: 'string', category: 'Controls' },
    { label: 'D-Pad', key: 'dpad_type', type: 'string', category: 'Controls' },
    { label: 'Stick Type', key: 'analog_stick_type', type: 'string', category: 'Controls' },
    { label: 'Triggers', key: 'trigger_mechanism', type: 'string', category: 'Controls' },
    { label: 'Back Buttons', key: 'has_back_buttons', type: 'boolean', category: 'Controls' },
    { label: 'Haptics', key: 'haptics', type: 'string', category: 'Controls' },
    { label: 'Gyro', key: 'gyro', type: 'boolean', category: 'Controls' },

    // CONNECTIVITY
    { label: 'Wireless', key: 'wireless_connectivity', type: 'string', category: 'Connectivity' },
    { label: 'Ports', key: 'ports', type: 'string', category: 'Connectivity' },
    { label: 'Video Out', key: 'video_out', type: 'string', category: 'Connectivity' },
    { label: 'Charging Port', key: 'charging_port', type: 'string', category: 'Connectivity' },

    // MULTIMEDIA
    { label: 'Speakers', key: 'audio_speakers', type: 'string', category: 'Multimedia' },
    { label: 'Audio Tech', key: 'audio_tech', type: 'string', category: 'Multimedia' },
    { label: 'Headphone Jack', key: 'headphone_jack', type: 'boolean', category: 'Multimedia' },
    { label: 'Mic', key: 'microphone', type: 'boolean', category: 'Multimedia' },

    // POWER
    { label: 'Battery (mAh)', key: 'battery_mah', type: 'number', unit: 'mAh', category: 'Power' },
    { label: 'Battery (Wh)', key: 'battery_wh', type: 'number', unit: 'Wh', category: 'Power' },
    { label: 'Charging Speed', key: 'charging_speed_w', type: 'number', unit: 'W', category: 'Power' },

    // PHYSICAL
    { label: 'Dimensions', key: 'dimensions', type: 'string', category: 'Physical' },
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

    // Helper: Is the value present?
    const exists = (v: any) => v !== undefined && v !== null && v !== '';
    
    const hasA = exists(rawA);
    const hasB = exists(rawB);

    // SMART HIDE: If both are missing, hide the row
    if (!hasA && !hasB) return null;

    // DIFFERENCE FILTER: If enabled, and values are identical, hide the row
    if (showDiffOnly && rawA === rawB) return null;

    let winner: 'A' | 'B' | 'TIE' | null = null;

    // --- COMPARISON LOGIC ---
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
    } else if (metric.type === 'boolean' && hasA && hasB) {
        const boolA = rawA === true || rawA === 'true';
        const boolB = rawB === true || rawB === 'true';
        if (boolA && !boolB) winner = 'A';
        if (!boolA && boolB) winner = 'B';
        if (boolA === boolB) winner = 'TIE';
    }

    // --- RENDER HELPERS ---
    const formatValue = (val: any) => {
        if (!exists(val)) return <span className="text-gray-700">---</span>;
        
        if (metric.type === 'boolean') {
            return (val === true || val === 'true') ? 'YES' : 'NO';
        }
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution' && varA.screen_resolution_y) {
             return `${val}p`; 
        }
        if (metric.type === 'resolution') {
            return val;
        }

        return `${val}${metric.unit ? metric.unit : ''}`;
    };

    // Special Resolution Handler to combine X and Y
    const getResString = (v: ConsoleVariant) => {
        if (v.screen_resolution_x && v.screen_resolution_y) {
            return `${v.screen_resolution_x} x ${v.screen_resolution_y}`;
        }
        return '---';
    };

    const valDisplayA = metric.type === 'resolution' ? getResString(varA) : formatValue(rawA);
    const valDisplayB = metric.type === 'resolution' ? getResString(varB) : formatValue(rawB);

    // Winner Classes
    // Player 1 (Left) is Cyan, Player 2 (Right) is Pink
    const winClassA = "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] font-bold";
    const winClassB = "text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)] font-bold";
    const loseClass = "text-gray-400 opacity-80";
    const tieClass = "text-white";

    const classA = winner === 'A' ? winClassA : (winner === 'TIE' ? tieClass : loseClass);
    const classB = winner === 'B' ? winClassB : (winner === 'TIE' ? tieClass : loseClass);

    return (
        <div className="grid grid-cols-12 gap-2 py-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors group">
            <div className={`col-span-4 text-right font-mono text-sm md:text-base flex justify-end items-center gap-2 ${classA}`}>
                {winner === 'A' && <span className="text-xs transform rotate-90 md:rotate-0">▲</span>}
                {valDisplayA}
            </div>
            
            <div className="col-span-4 text-center">
                <span className="font-mono text-[10px] md:text-xs text-gray-500 uppercase tracking-widest group-hover:text-retro-blue transition-colors">
                    {metric.label}
                </span>
            </div>
            
            <div className={`col-span-4 text-left font-mono text-sm md:text-base flex justify-start items-center gap-2 ${classB}`}>
                {valDisplayB}
                {winner === 'B' && <span className="text-xs transform rotate-90 md:rotate-0">▲</span>}
            </div>
        </div>
    );
};

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
    const inputRef = useRef<HTMLInputElement>(null);

    const borderColor = themeColor === 'cyan' ? 'border-cyan-400 focus:border-cyan-400' : 'border-fuchsia-500 focus:border-fuchsia-500';
    const textColor = themeColor === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-500';
    const hoverBg = themeColor === 'cyan' ? 'hover:bg-cyan-900/30' : 'hover:bg-fuchsia-900/30';

    // Update query when selection changes externally
    useEffect(() => {
        if (currentSelection) {
            setQuery(currentSelection);
        }
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
            const matches = consoles.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 8);
            setFiltered(matches);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (slug: string, name: string) => {
        setQuery(name); // Immediate visual update
        setIsOpen(false);
        setFiltered([]);
        onSelect(slug, name); // Propagate
        if (inputRef.current) inputRef.current.blur();
    };

    const handleFocus = () => {
        if (query.length > 0) {
            // Re-filter with current query to show results again if any
            const matches = consoles.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
            if (matches.length > 0) {
                setFiltered(matches);
                setIsOpen(true);
            }
        }
    };

    return (
        <div className="relative w-full z-[60]" ref={wrapperRef}>
            <input 
                ref={inputRef}
                type="text" 
                placeholder="TYPE TO SEARCH..."
                className={`w-full bg-black/80 border-b-2 ${borderColor} p-2 font-mono text-sm text-white placeholder-gray-600 outline-none uppercase tracking-wider transition-all focus:bg-black focus:placeholder-gray-500`}
                value={query}
                onChange={handleSearch}
                onFocus={handleFocus}
                autoComplete="off"
            />
            {isOpen && filtered.length > 0 && (
                <ul className={`absolute top-full left-0 right-0 bg-black border border-gray-800 z-[100] max-h-60 overflow-y-auto custom-scrollbar shadow-[0_10px_40px_rgba(0,0,0,0.9)]`}>
                    {filtered.map(c => (
                        <li key={c.slug}>
                            <button 
                                type="button"
                                onMouseDown={() => handleSelect(c.slug, c.name)}
                                className={`w-full text-left p-3 font-mono text-xs text-gray-300 ${hoverBg} border-b border-gray-900 last:border-0 uppercase transition-colors flex justify-between group`}
                            >
                                <span className="group-hover:text-white font-bold">{c.name}</span>
                                <span className={`${textColor} opacity-0 group-hover:opacity-100`}>SELECT</span>
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
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const activeVariant = variants.find(v => v.id === selectedId);
    
    // Styles
    const borderClass = themeColor === 'cyan' ? 'border-cyan-400' : 'border-fuchsia-500';
    const textClass = themeColor === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-500';
    const bgHoverClass = themeColor === 'cyan' ? 'hover:bg-cyan-400 hover:text-black' : 'hover:bg-fuchsia-500 hover:text-black';
    const shadowClass = themeColor === 'cyan' ? 'shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'shadow-[0_0_10px_rgba(217,70,239,0.3)]';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (variants.length <= 1) return null;

    return (
        <div className="relative w-full z-40" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-black/80 border ${borderClass} px-3 py-1.5 ${shadowClass} transition-all group`}
            >
                <div className="flex flex-col items-start">
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">SPEC VARIANT</span>
                    <span className={`font-pixel text-xs ${textClass} uppercase`}>
                        {activeVariant?.variant_name || 'BASE MODEL'}
                    </span>
                </div>
                <svg className={`w-4 h-4 ${textClass} transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute bottom-full left-0 right-0 mb-2 bg-black border ${borderClass} z-50 shadow-2xl overflow-hidden`}>
                    {variants.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => { onSelect(v.id); setIsOpen(false); }}
                            className={`w-full text-left p-3 font-mono text-xs uppercase border-b border-gray-900 last:border-0 transition-colors ${selectedId === v.id ? `bg-white/10 text-white` : 'text-gray-400'} ${bgHoverClass}`}
                        >
                            {v.variant_name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE CONTENT ---

function ArenaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playClick } = useSound();

    const [allConsoles, setAllConsoles] = useState<{name: string, slug: string}[]>([]);
    
    const getInitialState = (paramKey: string): SelectionState => ({
        slug: searchParams?.get(paramKey) || null,
        details: null,
        selectedVariant: null,
        loading: false
    });

    const [left, setLeft] = useState<SelectionState>(() => getInitialState('a'));
    const [right, setRight] = useState<SelectionState>(() => getInitialState('b'));

    const [showDiffOnly, setShowDiffOnly] = useState(false);

    // Load console index once
    useEffect(() => {
        fetchConsoleList().then(list => setAllConsoles(list as any));
    }, []);

    // Load Left Console
    useEffect(() => {
        const load = async () => {
            const slug = searchParams?.get('a');
            const variantSlug = searchParams?.get('varA');
            
            if (slug && slug !== left.details?.slug) {
                setLeft(prev => ({ ...prev, loading: true, slug }));
                const details = await fetchConsoleBySlug(slug);
                if (details) {
                    const variants = details.variants || [];
                    // Ensure we pick default if no variantSlug is provided
                    let activeVar = variants.find(v => v.slug === variantSlug) || variants.find(v => v.is_default) || variants[0];
                    setLeft({ slug, details, selectedVariant: activeVar || null, loading: false });
                } else {
                    setLeft(prev => ({ ...prev, loading: false }));
                }
            } else if (slug && left.details && variantSlug) {
                // Just switch variant if console loaded
                const v = left.details.variants?.find(v => v.slug === variantSlug);
                if (v && v.id !== left.selectedVariant?.id) {
                    setLeft(prev => ({ ...prev, selectedVariant: v }));
                }
            }
        };
        load();
    }, [searchParams, left.details]);

    // Load Right Console
    useEffect(() => {
        const load = async () => {
            const slug = searchParams?.get('b');
            const variantSlug = searchParams?.get('varB');
            
            if (slug && slug !== right.details?.slug) {
                setRight(prev => ({ ...prev, loading: true, slug }));
                const details = await fetchConsoleBySlug(slug);
                if (details) {
                    const variants = details.variants || [];
                    // Ensure we pick default if no variantSlug is provided
                    let activeVar = variants.find(v => v.slug === variantSlug) || variants.find(v => v.is_default) || variants[0];
                    setRight({ slug, details, selectedVariant: activeVar || null, loading: false });
                } else {
                    setRight(prev => ({ ...prev, loading: false }));
                }
            } else if (slug && right.details && variantSlug) {
                const v = right.details.variants?.find(v => v.slug === variantSlug);
                if (v && v.id !== right.selectedVariant?.id) {
                    setRight(prev => ({ ...prev, selectedVariant: v }));
                }
            }
        };
        load();
    }, [searchParams, right.details]);

    const updateUrl = (side: 'a' | 'b', slug: string, variantSlug?: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set(side, slug);
        if (variantSlug) {
            params.set(side === 'a' ? 'varA' : 'varB', variantSlug);
        } else {
            params.delete(side === 'a' ? 'varA' : 'varB');
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleSelect = (side: 'a' | 'b', slug: string) => {
        playClick();
        updateUrl(side, slug);
    };

    const handleVariantChange = (side: 'a' | 'b', variantId: string) => {
        playClick();
        const state = side === 'a' ? left : right;
        const variant = state.details?.variants?.find(v => v.id === variantId);
        if (variant?.slug && state.slug) {
            updateUrl(side, state.slug, variant.slug);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 min-h-screen flex flex-col">
            
            {/* 1. FIGHTER SELECTION ARENA */}
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center justify-center max-w-6xl mx-auto mb-8">
                
                {/* LEFT FIGHTER (PLAYER 1) - CYAN - / shape (-skew) */}
                <div className="relative z-30 w-full max-w-sm h-[380px] mx-auto md:ml-auto md:mr-0 group focus-within:z-50 hover:z-50 transition-all">
                     {/* SKEWED CONTAINER (-12deg) */}
                     <div className="h-full border-2 border-cyan-400 bg-black/90 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative transform md:-skew-x-12 transition-all duration-300 overflow-visible">
                        {/* UN-SKEW CONTENT (12deg) */}
                        <div className="absolute inset-0 flex flex-col justify-between p-6 transform md:skew-x-12">
                            
                            {/* P1 LABEL */}
                            <div className="flex justify-between items-center mb-2 border-b border-cyan-900/50 pb-1">
                                <span className="font-pixel text-[10px] text-cyan-400">PLAYER 1</span>
                                {left.loading && <span className="text-[10px] font-mono text-cyan-400 animate-pulse">LOADING...</span>}
                            </div>

                            {/* SEARCH BAR */}
                            <div className="mb-2 relative">
                                <ConsoleSearch 
                                    consoles={allConsoles} 
                                    onSelect={(s) => handleSelect('a', s)}
                                    themeColor="cyan"
                                    currentSelection={left.details?.name}
                                />
                            </div>

                            {/* MAIN IMAGE PREVIEW */}
                            <div className="flex-1 min-h-0 relative flex items-center justify-center p-2 group">
                                {left.details?.image_url || left.selectedVariant?.image_url ? (
                                    <img 
                                        src={left.selectedVariant?.image_url || left.details?.image_url} 
                                        className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-transform duration-500 group-hover:scale-110"
                                        alt="Player 1"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-50 select-none border-2 border-dashed border-cyan-900/50 w-full bg-cyan-900/5">
                                        <div className="text-cyan-500 font-pixel text-4xl mb-2 animate-pulse">?</div>
                                        <div className="text-cyan-400 font-mono text-[10px] tracking-widest text-center font-bold">
                                            SELECT SYSTEM<br/>FROM LIST
                                        </div>
                                    </div>
                                )}
                                {/* Scanline Effect Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                            </div>

                            {/* VARIANT SELECTOR */}
                            <div className="mt-2 h-10 relative">
                                {left.details && left.details.variants && (
                                    <VariantSelect 
                                        variants={left.details.variants} 
                                        selectedId={left.selectedVariant?.id || null}
                                        onSelect={(id) => handleVariantChange('a', id)}
                                        themeColor="cyan"
                                    />
                                )}
                            </div>

                        </div>
                     </div>
                </div>

                {/* CENTRAL CONTROLS */}
                <div className="relative z-20 flex flex-col items-center justify-center gap-4 py-4 md:py-0">
                    <div className="font-pixel text-4xl md:text-5xl text-white italic drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] skew-x-[-10deg]">
                        VS
                    </div>
                    
                    {/* DIFFERENCE TOGGLE */}
                    <button 
                        onClick={() => { playClick(); setShowDiffOnly(!showDiffOnly); }}
                        className={`
                            px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all
                            ${showDiffOnly 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                                : 'bg-black text-gray-500 border-gray-700 hover:border-white hover:text-white'}
                        `}
                    >
                        {showDiffOnly ? '[ SHOW ALL ]' : '[ DIFF ONLY ]'}
                    </button>
                </div>

                {/* RIGHT FIGHTER (PLAYER 2) - PINK - \ shape (+skew) */}
                <div className="relative z-30 w-full max-w-sm h-[380px] mx-auto md:mr-auto md:ml-0 group focus-within:z-50 hover:z-50 transition-all">
                     {/* SKEWED CONTAINER (12deg) */}
                     <div className="h-full border-2 border-fuchsia-500 bg-black/90 shadow-[0_0_30px_rgba(217,70,239,0.2)] relative transform md:skew-x-12 transition-all duration-300 overflow-visible">
                        {/* UN-SKEW CONTENT (-12deg) */}
                        <div className="absolute inset-0 flex flex-col justify-between p-6 transform md:-skew-x-12">
                            
                            {/* P2 LABEL */}
                            <div className="flex justify-between items-center mb-2 border-b border-fuchsia-900/50 pb-1">
                                <span className="font-pixel text-[10px] text-fuchsia-500">PLAYER 2</span>
                                {right.loading && <span className="text-[10px] font-mono text-fuchsia-500 animate-pulse">LOADING...</span>}
                            </div>

                            {/* SEARCH BAR */}
                            <div className="mb-2 relative">
                                <ConsoleSearch 
                                    consoles={allConsoles} 
                                    onSelect={(s) => handleSelect('b', s)}
                                    themeColor="pink"
                                    currentSelection={right.details?.name}
                                />
                            </div>

                            {/* MAIN IMAGE PREVIEW */}
                            <div className="flex-1 min-h-0 relative flex items-center justify-center p-2 group">
                                {right.details?.image_url || right.selectedVariant?.image_url ? (
                                    <img 
                                        src={right.selectedVariant?.image_url || right.details?.image_url} 
                                        className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-transform duration-500 group-hover:scale-110"
                                        alt="Player 2"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-50 select-none border-2 border-dashed border-fuchsia-900/50 w-full bg-fuchsia-900/5">
                                        <div className="text-fuchsia-500 font-pixel text-4xl mb-2 animate-pulse">?</div>
                                        <div className="text-fuchsia-400 font-mono text-[10px] tracking-widest text-center font-bold">
                                            SELECT SYSTEM<br/>FROM LIST
                                        </div>
                                    </div>
                                )}
                                {/* Scanline Effect Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                            </div>

                            {/* VARIANT SELECTOR */}
                            <div className="mt-2 h-10 relative">
                                {right.details && right.details.variants && (
                                    <VariantSelect 
                                        variants={right.details.variants} 
                                        selectedId={right.selectedVariant?.id || null}
                                        onSelect={(id) => handleVariantChange('b', id)}
                                        themeColor="pink"
                                    />
                                )}
                            </div>

                        </div>
                     </div>
                </div>

            </div>

            {/* 2. DATA MATRIX */}
            <div className="flex-1 relative z-0 mt-8">
                 {/* Decorative Top Border */}
                 <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-white to-fuchsia-500 mb-0 opacity-50"></div>
                 
                 <div className="bg-black/40 border border-white/10 p-4 md:p-8 backdrop-blur-sm relative">
                    {/* HEADER */}
                    <div className="grid grid-cols-12 gap-2 mb-6 border-b border-white/20 pb-4 text-[10px] md:text-xs font-pixel text-gray-500">
                        <div className="col-span-4 text-right text-cyan-400">P1 SPECS</div>
                        <div className="col-span-4 text-center text-white">METRIC</div>
                        <div className="col-span-4 text-left text-fuchsia-500">P2 SPECS</div>
                    </div>

                    {/* ROWS */}
                    {left.selectedVariant && right.selectedVariant ? (
                        <div className="space-y-0">
                            {/* Group by Category if needed, for now just flat list */}
                            {METRICS.map((metric) => (
                                <ComparisonRow 
                                    key={metric.key} 
                                    metric={metric} 
                                    varA={left.selectedVariant!} 
                                    varB={right.selectedVariant!} 
                                    showDiffOnly={showDiffOnly}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center font-mono text-gray-600 animate-pulse">
                            AWAITING CHALLENGERS... SELECT TWO SYSTEMS TO BEGIN.
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center font-mono text-retro-neon">INITIALIZING BATTLEFIELD...</div>}>
            <ArenaContent />
        </Suspense>
    );
}
