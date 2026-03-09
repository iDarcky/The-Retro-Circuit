'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import { ConsoleSearch } from '../arena/ConsoleSearch';

interface QuickCompareProps {
  consoles: { name: string; slug: string; manufacturerSlug?: string }[];
}

export default function QuickCompare({ consoles }: QuickCompareProps) {
  const router = useRouter();
  const [p1, setP1] = useState<{ slug: string, name: string, mfg?: string } | null>(null);
  const [p2, setP2] = useState<{ slug: string, name: string, mfg?: string } | null>(null);

  const handleCompare = () => {
    const mfg1 = p1?.mfg || 'unknown';
    const slug1 = p1?.slug ? `${mfg1}-${p1.slug}` : 'select';

    const mfg2 = p2?.mfg || 'unknown';
    const slug2 = p2?.slug ? `${mfg2}-${p2.slug}` : 'select';

    // We navigate to /arena/slug1-vs-slug2
    router.push(`/arena/${slug1}-vs-${slug2}`);
  };

  const p1Selected = !!p1;
  const p2Selected = !!p2;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-6">

        {/* Device A */}
        <div className={`flex-1 w-full relative transition-colors border-l-2 pl-2 ${p1Selected ? 'border-blue-500' : 'border-blue-500/30'}`}>
          <span className={`absolute -top-3 left-4 px-1 bg-bg-primary text-[10px] font-mono uppercase tracking-widest z-10 ${p1Selected ? 'text-blue-400 font-bold' : 'text-blue-500/50'}`}>
            PLAYER 1
          </span>
          <ConsoleSearch
            consoles={consoles}
            onSelect={(slug, name) => {
              const mfg = consoles.find(c => c.slug === slug)?.manufacturerSlug;
              setP1({ slug, name, mfg });
            }}
            placeholder="SELECT DEVICE..."
            themeColor="blue"
            currentSelection={p1?.name}
            textColor="white"
            highlightSelection={true}
          />
        </div>

        {/* Divider / VS */}
        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full border border-border-normal text-text-muted bg-bg-secondary">
          <ArrowLeftRight size={14} strokeWidth={1.5} />
        </div>

        {/* Device B */}
        <div className={`flex-1 w-full relative transition-colors border-l-2 pl-2 ${p2Selected ? 'border-red-500' : 'border-red-500/30'}`}>
          <span className={`absolute -top-3 left-4 px-1 bg-bg-primary text-[10px] font-mono uppercase tracking-widest z-10 ${p2Selected ? 'text-red-400 font-bold' : 'text-red-500/50'}`}>
            PLAYER 2
          </span>
          <ConsoleSearch
            consoles={consoles}
            onSelect={(slug, name) => {
              const mfg = consoles.find(c => c.slug === slug)?.manufacturerSlug;
              setP2({ slug, name, mfg });
            }}
            placeholder="SELECT DEVICE..."
            themeColor="red"
            currentSelection={p2?.name}
            textColor="white"
            highlightSelection={true}
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!p1 && !p2}
        className="relative z-30 w-full bg-white text-black hover:bg-blue-500 hover:text-white font-bold font-pixel text-[10px] md:text-sm py-4 uppercase tracking-widest transition-colors disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black flex items-center justify-center gap-2 border border-transparent rounded-none mt-2"
      >
        INITIATE ANALYSIS
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
