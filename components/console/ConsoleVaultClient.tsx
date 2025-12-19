
'use client';

import { useEffect, useState, type ChangeEvent, type FC } from 'react';
import Link from 'next/link';
import { fetchManufacturers, fetchAllConsoles } from '../../lib/api';
import { ConsoleDetails, ConsoleFilterState, Manufacturer } from '../../lib/types';
import RetroLoader from '../ui/RetroLoader';
import Button from '../ui/Button';

const ConsoleVaultClient: FC = () => {
  const [allConsoles, setAllConsoles] = useState<ConsoleDetails[]>([]);
  const [filteredConsoles, setFilteredConsoles] = useState<ConsoleDetails[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  // 1. Initial Load: Fetch Everything
  useEffect(() => {
    const init = async () => {
        setLoading(true);
        const [manus, allData] = await Promise.all([
            fetchManufacturers(),
            fetchAllConsoles()
        ]);
        setManufacturers(manus);
        setAllConsoles(allData);
        setFilteredConsoles(allData); // Init filtered list with everything
        setLoading(false);
    };
    init();
  }, []);

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
      if (f === 'horizontal') return 'text-primary border-primary';
      if (f === 'clamshell') return 'text-accent border-accent';
      return 'text-gray-400 border-gray-400';
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredConsoles.length / ITEMS_PER_PAGE);
  const paginatedConsoles = filteredConsoles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // --- SUB-COMPONENTS ---

  const CheckboxFilter = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
      <div onClick={onChange} className="flex items-center gap-3 cursor-pointer group mb-2 last:mb-0">
          <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${checked ? 'bg-secondary border-secondary' : 'border-gray-600 bg-black group-hover:border-primary'}`}>
              {checked && <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span className={`text-[10px] font-mono uppercase ${checked ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`}>
              {label}
          </span>
      </div>
  );

  return (
    <div className="w-full">
        {/* HEADER: RC:// Metadata (Full Width) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-8 mt-4 md:mt-8 mb-4">
             {/* Left: Label */}
             <div className="text-sm font-bold text-gray-500 font-mono tracking-widest uppercase">
                RC://RETRO_CIRCUIT/CONSOLES
             </div>

             {/* Right: Metadata Stats */}
             <div className="flex flex-row gap-6 text-gray-500 font-tech tracking-wider uppercase text-[12px] font-bold mt-2 md:mt-0">
                <div className="flex items-center">
                    STATUS: ONLINE
                </div>
                <div>
                    INDEXED: {allConsoles.length} SYSTEMS
                </div>
                <div>
                    ARCHIVE: v0.1
                </div>
                <div>
                    UPDATED: {new Date().toISOString().split('T')[0]}
                </div>
            </div>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto p-4">
            {/* Title Section */}
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter mix-blend-difference mb-4">
                    CONSOLE VAULT_
                </h2>
                <p className="font-mono text-gray-400 text-sm md:text-base tracking-wide border-l-2 border-accent pl-4">
                    Browse and filter indexed handheld systems
                </p>
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
                        lg:w-64 flex-shrink-0 bg-bg-primary border border-border-normal p-4 h-fit
                        ${showMobileFilters ? 'block' : 'hidden lg:block'}
                    `}>
                        <div className="mb-6 pb-6 border-b border-border-normal">
                            <h3 className="font-pixel text-sm text-primary mb-4">FABRICATOR</h3>
                            <select
                                className="w-full bg-black border border-gray-700 text-white font-mono text-xs p-2 focus:border-secondary outline-none"
                                value={filters.manufacturer_id || ''}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilters({...filters, manufacturer_id: e.target.value || null})}
                            >
                                <option value="">ALL ENTITIES</option>
                                {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>

                        <div className="mb-6 pb-6 border-b border-border-normal">
                            <h3 className="font-pixel text-sm text-primary mb-4">TIMELINE</h3>
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

                        <div className="mb-6 pb-6 border-b border-border-normal">
                            <h3 className="font-pixel text-sm text-primary mb-4">FORM FACTOR</h3>
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
                            <h3 className="font-pixel text-sm text-accent mb-4">SCREEN TECH</h3>
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
                        <div className="bg-black/40 border-b border-border-normal p-2 mb-4 flex justify-between items-center text-[10px] font-mono text-gray-400">
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
                                        href={`/consoles/${console.slug}`}
                                        key={console.id}
                                        className="group block bg-black border border-border-normal hover:border-secondary transition-all relative overflow-hidden"
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
                                                     <div className="bg-black/90 border border-secondary text-secondary px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-lg">
                                                         {console.chassis_features}
                                                     </div>
                                                 )}
                                             </div>
                                        </div>
                                        <div className="p-4 border-t border-border-normal">
                                            <h3 className="font-pixel text-xs text-white group-hover:text-secondary mb-1">{console.name}</h3>
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
                            <div className="flex justify-center items-center gap-4 py-8 border-t border-border-normal/30">
                                <Button
                                    variant="secondary"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    &lt; PREV
                                </Button>

                                <div className="font-pixel text-xs text-secondary bg-bg-secondary/20 px-4 py-2 rounded">
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
    </div>
  );
}

export default ConsoleVaultClient;
