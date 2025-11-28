'use client';

import { useEffect, useState, type FC } from 'react';
import { fetchGameOfTheWeek } from '@/services/geminiService';
import { GameOfTheWeekData } from '@/types';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const GameOfTheWeek: FC = () => {
  const [game, setGame] = useState<GameOfTheWeekData | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const loadGame = async () => {
    setLoading(true);
    const data = await fetchGameOfTheWeek();
    setGame(data);
    setLoading(false);
    setAttempted(true);
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
            <div className="h-4 bg-retro-grid w-1/2 mx-auto mb-6"></div>
            <div className="w-32 h-32 bg-retro-grid/20 mx-auto border border-retro-grid animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center py-20 border-2 border-retro-grid bg-retro-dark/50">
            <h3 className="font-pixel text-retro-pink mb-4">NO GAME CARTRIDGE DETECTED</h3>
            <p className="font-mono text-gray-500 mb-8 text-center max-w-md">
                {attempted 
                    ? "Could not retrieve Game of the Week from the database. Please check if the 'game_of_the_week' table exists and has data." 
                    : "Initialize system to load game."}
            </p>
            <Button onClick={loadGame} variant="secondary">RETRY LOAD</Button>
        </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
        <div className="border-4 border-retro-neon bg-retro-dark relative shadow-[0_0_30px_rgba(0,255,157,0.2)]">
            <div className="absolute top-0 left-0 bg-retro-neon text-retro-dark font-pixel text-xs px-3 py-1 z-10">
                GAME OF THE WEEK
            </div>
            
            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-retro-grid pb-6 mb-6">
                    <div>
                        <Link href={`/archive/${game.slug || game.id}`} className="block hover:opacity-80 transition-opacity">
                            <h1 className="text-4xl md:text-5xl font-pixel text-retro-blue mb-2 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] hover:text-retro-neon transition-colors">
                                {game.title}
                            </h1>
                        </Link>
                        <div className="flex gap-4 font-mono text-retro-pink">
                            <span>{game.developer}</span>
                            <span>//</span>
                            <span>{game.year}</span>
                            <span>//</span>
                            <span>{game.genre}</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 font-pixel text-4xl text-retro-grid opacity-20 select-none hidden md:block">
                        INSERT COIN
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 font-mono text-gray-300 leading-relaxed text-lg whitespace-pre-line line-clamp-6">
                        {game.content}
                    </div>
                    
                    <div className="bg-retro-grid/20 border border-retro-grid p-6 h-fit">
                        <h3 className="font-pixel text-sm text-retro-neon mb-4">WHY IT MATTERS</h3>
                        <p className="font-mono text-retro-blue text-sm leading-relaxed line-clamp-4">
                            {game.whyItMatters}
                        </p>
                        <div className="mt-6 pt-6 border-t border-retro-grid text-center">
                             <Link href={`/archive/${game.slug || game.id}`}>
                                <Button className="w-full">READ FULL REPORT</Button>
                             </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GameOfTheWeek;