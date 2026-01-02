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
      {/* Changed: Removed border-b border-secondary and shadow-lg, added border-[rgba(255,255,255,0.06)] */}
      <header className="z-50 h-16 md:hidden bg-bg-primary/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-4 transition-all duration-300 shrink-0">
        {/* Left: Logo */}
        <div className="flex items-center">
            <Link href="/" className="flex items-center group">
                <span className="font-pixel text-[14px] leading-tight text-white/40 group-hover:text-secondary transition-colors">RETRO CIRCUIT_</span>
            </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
            <button 
                onClick={openSearch}
                className="transition-colors text-gray-400 hover:text-white"
                aria-label="Search"
            >
                <IconSearch className="w-6 h-6" />
            </button>
            <button 
                onClick={onMenuClick}
                className="text-gray-400 hover:text-white transition-colors"
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
