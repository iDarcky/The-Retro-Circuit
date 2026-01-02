'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSound } from '../ui/SoundContext';
import { useSearch } from '../ui/SearchContext';
import { retroAuth } from '../../lib/auth';
import { checkDatabaseConnection } from '../../lib/api';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/singleton';
import MobileBottomNav from './MobileBottomNav';
import MobileTopBar from './MobileTopBar';
import DesktopHeader from './DesktopHeader';
import SystemBanner from './SystemBanner';
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
          ? 'border-secondary bg-bg-secondary/50 text-white shadow-[inset_0_0_10px_rgba(0,255,157,0.2)]'
          : 'border-transparent text-gray-400 hover:text-primary hover:bg-bg-secondary/20 hover:border-primary'
      }`}
      onMouseEnter={playHover}
      onClick={playClick}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-secondary' : 'group-hover:scale-110'}`}>
        <Icon className="w-5 h-5 mr-2" />
      </div>
      <span className="tracking-widest text-sm">{label}</span>
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
      
      {/* SYSTEM BANNER - Always Top */}
      <SystemBanner />

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
          flex flex-col h-screen transition-transform duration-300 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)]
          
          /* Mobile: Fixed Right, Slide from Right, Neon Left Border, High Z-Index */
          fixed top-0 right-0 w-72 bg-black border-l border-secondary z-[60]
          
          /* Desktop: Hidden */
          md:hidden

          /* Animation State Logic */
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 border-b border-border-normal flex items-center justify-center bg-black/20 min-h-[80px]">
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
                    className="w-full bg-black/40 border border-white/10 text-gray-500 font-mono text-sm px-3 py-2 flex justify-between items-center hover:border-secondary hover:text-white transition-all group cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <IconSearch className="w-4 h-4" />
                        <span className="tracking-wider">QUICK FIND</span>
                    </span>
                    <span className="text-[10px] border border-gray-700 px-1.5 py-0.5 rounded text-gray-600 group-hover:text-secondary group-hover:border-secondary">
                        CMD+K
                    </span>
                </button>
           </div>

           <div className="px-6 mb-2 text-xs font-mono text-secondary uppercase tracking-widest opacity-80">MAINFRAME</div>
           <SidebarItem to="/" icon={IconHome} label="CONTROL ROOM" exact />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-primary uppercase tracking-widest opacity-80">DATABASE</div>
           <SidebarItem to="/consoles" icon={IconDatabase} label="CONSOLES" />
           <SidebarItem to="/fabricators" icon={IconChip} label="FABRICATORS" />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-accent uppercase tracking-widest opacity-80">TOOLS</div>
           <SidebarItem to="/arena" icon={IconVS} label="VS MODE" />
        </nav>

        {/* Status Footer */}
        <div className="p-2 bg-black text-[10px] font-mono text-center flex justify-end items-center px-4 text-gray-600">
            {isAdmin && (
                <span className={`flex items-center gap-1 ${dbStatus === 'ONLINE' ? 'text-secondary' : 'text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${dbStatus === 'ONLINE' ? 'bg-secondary' : 'bg-red-500'} animate-pulse`}></span>
                    {dbStatus === 'ONLINE' ? 'DB ONLINE' : 'OFFLINE'}
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
