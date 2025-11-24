import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import NewsSection from './components/NewsSection';
import ConsoleComparer from './components/ConsoleComparer';
import RetroSage from './components/RetroSage';
import GameOfTheWeek from './components/GameOfTheWeek';
import Timeline from './components/Timeline';
import ReviewSection from './components/ReviewSection';
import AuthSection from './components/AuthSection';
import BootSequence from './components/BootSequence';
import ConsoleLibrary from './components/ConsoleLibrary';
import ConsoleSpecs from './components/ConsoleSpecs';
import { SoundProvider, useSound } from './components/SoundContext';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import { checkDatabaseConnection } from './services/geminiService';

// Icons
const IconNews = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>;
const IconDatabase = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const IconVS = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const IconOracle = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const IconGOTW = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconTimeline = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconReviews = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconLogin = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

// Navigation Component
const Navigation: React.FC = () => {
  const location = useLocation();
  const { playClick, playHover } = useSound();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/news', label: 'NEWS', icon: <IconNews /> },
    { path: '/gotw', label: 'GOTW', icon: <IconGOTW /> },
    { path: '/reviews', label: 'REVIEWS', icon: <IconReviews /> },
    { path: '/comparer', label: 'VS', icon: <IconVS /> },
    { path: '/timeline', label: 'TIME', icon: <IconTimeline /> },
    { path: '/sage', label: 'SAGE', icon: <IconOracle /> },
    { path: '/login', label: 'LOGIN', icon: <IconLogin /> },
  ];

  return (
    <nav className="border-b-4 border-retro-grid bg-retro-dark sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-pixel text-retro-neon text-lg md:text-xl tracking-tighter hover:text-retro-pink transition-colors drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] flex items-center"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            THE RETRO CIRCUIT
          </Link>
          <div className="hidden md:block font-mono text-xs text-retro-blue tracking-widest ml-4 mt-1">
            YOUR GATEWAY TO THE GOLDEN AGE
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-0 ml-auto">
            {navItems.map((item) => {
               const isActive = location.pathname.startsWith(item.path);
               return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 font-pixel text-xs transition-all border-b-4 relative overflow-hidden group flex items-center ${
                    isActive
                        ? 'text-black bg-retro-neon border-retro-neon'
                        : 'text-gray-400 border-transparent hover:text-retro-neon hover:bg-white/5'
                    }`}
                    onMouseEnter={playHover}
                    onClick={playClick}
                >
                    {item.label}
                </Link>
               );
            })}
          </div>

          <div className="flex items-center gap-4 md:hidden">
             {/* Mobile Menu Toggle */}
             <button 
                className="text-retro-neon font-pixel"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
                {mobileMenuOpen ? 'X' : 'MENU'}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-retro-grid bg-retro-dark/95 backdrop-blur absolute w-full z-50">
             <div className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => { playClick(); setMobileMenuOpen(false); }}
                        className={`px-4 py-3 font-mono text-sm border-l-4 flex items-center ${
                        location.pathname.startsWith(item.path)
                            ? 'text-retro-neon border-retro-neon bg-retro-neon/5'
                            : 'text-gray-400 border-transparent hover:bg-white/5'
                        }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
      )}
    </nav>
  );
};

// Main App Layout
const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [dbStatus, setDbStatus] = useState<'CHECKING' | 'ONLINE' | 'OFFLINE'>('CHECKING');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const { enabled: audioEnabled, toggleSound } = useSound();

  useEffect(() => {
    // Quick boot if previously visited in session
    if (sessionStorage.getItem('retro_boot_complete')) {
      setBooted(true);
    }

    // Check DB Connection Status
    checkDatabaseConnection().then(isOnline => {
        setDbStatus(isOnline ? 'ONLINE' : 'OFFLINE');
    });
  }, []);

  // Handle CRT Effects
  useEffect(() => {
      const scanlines = document.querySelector('.scanlines') as HTMLElement;
      const flicker = document.querySelector('.crt-flicker') as HTMLElement;
      if (scanlines) scanlines.style.display = crtEnabled ? 'block' : 'none';
      if (flicker) flicker.style.display = crtEnabled ? 'block' : 'none';
  }, [crtEnabled]);

  const handleBootComplete = () => {
    setBooted(true);
    sessionStorage.setItem('retro_boot_complete', 'true');
  };

  return (
    <div className="min-h-screen bg-retro-dark text-gray-200 font-sans selection:bg-retro-neon selection:text-black overflow-hidden flex flex-col">
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      
      <div className={`transition-opacity duration-1000 flex-1 flex flex-col ${booted ? 'opacity-100' : 'opacity-0'}`}>
        <SEOHead 
          title="Home" 
          description="The Retro Circuit - The ultimate database for vintage gaming hardware and software. News, Comparisons, and AI-powered history." 
        />
        
        <BrowserRouter>
            <Navigation />
            
            <main className="flex-1 relative overflow-y-auto scrollbar-thin scrollbar-thumb-retro-grid scrollbar-track-retro-dark">
                <div className="relative z-10 py-8 min-h-full">
                  <Routes>
                    <Route path="/" element={<NewsSection />} />
                    <Route path="/news" element={<NewsSection />} />
                    <Route path="/consoles" element={<ConsoleLibrary />} />
                    <Route path="/consoles/:slug" element={<ConsoleSpecs />} />
                    <Route path="/comparer" element={<ConsoleComparer />} />
                    <Route path="/sage" element={<RetroSage />} />
                    <Route path="/gotw" element={<GameOfTheWeek />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/reviews" element={<ReviewSection />} />
                    <Route path="/login" element={<AuthSection />} />
                  </Routes>
                </div>
            </main>

            <footer className="border-t-4 border-retro-grid bg-black py-4 z-10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:items-start text-center md:text-left">
                        <p className="font-pixel text-[10px] text-gray-500 mb-1">
                             © 199X RETRO CIRCUIT CORP.
                        </p>
                        <div className="font-mono text-[10px] space-x-2">
                             <span className={dbStatus === 'ONLINE' ? 'text-retro-neon' : 'text-retro-pink'}>
                                DB: {dbStatus}
                             </span>
                             <span className="text-gray-600">|</span>
                             <span className="text-gray-600">v1.0.4</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCrtEnabled(!crtEnabled)}
                            className={`font-pixel text-[10px] px-3 py-2 border ${
                                !crtEnabled ? 'border-retro-pink text-retro-pink' : 'border-retro-grid text-gray-500 hover:border-retro-blue hover:text-retro-blue'
                            }`}
                        >
                            {crtEnabled ? 'DISABLE CRT FX' : 'ENABLE CRT FX'}
                        </button>
                        <button 
                            onClick={toggleSound}
                            className={`font-pixel text-[10px] px-3 py-2 border ${
                                !audioEnabled ? 'border-retro-pink text-retro-pink' : 'border-retro-grid text-gray-500 hover:border-retro-blue hover:text-retro-blue'
                            }`}
                        >
                            {audioEnabled ? 'MUTE AUDIO' : 'UNMUTE AUDIO'}
                        </button>
                    </div>
                </div>
            </footer>
        </BrowserRouter>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <SoundProvider>
                <App />
            </SoundProvider>
        </ErrorBoundary>
    </React.StrictMode>
  );
}