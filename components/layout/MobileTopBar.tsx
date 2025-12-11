'use client';

import { type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <header className="fixed top-0 left-0 right-0 z-50 h-16 md:hidden bg-retro-dark/90 backdrop-blur-md border-b border-retro-neon flex items-center justify-between px-4 shadow-lg transition-all duration-300">
        {/* Left: Logo */}
        <div className="flex items-center">
            <Link href="/">
                <Image 
                    src="/brand-logo.png" 
                    alt="The Retro Circuit" 
                    width={120} 
                    height={32} 
                    className="object-contain h-8 w-auto"
                />
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