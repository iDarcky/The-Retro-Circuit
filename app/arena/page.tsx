
'use client';

import { useState, useEffect, useRef, Suspense, type FC, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
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
    { label: 'GPU Units', key: 'gpu_compute_units', type: 'string' },
    { label: 'GPU Clock', key: 'gpu_clock_mhz', type: 'number', unit: ' MHz' },
    { label: 'Compute Power', key: 'gpu_teraflops', type: 'number', unit: ' TFLOPS' },

    // --- MEMORY & STORAGE ---
    { label: 'RAM', key: 'ram_mb', type: 'number', unit: ' MB' },
    { label: 'RAM Type', key: 'ram_type', type: 'string' },
    { label: 'RAM Speed', key: 'ram_speed_mhz', type: 'number', unit: ' MHz' },
    { label: 'Storage', key: 'storage_gb', type: 'number', unit: ' GB' },
    { label: 'Storage Type', key: 'storage_type', type: 'string' },
    { label: 'Expandable', key: 'storage_expandable', type: 'boolean' },

    // --- POWER ---
    { label: 'Battery Capacity', key: 'battery_capacity_mah', type: 'number', unit: ' mAh' },
    { label: 'Battery Energy', key: 'battery_capacity_wh', type: 'number', unit: ' Wh' },
    { label: 'Charging Speed', key: 'charging_speed_w', type: 'number', unit: 'W' },
    // charging_tech is handled via charging_speed_w display logic, but can keep as fallback if needed
    { label: 'TDP', key: 'tdp_wattage', type: 'number', unit: 'W' },

    // --- CONNECTIVITY & IO ---
    { label: 'Wi-Fi', key: 'wifi_specs', type: 'string' },
    { label: 'Bluetooth', key: 'bluetooth_specs', type: 'string' },
    { label: 'Cellular', key: 'cellular_connectivity', type: 'boolean' },
    { label: 'Video Output', key: 'video_out', type: 'string' },
    { label: 'Ports', key: 'ports', type: 'string' },
    
    // --- AUDIO & MISC ---
    { label: 'Speakers', key: 'audio_speakers', type: 'string' },
    { label: 'Audio Tech', key: 'audio_tech', type: 'string' },
    { label: 'Headphone Jack', key: 'has_headphone_jack', type: 'boolean' },
    { label: 'Microphone', key: 'has_microphone', type: 'boolean' },
    { label: 'Camera', key: 'camera_specs', type: 'string' },
    { label: 'Biometrics', key: 'biometrics', type: 'string' },

    // --- CONTROLS & SENSORS ---
    { label: 'Input Layout', key: 'input_layout', type: 'string' },
    { label: 'D-Pad Mech', key: 'dpad_mechanism', type: 'string' },
    { label: 'D-Pad Shape', key: 'dpad_shape', type: 'string' },
    { label: 'Stick Mech', key: 'thumbstick_mechanism', type: 'string' },
    { label: 'Stick Layout', key: 'thumbstick_layout', type: 'string' },
    { label: 'Stick Cap', key: 'thumbstick_cap', type: 'string' },
    { label: 'Triggers', key: 'trigger_mechanism', type: 'string' },
    { label: 'Shoulders', key: 'shoulder_layout', type: 'string' },
    { label: 'Action Buttons', key: 'action_button_mechanism', type: 'string' },
    { label: 'Back Buttons', key: 'has_back_buttons', type: 'boolean' },
    { label: 'Haptics', key: 'haptics', type: 'string' },
    { label: 'Gyroscope', key: 'gyro', type: 'boolean' },

    // --- PHYSICAL ---
    { label: 'Width (mm)', key: 'width_mm', type: 'number' },
    { label: 'Height (mm)', key: 'height_mm', type: 'number' },
    { label: 'Thickness (mm)', key: 'depth_mm', type: 'number' },
    { label: 'Weight', key: 'weight_g', type: 'number', unit: 'g', lowerIsBetter: true },
    { label: 'Body Material', key: 'body_material', type: 'string' },
    { label: 'Cooling', key: 'cooling_solution', type: 'string' },
    { label: 'Colors', key: 'available_colors', type: 'string' },
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

    const formatValue = (val: any, variant: ConsoleVariant) => {
        if (!exists(val)) return <span className="text-gray-700">---</span>;
        
        // Smart RAM Formatting
        if (metric.key === 'ram_mb') {
            const mb = Number(val);
            if (!isNaN(mb) && mb >= 1024) {
                return `${(mb / 1024).toFixed(0)} GB`;
            }
            return `${mb} MB`;
        }

        // Charging Tech Combination
        if (metric.key === 'charging_speed_w') {
            const tech = variant.charging_tech;
            return (
                <span>
                    {val}W
                    {tech && <span className="text-[10px] text-gray-500 ml-1 block md:inline">({tech})</span>}
                </span>
            );
        }

        if (metric.type === 'boolean') return (val === true || val === 'true') ? 'YES' : 'NO';
        if (metric.type === 'currency') return `$${val}`;
        if (metric.type === 'resolution' && variant.screen_resolution_y) return `${val}p`; 
        
        return `${val}${metric.unit ? metric.unit : ''}`;
    };

    const getResString = (v: ConsoleVariant) => {
        if (v.screen_resolution_x && v.screen_resolution_y) return `${v.screen_resolution_x} x ${v.screen_resolution_y}`;
        return '---';
    };

    const valDisplayA = metric.type === 'resolution' ? getResString(varA) : formatValue(rawA, varA);
    const valDisplayB = metric.type === 'resolution' ? getResString(varB) : formatValue(rawB, varB);

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
    const loadSelection = async (slug: string, variantSlug: string | null, setSelection: Dispatch<SetStateAction<SelectionState>>) => {
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

    // Parse URL Params
    useEffect(() => {
        const p1 = searchParams?.get('p1');
        const v1 = searchParams?.get('v1');
        const p2 = searchParams?.get('p2');
        const v2 = searchParams?.get('v2');

        if (p1 && p1 !== selectionA.slug) loadSelection(p1, v1 || null, setSelectionA);
        if (p2 && p2 !== selectionB.slug) loadSelection(p2, v2 || null, setSelectionB);
    }, [searchParams]);

    const updateUrl = (p1?: string | null, v1?: string | null, p2?: string | null, v2?: string | null) => {
        const params = new URLSearchParams();
        
        const finalP1 = p1 !== undefined ? p1 : selectionA.slug;
        const finalV1 = v1 !== undefined ? v1 : selectionA.selectedVariant?.slug;
        const finalP2 = p2 !== undefined ? p2 : selectionB.slug;
        const finalV2 = v2 !== undefined ? v2 : selectionB.selectedVariant?.slug;

        if (finalP1) params.set('p1', finalP1);
        if (finalV1) params.set('v1', finalV1);
        if (finalP2) params.set('p2', finalP2);
        if (finalV2) params.set('v2', finalV2);

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleSelectP1 = (slug: string) => {
        setSelectionA(prev => ({ ...prev, slug, loading: true }));
        updateUrl(slug, null, undefined, undefined); 
        playClick();
    };

    const handleSelectP2 = (slug: string) => {
        setSelectionB(prev => ({ ...prev, slug, loading: true }));
        updateUrl(undefined, undefined, slug, null);
        playClick();
    };

    const handleVariantChangeA = (e: ChangeEvent<HTMLSelectElement>) => {
        const slug = e.target.value;
        const variant = selectionA.details?.variants?.find(v => v.slug === slug) || null;
        setSelectionA(prev => ({ ...prev, selectedVariant: variant }));
        updateUrl(undefined, slug, undefined, undefined);
    };

    const handleVariantChangeB = (e: ChangeEvent<HTMLSelectElement>) => {
        const slug = e.target.value;
        const variant = selectionB.details?.variants?.find(v => v.slug === slug) || null;
        setSelectionB(prev => ({ ...prev, selectedVariant: variant }));
        updateUrl(undefined, undefined, undefined, slug);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col min-h-screen">
            <h1 className="text-3xl md:text-5xl font-pixel text-center text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                VS MODE <span className="text-retro-neon">ARENA</span>
            </h1>

            {/* FIGHTER SELECT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative">
                
                {/* VS Badge (Desktop Center) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-black rounded-full items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    <span className="font-pixel text-xl italic text-white">VS</span>
                </div>

                {/* Player 1 Card */}
                <div className={`p-6 border-2 border-retro-neon bg-retro-neon/5 relative min-h-[300px] flex flex-col ${styles.fighterCardContainer}`}>
                     {/* Skew fix wrapper */}
                     <div className={styles.fighterCardContent}>
                        <h2 className="font-pixel text-retro-neon mb-4">PLAYER 1</h2>
                        
                        <ConsoleSearch 
                            consoles={allConsoles} 
                            onSelect={handleSelectP1} 
                            themeColor="cyan"
                            currentSelection={selectionA.details?.name}
                        />

                        {selectionA.loading ? (
                             <div className="flex-1 flex items-center justify-center text-retro-neon font-mono animate-pulse">LOADING SPEC SHEET...</div>
                        ) : selectionA.details ? (
                             <div className="mt-6 flex-1 flex flex-col items-center animate-fadeIn">
                                 <div className="relative w-full h-32 mb-4">
                                     {selectionA.selectedVariant?.image_url || selectionA.details.image_url ? (
                                         <img src={selectionA.selectedVariant?.image_url || selectionA.details.image_url} className="w-full h-full object-contain drop-shadow-lg" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center text-retro-neon opacity-50 font-pixel">NO IMAGE</div>
                                     )}
                                 </div>
                                 <h3 className="font-pixel text-xl text-white text-center mb-1">{selectionA.details.name}</h3>
                                 <div className="font-mono text-xs text-retro-neon mb-4">{selectionA.details.manufacturer?.name}</div>

                                 {/* Variant Selector */}
                                 {selectionA.details.variants && selectionA.details.variants.length > 0 && (
                                     <select 
                                        className="w-full bg-black border border-retro-neon text-retro-neon font-mono text-xs p-2 outline-none"
                                        value={selectionA.selectedVariant?.slug || ''}
                                        onChange={handleVariantChangeA}
                                     >
                                         {selectionA.details.variants.map(v => (
                                             <option key={v.id} value={v.slug}>{v.variant_name}</option>
                                         ))}
                                     </select>
                                 )}
                             </div>
                        ) : (
                             <div className="flex-1 flex items-center justify-center text-gray-600 font-pixel text-xs opacity-50">
                                 SELECT FIGHTER
                             </div>
                        )}
                     </div>
                </div>

                {/* Player 2 Card */}
                <div className={`p-6 border-2 border-retro-pink bg-retro-pink/5 relative min-h-[300px] flex flex-col ${styles.fighterCardContainerP2}`}>
                     {/* Skew fix wrapper */}
                     <div className={styles.fighterCardContentP2}>
                        <h2 className="font-pixel text-retro-pink mb-4 text-right">PLAYER 2</h2>
                        
                        <ConsoleSearch 
                            consoles={allConsoles} 
                            onSelect={handleSelectP2} 
                            themeColor="pink"
                            currentSelection={selectionB.details?.name}
                        />

                        {selectionB.loading ? (
                             <div className="flex-1 flex items-center justify-center text-retro-pink font-mono animate-pulse">LOADING SPEC SHEET...</div>
                        ) : selectionB.details ? (
                             <div className="mt-6 flex-1 flex flex-col items-center animate-fadeIn">
                                 <div className="relative w-full h-32 mb-4">
                                     {selectionB.selectedVariant?.image_url || selectionB.details.image_url ? (
                                         <img src={selectionB.selectedVariant?.image_url || selectionB.details.image_url} className="w-full h-full object-contain drop-shadow-lg" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center text-retro-pink opacity-50 font-pixel">NO IMAGE</div>
                                     )}
                                 </div>
                                 <h3 className="font-pixel text-xl text-white text-center mb-1">{selectionB.details.name}</h3>
                                 <div className="font-mono text-xs text-retro-pink mb-4">{selectionB.details.manufacturer?.name}</div>

                                 {/* Variant Selector */}
                                 {selectionB.details.variants && selectionB.details.variants.length > 0 && (
                                     <select 
                                        className="w-full bg-black border border-retro-pink text-retro-pink font-mono text-xs p-2 outline-none"
                                        value={selectionB.selectedVariant?.slug || ''}
                                        onChange={handleVariantChangeB}
                                     >
                                         {selectionB.details.variants.map(v => (
                                             <option key={v.id} value={v.slug}>{v.variant_name}</option>
                                         ))}
                                     </select>
                                 )}
                             </div>
                        ) : (
                             <div className="flex-1 flex items-center justify-center text-gray-600 font-pixel text-xs opacity-50">
                                 SELECT FIGHTER
                             </div>
                        )}
                     </div>
                </div>

            </div>

            {/* COMPARISON TABLE */}
            {selectionA.selectedVariant && selectionB.selectedVariant && (
                <div className="bg-black/80 border border-gray-800 p-4 mb-12 animate-slideDown shadow-2xl">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                        <h3 className="font-pixel text-lg text-white">TALE OF THE TAPE</h3>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={showDiffOnly} 
                                onChange={() => setShowDiffOnly(!showDiffOnly)}
                                className="accent-retro-neon" 
                            />
                            <span className="font-mono text-xs text-gray-400 uppercase">Show Differences Only</span>
                        </label>
                    </div>

                    <div className="space-y-1">
                        {METRICS.map(metric => (
                            <ComparisonRow 
                                key={metric.key} 
                                metric={metric} 
                                varA={selectionA.selectedVariant!} 
                                varB={selectionB.selectedVariant!}
                                showDiffOnly={showDiffOnly}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-retro-neon font-mono">LOADING ARENA...</div>}>
            <VSModeContent />
        </Suspense>
    );
}
