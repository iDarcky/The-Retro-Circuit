'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ConsoleDetails } from '../../lib/types';

interface LatestTransmissionsProps {
    vault: ConsoleDetails[];
    market: ConsoleDetails[];
}

export default function LatestTransmissions({ vault, market }: LatestTransmissionsProps) {
    const [activeTab, setActiveTab] = useState<'vault' | 'market'>('vault');

    const displayedItems = activeTab === 'vault' ? vault : market;

    return (
        <div className="bg-bg-card border border-border-subtle rounded-xl flex flex-col h-full overflow-hidden relative group">

            {/* Header / Tabs */}
            <div className="p-4 md:p-6 border-b border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${activeTab === 'vault' ? 'bg-secondary shadow-[0_0_8px_var(--color-secondary)]' : 'bg-accent shadow-[0_0_8px_var(--color-accent)]'} transition-colors duration-500`}></div>
                    <h2 className="text-sm font-pixel text-white tracking-wide uppercase">
                        TRANSMISSIONS
                    </h2>
                </div>

                <div className="flex bg-black/40 rounded-lg p-1 border border-border-subtle">
                    <button
                        onClick={() => setActiveTab('vault')}
                        className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-md transition-all duration-300 ${
                            activeTab === 'vault'
                            ? 'bg-secondary/20 text-secondary shadow-[0_0_10px_rgba(0,255,136,0.1)]'
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                        VAULT
                    </button>
                    <button
                        onClick={() => setActiveTab('market')}
                        className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-md transition-all duration-300 ${
                            activeTab === 'market'
                            ? 'bg-accent/20 text-accent shadow-[0_0_10px_rgba(255,107,157,0.1)]'
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                        MARKET
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-2 scrollbar-hide">
                <div className="flex flex-col gap-2">
                    {displayedItems.length > 0 ? displayedItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/consoles/${item.slug}`}
                            className="group/item flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-border-subtle transition-all duration-200 relative overflow-hidden"
                        >
                            {/* Hover Highlight */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeTab === 'vault' ? 'bg-secondary' : 'bg-accent'} opacity-0 group-hover/item:opacity-100 transition-opacity duration-200`}></div>

                            {/* Image */}
                            <div className="w-12 h-12 bg-black/40 rounded border border-border-subtle flex items-center justify-center overflow-hidden shrink-0 group-hover/item:border-white/20 transition-colors">
                                {item.image_url ? (
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain p-1 group-hover/item:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="text-xs text-text-muted font-pixel">?</span>
                                )}
                            </div>

                            {/* Text */}
                            <div className="flex-grow min-w-0 flex flex-col justify-center">
                                <h3 className="text-xs md:text-sm font-bold text-white truncate group-hover/item:text-primary transition-colors font-mono leading-tight mb-1">
                                    {item.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-text-muted uppercase tracking-wider truncate border-r border-border-subtle pr-2 mr-2">
                                        {item.manufacturer?.name || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Meta Badge */}
                            <div className="shrink-0 flex flex-col items-end gap-1">
                                {activeTab === 'vault' ? (
                                    <span className="text-[9px] font-tech text-secondary bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/20 uppercase tracking-wider">
                                        NEW
                                    </span>
                                ) : (
                                    <span className="text-[9px] font-tech text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20 uppercase tracking-wider">
                                        {item.specs?.release_date ? new Date(item.specs.release_date).getFullYear() : 'TBA'}
                                    </span>
                                )}
                            </div>
                        </Link>
                    )) : (
                        <div className="p-8 text-center text-text-muted text-xs font-mono border-dashed border border-border-subtle m-4 rounded-lg">
                            // NO SIGNAL DETECTED
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-border-subtle bg-black/20 mt-auto">
                <Link
                    href={activeTab === 'vault' ? "/consoles" : "/consoles?sort=new"}
                    className="flex items-center justify-center gap-2 text-[10px] font-mono font-bold text-text-muted hover:text-white transition-colors w-full py-2 group/link uppercase tracking-widest border border-dashed border-border-subtle hover:border-white/20 rounded hover:bg-white/5"
                >
                    {activeTab === 'vault' ? 'View Full Archive' : 'View Release Calendar'}
                    <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
