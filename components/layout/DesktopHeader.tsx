'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '../ui/SearchContext';
import { Terminal, Search } from 'lucide-react';

export default function DesktopHeader() {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  const navItems = [
    { name: '[DIR_01] CONSOLES', path: '/console' },
    { name: '[DIR_02] FABRICATORS', path: '/fabricators' },
    { name: '[EXEC] VS_MODE', path: '/arena' },
  ];

  return (
    <nav className="hidden md:flex sticky top-0 z-50 bg-retro-dark border-b-4 border-retro-neon p-4 justify-between items-center shadow-[0_10px_0_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-retro-neon flex items-center justify-center border-2 border-black group-hover:bg-retro-pink transition-colors">
                    <Terminal size={24} className="text-black" />
                </div>
                <div className="flex flex-col">
                    <span className="font-pixel text-xl leading-none text-white group-hover:text-retro-neon transition-colors">RETRO_CIRCUIT</span>
                    <span className="text-xs bg-retro-pink text-black px-1 mt-1 w-max font-bold group-hover:bg-retro-neon transition-colors">RAW DATA ARCHIVE</span>
                </div>
            </Link>
        </div>

        <div className="flex gap-8">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    href={item.path}
                    className={`uppercase font-bold px-2 transition-colors ${
                        pathname.startsWith(item.path)
                            ? 'bg-retro-neon text-black'
                            : 'text-retro-neon hover:bg-retro-neon hover:text-black'
                    }`}
                >
                    {item.name}
                </Link>
            ))}
        </div>

        <div className="flex gap-4">
            <button
                onClick={openSearch}
                className="flex items-center gap-2 border-2 border-retro-grid px-4 py-2 font-bold text-gray-400 hover:text-white hover:border-retro-neon transition-colors"
            >
                <Search size={16} />
                <span className="text-xs">SEARCH_DB</span>
            </button>

            <Link href="/login" className="border-2 border-retro-neon px-6 py-2 font-bold text-retro-neon hover:bg-retro-neon hover:text-black transition-all shadow-[4px_4px_0_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_white]">
                INIT_SESSION
            </Link>
        </div>
    </nav>
  );
}
