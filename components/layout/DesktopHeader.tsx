'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '../ui/SearchContext';
import { Search } from 'lucide-react';

export default function DesktopHeader() {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  const navItems = [
    { name: 'CONSOLES', path: '/consoles' },
    { name: 'FABRICATORS', path: '/fabricators' },
    { name: 'VS MODE', path: '/arena' },
    { name: 'NEWS', path: '/news' },
  ];

  return (
    <div className="sticky top-0 z-50 hidden md:flex flex-col bg-bg-primary border-b-2 border-violet-500">
      <nav className="flex h-16 items-stretch divide-x divide-border-subtle">

          {/* LEFT: Logo - Grid Cell 1 */}
          <div className="flex items-center px-6 shrink-0 bg-bg-primary hover:bg-bg-secondary transition-colors duration-300">
              <Link href="/" className="flex items-center group">
                  <span className="font-pixel text-[14px] leading-tight text-white/40 group-hover:text-secondary transition-colors">RETRO CIRCUIT_</span>
              </Link>
          </div>

          {/* CENTER: Search Bar - Grid Cell 2 (Flexible) */}
          <div className="flex-1 flex items-center justify-center bg-bg-primary">
              <button
                  onClick={openSearch}
                  className="w-96 flex items-center justify-between border border-border-normal bg-bg-secondary/50 px-4 py-2 font-bold text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-bg-secondary transition-all group"
              >
                  <div className="flex items-center gap-3">
                      <Search size={14} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
                      <span className="text-xs font-mono tracking-widest">SEARCH DATABASE...</span>
                  </div>
                  <div className="flex gap-1">
                      <span className="text-[10px] bg-black border border-border-subtle px-1.5 py-0.5 text-gray-500 font-mono group-hover:border-violet-500/30 group-hover:text-violet-400 transition-colors">CMD</span>
                      <span className="text-[10px] bg-black border border-border-subtle px-1.5 py-0.5 text-gray-500 font-mono group-hover:border-violet-500/30 group-hover:text-violet-400 transition-colors">K</span>
                  </div>
              </button>
          </div>

          {/* RIGHT: Navigation - Grid Cell 3 */}
          <div className="flex items-center gap-8 px-8 shrink-0 bg-bg-primary">
              {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.path);
                  return (
                      <Link
                          key={item.path}
                          href={item.path}
                          className={`group relative uppercase font-pixel text-[10px] py-1 transition-colors ${
                              isActive ? 'text-white' : 'text-gray-500 hover:text-white'
                          }`}
                      >
                          {item.name}
                          <span
                              className={`absolute -bottom-1 left-0 h-[2px] bg-violet-500 transition-all duration-300 ease-out ${
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
