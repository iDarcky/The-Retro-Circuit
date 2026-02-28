'use client';

import { EmulationProfile } from '../../lib/types';
import { SYSTEM_TIERS } from '../../lib/config/emulation';
import { useMemo } from 'react';

interface EmulationSummaryProps {
    profile?: EmulationProfile | null;
    onClick: () => void;
}

export default function EmulationSummary({ profile, onClick }: EmulationSummaryProps) {

    // Determine the highest playable tier
    const highestTier = useMemo(() => {
        if (!profile) return null;

        // Iterate backwards from highest tier (5) to lowest (1)
        for (let i = SYSTEM_TIERS.length - 1; i >= 0; i--) {
            const tier = SYSTEM_TIERS[i];

            // Check if any system in this tier is playable
            const isPlayable = tier.systems.some(sys => {
                const status = (profile as any)[sys.key];
                return status && (
                    status === 'Playable' ||
                    status === 'Great' ||
                    status === 'Perfect'
                );
            });

            if (isPlayable) {
                return {
                    number: i + 1,
                    title: tier.title,
                    shortLabel: tier.shortLabel
                };
            }
        }
        return null;
    }, [profile]);

    if (!highestTier) {
        return (
            <div className="border border-border-subtle bg-bg-tertiary p-4 flex flex-col gap-1 opacity-50">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">EMULATION SCORE</span>
                <div className="font-pixel text-lg text-gray-500">UNTESTED</div>
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            className="w-full text-left group border border-border-subtle bg-bg-tertiary hover:bg-white/[0.05] hover:border-orange-500/50 transition-colors p-4 flex flex-col gap-1 cursor-pointer"
        >
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-orange-400 transition-colors">
                EMULATION SCORE
            </span>
            <div className="font-pixel text-lg text-text-primary group-hover:text-orange-500 transition-colors flex items-center justify-between">
                <span>{highestTier.shortLabel}</span>
                <span className="text-[10px] font-mono text-gray-500 group-hover:text-orange-400/70 ml-2 mt-1">
                    [ DETAILS ]
                </span>
            </div>
             <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-1 group-hover:text-gray-300">
                {highestTier.title.replace(/TIER \d+: /, '')}
            </div>
        </button>
    );
}
