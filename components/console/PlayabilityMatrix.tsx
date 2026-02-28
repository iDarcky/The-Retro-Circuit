'use client';

import { useState, type FC, useEffect } from 'react';
import { EmulationProfile } from '../../lib/types';
import { SYSTEM_TIERS } from '../../lib/config/emulation';

interface PlayabilityMatrixProps {
    profile?: EmulationProfile | EmulationProfile[] | null | any;
}

const PlayabilityMatrix: FC<PlayabilityMatrixProps> = ({ profile: rawProfile }) => {
    const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
    // Default all open for modal view
    const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({});

    // Open all tiers by default when mounting (for modal)
    useEffect(() => {
        const allOpen: Record<string, boolean> = {};
        SYSTEM_TIERS.forEach(t => allOpen[t.title] = true);
        setOpenTiers(allOpen);
    }, []);

    if (!profile) return null;

    const toggleTier = (title: string) => {
        setOpenTiers(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const getStatusStyle = (status?: string) => {
        if (!status) return 'border-gray-800 text-gray-500';
        const s = status.toLowerCase();
        // Swiss Style: No shadows, just flat colors/borders
        if (s.includes('perfect')) return 'bg-emerald-950/30 text-emerald-400 border-emerald-500/50';
        if (s.includes('great')) return 'bg-blue-950/30 text-blue-400 border-blue-500/50';
        if (s.includes('playable')) return 'bg-yellow-950/30 text-yellow-400 border-yellow-500/50';
        if (s.includes('struggles')) return 'bg-orange-950/30 text-orange-400 border-orange-500/50';
        if (s.includes('unplayable')) return 'bg-red-950/30 text-red-400 border-red-500/50';
        return 'border-gray-800 text-gray-500';
    };

    return (
        <div className="bg-bg-primary">
            <div className="space-y-4">
                {SYSTEM_TIERS.map((tier) => {
                    let activeSystems: { key: string, label: string, status: string }[] = [];
                    tier.systems.forEach(sys => {
                        const status = (profile as any)[sys.key];
                        if (status && status !== 'N/A') {
                            activeSystems.push({ ...sys, status });
                        }
                    });

                    if (activeSystems.length === 0) return null;
                    const isOpen = openTiers[tier.title];

                    return (
                        <div key={tier.title} className="border border-border-subtle bg-bg-tertiary">
                            <button
                                onClick={() => toggleTier(tier.title)}
                                className="w-full flex justify-between items-center px-4 py-3 hover:bg-bg-tertiary transition-colors group"
                            >
                                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest group-hover:text-text-primary transition-colors">{tier.title}</span>
                                <span className="font-mono text-[10px] text-gray-600">{isOpen ? '[-]' : '[+]'}</span>
                            </button>

                            {isOpen && (
                                <div className="p-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {activeSystems.map((sys) => {
                                        const style = getStatusStyle(sys.status);
                                        return (
                                            <div key={sys.key} className={`border px-3 py-2 flex flex-col justify-center text-center transition-colors ${style}`}>
                                                <div className="text-[9px] font-mono uppercase opacity-70 mb-1 truncate w-full">{sys.label}</div>
                                                <div className="font-pixel text-[8px] uppercase tracking-wide">{sys.status}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {profile.summary_text && (
                    <div className="mt-6 pt-4 border-t border-border-subtle">
                        <p className="font-mono text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                            <span className="text-orange-500 mr-2">» ANALYST NOTE:</span>
                            {profile.summary_text}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayabilityMatrix;
