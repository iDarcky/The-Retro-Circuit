'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import SwissButton from '@/components/console/swiss/SwissButton';
import { getFinderResults, FinderResultConsole } from '../../app/finder/actions';

interface FinderResultsProps {
  onRestart: () => void;
}

export const FinderResults: FC<FinderResultsProps> = ({ onRestart }) => {
  const searchParams = useSearchParams();
  const isGift = searchParams.get('tone_mode') === 'gift';

  const [results, setResults] = useState<FinderResultConsole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const data = await getFinderResults(params);
        setResults(data);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-none animate-spin mb-6"></div>
        <div className="font-pixel text-white text-xs animate-pulse tracking-widest">CALCULATING MATCHES...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <h2 className="text-3xl font-pixel text-red-500 mb-6">NO MATCHES FOUND</h2>
        <p className="font-mono text-zinc-500 mb-8">
          It seems no handhelds matched your specific criteria in our database yet.
        </p>
        <SwissButton variant="secondary" onClick={onRestart}>
          TRY AGAIN
        </SwissButton>
      </div>
    );
  }

  // Identify the Winner and Alternatives
  const winner = results.find(r => r.match_label === 'Best Match') || results[0];
  const alternatives = results.filter(r => r.id !== winner.id);

  const relaxed = winner._relaxed_features || [];
  const relaxedLabels: Record<string, string> = {
    form_factor: "your preferred form factor",
    features: "one or more of your must-have features",
  };


  return (
    <div className="max-w-6xl mx-auto px-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">

      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-pixel text-white mb-4">
          {isGift ? 'GIFT PICKS_' : 'YOUR MATCHES_'}
        </h2>
        <p className="text-zinc-500 font-mono text-sm md:text-base max-w-2xl mx-auto">
          {isGift
            ? "Easy setup, reliable, and highly rated."
            : "Based on your choices, we've selected the best device for you, plus a few strong alternatives."
          }
        </p>
      </div>

      {relaxed.length > 0 && (
        <div className="mb-12 p-4 border border-orange-500/30 bg-orange-500/[0.04] font-mono text-sm text-orange-300 max-w-3xl mx-auto">
          <span className="font-pixel text-xs text-orange-400 tracking-widest uppercase mr-2">[ HEADS UP ]</span>
          We couldn't find devices matching {relaxed.map(r => relaxedLabels[r] || r).join(' and ')} — showing the closest matches instead.
        </div>
      )}

      {/* PRIMARY WINNER CARD */}
      <div className="mb-16 border border-white/10 bg-white/[0.02] p-6 md:p-12 relative group">
        <div className="absolute top-0 left-0 bg-white text-black font-pixel text-xs px-4 py-2 uppercase tracking-widest z-10">
          {winner.match_label || 'WINNER'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative aspect-video md:aspect-square flex items-center justify-center bg-black/20 border border-white/5 p-8">
            {winner.image_url ? (
              <Image
                src={winner.image_url}
                alt={winner.name}
                width={600}
                height={400}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
              />
            ) : (
              <span className="font-pixel text-6xl text-zinc-800">?</span>
            )}
          </div>

          {/* Content Side */}
          <div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
              {winner.manufacturer?.name || 'UNKNOWN'}
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-none">
              {winner.name}
            </h3>

            <div className="mb-8 p-4 bg-white/[0.03] border-l-2 border-white text-zinc-300 font-mono text-sm italic">
              "{winner.match_reason}"

            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 font-mono text-xs text-zinc-400">
              <div className="border border-white/10 p-3">
                <span className="block text-zinc-600 mb-1">PRICE</span>
                <span className="text-white text-lg">${winner.price || '???'}</span>
              </div>
              <div className="border border-white/10 p-3">
                <span className="block text-zinc-600 mb-1">FORM FACTOR</span>
                <span className="text-white uppercase">{winner.form_factor || 'N/A'}</span>
              </div>
              <div className="border border-white/10 p-3">
                <span className="block text-zinc-600 mb-1">RELEASE</span>
                <span className="text-white">{winner.release_date ? winner.release_date.substring(0, 4) : 'N/A'}</span>
              </div>
              <div className="border border-white/10 p-3">
                <span className="block text-zinc-600 mb-1">SCORE</span>
                <span className="text-white">{Math.round(winner._score)}% MATCH</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/consoles/${winner.slug}`} className="flex-1">
                <SwissButton variant="orange" className="w-full py-4 text-sm font-pixel">
                  VIEW DETAILS
                </SwissButton>
              </Link>
              <Link href={`/consoles/${winner.slug}#buy`} className="flex-1">
                <SwissButton variant="primary" className="w-full py-4 text-sm font-pixel">
                  BUY NOW
                </SwissButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ALTERNATIVES GRID */}
      {alternatives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {alternatives.map((consoleItem) => (
            <div key={consoleItem.id} className="border border-white/10 bg-white/[0.02] p-6 flex flex-col relative group hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 bg-white/10 text-zinc-300 font-mono text-[10px] px-3 py-1 uppercase tracking-wider">
                {consoleItem.match_label || 'ALTERNATIVE'}
              </div>

              <div className="h-48 bg-black/20 flex items-center justify-center mb-6 p-4 border border-white/5">
                {consoleItem.image_url ? (
                  <Image
                    src={consoleItem.image_url}
                    alt={consoleItem.name}
                    width={300}
                    height={200}
                    className="max-h-full w-auto object-contain drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="font-pixel text-4xl text-zinc-800">?</span>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                  {consoleItem.manufacturer?.name}
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                  {consoleItem.name}
                </h4>

                <p className="text-xs text-zinc-400 font-mono italic mb-6 min-h-[3em]">
                  {consoleItem.match_reason}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6 font-mono text-[10px] text-zinc-500">
                  <div className="bg-white/[0.02] p-2 text-center border border-white/5">
                    <span className="block text-white mb-0.5">${consoleItem.price}</span>
                    PRICE
                  </div>
                  <div className="bg-white/[0.02] p-2 text-center border border-white/5">
                    <span className="block text-white mb-0.5">{consoleItem.form_factor}</span>
                    FORM
                  </div>
                  <div className="bg-white/[0.02] p-2 text-center border border-white/5">
                    <span className="block text-white mb-0.5">{Math.round(consoleItem._score)}%</span>
                    MATCH
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <Link href={`/consoles/${consoleItem.slug}`} className="w-full">
                    <SwissButton variant="orange" className="w-full text-xs">
                      VIEW DETAILS
                    </SwissButton>
                  </Link>

                  {/* COMPARE BUTTON */}
                  <Link href={`/arena/${winner.slug}-vs-${consoleItem.slug}`} className="w-full">
                    <button className="w-full py-3 border border-white/20 text-zinc-400 text-xs font-mono uppercase hover:bg-white hover:text-black hover:border-white transition-all">
                      COMPARE VS WINNER
                    </button>
                  </Link>

                  {/* BUY BUTTON */}
                  <Link href={`/consoles/${consoleItem.slug}#buy`} className="w-full">
                    <button className="w-full py-3 bg-white text-black text-xs font-mono font-bold uppercase hover:bg-zinc-200 transition-all">
                      BUY NOW
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center border-t border-white/10 pt-12">
        <button onClick={onRestart} className="flex items-center text-zinc-500 hover:text-white font-mono text-sm tracking-widest transition-colors py-4 px-6 uppercase">
          <span className="mr-2 text-lg">↺</span> RESTART QUIZ
        </button>
      </div>
    </div>
  );
};
