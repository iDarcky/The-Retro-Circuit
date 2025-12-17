'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '../ui/SearchContext';
import { Search } from 'lucide-react';

export default function DesktopHeader() {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  const navItems = [
    { name: 'CONSOLES', path: '/console' },
    { name: 'FABRICATORS', path: '/fabricators' },
    { name: 'VS MODE', path: '/arena' },
  ];

  return (
    <nav className="hidden md:flex sticky top-0 z-50 bg-retro-dark border-b-4 border-black px-6 py-3 justify-between items-center shadow-[0_10px_0_rgba(0,0,0,0.5)]">

        {/* LEFT: Logo */}
        <div className="flex items-center">
            <Link href="/" className="flex items-center group">
                <span className="font-pixel text-[20px] leading-tight text-white group-hover:text-retro-neon transition-colors">RETRO_CIRCUIT</span>
            </Link>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 flex justify-center px-8">
            <button
                onClick={openSearch}
                className="w-96 flex items-center justify-between border-2 border-retro-grid bg-black/50 px-4 py-2 font-bold text-gray-400 hover:text-white hover:border-retro-neon transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <Search size={16} className="group-hover:text-retro-neon" />
                    <span className="text-sm font-mono tracking-wide">SEARCH DATABASE...</span>
                </div>
                <div className="flex gap-1">
                     <span className="text-[10px] bg-retro-grid/30 border border-retro-grid px-1.5 rounded text-gray-500 font-mono group-hover:border-retro-neon group-hover:text-retro-neon">CMD</span>
                     <span className="text-[10px] bg-retro-grid/30 border border-retro-grid px-1.5 rounded text-gray-500 font-mono group-hover:border-retro-neon group-hover:text-retro-neon">K</span>
                </div>
            </button>
        </div>

        {/* RIGHT: Navigation */}
        <div className="flex gap-6">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    href={item.path}
                    className={`uppercase font-bold px-2 py-1 transition-colors border-2 ${
                        pathname.startsWith(item.path)
                            ? 'bg-retro-neon text-black border-retro-neon'
                            : 'bg-transparent text-[#9CA3AF] border-transparent hover:border-retro-neon hover:text-white'
                    }`}
                >
                    {item.name}
                </Link>
            ))}
        </div>
    </nav>
  );
}
