'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import { ConsoleSearch } from '../arena/ConsoleSearch';

interface QuickCompareProps {
  consoles: { name: string; slug: string }[];
}

export default function QuickCompare({ consoles }: QuickCompareProps) {
  const router = useRouter();
  const [p1, setP1] = useState<{slug: string, name: string} | null>(null);
  const [p2, setP2] = useState<{slug: string, name: string} | null>(null);

  const handleCompare = () => {
    const slug1 = p1?.slug || 'select';
    const slug2 = p2?.slug || 'select';

    // We navigate to /arena/slug1-vs-slug2
    router.push(`/arena/${slug1}-vs-${slug2}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-6">

        {/* Device A */}
        <div className="flex-1 w-full relative">
            <span className="absolute -top-3 left-2 px-1 bg-bg-primary text-[10px] font-mono text-text-muted uppercase tracking-widest z-10">
                PLAYER 1
            </span>
            <ConsoleSearch
                consoles={consoles}
                onSelect={(slug, name) => setP1({ slug, name })}
                placeholder="SELECT DEVICE..."
                themeColor="primary"
                currentSelection={p1?.name}
                textColor="white"
            />
        </div>

        {/* Divider / VS */}
        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full border border-border-normal text-text-muted bg-bg-secondary">
             <ArrowLeftRight size={14} strokeWidth={1.5} />
        </div>

        {/* Device B */}
        <div className="flex-1 w-full relative">
            <span className="absolute -top-3 left-2 px-1 bg-bg-primary text-[10px] font-mono text-text-muted uppercase tracking-widest z-10">
                PLAYER 2
            </span>
            <ConsoleSearch
                consoles={consoles}
                onSelect={(slug, name) => setP2({ slug, name })}
                placeholder="SELECT DEVICE..."
                themeColor="secondary" // In this theme, secondary is just white/neutral
                currentSelection={p2?.name}
                textColor="white"
            />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!p1 && !p2}
        className="w-full bg-text-primary hover:bg-color-primary text-bg-primary font-bold font-mono text-sm py-4 uppercase tracking-widest transition-colors disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-text-primary flex items-center justify-center gap-2 border border-transparent rounded-none"
      >
        INITIATE ANALYSIS
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
