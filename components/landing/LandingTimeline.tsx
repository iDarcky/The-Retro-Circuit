import React from 'react';
import { Circle, CircleDot } from 'lucide-react';

export default function LandingTimeline() {
  const eras = [
    { year: '1972', title: 'The Beginning', desc: 'Magnavox Odyssey launches the home industry.', color: 'text-yellow-500' },
    { year: '1977', title: 'Atari VCS', desc: 'The 2600 brings arcade hits to the living room.', color: 'text-orange-500' },
    { year: '1983', title: 'The Crash', desc: 'Market saturation leads to a massive collapse.', color: 'text-red-500' },
    { year: '1985', title: 'NES', desc: 'Nintendo revitalizes the market with the Entertainment System.', color: 'text-red-600' },
    { year: '1989', title: 'Genesis', desc: 'Sega does what Nintendon’t.', color: 'text-blue-500' },
    { year: '1994', title: 'PlayStation', desc: 'Sony enters the arena and changes everything.', color: 'text-gray-400' },
    { year: '2001', title: 'Xbox', desc: 'Microsoft brings PC architecture to the console.', color: 'text-green-500' },
    { year: '2006', title: 'Wii', desc: 'Motion controls expand the audience to everyone.', color: 'text-cyan-400' },
    { year: '2017', title: 'Switch', desc: 'Hybrid gaming becomes the new standard.', color: 'text-red-500' },
    { year: '2024', title: 'The Circuit', desc: 'We begin archiving it all.', color: 'text-[#00ff9d]' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 font-sans overflow-x-hidden">

      <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              History of Hardware
          </h1>
          <p className="text-gray-400">Scroll through the evolution of interactive entertainment.</p>
      </div>

      <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-[#00ff9d] h-full rounded-full opacity-30"></div>

          <div className="space-y-24 pb-24">
              {eras.map((era, index) => (
                  <div key={index} className={`relative flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>

                      {/* Empty Space */}
                      <div className="w-5/12"></div>

                      {/* Center Node */}
                      <div className="z-10 bg-[#0a0a0a] border-4 border-[#1a1a1a] rounded-full p-1 shadow-[0_0_20px_rgba(0,0,0,1)]">
                          {index === eras.length - 1 ?
                              <CircleDot className={`w-6 h-6 ${era.color} animate-pulse`} /> :
                              <Circle className={`w-4 h-4 ${era.color}`} fill="currentColor" />
                          }
                      </div>

                      {/* Content Card */}
                      <div className="w-5/12">
                          <div className={`p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-white/20 transition-all hover:transform hover:-translate-y-1 shadow-xl group ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                              <span className={`text-5xl font-bold opacity-20 absolute ${index % 2 === 0 ? '-left-4 top-0' : '-right-4 top-0'}`}>{era.year}</span>
                              <h3 className={`text-2xl font-bold mb-2 ${era.color} relative z-10`}>{era.title}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed relative z-10">{era.desc}</p>
                          </div>
                      </div>

                  </div>
              ))}
          </div>

          <div className="text-center pb-12">
              <button className="bg-[#00ff9d] text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
                  Enter The Archive
              </button>
          </div>
      </div>

    </div>
  );
}
