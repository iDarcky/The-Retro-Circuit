
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import NewsSection from './components/NewsSection';
import ConsoleComparer from './components/ConsoleComparer';
import GamesList from './components/GamesList';
import GameDetails from './components/GameDetails';
import Timeline from './components/Timeline';
import AuthSection from './components/AuthSection';
import BootSequence from './components/BootSequence';
import ConsoleLibrary from './components/ConsoleLibrary';
import ConsoleSpecs from './components/ConsoleSpecs';
import AdminPortal from './components/AdminPortal';
import { SoundProvider, useSound } from './components/SoundContext';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import { checkDatabaseConnection, retroAuth } from './services/geminiService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import GlobalSearch from './components/GlobalSearch';

// --- ICONS ---
const IconNews = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>;
const IconDatabase = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const IconVS = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const IconGames = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4m-2-2v4"></path><circle cx="17" cy="11" r="0.5" fill="currentColor"></circle><circle cx="15" cy="13" r="0.5" fill="currentColor"></circle></svg>;
const IconTimeline = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconLogin = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>;
const IconHome = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconLock = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

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
        <Icon />
      </div>
      <span className="tracking-widest text-sm">{label}</span>
    </Link>
  );
};

// --- LAYOUT COMPONENTS ---
const FooterStatus = () => {
    const [dbStatus, setDbStatus] = useState<'CHECKING' | 'ONLINE' | 'OFFLINE'>('CHECKING');
    const { enabled, toggleSound } = useSound();
    const [crtEnabled, setCrtEnabled] = useState(true);

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

    const toggleCrt = () => {
        const next = !crtEnabled;
        setCrtEnabled(next);
        const scanlines = document.querySelector('.scanlines');
        const flicker = document.querySelector('.crt-flicker');
        if (scanlines) scanlines.classList.toggle('hidden', !next);
        if (flicker) flicker.classList.toggle('hidden', !next);
    };

    return (
        <footer className={`fixed bottom-0 left-0 right-0 ${!isSupabaseConfigured ? 'h-auto pb-1' : 'h-8'} bg-retro-dark border-t border-retro-grid flex flex-col justify-end z-50 font-mono`}>
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
                </div>
                
                <div className="flex items-center space-x-4">
                    <button onClick={toggleCrt} className="text-retro-blue hover:text-white border border-retro-blue px-2 transition-colors">
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();

  // FIX: Hooks must be at the top level, before any conditional returns
  useEffect(() => {
    // Check URL for recovery link from Supabase
    if (location.hash.includes('type=recovery')) {
        sessionStorage.setItem('retro_recovery_pending', 'true');
    }
  }, [location]);

  useEffect(() => {
      // Close mobile search when route changes
      setMobileSearchOpen(false);
  }, [location]);

  useEffect(() => {
      if (!isSupabaseConfigured) return;

      const checkAdmin = async () => {
          const isA = await retroAuth.isAdmin();
          setIsAdmin(isA);
      };
      
      checkAdmin();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
          checkAdmin();
      });

      return () => subscription.unsubscribe();
  }, []);

  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-0 md:pt-0 pb-12">
      <SEOHead title="Gateway to the Golden Age" description="Comparing retro consoles and games." />

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-retro-dark border-b border-retro-grid z-40 flex items-center justify-between px-4">
        <div className="font-pixel text-retro-neon text-sm">THE RETRO CIRCUIT</div>
        <div className="flex gap-4 items-center">
            <button 
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)} 
                className={`p-2 transition-colors ${mobileSearchOpen ? 'text-retro-neon' : 'text-gray-400'}`}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            {isAdmin && <Link to="/admin" className="p-2 text-retro-pink"><IconLock /></Link>}
            <Link to="/login"><IconLogin /></Link>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-retro-dark border-b border-retro-grid shadow-lg animate-[slideDown_0.2s_ease-out]">
            <GlobalSearch />
        </div>
      )}

      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 bg-retro-dark border-r border-retro-grid fixed h-full z-40">
        <div className="p-6 border-b border-retro-grid text-center">
            <h1 className="font-pixel text-retro-neon text-xl leading-relaxed drop-shadow-[2px_2px_0_rgba(255,0,255,0.5)]">
                THE RETRO<br/>CIRCUIT
            </h1>
        </div>
        
        {/* GLOBAL SEARCH */}
        <GlobalSearch />
        
        <nav className="flex-1 overflow-y-auto py-4">
            <SidebarItem to="/" icon={IconHome} label="DASHBOARD" exact />
            <SidebarItem to="/news" icon={IconNews} label="NEWS FEED" />
            <SidebarItem to="/games" icon={IconGames} label="GAMES" />
            <SidebarItem to="/consoles" icon={IconDatabase} label="HARDWARE DB" />
            <SidebarItem to="/comparer" icon={IconVS} label="VS. MODE" />
            <SidebarItem to="/timeline" icon={IconTimeline} label="TIMELINE" />
        </nav>

        <div className="p-4 border-t border-retro-grid">
            {isAdmin && <SidebarItem to="/admin" icon={IconLock} label="ROOT ACCESS" />}
            <SidebarItem to="/login" icon={IconLogin} label="LOGIN / PROFILE" />
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-8 left-0 right-0 bg-retro-dark border-t border-retro-grid flex justify-around p-2 z-40">
        <Link to="/" className="p-2 text-gray-400 hover:text-retro-neon"><IconHome /></Link>
        <Link to="/news" className="p-2 text-gray-400 hover:text-retro-neon"><IconNews /></Link>
        <Link to="/games" className="p-2 text-gray-400 hover:text-retro-neon"><IconGames /></Link>
        <Link to="/consoles" className="p-2 text-gray-400 hover:text-retro-neon"><IconDatabase /></Link>
        <Link to="/comparer" className="p-2 text-gray-400 hover:text-retro-neon"><IconVS /></Link>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/news" element={<NewsSection />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/:slug" element={<GameDetails />} />
          <Route path="/consoles" element={<ConsoleLibrary />} />
          <Route path="/consoles/:slug" element={<ConsoleSpecs />} />
          <Route path="/comparer" element={<ConsoleComparer />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/login" element={<AuthSection />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </main>

      <FooterStatus />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
        <SoundProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </SoundProvider>
    </ErrorBoundary>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
