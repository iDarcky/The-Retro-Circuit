
'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSound } from '../ui/SoundContext';
import { retroAuth } from '../../lib/auth';
import { checkDatabaseConnection } from '../../lib/api';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/singleton';
import GlobalSearch from '../ui/GlobalSearch';
import Logo from '../ui/Logo';
import type { User } from '@supabase/supabase-js';
import { 
  IconNews, IconDatabase, IconVS, IconGames, IconTimeline, 
  IconLogin, IconHome, IconSettings 
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

const MobileNavItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
    const pathname = usePathname();
    const isActive = exact ? pathname === to : pathname.startsWith(to);
    const { playClick } = useSound();

    return (
        <Link 
            href={to}
            onClick={playClick}
            className={`flex flex-col items-center justify-center p-2 ${isActive ? 'text-retro-neon' : 'text-gray-500'}`}
        >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono">{label}</span>
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

  useEffect(() => {
    const init = async () => {
        // Check DB
        if (!isSupabaseConfigured) {
            setDbStatus('OFFLINE');
        } else {
            const connected = await checkDatabaseConnection();
            setDbStatus(connected ? 'ONLINE' : 'OFFLINE');
        }

        // Check Auth
        const currentUser = await retroAuth.getUser();
        setUser(currentUser);
        
        // Check Admin Status
        const adminStatus = await retroAuth.isAdmin();
        setIsAdmin(adminStatus);
        
        // Check Custom Logo (Local Setting)
        const savedLogo = localStorage.getItem('retro_custom_logo');
        if (savedLogo) setCustomLogo(savedLogo);

        // Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user || null);
            // Re-verify admin status on auth change
            const newAdminStatus = await retroAuth.isAdmin();
            setIsAdmin(newAdminStatus);
        });

        return () => subscription.unsubscribe();
    };
    init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-retro-dark">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(42, 42, 64, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(42, 42, 64, 0.5) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             opacity: 0.2
           }}>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-retro-grid bg-retro-dark/95 backdrop-blur z-20 h-screen sticky top-0">
        <div className="p-6 border-b border-retro-grid flex items-center justify-center">
             <div className="relative group">
                <Logo src={customLogo} className="w-12 h-12 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)] transition-transform group-hover:scale-105" />
             </div>
             <div className="ml-3">
                 <h1 className="font-pixel text-sm text-white leading-none">RETRO</h1>
                 <h1 className="font-pixel text-sm text-retro-neon leading-none">CIRCUIT</h1>
             </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar">
           <div className="px-6 mb-2 text-xs font-mono text-gray-600 uppercase">Mainframe</div>
           <SidebarItem to="/" icon={IconHome} label="CONTROL ROOM" exact />
           <SidebarItem to="/signals" icon={IconNews} label="SIGNALS" />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-gray-600 uppercase">Database</div>
           <SidebarItem to="/console" icon={IconDatabase} label="CONSOLES" />
           <SidebarItem to="/archive" icon={IconGames} label="GAME VAULT" />
           <SidebarItem to="/chrono" icon={IconTimeline} label="TIMELINE" />
           
           <div className="px-6 mt-6 mb-2 text-xs font-mono text-gray-600 uppercase">Tools</div>
           <SidebarItem to="/arena" icon={IconVS} label="VS MODE" />
        </nav>

        <div className="p-4 border-t border-retro-grid">
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
            <span>v1.0.6</span>
            {isAdmin && (
                <span className={`flex items-center gap-1 ${dbStatus === 'ONLINE' ? 'text-retro-neon' : 'text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${dbStatus === 'ONLINE' ? 'bg-retro-neon' : 'bg-red-500'} animate-pulse`}></span>
                    {dbStatus === 'ONLINE' ? 'DATABASE ONLINE' : 'OFFLINE'}
                </span>
            )}
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden h-16 border-b border-retro-grid bg-retro-dark/95 backdrop-blur z-20 flex items-center justify-between px-4 sticky top-0">
         <div className="flex items-center">
             <Logo src={customLogo} className="w-8 h-8 drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]" />
             <span className="ml-2 font-pixel text-xs text-white">RETRO CIRCUIT</span>
         </div>
         <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-retro-neon">
             {isSidebarOpen ? 'CLOSE' : 'MENU'}
         </button>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-10 bg-black/95 pt-20 px-4 pb-safe animate-fadeIn">
              <nav className="space-y-4">
                  <Link href="/" onClick={() => setSidebarOpen(false)} className="block p-4 border border-retro-grid text-retro-neon font-pixel text-center hover:bg-retro-neon hover:text-black">CONTROL ROOM</Link>
                  <Link href="/console" onClick={() => setSidebarOpen(false)} className="block p-4 border border-retro-grid text-white font-pixel text-center hover:border-retro-blue hover:text-retro-blue">CONSOLES</Link>
                  <Link href="/archive" onClick={() => setSidebarOpen(false)} className="block p-4 border border-retro-grid text-white font-pixel text-center hover:border-retro-pink hover:text-retro-pink">GAMES</Link>
                  <Link href="/arena" onClick={() => setSidebarOpen(false)} className="block p-4 border border-retro-grid text-white font-pixel text-center hover:border-yellow-400 hover:text-yellow-400">VS MODE</Link>
                  <Link href="/login" onClick={() => setSidebarOpen(false)} className="block p-4 border border-retro-grid text-gray-400 font-pixel text-center hover:bg-white hover:text-black">MY ACCOUNT</Link>
              </nav>
          </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden">
        {/* Global Search Bar */}
        <GlobalSearch />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-retro-dark/80 pb-20 md:pb-0">
             {children}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-retro-dark border-t border-retro-grid grid grid-cols-5 items-center pb-safe z-30">
            <MobileNavItem to="/" icon={IconHome} label="Home" exact />
            <MobileNavItem to="/signals" icon={IconNews} label="News" />
            <MobileNavItem to="/console" icon={IconDatabase} label="Sys" />
            <MobileNavItem to="/archive" icon={IconGames} label="Games" />
            <MobileNavItem to="/login" icon={IconLogin} label="Acct" />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
