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
    // Changed: Removed shadow, added 1px border with specific rgba color
    <div className="sticky top-0 z-50 flex flex-col border-b border-[rgba(255,255,255,0.06)]">
      {/* Changed: Removed border-b-4 border-black */}
      <nav className="hidden md:flex bg-bg-primary px-6 py-3 justify-between items-center">

          {/* LEFT: Logo */}
          <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                  <span className="font-pixel text-[20px] leading-tight text-white group-hover:text-secondary transition-colors">RETRO CIRCUIT_</span>
              </Link>
          </div>

          {/* CENTER: Search Bar */}
          <div className="flex-1 flex justify-center px-8">
              <button
                  onClick={openSearch}
                  className="w-96 flex items-center justify-between border-2 border-border-normal bg-black/50 px-4 py-2 font-bold text-gray-400 hover:text-white hover:border-secondary transition-colors group"
              >
                  <div className="flex items-center gap-2">
                      <Search size={16} className="group-hover:text-secondary" />
                      <span className="text-sm font-tech tracking-wider">SEARCH DATABASE...</span>
                  </div>
                  <div className="flex gap-1">
                      <span className="text-[10px] bg-bg-secondary/30 border border-border-normal px-1.5 rounded text-gray-500 font-tech group-hover:border-secondary group-hover:text-secondary">CMD</span>
                      <span className="text-[10px] bg-bg-secondary/30 border border-border-normal px-1.5 rounded text-gray-500 font-tech group-hover:border-secondary group-hover:text-secondary">K</span>
                  </div>
              </button>
          </div>

          {/* RIGHT: Navigation */}
          <div className="flex gap-6">
              {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.path);
                  return (
                      <Link
                          key={item.path}
                          href={item.path}
                          className={`group relative uppercase font-pixel text-[10px] md:text-xs px-2 py-1 transition-colors ${
                              isActive ? 'text-white' : 'text-[#9CA3AF] hover:text-white'
                          }`}
                      >
                          {item.name}
                          <span
                              className={`absolute bottom-0 left-0 h-[2px] bg-secondary transition-all duration-300 ease-out ${
                                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                              }`}
                          />
                      </Link>
                  );
              })}
          </div>
      </nav>
    </div>
  );
}
