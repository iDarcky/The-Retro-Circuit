'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from '../ui/SearchContext';
import { retroAuth } from '../../lib/auth';
import { checkDatabaseConnection } from '../../lib/api';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/singleton';
import MobileBottomNav from './MobileBottomNav';
import MobileTopBar from './MobileTopBar';
import DesktopHeader from './DesktopHeader';
import { 
  IconDatabase, IconVS,
  IconHome, IconChip, IconSearch, IconClose
} from '../ui/Icons';

// --- HELPER COMPONENTS ---

const SidebarItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
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
      <Icon className={`w-5 h-5 mr-4 transition-colors ${isActive ? 'text-violet-500' : 'text-gray-600 group-hover:text-white'}`} />
      <span>{label}</span>
    </Link>
  );
};

// --- MAIN LAYOUT ---

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'CONNECTING' | 'ONLINE' | 'OFFLINE'>('CONNECTING');
  const [isAdmin, setIsAdmin] = useState(false);
  const { openSearch } = useSearch();

  useEffect(() => {
    // 1. Setup Auth Listener Immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, _session) => {
        // Re-verify admin status on auth change
        const newAdminStatus = await retroAuth.isAdmin();
        setIsAdmin(newAdminStatus);
    });

    // 2. Perform Async Initialization
    const init = async () => {
        // Auth: Check local session first (Fast)
        const session = await retroAuth.getSession();
        if (session?.user) {
            // Non-blocking admin check
            retroAuth.isAdmin().then(setIsAdmin);
        } else {
            // Server fallback (Slower but accurate)
            const currentUser = await retroAuth.getUser();
            if (currentUser) {
                retroAuth.isAdmin().then(setIsAdmin);
            }
        }

        // DB Connection: Perform last as it can be slow
        if (!isSupabaseConfigured) {
            setDbStatus('OFFLINE');
        } else {
            const connected = await checkDatabaseConnection();
            setDbStatus(connected ? 'ONLINE' : 'OFFLINE');
        }
    };

    init();

    return () => subscription.unsubscribe();
  }, []);

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

           <div className="px-6 mb-2 text-[10px] font-sans font-bold text-gray-600 uppercase tracking-widest">MAINFRAME</div>
           <SidebarItem to="/" icon={IconHome} label="CONTROL ROOM" exact />
           
           <div className="px-6 mt-8 mb-2 text-[10px] font-sans font-bold text-gray-600 uppercase tracking-widest">DATABASE</div>
           <SidebarItem to="/consoles" icon={IconDatabase} label="CONSOLES" />
           <SidebarItem to="/fabricators" icon={IconChip} label="FABRICATORS" />
           
           <div className="px-6 mt-8 mb-2 text-[10px] font-sans font-bold text-gray-600 uppercase tracking-widest">TOOLS</div>
           <SidebarItem to="/arena" icon={IconVS} label="VS MODE" />
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-white/10 bg-transparent text-[10px] font-mono text-center flex justify-between items-center px-6 text-gray-600">
            <span>SYSTEM STATUS</span>
            {isAdmin && (
                <span className={`flex items-center gap-2 ${dbStatus === 'ONLINE' ? 'text-violet-500' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'ONLINE' ? 'bg-violet-500' : 'bg-red-500'}`}></span>
                    {dbStatus === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
                </span>
            )}
        </div>
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
