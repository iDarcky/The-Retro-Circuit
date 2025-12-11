export const dynamic = 'force-dynamic';

import Link from 'next/link';
import GameOfTheWeek from '../components/GameOfTheWeek';
import { fetchRetroNews, fetchGameOfTheWeek } from '../lib/api';
import { NewsItem } from '../lib/types';
import { IconVS, IconDatabase, IconNews } from '../components/ui/Icons';

// -- Mini Signal Feed Component (Presentation Only) --
const DashboardSignalFeed = ({ news }: { news: NewsItem[] }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-4 border-b border-retro-grid pb-2">
          <h3 className="font-pixel text-retro-neon text-sm flex items-center gap-2">
            <IconNews className="w-4 h-4" />
            LATEST SIGNALS
          </h3>
          <Link href="/signals" className="text-[10px] font-mono text-retro-blue border border-retro-blue px-2 py-1 hover:bg-retro-blue hover:text-black transition-colors">
              FULL FEED &gt;
          </Link>
       </div>
       {news.length === 0 ? (
          <div className="text-xs font-mono text-gray-500 py-4 text-center border border-dashed border-gray-800">
             NO SIGNALS DETECTED.
          </div>
       ) : (
          news.map((item, i) => (
            <div key={i} className="group border-l-2 border-retro-grid pl-3 hover:border-retro-neon transition-colors py-1">
                <div className="flex justify-between text-[9px] text-gray-500 mb-0.5 font-mono uppercase tracking-wider">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span className="text-retro-pink">{item.category}</span>
                </div>
                <Link href="/signals" className="font-mono text-xs text-white group-hover:text-retro-neon font-bold block mb-1 truncate">
                    {item.headline}
                </Link>
                <p className="text-[10px] text-gray-400 line-clamp-2 font-mono leading-relaxed opacity-80">{item.summary}</p>
            </div>
          ))
       )}
    </div>
  );
};

export default async function ControlRoomPage() {
  // Parallel Data Fetching on the Server
  const [gameOfTheWeek, newsData] = await Promise.all([
    fetchGameOfTheWeek(),
    fetchRetroNews(1, 4) // Fetch 4 items for better density
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8 md:space-y-12 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="border-b-4 border-retro-grid pb-6 text-center pt-4">
        <h1 className="text-3xl md:text-6xl font-pixel text-white mb-4 drop-shadow-[0_0_15px_rgba(0,255,157,0.3)]">
          THE RETRO CIRCUIT
        </h1>
        <p className="font-mono text-retro-blue text-xs md:text-sm tracking-widest uppercase opacity-80 max-w-2xl mx-auto">
          Secure Database // Hardware Specs // Market Analysis
        </p>
      </div>

      {/* Hero Section: Game of the Week */}
      <section className="relative">
        <div className="absolute -top-3 left-4 md:-left-2 bg-retro-pink text-black font-pixel text-[10px] px-3 py-1 z-20 rotate-3 shadow-[4px_4px_0_rgba(0,0,0,1)] border-2 border-white">
          FEATURED ARCHIVE
        </div>
        <div className="transform hover:translate-y-[-2px] transition-transform duration-500">
            <GameOfTheWeek game={gameOfTheWeek} />
        </div>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Latest News Widget (Col Span 7) */}
        <div className="lg:col-span-7 flex flex-col">
           <div className="bg-black/40 border border-retro-grid p-6 h-full shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                 <IconNews className="w-24 h-24 text-retro-neon" />
              </div>
              <DashboardSignalFeed news={newsData.data} />
           </div>
        </div>

        {/* Right Column: Quick Access / Tools (Col Span 5) */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Nav Panel */}
            <div className="border-2 border-retro-blue bg-retro-blue/5 p-6 relative">
                <div className="absolute top-0 left-0 bg-retro-blue text-black font-pixel text-[9px] px-2 py-0.5">
                    SYSTEM MODULES
                </div>
                
                <div className="grid gap-4 mt-4">
                    <Link href="/arena" className="block group">
                        <div className="bg-black border border-retro-grid hover:border-retro-neon p-4 flex items-center justify-between transition-all group-hover:bg-retro-neon/10">
                            <div>
                                <div className="font-pixel text-sm text-white group-hover:text-retro-neon flex items-center gap-2">
                                    <IconVS className="w-4 h-4" />
                                    VS MODE
                                </div>
                                <div className="font-mono text-[10px] text-gray-500 mt-1">Compare hardware specifications</div>
                            </div>
                            <div className="text-retro-grid group-hover:text-retro-neon transition-colors">&gt;</div>
                        </div>
                    </Link>

                    <Link href="/console" className="block group">
                        <div className="bg-black border border-retro-grid hover:border-retro-pink p-4 flex items-center justify-between transition-all group-hover:bg-retro-pink/10">
                            <div>
                                <div className="font-pixel text-sm text-white group-hover:text-retro-pink flex items-center gap-2">
                                    <IconDatabase className="w-4 h-4" />
                                    CONSOLE VAULT
                                </div>
                                <div className="font-mono text-[10px] text-gray-500 mt-1">Full hardware specification database</div>
                            </div>
                            <div className="text-retro-grid group-hover:text-retro-pink transition-colors">&gt;</div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Login / Identity */}
            <div className="border border-retro-grid bg-black p-6 text-center opacity-80 hover:opacity-100 transition-opacity">
                <div className="font-pixel text-xs text-gray-500 mb-2">OPERATOR STATUS</div>
                <Link href="/login" className="inline-block w-full">
                    <button className="w-full bg-retro-grid hover:bg-retro-neon hover:text-black text-white font-mono text-xs px-4 py-3 transition-colors uppercase tracking-widest border border-transparent hover:border-white">
                        Access Terminal
                    </button>
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}