import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchManufacturers, fetchConsolesFiltered } from '../services/geminiService';
import { ConsoleDetails, ConsoleFilterState } from '../types';
import RetroLoader from './RetroLoader';
import Button from './Button';

const ConsoleLibrary: React.FC = () => {
  const [consoles, setConsoles] = useState<ConsoleDetails[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'BRAND' | 'LIST'>('BRAND');
  
  // Pagination State for List View
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

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

  const loadConsoles = useCallback(async (pageNum: number, isNewFilter: boolean) => {
      if (isNewFilter) setLoading(true);
      
      const { data, count } = await fetchConsolesFiltered(filters, pageNum, 12);
      
      if (isNewFilter) {
          setConsoles(data);
      } else {
          setConsoles(prev => [...prev, ...data]);
      }
      
      setHasMore((isNewFilter ? 0 : consoles.length) + data.length < count);
      setLoading(false);
  }, [filters]);

  // Handle Filter Changes
  useEffect(() => {
      if (viewMode === 'LIST') {
          setPage(1);
          setHasMore(true);
          loadConsoles(1, true);
      }
  }, [filters, viewMode]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (viewMode !== 'LIST') return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadConsoles(nextPage, false);
      }
    }, { threshold: 0.5 });

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loading, hasMore, page, viewMode, loadConsoles]);

  const handleBrandSelect = (brand: string) => {
      setFilters(prev => ({ ...prev, manufacturer: brand }));
      setViewMode('LIST');
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
        default: return 'text-retro-neon border-retro-neon hover:bg-retro-neon/10';
    }
  };

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
                className={`font-mono text-xs px-3 py-1 ${viewMode === 'BRAND' ? 'bg-retro-neon text-black' : 'text-gray-500 hover:text-white'}`}
            >
                DIRECTORY MODE
            </button>
            <button 
                onClick={() => setViewMode('LIST')}
                className={`font-mono text-xs px-3 py-1 ${viewMode === 'LIST' ? 'bg-retro-neon text-black' : 'text-gray-500 hover:text-white'}`}
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

      {/* VIEW: LIST WITH FILTERS */}
      {viewMode === 'LIST' && (
          <div className="flex flex-col lg:flex-row gap-8">
              
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
                                  <button onClick={() => setFilters(prev => ({...prev, manufacturer: null}))} className="text-red-500 hover:text-white">✕</button>
                              </div>
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
                  {consoles.length === 0 && !loading ? (
                      <div className="text-center p-12 border-2 border-dashed border-gray-700 font-mono text-gray-500">
                          NO HARDWARE MATCHES FILTERS.
                      </div>
                  ) : (
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
                  )}
                  
                   {/* Infinite Scroll Loader */}
                   <div ref={observerTarget} className="py-6 flex justify-center w-full">
                       {loading && <RetroLoader />}
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ConsoleLibrary;