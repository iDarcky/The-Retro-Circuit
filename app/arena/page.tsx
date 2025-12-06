'use client';

import { useState, useEffect, Suspense, type ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { compareConsoles } from '../../lib/compare';
import { fetchConsoleList } from '../../lib/api';
import { ComparisonResult } from '../../lib/types';
import Button from '../../components/ui/Button';

const StatBar = ({ value, color, align }: { value: number, color: string, align: 'left' | 'right' }) => {
    const safeValue = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
    
    return (
        <div className={`w-full h-3 bg-gray-900 border border-gray-700 mt-2 flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div 
                className={`h-full transition-all duration-1000 ease-out ${color} ${align === 'right' ? 'origin-right' : 'origin-left'}`} 
                style={{ width: `${safeValue}%` }}
            ></div>
        </div>
    );
};

function VsModeContent() {
  const searchParams = useSearchParams();
  const [consoleA, setConsoleA] = useState('');
  const [consoleB, setConsoleB] = useState('');
  const [consoleList, setConsoleList] = useState<{name: string, slug: string}[]>([]);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);

  useEffect(() => {
    const loadList = async () => {
        const list = await fetchConsoleList();
        setConsoleList(list);
    };
    loadList();
  }, []);

  // Handle URL Preselect
  useEffect(() => {
      const preselect = searchParams?.get('preselect');
      if (preselect) {
          setConsoleA(preselect);
      }
  }, [searchParams]);

  const handleCompare = async () => {
    if (!consoleA || !consoleB) return;
    setLoading(true);
    setResult(null);
    setWinnerName(null);
    
    const data = await compareConsoles(consoleA, consoleB);
    setResult(data);
    
    if (data) {
        const aWins = data.points.filter(p => p.winner === 'A').length;
        const bWins = data.points.filter(p => p.winner === 'B').length;
        if (aWins > bWins) setWinnerName(data.consoleA);
        else if (bWins > aWins) setWinnerName(data.consoleB);
        else setWinnerName("DRAW");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-pixel text-retro-neon mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          VS MODE
        </h2>
        <p className="font-mono text-gray-400">SELECT YOUR FIGHTERS</p>
      </div>

      {/* SELECTION AREA */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center mb-12 relative z-10">
        
        {/* PLAYER 1 CARD */}
        <div className="flex-1 relative group">
          <div className="absolute -inset-1 bg-retro-neon/20 blur-sm group-hover:bg-retro-neon/40 transition-colors"></div>
          <div className="relative bg-retro-dark border-4 border-retro-neon h-full flex flex-col p-6 skew-x-[-2deg]">
              <label className="block font-pixel text-xl text-retro-neon mb-4 skew-x-[2deg] text-center">PLAYER 1</label>
              
              {/* Image Preview Area */}
              <div className="flex-1 bg-black/50 border border-retro-grid mb-4 min-h-[200px] flex items-center justify-center relative overflow-hidden">
                   {result?.consoleAImage ? (
                       <img src={result.consoleAImage} className="w-full h-full object-contain p-4" />
                   ) : (
                       <div className="font-pixel text-6xl text-retro-grid opacity-20">?</div>
                   )}
              </div>

              <select
                value={consoleA}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setConsoleA(e.target.value)}
                className="w-full bg-black border border-retro-grid text-white p-3 font-mono focus:border-retro-neon focus:outline-none appearance-none cursor-pointer uppercase skew-x-[2deg] text-center hover:bg-white/10"
              >
                <option value="">SELECT SYSTEM...</option>
                {consoleList.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
          </div>
        </div>

        {/* VS BADGE */}
        <div className="flex items-center justify-center relative z-20">
             <div className="font-pixel text-6xl md:text-8xl text-white drop-shadow-[4px_4px_0_rgba(255,0,255,1)] animate-pulse italic">VS</div>
        </div>

        {/* PLAYER 2 CARD */}
        <div className="flex-1 relative group">
          <div className="absolute -inset-1 bg-retro-pink/20 blur-sm group-hover:bg-retro-pink/40 transition-colors"></div>
          <div className="relative bg-retro-dark border-4 border-retro-pink h-full flex flex-col p-6 skew-x-[2deg]">
              <label className="block font-pixel text-xl text-retro-pink mb-4 skew-x-[-2deg] text-center">PLAYER 2</label>
              
              {/* Image Preview Area */}
              <div className="flex-1 bg-black/50 border border-retro-grid mb-4 min-h-[200px] flex items-center justify-center relative overflow-hidden">
                   {result?.consoleBImage ? (
                       <img src={result.consoleBImage} className="w-full h-full object-contain p-4" />
                   ) : (
                       <div className="font-pixel text-6xl text-retro-grid opacity-20">?</div>
                   )}
              </div>

              <select
                value={consoleB}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setConsoleB(e.target.value)}
                className="w-full bg-black border border-retro-grid text-white p-3 font-mono focus:border-retro-pink focus:outline-none appearance-none cursor-pointer uppercase skew-x-[-2deg] text-center hover:bg-white/10"
              >
                <option value="">SELECT SYSTEM...</option>
                {consoleList.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
           <Button onClick={handleCompare} isLoading={loading} disabled={!consoleA || !consoleB} className="text-2xl px-20 py-6 border-4">
            FIGHT!
          </Button>
      </div>

      {loading && (
        <div className="text-center my-12">
             <div className="font-pixel text-retro-neon animate-pulse text-2xl mb-4">CALCULATING PROBABILITIES...</div>
             <div className="w-64 h-4 bg-gray-800 mx-auto rounded overflow-hidden">
                 <div className="h-full bg-retro-neon animate-[width_1s_ease-in-out_infinite] w-full origin-left"></div>
             </div>
        </div>
      )}

      {/* RESULTS TABLE */}
      {result && !loading && (
        <div className="bg-black/80 border-4 border-retro-grid relative overflow-hidden animate-[slideDown_0.3s_ease-out]">
          
          <div className="p-8 text-center border-b border-retro-grid/50 bg-gradient-to-r from-retro-dark via-retro-grid/20 to-retro-dark">
             <h3 className="font-pixel text-xl md:text-3xl text-white mb-2 uppercase">
                 Battle Report
             </h3>
             {winnerName && (
                 <div className="font-mono text-2xl text-retro-blue animate-pulse mt-4 border-2 border-retro-blue inline-block px-4 py-2">
                     WINNER: {winnerName}
                 </div>
             )}
          </div>
          
          <div className="flex flex-col relative z-10">
            {result.points.map((point, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center border-b border-retro-grid/30 hover:bg-white/5 transition-colors">
                
                {/* Left Side (Player 1) */}
                <div className={`md:col-span-5 text-left md:text-right font-mono pr-4 border-r-0 md:border-r-2 ${
                    point.winner === 'A' 
                    ? 'border-retro-neon text-retro-neon font-bold drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]' 
                    : 'border-transparent text-gray-400'
                }`}>
                    <div className="text-sm md:text-lg mb-1">{point.consoleAValue}</div>
                    {point.aScore !== undefined && point.aScore > 0 && (
                        <StatBar value={point.aScore} color="bg-retro-neon" align="right" />
                    )}
                </div>
                
                {/* Center Label */}
                <div className="md:col-span-2 flex flex-col items-center justify-center order-first md:order-none mb-2 md:mb-0">
                    <span className="bg-retro-grid/40 border border-retro-grid px-3 py-1 rounded text-xs font-pixel text-white uppercase tracking-wider w-full text-center">
                        {point.feature}
                    </span>
                </div>
                
                {/* Right Side (Player 2) */}
                <div className={`md:col-span-5 text-left font-mono pl-4 border-l-0 md:border-l-2 ${
                    point.winner === 'B' 
                    ? 'border-retro-pink text-retro-pink font-bold drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]' 
                    : 'border-transparent text-gray-400'
                }`}>
                    <div className="text-sm md:text-lg mb-1">{point.consoleBValue}</div>
                     {point.bScore !== undefined && point.bScore > 0 && (
                        <StatBar value={point.bScore} color="bg-retro-pink" align="left" />
                    )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VsModePage() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-mono text-retro-neon">LOADING ARENA MODULES...</div>}>
            <VsModeContent />
        </Suspense>
    );
}