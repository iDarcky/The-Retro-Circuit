
'use client';

import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from './SearchContext';
import { searchDatabase } from '../../app/actions';
import { SearchResult } from '../../lib/types';
import { IconSearch } from './Icons';

const GlobalSearch: FC = () => {
    const { isOpen, closeSearch } = useSearch();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Debounce Timer
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Focus input on mount/open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setSelectedIndex(0);
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
                setSelectedIndex(0);
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
        let path = '/';

        switch (result.type) {
            case 'CONSOLE':
                const mfgSlug = result.subtitle ? result.subtitle.toLowerCase().replace(/\s+/g, '-') : 'unknown';
                path = `/consoles/${mfgSlug}-${result.slug}`;
                break;
            case 'FABRICATOR':
                path = `/fabricators/${result.slug}`;
                break;
        }

        router.push(path);
        closeSearch();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Stop propagation to prevent double-firing if attached to multiple elements
        e.stopPropagation();

        if (e.key === 'Escape') {
            closeSearch();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results.length > 0 && selectedIndex >= 0 && selectedIndex < results.length) {
                handleSelect(results[selectedIndex]);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-start justify-center pt-20 animate-fadeIn"
            onClick={closeSearch}
        >
            {/* PANEL: Swiss Industrial - Solid Black, White/10 Borders, Violet Accents */}
            <div
                className="w-full max-w-3xl bg-bg-primary border border-border-normal shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh] m-4 rounded-none"
                onClick={e => e.stopPropagation()}
            // Removed onKeyDown from container to prevent bubble-up issues, relying on input focus
            >
                {/* Header / Input */}
                <div className="p-6 border-b border-border-normal flex items-center gap-4 bg-bg-primary">
                    <IconSearch className={`w-5 h-5 text-violet-500 ${isLoading ? 'animate-spin' : ''}`} />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder-text-muted uppercase tracking-wider"
                        placeholder="SEARCH DATABASE..."
                        value={query}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={closeSearch} className="text-text-muted hover:text-white transition-colors">
                        <span className="text-[10px] font-mono border border-border-normal px-2 py-1 text-text-muted hover:border-white transition-colors">ESC</span>
                    </button>
                </div>

                {/* Results List */}
                <div className="overflow-y-auto custom-scrollbar flex-1 bg-bg-primary min-h-[100px]">

                    {query.length > 0 && query.length < 2 && (
                        <div className="p-8 text-center font-mono text-xs text-text-muted">
                            ENTER AT LEAST 2 CHARACTERS...
                        </div>
                    )}

                    {results.length === 0 && query.length >= 2 && !isLoading && (
                        <div className="p-8 text-center font-mono text-xs text-text-muted">
                            NO RECORDS FOUND.
                        </div>
                    )}

                    <div className="divide-y divide-white/5">
                        {results.map((res, idx) => {
                            const isSelected = idx === selectedIndex;
                            return (
                                <button
                                    key={`${res.type}-${res.id}`}
                                    onClick={() => handleSelect(res)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    // Increased padding (p-6) for bigger results
                                    className={`w-full text-left p-6 flex items-center gap-6 transition-all group border-l-4
                                        ${isSelected ? 'bg-bg-tertiary border-violet-500' : 'bg-transparent border-transparent hover:bg-bg-tertiary hover:border-violet-500'}
                                    `}
                                >
                                    {/* Image Placeholder - Slightly larger */}
                                    <div className={`w-12 h-12 bg-black border flex-shrink-0 flex items-center justify-center overflow-hidden transition-colors relative
                                        ${isSelected ? 'border-violet-500/50' : 'border-border-normal group-hover:border-violet-500/50'}
                                    `}>
                                        <div className="absolute inset-0 w-full h-full bg-[url('/retro-grid.png')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
                                        {res.image ? (
                                            <img src={res.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                        ) : (
                                            <div className="text-[9px] text-text-muted font-pixel">IMG</div>
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-mono text-sm uppercase tracking-wide truncate mb-1.5 transition-colors
                                            ${isSelected ? 'text-white' : 'text-text-secondary group-hover:text-white'}
                                        `}>
                                            {res.title}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-mono px-1.5 py-0.5 border
                                                ${res.type === 'CONSOLE' ? 'text-orange-500 border-orange-500/30' :
                                                    res.type === 'FABRICATOR' ? 'text-cyan-500 border-cyan-500/30' : 'text-text-muted border-border-normal'
                                                }`}>
                                                {res.type}
                                            </span>
                                            <span className="text-[10px] font-mono text-text-muted/50 truncate uppercase tracking-tight">
                                                // {res.subtitle || 'DATABASE_RECORD'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Enter Key Hint */}
                                    <div className={`transition-all duration-200 transform
                                        ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100'}
                                    `}>
                                        <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
