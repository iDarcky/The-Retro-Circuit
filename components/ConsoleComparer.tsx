
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { compareConsoles, fetchConsoleList } from '../services/geminiService';
import { ComparisonResult } from '../types';
import Button from './Button';

const ConsoleComparer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [consoleA, setConsoleA] = useState('');
  const [consoleB, setConsoleB] = useState('');
  const [consoleList, setConsoleList] = useState<{name: string, slug: string}[]>([]);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadList = async () => {
        const list = await fetchConsoleList();
        setConsoleList(list);
    };
    loadList();
  }, []);

  // Handle URL Preselect (coming from ConsoleSpecs page)
  useEffect(() => {
      const preselect = searchParams.get('preselect');
      if (preselect) {
          setConsoleA(preselect);
      }
  }, [searchParams]);

  const handleCompare = async () => {
    if (!consoleA || !consoleB) return;
    setLoading(true);
    const data = await compareConsoles(consoleA, consoleB);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-pixel text-retro-blue mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          VS. MODE
        </h2>
        <p className="font-mono text-gray-400">Select two challengers to analyze specs.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end justify-center mb-12 bg-retro-grid/20 p-6 rounded-lg border border-retro-grid">
        <div className="w-full">
          <label className="block font-pixel text-xs text-retro-neon mb-2">CHALLENGER 1</label>
          <select
            value={consoleA}
            onChange={(e) => setConsoleA(e.target.value)}
            className="w-full bg-retro-dark border-2 border-retro-grid text-retro-blue p-3 font-mono focus:border-retro-neon focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,157,0.3)] appearance-none cursor-pointer"
          >
            <option value="">SELECT SYSTEM...</option>
            {consoleList.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="pb-4 text-retro-pink font-pixel text-2xl">VS</div>
        <div className="w-full">
          <label className="block font-pixel text-xs text-retro-pink mb-2">CHALLENGER 2</label>
          <select
            value={consoleB}
            onChange={(e) => setConsoleB(e.target.value)}
            className="w-full bg-retro-dark border-2 border-retro-grid text-retro-blue p-3 font-mono focus:border-retro-pink focus:outline-none focus:shadow-[0_0_15px_rgba(255,0,255,0.3)] appearance-none cursor-pointer"
          >
            <option value="">SELECT SYSTEM...</option>
            {consoleList.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto">
          <Button onClick={handleCompare} isLoading={loading} disabled={!consoleA || !consoleB}>
            FIGHT!
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center font-pixel text-retro-neon animate-pulse my-12">
          ANALYZING HARDWARE SPECS...
        </div>
      )}

      {result && (
        <div className="border-2 border-retro-blue bg-retro-dark relative overflow-hidden">
          <div className="bg-retro-blue/10 p-6 border-b border-retro-blue">
            <h3 className="font-pixel text-xl text-center text-white mb-4">
              {result.consoleA} vs {result.consoleB}
            </h3>
            <p className="font-mono text-center text-retro-blue italic max-w-2xl mx-auto">
              "{result.summary}"
            </p>
          </div>
          
          <div className="divide-y divide-retro-grid">
            {result.points.map((point, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-retro-grid/20 transition-colors">
                <div className={`font-mono text-right text-sm ${point.winner === 'A' ? 'text-retro-neon font-bold' : 'text-gray-400'}`}>
                  {point.consoleAValue}
                  {point.winner === 'A' && <span className="ml-2 text-xs text-retro-neon">◀ WIN</span>}
                </div>
                
                <div className="text-center">
                  <span className="inline-block px-2 py-1 bg-retro-grid/50 rounded text-xs font-mono text-white uppercase">
                    {point.feature}
                  </span>
                </div>
                
                <div className={`font-mono text-left text-sm ${point.winner === 'B' ? 'text-retro-pink font-bold' : 'text-gray-400'}`}>
                  {point.winner === 'B' && <span className="mr-2 text-xs text-retro-pink">WIN ▶</span>}
                  {point.consoleBValue}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleComparer;
