
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGameBySlug } from '../services/geminiService';
import { GameOfTheWeekData } from '../types';
import Button from './Button';
import RetroLoader from './RetroLoader';
import CollectionToggle from './CollectionToggle';
import SEOHead from './SEOHead';

const GameDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
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
        <SEOHead title="Game Not Found" description="The requested game cartridge could not be located in our archives." />
        <h2 className="font-pixel text-retro-pink text-2xl mb-4">ERROR 404</h2>
        <p className="font-mono text-gray-400 mb-8">GAME CARTRIDGE NOT FOUND.</p>
        <Link to="/games">
          <Button variant="secondary">RETURN TO ARCHIVE</Button>
        </Link>
      </div>
    );
  }

  const handleEbaySearch = () => {
      const query = encodeURIComponent(`${game.title} ${game.developer} game`);
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${query}`, '_blank');
  };

  // Google Schema for Video Game
  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.content.substring(0, 160) + "...",
    "genre": [game.genre],
    "gamePlatform": game.console_slug ? `https://theretrocircuit.com/consoles/${game.console_slug}` : "Retro Console",
    "publisher": game.developer,
    "author": {
      "@type": "Organization",
      "name": game.developer
    },
    "datePublished": game.year,
    "image": game.image,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": game.rating || 5,
      "bestRating": "5",
      "ratingCount": "1" // Static for now, would be dynamic in a real review system
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <SEOHead 
        title={`${game.title} (${game.year}) Review`} 
        description={`Read our retrospective review of ${game.title} by ${game.developer}. ${game.whyItMatters}`}
        image={game.image}
        structuredData={gameSchema}
      />
      
      {/* Header */}
      <div className="mb-8 border-b-4 border-retro-grid pb-6">
        <div className="flex justify-between items-start mb-4">
           <Link to="/games" className="inline-block text-xs font-mono text-retro-blue hover:text-retro-neon transition-colors">
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
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                FIND ON EBAY
             </button>
           </div>
        </div>
        
        <div>
           <h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] leading-tight mb-2">
             {game.title}
           </h1>
           <div className="flex flex-wrap gap-4 font-mono text-lg text-retro-pink items-center">
              <span>{game.developer}</span>
              <span className="text-gray-600">//</span>
              <span>{game.year}</span>
              {game.console_slug && (
                  <>
                      <span className="text-gray-600">//</span>
                      <Link to={`/consoles/${game.console_slug}`} className="text-retro-neon hover:underline bg-retro-neon/10 px-2 border border-retro-neon/50 text-sm">
                          PLATFORM: {game.console_slug.replace(/-/g, ' ').toUpperCase()}
                      </Link>
                  </>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Left Sidebar: Metadata */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-retro-dark border-2 border-retro-grid p-6 relative group overflow-hidden">
                <div className="aspect-[3/4] bg-black/50 border border-retro-grid mb-6 flex items-center justify-center relative">
                    {game.image ? (
                        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center opacity-30">
                            <div className="font-pixel text-xl text-retro-grid">NO ART</div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-retro-dark to-transparent opacity-50"></div>
                </div>

                <div className="space-y-4 font-mono text-sm">
                    <div>
                        <span className="text-gray-500 block text-[10px] mb-1">GENRE</span>
                        <span className="text-retro-blue border border-retro-blue px-2 py-0.5 inline-block">{game.genre.toUpperCase()}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-[10px] mb-1">DEVELOPER</span>
                        <span className="text-white">{game.developer}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-[10px] mb-1">RELEASE YEAR</span>
                        <span className="text-white">{game.year}</span>
                    </div>
                    {game.rating && (
                        <div>
                            <span className="text-gray-500 block text-[10px] mb-1">RATING</span>
                            <div className="text-yellow-400 text-lg tracking-widest">
                                {'★'.repeat(game.rating)}{'☆'.repeat(5 - game.rating)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="lg:col-span-3 space-y-8">
            <div className="bg-retro-grid/10 border-l-4 border-retro-neon p-6">
                <h3 className="font-pixel text-lg text-retro-neon mb-4">MISSION REPORT</h3>
                <p className="font-mono text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                    {game.content}
                </p>
            </div>

            <div className="bg-retro-dark border border-retro-grid p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <svg className="w-24 h-24 text-retro-blue" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h3 className="font-pixel text-sm text-retro-blue mb-4 border-b border-retro-grid/50 pb-2">WHY IT MATTERS</h3>
                <p className="font-mono text-gray-400 leading-relaxed italic">
                    "{game.whyItMatters}"
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GameDetails;
