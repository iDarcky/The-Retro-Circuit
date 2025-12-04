
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { ConsoleDetails, GameOfTheWeekData } from '../../../lib/types';
import Button from '../../../components/ui/Button';
import CollectionToggle from '../../../components/ui/CollectionToggle';
import { ReactNode } from 'react';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props) {
    const supabase = await createClient();
    const { data } = await supabase.from('consoles').select('name, description, image_url, manufacturer:manufacturer(name)').eq('slug', params.slug).single();
    
    if (!data) return { title: 'Unknown Hardware' };
  
    return {
      title: `${data.name} Specs`,
      description: data.description?.substring(0, 160) || 'Specs unavailable.',
      openGraph: {
        images: data.image_url ? [data.image_url] : []
      }
    };
}

// Helper component for table rows
const SpecRow = ({ label, value, highlight = false }: { label: string, value?: string, highlight?: boolean }) => {
    if (!value) return null;
    return (
        <tr className="border-b border-retro-grid/50 last:border-0 hover:bg-white/5 transition-colors">
            <td className="py-3 px-2 md:px-4 font-mono text-xs uppercase text-gray-400 w-1/3 md:w-1/4 align-top">
                {label}
            </td>
            <td className={`py-3 px-2 md:px-4 font-mono text-sm ${highlight ? 'text-retro-neon font-bold' : 'text-gray-200'}`}>
                {value}
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

export default async function ConsoleSpecsPage({ params }: Props) {
  const supabase = await createClient();
  
  // Parallel Fetching with Joins
  const [consoleRes, gamesRes] = await Promise.all([
    supabase
        .from('consoles')
        .select('*, manufacturer:manufacturer(*), specs:console_specs(*)')
        .eq('slug', params.slug)
        .single(),
    supabase.from('games').select('*').eq('console_slug', params.slug).order('year', { ascending: true })
  ]);

  const consoleData: any = consoleRes.data;
  const games = (gamesRes.data || []) as any[];
  
  // Map games to type
  const mappedGames: GameOfTheWeekData[] = games.map(g => ({
    id: g.id,
    slug: g.slug,
    title: g.title,
    developer: g.developer,
    year: g.year,
    genre: g.genre,
    content: g.content,
    whyItMatters: g.why_it_matters,
    rating: g.rating,
    image: g.image,
    console_slug: g.console_slug
  }));

  if (!consoleData) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="font-pixel text-retro-pink text-2xl mb-4">ERROR 404</h2>
            <p className="font-mono text-gray-400 mb-8">SYSTEM ARCHIVE NOT FOUND.</p>
            <Link href="/console">
                <Button variant="secondary">RETURN TO VAULT</Button>
            </Link>
        </div>
    );
  }

  // Handle specs whether it returns as an array (common with Supabase joins) or a single object
  const rawSpecs = consoleData.specs;
  const specs = Array.isArray(rawSpecs) ? (rawSpecs[0] || {}) : (rawSpecs || {});

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
                    <span>{consoleData.release_year}</span>
                    <span>//</span>
                    <span>{consoleData.generation}</span>
                 </div>
            </div>
            <div className="mt-6 md:mt-0">
                <CollectionToggle 
                    itemId={consoleData.slug} 
                    itemType="CONSOLE" 
                    itemName={consoleData.name} 
                    itemImage={consoleData.image_url}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column: Image & Intro */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-black border-2 border-retro-grid p-6 flex items-center justify-center min-h-[300px] relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    {consoleData.image_url ? (
                        <img src={consoleData.image_url} alt={consoleData.name} className="max-w-full max-h-[300px] object-contain drop-shadow-lg" />
                    ) : (
                        <div className="text-retro-grid font-pixel text-4xl">?</div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-retro-neon text-black text-xs font-bold px-2 py-1 transform -rotate-2">
                        {consoleData.form_factor?.toUpperCase()}
                    </div>
                </div>

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
                        <h2 className="font-pixel text-lg text-white">TECHNICAL SPECIFICATIONS</h2>
                        <span className="font-mono text-xs text-retro-neon animate-pulse">● DECLASSIFIED</span>
                    </div>
                    
                    <div className="p-0">
                        <SpecSection title="Processing Unit">
                            <SpecRow label="CPU" value={specs.cpu} highlight />
                            <SpecRow label="GPU" value={specs.gpu} />
                            <SpecRow label="Memory (RAM)" value={specs.ram} />
                        </SpecSection>

                        <SpecSection title="Media & Storage">
                            <SpecRow label="Media Type" value={specs.media} />
                            <SpecRow label="Internal Storage" value={specs.storage} />
                        </SpecSection>

                        <SpecSection title="Audio / Video">
                            <SpecRow label="Max Resolution" value={specs.resolution} />
                            <SpecRow label="Display" value={specs.display_type} />
                        </SpecSection>

                         <SpecSection title="Physical & I/O">
                            {specs.dimensions && <SpecRow label="Dimensions" value={specs.dimensions} />}
                            {specs.weight && <SpecRow label="Weight" value={specs.weight} />}
                            {specs.ports && <SpecRow label="Ports" value={specs.ports} />}
                            {specs.connectivity && <SpecRow label="Connectivity" value={specs.connectivity} />}
                            {specs.power_supply && <SpecRow label="Power" value={specs.power_supply} />}
                            {specs.battery_life && <SpecRow label="Battery Life" value={specs.battery_life} />}
                        </SpecSection>

                        <SpecSection title="Market Data">
                            <SpecRow label="Units Sold" value={specs.units_sold} highlight />
                            <SpecRow label="Launch Price" value={specs.launch_price} />
                            <SpecRow label="Inflation Adj." value={specs.launch_price_inflation} />
                            <SpecRow label="Best Seller" value={specs.best_selling_game} />
                        </SpecSection>
                    </div>
                </div>
            </div>
        </div>

        {/* Linked Games Section */}
        {mappedGames.length > 0 && (
            <div className="mt-16 pt-8 border-t-2 border-retro-grid">
                <h3 className="font-pixel text-2xl text-retro-pink mb-6">NOTABLE SOFTWARE LIBRARY</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mappedGames.map((game) => (
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
}
