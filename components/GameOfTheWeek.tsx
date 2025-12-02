import { type FC } from 'react';
import { GameOfTheWeekData } from '../lib/types';
import Button from './ui/Button';
import Link from 'next/link';

interface GameOfTheWeekProps {
  game: GameOfTheWeekData | null;
}

const GameOfTheWeek: FC<GameOfTheWeekProps> = ({ game }) => {
  if (!game) {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center py-20 border-2 border-retro-grid bg-retro-dark/50">
            <h3 className="font-pixel text-retro-pink mb-4">NO GAME CARTRIDGE DETECTED</h3>
            <p className="font-mono text-gray-500 mb-8 text-center max-w-md">
                Could not retrieve Game of the Week from the database. Please check if the 'game_of_the_week' table exists and has data.
            </p>
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
                                <div className="w-full inline-block">
                                  <Button className="w-full">READ FULL REPORT</Button>
                                </div>
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