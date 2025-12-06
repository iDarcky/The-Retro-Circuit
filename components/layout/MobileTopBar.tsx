'use client';

import { useState, type FC } from 'react';
import Logo from '../ui/Logo';
import { IconSearch, IconMenu, IconClose } from '../ui/Icons';
import GlobalSearch from '../ui/GlobalSearch';

interface MobileTopBarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  customLogo: string | null;
}

const MobileTopBar: FC<MobileTopBarProps> = ({ onMenuClick, isSidebarOpen, customLogo }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 md:hidden bg-retro-dark/90 backdrop-blur-md border-b border-retro-neon flex items-center justify-between px-4 shadow-lg transition-all duration-300">
        {/* Left: Logo */}
        <div className="flex items-center">
            <Logo src={customLogo} className="h-8 w-auto" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`transition-colors ${isSearchOpen ? 'text-retro-neon' : 'text-gray-400 hover:text-white'}`}
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

      {/* Search Overlay */}
      {isSearchOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-retro-dark border-b border-retro-grid shadow-2xl animate-slideDown">
              <GlobalSearch autoFocus className="border-b-0" /> 
          </div>
      )}
    </>
  );
};

export default MobileTopBar;