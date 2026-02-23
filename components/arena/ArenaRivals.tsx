'use client';

import { useMemo } from 'react';
import Link from 'next/link';

interface ArenaRivalsProps {
    currentA?: string;
    currentB?: string;
    allConsoles: { name: string, slug: string }[];
}

export const ArenaRivals = ({ currentA, currentB, allConsoles }: ArenaRivalsProps) => {

    // Logic: Suggest other popular match-ups based on the current selection.
    // Since we don't have rich metadata (price, generation) in `allConsoles` (just name/slug),
    // we will rely on a simple randomized shuffle excluding current ones,
    // OR ideally we would filter by manufacturer if we had that data.
    // For now, let's just pick 3 random "Rivals" that aren't the current ones.

    const rivals = useMemo(() => {
        if (!allConsoles.length) return [];

        const excluded = [currentA, currentB].filter(Boolean);
        const candidates = allConsoles.filter(c => !excluded.includes(c.slug));

        // Shuffle
        const shuffled = [...candidates].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }, [allConsoles, currentA, currentB]);

    if (!rivals.length) return null;

    return (
        <div className="w-full mt-16 mb-8 border-t border-white/10 pt-8 animate-fadeIn">
            <h3 className="font-pixel text-center text-white/50 mb-6 text-sm uppercase tracking-widest">
                Potential Rivals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rivals.map((rival) => (
                    <Link
                        key={rival.slug}
                        href={`/arena?p1=${currentA || rival.slug}&p2=${rival.slug}`} // Compare Rival vs Current A (or Rival vs Rival if empty)
                        className="group border border-white/5 bg-white/5 hover:bg-white/10 p-4 flex items-center justify-between transition-all hover:border-white/20"
                    >
                        <div className="flex flex-col">
                            <span className="font-mono text-xs text-blue-400 group-hover:text-blue-300 transition-colors uppercase">CHALLENGER</span>
                            <span className="font-pixel text-sm text-white truncate max-w-[150px]">{rival.name}</span>
                        </div>
                        <div className="text-white/20 group-hover:text-white transition-colors">
                            <span className="text-xs font-mono border border-white/20 px-2 py-1 rounded-sm uppercase">VS</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
