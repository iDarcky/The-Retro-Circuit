import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import NewsSection from './components/NewsSection';
import ConsoleComparer from './components/ConsoleComparer';
import RetroSage from './components/RetroSage';

const App = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'compare' | 'sage'>('news');

  return (
    <div className="min-h-screen pb-20">
      <header className="pt-10 pb-6 px-4 text-center border-b-4 border-retro-grid bg-retro-dark z-40 relative">
        <h1 className="text-4xl md:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-retro-pink via-retro-neon to-retro-blue drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] mb-4">
          RETRO CIRCUIT
        </h1>
        <p className="font-mono text-retro-blue text-sm md:text-base tracking-widest uppercase">
          Your Gateway to the Golden Age
        </p>
      </header>

      <nav className="sticky top-0 z-30 bg-retro-dark/95 backdrop-blur border-b border-retro-grid mb-8">
        <div className="max-w-6xl mx-auto flex justify-center md:justify-start overflow-x-auto">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 md:flex-none px-8 py-4 font-pixel text-xs md:text-sm transition-all border-r border-retro-grid ${
              activeTab === 'news' 
                ? 'bg-retro-neon text-retro-dark shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]' 
                : 'text-retro-neon hover:bg-retro-grid/30'
            }`}
          >
            NEWS FEED
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-1 md:flex-none px-8 py-4 font-pixel text-xs md:text-sm transition-all border-r border-retro-grid ${
              activeTab === 'compare' 
                ? 'bg-retro-blue text-retro-dark shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]' 
                : 'text-retro-blue hover:bg-retro-grid/30'
            }`}
          >
            VS. MODE
          </button>
          <button
            onClick={() => setActiveTab('sage')}
            className={`flex-1 md:flex-none px-8 py-4 font-pixel text-xs md:text-sm transition-all border-r border-retro-grid ${
              activeTab === 'sage' 
                ? 'bg-retro-pink text-retro-dark shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]' 
                : 'text-retro-pink hover:bg-retro-grid/30'
            }`}
          >
            RETRO SAGE
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4">
        {activeTab === 'news' && <NewsSection />}
        {activeTab === 'compare' && <ConsoleComparer />}
        {activeTab === 'sage' && <RetroSage />}
      </main>

      <footer className="fixed bottom-0 w-full bg-retro-dark border-t border-retro-grid py-2 px-4 text-center z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto font-mono text-[10px] text-gray-500 uppercase">
          <span>© 199X-202X Retro Circuit</span>
          <span className="animate-pulse text-retro-neon">SYSTEM ONLINE</span>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);