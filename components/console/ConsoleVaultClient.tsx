
'use client';

import { useEffect, useState, type ChangeEvent, type FC } from 'react';
import Link from 'next/link';
import { fetchManufacturers, fetchAllConsoles } from '../../lib/api';
import { ConsoleDetails, ConsoleFilterState, Manufacturer } from '../../lib/types';
import RetroLoader from '../ui/RetroLoader';
import Button from '../ui/Button';

interface ConsoleVaultClientProps {
  initialManufacturers?: Manufacturer[];
  initialConsoles?: ConsoleDetails[];
}

const ConsoleVaultClient: FC<ConsoleVaultClientProps> = ({ initialManufacturers = [], initialConsoles = [] }) => {
  const [allConsoles, setAllConsoles] = useState<ConsoleDetails[]>(initialConsoles);
  const [filteredConsoles, setFilteredConsoles] = useState<ConsoleDetails[]>(initialConsoles);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(initialManufacturers);
  // If we have initial data, we are not loading.
  const [loading, setLoading] = useState(initialConsoles.length === 0);
  
  // Mobile Sidebar State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Filter State
  const [filters, setFilters] = useState<ConsoleFilterState>({
      minYear: 1980,
      maxYear: new Date().getFullYear(),
      generations: [],
      form_factors: [],
      manufacturer_id: null,
      panel_types: []
  });

  // 1. Initial Load: Fetch Everything if not provided
  useEffect(() => {
    if (initialConsoles.length > 0 && initialManufacturers.length > 0) {
        return;
    }

    const init = async () => {
        setLoading(true);
        try {
            const [manus, allData] = await Promise.all([
                fetchManufacturers(),
                fetchAllConsoles()
            ]);
            setManufacturers(manus);
            setAllConsoles(allData);
            setFilteredConsoles(allData); // Init filtered list with everything
        } catch (error) {
            console.error("Failed to load vault data", error);
        } finally {
            setLoading(false);
        }
    };
    init();
  }, [initialConsoles.length, initialManufacturers.length]);

  // 2. Client-Side Filter Logic
  useEffect(() => {
    // Start with all data
    let result = [...allConsoles];

    // Filter: Manufacturer
    if (filters.manufacturer_id) {
        result = result.filter(c => c.manufacturer_id === filters.manufacturer_id);
    }

    // Filter: Year
    result = result.filter(c => {
        const y = c.release_year;
        if (!y) return true; // Keep items with unknown year
        return y >= filters.minYear && y <= filters.maxYear;
    });

    // Filter: Form Factor
    if (filters.form_factors.length > 0) {
        result = result.filter(c => {
            if (!c.form_factor) return false;
            // Case-insensitive check
            return filters.form_factors.some(ff => c.form_factor?.toLowerCase() === ff.toLowerCase());
        });
    }

    // Filter: Screen Tech (Check Variants)
    if (filters.panel_types.length > 0) {
        result = result.filter(c => {
            const variants = c.variants || [];
            // Check if ANY variant matches ANY selected panel type
            return variants.some(v => {
                const displayType = (v.display_type || '').toLowerCase();
                return filters.panel_types.some(pt => displayType.includes(pt.toLowerCase()));
            });
        });
    }

    // Sort: Newest First
    result.sort((a, b) => {
        const yA = a.release_year || 9999;
        const yB = b.release_year || 9999;
        return yB - yA;
    });

    setFilteredConsoles(result);
    setPage(1); // Reset pagination on filter change

  }, [filters, allConsoles]);

  // Helper: Toggle Arrays in Filter State
  const toggleFilter = (category: 'form_factors' | 'panel_types', value: string) => {
      setFilters(prev => {
          const current = prev[category];
          const exists = current.includes(value);
          
          let updated;
          if (exists) {
              updated = current.filter(item => item !== value);
          } else {
              updated = [...current, value];
          }
          
          return { ...prev, [category]: updated };
      });
  };

  // Helper: Form Factor Badge Style
  const getFormFactorColor = (factor: string) => {
      const f = factor.toLowerCase();
      if (f === 'vertical') return 'text-yellow-400 border-yellow-400';
      if (f === 'horizontal') return 'text-retro-blue border-retro-blue';
      if (f === 'clamshell') return 'text-retro-pink border-retro-pink';
      return 'text-gray-400 border-gray-400';
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredConsoles.length / ITEMS_PER_PAGE);
  const paginatedConsoles = filteredConsoles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // --- SUB-COMPONENTS ---

  const CheckboxFilter = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
      <div onClick={onChange} className="flex items-center gap-3 cursor-pointer group mb-2 last:mb-0">
          <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${checked ? 'bg-retro-neon border-retro-neon' : 'border-gray-600 bg-black group-hover:border-retro-blue'}`}>
              {checked && <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span className={`text-[10px] font-mono uppercase ${checked ? 'text-white' : 'text-gray-500 group-hover:text-retro-blue'}`}>
              {label}
          </span>
      </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-pixel text-retro-neon mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                CONSOLE VAULT
            </h2>
            <p className="font-mono text-gray-400">CLASSIFIED HARDWARE DATABASE</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
            <Button onClick={() => setShowMobileFilters(!showMobileFilters)} variant="secondary" className="w-full">
                {showMobileFilters ? 'HIDE FILTERS' : 'ADVANCED FILTERS +'}
            </Button>
        </div>

        {loading ? <RetroLoader /> : (
            <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
                
                {/* SIDEBAR FILTERS */}
                <aside className={`
                    lg:w-64 flex-shrink-0 bg-retro-dark border border-retro-grid p-4 h-fit
                    ${showMobileFilters ? 'block' : 'hidden lg:block'}
                `}>
                    <div className="mb-6 pb-6 border-b border-retro-grid">
                        <h3 className="font-pixel text-sm text-retro-blue mb-4">FABRICATOR</h3>
                        <select 
                            className="w-full bg-black border border-gray-700 text-white font-mono text-xs p-2 focus:border-retro-neon outline-none"
                            value={filters.manufacturer_id || ''}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilters({...filters, manufacturer_id: e.target.value || null})}
                        >
                            <option value="">ALL ENTITIES</option>
                            {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <div className="mb-6 pb-6 border-b border-retro-grid">
                        <h3 className="font-pixel text-sm text-retro-blue mb-4">TIMELINE</h3>
                        <div className="flex gap-2 items-center">
                             <input 
                                type="number" 
                                className="bg-black border border-gray-700 text-white font-mono text-xs p-2 w-full text-center"
                                value={filters.minYear}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({...filters, minYear: Number(e.target.value)})}
                             />
                             <span className="text-gray-600">-</span>
                             <input 
                                type="number" 
                                className="bg-black border border-gray-700 text-white font-mono text-xs p-2 w-full text-center"
                                value={filters.maxYear}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({...filters, maxYear: Number(e.target.value)})}
                             />
                        </div>
                    </div>

                    <div className="mb-6 pb-6 border-b border-retro-grid">
                        <h3 className="font-pixel text-sm text-retro-blue mb-4">FORM FACTOR</h3>
                        <CheckboxFilter 
                            label="HORIZONTAL" 
                            checked={filters.form_factors.includes('Horizontal')} 
                            onChange={() => toggleFilter('form_factors', 'Horizontal')} 
                        />
                        <CheckboxFilter 
                            label="VERTICAL" 
                            checked={filters.form_factors.includes('Vertical')} 
                            onChange={() => toggleFilter('form_factors', 'Vertical')} 
                        />
                         <CheckboxFilter 
                            label="CLAMSHELL" 
                            checked={filters.form_factors.includes('Clamshell')} 
                            onChange={() => toggleFilter('form_factors', 'Clamshell')} 
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="font-pixel text-sm text-retro-pink mb-4">SCREEN TECH</h3>
                        <CheckboxFilter 
                            label="OLED" 
                            checked={filters.panel_types.includes('OLED')} 
                            onChange={() => toggleFilter('panel_types', 'OLED')} 
                        />
                        <CheckboxFilter 
                            label="LCD / IPS" 
                            checked={filters.panel_types.includes('IPS')} 
                            onChange={() => toggleFilter('panel_types', 'IPS')} 
                        />
                    </div>
                    
                    <button 
                        onClick={() => setFilters({
                            minYear: 1980, 
                            maxYear: new Date().getFullYear(),
                            generations: [], 
                            form_factors: [], 
                            panel_types: [], 
                            manufacturer_id: null 
                        })}
                        className="w-full text-[10px] font-mono text-gray-500 hover:text-white border border-dashed border-gray-700 hover:border-white py-2"
                    >
                        RESET FILTERS
                    </button>
                </aside>

                {/* MAIN GRID */}
                <div className="flex-1">
                    {/* Status Bar */}
                    <div className="bg-black/40 border-b border-retro-grid p-2 mb-4 flex justify-between items-center text-[10px] font-mono text-gray-400">
                        <span>FOUND: {filteredConsoles.length} UNITS</span>
                        <span>PAGE {page} / {totalPages || 1}</span>
                    </div>

                    {paginatedConsoles.length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-gray-800 text-center font-mono text-gray-500">
                            NO HARDWARE FOUND MATCHING PARAMETERS.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                            {paginatedConsoles.map(console => (
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
                                         
                                         {/* Form Factor & Feature Badges */}
                                         <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                                             {console.form_factor && (
                                                 <div className={`bg-black/90 border px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-lg ${getFormFactorColor(console.form_factor)}`}>
                                                     {console.form_factor}
                                                 </div>
                                             )}
                                             {console.chassis_features && (
                                                 <div className="bg-black/90 border border-retro-neon text-retro-neon px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-lg">
                                                     {console.chassis_features}
                                                 </div>
                                             )}
                                         </div>
                                    </div>
                                    <div className="p-4 border-t border-retro-grid">
                                        <h3 className="font-pixel text-xs text-white group-hover:text-retro-neon mb-1">{console.name}</h3>
                                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                                            <span>{console.manufacturer?.name}</span>
                                            <span>{console.release_year || 'TBA'}</span>
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
            </div>
        )}
    </div>
  );
}

export default ConsoleVaultClient;
