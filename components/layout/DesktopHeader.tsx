'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '../ui/SearchContext';
import { Search } from 'lucide-react';

// Each section has its own signal colour, shown as the underline under its link.
const navItems = [
  { name: 'CONSOLES', path: '/consoles', bar: 'bg-violet-500' },
  { name: 'BEST OF', path: '/best', bar: 'bg-yellow-400' },
  { name: 'FABRICATORS', path: '/fabricators', bar: 'bg-emerald-500' },
  { name: 'VS MODE', path: '/arena', bar: 'bg-cyan-500' },
  { name: 'NEWS', path: '/news', bar: 'bg-orange-500' },
];

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:-outline-offset-2';

/** The four face buttons, the site's small mark. */
function FaceButtons() {
  const dot = 'w-[6px] h-[6px] rounded-full';
  return (
    <span aria-hidden className="inline-grid grid-cols-3 gap-px shrink-0 transition-transform duration-500 group-hover:rotate-90">
      <span /><span className={`${dot} bg-violet-500`} /><span />
      <span className={`${dot} bg-cyan-500`} /><span /><span className={`${dot} bg-rose-500`} />
      <span /><span className={`${dot} bg-orange-500`} /><span />
    </span>
  );
}

export default function DesktopHeader() {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  return (
    <div data-site-header className="sticky top-0 z-50 flex flex-col bg-bg-primary border-b-2 border-violet-500">
      <nav aria-label="Main" className="hidden md:flex h-16 items-stretch divide-x divide-border-subtle">
        {/* Logo */}
        <Link href="/" className={`group shrink-0 flex items-center gap-3 px-4 lg:px-6 hover:bg-white/[0.04] transition-colors ${focus}`}>
          <FaceButtons />
          <span className="hidden lg:inline font-pixel text-[12px] xl:text-[13px] leading-none text-white whitespace-nowrap">
            RETRO CIRCUIT<span className="text-violet-500 motion-safe:animate-pulse">_</span>
          </span>
          <span className="sr-only lg:hidden">The Retro Circuit</span>
        </Link>

        {/* Search: a full bar when there is room, a square button when there is not */}
        <div className="flex-1 min-w-0 flex items-center justify-center px-3 lg:px-6">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search the database"
            className={`group w-10 h-10 xl:w-full xl:max-w-sm xl:h-auto flex items-center justify-center xl:justify-between border border-white/10 px-0 xl:px-4 xl:py-2 text-zinc-500 hover:text-white hover:border-white/30 transition-colors ${focus}`}
          >
            <span className="flex items-center gap-3">
              <Search size={14} className="group-hover:text-violet-400 transition-colors" />
              <span className="hidden xl:inline text-xs font-mono">Search handhelds, chips, brands</span>
            </span>
            <span className="hidden xl:flex gap-1 font-mono text-[10px]">
              <kbd className="border border-white/10 px-1.5 py-0.5">⌘</kbd>
              <kbd className="border border-white/10 px-1.5 py-0.5">K</kbd>
            </span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 px-4 lg:px-6 xl:px-8 shrink-0">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative font-pixel text-[9px] lg:text-[10px] py-1 whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-zinc-500 hover:text-white'} ${focus}`}
              >
                {item.name}
                <span className={`absolute -bottom-1.5 left-0 h-[2px] ${item.bar} transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </div>

        {/* The Finder, Bit's quiz */}
        <Link
          href="/finder"
          aria-current={pathname.startsWith('/finder') ? 'page' : undefined}
          className={`shrink-0 flex items-center px-4 lg:px-6 font-pixel text-[9px] lg:text-[10px] whitespace-nowrap bg-violet-600 text-white hover:bg-white hover:text-black transition-colors ${focus}`}
        >
          FIND MINE
        </Link>
      </nav>
    </div>
  );
}
