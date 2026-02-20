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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 bg-color-primary"></div>
        <h2 className="text-sm font-mono tracking-widest text-text-secondary uppercase">Featured Consoles</h2>
      </div>

      {/* Swiss Grid Layout - Strict Grid, Visible Borders */}
      <div className="border border-white/10 bg-zinc-900">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10">
          {consoles.slice(0, 5).map((console) => {
            return (
              <Link
                key={console.id}
                href={`/consoles/${console.slug}`}
                className="group relative block w-full aspect-[4/5] bg-zinc-950 hover:bg-zinc-900 transition-colors"
              >
                {/* Content Container - No rounding, sharp edges */}
                <div className="h-full flex flex-col p-6">

                  {/* Image Container */}
                  <div className="relative flex-1 w-full flex items-center justify-center mb-6">
                    <div className="relative w-[75%] h-[75%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      {console.image_url ? (
                        <Image
                          src={console.image_url}
                          alt={console.name}
                          fill
                          className="object-contain drop-shadow-xl"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                          NO SIGNAL
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Section - Sharp Borders, High Contrast */}
                  <div className="mt-auto border-t border-zinc-800 pt-4 group-hover:border-violet-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-white tracking-widest uppercase truncate group-hover:text-violet-400 transition-colors">
                      {console.name}
                    </h3>
                    <div className="flex justify-between items-end mt-2">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                          {console.manufacturer?.name}
                       </span>
                       <span className="text-[10px] font-mono text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                          VIEW
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Empty Slot Filler for Mobile/Tablet Breakpoints to maintain grid structure */}
          {/* Since we slice(0,5), on md (3 cols) we have 1 empty slot. On sm (2 cols) we have 1 empty slot. */}
          {/* We can render an empty div to fill the gap if needed, but the gap-px background will handle the lines. */}
          {/* However, an empty cell would just be the background color of the grid (white/10) or transparent? */}
          {/* Actually, if the grid has bg-white/10, the empty cell is just a hole showing the container background (zinc-900). */}
          {/* That's fine. It looks like an empty slot in a rack. */}
        </div>
      </div>
    </div>
  );
};

export default FeaturedConsoles;
