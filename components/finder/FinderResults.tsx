'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '../ui/Button';
import { getFinderResults, FinderResultConsole } from '../../app/finder/actions';

interface FinderResultsProps {
  onRestart: () => void;
}

export const FinderResults: FC<FinderResultsProps> = ({ onRestart }) => {
  const searchParams = useSearchParams();
  const formFactorPref = searchParams.get('form_factor_pref');
  const targetTier = searchParams.get('target_tier');

  const [results, setResults] = useState<FinderResultConsole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await getFinderResults(formFactorPref, targetTier);
        setResults(data);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [formFactorPref, targetTier]);

  if (loading) {
    return (
        <div className="w-full h-96 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(0,255,157,0.3)]"></div>
            <div className="font-pixel text-secondary text-sm animate-pulse">CALCULATING MATCHES...</div>
        </div>
    );
  }

  if (results.length === 0) {
      return (
        <div className="max-w-4xl mx-auto text-center py-20 px-4">
            <h2 className="text-3xl font-pixel text-red-500 mb-6">NO MATCHES FOUND</h2>
            <p className="font-mono text-gray-400 mb-8">
                It seems no handhelds matched your specific criteria in our database yet.
            </p>
            <Button variant="secondary" onClick={onRestart}>
              TRY AGAIN
            </Button>
        </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 w-full animate-in zoom-in-95 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-pixel text-white mb-4 drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
          Your Matches
        </h2>
        <p className="text-gray-400 font-mono text-lg">
          Based on your preference for <span className="text-secondary font-bold uppercase">{formFactorPref || 'Any'}</span> form factor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {results.map((console) => (
            <div key={console.id} className="bg-bg-secondary/80 border border-secondary/30 rounded-xl overflow-hidden relative group hover:border-secondary transition-all flex flex-col">
              <div className="h-48 bg-black/50 flex items-center justify-center relative p-4">
                {console.image_url ? (
                     <img
                        src={console.image_url}
                        alt={console.name}
                        className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                     />
                ) : (
                    <span className="font-pixel text-4xl text-gray-700">?</span>
                )}
                {/* Match Badge - Placeholder 95% for now as we aren't doing real scoring yet */}
                <div className="absolute top-4 right-4 bg-secondary text-bg-primary font-bold px-2 py-1 text-xs rounded shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                  MATCH
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">
                            {console.manufacturer?.name || 'UNKNOWN'}
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-secondary transition-colors">
                            {console.name}
                        </h3>
                    </div>
                </div>

                <div className="flex gap-2 mb-6 mt-2 flex-wrap">
                   {console.form_factor && (
                       <span className="text-[10px] border border-white/10 bg-white/5 px-2 py-1 rounded text-gray-300 uppercase">
                           {console.form_factor}
                       </span>
                   )}
                   {console.release_year && (
                       <span className="text-[10px] border border-white/10 bg-white/5 px-2 py-1 rounded text-gray-300">
                           {console.release_year}
                       </span>
                   )}
                </div>

                <div className="mt-auto">
                    <Link href={`/consoles/${console.slug}`} className="block w-full">
                        <Button className="w-full text-sm">View Details</Button>
                    </Link>
                </div>
              </div>
            </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="secondary" onClick={onRestart}>
          Start Over
        </Button>
      </div>
    </div>
  );
};
