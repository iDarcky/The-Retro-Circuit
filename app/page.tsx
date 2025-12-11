export const revalidate = 60;

import Link from 'next/link';
import GameOfTheWeek from '../components/GameOfTheWeek';
import DashboardSignalFeed from '../components/DashboardSignalFeed';
import { IconVS, IconDatabase } from '../components/ui/Icons';
import { fetchRetroNews, fetchGameOfTheWeek } from '../lib/api';

export default async function ControlRoomPage() {
  // Parallel Data Fetching on the Server
  const [gameOfTheWeek, newsData] = await Promise.all([
    fetchGameOfTheWeek(),
    fetchRetroNews(1, 3)
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-12">
      
      {/* Welcome Banner */}
      <div className="border-b-4 border-retro-grid pb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4 drop-shadow-[4px_4px_0_rgba(0,255,157,0.5)]">
          WELCOME TO THE CIRCUIT
        </h1>
        <p className="font-mono text-retro-blue text-lg md:text-xl max-w-2xl mx-auto">
          YOUR GATEWAY TO THE GOLDEN AGE OF GAMING HARDWARE AND SOFTWARE.
        </p>
      </div>

      {/* Hero Section: Game of the Week */}
      <section className="relative">
        <div className="absolute -top-4 left-4 bg-retro-pink text-retro-dark font-pixel text-xs px-3 py-1 z-20 rotate-3 shadow-lg border-2 border-white">
          FEATURED HIT
        </div>
        <div className="transform hover:scale-[1.01] transition-transform duration-500">
            <GameOfTheWeek game={gameOfTheWeek} />
        </div>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Latest News Widget */}
        <div className="lg:col-span-2">
           <div className="bg-retro-dark/50 border border-retro-grid p-6 h-full">
              <DashboardSignalFeed news={newsData.data} />
           </div>
        </div>

        {/* Right Column: Quick Access / Tools */}
        <div className="space-y-6">
            {/* Quick Nav Panel */}
            <div className="border-2 border-retro-blue bg-retro-blue/5 p-6">
                <h3 className="font-pixel text-retro-blue mb-6 text-center border-b border-retro-blue/30 pb-4">
                    SYSTEM TOOLS
                </h3>
                <div className="grid gap-4">
                    <Link href="/arena" className="block">
                        <div className="group border-2 border-retro-grid hover:border-retro-neon bg-black p-4 flex items-center justify-between transition-all">
                            <div>
                                <div className="font-pixel text-sm text-white group-hover:text-retro-neon">VS MODE</div>
                                <div className="font-mono text-xs text-gray-500">Spec Showdown</div>
                            </div>
                            <IconVS className="w-6 h-6 text-retro-grid group-hover:text-retro-neon transition-colors" />
                        </div>
                    </Link>

                    <Link href="/console" className="block">
                        <div className="group border-2 border-retro-grid hover:border-retro-pink bg-black p-4 flex items-center justify-between transition-all">
                            <div>
                                <div className="font-pixel text-sm text-white group-hover:text-retro-pink">CONSOLE VAULT</div>
                                <div className="font-mono text-xs text-gray-500">Hardware Archive</div>
                            </div>
                            <IconDatabase className="w-6 h-6 text-retro-grid group-hover:text-retro-pink transition-colors" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Ad / Promo Box */}
            <div className="border-2 border-dashed border-gray-700 p-6 text-center opacity-75 hover:opacity-100 transition-opacity">
                <div className="font-pixel text-xs text-gray-500 mb-2">ADVERTISEMENT</div>
                <div className="font-pixel text-xl text-retro-neon animate-pulse mb-2">POWER UP!</div>
                <p className="font-mono text-xs text-gray-400">Join the Retro Circuit crew today. Sign up for exclusive updates.</p>
                <Link href="/login" className="inline-block mt-4">
                    <button className="bg-retro-grid hover:bg-retro-neon hover:text-black text-white font-mono text-xs px-4 py-2 transition-colors">
                        LOGIN NOW
                    </button>
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
