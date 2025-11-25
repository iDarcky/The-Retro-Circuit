
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchConsoleBySlug } from '../services/geminiService';
import { ConsoleDetails } from '../types';
import Button from './Button';
import RetroLoader from './RetroLoader';
import CollectionToggle from './CollectionToggle';

const ConsoleSpecs: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [consoleData, setConsoleData] = useState<ConsoleDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await fetchConsoleBySlug(slug);
      setConsoleData(data);
      setLoading(false);
    };
    loadData();
  }, [slug]);

  const handleEbaySearch = () => {
      if (!consoleData) return;
      const query = encodeURIComponent(`${consoleData.name} console`);
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${query}`, '_blank');
  };

  if (loading) return <RetroLoader />;

  if (!consoleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="font-pixel text-retro-pink text-2xl mb-4">ERROR 404</h2>
        <p className="font-mono text-gray-400 mb-8">CONSOLE DATA NOT FOUND IN ARCHIVE.</p>
        <Link to="/consoles">
          <Button variant="secondary">RETURN TO DATABASE</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8 border-b-4 border-retro-grid pb-6 flex flex-col md:flex-row justify-between items-end">
        <div>
           <div className="flex gap-2 mb-2">
              <span className="font-mono text-xs text-retro-dark bg-retro-neon px-2 py-0.5 font-bold">
                  GEN {consoleData.generation}
              </span>
              <span className="font-mono text-xs text-retro-blue border border-retro-blue px-2 py-0.5">
                  {consoleData.type.toUpperCase()}
              </span>
           </div>
           <h1 className="text-4xl md:text-5xl font-pixel text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
             {consoleData.name}
           </h1>
           <p className="font-mono text-retro-pink mt-2 text-lg">
             MANUFACTURED BY {consoleData.manufacturer.toUpperCase()} // EST. {consoleData.release_year}
           </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
            <div className="flex gap-2 mb-2">
                <Link to="/consoles">
                    <Button variant="secondary" className="text-xs py-2">BACK TO LIST</Button>
                </Link>
                <button 
                    onClick={handleEbaySearch}
                    className="bg-blue-600/20 border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-2 font-mono text-xs transition-colors flex items-center gap-2"
                    title="Search on eBay"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    BUY ON EBAY
                </button>
            </div>
            <div className="w-64">
                <CollectionToggle 
                    itemId={consoleData.slug || consoleData.id} 
                    itemType="CONSOLE" 
                    itemName={consoleData.name} 
                    itemImage={consoleData.image_url}
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Col: Image & Market Data */}
         <div className="space-y-6">
            <div className="aspect-square bg-retro-grid/20 border-2 border-retro-grid flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                {consoleData.image_url ? (
                    <img src={consoleData.image_url} alt={consoleData.name} className="w-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                ) : (
                    <div className="text-center">
                        <div className="font-pixel text-6xl text-retro-grid mb-4">?</div>
                        <div className="font-mono text-xs text-gray-500">NO VISUAL RECORD</div>
                    </div>
                )}
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-retro-neon"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-retro-neon"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-retro-neon"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-retro-neon"></div>
            </div>

            <div className="bg-retro-dark border border-retro-grid p-6">
                <h3 className="font-pixel text-xs text-retro-blue mb-4 border-b border-retro-grid pb-2">MARKET PERFORMANCE</h3>
                <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">TOTAL UNITS</span>
                        <span className="text-white">{consoleData.units_sold}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">LAUNCH PRICE</span>
                        <span className="text-retro-neon">{consoleData.launch_price}</span>
                    </div>
                    {consoleData.inflation_price && (
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs italic">INFLATION ADJ.</span>
                            <span className="text-gray-400 text-xs italic">{consoleData.inflation_price}</span>
                        </div>
                    )}
                    <div>
                        <span className="text-gray-500 block mb-1">BEST SELLING TITLE</span>
                        <span className="text-retro-pink block truncate">{consoleData.best_selling_game}</span>
                    </div>
                </div>
            </div>
         </div>

         {/* Right Col: Specs & Info */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-retro-grid/10 p-6 border-l-4 border-retro-neon">
                <h3 className="font-pixel text-sm text-retro-neon mb-4">SYSTEM OVERVIEW</h3>
                <p className="font-mono text-gray-300 leading-relaxed whitespace-pre-line">
                    {consoleData.intro_text}
                </p>
            </div>

            {/* Core Tech */}
            <div>
                <h3 className="font-pixel text-xl text-white mb-6 flex items-center gap-4">
                    TECHNICAL SPECS
                    <div className="flex-1 h-px bg-retro-grid"></div>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'CPU', value: consoleData.cpu },
                        { label: 'GPU', value: consoleData.gpu },
                        { label: 'MEMORY (RAM)', value: consoleData.ram },
                        { label: 'MEDIA FORMAT', value: consoleData.media },
                        { label: 'AUDIO CHIP', value: consoleData.audio },
                        { label: 'RESOLUTION', value: consoleData.resolution },
                        { label: 'DISPLAY TYPE', value: consoleData.display_type },
                        { label: 'STORAGE', value: consoleData.storage },
                    ].map((spec, i) => (
                        spec.value ? (
                            <div key={i} className="bg-retro-dark border border-retro-grid p-4 hover:border-retro-blue transition-colors group">
                                <label className="block font-mono text-[10px] text-gray-500 mb-1 group-hover:text-retro-blue transition-colors">{spec.label}</label>
                                <div className="font-mono text-sm text-retro-neon">{spec.value}</div>
                            </div>
                        ) : null
                    ))}
                </div>
            </div>

            {/* Physical & IO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Physical */}
                 <div className="bg-retro-dark border border-retro-grid p-6">
                    <h3 className="font-pixel text-xs text-retro-pink mb-4 border-b border-retro-grid pb-2">PHYSICAL CHASSIS</h3>
                    <div className="space-y-4 font-mono text-sm">
                        {consoleData.dimensions && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">DIMENSIONS</span>
                                <span className="text-white text-right">{consoleData.dimensions}</span>
                            </div>
                        )}
                        {consoleData.weight && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">WEIGHT</span>
                                <span className="text-white text-right">{consoleData.weight}</span>
                            </div>
                        )}
                        {consoleData.casing && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">MATERIAL</span>
                                <span className="text-white text-right">{consoleData.casing}</span>
                            </div>
                        )}
                         {consoleData.power_supply && (
                            <div className="flex justify-between border-t border-retro-grid/30 pt-4 mt-4">
                                <span className="text-gray-500">POWER</span>
                                <span className="text-white text-right">{consoleData.power_supply}</span>
                            </div>
                        )}
                        {consoleData.battery_life && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">BATTERY</span>
                                <span className="text-retro-neon text-right">{consoleData.battery_life}</span>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* I/O */}
                 <div className="bg-retro-dark border border-retro-grid p-6">
                    <h3 className="font-pixel text-xs text-retro-blue mb-4 border-b border-retro-grid pb-2">I/O PORTS</h3>
                    {consoleData.ports && consoleData.ports.length > 0 ? (
                        <ul className="list-disc list-inside font-mono text-sm text-retro-neon space-y-1">
                            {consoleData.ports.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    ) : (
                        <span className="font-mono text-xs text-gray-500">NO PORT DATA AVAILABLE</span>
                    )}
                     {consoleData.connectivity && (
                        <div className="mt-4 pt-4 border-t border-retro-grid/50">
                             <span className="text-gray-500 text-xs block mb-1">NETWORK/EXPANSION</span>
                             <span className="text-white font-mono text-sm">{consoleData.connectivity}</span>
                        </div>
                    )}
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConsoleSpecs;
