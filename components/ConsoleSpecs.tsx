
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchConsoleBySlug, fetchGamesForConsole } from '../services/geminiService';
import { ConsoleDetails, GameOfTheWeekData } from '../types';
import Button from './Button';
import RetroLoader from './RetroLoader';
import CollectionToggle from './CollectionToggle';
import SEOHead from './SEOHead';

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
const SpecSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-0 border-b border-retro-grid last:border-0">
        <h3 className="bg-retro-grid/20 text-retro-blue font-pixel text-xs px-4 py-2 uppercase tracking-wider border-b border-retro-grid/30">
            {title}
        </h3>
        <table className="w-full">
            <tbody>{children}</tbody>
        </table>
    </div>
);

const ConsoleSpecs: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [consoleData, setConsoleData] = useState<ConsoleDetails | null>(null);
  const [games, setGames] = useState<GameOfTheWeekData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await fetchConsoleBySlug(slug);
      setConsoleData(data);
      if (data) {
          const gameList = await fetchGamesForConsole(slug);
          setGames(gameList);
      }
      setLoading(false);
    };
    loadData();
  }, [slug]);

  const handleEbaySearch = () => {
      if (!consoleData) return;
      const query = encodeURIComponent(`${consoleData.name} console`);
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${query}`, '_blank');
  };

  const handleCompare = () => {
      if (!consoleData) return;
      navigate(`/comparer?preselect=${consoleData.slug}`);
  };

  if (loading) return <RetroLoader />;

  if (!consoleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <SEOHead title="Unknown Hardware" description="Hardware specification not found." />
        <h2 className="font-pixel text-retro-pink text-2xl mb-4">ERROR 404</h2>
        <p className="font-mono text-gray-400 mb-8">CONSOLE DATA NOT FOUND IN ARCHIVE.</p>
        <Link to="/consoles">
          <Button variant="secondary">RETURN TO DATABASE</Button>
        </Link>
      </div>
    );
  }

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
      <SEOHead 
        title={`${consoleData.name} Specs & History`} 
        description={`Full specifications, history, and market data for the ${consoleData.manufacturer} ${consoleData.name}. Released in ${consoleData.release_year}.`}
        image={consoleData.image_url}
        type="product"
        structuredData={productSchema}
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
                    <Link to={`/consoles/brand/${consoleData.manufacturer}`} className="font-mono text-[10px] text-gray-400 hover:text-white border-b border-gray-600 hover:border-white transition-colors">
                        {consoleData.manufacturer.toUpperCase()}
                    </Link>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-pixel text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    {consoleData.name}
                </h1>
                
                {/* Action Bar */}
                <div className="flex flex-wrap gap-3 mt-2">
                    <CollectionToggle 
                        itemId={consoleData.slug || consoleData.id} 
                        itemType="CONSOLE" 
                        itemName={consoleData.name} 
                        itemImage={consoleData.image_url}
                    />
                    <Button onClick={handleCompare} variant="secondary" className="text-xs py-1 h-full">
                        VS. COMPARE
                    </Button>
                    <button 
                        onClick={handleEbaySearch}
                        className="bg-blue-900/30 border border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white px-3 py-1 font-mono text-xs transition-colors flex items-center gap-2"
                    >
                        FIND ON EBAY
                    </button>
                </div>
            </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT COLUMN: VISUALS & QUICK STATS (lg:col-span-4) */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-retro-grid bg-black/20">
                <div className="p-6">
                    <div className="aspect-square bg-white/5 border border-retro-grid flex items-center justify-center p-8 relative overflow-hidden mb-6">
                        {consoleData.image_url ? (
                            <img src={consoleData.image_url} alt={consoleData.name} className="w-full h-full object-contain drop-shadow-xl" />
                        ) : (
                            <div className="text-center opacity-30">
                                <div className="font-pixel text-4xl text-retro-grid">NO IMG</div>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                             <div className="w-2 h-2 bg-retro-neon rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.8)]"></div>
                        </div>
                    </div>

                    {/* Intro Text / Synopsis */}
                    <div className="mb-6">
                        <h4 className="font-pixel text-xs text-retro-pink mb-2">SYSTEM BRIEF</h4>
                        <p className="font-mono text-xs text-gray-400 leading-relaxed text-justify">
                            {consoleData.intro_text}
                        </p>
                    </div>

                    {/* Quick Market Stats */}
                    <div className="border-t border-retro-grid pt-4">
                         <div className="flex justify-between items-center mb-2">
                             <span className="font-mono text-xs text-gray-500">RELEASED</span>
                             <span className="font-mono text-sm text-white">{consoleData.release_year}</span>
                         </div>
                         <div className="flex justify-between items-center mb-2">
                             <span className="font-mono text-xs text-gray-500">SOLD</span>
                             <span className="font-mono text-sm text-white">{consoleData.units_sold || 'N/A'}</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="font-mono text-xs text-gray-500">PRICE (LAUNCH)</span>
                             <span className="font-mono text-sm text-retro-neon">{consoleData.launch_price || 'N/A'}</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: DETAILED SPECS TABLE (lg:col-span-8) */}
            <div className="lg:col-span-8 bg-retro-dark">
                
                {/* Launch Category */}
                <SpecSection title="Launch">
                    <SpecRow label="Announced" value={consoleData.release_year.toString()} />
                    <SpecRow label="Status" value={consoleData.discontinued_date ? `Discontinued (${consoleData.discontinued_date})` : 'Discontinued'} />
                </SpecSection>

                {/* Body Category */}
                <SpecSection title="Body">
                    <SpecRow label="Dimensions" value={consoleData.dimensions} />
                    <SpecRow label="Weight" value={consoleData.weight} />
                    <SpecRow label="Build" value={consoleData.casing} />
                </SpecSection>

                {/* Platform Category */}
                <SpecSection title="Platform">
                    <SpecRow label="CPU" value={consoleData.cpu} highlight />
                    <SpecRow label="GPU" value={consoleData.gpu} highlight />
                    <SpecRow label="Media" value={consoleData.media} />
                    <SpecRow label="Audio Chip" value={consoleData.audio} />
                </SpecSection>

                {/* Memory Category */}
                <SpecSection title="Memory">
                    <SpecRow label="Internal (RAM)" value={consoleData.ram} />
                    <SpecRow label="Storage" value={consoleData.storage} />
                </SpecSection>

                {/* Display Category (Often relevant for handhelds) */}
                <SpecSection title="Display">
                    <SpecRow label="Resolution" value={consoleData.resolution} />
                    <SpecRow label="Type" value={consoleData.display_type} />
                </SpecSection>

                {/* Comms/Ports Category */}
                <SpecSection title="Comms">
                    <SpecRow label="Ports" value={consoleData.ports?.join(", ")} />
                    <SpecRow label="Network" value={consoleData.connectivity} />
                </SpecSection>

                 {/* Power Category */}
                 <SpecSection title="Battery">
                    <SpecRow label="Type" value={consoleData.power_supply} />
                    <SpecRow label="Life" value={consoleData.battery_life} />
                </SpecSection>

                {/* Misc Category */}
                <SpecSection title="Misc">
                    <SpecRow label="Best Seller" value={consoleData.best_selling_game} highlight />
                    <SpecRow label="Inflation Adj." value={consoleData.inflation_price} />
                </SpecSection>

            </div>
        </div>

        {/* RELATED GAMES SECTION (Footer of the sheet) */}
        {games.length > 0 && (
            <div className="border-t border-retro-grid p-6 bg-black/20">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-pixel text-sm text-retro-neon">TOP TITLES</h3>
                    <Link to="/games" className="text-[10px] font-mono text-retro-blue hover:text-white uppercase">See All Games &gt;</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                    {games.map(game => (
                        <Link to={`/games/${game.slug || game.id}`} key={game.id} className="snap-start flex-shrink-0 w-32 group">
                            <div className="aspect-[3/4] bg-black border border-retro-grid mb-2 overflow-hidden relative">
                                {game.image ? (
                                    <img src={game.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-retro-grid font-pixel text-xs">NO ART</div>
                                )}
                            </div>
                            <div className="font-pixel text-[10px] text-gray-300 truncate group-hover:text-retro-neon">{game.title}</div>
                            <div className="font-mono text-[9px] text-gray-500">{game.year}</div>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ConsoleSpecs;
