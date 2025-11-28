import { type FC } from 'react';
import { Link } from 'react-router-dom';
import GameOfTheWeek from './GameOfTheWeek';
import SignalFeed from '../SignalFeed/SignalFeed';
import SEOHead from '../../components/ui/SEOHead';

const ControlRoom: FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-12">
      <SEOHead 
        title="Retro Gaming Database & News" 
        description="The ultimate retro gaming hub. Compare console specs, read classic game reviews, and track the history of video game hardware from Atari to PlayStation."
      />
      
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
            <GameOfTheWeek />
        </div>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Latest News Widget */}
        <div className="lg:col-span-2">
           <div className="bg-retro-dark/50 border border-retro-grid p-6 h-full">
              <SignalFeed limit={3} showAddForm={false} compact={true} />
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
                    <Link to="/arena" className="block">
                        <div className="group border-2 border-retro-grid hover:border-retro-neon bg-black p-4 flex items-center justify-between transition-all">
                            <span className="font-mono text-sm text-gray-300 group-hover:text-retro-neon">VS. BATTLE ARENA</span>
                            <span className="text-retro-grid group-hover:text-retro-neon">&gt;</span>
                        </div>
                    </Link>

                    <Link to="/systems" className="block">
                        <div className="group border-2 border-retro-grid hover:border-retro-neon bg-black p-4 flex items-center justify-between transition-all">
                            <span className="font-mono text-sm text-gray-300 group-hover:text-retro-neon">CONSOLE DATABASE</span>
                            <span className="text-retro-grid group-hover:text-retro-neon">&gt;</span>
                        </div>
                    </Link>

                    <Link to="/chrono" className="block">
                        <div className="group border-2 border-retro-grid hover:border-retro-neon bg-black p-4 flex items-center justify-between transition-all">
                            <span className="font-mono text-sm text-gray-300 group-hover:text-retro-neon">TIMELINE VIEW</span>
                            <span className="text-retro-grid group-hover:text-retro-neon">&gt;</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Status Panel */}
            <div className="border-2 border-retro-grid bg-retro-dark p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-pixel text-xs text-gray-500">SYSTEM STATUS</span>
                    <span className="w-2 h-2 bg-retro-neon rounded-full animate-pulse"></span>
                </div>
                <div className="font-mono text-xs text-gray-400">
                    <div className="flex justify-between py-1 border-b border-gray-800">
                        <span>MAINFRAME</span>
                        <span className="text-retro-neon">ONLINE</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                        <span>DB CONNECTION</span>
                        <span className="text-retro-neon">STABLE</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span>SECURITY</span>
                        <span className="text-yellow-400">MONITORED</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ControlRoom;