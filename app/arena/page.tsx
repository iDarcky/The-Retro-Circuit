'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchConsoleList, fetchConsoleBySlug } from '../../lib/api';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { useSound } from '../../components/ui/SoundContext';
import styles from './Arena.module.css';

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
    { label: 'Release Year', key: 'release_year', type: 'number' },
    { label: 'Launch Price', key: 'price_launch_usd', type: 'currency', lowerIsBetter: true },
    { label: 'CPU Cores', key: 'cpu_cores', type: 'number' },
    { label: 'CPU Clock', key: 'cpu_clock_mhz', type: 'number', unit: 'MHz' },
    { label: 'RAM Size', key: 'ram_gb', type: 'number', unit: 'GB' },
    { label: 'Storage', key: 'storage_gb', type: 'number', unit: 'GB' },
    { label: 'Screen Size', key: 'screen_size_inch', type: 'number', unit: '"' },
    { label: 'Resolution', key: 'screen_resolution_x', type: 'resolution' },
    { label: 'Refresh Rate', key: 'refresh_rate_hz', type: 'number', unit: 'Hz' },
    { label: 'PPI', key: 'ppi', type: 'number', unit: 'PPI' },
    { label: 'Battery', key: 'battery_wh', type: 'number', unit: 'Wh' },
    { label: 'Weight', key: 'weight_g', type: 'number', unit: 'g', lowerIsBetter: true },
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
                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest group-hover:text-white transition-colors">{metric.label}</span>
            </div>
            <div className={`col-span-4 text-left font-mono text-xs md:text-sm flex justify-start items-center gap-2 ${classB}`}>
                {valDisplayB}
                {winner === 'B' && <span className="text-[10px]">▲</span>}
            </div>
        </div>
    );
};

// --- SEARCH COMPONENT ---
interface ConsoleSearchProps {
    consoles: {name: string, slug: string}[];
    onSelect: (slug: string) => void;
    placeholder?: string;
    themeColor: 'cyan' | 'pink';
    currentSelection?: string;
}

const ConsoleSearch = ({ consoles, onSelect, placeholder = "SELECT SYSTEM...", themeColor, currentSelection }: ConsoleSearchProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync input with external selection changes
    useEffect(() => {
        if (currentSelection) {
            setSearchTerm(currentSelection);
        }
    }, [currentSelection]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (currentSelection) setSearchTerm(currentSelection);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [currentSelection]);

    const filtered = consoles.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8);

    const handleSelect = (slug: string, name: string) => {
        setSearchTerm(name);
        setIsOpen(false);
        onSelect(slug);
    };

    const borderColor = themeColor === 'cyan' ? 'border-retro-neon focus:border-retro-neon' : 'border-retro-pink focus:border-retro-pink';
    const textColor = themeColor === 'cyan' ? 'text-retro-neon placeholder-retro-neon/50' : 'text-retro-pink placeholder-retro-pink/50';

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => {
                    if (searchTerm === currentSelection) setSearchTerm('');
                    setIsOpen(true);
                }}
                placeholder={placeholder}
                className={`w-full bg-black/60 border-2 ${borderColor} p-3 font-mono text-sm ${textColor} outline-none uppercase shadow-inner transition-all text-center`}
            />
            
            {isOpen && (searchTerm.length > 0 || filtered.length > 0) && (
                <ul className="absolute left-0 right-0 top-full mt-2 bg-black border-2 border-gray-700 max-h-60 overflow-y-auto z-[100] shadow-2xl custom-scrollbar">
                    {filtered.length > 0 ? filtered.map((c) => (
                        <li 
                            key={c.slug}
                            onClick={() => handleSelect(c.slug, c.name)}
                            className="p-3 hover:bg-white/10 cursor-pointer border-b border-gray-800 last:border-0 font-mono text-xs text-white uppercase text-center"
                        >
                            {c.name}
                        </li>
                    )) : (
                        <li className="p-3 text-gray-500 font-mono text-xs italic text-center">NO MATCHES</li>
                    )}
                </ul>
            )}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

function ArenaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playClick, playHover } = useSound();

    const [allConsoles, setAllConsoles] = useState<{name: string, slug: string}[]>([]);
    
    // Player A State
    const [left, setLeft] = useState<SelectionState>({ 
        slug: null, details: null, selectedVariant: null, loading: false 
    });
    
    // Player B State
    const [right, setRight] = useState<SelectionState>({ 
        slug: null, details: null, selectedVariant: null, loading: false 
    });

    const [showDiffOnly, setShowDiffOnly] = useState(false);

    // Initial List Load
    useEffect(() => {
        fetchConsoleList().then((list: any) => setAllConsoles(list));
    }, []);

    // Load from URL
    useEffect(() => {
        const loadSide = async (side: 'a' | 'b', slug: string | null, variantSlug: string | null) => {
            if (!slug) return;
            
            const setFn = side === 'a' ? setLeft : setRight;
            setFn(prev => ({ ...prev, loading: true }));

            const details = await fetchConsoleBySlug(slug);
            if (details) {
                const variants = details.variants || [];
                let variant = variants[0]; // Default fallback
                
                if (variantSlug) {
                    variant = variants.find(v => v.slug === variantSlug) || variant;
                } else {
                    variant = variants.find(v => v.is_default) || variant;
                }

                setFn({ 
                    slug, 
                    details, 
                    selectedVariant: variant || (details.specs as ConsoleVariant), 
                    loading: false 
                });
            } else {
                setFn(prev => ({ ...prev, loading: false }));
            }
        };

        const slugA = searchParams?.get('c1') || null;
        const varA = searchParams?.get('v1') || null;
        const slugB = searchParams?.get('c2') || null;
        const varB = searchParams?.get('v2') || null;

        if (slugA !== left.slug) loadSide('a', slugA, varA);
        if (slugB !== right.slug) loadSide('b', slugB, varB);
        
    }, [searchParams]);

    const updateUrl = (side: 'a' | 'b', consoleSlug: string, variantSlug?: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        if (side === 'a') {
            params.set('c1', consoleSlug);
            if (variantSlug) params.set('v1', variantSlug);
            else params.delete('v1');
        } else {
            params.set('c2', consoleSlug);
            if (variantSlug) params.set('v2', variantSlug);
            else params.delete('v2');
        }
        router.replace(`/arena?${params.toString()}`, { scroll: false });
    };

    const handleSelect = (side: 'a' | 'b', slug: string) => {
        playClick(); // Only needed if updating URL or selection state directly
        updateUrl(side, slug);
    };

    const handleVariantChange = (side: 'a' | 'b', variantSlug: string) => {
        const state = side === 'a' ? left : right;
        if (state.slug) {
            updateUrl(side, state.slug, variantSlug);
            // Optimistic update
            const v = state.details?.variants?.find(v => v.slug === variantSlug);
            if (v) {
                const setFn = side === 'a' ? setLeft : setRight;
                setFn(prev => ({ ...prev, selectedVariant: v }));
            }
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 min-h-screen">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-pixel text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    VS MODE
                </h1>
                <p className="font-mono text-gray-500 text-sm">SELECT FIGHTERS FOR SPECIFICATION BATTLE</p>
            </div>

            {/* --- THE ARENA (RHOMBUS LAYOUT) --- */}
            <div className="relative flex flex-col md:flex-row justify-center items-stretch min-h-[500px] mb-12 px-4 md:px-0">
                
                {/* VS Badge (Absolute Center) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none md:block hidden">
                     <div className="relative">
                        <h2 className="font-pixel text-6xl text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10 relative">VS</h2>
                        <div className="absolute inset-0 blur-xl bg-white/30 rounded-full"></div>
                     </div>
                </div>

                {/* --- PLAYER 1 (LEFT) --- */}
                {/* Container: Skewed Right / */}
                <div className="relative w-full md:w-1/2 group z-20 focus-within:z-50 md:-mr-10 mb-8 md:mb-0">
                    <div className={styles.fighterCardContainer}>
                        {/* Inner Content: Counter Skewed */}
                        <div className={styles.fighterCardContent}>
                            
                            <div className="w-full mb-6">
                                <h3 className="font-pixel text-xl text-retro-neon text-center mb-2">PLAYER 1</h3>
                                <ConsoleSearch 
                                    consoles={allConsoles} 
                                    onSelect={(slug) => handleSelect('a', slug)}
                                    themeColor="cyan"
                                    currentSelection={left.details?.name}
                                />
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[250px] relative">
                                {left.loading ? (
                                    <div className="animate-spin w-12 h-12 border-4 border-retro-neon border-t-transparent rounded-full"></div>
                                ) : left.details ? (
                                    <>
                                        {/* Image */}
                                        <div className="relative w-full h-48 mb-6 flex items-center justify-center">
                                            <img 
                                                src={left.selectedVariant?.image_url || left.details.image_url} 
                                                className="max-h-full max-w-full object-contain drop-shadow-2xl animate-slideDown"
                                                alt={left.details.name}
                                            />
                                        </div>

                                        {/* Variant Selector */}
                                        {left.details.variants && left.details.variants.length > 1 && (
                                            <div className="w-full max-w-[200px]">
                                                <select 
                                                    className="w-full bg-black/50 border border-retro-neon text-retro-neon font-mono text-xs p-2 outline-none text-center appearance-none cursor-pointer hover:bg-retro-neon hover:text-black transition-colors"
                                                    value={left.selectedVariant?.slug || ''}
                                                    onChange={(e) => handleVariantChange('a', e.target.value)}
                                                >
                                                    {left.details.variants.map(v => (
                                                        <option key={v.id} value={v.slug}>{v.variant_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center opacity-30">
                                        <div className="font-pixel text-6xl text-retro-neon mb-4">?</div>
                                        <p className="font-mono text-retro-neon text-sm">SELECT SYSTEM</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PLAYER 2 (RIGHT) --- */}
                {/* Container: Skewed Left \ */}
                <div className="relative w-full md:w-1/2 group z-20 focus-within:z-50 md:-ml-10">
                    <div className={styles.fighterCardContainerP2}>
                        {/* Inner Content: Counter Skewed */}
                        <div className={styles.fighterCardContentP2}>
                             
                             <div className="w-full mb-6">
                                <h3 className="font-pixel text-xl text-retro-pink text-center mb-2">PLAYER 2</h3>
                                <ConsoleSearch 
                                    consoles={allConsoles} 
                                    onSelect={(slug) => handleSelect('b', slug)}
                                    themeColor="pink"
                                    currentSelection={right.details?.name}
                                />
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[250px] relative">
                                {right.loading ? (
                                    <div className="animate-spin w-12 h-12 border-4 border-retro-pink border-t-transparent rounded-full"></div>
                                ) : right.details ? (
                                    <>
                                        {/* Image */}
                                        <div className="relative w-full h-48 mb-6 flex items-center justify-center">
                                            <img 
                                                src={right.selectedVariant?.image_url || right.details.image_url} 
                                                className="max-h-full max-w-full object-contain drop-shadow-2xl animate-slideDown"
                                                alt={right.details.name}
                                            />
                                        </div>

                                        {/* Variant Selector */}
                                        {right.details.variants && right.details.variants.length > 1 && (
                                            <div className="w-full max-w-[200px]">
                                                <select 
                                                    className="w-full bg-black/50 border border-retro-pink text-retro-pink font-mono text-xs p-2 outline-none text-center appearance-none cursor-pointer hover:bg-retro-pink hover:text-black transition-colors"
                                                    value={right.selectedVariant?.slug || ''}
                                                    onChange={(e) => handleVariantChange('b', e.target.value)}
                                                >
                                                    {right.details.variants.map(v => (
                                                        <option key={v.id} value={v.slug}>{v.variant_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center opacity-30">
                                        <div className="font-pixel text-6xl text-retro-pink mb-4">?</div>
                                        <p className="font-mono text-retro-pink text-sm">SELECT SYSTEM</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* --- BATTLE REPORT --- */}
            <div className="border-t-2 border-retro-grid pt-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-pixel text-xl text-white">BATTLE REPORT</h3>
                    <button 
                        onClick={() => { playClick(); setShowDiffOnly(!showDiffOnly); }}
                        onMouseEnter={playHover}
                        className={`font-mono text-xs border px-3 py-1 transition-all ${showDiffOnly ? 'bg-white text-black border-white' : 'text-gray-500 border-gray-700 hover:border-white'}`}
                    >
                        [ {showDiffOnly ? 'SHOW ALL' : 'DIFF ONLY'} ]
                    </button>
                </div>

                <div className="bg-black/40 border border-retro-grid p-4 md:p-8">
                    {left.selectedVariant && right.selectedVariant ? (
                        <div className="space-y-1">
                            {METRICS.map(metric => (
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
                        <div className="text-center py-12">
                            <div className="font-mono text-gray-500 mb-2">AWAITING FIGHTER SELECTION...</div>
                            <div className="w-full h-1 bg-retro-grid/30 rounded overflow-hidden">
                                <div className="h-full bg-retro-grid/50 w-1/3 animate-pulse"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="text-center p-20 font-mono text-retro-neon">LOADING ARENA...</div>}>
            <ArenaContent />
        </Suspense>
    );
}