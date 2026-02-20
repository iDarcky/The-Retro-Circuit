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

      {/* Swiss Grid Layout - "Floating Cards in a Box" */}
      {/* Container Background: Dark, subtle pattern or solid to tie everything together */}
      <div className="relative border border-white/10 bg-zinc-900/50 p-6 md:p-8">

        {/* Decorative background grid pattern for the container */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

        {/* The Grid of Cards - Relative to appear "in front" */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {consoles.slice(0, 5).map((console) => {
            return (
              <Link
                key={console.id}
                href={`/consoles/${console.slug}`}
                className="group flex flex-col bg-zinc-950 border border-white/10 hover:border-violet-500 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-violet-900/20"
              >
                {/* Image Container - Square Aspect Ratio (1:1) for compact look */}
                <div className="relative w-full aspect-square bg-zinc-900/50 border-b border-white/5 flex items-center justify-center p-4">
                  <div className="relative w-[80%] h-[80%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {console.image_url ? (
                      <Image
                        src={console.image_url}
                        alt={console.name}
                        fill
                        className="object-contain drop-shadow-xl"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                        NO SIGNAL
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section - Larger Text, Clean Layout */}
                <div className="p-4 flex flex-col gap-2">
                   <h3 className="text-sm font-bold text-white tracking-wider uppercase leading-tight group-hover:text-violet-400 transition-colors">
                      {console.name}
                   </h3>
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
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
