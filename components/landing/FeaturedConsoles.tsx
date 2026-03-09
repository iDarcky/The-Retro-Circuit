'use client';

import { type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type ConsoleDetails } from '../../lib/types/domain';

interface FeaturedConsolesProps {
  consoles: ConsoleDetails[];
}

/* ─── Shared image block ────────────────────────────────────── */
function ConsoleImage({ console }: { console: ConsoleDetails }) {
  return console.image_url ? (
    <Image
      src={console.image_url}
      alt={console.name}
      fill
      className="object-contain"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 12vw"
    />
  ) : (
    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
      NO SIGNAL
    </div>
  );
}

/* ─── Default card (existing design, perf-optimised) ────────── */
function DefaultCard({ console }: { console: ConsoleDetails }) {
  return (
    <Link
      href={`/consoles/${console.slug}`}
      className="group flex flex-col bg-zinc-900/70 backdrop-blur-sm border border-white/5 hover:border-violet-500/50 hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-300 shadow-sm hover:shadow-lg hover:shadow-violet-500/20 rounded-xl overflow-hidden"
    >
      <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 pb-0">
        <div className="relative w-[80%] h-[80%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <ConsoleImage console={console} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-white tracking-wider uppercase leading-snug truncate">
          {console.name}
        </h3>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors truncate">
          {console.manufacturer?.name}
        </span>
      </div>
    </Link>
  );
}

/* ─── Variant A — "Data Card" ───────────────────────────────── *
 * Hard-edged, no rounded corners, thick violet top accent bar,
 * monospaced text, hairline grid lines. Pure Swiss data feel.  */
function DataCard({ console }: { console: ConsoleDetails }) {
  return (
    <Link
      href={`/consoles/${console.slug}`}
      className="group flex flex-col bg-zinc-950 border border-zinc-700 hover:border-white hover:-translate-y-1 transition-[transform,border-color] duration-300 overflow-hidden"
    >
      {/* Accent bar */}
      <div className="h-1 w-full bg-violet-500 group-hover:bg-violet-400 transition-colors" />

      <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 pb-0 border-b border-zinc-800">
        <div className="relative w-[70%] h-[70%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <ConsoleImage console={console} />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest leading-snug truncate">
          {console.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
            {console.manufacturer?.name}
          </span>
          <span className="w-2 h-2 border border-violet-500 group-hover:bg-violet-500 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Variant B — "Poster Card" ─────────────────────────────── *
 * Inverted: white background, dark text. Bold typographic       *
 * emphasis, left accent stripe. "International poster" feel.    */
function PosterCard({ console }: { console: ConsoleDetails }) {
  return (
    <Link
      href={`/consoles/${console.slug}`}
      className="group flex flex-col bg-white text-zinc-950 border border-zinc-300 hover:border-zinc-950 hover:-translate-y-1 transition-[transform,border-color] duration-300 overflow-hidden relative"
    >
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 group-hover:w-1.5 transition-[width] duration-300" />

      <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 pb-0 ml-1">
        <div className="relative w-[70%] h-[70%] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <ConsoleImage console={console} />
        </div>
      </div>

      <div className="p-4 pl-5 flex flex-col gap-1">
        <h3 className="text-sm font-bold uppercase tracking-tight leading-snug truncate text-zinc-950">
          {console.name}
        </h3>
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate">
          {console.manufacturer?.name}
        </span>
      </div>
    </Link>
  );
}

const FeaturedConsoles: FC<FeaturedConsolesProps> = ({ consoles }) => {
  return (
    <div className="w-full mt-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>

      {/* Title - Left Aligned */}
      <div className="flex flex-col gap-2 mb-8 justify-start">
        <h2 className="text-3xl font-bold tracking-tighter text-white uppercase">Featured Consoles</h2>
        <div className="w-1/3 h-0.5 bg-gradient-to-r from-violet-500 to-transparent"></div>
      </div>

      {/* Swiss Grid Layout */}
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-8 gap-4">
          {consoles.map((console, i) => {
            const isSecondToLast = i === consoles.length - 2;
            const isLast = i === consoles.length - 1;

            if (isSecondToLast) return <DataCard key={console.id} console={console} />;
            if (isLast) return <PosterCard key={console.id} console={console} />;
            return <DefaultCard key={console.id} console={console} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedConsoles;
