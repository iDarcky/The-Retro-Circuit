'use client';

import { useState, useEffect, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSound } from '../ui/SoundContext';
import { retroAuth } from '../../services/authService';
import { checkDatabaseConnection } from '../../services/dataService';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import GlobalSearch from '../ui/GlobalSearch';
import { User } from '@supabase/supabase-js';
import { 
  IconNews, IconDatabase, IconVS, IconGames, IconTimeline, 
  IconLogin, IconHome, IconLock, IconSettings 
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
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 rounded-xl mx-1 ${isActive ? 'text-retro-neon bg-retro-neon/10 shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-retro-neon drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]' : ''}`} />
            <span className="text-[9px] font-pixel tracking-tighter text-center leading-tight">{label}</span>
        </Link>
    );
};

const FooterStatus = ({ crtEnabled, onToggleCrt }: { crtEnabled: boolean, onToggleCrt: () => void }) => {
    const [dbStatus, setDbStatus] = useState<'CHECKING' | 'ONLINE' | 'OFFLINE'>('CHECKING');
    const { enabled, toggleSound } = useSound();

    useEffect(() => {
        const check = async () => {
            if (!isSupabaseConfigured) {
                setDbStatus('OFFLINE');
                return;
            }
            const isConnected = await checkDatabaseConnection();
            setDbStatus(isConnected ? 'ONLINE' : 'OFFLINE');
        };
        check();
        const interval = setInterval(check, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className={`hidden md:flex fixed bottom-0 left-0 right-0 ${!isSupabaseConfigured ? 'h-auto pb-1' : 'h-8'} bg-retro-dark border-t border-retro-grid flex-col justify-end z-[60] font-mono`}>
            {!isSupabaseConfigured && (
                <div className="w-full bg-retro-pink text-black text-center text-[10px] py-1 font-bold animate-pulse mb-1">
                    ⚠ SYSTEM ALERT: DATABASE DISCONNECTED (MISSING .ENV CONFIG)
                </div>
            )}
            <div className="flex items-center justify-between px-4 h-8 text-[10px]">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-500">SYSTEM STATUS:</span>
                    <span className={`flex items-center ${
                        dbStatus === 'ONLINE' ? 'text-retro-neon' : 
                        dbStatus === 'OFFLINE' ? 'text-retro-pink animate-pulse' : 'text-yellow-400'
                    }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                            dbStatus === 'ONLINE' ? 'bg-retro-neon' : 
                            dbStatus === 'OFFLINE' ? 'bg-retro-pink' : 'bg-yellow-400'
                        }`}></span>
                        {dbStatus === 'CHECKING' ? 'ESTABLISHING UPLINK...' : `DATABASE ${dbStatus}`}
                    </span>
                    <Link href="/sitemap" className="text-gray-500 hover:text-retro-blue ml-4 border-l border-gray-700 pl-4">
                        [ SYSTEM MAP ]
                    </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                    <button onClick={onToggleCrt} className="text-retro-blue hover:text-white border border-retro-blue px-2 transition-colors">
                        {crtEnabled ? 'DISABLE CRT FX' : 'ENABLE CRT FX'}
                    </button>
                    <button onClick={toggleSound} className="text-retro-pink hover:text-white border border-retro-pink px-2 transition-colors">
                        {enabled ? 'MUTE AUDIO' : 'ENABLE AUDIO'}
                    </button>
                </div>
            </div>
        </footer>
    );
};

// --- MAIN LAYOUT ---

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const pathname = usePathname();
  const { enabled: soundEnabled, toggleSound } = useSound();

  const toggleCrt = () => {
    const next = !crtEnabled;
    setCrtEnabled(next);
    const scanlines = document.querySelector('.scanlines');
    const flicker = document.querySelector('.crt-flicker');
    if (scanlines) scanlines.classList.toggle('hidden', !next);
    if (flicker) flicker.classList.toggle('hidden', !next);
  };

  useEffect(() => {
    // Scroll the main content container to top on route change
    const mainContainer = document.querySelector('main');
    if (mainContainer) mainContainer.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
      setMobileSearchOpen(false);
      setMobileSettingsOpen(false);
  }, [pathname]);

  useEffect(() => {
      if (!isSupabaseConfigured) return;

      const checkAuth = async () => {
          const isA = await retroAuth.isAdmin();
          const u = await retroAuth.getUser();
          setIsAdmin(isA);
          setUser(u);
      };
      
      checkAuth();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          const u = session?.user || null;
          setUser(u);
          const isA = await retroAuth.isAdmin();
          setIsAdmin(isA);
      });

      return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen pt-16 md:pt-0 bg-retro-dark relative overflow-hidden">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-retro-dark border-b border-retro-grid z-[60] flex items-center justify-between px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="The Retro Circuit" className="h-10 w-auto object-contain drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]" />
        </Link>
        <div className="flex gap-4 items-center">
            <button 
                onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileSettingsOpen(false); }}
                className={`p-2 transition-colors ${mobileSearchOpen ? 'text-retro-neon' : 'text-gray-400'}`}
                aria-label="Search"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <button
                onClick={() => { setMobileSettingsOpen(!mobileSettingsOpen); setMobileSearchOpen(false); }}
                className={`p-2 transition-colors ${mobileSettingsOpen ? 'text-retro-neon' : 'text-gray-400'}`}
                aria-label="Settings"
            >
                <IconSettings className="w-5 h-5" />
            </button>
            {isAdmin && <Link href="/admin" className="p-2 text-retro-pink"><IconLock className="w-5 h-5" /></Link>}
        </div>
      </div>

      {/* MOBILE SETTINGS MENU */}
      {mobileSettingsOpen && (
          <>
            <div 
                className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px] md:hidden"
                onClick={() => setMobileSettingsOpen(false)}
            />
            <div className="md:hidden fixed top-16 right-0 w-72 bg-retro-dark border-l border-b border-retro-grid z-[60] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-[slideDown_0.2s_ease-out]">
                <div className="space-y-6">
                    <div>
                        <div className="font-pixel text-xs text-gray-500 mb-2">VISUAL FX</div>
                        <button 
                            onClick={() => { toggleCrt(); setMobileSettingsOpen(false); }}
                            className={`w-full border px-4 py-2 font-mono text-sm flex justify-between items-center ${crtEnabled ? 'border-retro-neon text-retro-neon' : 'border-gray-600 text-gray-400'}`}
                        >
                            <span>CRT SCANLINES</span>
                            <span>{crtEnabled ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>

                    <div>
                        <div className="font-pixel text-xs text-gray-500 mb-2">AUDIO</div>
                        <button 
                            onClick={() => { toggleSound(); setMobileSettingsOpen(false); }}
                            className={`w-full border px-4 py-2 font-mono text-sm flex justify-between items-center ${soundEnabled ? 'border-retro-pink text-retro-pink' : 'border-gray-600 text-gray-400'}`}
                        >
                            <span>SYSTEM SOUND</span>
                            <span>{soundEnabled ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>

                    <div className="pt-6 border-t border-retro-grid">
                        <Link href="/sitemap" onClick={() => setMobileSettingsOpen(false)} className="block font-mono text-xs text-gray-500 hover:text-white mb-2">
                            [ SYSTEM MAP ]
                        </Link>
                         <div className="font-mono text-[10px] text-gray-600">
                            v1.0.4 // RETRO-CIRCUIT
                        </div>
                    </div>
                </div>
            </div>
          </>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-retro-dark border-r border-retro-grid h-full z-50 flex-shrink-0 pb-8">
          <div className="p-6 border-b border-retro-grid">
             <Link href="/" className="block group">
                <img src="/logo.png" alt="Retro Circuit" className="w-full h-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="font-pixel text-center text-xs text-retro-neon tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">EST. 198X</div>
             </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              <SidebarItem to="/" icon={IconHome} label="CONTROL ROOM" exact />
              <SidebarItem to="/signals" icon={IconNews} label="SIGNAL FEED" />
              <SidebarItem to="/archive" icon={IconGames} label="GAME VAULT" />
              <SidebarItem to="/systems" icon={IconDatabase} label="CONSOLE VAULT" />
              <SidebarItem to="/arena" icon={IconVS} label="VS MODE" />
              <SidebarItem to="/chrono" icon={IconTimeline} label="HISTORY LINE" />
              
              <div className="my-4 border-t border-retro-grid mx-4"></div>
              
              <SidebarItem to={user ? "/login" : "/login"} icon={IconLogin} label={user ? "ID CARD" : "LOGIN"} />
              {isAdmin && <SidebarItem to="/admin" icon={IconLock} label="ROOT ACCESS" />}
          </nav>
          
          <div className="p-4 border-t border-retro-grid bg-black/20">
              <GlobalSearch />
          </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full relative z-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="md:hidden p-4">
              {mobileSearchOpen && (
                  <div className="mb-4 animate-[slideDown_0.2s_ease-out]">
                      <GlobalSearch />
                  </div>
              )}
          </div>

          {children}

          <div className="h-16 md:h-8"></div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-retro-dark border-t border-retro-grid z-50 flex items-center justify-around px-2 pb-safe">
          <MobileNavItem to="/" icon={IconHome} label="CONTROL" exact />
          <MobileNavItem to="/archive" icon={IconGames} label="GAME VAULT" />
          <MobileNavItem to="/systems" icon={IconDatabase} label="CONSOLE VAULT" />
          <MobileNavItem to="/arena" icon={IconVS} label="VS MODE" />
      </div>
      
      <FooterStatus crtEnabled={crtEnabled} onToggleCrt={toggleCrt} />
    </div>
  );
};

export default MainLayout;