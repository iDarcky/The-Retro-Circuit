'use client';

import { type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { type ConsoleDetails } from '../../lib/types/domain';

interface FeaturedConsolesProps {
  consoles: ConsoleDetails[];
}

const FeaturedConsoles: FC<FeaturedConsolesProps> = ({ consoles }) => {
  return (
    <div className="w-full mt-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-color-primary"></div>
        <h2 className="text-sm font-mono tracking-widest text-text-secondary uppercase">Featured Consoles</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {consoles.slice(0, 4).map((console) => {
          const price = console.specs?.price_launch_usd;
          const formattedPrice = price
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
            : 'LEGACY';

          return (
            <Link
              key={console.id}
              href={`/consoles/${console.slug}`}
              className="group block relative bg-bg-primary border border-border-normal hover:border-violet-500 transition-all duration-300"
            >
              {/* Image Container - Aspect 16:9 */}
              <div className="relative aspect-video w-full bg-bg-secondary/30 flex items-center justify-center p-6 border-b border-border-subtle group-hover:bg-bg-secondary/50 transition-colors overflow-hidden">
                {console.image_url ? (
                  <Image
                    src={console.image_url}
                    alt={console.name}
                    width={300}
                    height={200}
                    className="object-contain w-full h-full mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="text-xs font-mono text-text-muted">NO SIGNAL</div>
                )}

                {/* Hover Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-violet-500" />
                </div>
              </div>

              {/* Text Content */}
              <div className="p-4 flex flex-col gap-1">
                 <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase text-text-muted group-hover:text-violet-400 transition-colors truncate pr-2">
                        {console.manufacturer?.name || 'UNKNOWN'}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted bg-bg-secondary/50 px-1.5 py-0.5 rounded border border-transparent group-hover:border-violet-500/30 group-hover:text-violet-300 transition-colors">
                        {formattedPrice}
                    </span>
                 </div>

                 <h3 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-white transition-colors truncate">
                    {console.name}
                 </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedConsoles;
