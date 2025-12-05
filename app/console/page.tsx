'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { fetchManufacturers, fetchConsolesFiltered } from '../../lib/api';
import { getBrandTheme } from '../../data/static';
import { ConsoleDetails, ConsoleFilterState, Manufacturer } from '../../lib/types';
import RetroLoader from '../../components/ui/RetroLoader';
import Button from '../../components/ui/Button';

export default function ConsoleVaultPage() {
  const [consoles, setConsoles] = useState<ConsoleDetails[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'FABRICATOR' | 'LIST'>('FABRICATOR');
  
  // Pagination State for List View
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 12;

  // Filter State
  const [filters, setFilters] = useState<ConsoleFilterState>({
      minYear: 1970,
      maxYear: 2005,
      generations: [],
      form_factors: [],
      manufacturer_id: null
  });

  // Initial Load (Fabricators)
  useEffect(() => {
    const init = async () => {
        setLoading(true);
        const manus = await fetchManufacturers();
        setManufacturers(manus);
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

  useEffect(() => {
      if (viewMode === 'LIST') {
          loadConsoles(page);
      }
  }, [viewMode, page, loadConsoles]);

  const handleFilterChange = (key: keyof ConsoleFilterState, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
      setPage(1); // Reset to page 1 on filter change
  };

  const applyFilters = () => {
      loadConsoles(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-pixel text-retro-neon mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                CONSOLE VAULT
            </h2>
            <p className="font-mono text-gray-400">CLASSIFIED HARDWARE DATABASE</p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8 border-b border-retro-grid pb-1">
            <button 
                onClick={() => setViewMode('FABRICATOR')}
                className={`px-6 py-2 font-pixel text-xs md:text-sm transition-all border-b-2 ${
                    viewMode === 'FABRICATOR' 
                    ? 'border-retro-neon text-retro-neon' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
            >
                BROWSE BY FABRICATOR
            </button>
            <button 
                onClick={() => setViewMode('LIST')}
                className={`px-6 py-2 font-pixel text-xs md:text-sm transition-all border-b-2 ${
                    viewMode === 'LIST' 
                    ? 'border-retro-neon text-retro-neon' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
            >
                MASTER LIST (ALL)
            </button>
        </div>

        {loading && <RetroLoader />}

        {!loading && viewMode === 'FABRICATOR' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {manufacturers.map((brand) => {
                    const theme = getBrandTheme(brand.name);
                    return (
                        <Link 
                            href={`/fabricators/${brand.slug}`} 
                            key={brand.id}
                            className={`group border-2 ${theme.color.split(' ')[1]} bg-retro-dark p-6 relative overflow-hidden transition-all hover:scale-[1.02]`}
                        >
                            <div className={`absolute top-0 right-0 p-2 font-mono text-[10px] ${theme.color.split(' ')[0]} border-b border-l border-gray-800`}>
                                EST. {brand.founded_year}
                            </div>
                            
                            <div className="h-20 mb-4 flex items-center justify-start">
                                {brand.image_url ? (
                                    <img src={brand.image_url} alt={brand.name} className="h-16 w-auto object-contain" />
                                ) : (
                                    <h3 className={`font-pixel text-2xl ${theme.color.split(' ')[0]}`}>{brand.name}</h3>
                                )}
                            </div>
                            
                            <div className="h-px w-full bg-gray-800 mb-4 group-hover:bg-retro-grid transition-colors"></div>
                            
                            <p className="font-mono text-gray-400 text-xs line-clamp-2 mb-4">
                                {brand.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {(brand.key_franchises || '').split(',').slice(0, 3).map((f, i) => (
                                    <span key={i} className="text-[10px] font-mono bg-black border border-gray-800 px-2 py-1 text-gray-500">
                                        {f.trim()}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    );
                })}
            </div>
        )}

        {!loading && viewMode === 'LIST' && (
            <div className="animate-fadeIn">
                {/* Filters */}
                <div className="bg-retro-dark border border-retro-grid p-4 mb-8 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-[10px] font-mono text-gray-500 mb-1">FABRICATOR</label>
                        <select 
                            className="bg-black border border-gray-700 text-white font-mono text-xs p-2 focus:border-retro-neon outline-none"
                            value={filters.manufacturer_id || ''}
                            onChange={(e) => handleFilterChange('manufacturer_id', e.target.value || null)}
                        >
                            <option value="">ALL FABRICATORS</option>
                            {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-gray-500 mb-1">RELEASE YEAR ({filters.minYear} - {filters.maxYear})</label>
                        <div className="flex gap-2">
                             <input 
                                type="number" 
                                className="bg-black border border-gray-700 text-white font-mono text-xs p-2 w-20"
                                value={filters.minYear}
                                onChange={(e) => handleFilterChange('minYear', parseInt(e.target.value))}
                             />
                             <input 
                                type="number" 
                                className="bg-black border border-gray-700 text-white font-mono text-xs p-2 w-20"
                                value={filters.maxYear}
                                onChange={(e) => handleFilterChange('maxYear', parseInt(e.target.value))}
                             />
                        </div>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <Button onClick={applyFilters} className="text-xs">UPDATE SCAN</Button>
                    </div>
                </div>

                {/* Results */}
                {consoles.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-gray-800 text-center font-mono text-gray-500">
                        NO HARDWARE FOUND MATCHING PARAMETERS.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {consoles.map(console => (
                            <Link 
                                href={`/console/${console.slug}`} 
                                key={console.id}
                                className="group block bg-black border border-retro-grid hover:border-retro-neon transition-all relative overflow-hidden"
                            >
                                <div className="aspect-video bg-gray-900/50 relative flex items-center justify-center p-4">
                                     {console.image_url ? (
                                         <img src={console.image_url} alt={console.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                                     ) : (
                                         <span className="font-pixel text-gray-700 text-2xl">?</span>
                                     )}
                                </div>
                                <div className="p-4 border-t border-retro-grid">
                                    <h3 className="font-pixel text-xs text-white group-hover:text-retro-neon mb-1">{console.name}</h3>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                                        <span>{console.manufacturer?.name}</span>
                                        <span>{console.release_year}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 py-8 border-t border-retro-grid/30">
                        <Button 
                            variant="secondary" 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
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
                        >
                            NEXT &gt;
                        </Button>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}