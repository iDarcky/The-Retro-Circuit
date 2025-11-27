
import React, { useState, useEffect, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import BootSequence from './components/BootSequence';
import { SoundProvider, useSound } from './components/SoundContext';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import { checkDatabaseConnection, retroAuth } from './services/geminiService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import GlobalSearch from './components/GlobalSearch';
import RetroLoader from './components/RetroLoader';

// --- LAZY LOADED PAGES (Code Splitting) ---
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const NewsSection = React.lazy(() => import('./components/NewsSection'));
const ConsoleComparer = React.lazy(() => import('./components/ConsoleComparer'));
const GamesList = React.lazy(() => import('./components/GamesList'));
const GameDetails = React.lazy(() => import('./components/GameDetails'));
const Timeline = React.lazy(() => import('./components/Timeline'));
const AuthSection = React.lazy(() => import('./components/AuthSection'));
const ConsoleLibrary = React.lazy(() => import('./components/ConsoleLibrary'));
const ConsoleSpecs = React.lazy(() => import('./components/ConsoleSpecs'));
const ManufacturerDetail = React.lazy(() => import('./components/ManufacturerDetail'));
const AdminPortal = React.lazy(() => import('./components/AdminPortal'));
const HtmlSitemap = React.lazy(() => import('./components/HtmlSitemap'));
const NotFound = React.lazy(() => import('./components/NotFound'));

// --- ICONS ---
const IconNews = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>;
const IconDatabase = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const IconVS = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const IconGames = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4m-2-2v4"></path><circle cx="17" cy="11" r="0.5" fill="currentColor"></circle><circle cx="15" cy="13" r="0.5" fill="currentColor"></circle></svg>;
const IconTimeline = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconLogin = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>;
const IconHome = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconLock = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconSettings = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

// --- SIDEBAR NAVIGATION ---
const SidebarItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  const { playHover, playClick } = useSound();

  return (
    <Link 
      to={to} 
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

// --- MOBILE BOTTOM NAVIGATION ---
const MobileNavItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
    const location = useLocation();
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
    const { playClick } = useSound();

    return (
        <Link 
            to={to}
            onClick={playClick}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 rounded-xl mx-1 ${isActive ? 'text-retro-neon bg-retro-neon/10 shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-retro-neon drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]' : ''}`} />
            <span className="text-[9px] font-pixel tracking-tighter">{label}</span>
        </Link>
    );
};

// --- LAYOUT COMPONENTS ---
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

    // NOTE: Hidden on mobile (md:flex) to save space, moved controls to mobile header/menu
    return (
        <footer className={`hidden md:flex fixed bottom-0 left-0 right-0 ${!isSupabaseConfigured ? 'h-auto pb-1' : 'h-8'} bg-retro-dark border-t border-retro-grid flex-col justify-end z-50 font-mono`}>
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
                    <Link to="/sitemap" className="text-gray-500 hover:text-retro-blue ml-4 border-l border-gray-700 pl-4">
                        [ SITEMAP ]
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

const AppContent = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const location = useLocation();
  const { enabled: soundEnabled, toggleSound } = useSound();

  // CRT Effect Toggle Logic
  const toggleCrt = () => {
    const next = !crtEnabled;
    setCrtEnabled(next);
    const scanlines = document.querySelector('.scanlines');
    const flicker = document.querySelector('.crt-flicker');
    if (scanlines) scanlines.classList.toggle('hidden', !next);
    if (flicker) flicker.classList.toggle('hidden', !next);
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash.includes('type=recovery')) {
        sessionStorage.setItem('retro_recovery_pending', 'true');
    }
  }, [location]);

  useEffect(() => {
      setMobileSearchOpen(false);
      setMobileSettingsOpen(false);
  }, [location]);

  useEffect(() => {
      if (!isSupabaseConfigured) return;

      const checkAuth = async () => {
          const isA = await retroAuth.isAdmin();
          const u = await retroAuth.getUser();
          setIsAdmin(isA);
          setUser(u);
      };
      
      checkAuth();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          const u = session?.user || null;
          setUser(u);
          const isA = await retroAuth.isAdmin();
          setIsAdmin(isA);
      });

      return () => subscription.unsubscribe();
  }, []);

  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />;
  }

  return (
    // pb-24 on mobile to accommodate fixed bottom nav
    <div className="flex flex-col md:flex-row min-h-screen pt-16 md:pt-0 bg-retro-dark relative overflow-hidden">
      <SEOHead title="Gateway to the Golden Age" description="Comparing retro consoles and games." />

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-retro-dark border-b border-retro-grid z-[60] flex items-center justify-between px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <Link to="/" className="flex items-center gap-2">
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
            {isAdmin && <Link to="/admin" className="p-2 text-retro-pink"><IconLock className="w-5 h-5" /></Link>}
        </div>
      </div>

      {/* MOBILE SETTINGS DROPDOWN (Backdrop + Menu) */}
      {mobileSettingsOpen && (
          <>
            <div 
                className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px] md:hidden"
                onClick={() => setMobileSettingsOpen(false)}
            />
            <div className="md:hidden fixed top-16 right-0 w-72 bg-retro-dark border-l border-b border-retro-grid z-[60] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-[slideDown_0.2s_ease-out]">
                <div className="space-y-6">
                    {/* CRT Toggle in Mobile Menu */}
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

                    {/* Sound Toggle in Mobile Menu */}
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

                    {/* Footer Links in Mobile Menu */}
                    <div className="pt-6 border-t border-retro-grid">
                        <Link to="/sitemap" onClick={() => setMobileSettingsOpen(false)} className="block font-mono text-xs text-gray-500 hover:text-white mb-2">
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
      <aside className="hidden md:flex flex-col w-64 bg-retro-dark border-r border-retro-grid h-screen sticky top-0 z-50">
          <div className="p-6 border-b border-retro-grid">
             <Link to="/" className="block group">
                <img src="/logo.png" alt="Retro Circuit" className="w-full h-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="font-pixel text-center text-xs text-retro-neon tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">EST. 198X</div>
             </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              <SidebarItem to="/" icon={IconHome} label="DASHBOARD" exact />
              <SidebarItem to="/news" icon={IconNews} label="SIGNALS" />
              <SidebarItem to="/games" icon={IconGames} label="GAME DB" />
              <SidebarItem to="/consoles" icon={IconDatabase} label="HARDWARE" />
              <SidebarItem to="/comparer" icon={IconVS} label="VS. MODE" />
              <SidebarItem to="/timeline" icon={IconTimeline} label="TIMELINE" />
              
              <div className="my-4 border-t border-retro-grid mx-4"></div>
              
              <SidebarItem to={user ? "/login" : "/login"} icon={IconLogin} label={user ? "ID CARD" : "LOGIN"} />
              {isAdmin && <SidebarItem to="/admin" icon={IconLock} label="ROOT ACCESS" />}
          </nav>
          
          <div className="p-4 border-t border-retro-grid bg-black/20">
              <GlobalSearch />
          </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-screen relative z-10 overflow-x-hidden">
          <div className="md:hidden p-4">
              {/* Mobile Search Bar visible when toggled */}
              {mobileSearchOpen && (
                  <div className="mb-4 animate-[slideDown_0.2s_ease-out]">
                      <GlobalSearch />
                  </div>
              )}
          </div>

          <Suspense fallback={<RetroLoader />}>
              <ErrorBoundary>
                  <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/news" element={<NewsSection />} />
                      <Route path="/games" element={<GamesList />} />
                      <Route path="/games/:slug" element={<GameDetails />} />
                      <Route path="/consoles" element={<ConsoleLibrary />} />
                      <Route path="/consoles/brand/:name" element={<ManufacturerDetail />} />
                      <Route path="/consoles/:slug" element={<ConsoleSpecs />} />
                      <Route path="/comparer" element={<ConsoleComparer />} />
                      <Route path="/timeline" element={<Timeline />} />
                      <Route path="/login" element={<AuthSection />} />
                      <Route path="/signup" element={<AuthSection />} />
                      <Route path="/recovery" element={<AuthSection />} />
                      <Route path="/admin" element={<AdminPortal />} />
                      <Route path="/sitemap" element={<HtmlSitemap />} />
                      <Route path="*" element={<NotFound />} />
                  </Routes>
              </ErrorBoundary>
          </Suspense>

          <div className="h-16 md:h-0"></div> {/* Spacer for mobile nav */}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-retro-dark border-t border-retro-grid z-50 flex items-center justify-around px-2 pb-safe">
          <MobileNavItem to="/" icon={IconHome} label="HOME" exact />
          <MobileNavItem to="/games" icon={IconGames} label="GAMES" />
          <MobileNavItem to="/consoles" icon={IconDatabase} label="SYSTEMS" />
          <MobileNavItem to="/login" icon={IconLogin} label={user ? "ME" : "LOGIN"} />
      </div>
      
      <FooterStatus crtEnabled={crtEnabled} onToggleCrt={toggleCrt} />
    </div>
  );
};

const App = () => {
    return (
        <React.StrictMode>
             <Analytics />
             <SoundProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
             </SoundProvider>
        </React.StrictMode>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
