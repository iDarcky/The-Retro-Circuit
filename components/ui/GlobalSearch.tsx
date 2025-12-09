
'use client';

import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from './SearchContext';
import { searchDatabase } from '../../lib/api';
import { SearchResult } from '../../lib/types';
import { useSound } from './SoundContext';
import { IconSearch } from './Icons';

const GlobalSearch: FC = () => {
    const { isOpen, closeSearch } = useSearch();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { playHover, playClick } = useSound();
    
    // Debounce Timer
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Focus input on mount/open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            // Clear query on close? Optional, but feels cleaner
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Handle Search Logic
    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (!query || query.length < 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        timeoutRef.current = setTimeout(async () => {
            try {
                const data = await searchDatabase(query);
                setResults(data);
            } catch (err) {
                console.error("Search failed", err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        playClick();
        let path = '/';
        
        switch (result.type) {
            case 'CONSOLE':
                path = `/console/${result.slug}`;
                break;
            case 'FABRICATOR':
                path = `/fabricators/${result.slug}`;
                break;
            case 'GAME':
                path = `/archive/${result.slug || result.id}`;
                break;
        }

        router.push(path);
        closeSearch();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 animate-fadeIn" 
            onClick={closeSearch}
        >
            {/* PANEL: Centered box, max-w-xl, Neon Green Border, Deep Black BG */}
            <div
                className="w-full max-w-xl bg-[#0a0a0a] border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] relative overflow-hidden flex flex-col max-h-[80vh] m-4 rounded-sm"
                onClick={e => e.stopPropagation()}
            >
                {/* Header / Input */}
                <div className="p-6 border-b border-green-500/30 flex items-center gap-4 bg-black/40">
                    <IconSearch className={`w-6 h-6 text-green-500 ${isLoading ? 'animate-spin' : ''}`} />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xl placeholder-gray-600 uppercase tracking-wider"
                        placeholder="SEARCH DATABASE..."
                        value={query}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    />
                    <button onClick={closeSearch} className="text-gray-500 hover:text-white transition-colors">
                        <span className="text-[10px] font-mono border border-gray-700 px-2 py-1 rounded text-gray-500">ESC</span>
                    </button>
                </div>

                {/* Results List */}
                <div className="overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#050505] min-h-[100px]">
                    
                    {query.length > 0 && query.length < 2 && (
                         <div className="p-8 text-center font-mono text-xs text-gray-600">
                             ENTER AT LEAST 2 CHARACTERS...
                         </div>
                    )}

                    {results.length === 0 && query.length >= 2 && !isLoading && (
                         <div className="p-8 text-center font-mono text-xs text-gray-600">
                             NO RECORDS FOUND.
                         </div>
                    )}

                    <div className="divide-y divide-green-500/10">
                        {results.map((res) => (
                            <button
                                key={`${res.type}-${res.id}`}
                                onClick={() => handleSelect(res)}
                                onMouseEnter={playHover}
                                className="w-full text-left p-4 hover:bg-green-500/20 flex items-center gap-4 transition-all group border-l-4 border-transparent hover:border-green-500"
                            >
                                {/* Image Placeholder */}
                                <div className="w-12 h-12 bg-black border border-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg group-hover:border-green-500/50 transition-colors">
                                    {res.image ? (
                                        <img src={res.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                    ) : (
                                        <div className="text-[9px] text-gray-600 font-pixel">IMG</div>
                                    )}
                                </div>

                                {/* Text Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-pixel text-sm text-white group-hover:text-green-400 truncate mb-1">
                                        {res.title}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-mono px-1.5 py-0.5 border rounded-sm ${
                                            res.type === 'CONSOLE' ? 'text-retro-blue border-retro-blue bg-retro-blue/10' :
                                            res.type === 'FABRICATOR' ? 'text-retro-pink border-retro-pink bg-retro-pink/10' : 
                                            res.type === 'GAME' ? 'text-retro-neon border-retro-neon bg-retro-neon/10' : 'text-gray-400 border-gray-400'
                                        }`}>
                                            {res.type}
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-500 truncate uppercase tracking-tight">
                                            // {res.subtitle || 'DATABASE_RECORD'}
                                        </span>
                                    </div>
                                </div>

                                {/* Enter Key Hint */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
