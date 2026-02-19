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

      {/* Grid Layout - Compact & Flat */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {consoles.slice(0, 5).map((console) => {
            return (
              <Link
                key={console.id}
                href={`/consoles/${console.slug}`}
                className="group relative block w-full aspect-[4/5] hover:z-10"
              >
                 {/* Card Content - Flat Design, Smaller Padding */}
                 <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden
                                transition-all duration-300
                                group-hover:bg-zinc-800/90
                                group-hover:border-violet-500/50
                                group-hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]">

                    {/* Inner Content Wrapper - Reduced Padding */}
                    <div className="h-full flex flex-col p-4">

                        {/* Image Container - Significantly Smaller */}
                        <div className="relative flex-1 w-full flex items-center justify-center mb-3">
                           <div className="relative w-[60%] h-[60%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                              {console.image_url ? (
                                <Image
                                  src={console.image_url}
                                  alt={console.name}
                                  fill
                                  className="object-contain drop-shadow-xl"
                                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-white/20">NO SIGNAL</div>
                              )}
                           </div>
                        </div>

                        {/* Info Section - Compact Typography */}
                        <div className="mt-auto pt-3 border-t border-white/5 group-hover:border-white/10 transition-colors">
                           <h3 className="text-[10px] sm:text-xs font-bold text-white tracking-tight uppercase truncate group-hover:text-violet-400 transition-colors">
                              {console.name}
                           </h3>
                           <span className="text-[9px] font-mono text-zinc-500 mt-0.5 block group-hover:text-zinc-400">
                              {console.manufacturer?.name}
                           </span>
                        </div>
                    </div>
                 </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default FeaturedConsoles;
