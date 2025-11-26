
import React, { useState, useEffect, Suspense, lazy, StrictMode } from 'react';
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
const LandingPage = lazy(() => import('./components/LandingPage'));
const NewsSection = lazy(() => import('./components/NewsSection'));
const ConsoleComparer = lazy(() => import('./components/ConsoleComparer'));
const GamesList = lazy(() => import('./components/GamesList'));
const GameDetails = lazy(() => import('./components/GameDetails'));
const Timeline = lazy(() => import('./components/Timeline'));
const AuthSection = lazy(() => import('./components/AuthSection'));
const ConsoleLibrary = lazy(() => import('./components/ConsoleLibrary'));
const ConsoleSpecs = lazy(() => import('./components/ConsoleSpecs'));
const ManufacturerDetail = lazy(() => import('./components/ManufacturerDetail'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));
const HtmlSitemap = lazy(() => import('./components/HtmlSitemap'));
const NotFound = lazy(() => import('./components/NotFound'));

// --- ICONS ---
const IconNews = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>;
const IconGame = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4"/><circle cx="17" cy="11" r="0.5"/><circle cx="15" cy="13" r="0.5"/></svg>;
const IconConsole = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="14" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/></svg>;
const IconCompare = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/></svg>;
const IconTimeline = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconUser = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

// --- NAVIGATION ---
const Navigation = () => {
  const location = useLocation();
  const { playHover, playClick } = useSound();
  
  const navItems = [
    { path: '/news', label: 'News', icon: IconNews },
    { path: '/games', label: 'Games', icon: IconGame },
    { path: '/consoles', label: 'Hardware', icon: IconConsole },
    { path: '/comparer', label: 'VS Mode', icon: IconCompare },
    { path: '/timeline', label: 'Timeline', icon: IconTimeline },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b-2 border-retro-grid bg-retro-dark/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group" onClick={playClick} onMouseEnter={playHover}>
              <div className="w-8 h-8 bg-retro-neon rounded-sm animate-pulse"></div>
              <span className="font-pixel text-xl text-white group-hover:text-retro-neon transition-colors">RETRO CIRCUIT</span>
            </Link>
            
            <div className="flex items-center gap-6">
               {navItems.map(item => (
                 <Link 
                   key={item.path} 
                   to={item.path} 
                   className={`font-mono text-sm uppercase tracking-wider flex items-center gap-2 hover:text-retro-neon transition-colors ${location.pathname.startsWith(item.path) ? 'text-retro-neon border-b-2 border-retro-neon' : 'text-gray-400'}`}
                   onClick={playClick}
                   onMouseEnter={playHover}
                 >
                   <item.icon className="w-4 h-4" />
                   {item.label}
                 </Link>
               ))}
            </div>

            <div className="flex items-center gap-4">
                <Link to="/login" onClick={playClick} onMouseEnter={playHover}>
                    <IconUser className="w-6 h-6 text-retro-blue hover:text-white" />
                </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Floating Bar */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 bg-retro-dark/90 backdrop-blur border border-retro-neon rounded-full shadow-[0_0_20px_rgba(0,255,157,0.3)] p-2">
        <div className="flex justify-around items-center">
            <Link to="/" className={`p-2 rounded-full ${location.pathname === '/' ? 'text-retro-neon bg-retro-neon/20' : 'text-gray-400'}`} onClick={playClick}>
                <div className="w-6 h-6 border-2 border-current flex items-center justify-center font-pixel text-[10px]">R</div>
            </Link>
            {navItems.map(item => (
                <Link 
                    key={item.path} 
                    to={item.path}
                    className={`p-2 rounded-full transition-all ${location.pathname.startsWith(item.path) ? 'text-retro-neon bg-retro-neon/20 scale-110' : 'text-gray-400'}`}
                    onClick={playClick}
                >
                    <item.icon className="w-6 h-6" />
                </Link>
            ))}
             <Link to="/login" className={`p-2 rounded-full ${location.pathname === '/login' ? 'text-retro-blue bg-retro-blue/20' : 'text-gray-400'}`} onClick={playClick}>
                <IconUser className="w-6 h-6" />
            </Link>
        </div>
      </nav>
    </>
  );
};

// --- FOOTER ---
const Footer = () => (
  <footer className="border-t border-retro-grid bg-black py-12 mt-12 pb-24 md:pb-12">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="font-pixel text-2xl text-retro-grid mb-6">GAME OVER</div>
      <div className="flex justify-center gap-8 mb-8 font-mono text-sm text-gray-500">
        <Link to="/about" className="hover:text-retro-neon">MISSION</Link>
        <Link to="/privacy" className="hover:text-retro-neon">PRIVACY</Link>
        <Link to="/terms" className="hover:text-retro-neon">TERMS</Link>
        <Link to="/sitemap.xml" className="hover:text-retro-neon">SITEMAP</Link>
      </div>
      <p className="font-mono text-xs text-gray-700">
        © 2024 THE RETRO CIRCUIT. EST. 198X.<br/>
        ALL TRADEMARKS PROPERTY OF THEIR RESPECTIVE OWNERS.
      </p>
    </div>
  </footer>
);

// --- MAIN APP CONTENT ---
const AppContent = () => {
  const [booted, setBooted] = useState(false);
  const [dbStatus, setDbStatus] = useState<boolean | null>(null);

  useEffect(() => {
    // Check local storage for skip boot
    const hasBooted = sessionStorage.getItem('retro_booted');
    if (hasBooted) setBooted(true);

    // Check DB
    checkDatabaseConnection().then(setDbStatus);
  }, []);

  const handleBootComplete = () => {
    setBooted(true);
    sessionStorage.setItem('retro_booted', 'true');
  };

  if (!booted) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        <SEOHead title="Home" description="The Retro Circuit - The ultimate retro gaming database." />
        <Navigation />
        
        <main className="flex-grow relative z-10">
          <div className="max-w-7xl mx-auto">
             <GlobalSearch />
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-red-900/80 text-white text-center p-2 font-mono text-xs fixed top-0 w-full z-[100]">
              ⚠ SUPABASE KEYS MISSING. RUNNING IN OFFLINE/DEMO MODE.
            </div>
          )}

          <ErrorBoundary>
            <Suspense fallback={<RetroLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/news" element={<NewsSection />} />
                <Route path="/games" element={<GamesList />} />
                <Route path="/games/:slug" element={<GameDetails />} />
                <Route path="/consoles" element={<ConsoleLibrary />} />
                <Route path="/consoles/:slug" element={<ConsoleSpecs />} />
                <Route path="/consoles/brand/:name" element={<ManufacturerDetail />} />
                <Route path="/comparer" element={<ConsoleComparer />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/login" element={<AuthSection />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/sitemap.xml" element={<HtmlSitemap />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        
        <Footer />
      </div>
      <Analytics />
    </BrowserRouter>
  );
};

// --- APP ROOT ---
const App = () => {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
