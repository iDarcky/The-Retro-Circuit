
'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSound } from '../ui/SoundContext';
import { useSearch } from '../ui/SearchContext';
import { retroAuth } from '../../lib/auth';
import { checkDatabaseConnection } from '../../lib/api';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/singleton';
import Logo from '../ui/Logo';
import MobileBottomNav from './MobileBottomNav';
import MobileTopBar from './MobileTopBar';
import type { User } from '@supabase/supabase-js';
import { 
  IconNews, IconDatabase, IconVS, IconGames, IconTimeline, 
  IconHome, IconSettings, IconChip, IconSearch
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
  const [dbStatus, setDbStatus] = useState<'CONNECTING' | 'ONLINE' | 'OFFLINE'>('CONNECTING');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const { openSearch } = useSearch();

  useEffect(() => {
    // 1. Setup Auth Listener Immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user || null);
        // Re-verify admin status on auth change
        const newAdminStatus = await retroAuth.isAdmin();
        setIsAdmin(newAdminStatus);
    });

    // 2. Perform Async Initialization
    const init = async () => {
        // Auth: Check local session first (Fast)
        const session = await retroAuth.getSession();
        if (session?.user) {
            setUser(session.user);
            // Non-blocking admin check
            retroAuth.isAdmin().then(setIsAdmin);
        } else {
            // Server fallback (Slower but accurate)
            const currentUser = await retroAuth.getUser();
            setUser(currentUser);
            if (currentUser) {
                retroAuth.isAdmin().then(setIsAdmin);
            }
        }
        
        // Logo: Check Local Storage
        const savedLogo = localStorage.getItem('retro_custom_logo');
        if (savedLogo) setCustomLogo(savedLogo);

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
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-x-hidden bg-retro-dark">
      
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
        customLogo={customLogo}
      />

      {/* MOBILE DRAWER BACKDROP (z-50) */}
      {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-[50] bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          />
      )}

      {/* SIDEBAR (Responsive Drawer: Right on Mobile, Left on Desktop) */}
      {/* Mobile Z-Index must be > Backdrop (50) and > Bottom Nav (50) -> So we use 60 */}
      <aside className={`
          flex flex-col h-screen transition-transform duration-300 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)]
          
          /* Mobile: Fixed Right, Slide from Right, Neon Left Border, High Z-Index */
          fixed top-0 right-0 w-72 bg-black border-l border-retro-neon z-[60]
          
          /* Desktop: Sticky Left, Always Visible, Standard Border, Normal Z-Index */
          md:sticky md:top-0 md:left-0 md:right-auto md:w-64 md:bg-retro-dark/95 md:border-l-0 md:border-r md:border-retro-grid md:shadow-none md:z-auto

          /* Animation State Logic */
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-retro-grid flex items-center justify-center bg-black/20">
             <div className="relative group">
                <Logo src={customLogo} className="h-12 w-auto drop-shadow-[0_0_10px_rgba(0,255,157,0.5)] transition-transform group-hover:scale-105" />
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
           <SidebarItem to="/signals" icon={IconNews} label="SIGNALS" />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-retro-blue uppercase tracking-widest opacity-80">DATABASE</div>
           <SidebarItem to="/console" icon={IconDatabase} label="CONSOLES" />
           <SidebarItem to="/fabricators" icon={IconChip} label="FABRICATORS" />
           <SidebarItem to="/archive" icon={IconGames} label="GAME VAULT" />
           <SidebarItem to="/chrono" icon={IconTimeline} label="TIMELINE" />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-retro-pink uppercase tracking-widest opacity-80">TOOLS</div>
           <SidebarItem to="/arena" icon={IconVS} label="VS MODE" />
        </nav>

        <div className="p-4 border-t border-retro-grid bg-black/20">
            {user ? (
                <Link href="/login" className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors group">
                    <div className="w-8 h-8 rounded bg-retro-blue/20 border border-retro-blue flex items-center justify-center group-hover:bg-retro-blue group-hover:text-black transition-colors">
                        <IconSettings className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-gray-400">OPERATOR</div>
                        <div className="text-xs font-pixel text-retro-blue truncate w-32">{user.user_metadata?.username || 'USER'}</div>
                    </div>
                </Link>
            ) : (
                <Link href="/login" className="block w-full border border-retro-grid hover:border-retro-neon text-gray-400 hover:text-retro-neon p-2 text-center font-mono text-xs transition-all">
                    [ ACCESS TERMINAL ]
                </Link>
            )}
        </div>
        
        {/* Status Footer */}
        <div className="p-2 bg-black text-[10px] font-mono text-center flex justify-between items-center px-4 text-gray-600">
            <span>v1.1.0</span>
            {isAdmin && (
                <span className={`flex items-center gap-1 ${dbStatus === 'ONLINE' ? 'text-retro-neon' : 'text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${dbStatus === 'ONLINE' ? 'bg-retro-neon' : 'bg-red-500'} animate-pulse`}></span>
                    {dbStatus === 'ONLINE' ? 'DB ONLINE' : 'OFFLINE'}
                </span>
            )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 flex flex-col h-screen md:h-screen overflow-hidden pt-16 md:pt-0">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-retro-dark/80 pb-24 md:pb-0">
             {children}
        </div>

        {/* Floating Mobile Bottom Dock */}
        <MobileBottomNav />
      </main>

    </div>
  );
};

export default MainLayout;
