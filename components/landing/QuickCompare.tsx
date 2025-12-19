'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface QuickCompareProps {
  consoles: { name: string; slug: string }[];
}

export default function QuickCompare({ consoles }: QuickCompareProps) {
  const router = useRouter();
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');

  const handleCompare = () => {
    if (selected1 && selected2) {
      router.push(`/arena/${selected1}-vs-${selected2}`);
    } else if (selected1) {
        router.push(`/arena/${selected1}-vs-select`);
    } else if (selected2) {
        router.push(`/arena/select-vs-${selected2}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-center">
      <div className="space-y-4">
        {/* Device 1 Select */}
        <div className="relative">
          <select
            value={selected1}
            onChange={(e) => setSelected1(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 text-gray-300 font-mono text-xs p-3 appearance-none rounded focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
          >
            <option value="" disabled>Select first device...</option>
            {consoles.map((c) => (
              <option key={`p1-${c.slug}`} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
        </div>

        <div className="flex items-center justify-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            VS
        </div>

        {/* Device 2 Select */}
        <div className="relative">
          <select
            value={selected2}
            onChange={(e) => setSelected2(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 text-gray-300 font-mono text-xs p-3 appearance-none rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
          >
            <option value="" disabled>Select second device...</option>
            {consoles.map((c) => (
              <option key={`p2-${c.slug}`} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!selected1 && !selected2}
        className="w-full bg-primary hover:bg-white text-black font-bold font-tech text-sm py-3 uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        Compare
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
