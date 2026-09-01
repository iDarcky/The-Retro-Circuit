'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSearch } from '../ui/SearchContext';
import MobileBottomNav from './MobileBottomNav';
import MobileTopBar from './MobileTopBar';
import DesktopHeader from './DesktopHeader';
import { MobileSidebar } from './MobileSidebar';

// --- MAIN LAYOUT ---

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { openSearch } = useSearch();

  // Close sidebar on route change (mobile)
  const pathname = usePathname();
  useEffect(() => {
      setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-bg-primary">
      
      {/* BACKGROUND GRID */}

      {/* MOBILE HEADER (z-40) */}
      <MobileTopBar 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />

      {/* DESKTOP HEADER (New Top Nav) */}
      <DesktopHeader />

      {/* MOBILE SIDEBAR (Refactored) */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        openSearch={openSearch}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 flex flex-col min-h-0">
        {/* Scrollable Content Container */}
        <div data-scroll-root className="flex-1 overflow-y-auto custom-scrollbar bg-bg-primary/80 pb-24 md:pb-0 flex flex-col min-h-0">
             {children}
        </div>

        {/* Floating Mobile Bottom Dock */}
        <MobileBottomNav />
      </main>

    </div>
  );
};

export default MainLayout;
