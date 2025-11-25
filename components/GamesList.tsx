import React, { useEffect, useState } from 'react';
import { fetchAllGames } from '../services/geminiService';
import { GameOfTheWeekData } from '../types';
import Button from './Button';
import RetroLoader from './RetroLoader';

const GamesList: React.FC = () => {
  const [games, setGames] = useState<GameOfTheWeekData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      const data = await fetchAllGames();
      setGames(data);
      setLoading(false);
    };
    loadGames();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-pixel text-retro-neon mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
          GAME DATABASE
        </h2>
        <p className="font-mono text-gray-400">Archived reviews and analysis.</p>
      </div>

      {loading ? (
        <RetroLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, idx) => (
            <div key={idx} className="group border-4 border-retro-grid bg-retro-dark relative overflow-hidden hover:border-retro-pink transition-all duration-300">
              
              {/* Header / Title */}
              <div className="bg-retro-grid/30 p-4 border-b-2 border-retro-grid group-hover:bg-retro-pink/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[10px] text-retro-dark bg-retro-neon px-2 py-0.5 font-bold">
                        {game.year}
                    </span>
                    <span className="font-mono text-[10px] text-retro-blue border border-retro-blue px-2 py-0.5">
                        {game.genre.toUpperCase()}
                    </span>
                </div>
                <h3 className="font-pixel text-lg text-white leading-tight group-hover:text-retro-pink transition-colors">
                    {game.title}
                </h3>
                <p className="font-mono text-xs text-gray-500 mt-1">{game.developer.toUpperCase()}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                 {/* Visual Placeholder if no image */}
                 <div className="h-32 mb-4 bg-black/50 border border-retro-grid/50 flex items-center justify-center relative overflow-hidden">
                     {game.image ? (
                        <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     ) : (
                        <div className="text-center opacity-30">
                            <div className="font-pixel text-2xl text-retro-grid">INSERT</div>
                            <div className="font-pixel text-2xl text-retro-grid">GAME</div>
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-retro-dark to-transparent"></div>
                 </div>

                 <p className="font-mono text-gray-400 text-sm line-clamp-4 leading-relaxed">
                     {game.content}
                 </p>

                 <div className="mt-4 pt-4 border-t border-retro-grid/50">
                     <span className="font-pixel text-[10px] text-retro-blue block mb-2">WHY IT MATTERS</span>
                     <p className="font-mono text-xs text-gray-300 leading-snug">
                         {game.whyItMatters}
                     </p>
                 </div>
              </div>

              {/* Decorative corners */}
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-retro-grid group-hover:border-retro-pink transition-colors"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesList;
