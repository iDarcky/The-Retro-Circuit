'use client';

import { useEffect, useState, type FC } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchGameBySlug } from '../../../services/dataService';
import { GameOfTheWeekData } from '../../../types';
import Button from '../../../components/ui/Button';
import RetroLoader from '../../../components/ui/RetroLoader';
import CollectionToggle from '../../../components/ui/CollectionToggle';

const GameDetails: FC = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [game, setGame] = useState<GameOfTheWeekData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGame = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await fetchGameBySlug(slug);
      setGame(data);
      setLoading(false);
    };
    loadGame();
  }, [slug]);

  if (loading) return <RetroLoader />;

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="font-pixel text-retro-pink text-2xl mb-4">ERROR 404</h2>
        <p className="font-mono text-gray-400 mb-8">GAME CARTRIDGE NOT FOUND.</p>
        <Link href="/archive">
          <Button variant="secondary">RETURN TO ARCHIVE</Button>
        </Link>
      </div>
    );
  }

  const handleEbaySearch = () => {
      const query = encodeURIComponent(`${game.title} ${game.developer} game`);
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${query}`, '_blank');
  };

  const safeRating = Math.min(5, Math.max(0, Math.round(game.rating || 5)));

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8 border-b-4 border-retro-grid pb-6">
        <div className="flex justify-between items-start mb-4">
           <Link href="/archive" className="inline-block text-xs font-mono text-retro-blue hover:text-retro-neon transition-colors">
              &lt; BACK TO DATABASE
           </Link>
           {/* Actions */}
           <div className="flex gap-2">
             <div className="w-48">
                <CollectionToggle 
                    itemId={game.slug || game.id || ''} 
                    itemType="GAME" 
                    itemName={game.title} 
                    itemImage={game.image}
                />
             </div>
             <button 
                onClick={handleEbaySearch}
                className="bg-blue-600/20 border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 font-mono text-xs transition-colors flex items-center gap-2"
                title="Search on eBay"
             >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                SEARCH EBAY
             </button>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
                <div className="aspect-[3/4] bg-black border-2 border-retro-grid relative shadow-lg overflow-hidden group">
                    {game.image ? (
                        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-retro-grid font-pixel">NO COVER</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="font-pixel text-xs text-retro-neon">COVER ART</span>
                    </div>
                </div>
            </div>
            
            <div className="w-full md:w-2/3">
                <h1 className="text-4xl md:text-6xl font-pixel text-white mb-2 drop-shadow-[4px_4px_0_rgba(255,0,255,0.5)] leading-tight">
                    {game.title}
                </h1>
                <div className="flex flex-wrap gap-4 mb-8 font-mono text-sm text-retro-blue">
                    <span className="bg-retro-blue/10 px-2 py-1 border border-retro-blue">{game.developer}</span>
                    <span className="bg-retro-blue/10 px-2 py-1 border border-retro-blue">{game.year}</span>
                    <span className="bg-retro-blue/10 px-2 py-1 border border-retro-blue">{game.genre}</span>
                    {game.console_slug && (
                        <Link href={`/systems/${game.console_slug}`} className="bg-retro-neon/10 px-2 py-1 border border-retro-neon text-retro-neon hover:bg-retro-neon hover:text-black transition-colors">
                            PLATFORM &gt;
                        </Link>
                    )}
                </div>
                
                <div className="bg-retro-dark border border-retro-grid p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-retro-grid px-2 py-1 text-[10px] text-black font-bold font-mono">
                        ARCHIVE FILE
                    </div>
                    <p className="font-mono text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                        {game.content}
                    </p>
                </div>
                
                <div className="bg-retro-pink/10 border border-retro-pink p-6">
                    <h3 className="font-pixel text-retro-pink mb-2">WHY IT MATTERS</h3>
                    <p className="font-mono text-retro-pink/80 leading-relaxed">
                        {game.whyItMatters}
                    </p>
                </div>
                
                {/* Rating */}
                <div className="mt-8 flex items-center gap-4">
                    <span className="font-pixel text-sm text-gray-500">RATING:</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-6 h-6 ${star <= safeRating ? 'text-yellow-400' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;