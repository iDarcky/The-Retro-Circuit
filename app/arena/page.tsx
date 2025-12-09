'use client';

import { useState, useEffect, useRef, Suspense, type FC } from 'react';
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
    // --- IDENTITY ---
    { label: 'Release Year', key: 'release_year', type: 'number' },
    { label: 'Launch Price', key: 'price_launch_usd', type: 'currency', lowerIsBetter: true },
    { label: 'Model Number', key: 'model_no', type: 'string' },
    { label: 'OS / Firmware', key: 'os', type: 'string' },
    { label: 'UI Skin', key: 'ui_skin', type: 'string' },

    // --- DISPLAY ---
    { label: 'Screen Size', key: 'screen_size_inch', type: 'number', unit: '"' },
    { label: 'Resolution', key: 'screen_resolution_x', type: 'resolution' },
    { label: 'Display Type', key: 'display_type', type: 'string' },
    { label: 'Display Tech', key: 'display_tech', type: 'string' },
    { label: 'Refresh Rate', key: 'refresh_rate_hz', type: 'number', unit: 'Hz' },
    { label: 'Pixel Density', key: 'ppi', type: 'number', unit: 'PPI' },
    { label: 'Brightness', key: 'brightness_nits', type: 'number', unit: ' nits' },
    { label: 'Touchscreen', key: 'touchscreen', type: 'boolean' },
    { label: 'Aspect Ratio', key: 'aspect_ratio', type: 'string' },
    { label: '2nd Screen Size', key: 'second_screen_size', type: 'number', unit: '"' },
    { label: '2nd Screen Touch', key: 'second_screen_touch', type: 'boolean' },

    // --- PROCESSING ---
    { label: 'CPU Model', key: 'cpu_model', type: 'string' },
    { label: 'CPU Arch', key: 'cpu_architecture', type: 'string' },
    { label: 'Process Node', key: 'cpu_process_node', type: 'string' },
    { label: 'CPU Cores', key: 'cpu_cores', type: 'number' },
    { label: 'CPU Threads', key: 'cpu_threads', type: 'number' },
    { label: 'CPU Clock', key: 'cpu_clock_mhz', type: 'number', unit: ' MHz' },
    
    { label: 'GPU Model', key: 'gpu_model', type: 'string' },
    { label: 'GPU Arch', key: 'gpu_architecture', type: 'string' },
    { label: 'GPU Cores', key: 'gpu_cores', type: 'number' },
    { label: 'GPU Units', key: 'gpu_core_unit', type: 'string' },
    { label: 'GPU Clock', key: 'gpu_clock_mhz', type: 'number', unit: ' MHz' },
    { label: 'Compute Power', key: 'gpu_teraflops', type: 'number', unit: ' TFLOPS' },

    // --- MEMORY & STORAGE ---
    { label: 'RAM', key: 'ram_gb', type: 'number', unit: ' GB' },
    { label: 'RAM Type', key: 'ram_type', type: 'string' },
    { label: 'RAM Speed', key: 'ram_speed_mhz', type: 'number', unit: ' MHz' },
    { label: 'Storage', key: 'storage_gb', type: 'number', unit: ' GB' },
    { label: 'Storage Type', key: 'storage_type', type: 'string' },
    { label: 'Expandable', key: 'storage_expandable', type: 'boolean' },

    // --- POWER ---
    { label: 'Battery Capacity', key: 'battery_mah', type: 'number', unit: ' mAh' },
    { label: 'Battery Energy', key: 'battery_wh', type: 'number', unit: ' Wh' },
    { label: 'Charging Speed', key: 'charging_speed_w', type: 'number', unit: 'W' },
    { label: 'Charging Port', key: 'charging_port', type: 'string' },
    { label: 'TDP', key: 'tdp_range_w', type: 'string' },

    // --- CONNECTIVITY & IO ---
    { label: 'Wireless', key: 'wireless_connectivity', type: 'string' },
    { label: 'Cellular', key: 'cellular_connectivity', type: 'boolean' },
    { label: 'Video Output', key: 'video_out', type: 'string' },
    { label: 'Ports', key: 'ports', type: 'string' },
    
    // --- AUDIO & MISC ---
    { label: 'Speakers', key: 'audio_speakers', type: 'string' },
    { label: 'Audio Tech', key: 'audio_tech', type: 'string' },
    { label: 'Headphone Jack', key: 'headphone_jack', type: 'boolean' },
    { label: 'Microphone', key: 'microphone', type: 'boolean' },
    { label: 'Camera', key: 'camera', type: 'boolean' },
    { label: 'Biometrics', key: 'biometrics', type: 'boolean' },

    // --- CONTROLS & SENSORS ---
    { label: 'Input Layout', key: 'input_layout', type: 'string' },
    { label: 'D-Pad', key: 'dpad_type', type: 'string' },
    { label: 'D-Pad Mech', key: 'dpad_mechanism', type: 'string' },
    { label: 'D-Pad Shape', key: 'dpad_shape', type: 'string' },
    { label: 'Analog Sticks', key: 'analog_stick_type', type: 'string' },
    { label: 'Stick Mech', key: 'thumbstick_mechanism', type: 'string' },
    { label: 'Stick Layout', key: 'thumbstick_layout', type: 'string' },
    { label: 'Stick Cap', key: 'thumbstick_cap', type: 'string' },
    { label: 'Triggers', key: 'trigger_mechanism', type: 'string' },
    { label: 'Shoulders', key: 'shoulder_buttons', type: 'string' },
    { label: 'Action Buttons', key: 'action_button_mechanism', type: 'string' },
    { label: 'Back Buttons', key: 'has_back_buttons', type: 'boolean' },
    { label: 'Haptics', key: 'haptics', type: 'string' },
    { label: 'Gyroscope', key: 'gyro', type: 'boolean' },

    // --- PHYSICAL ---
    { label: 'Dimensions', key: 'dimensions', type: 'string' },
    { label: 'Weight', key: 'weight_g', type: 'number', unit: 'g', lowerIsBetter: true },
    { label: 'Body Material', key: 'body_material', type: 'string' },
    { label: 'Cooling', key: 'cooling', type: 'string' },
    { label: 'Colors', key: 'colors', type: 'string' },
];

interface SelectionState {
    slug: string | null;
    details: ConsoleDetails | null;
    selectedVariant: ConsoleVariant | null;
    loading: boolean;
}

// --- HELPER COMPONENTS ---

interface ComparisonRowProps {
    metric: ComparisonMetric;
    varA: ConsoleVariant;
    varB: ConsoleVariant;
    showDiffOnly: boolean;
}

const ComparisonRow: FC<ComparisonRowProps> = ({ 
    metric, 
    varA, 
    varB,
    showDiffOnly
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
    onSelect: (slug: string, name: string) => void;
    placeholder?: string;
    themeColor: 'cyan' | 'pink';
    currentSelection?: string;
}

const ConsoleSearch: FC<ConsoleSearchProps> = ({ consoles, onSelect, placeholder = "SELECT SYSTEM...", themeColor, currentSelection }) => {
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
        onSelect(slug, name);
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
                className={`w-full bg-black/60 border-2 ${borderColor} p-2 font-mono text-xs ${textColor} outline-none uppercase shadow-inner transition-all text-center`}
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
    const { playClick } = useSound();

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
            {/* Gap-20 provides safe separation. No negative margins. Flex wrap on mobile. */}
            <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 min-h-[400px] mb-12 px-4 md:px-0">
                
                {/* VS Badge (Absolute Center) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none md:block hidden">
                     <div className="relative">
                        <h2 className="font-pixel text-6xl text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10 relative">VS</h2>
                        <div className="absolute inset-0 blur-xl bg-white/30 rounded-full"></div>
                     </div>
                </div>

                {/* --- PLAYER 1 (LEFT) --- */}
                {/* Fixed size on desktop: w-[300px] h-[320px] */}
                <div className="relative w-full max-w-xs md:w-[300px] h-[400px] md:h-[320px] group z-20 focus-within:z-30">
                    <div className={styles.fighterCardContainer}>
                        {/* Inner Content: Counter Skewed */}
                        <div className={styles.fighterCardContent}>
                            
                            <div className="w-full mb-4">
                                <h3 className="font-pixel text-lg text-retro-neon text-center mb-2">PLAYER 1</h3>
                                <ConsoleSearch 
                                    consoles={allConsoles} 
                                    onSelect={(slug) => handleSelect('a', slug)}
                                    themeColor="cyan"
                                    currentSelection={left.details?.name}
                                />
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                                {left.loading ? (
                                    <div className="animate-spin w-8 h-8 border-2 border-retro-neon border-t-transparent rounded-full"></div>
                                ) : left.details ? (
                                    <>
                                        {/* Image - Compacted */}
                                        <div className="relative w-full h-32 mb-4 flex items-center justify-center">
                                            <img 
                                                src={left.selectedVariant?.image_url || left.details.image_url} 
                                                className="max-h-full max-w-full object-contain drop-shadow-2xl animate-slideDown"
                                                alt={left.details.name}
                                            />
                                        </div>

                                        {/* Variant Selector */}
                                        {left.details.variants && left.details.variants.length > 1 && (
                                            <div className="w-full max-w-[180px]">
                                                <select 
                                                    className="w-full bg-black/50 border border-retro-neon text-retro-neon font-mono text-[10px] p-1 outline-none text-center appearance-none cursor-pointer hover:bg-retro-neon hover:text-black transition-colors"
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
                                    <div className="text-retro-neon/30 font-pixel text-4xl animate-pulse">?</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PLAYER 2 (RIGHT) --- */}
                {/* Fixed size on desktop: w-[300px] h-[320px] */}
                <div className="relative w-full max-w-xs md:w-[300px] h-[400px] md:h-[320px] group z-20 focus-within:z-30">
                    <div className={styles.fighterCardContainerP2}>
                        {/* Inner Content: Counter Skewed */}
                        <div className={styles.fighterCardContentP2}>
                            
                            <div className="w-full mb-4">
                                <h3 className="font-pixel text-lg text-retro-pink text-center mb-2">PLAYER 2</h3>
                                <ConsoleSearch 
                                    consoles={allConsoles} 
                                    onSelect={(slug) => handleSelect('b', slug)}
                                    themeColor="pink"
                                    currentSelection={right.details?.name}
                                />
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                                {right.loading ? (
                                    <div className="animate-spin w-8 h-8 border-2 border-retro-pink border-t-transparent rounded-full"></div>
                                ) : right.details ? (
                                    <>
                                        {/* Image - Compacted */}
                                        <div className="relative w-full h-32 mb-4 flex items-center justify-center">
                                            <img 
                                                src={right.selectedVariant?.image_url || right.details.image_url} 
                                                className="max-h-full max-w-full object-contain drop-shadow-2xl animate-slideDown"
                                                alt={right.details.name}
                                            />
                                        </div>

                                        {/* Variant Selector */}
                                        {right.details.variants && right.details.variants.length > 1 && (
                                            <div className="w-full max-w-[180px]">
                                                <select 
                                                    className="w-full bg-black/50 border border-retro-pink text-retro-pink font-mono text-[10px] p-1 outline-none text-center appearance-none cursor-pointer hover:bg-retro-pink hover:text-black transition-colors"
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
                                    <div className="text-retro-pink/30 font-pixel text-4xl animate-pulse">?</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* --- COMPARISON TABLE --- */}
            {left.selectedVariant && right.selectedVariant && (
                <div className="animate-fadeIn max-w-4xl mx-auto">
                    
                    {/* Controls */}
                    <div className="flex justify-center mb-8">
                        <button 
                            onClick={() => setShowDiffOnly(!showDiffOnly)}
                            className={`
                                px-4 py-2 font-mono text-xs border transition-all
                                ${showDiffOnly 
                                    ? 'bg-retro-neon text-black border-retro-neon font-bold' 
                                    : 'bg-transparent text-retro-neon border-retro-neon hover:bg-retro-neon/10'}
                            `}
                        >
                            {showDiffOnly ? 'SHOW ALL SPECS' : 'SHOW DIFFERENCES ONLY'}
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-black/80 border border-retro-grid backdrop-blur-sm">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 py-4 border-b-2 border-retro-grid bg-white/5 font-pixel text-[10px] md:text-xs text-center sticky top-0 z-10 backdrop-blur-md">
                            <div className="col-span-4 text-cyan-400 truncate px-2">{left.details?.name}</div>
                            <div className="col-span-4 text-gray-500">METRIC</div>
                            <div className="col-span-4 text-fuchsia-500 truncate px-2">{right.details?.name}</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-retro-grid/30">
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
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center">
                <div className="font-pixel text-retro-neon animate-pulse">LOADING ARENA...</div>
            </div>
        }>
            <ArenaContent />
        </Suspense>
    );
}
