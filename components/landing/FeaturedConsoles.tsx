'use client';

import { type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type ConsoleDetails } from '../../lib/types/domain';

interface FeaturedConsolesProps {
  consoles: ConsoleDetails[];
}

const FeaturedConsoles: FC<FeaturedConsolesProps> = ({ consoles }) => {
  return (
    <div className="w-full mt-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-color-primary"></div>
        <h2 className="text-sm font-mono tracking-widest text-text-secondary uppercase">Featured Consoles</h2>
      </div>

      {/* Unified Dark Container */}
      <div className="relative bg-zinc-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        {/* Seamless Row Layout */}
        <div className="flex divide-x divide-white/5">
            {consoles.slice(0, 5).map((console) => {
              return (
                <Link
                  key={console.id}
                  href={`/consoles/${console.slug}`}
                  className="group relative flex-1 min-w-0 p-6 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white/5"
                >
                  {/* Floating Image */}
                  <div className="relative w-full aspect-square mb-4 transition-transform duration-500 group-hover:-translate-y-2">
                    {console.image_url ? (
                      <Image
                        src={console.image_url}
                        alt={console.name}
                        fill
                        className="object-contain drop-shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-white/20">NO SIGNAL</div>
                    )}

                    {/* Shadow underneath image for depth */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/40 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75"></div>
                  </div>

                  {/* Minimal Info */}
                  <div className="text-center w-full">
                     <h3 className="text-xs font-bold text-white tracking-tight uppercase truncate px-2 group-hover:text-violet-400 transition-colors">
                        {console.name}
                     </h3>
                     <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                        {console.manufacturer?.name}
                     </span>
                  </div>
                </Link>
              );
            })}

            {/* Fill empty space if fewer than 5 items */}
            {Array.from({ length: Math.max(0, 5 - consoles.slice(0, 5).length) }).map((_, i) => (
                 <div key={`empty-${i}`} className="flex-1 min-w-0 bg-transparent"></div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedConsoles;
