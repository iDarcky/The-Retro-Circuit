'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { IconSearch, IconMenu, IconClose } from '../ui/Icons';
import { useSearch } from '../ui/SearchContext';

interface MobileTopBarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const MobileTopBar: FC<MobileTopBarProps> = ({ onMenuClick, isSidebarOpen }) => {
  const { openSearch } = useSearch();

  return (
    <>
      <header data-site-header className="z-50 h-14 md:hidden bg-bg-primary border-b-2 border-violet-500 flex items-center justify-between pr-1 transition-all duration-300 shrink-0">
        {/* Left Container */}
        <div className="flex items-center h-full">
            {/* Logo */}
            <div className="flex items-center h-full hover:bg-bg-secondary transition-colors duration-300 border-r border-border-subtle">
                <Link href="/" className="flex items-center group min-h-[44px] px-3 h-full">
                    <span className="font-pixel text-[11px] leading-tight text-white group-hover:text-secondary transition-colors">
                        RETRO CIRCUIT
                        <span className="text-violet-500 motion-safe:animate-pulse">_</span>
                    </span>
                </Link>
            </div>

            {/* Pre-alpha Badge */}
            <div className="flex items-center h-full hover:bg-orange-500/10 transition-colors duration-300 border-r border-border-subtle">
                <Link href="/about" className="flex items-center justify-center group px-2.5 h-full w-full">
                    <div className="border border-orange-500 bg-orange-500/10 px-1.5 py-0.5 flex items-center group-hover:bg-orange-500 transition-colors duration-300">
                        <span className="font-pixel text-[8px] leading-tight text-orange-500 group-hover:text-black transition-colors">BETA</span>
                    </div>
                </Link>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
            <button
                onClick={openSearch}
                className="flex items-center gap-2 border border-border-normal bg-bg-secondary/50 px-2.5 h-9
                           text-gray-500 hover:text-white hover:border-violet-500/50 transition-colors"
                aria-label="Search the database"
            >
                <IconSearch className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Search</span>
            </button>
            <button 
                onClick={onMenuClick}
                className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Menu"
            >
                {isSidebarOpen ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
            </button>
        </div>
      </header>
    </>
  );
};

export default MobileTopBar;
