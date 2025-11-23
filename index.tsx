import React, { useState, useEffect, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import RetroLoader from './components/RetroLoader';
import SEOHead from './components/SEOHead';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Load components for performance optimization (Code Splitting)
const NewsSection = React.lazy(() => import('./components/NewsSection'));
const ConsoleComparer = React.lazy(() => import('./components/ConsoleComparer'));
const RetroSage = React.lazy(() => import('./components/RetroSage'));
const GameOfTheWeek = React.lazy(() => import('./components/GameOfTheWeek'));
const Timeline = React.lazy(() => import('./components/Timeline'));
const ReviewSection = React.lazy(() => import('./components/ReviewSection'));

const navItems = [
  { id: 'news', path: '/news', label: 'NEWS', icon: '📰', color: 'retro-neon', desc: 'Latest updates from the 8-bit and 16-bit era.' },
  { id: 'gotw', path: '/game-of-the-week', label: 'GOTW', icon: '⭐', color: 'yellow-400', desc: 'Our curated pick for the Game of the Week.' },
  { id: 'reviews', path: '/reviews', label: 'REVIEWS', icon: '📝', color: 'retro-blue', desc: 'User-submitted reviews and ratings.' },
  { id: 'compare', path: '/compare', label: 'VS', icon: '⚔️', color: 'retro-blue', desc: 'Compare console specs: Genesis vs SNES and more.' },
  { id: 'timeline', path: '/timeline', label: 'TIME', icon: '⏳', color: 'retro-pink', desc: 'Interactive history of video game consoles.' },
  { id: 'sage', path: '/sage', label: 'SAGE', icon: '🔮', color: 'retro-pink', desc: 'Ask the AI Retro Sage about gaming history.' },
];

const AppContent = () => {
  const [cleanMode, setCleanMode] = useState(false);
  const location = useLocation();

  // Determine current metadata based on route
  const currentNav = navItems.find(item => item.path === location.pathname) || navItems[0];

  // SCROLL RESTORATION: Scroll to top on route change to simulate "New Page" behavior
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Effect to toggle clean mode classes on the body
  useEffect(() => {
    const scanlineDiv = document.querySelector('.scanlines');
    const flickerDiv = document.querySelector('.crt-flicker');
    const body = document.body;

    if (cleanMode) {
      if (scanlineDiv) scanlineDiv.classList.add('hidden');
      if (flickerDiv) flickerDiv.classList.add('hidden');
      body.classList.add('font-sans'); 
      body.style.textShadow = 'none';
    } else {
      if (scanlineDiv) scanlineDiv.classList.remove('hidden');
      if (flickerDiv) flickerDiv.classList.remove('hidden');
      body.classList.remove('font-sans');
      body.style.textShadow = '';
    }
  }, [cleanMode]);

  return (
    <div className={`min-h-screen ${cleanMode ? 'bg-gray-900' : ''} pb-24 md:pb-20 transition-colors duration-300`}>
      {/* Dynamic SEO Tags */}
      <SEOHead 
        title={currentNav.label} 
        description={currentNav.desc} 
      />

      {/* Header */}
      <header className={`pt-8 pb-6 px-4 text-center border-b-4 border-retro-grid bg-retro-dark z-40 relative ${cleanMode ? 'border-gray-700' : ''}`}>
        <h1 className={`text-3xl md:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-retro-pink via-retro-neon to-retro-blue mb-4 ${cleanMode ? 'drop-shadow-none' : 'drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)]'}`}>
          THE RETRO CIRCUIT
        </h1>
        <p className="font-mono text-retro-blue text-xs md:text-base tracking-widest uppercase">
          Your Gateway to the Golden Age
        </p>
      </header>

      {/* Desktop Navigation (Top) */}
      <nav className="hidden md:block sticky top-0 z-30 bg-retro-dark/95 backdrop-blur border-b border-retro-grid mb-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          {navItems.map((item) => (
             <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `px-6 py-4 font-pixel text-xs transition-all border-r border-retro-grid whitespace-nowrap hover:bg-retro-grid/30 ${
                  isActive
                    ? `bg-${item.color} text-retro-dark shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]` 
                    : `text-${item.color}`
                }`}
                style={({ isActive }) => ({
                    backgroundColor: isActive ? (item.color === 'yellow-400' ? '#facc15' : undefined) : undefined,
                    color: !isActive && item.color === 'yellow-400' ? '#facc15' : undefined
                })}
              >
                {item.label}
              </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-4 md:pt-0">
        <ErrorBoundary>
          <Suspense fallback={<RetroLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/news" replace />} />
              <Route path="/news" element={<NewsSection />} />
              <Route path="/game-of-the-week" element={<GameOfTheWeek />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/reviews" element={<ReviewSection />} />
              <Route path="/compare" element={<ConsoleComparer />} />
              <Route path="/sage" element={<RetroSage />} />
              <Route path="*" element={<Navigate to="/news" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Mobile Navigation (Bottom Sticky) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-retro-dark border-t border-retro-grid shadow-[0_-5px_10px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center justify-center space-y-1 transition-colors ${
                 isActive ? `bg-retro-grid/50` : ''
              }`}
            >
              {({ isActive }) => (
                <>
                  <span className="text-lg">{item.icon}</span>
                  <span className={`text-[8px] font-pixel ${
                    isActive ? `text-${item.color}` : 'text-gray-500'
                  }`}
                  style={{ color: isActive && item.color === 'yellow-400' ? '#facc15' : undefined }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer & Toggles */}
      <footer className="w-full bg-retro-dark border-t border-retro-grid py-6 px-4 text-center mt-12 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] text-gray-500 uppercase">
          
          <div className="flex items-center gap-4">
             <span>© 199X-202X The Retro Circuit</span>
             <span className={`animate-pulse text-retro-neon ${cleanMode ? 'hidden' : ''}`}>SYSTEM ONLINE</span>
          </div>

          <button 
            onClick={() => setCleanMode(!cleanMode)}
            className={`px-3 py-1 border ${cleanMode ? 'bg-white text-black border-white' : 'border-retro-grid text-gray-500'} transition-all hover:bg-retro-grid hover:text-white`}
          >
            {cleanMode ? '⦿ CLEAN MODE: ON' : '◎ CLEAN MODE: OFF'}
          </button>

        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);