
'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConsoleDetails, ConsoleSpecs, GameOfTheWeekData } from '../../lib/types';
import CollectionToggle from '../ui/CollectionToggle';

interface ConsoleDetailViewProps {
  consoleData: ConsoleDetails;
  games: GameOfTheWeekData[];
}

// Helper component for table rows
const SpecRow = ({ label, value, highlight = false }: { label: string, value?: string | number | boolean, highlight?: boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    
    let displayValue = value;
    if (typeof value === 'boolean') {
        displayValue = value ? 'YES' : 'NO';
    }

    return (
        <tr className="border-b border-retro-grid/50 last:border-0 hover:bg-white/5 transition-colors">
            <td className="py-3 px-2 md:px-4 font-mono text-xs uppercase text-gray-400 w-1/3 md:w-1/4 align-top">
                {label}
            </td>
            <td className={`py-3 px-2 md:px-4 font-mono text-sm ${highlight ? 'text-retro-neon font-bold' : 'text-gray-200'}`}>
                {displayValue}
            </td>
        </tr>
    );
};

// Helper component for sections
const SpecSection = ({ title, children }: { title: string, children?: ReactNode }) => (
    <div className="mb-0 border-b border-retro-grid last:border-0">
        <h3 className="bg-retro-grid/20 text-retro-blue font-pixel text-xs px-4 py-2 uppercase tracking-wider border-b border-retro-grid/30">
            {title}
        </h3>
        <table className="w-full">
            <tbody>{children}</tbody>
        </table>
    </div>
);

const ConsoleDetailView: FC<ConsoleDetailViewProps> = ({ consoleData, games }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedVariantId, setSelectedVariantId] = useState<string>('base');
    const [mergedSpecs, setMergedSpecs] = useState<ConsoleSpecs>(consoleData.specs);
    
    // Determine which variants are available
    const variants = consoleData.variants || [];
    const hasVariants = variants.length > 0;

    // Handle URL param for initial state
    useEffect(() => {
        const variantSlug = searchParams?.get('variant');
        if (variantSlug) {
            const variant = variants.find(v => v.slug === variantSlug);
            if (variant) setSelectedVariantId(variant.id);
        }
    }, [searchParams, variants]);

    // Update specs when variant changes
    useEffect(() => {
        if (selectedVariantId === 'base') {
            setMergedSpecs(consoleData.specs);
        } else {
            const variant = variants.find(v => v.id === selectedVariantId);
            if (variant) {
                // Merge base specs with variant overrides.
                // We use spread to ensure even fields missing in baseSpecs are picked up from the variant.
                setMergedSpecs({ ...consoleData.specs, ...variant });
            }
        }
    }, [selectedVariantId, consoleData.specs, variants]);

    const handleVariantChange = (id: string) => {
        setSelectedVariantId(id);
        
        // Update URL without full reload
        const params = new URLSearchParams(searchParams?.toString());
        if (id === 'base') {
            params.delete('variant');
        } else {
            const v = variants.find(v => v.id === id);
            if (v?.slug) params.set('variant', v.slug);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const currentImage = selectedVariantId === 'base' 
        ? consoleData.image_url 
        : (variants.find(v => v.id === selectedVariantId)?.image_url || consoleData.image_url);

    const currentYear = selectedVariantId === 'base'
        ? consoleData.release_year
        : (variants.find(v => v.id === selectedVariantId)?.release_year || consoleData.release_year);

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            {/* Navigation & Actions */}
            <div className="mb-8 flex justify-between items-start border-b-4 border-retro-grid pb-6">
                <div>
                     <Link href="/console" className="inline-block text-xs font-mono text-retro-blue hover:text-retro-neon transition-colors mb-2">
                        &lt; BACK TO CONSOLE VAULT
                     </Link>
                     <h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[4px_4px_0_rgba(0,255,157,0.5)] leading-tight uppercase">
                        {consoleData.name}
                     </h1>
                     <div className="flex gap-4 font-mono text-sm text-gray-400 mt-2">
                        <Link href={`/console/brand/${consoleData.manufacturer?.slug}`} className="hover:text-retro-neon transition-colors">
                            {consoleData.manufacturer?.name.toUpperCase()}
                        </Link>
                        <span>//</span>
                        <span>{currentYear}</span>
                        <span>//</span>
                        <span>{consoleData.generation}</span>
                     </div>
                </div>
                <div className="mt-6 md:mt-0">
                    <CollectionToggle 
                        itemId={consoleData.slug} 
                        itemType="CONSOLE" 
                        itemName={consoleData.name} 
                        itemImage={currentImage}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Left Column: Image, Variants, Intro */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-black border-2 border-retro-grid p-6 flex items-center justify-center min-h-[300px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        {currentImage ? (
                            <img src={currentImage} alt={consoleData.name} className="max-w-full max-h-[300px] object-contain drop-shadow-lg transition-all duration-300" key={currentImage} />
                        ) : (
                            <div className="text-retro-grid font-pixel text-4xl">?</div>
                        )}
                        {/* Badge */}
                        <div className="absolute top-4 left-4 bg-retro-neon text-black text-xs font-bold px-2 py-1 transform -rotate-2">
                            {consoleData.form_factor?.toUpperCase()}
                        </div>
                    </div>

                    {/* Variant Selector */}
                    {hasVariants && (
                        <div className="bg-retro-grid/10 border border-retro-blue p-4">
                            <label className="block font-pixel text-xs text-retro-blue mb-2">SELECT MODEL / VARIANT</label>
                            <select 
                                value={selectedVariantId}
                                onChange={(e) => handleVariantChange(e.target.value)}
                                className="w-full bg-black border border-retro-grid text-white p-2 font-mono text-sm focus:border-retro-neon outline-none"
                            >
                                <option value="base">ORIGINAL / BASE MODEL</option>
                                {variants.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.name.toUpperCase()} ({v.release_year})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="bg-retro-dark border border-retro-grid p-6">
                        <h3 className="font-pixel text-xs text-retro-blue mb-4">SYSTEM OVERVIEW</h3>
                        <p className="font-mono text-gray-300 leading-relaxed text-sm">
                            {consoleData.description}
                        </p>
                    </div>
                </div>

                {/* Right Column: Specs */}
                <div className="lg:col-span-2">
                    <div className="bg-retro-dark border-2 border-retro-grid">
                        <div className="bg-retro-grid/20 px-6 py-4 border-b border-retro-grid flex justify-between items-center">
                            <h2 className="font-pixel text-lg text-white">
                                {selectedVariantId === 'base' ? 'TECHNICAL SPECIFICATIONS' : `${variants.find(v => v.id === selectedVariantId)?.name.toUpperCase()} SPECS`}
                            </h2>
                            <span className="font-mono text-xs text-retro-neon animate-pulse">● DECLASSIFIED</span>
                        </div>
                        
                        <div className="p-0">
                            {/* Pass merged specs to display */}
                            <SpecSection title="Processing & OS">
                                <SpecRow label="CPU Model" value={mergedSpecs.cpu_model} highlight />
                                <SpecRow label="CPU Cores" value={mergedSpecs.cpu_cores} />
                                <SpecRow label="GPU Model" value={mergedSpecs.gpu_model} />
                                <SpecRow label="GPU Cores" value={mergedSpecs.gpu_cores} />
                                <SpecRow label="Operating System" value={mergedSpecs.os} />
                            </SpecSection>

                            <SpecSection title="Display & Output">
                                <SpecRow label="Max Output" value={mergedSpecs.max_resolution_output} highlight />
                                <SpecRow label="Display Type" value={mergedSpecs.display_type} />
                                <SpecRow label="Media Type" value={consoleData.media} />
                            </SpecSection>

                             <SpecSection title="Connectivity & Ports">
                                <SpecRow label="Ports" value={mergedSpecs.ports} />
                                <SpecRow label="Wireless / Net" value={mergedSpecs.connectivity} />
                            </SpecSection>

                            <SpecSection title="Input / Controller">
                                <SpecRow label="Input Layout" value={mergedSpecs.input_layout} />
                                <SpecRow label="D-Pad" value={mergedSpecs.dpad_type} />
                                <SpecRow label="Analog Sticks" value={mergedSpecs.analog_stick_type} />
                                <SpecRow label="Shoulder Btns" value={mergedSpecs.shoulder_buttons} />
                                <SpecRow label="Rear Buttons" value={mergedSpecs.has_back_buttons} />
                            </SpecSection>

                            <SpecSection title="Market Data">
                                <SpecRow label="Units Sold" value={consoleData.units_sold} highlight />
                                <SpecRow label="Best Seller" value={consoleData.best_selling_game} />
                            </SpecSection>
                        </div>
                    </div>
                </div>
            </div>

            {/* Linked Games Section */}
            {games.length > 0 && (
                <div className="mt-16 pt-8 border-t-2 border-retro-grid">
                    <h3 className="font-pixel text-2xl text-retro-pink mb-6">NOTABLE SOFTWARE LIBRARY</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {games.map((game) => (
                            <Link 
                                key={game.id} 
                                href={`/archive/${game.slug || game.id}`}
                                className="group block bg-black border border-retro-grid hover:border-retro-pink transition-all"
                            >
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    {game.image ? (
                                        <img src={game.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-pixel text-xs text-center p-2">NO COVER</div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <div className="font-pixel text-[10px] text-white truncate group-hover:text-retro-pink">{game.title}</div>
                                    <div className="font-mono text-[10px] text-gray-500">{game.year}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsoleDetailView;
