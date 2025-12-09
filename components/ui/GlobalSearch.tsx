
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
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { playHover, playClick } = useSound();

    // Focus input when open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            // Reset on close
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                try {
                    const hits = await searchDatabase(query);
                    setResults(hits);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        playClick();
        let path = '';
        switch (result.type) {
            case 'CONSOLE': path = `/console/${result.slug}`; break;
            case 'FABRICATOR': path = `/fabricators/${result.slug}`; break;
            case 'GAME': path = `/archive/${result.slug}`; break;
        }

        if (path) {
            router.push(path);
            closeSearch();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 animate-fadeIn" 
            onClick={closeSearch}
        >
            <div
                className="w-full max-w-lg bg-retro-dark border-2 border-retro-neon shadow-[0_0_50px_rgba(0,255,157,0.2)] relative overflow-hidden flex flex-col max-h-[80vh] m-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header / Input */}
                <div className="p-4 border-b border-retro-grid flex items-center gap-3 bg-black/50">
                    <IconSearch className="w-5 h-5 text-retro-neon" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-white font-mono text-lg placeholder-gray-600 uppercase"
                        placeholder="SEARCH DATABASE..."
                        value={query}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    />
                    <button onClick={closeSearch} className="text-gray-500 hover:text-white transition-colors">
                        <span className="text-xs font-mono border border-gray-700 px-2 py-1 rounded">ESC</span>
                    </button>
                </div>

                {/* Results */}
                <div className="overflow-y-auto custom-scrollbar flex-1 bg-black/50 min-h-[100px]">
                    {loading ? (
                        <div className="p-8 text-center font-mono text-retro-blue animate-pulse text-sm">
                            SCANNING FREQUENCIES...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="divide-y divide-retro-grid">
                            {results.map((res) => (
                                <button
                                    key={`${res.type}-${res.id}`}
                                    onClick={() => handleSelect(res)}
                                    onMouseEnter={playHover}
                                    className="w-full text-left p-3 hover:bg-white/10 flex items-center gap-4 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-black border border-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        {res.image ? (
                                            <img src={res.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-[9px] text-gray-600 font-pixel">IMG</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-pixel text-xs text-white group-hover:text-retro-neon truncate">
                                            {res.title}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                                                res.type === 'CONSOLE' ? 'text-retro-blue border-retro-blue' :
                                                res.type === 'FABRICATOR' ? 'text-retro-pink border-retro-pink' : 'text-gray-400 border-gray-400'
                                            }`}>
                                                {res.type}
                                            </span>
                                            {res.subtitle && <span className="text-[10px] font-mono text-gray-500 truncate">{res.subtitle}</span>}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-retro-neon font-pixel text-xs">&lt;ENTER&gt;</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : query.length >= 2 ? (
                        <div className="p-8 text-center">
                            <div className="font-pixel text-gray-600 mb-2">NO SIGNALS DETECTED</div>
                            <div className="font-mono text-xs text-gray-700">TRY ADJUSTING SEARCH PARAMETERS</div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-700 font-mono text-xs">
                            ENTER KEYWORDS TO SEARCH HARDWARE & MANUFACTURERS
                        </div>
                    )}
                </div>

                {/* Footer hints */}
                <div className="bg-retro-grid/20 p-2 border-t border-retro-grid flex justify-between px-4">
                    <div className="flex gap-4 text-[10px] font-mono text-gray-500">
                        <span>SEARCHING: CONSOLES // FABRICATORS</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GlobalSearch;
