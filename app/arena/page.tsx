'use client';

import { useState, useEffect, useRef, Suspense, type FC, type ChangeEvent } from 'react';
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

const ComparisonRow: FC<ComparisonRowProps & { key?: string }> = ({ 
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
    const { playHover } = useSound();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = consoles.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const borderColor = themeColor === 'cyan' ? 'border-retro-neon' : 'border-retro-pink';
    const textColor = themeColor === 'cyan' ? 'text-retro-neon' : 'text-retro-pink';
    const focusColor = themeColor === 'cyan' ? 'focus:border-retro-neon' : 'focus:border-retro-pink';

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <input 
                type="text"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder={currentSelection || placeholder}
                className={`w-full bg-black/80 border-b-2 ${borderColor} p-2 font-mono text-xs md:text-sm text-white outline-none ${focusColor} transition-colors placeholder-gray-500`}
            />
            {isOpen && (
                <div className={`absolute left-0 right-0 top-full max-h-60 overflow-y-auto bg-black border border-gray-700 z-[100] custom-scrollbar`}>
                    {filtered.map(c => (
                        <div 
                            key={c.slug}
                            onClick={() => {
                                onSelect(c.slug, c.name);
                                setSearchTerm('');
                                setIsOpen(false);
                            }}
                            onMouseEnter={playHover}
                            className={`p-2 text-xs font-mono cursor-pointer hover:bg-white/10 ${textColor} border-b border-white/5`}
                        >
                            {c.name}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-2 text-xs font-mono text-gray-600">NO MATCHES</div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE CONTENT ---

function VSModeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playClick } = useSound();

    const [allConsoles, setAllConsoles] = useState<{name: string, slug: string}[]>([]);
    
    // Player 1 State (Cyan)
    const [selectionA, setSelectionA] = useState<SelectionState>({
        slug: null, details: null, selectedVariant: null, loading: false
    });

    // Player 2 State (Pink)
    const [selectionB, setSelectionB] = useState<SelectionState>({
        slug: null, details: null, selectedVariant: null, loading: false
    });
    
    const [showDiffOnly, setShowDiffOnly] = useState(false);

    // Initial Load: Console List
    useEffect(() => {
        fetchConsoleList().then((list) => setAllConsoles(list));
    }, []);

    // Helper: Fetch Logic
    const loadSelection = async (slug: string, variantSlug: string | null, setSelection: React.Dispatch<React.SetStateAction<SelectionState>>) => {
        setSelection(prev => ({ ...prev, loading: true, slug }));
        
        const details = await fetchConsoleBySlug(slug);
        
        if (details) {
            const variants = details.variants || [];
            let variant = null;
            if (variantSlug) {
                variant = variants.find(v => v.slug === variantSlug) || null;
            }
            if (!variant && variants.length > 0) {
                variant = variants.find(v => v.is_default) || variants[0];
            }

            setSelection({
                slug,
                details,
                selectedVariant: variant,
                loading: false
            });
        } else {
             setSelection(prev => ({ ...prev, loading: false }));
        }
    };

    // 1. Sync State with URL Params
    useEffect(() => {
        const p1Slug = searchParams?.get('p1') || searchParams?.get('c1');
        const v1Slug = searchParams?.get('v1');
        
        const p2Slug = searchParams?.get('p2') || searchParams?.get('c2');
        const v2Slug = searchParams?.get('v2');

        if (p1Slug && p1Slug !== selectionA.slug) {
            loadSelection(p1Slug, v1Slug, setSelectionA);
        }
        if (p2Slug && p2Slug !== selectionB.slug) {
            loadSelection(p2Slug, v2Slug, setSelectionB);
        }
    }, [searchParams]);

    // Update URL Helper
    const updateUrl = (side: 'a' | 'b', slug: string, variantSlug?: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        
        if (side === 'a') {
            params.set('p1', slug);
            if (variantSlug) params.set('v1', variantSlug); else params.delete('v1');
        } else {
            params.set('p2', slug);
            if (variantSlug) params.set('v2', variantSlug); else params.delete('v2');
        }
        
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleSelect = (side: 'a' | 'b', slug: string) => {
        playClick();
        // Just update URL, effect handles fetch
        updateUrl(side, slug);
    };

    const handleVariantChange = (side: 'a' | 'b', variantSlug: string) => {
        const currentSlug = side === 'a' ? selectionA.slug : selectionB.slug;
        if (currentSlug) {
            updateUrl(side, currentSlug, variantSlug);
            // Manually update state for instant feedback
            if (side === 'a' && selectionA.details) {
                const v = selectionA.details.variants?.find(v => v.slug === variantSlug) || null;
                setSelectionA(prev => ({ ...prev, selectedVariant: v }));
            } else if (side === 'b' && selectionB.details) {
                const v = selectionB.details.variants?.find(v => v.slug === variantSlug) || null;
                setSelectionB(prev => ({ ...prev, selectedVariant: v }));
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
            
            {/* HEADERS */}
            <div className="text-center mb-8 relative z-10">
                <h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2">
                    VS MODE
                </h1>
                <p className="font-mono text-gray-400 text-xs md:text-sm">
                    SPECIFICATION SHOWDOWN
                </p>
                <div className="mt-4">
                    <button 
                        onClick={() => setShowDiffOnly(!showDiffOnly)}
                        className={`text-[10px] font-mono border px-3 py-1 uppercase transition-all ${showDiffOnly ? 'bg-white text-black border-white' : 'text-gray-500 border-gray-700 hover:border-white'}`}
                    >
                        {showDiffOnly ? 'Show All Specs' : 'Show Differences Only'}
                    </button>
                </div>
            </div>

            {/* ARENA STAGE (Flex Gap Layout) */}
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-20 mb-12 relative">
                
                {/* VS BADGE (Centered Absolutely) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                     <div className="font-pixel text-6xl text-white drop-shadow-[4px_4px_0_#000] italic animate-pulse">VS</div>
                </div>

                {/* PLAYER 1 CARD */}
                <div className={`w-full md:w-[300px] h-auto md:h-[320px] relative z-10 ${styles.fighterCardContainer}`}>
                     <div className={styles.fighterCardContent}>
                         <div className="mb-4">
                             <div className="font-pixel text-xs text-retro-neon mb-1">PLAYER 1</div>
                             <ConsoleSearch 
                                consoles={allConsoles} 
                                onSelect={(s) => handleSelect('a', s)} 
                                themeColor="cyan"
                                currentSelection={selectionA.details?.name}
                             />
                         </div>
                         
                         {selectionA.loading ? (
                             <div className="flex-1 flex items-center justify-center font-mono text-retro-neon animate-pulse text-xs">LOADING...</div>
                         ) : selectionA.details ? (
                             <div className="flex-1 flex flex-col">
                                 {/* Image Area */}
                                 <div className="flex-1 relative flex items-center justify-center bg-black/30 border border-white/10 mb-4 overflow-hidden">
                                     <img 
                                        src={selectionA.selectedVariant?.image_url || selectionA.details.image_url || ''} 
                                        className="max-h-32 max-w-full object-contain drop-shadow-lg"
                                     />
                                     <div className="absolute bottom-1 right-1 font-mono text-[9px] text-gray-500">{selectionA.details.manufacturer?.name}</div>
                                 </div>
                                 {/* Variant Selector */}
                                 {(selectionA.details.variants?.length || 0) > 1 && (
                                     <select 
                                        className="w-full bg-black/50 border border-retro-neon/30 text-retro-neon text-[10px] font-mono p-1 outline-none"
                                        value={selectionA.selectedVariant?.slug || ''}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleVariantChange('a', e.target.value)}
                                     >
                                         {selectionA.details.variants?.map(v => (
                                             <option key={v.id} value={v.slug}>{v.variant_name}</option>
                                         ))}
                                     </select>
                                 )}
                             </div>
                         ) : (
                             <div className="flex-1 flex items-center justify-center font-mono text-gray-600 text-xs text-center p-4 border border-dashed border-gray-800">
                                 SELECT A FIGHTER
                             </div>
                         )}
                     </div>
                </div>

                {/* PLAYER 2 CARD */}
                <div className={`w-full md:w-[300px] h-auto md:h-[320px] relative z-10 ${styles.fighterCardContainerP2}`}>
                     <div className={styles.fighterCardContentP2}>
                         <div className="mb-4 text-right">
                             <div className="font-pixel text-xs text-retro-pink mb-1">PLAYER 2</div>
                             <ConsoleSearch 
                                consoles={allConsoles} 
                                onSelect={(s) => handleSelect('b', s)} 
                                themeColor="pink"
                                currentSelection={selectionB.details?.name}
                             />
                         </div>
                         
                         {selectionB.loading ? (
                             <div className="flex-1 flex items-center justify-center font-mono text-retro-pink animate-pulse text-xs">LOADING...</div>
                         ) : selectionB.details ? (
                             <div className="flex-1 flex flex-col">
                                 {/* Image Area */}
                                 <div className="flex-1 relative flex items-center justify-center bg-black/30 border border-white/10 mb-4 overflow-hidden">
                                     <img 
                                        src={selectionB.selectedVariant?.image_url || selectionB.details.image_url || ''} 
                                        className="max-h-32 max-w-full object-contain drop-shadow-lg"
                                     />
                                     <div className="absolute bottom-1 left-1 font-mono text-[9px] text-gray-500">{selectionB.details.manufacturer?.name}</div>
                                 </div>
                                 {/* Variant Selector */}
                                 {(selectionB.details.variants?.length || 0) > 1 && (
                                     <select 
                                        className="w-full bg-black/50 border border-retro-pink/30 text-retro-pink text-[10px] font-mono p-1 outline-none text-right"
                                        value={selectionB.selectedVariant?.slug || ''}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleVariantChange('b', e.target.value)}
                                     >
                                         {selectionB.details.variants?.map(v => (
                                             <option key={v.id} value={v.slug}>{v.variant_name}</option>
                                         ))}
                                     </select>
                                 )}
                             </div>
                         ) : (
                             <div className="flex-1 flex items-center justify-center font-mono text-gray-600 text-xs text-center p-4 border border-dashed border-gray-800">
                                 SELECT A FIGHTER
                             </div>
                         )}
                     </div>
                </div>
            </div>

            {/* COMPARISON TABLE */}
            <div className="relative z-0 max-w-4xl mx-auto w-full bg-black/40 border border-retro-grid backdrop-blur-sm p-4 md:p-8 shadow-2xl">
                {selectionA.selectedVariant && selectionB.selectedVariant ? (
                    <div className="space-y-1">
                        {METRICS.map((metric) => (
                            <ComparisonRow 
                                key={metric.key}
                                metric={metric}
                                varA={selectionA.selectedVariant!}
                                varB={selectionB.selectedVariant!}
                                showDiffOnly={showDiffOnly}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="font-pixel text-gray-600 text-sm animate-pulse">AWAITING CHALLENGERS...</p>
                    </div>
                )}
            </div>
            
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-retro-dark text-retro-neon font-pixel">LOADING ARENA...</div>}>
            <VSModeContent />
        </Suspense>
    );
}