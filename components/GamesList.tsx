
import { useEffect, useState, useCallback, type FC } from 'react';
import { fetchGamesPaginated } from '../services/geminiService';
import { GameOfTheWeekData } from '../types';
import Button from './Button';
import RetroLoader from './RetroLoader';
import { Link } from 'react-router-dom';

const GamesList: FC = () => {
  const [games, setGames] = useState<GameOfTheWeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // 12 is divisible by 1, 2, and 3 columns, ensuring the grid always looks even.
  const ITEMS_PER_PAGE = 12;

  const loadGames = useCallback(async (pageNum: number) => {
    setLoading(true);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const { data, count } = await fetchGamesPaginated(pageNum, ITEMS_PER_PAGE);
    
    setGames(data);
    setTotalCount(count);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGames(page);
  }, [page, loadGames]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
      ) : games.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-700 font-mono text-gray-500">
           NO GAMES FOUND IN DATABASE.
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {games.map((game, idx) => (
                <Link 
                to={`/archive/${game.slug || game.id}`} 
                key={`${game.id}-${idx}`} 
                className="group border-4 border-retro-grid bg-retro-dark relative overflow-hidden hover:border-retro-pink transition-all duration-300 block"
                >
                
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
                        <p className="font-mono text-xs text-gray-300 leading-snug line-clamp-2">
                            {game.whyItMatters}
                        </p>
                    </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-retro-grid group-hover:border-retro-pink transition-colors"></div>
                </Link>
            ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-8 border-t border-retro-grid/30">
                    <Button 
                        variant="secondary" 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        &lt; PREV
                    </Button>
                    
                    <div className="font-pixel text-xs text-retro-neon bg-retro-grid/20 px-4 py-2 rounded">
                        PAGE {page} OF {totalPages}
                    </div>

                    <Button 
                        variant="secondary" 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                    >
                        NEXT &gt;
                    </Button>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default GamesList;
