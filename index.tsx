import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import NewsSection from './components/NewsSection';
import ConsoleComparer from './components/ConsoleComparer';
import RetroSage from './components/RetroSage';
import GameOfTheWeek from './components/GameOfTheWeek';
import Timeline from './components/Timeline';
import ReviewSection from './components/ReviewSection';

const App = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'gotw' | 'compare' | 'timeline' | 'reviews' | 'sage'>('news');

  const navItems = [
    { id: 'news', label: 'NEWS FEED', color: 'retro-neon' },
    { id: 'gotw', label: 'FEATURED', color: 'yellow-400' },
    { id: 'timeline', label: 'TIMELINE', color: 'retro-pink' },
    { id: 'reviews', label: 'REVIEWS', color: 'retro-blue' },
    { id: 'compare', label: 'VS MODE', color: 'retro-blue' },
    { id: 'sage', label: 'SAGE', color: 'retro-pink' },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="pt-10 pb-6 px-4 text-center border-b-4 border-retro-grid bg-retro-dark z-40 relative">
        <h1 className="text-4xl md:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-retro-pink via-retro-neon to-retro-blue drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] mb-4">
          THE RETRO CIRCUIT
        </h1>
        <p className="font-mono text-retro-blue text-sm md:text-base tracking-widest uppercase">
          Your Gateway to the Golden Age
        </p>
      </header>

      <nav className="sticky top-0 z-30 bg-retro-dark/95 backdrop-blur border-b border-retro-grid mb-8">
        <div className="max-w-6xl mx-auto flex justify-start md:justify-center overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex-none px-6 py-4 font-pixel text-[10px] md:text-xs transition-all border-r border-retro-grid whitespace-nowrap ${
                  activeTab === item.id
                    ? `bg-${item.color} text-retro-dark shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]` 
                    : `text-${item.color} hover:bg-retro-grid/30`
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

      <main className="container mx-auto px-4">
        {activeTab === 'news' && <NewsSection />}
        {activeTab === 'gotw' && <GameOfTheWeek />}
        {activeTab === 'timeline' && <Timeline />}
        {activeTab === 'reviews' && <ReviewSection />}
        {activeTab === 'compare' && <ConsoleComparer />}
        {activeTab === 'sage' && <RetroSage />}
      </main>

      <footer className="fixed bottom-0 w-full bg-retro-dark border-t border-retro-grid py-2 px-4 text-center z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto font-mono text-[10px] text-gray-500 uppercase">
          <span>© 199X-202X The Retro Circuit</span>
          <span className="animate-pulse text-retro-neon">SYSTEM ONLINE</span>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);