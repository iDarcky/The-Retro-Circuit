export const revalidate = 60;

import Link from 'next/link';

export default async function ControlRoomPage() {
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

      {/* Dashboard Grid - Centered since we removed the left column */}
      <div className="max-w-4xl mx-auto">
        
        {/* Quick Access / Tools */}
        <div className="space-y-6">
            {/* Quick Nav Panel */}
            <div className="border-2 border-retro-blue bg-retro-blue/5 p-6">
                <h3 className="font-pixel text-retro-blue mb-6 text-center border-b border-retro-blue/30 pb-4">
                    SYSTEM TOOLS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/arena" className="block">
                        <div className="group border-2 border-retro-grid hover:border-retro-neon bg-black p-4 flex items-center justify-between transition-all h-full">
                            <div>
                                <div className="font-pixel text-sm text-white group-hover:text-retro-neon">VS MODE</div>
                                <div className="font-mono text-xs text-gray-500">Spec Showdown</div>
                            </div>
                            <svg className="w-6 h-6 text-retro-grid group-hover:text-retro-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                    </Link>

                    <Link href="/console" className="block">
                        <div className="group border-2 border-retro-grid hover:border-retro-pink bg-black p-4 flex items-center justify-between transition-all h-full">
                            <div>
                                <div className="font-pixel text-sm text-white group-hover:text-retro-pink">CONSOLE VAULT</div>
                                <div className="font-mono text-xs text-gray-500">Hardware Archive</div>
                            </div>
                            <svg className="w-6 h-6 text-retro-grid group-hover:text-retro-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
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
