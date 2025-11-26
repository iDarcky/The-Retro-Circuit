
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchManufacturers, fetchConsolesFiltered } from '../services/geminiService';
import { ConsoleDetails, ConsoleFilterState } from '../types';
import RetroLoader from './RetroLoader';
import Button from './Button';

// --- STATIC DATA FOR MANUFACTURER PROFILES ---
const COMPANY_DATA: Record<string, any> = {
    'Nintendo': {
        founded: '1889',
        origin: 'Kyoto, Japan',
        description: 'The oldest player in the game. Originally a hanafuda playing card company, Nintendo saved the industry after the 1983 crash. They prioritize gameplay mechanics, durability ("Nintendium"), and lateral thinking with withered technology over raw graphical power.',
        ceo: 'Shuntaro Furukawa',
        key_franchises: ['Mario', 'Zelda', 'Metroid', 'Pokémon'],
        color: 'text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        bg: 'bg-red-900/20',
        hover: 'hover:bg-red-900/40'
    },
    'Sega': {
        founded: '1960',
        origin: 'Tokyo, Japan',
        description: 'Service Games (SEGA) brought the arcade experience home. Known for their aggressive marketing in the 90s ("Sega Does What Nintendon\'t") and the "Blast Processing" era. A rebel spirit that pushed technical boundaries before bowing out of hardware in 2001.',
        ceo: 'Haruki Satomi',
        key_franchises: ['Sonic', 'Yakuza', 'Virtua Fighter', 'Phantasy Star'],
        color: 'text-blue-500 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        bg: 'bg-blue-900/20',
        hover: 'hover:bg-blue-900/40'
    },
    'Sony': {
        founded: '1946',
        origin: 'Tokyo, Japan',
        description: 'The electronics giant that entered the market when a partnership with Nintendo went sour. The PlayStation brand made gaming "cool" for adults, leveraging CD-ROM technology to revolutionize 3D gaming and cinematic storytelling.',
        ceo: 'Kenichiro Yoshida',
        key_franchises: ['Gran Turismo', 'God of War', 'Uncharted', 'Ratchet & Clank'],
        color: 'text-yellow-400 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]',
        bg: 'bg-yellow-900/20',
        hover: 'hover:bg-yellow-900/40'
    },
    'Atari': {
        founded: '1972',
        origin: 'California, USA',
        description: 'The pioneers who started it all. Nolan Bushnell\'s creation brought Pong to the masses and defined the home console market with the 2600. A cautionary tale of boom and bust, but an eternal icon of retro culture.',
        ceo: 'Wade Rosen',
        key_franchises: ['Pong', 'Asteroids', 'Centipede', 'RollerCoaster Tycoon'],
        color: 'text-orange-500 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
        bg: 'bg-orange-900/20',
        hover: 'hover:bg-orange-900/40'
    },
    'Microsoft': {
        founded: '1975',
        origin: 'Redmond, USA',
        description: 'The software behemoth that brought PC architecture to the living room. The Xbox introduced a robust online infrastructure (Xbox Live) that became the industry standard for multiplayer gaming and digital distribution.',
        ceo: 'Satya Nadella',
        key_franchises: ['Halo', 'Gears of War', 'Forza', 'Fable'],
        color: 'text-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]',
        bg: 'bg-green-900/20',
        hover: 'hover:bg-green-900/40'
    },
    'NEC': {
        founded: '1899',
        origin: 'Tokyo, Japan',
        description: 'An IT giant that partnered with Hudson Soft to create the PC Engine (TurboGrafx-16). It dominated the Japanese market for a time with its compact design and high-quality arcade ports, bridging the 8-bit and 16-bit eras.',
        ceo: 'Takayuki Morita',
        key_franchises: ['Bomberman', 'Bonk', 'Adventure Island', 'Ys'],
        color: 'text-purple-400 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)]',
        bg: 'bg-purple-900/20',
        hover: 'hover:bg-purple-900/40'
    },
    'SNK': {
        founded: '1978',
        origin: 'Osaka, Japan',
        description: 'Shin Nihon Kikaku (New Japan Project). They brought the exact arcade hardware into the home with the Neo Geo. "The Future is Now." Known for expensive, elite hardware and technically superior 2D fighting games.',
        ceo: 'Kenji Matsubara',
        key_franchises: ['King of Fighters', 'Metal Slug', 'Fatal Fury', 'Samurai Shodown'],
        color: 'text-teal-400 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)]',
        bg: 'bg-teal-900/20',
        hover: 'hover:bg-teal-900/40'
    }
};

const DEFAULT_COMPANY = {
    founded: 'Unknown',
    origin: 'Unknown',
    description: 'A legendary hardware manufacturer from the golden age of gaming. No detailed classified files found in current archive.',
    ceo: 'Unknown',
    key_franchises: [],
    color: 'text-retro-neon border-retro-neon shadow-[0_0_20px_rgba(0,255,157,0.3)]',
    bg: 'bg-retro-grid/20',
    hover: 'hover:bg-retro-grid/40'
};

const ConsoleLibrary: React.FC = () => {
  const [consoles, setConsoles] = useState<ConsoleDetails[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'BRAND' | 'PROFILE' | 'LIST'>('BRAND');
  
  // Pagination State for List View
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 12; // Fits 1, 2, 3 cols

  // Filter State
  const [filters, setFilters] = useState<ConsoleFilterState>({
      minYear: 1970,
      maxYear: 2005,
      generations: [],
      types: [],
      manufacturer: null
  });

  // Initial Load (Brands)
  useEffect(() => {
    const init = async () => {
        setLoading(true);
        const uniqueBrands = await fetchManufacturers();
        setBrands(uniqueBrands);
        setLoading(false);
    };
    init();
  }, []);

  const loadConsoles = useCallback(async (pageNum: number) => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const { data, count } = await fetchConsolesFiltered(filters, pageNum, ITEMS_PER_PAGE);
      
      setConsoles(data);
      setTotalCount(count);
      setLoading(false);
  }, [filters]);

  // Handle Filter/View Changes
  useEffect(() => {
      if (viewMode === 'LIST') {
          loadConsoles(page);
      }
  }, [page, viewMode, filters, loadConsoles]); 

  // Reset page when filters change
  useEffect(() => {
      setPage(1);
  }, [filters]);

  const handleBrandSelect = (brand: string) => {
      setFilters(prev => ({ ...prev, manufacturer: brand }));
      setViewMode('PROFILE');
  };

  const handleFilterChange = (key: keyof ConsoleFilterState, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'generations' | 'types', value: any) => {
      setFilters(prev => {
          const arr = prev[key] as any[];
          if (arr.includes(value)) {
              return { ...prev, [key]: arr.filter(i => i !== value) };
          } else {
              return { ...prev, [key]: [...arr, value] };
          }
      });
  };

  const getBrandColor = (brand: string) => {
    switch(brand.toLowerCase()) {
        case 'nintendo': return 'text-red-500 border-red-500 hover:bg-red-500/10';
        case 'sega': return 'text-blue-500 border-blue-500 hover:bg-blue-500/10';
        case 'sony': return 'text-yellow-400 border-yellow-400 hover:bg-yellow-400/10';
        case 'atari': return 'text-orange-500 border-orange-500 hover:bg-orange-500/10';
        case 'microsoft': return 'text-green-500 border-green-500 hover:bg-green-500/10';
        case 'nec': return 'text-purple-400 border-purple-400 hover:bg-purple-400/10';
        case 'snk': return 'text-teal-400 border-teal-400 hover:bg-teal-400/10';
        default: return 'text-retro-neon border-retro-neon hover:bg-retro-neon/10';
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Helper to get active company data
  const activeCompany = filters.manufacturer 
    ? (COMPANY_DATA[filters.manufacturer] || DEFAULT_COMPANY)
    : DEFAULT_COMPANY;

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      
      {/* HEADER */}
      <div className="text-center mb-8 border-b border-retro-grid pb-4">
        <h2 className="text-3xl font-pixel text-retro-neon mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
          HARDWARE DATABASE
        </h2>
        <div className="flex justify-center gap-4">
            <button 
                onClick={() => { setViewMode('BRAND'); setFilters({ minYear: 1970, maxYear: 2005, generations: [], types: [], manufacturer: null }); }}
                className={`font-mono text-xs px-3 py-1 transition-colors ${viewMode === 'BRAND' ? 'bg-retro-neon text-black' : 'text-gray-500 hover:text-white'}`}
            >
                DIRECTORY MODE
            </button>
            {filters.manufacturer && (
                <button 
                    onClick={() => setViewMode('PROFILE')}
                    className={`font-mono text-xs px-3 py-1 transition-colors ${viewMode === 'PROFILE' ? 'bg-retro-neon text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    CORP. DOSSIER
                </button>
            )}
            <button 
                onClick={() => setViewMode('LIST')}
                className={`font-mono text-xs px-3 py-1 transition-colors ${viewMode === 'LIST' ? 'bg-retro-neon text-black' : 'text-gray-500 hover:text-white'}`}
            >
                ADVANCED SEARCH
            </button>
        </div>
      </div>

      {/* VIEW: BRAND DIRECTORY */}
      {viewMode === 'BRAND' && (
          loading ? <RetroLoader /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                    <button 
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`group border-4 bg-retro-dark p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${getBrandColor(brand)}`}
                    >
                        <div className="w-20 h-20 border-2 border-current rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="font-pixel text-2xl">{brand[0]}</span>
                        </div>
                        <span className="font-pixel text-xl tracking-widest uppercase">{brand}</span>
                        <span className="font-mono text-xs opacity-75">ACCESS FOLDER &gt;</span>
                    </button>
                ))}
                 <button 
                    onClick={() => setViewMode('LIST')}
                    className="group border-4 border-dashed border-gray-600 bg-retro-dark p-8 flex flex-col items-center justify-center gap-4 hover:border-retro-pink hover:text-retro-pink transition-colors text-gray-500"
                >
                    <span className="font-pixel text-lg">VIEW ALL</span>
                    <span className="font-mono text-xs">APPLY FILTERS</span>
                </button>
            </div>
          )
      )}

      {/* VIEW: COMPANY PROFILE */}
      {viewMode === 'PROFILE' && filters.manufacturer && (
          <div className="animate-[fadeIn_0.5s_ease-in-out]">
             {/* Profile Header */}
             <div className={`border-l-8 ${activeCompany.color} bg-retro-dark p-8 mb-8 shadow-lg`}>
                 <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-6 mb-6">
                    <div>
                        <div className={`font-mono text-xs border inline-block px-2 py-1 mb-2 ${activeCompany.color}`}>CONFIDENTIAL</div>
                        <h1 className={`text-5xl md:text-7xl font-pixel ${activeCompany.color.split(' ')[0]} opacity-90 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]`}>
                            {filters.manufacturer}
                        </h1>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                         <div className="font-mono text-gray-500 text-xs">FOUNDED</div>
                         <div className="font-pixel text-white text-lg">{activeCompany.founded}</div>
                         <div className="font-mono text-gray-500 text-xs mt-2">ORIGIN</div>
                         <div className="font-pixel text-white text-lg">{activeCompany.origin}</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-2">
                         <h3 className={`font-pixel text-lg mb-4 ${activeCompany.color.split(' ')[0]}`}>CORPORATE HISTORY</h3>
                         <p className="font-mono text-gray-300 text-lg leading-relaxed border-l-2 border-gray-700 pl-4">
                             {activeCompany.description}
                         </p>
                         
                         <div className="mt-8">
                             <Button onClick={() => setViewMode('LIST')} className={`w-full md:w-auto ${activeCompany.bg} ${activeCompany.hover} border-current`}>
                                 INITIALIZE HARDWARE DATABASE &gt;
                             </Button>
                         </div>
                     </div>
                     
                     <div className={`bg-black/30 p-6 border border-gray-800`}>
                         <div className="mb-6">
                             <h4 className="font-pixel text-xs text-gray-500 mb-2">KEY FRANCHISES</h4>
                             <ul className="space-y-2">
                                 {activeCompany.key_franchises.map((f: string) => (
                                     <li key={f} className={`font-mono text-sm border-b border-gray-800 pb-1 ${activeCompany.color.split(' ')[0]}`}>
                                         {f}
                                     </li>
                                 ))}
                             </ul>
                         </div>
                         <div>
                             <h4 className="font-pixel text-xs text-gray-500 mb-2">CURRENT CEO</h4>
                             <div className="font-mono text-white text-sm">{activeCompany.ceo}</div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* VIEW: LIST WITH FILTERS */}
      {viewMode === 'LIST' && (
          <div className="flex flex-col lg:flex-row gap-8 animate-[fadeIn_0.5s_ease-in-out]">
              
              {/* FILTER SIDEBAR */}
              <div className="lg:w-64 flex-shrink-0 space-y-6">
                  <div className="bg-retro-dark border border-retro-grid p-4">
                      <h3 className="font-pixel text-xs text-retro-blue mb-4 border-b border-retro-grid pb-2">FILTERS</h3>
                      
                      {/* Brand Reset */}
                      {filters.manufacturer && (
                          <div className="mb-4">
                              <span className="text-xs font-mono text-gray-500 block">MANUFACTURER</span>
                              <div className="flex justify-between items-center text-retro-neon font-bold font-mono">
                                  {filters.manufacturer}
                                  <button onClick={() => { setFilters(prev => ({...prev, manufacturer: null})); setViewMode('BRAND'); }} className="text-red-500 hover:text-white">✕</button>
                              </div>
                              <button onClick={() => setViewMode('PROFILE')} className="text-[10px] font-mono text-retro-blue hover:text-white mt-1">
                                  [ VIEW CORP DATA ]
                              </button>
                          </div>
                      )}

                      {/* Year Range */}
                      <div className="mb-6">
                          <label className="text-xs font-mono text-gray-500 block mb-2">RELEASE YEAR</label>
                          <div className="flex gap-2">
                              <input 
                                type="number" 
                                value={filters.minYear} 
                                onChange={(e) => handleFilterChange('minYear', parseInt(e.target.value))}
                                className="w-1/2 bg-black border border-retro-grid px-2 py-1 text-white font-mono text-sm"
                              />
                              <input 
                                type="number" 
                                value={filters.maxYear} 
                                onChange={(e) => handleFilterChange('maxYear', parseInt(e.target.value))}
                                className="w-1/2 bg-black border border-retro-grid px-2 py-1 text-white font-mono text-sm"
                              />
                          </div>
                      </div>

                      {/* Generation */}
                      <div className="mb-6">
                          <label className="text-xs font-mono text-gray-500 block mb-2">GENERATION</label>
                          <div className="grid grid-cols-2 gap-2">
                              {[3, 4, 5, 6].map(gen => (
                                  <button
                                    key={gen}
                                    onClick={() => toggleArrayFilter('generations', gen)}
                                    className={`text-xs font-mono border px-2 py-1 ${filters.generations.includes(gen) ? 'bg-retro-neon text-black border-retro-neon' : 'border-gray-700 text-gray-400'}`}
                                  >
                                      GEN {gen}
                                  </button>
                              ))}
                          </div>
                      </div>

                       {/* Type */}
                       <div className="mb-6">
                          <label className="text-xs font-mono text-gray-500 block mb-2">TYPE</label>
                          <div className="space-y-2">
                              {['Home', 'Handheld'].map(type => (
                                  <label key={type} className="flex items-center gap-2 font-mono text-xs text-gray-300 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={filters.types.includes(type)}
                                        onChange={() => toggleArrayFilter('types', type)}
                                        className="accent-retro-pink"
                                      />
                                      {type.toUpperCase()}
                                  </label>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>

              {/* RESULTS GRID */}
              <div className="flex-1">
                  {loading ? (
                       <RetroLoader />
                  ) : consoles.length === 0 ? (
                      <div className="text-center p-12 border-2 border-dashed border-gray-700 font-mono text-gray-500">
                          NO HARDWARE MATCHES FILTERS.
                      </div>
                  ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {consoles.map((console, idx) => (
                                <Link 
                                    to={`/consoles/${console.slug}`} 
                                    key={`${console.id}-${idx}`}
                                    className="group block border border-retro-grid bg-retro-dark relative overflow-hidden hover:border-retro-blue transition-all"
                                >
                                    <div className="h-32 bg-black/40 flex items-center justify-center p-4 relative">
                                        {console.image_url ? (
                                            <img src={console.image_url} className="max-h-full object-contain" />
                                        ) : (
                                            <span className="font-pixel text-gray-700 text-4xl">?</span>
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-retro-grid">
                                        <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                                            <span>{console.release_year}</span>
                                            <span>GEN {console.generation}</span>
                                        </div>
                                        <h3 className="font-pixel text-xs text-white group-hover:text-retro-neon truncate">
                                            {console.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-8 border-t border-retro-grid/30 mt-8">
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="text-xs"
                                >
                                    &lt; PREV
                                </Button>
                                
                                <div className="font-pixel text-xs text-retro-neon bg-retro-grid/20 px-4 py-2 rounded">
                                    PAGE {page} OF {totalPages}
                                </div>

                                <Button 
                                    variant="secondary" 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="text-xs"
                                >
                                    NEXT &gt;
                                </Button>
                            </div>
                        )}
                    </>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default ConsoleLibrary;
