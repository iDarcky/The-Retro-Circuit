
'use client';

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchConsoleList, fetchConsoleBySlug } from '../../lib/api';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { useSound } from '../../components/ui/SoundContext';
import RetroLoader from '../../components/ui/RetroLoader';

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
        else if (!boolA && boolB) winner = 'B';
        else if (boolA && boolB) winner = 'TIE';
    }

    // --- FORMATTER ---
    const format = (val: any, side: ConsoleVariant) => {
        if (!exists(val)) return '---';
        if (metric.type === 'boolean') return (val === true || val === 'true') ? 'YES' : 'NO';
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution') {
            return side.screen_resolution_y ? `${val} x ${side.screen_resolution_y}` : `${val}`;
        }
        return `${val}${metric.unit ? metric.unit : ''}`;
    };

    return (
        <div className="grid grid-cols-3 border-b border-white/5 hover:bg-white/5 transition-colors group relative">
            {/* VALUE A (Right Aligned) - PLAYER 1 (CYAN) */}
            <div className={`py-4 px-4 text-right font-mono text-sm flex items-center justify-end ${winner === 'A' ? 'text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-gray-400'}`}>
                {winner === 'A' && <span className="mr-2 text-xs animate-pulse">▲</span>}
                {format(rawA, varA)}
            </div>
            
            {/* LABEL (Center) */}
            <div className="py-2 px-2 flex items-center justify-center border-l border-r border-white/5">
                <span className="font-pixel text-[10px] text-gray-500 text-center uppercase tracking-wider group-hover:text-white transition-colors">
                    {metric.label}
                </span>
            </div>

            {/* VALUE B (Left Aligned) - PLAYER 2 (PINK) */}
            <div className={`py-4 px-4 text-left font-mono text-sm flex items-center justify-start ${winner === 'B' ? 'text-retro-pink font-bold drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]' : 'text-gray-400'}`}>
                {format(rawB, varB)}
                {winner === 'B' && <span className="ml-2 text-xs animate-pulse">▲</span>}
            </div>
        </div>
    );
};

// --- CUSTOM VARIANT SELECTOR ---
const VariantSelect = ({ 
    variants, 
    selectedId, 
    onSelect, 
    color 
}: { 
    variants: ConsoleVariant[], 
    selectedId: string | undefined, 
    onSelect: (id: string) => void,
    color: 'cyan' | 'pink'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { playHover, playClick } = useSound();

    const selectedVariant = variants.find(v => v.id === selectedId);

    // Theme Classes
    const theme = color === 'cyan' ? {
        border: 'border-cyan-400',
        text: 'text-cyan-400',
        bgHover: 'hover:bg-cyan-400/20',
        bgActive: 'bg-cyan-400',
        textActive: 'text-black',
        shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'
    } : {
        border: 'border-retro-pink',
        text: 'text-retro-pink',
        bgHover: 'hover:bg-retro-pink/20',
        bgActive: 'bg-retro-pink',
        textActive: 'text-black',
        shadow: 'shadow-[0_0_15px_rgba(255,0,255,0.3)]'
    };

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
        <div className="relative w-full z-30" ref={wrapperRef}>
            <button
                onClick={() => { playClick(); setIsOpen(!isOpen); }}
                className={`w-full flex justify-between items-center bg-black/80 backdrop-blur border px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all ${theme.border} ${theme.text} ${theme.bgHover} ${isOpen ? theme.shadow : ''}`}
            >
                <span className="truncate">{selectedVariant?.variant_name || 'SELECT VARIANT'}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 bg-black border ${theme.border} ${theme.shadow} max-h-60 overflow-y-auto custom-scrollbar`}>
                    {variants.map(variant => (
                        <button
                            key={variant.id}
                            onClick={() => { playClick(); onSelect(variant.id); setIsOpen(false); }}
                            onMouseEnter={playHover}
                            className={`w-full text-left px-4 py-3 font-mono text-xs uppercase border-b border-white/5 last:border-0 transition-colors ${
                                variant.id === selectedId ? `${theme.bgActive} ${theme.textActive} font-bold` : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {variant.variant_name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- SEARCH DROPDOWN ---

const ConsoleSearch = ({ 
    items, 
    onSelect, 
    placeholder,
    color
}: { 
    items: { name: string, slug: string }[], 
    onSelect: (slug: string) => void,
    placeholder: string,
    color: 'cyan' | 'pink'
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { playHover, playClick } = useSound();

    const filtered = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));

    const theme = color === 'cyan' ? 'border-cyan-400 focus:border-cyan-400 text-cyan-400 placeholder-cyan-400/50' : 'border-retro-pink focus:border-retro-pink text-retro-pink placeholder-retro-pink/50';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full z-40" ref={wrapperRef}>
            <input 
                type="text"
                className={`w-full bg-black/80 backdrop-blur border-b-2 p-3 font-mono text-sm uppercase outline-none transition-colors ${theme} border-gray-700`}
                placeholder={placeholder}
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-black border border-gray-700 max-h-60 overflow-y-auto custom-scrollbar shadow-xl">
                    {filtered.map(item => (
                        <button
                            key={item.slug}
                            onClick={() => { playClick(); onSelect(item.slug); setIsOpen(false); setQuery(''); }}
                            onMouseEnter={playHover}
                            className="w-full text-left px-4 py-3 font-mono text-xs text-gray-400 hover:text-white hover:bg-white/10 border-b border-white/5 uppercase"
                        >
                            {item.name}
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <div className="px-4 py-3 font-mono text-xs text-gray-600">NO UNITS FOUND</div>
                    )}
                </div>
            )}
        </div>
    );
};


// --- MAIN PAGE ---

export default function ArenaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playClick } = useSound();

    const [allConsoles, setAllConsoles] = useState<{name: string, slug: string}[]>([]);
    const [showDiffOnly, setShowDiffOnly] = useState(false);

    // Initial state setup to read URL params
    const getInitialState = (paramKey: string, varParamKey: string): SelectionState => ({
        slug: searchParams?.get(paramKey) || null,
        details: null,
        selectedVariant: null,
        loading: !!searchParams?.get(paramKey)
    });

    const [playerA, setPlayerA] = useState<SelectionState>(() => getInitialState('a', 'varA'));
    const [playerB, setPlayerB] = useState<SelectionState>(() => getInitialState('b', 'varB'));

    // 1. Fetch Index on Mount
    useEffect(() => {
        fetchConsoleList().then((list) => {
            // Map list to correct type for dropdown
            setAllConsoles(list.map(c => ({ name: c.name, slug: c.slug })));
        });
    }, []);

    // 2. Fetch Data when slug changes (A)
    useEffect(() => {
        const slug = searchParams?.get('a');
        const varSlug = searchParams?.get('varA');
        
        if (slug && slug !== playerA.details?.slug) {
            setPlayerA(prev => ({ ...prev, slug, loading: true }));
            fetchConsoleBySlug(slug).then(details => {
                if (details) {
                    const variants = details.variants || [];
                    // Try finding variant from URL, else default, else first, else blank
                    const activeVariant = variants.find(v => v.slug === varSlug) 
                                       || variants.find(v => v.is_default) 
                                       || variants[0]
                                       || (details as any).specs; // Fallback to legacy specs

                    setPlayerA({ slug, details, selectedVariant: activeVariant, loading: false });
                } else {
                    setPlayerA(prev => ({ ...prev, loading: false }));
                }
            });
        }
    }, [searchParams]); // Depend on SearchParams to trigger updates

    // 3. Fetch Data when slug changes (B)
    useEffect(() => {
        const slug = searchParams?.get('b');
        const varSlug = searchParams?.get('varB');

        if (slug && slug !== playerB.details?.slug) {
            setPlayerB(prev => ({ ...prev, slug, loading: true }));
            fetchConsoleBySlug(slug).then(details => {
                if (details) {
                    const variants = details.variants || [];
                    const activeVariant = variants.find(v => v.slug === varSlug) 
                                       || variants.find(v => v.is_default) 
                                       || variants[0]
                                       || (details as any).specs;

                    setPlayerB({ slug, details, selectedVariant: activeVariant, loading: false });
                } else {
                    setPlayerB(prev => ({ ...prev, loading: false }));
                }
            });
        }
    }, [searchParams]);

    // Update URL Helper
    const updateUrl = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams?.toString());
        Object.entries(newParams).forEach(([key, val]) => {
            if (val) params.set(key, val);
            else params.delete(key);
        });
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleSelectConsole = (side: 'A' | 'B', slug: string) => {
        playClick();
        if (side === 'A') {
            updateUrl({ a: slug, varA: null });
        } else {
            updateUrl({ b: slug, varB: null });
        }
    };

    const handleVariantChange = (side: 'A' | 'B', variantId: string) => {
        playClick();
        if (side === 'A' && playerA.details) {
            const variant = playerA.details.variants?.find(v => v.id === variantId);
            if (variant) {
                setPlayerA(prev => ({ ...prev, selectedVariant: variant }));
                if (variant.slug) updateUrl({ varA: variant.slug });
            }
        } else if (side === 'B' && playerB.details) {
            const variant = playerB.details.variants?.find(v => v.id === variantId);
            if (variant) {
                setPlayerB(prev => ({ ...prev, selectedVariant: variant }));
                if (variant.slug) updateUrl({ varB: variant.slug });
            }
        }
    };

    // Derived Display Data
    const imgA = playerA.selectedVariant?.image_url || playerA.details?.image_url;
    const imgB = playerB.selectedVariant?.image_url || playerB.details?.image_url;
    
    // Fallback names
    const nameA = playerA.details?.name || 'PLAYER 1';
    const nameB = playerB.details?.name || 'PLAYER 2';

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
            
            {/* HEADER */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-pixel text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">VS</span> MODE
                </h1>
                <p className="font-mono text-gray-500 tracking-widest text-xs md:text-sm">
                    TACTICAL SPECIFICATION COMPARISON ENGINE
                </p>
            </div>

            {/* FIGHTERS STAGE (SKEWED CARDS) */}
            <div className="grid grid-cols-2 gap-4 md:gap-16 mb-12 relative items-stretch">
                
                {/* CENTER PIECE: VS LOGO + CONTROLS (Floating Overlay) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center w-0 overflow-visible pointer-events-none">
                     <div className="font-pixel text-5xl md:text-7xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] italic mb-6 whitespace-nowrap">VS</div>
                     
                     {/* Toggle Button - Enable pointer events */}
                     {playerA.selectedVariant && playerB.selectedVariant && (
                        <button 
                            onClick={() => { playClick(); setShowDiffOnly(!showDiffOnly); }}
                            className={`
                                pointer-events-auto whitespace-nowrap
                                flex items-center gap-2 px-4 py-2 border-2 font-mono text-[10px] uppercase tracking-widest transition-all backdrop-blur-md
                                hover:scale-105 active:scale-95
                                ${showDiffOnly 
                                    ? 'bg-retro-neon/20 text-retro-neon border-retro-neon shadow-[0_0_15px_rgba(0,255,157,0.5)] font-bold' 
                                    : 'bg-black/80 text-gray-400 border-gray-600 hover:border-white hover:text-white'}
                            `}
                        >
                            <div className={`w-2 h-2 border ${showDiffOnly ? 'bg-retro-neon border-retro-neon animate-pulse' : 'border-gray-500'}`}></div>
                            DIFF ONLY
                        </button>
                     )}
                </div>

                {/* PLAYER 1 (CYAN) */}
                <div className="flex flex-col">
                    {/* Header Input */}
                    <div className="mb-4 px-2 relative z-20">
                        <ConsoleSearch 
                            items={allConsoles} 
                            onSelect={(s) => handleSelectConsole('A', s)} 
                            placeholder="SELECT FIGHTER A" 
                            color="cyan"
                        />
                    </div>

                    {/* SKEWED CARD CONTAINER */}
                    <div className="flex-1 relative group">
                        {/* Content Container (Skewed Box) */}
                        <div className="h-full transform skew-x-[-6deg] border-2 border-cyan-400 bg-black/40 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative overflow-hidden flex flex-col aspect-[3/4] min-h-[400px]">
                            
                            {/* Inner Content Wrapper (Counter Skewed to Straighten Content) */}
                            <div className="transform skew-x-[6deg] w-full h-full flex flex-col p-6 relative z-10">
                                {playerA.loading ? (
                                    <RetroLoader />
                                ) : playerA.details ? (
                                    <>
                                        {/* Top: Name & Variant */}
                                        <div className="z-10">
                                            <h2 className="font-pixel text-xl md:text-3xl text-white leading-none mb-1 drop-shadow-md">
                                                {playerA.details.name}
                                            </h2>
                                            <div className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-widest">
                                                {playerA.selectedVariant?.variant_name || 'BASE UNIT'}
                                            </div>
                                        </div>

                                        {/* Middle: Image (Centered, Contain) */}
                                        <div className="flex-1 relative flex items-center justify-center my-4">
                                            {imgA ? (
                                                <img src={imgA} alt={nameA} className="max-w-full max-h-full object-contain drop-shadow-2xl animate-slideDown" />
                                            ) : (
                                                <div className="font-pixel text-gray-700 text-6xl">?</div>
                                            )}
                                        </div>

                                        {/* Bottom: Variant Selector */}
                                        <div className="z-10 mt-auto">
                                            <VariantSelect 
                                                variants={playerA.details.variants || []} 
                                                selectedId={playerA.selectedVariant?.id} 
                                                onSelect={(id) => handleVariantChange('A', id)}
                                                color="cyan"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
                                        <div className="font-pixel text-6xl opacity-50 mb-4">P1</div>
                                        <div className="font-mono text-xs animate-pulse">WAITING FOR CHALLENGER...</div>
                                    </div>
                                )}
                            </div>

                            {/* Background Grid - Skewed with container */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-30"></div>
                        </div>
                    </div>
                </div>

                {/* PLAYER 2 (PINK) */}
                <div className="flex flex-col">
                    {/* Header Input */}
                    <div className="mb-4 px-2 relative z-20">
                        <ConsoleSearch 
                            items={allConsoles} 
                            onSelect={(s) => handleSelectConsole('B', s)} 
                            placeholder="SELECT FIGHTER B" 
                            color="pink"
                        />
                    </div>

                    {/* SKEWED CARD CONTAINER (Parallel Skew) */}
                    <div className="flex-1 relative group">
                        {/* Content Container (Skewed Box) */}
                        <div className="h-full transform skew-x-[-6deg] border-2 border-retro-pink bg-black/40 shadow-[0_0_30px_rgba(255,0,255,0.2)] relative overflow-hidden flex flex-col aspect-[3/4] min-h-[400px]">
                            
                            {/* Inner Content Wrapper (Counter Skewed) */}
                            <div className="transform skew-x-[6deg] w-full h-full flex flex-col p-6 relative z-10">
                                {playerB.loading ? (
                                    <RetroLoader />
                                ) : playerB.details ? (
                                    <>
                                        {/* Top: Name & Variant (Right Aligned for P2) */}
                                        <div className="z-10 text-right">
                                            <h2 className="font-pixel text-xl md:text-3xl text-white leading-none mb-1 drop-shadow-md">
                                                {playerB.details.name}
                                            </h2>
                                            <div className="text-retro-pink font-mono text-xs uppercase font-bold tracking-widest">
                                                {playerB.selectedVariant?.variant_name || 'BASE UNIT'}
                                            </div>
                                        </div>

                                        {/* Middle: Image */}
                                        <div className="flex-1 relative flex items-center justify-center my-4">
                                            {imgB ? (
                                                <img src={imgB} alt={nameB} className="max-w-full max-h-full object-contain drop-shadow-2xl animate-slideDown" />
                                            ) : (
                                                <div className="font-pixel text-gray-700 text-6xl">?</div>
                                            )}
                                        </div>

                                        {/* Bottom: Variant Selector */}
                                        <div className="z-10 mt-auto">
                                            <VariantSelect 
                                                variants={playerB.details.variants || []} 
                                                selectedId={playerB.selectedVariant?.id} 
                                                onSelect={(id) => handleVariantChange('B', id)}
                                                color="pink"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
                                        <div className="font-pixel text-6xl opacity-50 mb-4">P2</div>
                                        <div className="font-mono text-xs animate-pulse">WAITING FOR CHALLENGER...</div>
                                    </div>
                                )}
                            </div>

                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-30"></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* COMPARISON MATRIX */}
            {playerA.selectedVariant && playerB.selectedVariant && (
                <div className="animate-fadeIn">
                    <div className="bg-black/80 border border-retro-grid shadow-2xl backdrop-blur-md">
                        {/* Matrix Header */}
                        <div className="grid grid-cols-3 bg-white/5 border-b border-retro-grid py-4 px-2">
                            <div className="text-right font-pixel text-xs md:text-sm text-cyan-400 truncate px-2">{nameA}</div>
                            <div className="text-center font-mono text-[10px] text-gray-600 uppercase tracking-[0.2em] self-center">VS</div>
                            <div className="text-left font-pixel text-xs md:text-sm text-retro-pink truncate px-2">{nameB}</div>
                        </div>

                        {/* CATEGORIES */}
                        {Array.from(new Set(METRICS.map(m => m.category))).map(category => {
                            // Pre-calculate visibility of category if filtering is on
                            const categoryMetrics = METRICS.filter(m => m.category === category);
                            const visibleRows = categoryMetrics.filter(metric => {
                                const valA = playerA.selectedVariant![metric.key];
                                const valB = playerB.selectedVariant![metric.key];
                                const exists = (v: any) => v !== undefined && v !== null && v !== '';
                                if (!exists(valA) && !exists(valB)) return false;
                                if (showDiffOnly && valA === valB) return false;
                                return true;
                            });

                            if (visibleRows.length === 0) return null;

                            return (
                                <div key={category}>
                                    <div className="bg-retro-grid/30 py-2 px-4 border-y border-white/5">
                                        <h3 className="font-pixel text-[10px] text-gray-400 uppercase tracking-widest">{category}</h3>
                                    </div>
                                    <div>
                                        {visibleRows.map(metric => (
                                            <ComparisonRow 
                                                key={metric.key} 
                                                metric={metric} 
                                                varA={playerA.selectedVariant!} 
                                                varB={playerB.selectedVariant!}
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
