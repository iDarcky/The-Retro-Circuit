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
    <div className="flex flex-col gap-8 h-full">
      <div className="space-y-8 flex-grow">
        {/* Device A */}
        <div className="space-y-2">
            <label className="text-[10px] font-mono text-color-primary uppercase tracking-widest pl-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-color-primary rounded-full"></span>
                DEVICE A // INPUT
            </label>
            <ConsoleSearch
                consoles={consoles}
                onSelect={(slug, name) => setP1({ slug, name })}
                placeholder="SELECT SYSTEM..."
                themeColor="primary"
                currentSelection={p1?.name}
            />
        </div>

        <div className="flex items-center justify-center opacity-30">
             <div className="h-px w-full bg-border-normal"></div>
             <div className="mx-4 p-2 rounded-full border border-border-normal bg-bg-tertiary">
                <ArrowLeftRight size={14} className="text-text-muted" />
             </div>
             <div className="h-px w-full bg-border-normal"></div>
        </div>

        {/* Device B */}
        <div className="space-y-2">
            <label className="text-[10px] font-mono text-color-secondary uppercase tracking-widest pl-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-color-secondary rounded-full"></span>
                DEVICE B // INPUT
            </label>
            <ConsoleSearch
                consoles={consoles}
                onSelect={(slug, name) => setP2({ slug, name })}
                placeholder="SELECT SYSTEM..."
                themeColor="secondary"
                currentSelection={p2?.name}
            />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!p1 && !p2}
        className="w-full bg-text-primary hover:bg-white text-bg-primary font-bold font-mono text-sm py-4 uppercase tracking-widest transition-all hover:scale-[1.01] disabled:opacity-20 disabled:hover:scale-100 flex items-center justify-center gap-2 rounded-sm"
      >
        INITIATE ANALYSIS
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
