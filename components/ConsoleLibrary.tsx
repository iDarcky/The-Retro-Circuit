import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllConsoles } from '../services/geminiService';
import { ConsoleDetails } from '../types';
import RetroLoader from './RetroLoader';

const ConsoleLibrary: React.FC = () => {
  const [consoles, setConsoles] = useState<ConsoleDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConsoles = async () => {
      setLoading(true);
      const data = await fetchAllConsoles();
      setConsoles(data);
      setLoading(false);
    };
    loadConsoles();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-pixel text-retro-neon mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
          HARDWARE DATABASE
        </h2>
        <p className="font-mono text-gray-400">Select a system to view confidential specifications.</p>
      </div>

      {loading ? (
        <RetroLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consoles.length === 0 ? (
             <div className="col-span-full text-center p-12 border-2 border-dashed border-retro-grid">
                 <p className="font-mono text-gray-500">DATABASE EMPTY. INITIALIZE TABLES.</p>
             </div>
          ) : (
            consoles.map((console) => (
                <Link 
                    to={`/consoles/${console.slug}`} 
                    key={console.id}
                    className="group block border-2 border-retro-grid bg-retro-dark relative overflow-hidden hover:border-retro-blue transition-all duration-300"
                >
                    <div className="h-40 bg-retro-grid/20 flex items-center justify-center p-4 group-hover:bg-retro-grid/30 transition-colors relative">
                         {/* Placeholder for console image if none exists */}
                         {console.image_url ? (
                             <img src={console.image_url} alt={console.name} className="max-h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] relative z-10" />
                         ) : (
                             <svg className="w-16 h-16 text-retro-grid group-hover:text-retro-blue transition-colors opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                 <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                                 <path d="M6 12h4m-2-2v4"></path>
                                 <line x1="15" y1="11" x2="15" y2="11"></line>
                                 <line x1="18" y1="13" x2="18" y2="13"></line>
                             </svg>
                         )}
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                    </div>
                    
                    <div className="p-6 border-t-2 border-retro-grid bg-black/40">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs text-retro-pink border border-retro-pink px-1">
                                {console.manufacturer.toUpperCase()}
                            </span>
                            <span className="font-mono text-xs text-gray-500">{console.release_year}</span>
                        </div>
                        <h3 className="font-pixel text-sm text-white mb-2 group-hover:text-retro-neon transition-colors">
                            {console.name}
                        </h3>
                        <div className="w-full h-1 bg-retro-grid mt-4 overflow-hidden">
                            <div className="h-full bg-retro-blue w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                        </div>
                    </div>
                </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ConsoleLibrary;