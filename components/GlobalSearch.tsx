import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDatabase } from '../services/geminiService';
import { SearchResult } from '../types';
import { useSound } from './SoundContext';

const GlobalSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { playHover, playClick } = useSound();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                const hits = await searchDatabase(query);
                setResults(hits);
                setLoading(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        playClick();
        const path = result.type === 'GAME' ? `/games/${result.slug}` : `/consoles/${result.slug}`;
        navigate(path);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative p-4 border-b border-retro-grid" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="SEARCH DATABASE..."
                    className="w-full bg-black/50 border border-retro-grid text-retro-neon font-mono text-sm px-3 py-2 pl-9 focus:border-retro-neon focus:outline-none placeholder-gray-600 transition-colors"
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute left-4 right-4 top-full mt-1 bg-retro-dark border-2 border-retro-neon shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50 max-h-80 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-4 text-xs font-mono text-retro-blue animate-pulse">SCANNING ARCHIVES...</div>
                    ) : results.length > 0 ? (
                        <div className="divide-y divide-retro-grid">
                            {results.map((res) => (
                                <button
                                    key={res.type + res.id}
                                    onClick={() => handleSelect(res)}
                                    onMouseEnter={playHover}
                                    className="w-full text-left p-3 hover:bg-retro-grid/30 flex items-center gap-3 transition-colors group"
                                >
                                    <div className="w-8 h-8 bg-black border border-retro-grid flex-shrink-0 flex items-center justify-center">
                                        {res.image ? (
                                            <img src={res.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] text-gray-600">IMG</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-pixel text-xs text-white group-hover:text-retro-neon">{res.title}</div>
                                        <div className="flex gap-2 text-[10px] font-mono">
                                            <span className={res.type === 'GAME' ? 'text-retro-pink' : 'text-retro-blue'}>
                                                {res.type}
                                            </span>
                                            <span className="text-gray-500">//</span>
                                            <span className="text-gray-400">{res.subtitle}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-xs font-mono text-gray-500">NO RECORDS FOUND</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;