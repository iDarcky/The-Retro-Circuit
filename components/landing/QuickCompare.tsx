'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col gap-8 h-full">
      <div className="space-y-6 flex-grow">
        {/* Player 1 */}
        <div className="space-y-2">
            <label className="text-[10px] font-mono text-primary uppercase tracking-widest pl-1">
                PLAYER 1
            </label>
            <ConsoleSearch
                consoles={consoles}
                onSelect={(slug, name) => setP1({ slug, name })}
                placeholder="SELECT PLAYER 1..."
                themeColor="cyan"
                currentSelection={p1?.name}
            />
        </div>

        <div className="flex items-center justify-center">
             <div className="h-px w-full bg-gray-800"></div>
             <span className="mx-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">VS</span>
             <div className="h-px w-full bg-gray-800"></div>
        </div>

        {/* Player 2 */}
        <div className="space-y-2">
            <label className="text-[10px] font-mono text-accent uppercase tracking-widest pl-1">
                PLAYER 2
            </label>
            <ConsoleSearch
                consoles={consoles}
                onSelect={(slug, name) => setP2({ slug, name })}
                placeholder="SELECT PLAYER 2..."
                themeColor="pink"
                currentSelection={p2?.name}
            />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!p1 && !p2}
        className="w-full bg-primary hover:bg-white text-black font-bold font-tech text-sm py-4 uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
      >
        Compare Systems
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
