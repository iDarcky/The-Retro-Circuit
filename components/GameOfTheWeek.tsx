import React, { useEffect, useState } from 'react';
import { fetchGameOfTheWeek } from '../services/geminiService';
import { GameOfTheWeekData } from '../types';
import Button from './Button';

const GameOfTheWeek: React.FC = () => {
  const [game, setGame] = useState<GameOfTheWeekData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadGame = async () => {
    setLoading(true);
    const data = await fetchGameOfTheWeek();
    setGame(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGame();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        <div className="animate-pulse border-4 border-retro-grid p-12 bg-retro-dark">
            <h2 className="text-2xl font-pixel text-retro-neon mb-4">LOADING CARTRIDGE...</h2>
            <div className="h-4 bg-retro-grid w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-retro-grid w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex justify-center">
            <Button onClick={loadGame}>LOAD FEATURED GAME</Button>
        </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
        <div className="border-4 border-retro-neon bg-retro-dark relative shadow-[0_0_30px_rgba(0,255,157,0.2)]">
            <div className="absolute top-0 left-0 bg-retro-neon text-retro-dark font-pixel text-xs px-3 py-1">
                GAME OF THE WEEK
            </div>
            
            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-retro-grid pb-6 mb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-pixel text-retro-blue mb-2 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                            {game.title}
                        </h1>
                        <div className="flex gap-4 font-mono text-retro-pink">
                            <span>{game.developer}</span>
                            <span>//</span>
                            <span>{game.year}</span>
                            <span>//</span>
                            <span>{game.genre}</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 font-pixel text-4xl text-retro-grid opacity-20 select-none">
                        INSERT COIN
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 font-mono text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                        {game.content}
                    </div>
                    
                    <div className="bg-retro-grid/20 border border-retro-grid p-6 h-fit">
                        <h3 className="font-pixel text-sm text-retro-neon mb-4">WHY IT MATTERS</h3>
                        <p className="font-mono text-sm text-retro-blue leading-relaxed">
                            {game.whyItMatters}
                        </p>
                        <div className="mt-6 pt-6 border-t border-retro-grid text-center">
                            <span className="font-pixel text-xs text-retro-pink block mb-2">RATING</span>
                            <div className="text-yellow-400 text-xl tracking-widest">★★★★★</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-retro-grid p-2 text-center">
                <Button onClick={loadGame} variant="secondary" className="text-xs py-1">
                    LOAD ANOTHER CLASSIC
                </Button>
            </div>
        </div>
    </div>
  );
};

export default GameOfTheWeek;
