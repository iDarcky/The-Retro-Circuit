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
    <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-retro-dark border-b border-retro-grid z-40 items-center justify-between px-6">
      {/* Logo */}
      <Link href="/" className="font-pixel text-xl text-white hover:text-retro-neon transition-colors">
        RETRO_CIRCUIT
      </Link>

      {/* Nav Links */}
      <nav className="flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`font-mono text-sm tracking-wider transition-colors hover:text-retro-neon ${
              pathname.startsWith(item.path) ? 'text-retro-neon' : 'text-gray-400'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={openSearch}
          className="flex items-center gap-2 px-3 py-1.5 border border-retro-grid bg-black/50 text-gray-400 hover:text-white hover:border-retro-neon transition-all font-mono text-xs group"
        >
          <Search size={14} className="group-hover:text-retro-neon" />
          <span className="hidden lg:inline">SEARCH_DB</span>
          <span className="bg-retro-grid/20 px-1 rounded text-[10px] text-gray-500 group-hover:text-retro-neon">⌘K</span>
        </button>
      </div>
    </header>
  );
}
