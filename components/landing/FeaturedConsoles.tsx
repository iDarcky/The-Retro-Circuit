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

      {/* Title - Reduced margin */}
      <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
        <div className="w-2 h-2 bg-color-primary"></div>
        <h2 className="text-xs font-mono tracking-widest text-text-secondary uppercase">Featured Consoles</h2>
      </div>

      {/* Swiss Grid Layout - Stripped Down "Floating" */}
      {/* Explicitly center-aligned (mx-auto) and constrained width */}
      <div className="w-full md:w-[60%] mx-auto">

        {/* The Grid of Cards - Reduced gap to fit "shrink" request */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {consoles.slice(0, 5).map((console) => {
            return (
              <Link
                key={console.id}
                href={`/consoles/${console.slug}`}
                className="group flex flex-col bg-white/5 backdrop-blur-md border border-white/10 hover:border-violet-500 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-violet-900/10"
              >
                {/* Image Container - Aspect Ratio [3/2] to reduce height */}
                {/* Subtle glass background for the image area as well */}
                <div className="relative w-full aspect-[3/2] bg-white/5 border-b border-white/5 flex items-center justify-center p-3">
                  <div className="relative w-[70%] h-[70%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {console.image_url ? (
                      <Image
                        src={console.image_url}
                        alt={console.name}
                        fill
                        className="object-contain drop-shadow-md"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        NO SIGNAL
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section - Smaller Text, Tighter Layout */}
                <div className="p-3 flex flex-col gap-1.5">
                   <h3 className="text-xs font-bold text-white tracking-wider uppercase leading-snug group-hover:text-violet-400 transition-colors">
                      {console.name}
                   </h3>
                   <div className="flex justify-between items-end">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors truncate">
                         {console.manufacturer?.name}
                      </span>
                   </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedConsoles;
