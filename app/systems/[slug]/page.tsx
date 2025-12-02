import Link from 'next/link';
import { createClient } from '../../../utils/supabase/server';
import { ConsoleDetails, GameOfTheWeekData } from '../../../types';
import Button from '../../../components/ui/Button';
import CollectionToggle from '../../../components/ui/CollectionToggle';
import { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = createClient();
    const { data } = await supabase.from('consoles').select('name, intro_text, image_url, manufacturer').eq('slug', params.slug).single();
    
    if (!data) return { title: 'Unknown Hardware' };
  
    return {
      title: `${data.name} Specs`,
      description: data.intro_text.substring(0, 160),
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
const SpecSection = ({ title, children }: { title: string, children: ReactNode }) => (
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
  const supabase = createClient();
  
  // Parallel Fetching
  const [consoleRes, gamesRes] = await Promise.all([
    supabase.from('consoles').select('*').eq('slug', params.slug).single(),
    supabase.from('games').select('*').eq('console_slug', params.slug).order('year', { ascending: true })
  ]);

  const consoleData: ConsoleDetails | null = consoleRes.data;
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
        <p className="font-mono text-gray-400 mb-8">CONSOLE DATA NOT FOUND IN ARCHIVE.</p>
        <Link href="/systems">
          <Button variant="secondary">RETURN TO DATABASE</Button>
        </Link>
      </div>
    );
  }

  const ebayQuery = encodeURIComponent(`${consoleData.name} console`);
  
  // Schema for Product (Hardware)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": consoleData.name,
    "image": consoleData.image_url,
    "description": consoleData.intro_text.substring(0, 160),
    "brand": {
      "@type": "Brand",
      "name": consoleData.manufacturer
    },
    "releaseDate": consoleData.release_year.toString(),
    "manufacturer": {
      "@type": "Organization",
      "name": consoleData.manufacturer
    },
    "category": "Video Game Consoles"
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-0 md:p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Main Container - GSM Arena Style Sheet */}
      <div className="bg-retro-dark md:border border-retro-grid shadow-2xl overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="p-6 border-b border-retro-grid relative bg-gradient-to-r from-retro-dark to-retro-grid/10">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-black bg-retro-neon px-2 py-0.5 font-bold rounded-sm">
                        GEN {consoleData.generation}
                    </span>
                    <span className="font-mono text-[10px] text-retro-blue border border-retro-blue px-2 py-0.5 rounded-sm">
                        {consoleData.type.toUpperCase()}
                    </span>
                    <Link href={`/systems/brand/${consoleData.manufacturer}`} className="font-mono text-[10px] text-gray-400 hover:text-white border-b border-gray-600 hover:border-white transition-colors">
                        {consoleData.manufacturer.toUpperCase()}
                    </Link>
                </div>
                
                <h1 className="font-pixel text-3xl md:text-5xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    {consoleData.name}
                </h1>

                <div className="flex flex-wrap gap-3 mt-2">
                    <a 
                        href={`https://www.ebay.com/sch/i.html?_nkw=${ebayQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500 px-3 py-1 font-mono text-xs transition-colors h-fit"
                    >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                         FIND MARKET VALUE
                    </a>
                    <Link 
                        href={`/arena?preselect=${consoleData.slug}`}
                        className="flex items-center gap-2 bg-retro-pink/20 hover:bg-retro-pink text-retro-pink hover:text-black border border-retro-pink px-3 py-1 font-mono text-xs transition-colors h-fit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        COMPARE SPECS
                    </Link>
                    <div className="flex-1"></div>
                    <CollectionToggle 
                        itemId={consoleData.slug} 
                        itemType="CONSOLE" 
                        itemName={consoleData.name}
                        itemImage={consoleData.image_url} 
                    />
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row">
            {/* LEFT COLUMN: IMAGE & INTRO */}
            <div className="lg:w-1/3 bg-black/40 border-r border-retro-grid p-6 flex flex-col gap-6">
                <div className="aspect-square bg-transparent flex items-center justify-center p-4 border border-retro-grid/30 relative group">
                    {consoleData.image_url ? (
                        <img src={consoleData.image_url} alt={consoleData.name} className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="text-retro-grid font-pixel text-4xl opacity-20">NO IMAGE</div>
                    )}
                </div>

                <div className="bg-retro-grid/5 p-4 border border-retro-grid/20">
                    <h3 className="font-pixel text-xs text-retro-blue mb-2">SYSTEM BRIEF</h3>
                    <p className="font-mono text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                        {consoleData.intro_text}
                    </p>
                </div>
            </div>

            {/* RIGHT COLUMN: SPECS TABLES */}
            <div className="lg:w-2/3 bg-retro-dark">
                
                <SpecSection title="Launch & Market">
                    <SpecRow label="Release Date" value={`${consoleData.release_year}`} highlight />
                    <SpecRow label="Discontinued" value={consoleData.discontinued_date || "N/A"} />
                    <SpecRow label="Launch Price" value={consoleData.launch_price} />
                    <SpecRow label="Units Sold" value={consoleData.units_sold} highlight />
                    <SpecRow label="Adjusted Price" value={consoleData.inflation_price ? `${consoleData.inflation_price} (Inflation Adj.)` : undefined} />
                </SpecSection>

                <SpecSection title="Internal Hardware">
                    <SpecRow label="CPU" value={consoleData.cpu} highlight />
                    <SpecRow label="GPU" value={consoleData.gpu} />
                    <SpecRow label="Memory (RAM)" value={consoleData.ram} />
                    <SpecRow label="Media Type" value={consoleData.media} />
                    <SpecRow label="Storage" value={consoleData.storage} />
                    <SpecRow label="Audio Chip" value={consoleData.audio} />
                </SpecSection>

                <SpecSection title="Body & Display">
                    <SpecRow label="Dimensions" value={consoleData.dimensions} />
                    <SpecRow label="Weight" value={consoleData.weight} />
                    <SpecRow label="Casing" value={consoleData.casing} />
                    <SpecRow label="Display Type" value={consoleData.display_type} />
                    <SpecRow label="Resolution" value={consoleData.resolution} />
                </SpecSection>

                <SpecSection title="Connectivity & Power">
                    <SpecRow label="I/O Ports" value={consoleData.ports?.join(', ')} />
                    <SpecRow label="Connectivity" value={consoleData.connectivity} />
                    <SpecRow label="Power Supply" value={consoleData.power_supply} />
                    <SpecRow label="Battery Life" value={consoleData.battery_life} />
                </SpecSection>

                <SpecSection title="Software Library">
                    <SpecRow label="Best Selling Game" value={consoleData.best_selling_game} highlight />
                </SpecSection>

            </div>
        </div>

        {/* RELATED GAMES FOOTER */}
        {mappedGames.length > 0 && (
            <div className="p-6 border-t border-retro-grid bg-retro-dark">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-pixel text-retro-neon text-lg">NOTABLE GAMES</h3>
                    <Link href="/archive" className="font-mono text-xs text-retro-blue hover:text-white">VIEW FULL ARCHIVE &gt;</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mappedGames.slice(0, 6).map(game => (
                        <Link href={`/archive/${game.slug || game.id}`} key={game.id} className="group block">
                            <div className="aspect-[3/4] bg-black border border-retro-grid mb-2 overflow-hidden relative">
                                {game.image ? (
                                    <img src={game.image} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-retro-grid text-xs font-pixel">IMG</div>
                                )}
                            </div>
                            <div className="font-pixel text-[10px] text-gray-400 group-hover:text-retro-neon truncate">
                                {game.title}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
}