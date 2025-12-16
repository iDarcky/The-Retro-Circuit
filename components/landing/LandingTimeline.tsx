import React from 'react';
import { Circle, CircleDot } from 'lucide-react';

export default function LandingTimeline() {
  const eras = [
      { year: '1970s', title: 'The Dawn', desc: 'Atari 2600, Magnavox Odyssey', color: 'text-yellow-500' },
      { year: '1980s', title: '8-Bit Revolution', desc: 'NES, Sega Master System', color: 'text-red-500' },
      { year: '1990s', title: 'The Console Wars', desc: 'SNES, Genesis, PlayStation', color: 'text-blue-500' },
      { year: '2000s', title: '3D Era', desc: 'PS2, Xbox, GameCube', color: 'text-green-500' },
      { year: '2010s', title: 'HD Gaming', desc: 'PS3, Xbox 360, Wii', color: 'text-purple-500' },
      { year: '2020s', title: 'Modern Age', desc: 'PS5, Series X, Switch', color: 'text-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-200 font-sans p-8 md:p-20 relative overflow-hidden">

        {/* Background Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-700 md:-translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto relative">
             <div className="text-center mb-20 relative z-10">
                 <h1 className="text-4xl md:text-5xl font-bold bg-[#1e1e1e] inline-block px-4">Evolution of Play</h1>
                 <p className="text-gray-400 mt-2 bg-[#1e1e1e] inline-block px-4">A chronological archive of gaming history.</p>
             </div>

             <div className="space-y-12">
                 {eras.map((era, idx) => (
                     <div key={era.year} className={`flex flex-col md:flex-row items-start md:items-center relative ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                         {/* Dot */}
                         <div className="absolute left-0 md:left-1/2 -translate-x-[5px] md:-translate-x-1/2 bg-[#1e1e1e] p-1 z-10">
                              {idx === eras.length - 1 ?
                              <CircleDot className={`w-6 h-6 ${era.color} animate-pulse`} /> :
                              <Circle className={`w-4 h-4 ${era.color}`} fill="currentColor" />
                              }
                         </div>

                         {/* Content Left/Right */}
                         <div className={`md:w-1/2 pl-8 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} mb-8 md:mb-0 hover:scale-105 transition-transform cursor-pointer group`}>
                             <span className={`text-4xl font-black opacity-20 absolute -top-4 ${idx % 2 === 0 ? 'right-12' : 'left-12'} group-hover:opacity-40 transition-opacity select-none`}>{era.year}</span>
                             <h3 className={`text-2xl font-bold ${era.color} mb-1 relative z-10`}>{era.title}</h3>
                             <p className="text-gray-400 relative z-10">{era.desc}</p>
                         </div>

                         <div className="md:w-1/2"></div>
                     </div>
                 ))}
             </div>

             <div className="text-center mt-20 relative z-10">
                 <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                     Explore The Full Timeline
                 </button>
             </div>
        </div>
    </div>
  );
}
