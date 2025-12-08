'use client';

import { useState, useEffect, Suspense, useCallback, useRef, type ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { fetchConsoleList, fetchConsoleBySlug } from '../../lib/api';
import { ConsoleDetails, ConsoleVariant } from '../../lib/types';
import { useSound } from '../../components/ui/SoundContext';
import Button from '../../components/ui/Button';
import RetroLoader from '../../components/ui/RetroLoader';

// --- TYPES & CONFIG ---

type ComparisonMetric = {
    key: keyof ConsoleVariant;
    label: string;
    type: 'number' | 'string' | 'boolean' | 'currency';
    unit?: string;
    lowerIsBetter?: boolean;
    category?: string;
};

const METRICS: ComparisonMetric[] = [
    { label: 'Release Year', key: 'release_year', type: 'number', category: 'General' },
    { label: 'Launch Price', key: 'price_launch_usd', type: 'currency', lowerIsBetter: true, category: 'General' },
    
    { label: 'CPU Cores', key: 'cpu_cores', type: 'number', category: 'Performance' },
    { label: 'CPU Clock', key: 'cpu_clock_mhz', type: 'number', unit: 'MHz', category: 'Performance' },
    { label: 'GPU TFLOPS', key: 'gpu_teraflops', type: 'number', unit: 'TF', category: 'Performance' },
    { label: 'RAM', key: 'ram_gb', type: 'number', unit: 'GB', category: 'Performance' },
    { label: 'RAM Speed', key: 'ram_speed_mhz', type: 'number', unit: 'MHz', category: 'Performance' },
    
    { label: 'Screen Size', key: 'screen_size_inch', type: 'number', unit: '"', category: 'Display' },
    { label: 'Resolution X', key: 'screen_resolution_x', type: 'number', unit: 'px', category: 'Display' },
    { label: 'Refresh Rate', key: 'refresh_rate_hz', type: 'number', unit: 'Hz', category: 'Display' },
    { label: 'Pixel Density', key: 'ppi', type: 'number', unit: 'PPI', category: 'Display' },
    { label: 'Panel Type', key: 'display_type', type: 'string', category: 'Display' },

    { label: 'Battery Capacity', key: 'battery_wh', type: 'number', unit: 'Wh', category: 'Power' },
    { label: 'Weight', key: 'weight_g', type: 'number', unit: 'g', lowerIsBetter: true, category: 'Body' },
];

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

// --- HELPER COMPONENTS ---

const ComparisonRow = ({ metric, varA, varB }: { metric: ComparisonMetric, varA: ConsoleVariant, varB: ConsoleVariant }) => {
    const valA = varA[metric.key];
    const valB = varB[metric.key];

    let winner: 'A' | 'B' | 'TIE' | null = null;

    if (metric.type === 'number' || metric.type === 'currency') {
        const hasA = valA !== undefined && valA !== null;
        const hasB = valB !== undefined && valB !== null;
        
        if (hasA && hasB) {
            const numA = Number(valA);
            const numB = Number(valB);
            
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
    } else if (metric.type === 'boolean') {
        const boolA = valA === true || valA === 'true';
        const boolB = valB === true || valB === 'true';
        if (boolA && !boolB) winner = 'A';
        else if (!boolA && boolB) winner = 'B';
        else if (boolA && boolB) winner = 'TIE';
    }

    const format = (val: any) => {
        if (val === undefined || val === null || val === '') return '---';
        if (metric.type === 'boolean') return (val === true || val === 'true') ? 'YES' : 'NO';
        if (metric.type === 'currency') return `$${val}`;
        return `${val}${metric.unit ? metric.unit : ''}`;
    };

    return (
        <div className="grid grid-cols-3 border-b border-retro-grid/30 hover:bg-white/5 transition-colors group">
            <div className={`p-3 text-right font-mono text-sm flex items-center justify-end ${winner === 'A' ? 'text-retro-neon font-bold drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]' : 'text-gray-400'}`}>
                {winner === 'A' && <span className="mr-2 text-xs">▲</span>}
                {format(valA)}
            </div>
            
            <div className="p-2 flex items-center justify-center bg-retro-grid/10 border-l border-r border-retro-grid/30">
                <span className="font-pixel text-[9px] text-gray-500 uppercase tracking-wider text-center group-hover:text-white transition-colors">
                    {metric.label}
                </span>
            </div>
            
            <div className={`p-3 text-left font-mono text-sm flex items-center justify-start ${winner === 'B' ? 'text-retro-pink font-bold drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]' : 'text-gray-400'}`}>
                {format(valB)}
                {winner === 'B' && <span className="ml-2 text-xs">▲</span>}
            </div>
        </div>
    );
};

const ConsoleSearchSelect = ({ 
    options, 
    value, 
    onChange, 
    disabled 
}: { 
    options: { name: string, slug: string }[], 
    value: string | null, 
    onChange: (slug: string) => void,
    disabled: boolean 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
    const selectedName = options.find(o => o.slug === value)?.name;

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div 
                className={`w-full bg-black border p-3 flex justify-between items-center cursor-pointer transition-colors ${isOpen ? 'border-retro-blue' : 'border-retro-grid hover:border-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`font-mono text-sm truncate ${selectedName ? 'text-white' : 'text-gray-500'}`}>
                    {selectedName || 'SELECT HARDWARE...'}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 bg-black border border-retro-blue shadow-[0_0_20px_rgba(0,0,0,0.8)] max-h-60 flex flex-col">
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="FILTER LIST..."
                        className="w-full bg-retro-grid/30 p-2 text-xs font-mono text-white outline-none border-b border-retro-grid"
                        value={search}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    />
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        {filtered.map(opt => (
                            <button
                                key={opt.slug}
                                onClick={() => {
                                    onChange(opt.slug);
                                    setIsOpen(false);
                                    setSearch('');
                                }}
                                className="w-full text-left p-2 hover:bg-retro-blue/20 text-xs font-mono text-gray-300 hover:text-white transition-colors border-b border-gray-900 last:border-0"
                            >
                                {opt.name}
                            </button>
                        ))}
                        {filtered.length === 0 && <div className="p-2 text-xs font-mono text-gray-500 text-center">NO MATCHES</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE LOGIC ---

function ArenaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playClick, playHover } = useSound();

    const [allConsoles, setAllConsoles] = useState<{name: string, slug: string}[]>([]);
    
    // Player States
    const [left, setLeft] = useState<SelectionState>({ slug: null, details: null, selectedVariant: null, loading: false });
    const [right, setRight] = useState<SelectionState>({ slug: null, details: null, selectedVariant: null, loading: false });

    // Initial List Load
    useEffect(() => {
        const loadList = async () => {
            const list = await fetchConsoleList();
            setAllConsoles(list);
        };
        loadList();
    }, []);

    // Helper: Fetch Details
    const loadConsoleDetails = useCallback(async (slug: string): Promise<SelectionState> => {
        const details = await fetchConsoleBySlug(slug);
        if (!details) return { slug: null, details: null, selectedVariant: null, loading: false };

        const variants = details.variants || [];
        // Default to 'is_default' or first variant
        const defaultVar = variants.find(v => v.is_default) || variants[0];
        
        return {
            slug,
            details,
            selectedVariant: defaultVar || null,
            loading: false
        };
    }, []);

    // Sync from URL on Mount / Change
    useEffect(() => {
        const aSlug = searchParams?.get('a');
        const bSlug = searchParams?.get('b');
        const varA = searchParams?.get('varA');
        const varB = searchParams?.get('varB');

        const sync = async () => {
            // Only fetch if slug changed or not loaded yet
            if (aSlug && left.slug !== aSlug) {
                setLeft(prev => ({ ...prev, loading: true }));
                const newState = await loadConsoleDetails(aSlug);
                // Override variant if in URL
                if (varA && newState.details?.variants) {
                    const specificVar = newState.details.variants.find(v => v.slug === varA);
                    if (specificVar) newState.selectedVariant = specificVar;
                }
                setLeft(newState);
            }

            if (bSlug && right.slug !== bSlug) {
                setRight(prev => ({ ...prev, loading: true }));
                const newState = await loadConsoleDetails(bSlug);
                // Override variant if in URL
                if (varB && newState.details?.variants) {
                    const specificVar = newState.details.variants.find(v => v.slug === varB);
                    if (specificVar) newState.selectedVariant = specificVar;
                }
                setRight(newState);
            }
        };
        sync();
    }, [searchParams, loadConsoleDetails]); // Deliberately excluding left.slug/right.slug from deps to prevent loops

    // Update URL Helper
    const updateUrl = (newLeft: SelectionState, newRight: SelectionState) => {
        const params = new URLSearchParams();
        if (newLeft.slug) params.set('a', newLeft.slug);
        if (newRight.slug) params.set('b', newRight.slug);
        
        if (newLeft.selectedVariant && newLeft.selectedVariant.slug) params.set('varA', newLeft.selectedVariant.slug);
        if (newRight.selectedVariant && newRight.selectedVariant.slug) params.set('varB', newRight.selectedVariant.slug);
        
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    // Handlers
    const handleSelectConsole = async (side: 'left' | 'right', slug: string) => {
        playClick();
        if (side === 'left') setLeft(prev => ({ ...prev, loading: true }));
        else setRight(prev => ({ ...prev, loading: true }));

        const newState = await loadConsoleDetails(slug);
        
        if (side === 'left') {
            setLeft(newState);
            updateUrl(newState, right);
        } else {
            setRight(newState);
            updateUrl(left, newState);
        }
    };

    const handleSelectVariant = (side: 'left' | 'right', variantId: string) => {
        playClick();
        if (side === 'left' && left.details) {
            const v = left.details.variants?.find(v => v.id === variantId) || null;
            const newState = { ...left, selectedVariant: v };
            setLeft(newState);
            updateUrl(newState, right);
        } else if (side === 'right' && right.details) {
            const v = right.details.variants?.find(v => v.id === variantId) || null;
            const newState = { ...right, selectedVariant: v };
            setRight(newState);
            updateUrl(left, newState);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
            {/* HEADER */}
            <div className="text-center mb-8 border-b-2 border-retro-grid pb-6">
                <h2 className="text-4xl md:text-6xl font-pixel text-retro-neon mb-2 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">VS MODE</h2>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500 tracking-widest">
                    <span>//</span>
                    <span>HARDWARE COMPARISON ENGINE</span>
                    <span>//</span>
                </div>
            </div>

            {/* SELECTION DECK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start relative mb-12">
                
                {/* VS BADGE (Absolute Center) */}
                <div className="hidden md:flex absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="font-pixel text-6xl text-white drop-shadow-[0_0_20px_rgba(255,0,255,0.8)] animate-pulse italic">VS</div>
                </div>

                {/* LEFT CARD */}
                <div className="bg-retro-dark border-4 border-retro-neon p-1 relative shadow-[0_0_30px_rgba(0,255,157,0.1)]">
                    <div className="bg-black/80 p-6 flex flex-col gap-4 relative z-10 h-full min-h-[400px]">
                        <div className="text-center">
                            <h3 className="font-pixel text-lg text-retro-neon mb-2">PLAYER 1</h3>
                            <ConsoleSearchSelect 
                                options={allConsoles} 
                                value={left.slug} 
                                onChange={(slug) => handleSelectConsole('left', slug)} 
                                disabled={left.loading}
                            />
                        </div>

                        {left.loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-retro-neon border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : left.details ? (
                            <div className="animate-fadeIn flex-1 flex flex-col">
                                {left.details.variants && left.details.variants.length > 1 && (
                                    <div className="mb-4">
                                        <label className="text-[10px] font-mono text-gray-500 block mb-1">SELECT VARIANT</label>
                                        <select 
                                            className="w-full bg-retro-grid/20 border border-gray-700 text-white font-mono text-xs p-2 outline-none focus:border-retro-neon"
                                            value={left.selectedVariant?.id || ''}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectVariant('left', e.target.value)}
                                        >
                                            {left.details.variants.map(v => (
                                                <option key={v.id} value={v.id}>{v.variant_name} {v.is_default ? '(Base)' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex-1 relative min-h-[200px] flex items-center justify-center bg-gradient-to-b from-transparent to-retro-neon/5 p-4 border border-white/5 mb-4 group">
                                    {left.selectedVariant?.image_url ? (
                                        <Image 
                                            src={left.selectedVariant.image_url} 
                                            alt="Left Console" 
                                            width={400} 
                                            height={400} 
                                            className="object-contain max-h-48 w-auto drop-shadow-xl group-hover:scale-105 transition-transform" 
                                        />
                                    ) : (
                                        <div className="font-pixel text-retro-grid text-4xl opacity-30">NO IMAGE</div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <div className="font-pixel text-sm text-white">{left.details.name}</div>
                                    {left.selectedVariant && (
                                        <div className="font-mono text-xs text-retro-neon">{left.selectedVariant.variant_name}</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-600 font-mono text-sm border-2 border-dashed border-gray-800">
                                WAITING FOR SELECTION...
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="bg-retro-dark border-4 border-retro-pink p-1 relative shadow-[0_0_30px_rgba(255,0,255,0.1)]">
                    <div className="bg-black/80 p-6 flex flex-col gap-4 relative z-10 h-full min-h-[400px]">
                        <div className="text-center">
                            <h3 className="font-pixel text-lg text-retro-pink mb-2">PLAYER 2</h3>
                            <ConsoleSearchSelect 
                                options={allConsoles} 
                                value={right.slug} 
                                onChange={(slug) => handleSelectConsole('right', slug)} 
                                disabled={right.loading}
                            />
                        </div>

                        {right.loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-retro-pink border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : right.details ? (
                            <div className="animate-fadeIn flex-1 flex flex-col">
                                {right.details.variants && right.details.variants.length > 1 && (
                                    <div className="mb-4">
                                        <label className="text-[10px] font-mono text-gray-500 block mb-1">SELECT VARIANT</label>
                                        <select 
                                            className="w-full bg-retro-grid/20 border border-gray-700 text-white font-mono text-xs p-2 outline-none focus:border-retro-pink"
                                            value={right.selectedVariant?.id || ''}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectVariant('right', e.target.value)}
                                        >
                                            {right.details.variants.map(v => (
                                                <option key={v.id} value={v.id}>{v.variant_name} {v.is_default ? '(Base)' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex-1 relative min-h-[200px] flex items-center justify-center bg-gradient-to-b from-transparent to-retro-pink/5 p-4 border border-white/5 mb-4 group">
                                    {right.selectedVariant?.image_url ? (
                                        <Image 
                                            src={right.selectedVariant.image_url} 
                                            alt="Right Console" 
                                            width={400} 
                                            height={400} 
                                            className="object-contain max-h-48 w-auto drop-shadow-xl group-hover:scale-105 transition-transform" 
                                        />
                                    ) : (
                                        <div className="font-pixel text-retro-grid text-4xl opacity-30">NO IMAGE</div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <div className="font-pixel text-sm text-white">{right.details.name}</div>
                                    {right.selectedVariant && (
                                        <div className="font-mono text-xs text-retro-pink">{right.selectedVariant.variant_name}</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-600 font-mono text-sm border-2 border-dashed border-gray-800">
                                WAITING FOR SELECTION...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* COMPARISON MATRIX */}
            {left.selectedVariant && right.selectedVariant && (
                <div className="animate-slideDown">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-retro-grid"></div>
                        <h3 className="font-pixel text-xl text-white">DATA MATRIX</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-retro-grid"></div>
                    </div>

                    <div className="bg-black/50 border-2 border-retro-grid shadow-2xl overflow-hidden">
                        {/* Headers */}
                        <div className="grid grid-cols-3 bg-retro-grid/20 border-b-2 border-retro-grid text-[10px] font-pixel text-gray-400 py-2 uppercase tracking-widest">
                            <div className="text-center border-r border-retro-grid">{left.details?.name}</div>
                            <div className="text-center">METRIC</div>
                            <div className="text-center border-l border-retro-grid">{right.details?.name}</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-retro-grid/10">
                            {METRICS.map((metric, idx) => (
                                <ComparisonRow 
                                    key={idx} 
                                    metric={metric} 
                                    varA={left.selectedVariant!} 
                                    varB={right.selectedVariant!} 
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <Button 
                            variant="secondary" 
                            onClick={() => {
                                setLeft(prev => ({ ...prev, slug: null, details: null, selectedVariant: null }));
                                setRight(prev => ({ ...prev, slug: null, details: null, selectedVariant: null }));
                                router.replace('/arena');
                            }}
                        >
                            RESET SIMULATION
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<RetroLoader />}>
            <ArenaContent />
        </Suspense>
    );
}
