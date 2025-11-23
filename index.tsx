import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import NewsSection from './components/NewsSection';
import ConsoleComparer from './components/ConsoleComparer';
import RetroSage from './components/RetroSage';
import GameOfTheWeek from './components/GameOfTheWeek';
import Timeline from './components/Timeline';
import ReviewSection from './components/ReviewSection';

const App = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'gotw' | 'compare' | 'timeline' | 'reviews' | 'sage'>('news');
  const [cleanMode, setCleanMode] = useState(false);

  // Effect to toggle clean mode classes on the body
  useEffect(() => {
    const scanlineDiv = document.querySelector('.scanlines');
    const flickerDiv = document.querySelector('.crt-flicker');
    const body = document.body;

    if (cleanMode) {
      if (scanlineDiv) scanlineDiv.classList.add('hidden');
      if (flickerDiv) flickerDiv.classList.add('hidden');
      body.classList.add('font-sans'); // Fallback to cleaner font if needed, or just remove pixel noise
      body.style.textShadow = 'none';
    } else {
      if (scanlineDiv) scanlineDiv.classList.remove('hidden');
      if (flickerDiv) flickerDiv.classList.remove('hidden');
      body.classList.remove('font-sans');
      body.style.textShadow = '';
    }
  }, [cleanMode]);

  const navItems = [
    { id: 'news', label: 'NEWS', icon: '📰', color: 'retro-neon' },
    { id: 'gotw', label: 'GOTW', icon: '⭐', color: 'yellow-400' },
    { id: 'reviews', label: 'REVIEWS', icon: '📝', color: 'retro-blue' },
    { id: 'compare', label: 'VS', icon: '⚔️', color: 'retro-blue' },
    { id: 'timeline', label: 'TIME', icon: '⏳', color: 'retro-pink' },
    { id: 'sage', label: 'SAGE', icon: '🔮', color: 'retro-pink' },
  ];

  return (
    <div className={`min-h-screen ${cleanMode ? 'bg-gray-900' : ''} pb-24 md:pb-20 transition-colors duration-300`}>
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
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-6 py-4 font-pixel text-xs transition-all border-r border-retro-grid whitespace-nowrap hover:bg-retro-grid/30 ${
                  activeTab === item.id
                    ? `bg-${item.color} text-retro-dark shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]` 
                    : `text-${item.color}`
                }`}
                style={{
                    backgroundColor: activeTab === item.id ? (item.color === 'yellow-400' ? '#facc15' : undefined) : undefined,
                    color: activeTab !== item.id && item.color === 'yellow-400' ? '#facc15' : undefined
                }}
              >
                {item.label}
              </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-4 md:pt-0">
        {activeTab === 'news' && <NewsSection />}
        {activeTab === 'gotw' && <GameOfTheWeek />}
        {activeTab === 'timeline' && <Timeline />}
        {activeTab === 'reviews' && <ReviewSection />}
        {activeTab === 'compare' && <ConsoleComparer />}
        {activeTab === 'sage' && <RetroSage />}
      </main>

      {/* Mobile Navigation (Bottom Sticky) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-retro-dark border-t border-retro-grid shadow-[0_-5px_10px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                 activeTab === item.id ? `bg-retro-grid/50` : ''
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`text-[8px] font-pixel ${
                activeTab === item.id ? `text-${item.color}` : 'text-gray-500'
              }`}
              style={{ color: activeTab === item.id && item.color === 'yellow-400' ? '#facc15' : undefined }}
              >
                {item.label}
              </span>
            </button>
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

const root = createRoot(document.getElementById('root')!);
root.render(<App />);