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
      <header className="z-50 h-12 md:hidden bg-bg-primary border-b-2 border-violet-500 flex items-center justify-between px-3 transition-all duration-300 shrink-0">
        {/* Left: Logo */}
        <div className="flex items-center">
            <Link href="/" className="flex items-center group min-h-[44px] items-center">
                <span className="font-pixel text-xs leading-tight text-white/40 group-hover:text-secondary transition-colors">RETRO CIRCUIT_</span>
            </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
            <button 
                onClick={openSearch}
                className="transition-colors text-gray-400 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Search"
            >
                <IconSearch className="w-6 h-6" />
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
