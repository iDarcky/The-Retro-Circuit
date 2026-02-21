'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '../ui/SearchContext';
import MobileBottomNav from './MobileBottomNav';
import MobileTopBar from './MobileTopBar';
import DesktopHeader from './DesktopHeader';
import { IconSearch, IconClose } from '../ui/Icons';

// --- HELPER COMPONENTS ---

const SidebarItem = ({ to, label, exact = false }: { to: string, label: string, exact?: boolean }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === to : pathname.startsWith(to);

  return (
    <Link 
      href={to} 
      className={`group flex items-center px-6 py-4 border-l-2 transition-colors duration-300 font-sans font-bold tracking-wide text-sm uppercase ${
        isActive 
          ? 'border-violet-500 bg-white/5 text-white'
          : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/20'
      }`}
    >
      <span>{label}</span>
    </Link>
  );
};

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

      {/* MOBILE DRAWER BACKDROP (z-50) */}
      {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-[50] bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          />
      )}

      {/* MOBILE SIDEBAR (Drawer: Right on Mobile) */}
      {/* Hidden on Desktop now as we use Top Nav */}
      <aside className={`
          flex flex-col h-screen transition-transform duration-300 ease-out
          
          /* Mobile: Fixed Right, Slide from Right, Signal Left Border, High Z-Index */
          fixed top-0 right-0 w-80 bg-bg-primary border-l-2 border-violet-500 z-[60]
          
          /* Desktop: Hidden */
          md:hidden

          /* Animation State Logic */
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between min-h-[80px]">
             <span className="font-sans font-black text-2xl tracking-tighter text-white uppercase">MENU</span>
             <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Close Menu"
             >
                <IconClose className="w-6 h-6" />
             </button>
        </div>

        <nav className="flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar">
           {/* SEARCH TRIGGER */}
           <div className="px-6 mb-8">
                <button 
                    onClick={openSearch}
                    className="w-full bg-white/5 border border-white/10 hover:border-violet-500 hover:bg-white/10 transition-colors text-gray-400 font-sans font-bold text-sm px-4 py-3 flex justify-between items-center group"
                >
                    <span className="tracking-wider">SEARCH DATABASE</span>
                    <IconSearch className="w-4 h-4 text-gray-500 group-hover:text-violet-500 transition-colors" />
                </button>
           </div>

           <SidebarItem to="/" label="CONTROL ROOM" exact />
           <SidebarItem to="/consoles" label="CONSOLES" />
           <SidebarItem to="/fabricators" label="FABRICATORS" />
           <SidebarItem to="/finder" label="FINDER" />
           <SidebarItem to="/arena" label="VS MODE" />
           <SidebarItem to="/news" label="NEWS" />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 flex flex-col min-h-0">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg-primary/80 pb-24 md:pb-0 flex flex-col min-h-0">
             {children}
        </div>

        {/* Floating Mobile Bottom Dock */}
        <MobileBottomNav />
      </main>

    </div>
  );
};

export default MainLayout;
