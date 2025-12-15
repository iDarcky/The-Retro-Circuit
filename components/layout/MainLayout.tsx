'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSound } from '../ui/SoundContext';
import { useSearch } from '../ui/SearchContext';
import MobileBottomNav from './MobileBottomNav';
import MobileTopBar from './MobileTopBar';
import DesktopHeader from './DesktopHeader';
import { 
  IconDatabase, IconVS,
  IconHome, IconChip, IconSearch
} from '../ui/Icons';

// --- HELPER COMPONENTS ---

const SidebarItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === to : pathname.startsWith(to);
  const { playHover, playClick } = useSound();

  return (
    <Link 
      href={to} 
      className={`group flex items-center px-4 py-3 font-mono transition-all duration-200 border-l-4 ${
        isActive 
          ? 'border-retro-neon bg-retro-grid/50 text-white shadow-[inset_0_0_10px_rgba(0,255,157,0.2)]' 
          : 'border-transparent text-gray-400 hover:text-retro-blue hover:bg-retro-grid/20 hover:border-retro-blue'
      }`}
      onMouseEnter={playHover}
      onClick={playClick}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-retro-neon' : 'group-hover:scale-110'}`}>
        <Icon className="w-5 h-5 mr-2" />
      </div>
      <span className="tracking-widest text-sm">{label}</span>
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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-retro-dark">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(42, 42, 64, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(42, 42, 64, 0.5) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             opacity: 0.2
           }}>
      </div>

      {/* MOBILE HEADER (z-40) */}
      <MobileTopBar 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />

      {/* DESKTOP HEADER (Sticky, z-50) */}
      <DesktopHeader />

      {/* MOBILE DRAWER BACKDROP (z-50) */}
      {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-[50] bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          />
      )}

      {/* SIDEBAR (Responsive Drawer: Right on Mobile, Hidden on Desktop) */}
      {/* Mobile Z-Index must be > Backdrop (50) and > Bottom Nav (50) -> So we use 60 */}
      <aside className={`
          flex flex-col h-screen transition-transform duration-300 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)]
          
          /* Mobile: Fixed Right, Slide from Right, Neon Left Border, High Z-Index */
          fixed top-0 right-0 w-72 bg-black border-l border-retro-neon z-[60]
          
          /* Desktop: HIDDEN - replaced by DesktopHeader */
          md:hidden

          /* Animation State Logic */
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 border-b border-retro-grid flex items-center justify-center bg-black/20 min-h-[80px]">
             <div className="relative group text-center">
                <Link href="/" className="block hover:opacity-80 transition-opacity">
                  <Image 
                    src="/brand-logo.png" 
                    alt="The Retro Circuit" 
                    width={180} 
                    height={50} 
                    priority
                    className="object-contain drop-shadow-[0_0_8px_rgba(0,255,157,0.3)]"
                  />
                </Link>
             </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar">
           {/* SEARCH TRIGGER */}
           <div className="px-4 mb-6">
                <button 
                    onClick={openSearch}
                    className="w-full bg-black/40 border border-white/10 text-gray-500 font-mono text-sm px-3 py-2 flex justify-between items-center hover:border-retro-neon hover:text-white transition-all group cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <IconSearch className="w-4 h-4" />
                        <span className="tracking-wider">QUICK FIND</span>
                    </span>
                    <span className="text-[10px] border border-gray-700 px-1.5 py-0.5 rounded text-gray-600 group-hover:text-retro-neon group-hover:border-retro-neon">
                        CMD+K
                    </span>
                </button>
           </div>

           <div className="px-6 mb-2 text-xs font-mono text-retro-neon uppercase tracking-widest opacity-80">MAINFRAME</div>
           <SidebarItem to="/" icon={IconHome} label="CONTROL ROOM" exact />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-retro-blue uppercase tracking-widest opacity-80">DATABASE</div>
           <SidebarItem to="/console" icon={IconDatabase} label="CONSOLES" />
           <SidebarItem to="/fabricators" icon={IconChip} label="FABRICATORS" />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-retro-pink uppercase tracking-widest opacity-80">TOOLS</div>
           <SidebarItem to="/arena" icon={IconVS} label="VS MODE" />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 flex flex-col h-screen md:h-auto overflow-hidden pt-16 md:pt-0">
        {/* Scrollable Content Container: Set to flex-col to ensure children fill height properly */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-retro-dark/80 pb-24 md:pb-0 flex flex-col min-h-0">
             {children}
        </div>

        {/* Floating Mobile Bottom Dock */}
        <MobileBottomNav />
      </main>

    </div>
  );
};

export default MainLayout;