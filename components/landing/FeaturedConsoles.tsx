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
    <div className="w-full mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-2">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-color-primary"></div>
            <h2 className="text-xs font-mono tracking-widest text-text-secondary uppercase">New Arrivals</h2>
         </div>
         <div className="text-[10px] font-mono text-text-muted">
            LATEST_INDEX // 001-005
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border-subtle border border-border-subtle">
        {consoles.slice(0, 5).map((console) => {
          const year = console.specs?.release_date ? new Date(console.specs.release_date).getFullYear() : 'N/A';

          return (
            <Link
              key={console.id}
              href={`/consoles/${console.slug}`}
              className="group relative bg-bg-primary hover:bg-bg-secondary/20 transition-colors duration-200 block overflow-hidden h-full flex flex-col"
            >
              {/* Image Container - Square Aspect Ratio for Compactness */}
              <div className="relative aspect-square w-full bg-bg-secondary/10 flex items-center justify-center p-4 group-hover:bg-bg-secondary/30 transition-colors">
                {console.image_url ? (
                  <Image
                    src={console.image_url}
                    alt={console.name}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full mix-blend-screen opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <div className="text-[10px] font-mono text-text-muted rotate-45">NO SIGNAL</div>
                )}

                {/* Minimal Hover Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowUpRight className="w-3 h-3 text-color-primary" />
                </div>
              </div>

              {/* Text Content - Minimalist */}
              <div className="p-3 flex flex-col justify-between flex-grow border-t border-border-subtle/50">
                 <div>
                    <span className="block text-[9px] font-mono uppercase text-text-muted mb-1 tracking-wider truncate">
                        {console.manufacturer?.name || 'UNKNOWN'}
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-tight text-text-primary group-hover:text-white transition-colors leading-tight line-clamp-2 min-h-[2.5em]">
                        {console.name}
                    </h3>
                 </div>

                 <div className="mt-3 pt-2 border-t border-border-subtle/30 flex justify-between items-end">
                    <span className="text-[9px] font-mono text-text-muted group-hover:text-color-primary transition-colors">
                        EST. {year}
                    </span>
                 </div>
              </div>
            </Link>
          );
        })}

        {/* Fill empty grid slots if needed (optional, just ensuring grid doesn't break) */}
        {Array.from({ length: Math.max(0, 5 - consoles.slice(0, 5).length) }).map((_, i) => (
             <div key={`empty-${i}`} className="bg-bg-primary/50 relative hidden lg:block">
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#333_50%,transparent_55%)] bg-[size:10px_10px] opacity-10"></div>
             </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedConsoles;
