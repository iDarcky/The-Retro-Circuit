
'use client';

import { useState, type FC } from 'react';
import { EmulationProfile } from '../../lib/types';
import { SCORE_MAP, getAverageBadge, SYSTEM_TIERS } from '../../lib/config/emulation';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PlayabilityMatrixProps {
    profile?: EmulationProfile | EmulationProfile[] | null | any;
}

const PlayabilityMatrix: FC<PlayabilityMatrixProps> = ({ profile: rawProfile }) => {
    // Logic to handle array vs object
    const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
    const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({});

    // Safety Check: Don't render if no profile exists
    if (!profile) return null;

    const toggleTier = (title: string) => {
        setOpenTiers(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const getStatusStyle = (status?: string) => {
        if (!status) return 'text-gray-500 opacity-50';

        const s = status.toLowerCase();
        if (s.includes('perfect')) return 'text-green-400 font-bold';
        if (s.includes('great')) return 'text-blue-400 font-bold';
        if (s.includes('playable')) return 'text-yellow-400 font-bold';
        if (s.includes('struggles')) return 'text-orange-400 font-bold';
        if (s.includes('unplayable')) return 'text-red-400 font-bold';
        return 'text-gray-500 font-bold';
    };

    return (
        <div className="w-full animate-fadeIn py-6 border-b border-border-normal">

             {/* Header */}
            <h3 className="font-sans text-sm font-bold text-secondary uppercase tracking-widest mb-6 border-b border-border-normal pb-2">
                PLAYABILITY MATRIX
            </h3>

            <div className="space-y-4">
                {SYSTEM_TIERS.map((tier) => {
                    // Calculate Average for this Tier
                    let totalScore = 0;
                    let count = 0;
                    let activeSystems: { key: string, label: string, status: string }[] = [];

                    tier.systems.forEach(sys => {
                        const status = (profile as any)[sys.key];
                        if (status && status !== 'N/A') {
                            activeSystems.push({ ...sys, status });
                            const score = SCORE_MAP[status] || 0;
                            if (score > 0) { // Ignore N/A (0) for average (redundant check now but safe)
                                totalScore += score;
                                count++;
                            }
                        }
                    });

                    // If no active systems, hide the entire Tier
                    if (activeSystems.length === 0) return null;

                    const average = count > 0 ? totalScore / count : 0;
                    const badge = getAverageBadge(average);
                    const isOpen = openTiers[tier.title];

                    return (
                        <div key={tier.title} className="border-b border-white/5 last:border-0 pb-4">
                            {/* Tier Header (Clickable) */}
                            <button
                                onClick={() => toggleTier(tier.title)}
                                className="w-full flex justify-between items-center py-2 hover:text-secondary transition-colors group text-left"
                            >
                                <span className="font-mono text-xs font-bold text-gray-300 uppercase tracking-wider group-hover:text-secondary">
                                    {tier.title}
                                </span>
                                <div className="flex items-center gap-4">
                                    <div className={`text-[10px] font-mono font-bold uppercase ${badge.color.replace('bg-', 'text-').replace('/20', '')}`}>
                                        {badge.label}
                                    </div>
                                    <div className="text-gray-500 group-hover:text-secondary transition-colors">
                                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>
                            </button>

                            {/* Tier Content (Systems List) */}
                            {isOpen && (
                                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 animate-fadeIn pl-2 border-l border-white/5 ml-1">
                                    {activeSystems.map((sys) => (
                                        <div key={sys.key} className="flex justify-between items-center text-[10px] font-mono py-1 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 transition-colors">
                                            <span className="text-gray-400 uppercase truncate pr-2">{sys.label}</span>
                                            <span className={`uppercase tracking-wide text-right ${getStatusStyle(sys.status)}`}>
                                                {sys.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {profile.summary_text && (
                    <div className="mt-6 pt-4 border-t border-border-normal">
                        <p className="font-mono text-xs text-gray-400 leading-relaxed italic">
                            <span className="text-secondary font-bold mr-2 not-italic">» ANALYST NOTE:</span>
                            {profile.summary_text}
                        </p>
                    </div>
                )}

                {/* Source Verification Footer */}
                {(profile.source || profile.last_verified) && (
                     <div className="mt-2 pt-2 flex flex-wrap gap-4 text-[9px] font-mono text-gray-600 uppercase">
                        {profile.source && <div>SRC: <span className="text-gray-400">{profile.source}</span></div>}
                        {profile.last_verified && <div>VER: <span className="text-gray-400">{new Date(profile.last_verified).toLocaleDateString()}</span></div>}
                     </div>
                )}
            </div>
        </div>
    );
};

export default PlayabilityMatrix;
