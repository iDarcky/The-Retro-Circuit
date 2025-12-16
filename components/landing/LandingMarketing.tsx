import React from 'react';
import Link from 'next/link';
import { ArrowRight, Box } from 'lucide-react';

const MOCK_LATEST_CONSOLES = [
    { id: '1', name: 'Nintendo GameCube', mfg: 'Nintendo', year: '2001', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/GameCube-Set.jpg/1200px-GameCube-Set.jpg' },
    { id: '2', name: 'PlayStation 2', mfg: 'Sony', year: '2000', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/PlayStation_2.png/1200px-PlayStation_2.png' },
    { id: '3', name: 'Sega Dreamcast', mfg: 'Sega', year: '1998', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Dreamcast-Console-Set.jpg/1200px-Dreamcast-Console-Set.jpg' },
];

export default function LandingMarketing() {
  return (
    <div className="w-full min-h-screen bg-retro-dark text-white font-mono flex flex-col">

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 text-center border-b border-retro-grid relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-retro-neon/20"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-retro-pink/20"></div>

        <h1 className="text-5xl md:text-7xl font-pixel mb-6 bg-clip-text text-transparent bg-gradient-to-r from-retro-neon to-retro-blue leading-tight py-2">
            WELCOME TO<br/>THE CIRCUIT
        </h1>

        <p className="max-w-xl text-gray-400 text-lg mb-10">
            The ultimate database for retro gaming hardware. Compare specs, explore history, and deep dive into the silicon that powered your childhood.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
            <Link href="/console" className="group px-8 py-4 bg-retro-neon text-black font-bold text-lg rounded hover:scale-105 transition-transform flex items-center gap-2">
                BROWSE CONSOLES <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/arena" className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded hover:bg-white hover:text-black transition-colors">
                COMPARE SPECS
            </Link>
        </div>
      </section>

      {/* Latest Consoles Section */}
      <section className="p-8 md:p-16 bg-[#0f0f1b]">
          <div className="flex justify-between items-end mb-8 border-b border-retro-grid pb-4">
              <div>
                  <h2 className="text-2xl font-pixel text-retro-pink mb-2">LATEST_ARRIVALS</h2>
                  <p className="text-gray-500 text-sm">Freshly archived hardware.</p>
              </div>
              <Link href="/console" className="text-retro-neon text-sm hover:underline">VIEW ALL &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_LATEST_CONSOLES.map((console) => (
                <div key={console.id} className="group border border-retro-grid bg-[#1a1a2e] rounded-lg overflow-hidden hover:border-retro-blue transition-all cursor-pointer">
                    <div className="h-48 bg-gray-900 relative overflow-hidden">
                        {/* Mock Image Placeholder since we can't guarantee external img load */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-gray-900 group-hover:bg-gray-800 transition-colors">
                            <Box size={48} />
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-xs text-retro-neon mb-1">{console.mfg}</div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-retro-blue transition-colors">{console.name}</h3>
                        <div className="text-sm text-gray-500">{console.year}</div>
                    </div>
                </div>
            ))}
          </div>
      </section>

    </div>
  );
}
