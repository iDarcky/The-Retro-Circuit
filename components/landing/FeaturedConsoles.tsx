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

      {/* Title - Left Aligned */}
      <div className="flex items-center gap-3 mb-6 justify-start">
        <h2 className="text-3xl font-bold tracking-tighter text-white uppercase">Featured Consoles</h2>
      </div>

      {/* Swiss Grid Layout - Full Width, Left Aligned */}
      <div className="w-full">

        {/* The Grid of Cards - Responsive, filling the row */}
        {/* grid-cols-2 (mobile) -> grid-cols-3 (md) -> grid-cols-5 (lg) -> grid-cols-8 (2xl) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-8 gap-4">
          {consoles.map((console) => {
            return (
              <Link
                key={console.id}
                href={`/consoles/${console.slug}`}
                className="group flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-white/5 rounded-xl overflow-hidden"
              >
                {/* Image Container - Square Aspect Ratio for Uniformity */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 pb-0">
                  <div className="relative w-[80%] h-[80%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {console.image_url ? (
                      <Image
                        src={console.image_url}
                        alt={console.name}
                        fill
                        className="object-contain drop-shadow-md"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 12vw"
                      />
                    ) : (
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        NO SIGNAL
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-4 flex flex-col gap-1.5">
                   <h3 className="text-xs font-bold text-white tracking-wider uppercase leading-snug group-hover:text-white transition-colors truncate">
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
