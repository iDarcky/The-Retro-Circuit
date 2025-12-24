
'use client';

import { useState, type FC } from 'react';
import { EmulationProfile } from '../../lib/types';

interface PlayabilityMatrixProps {
    profile?: EmulationProfile | EmulationProfile[] | null | any;
}

// Map score to numeric value for averaging
const SCORE_MAP: Record<string, number> = {
    'Perfect': 5,
    'Great': 4,
    'Playable': 3,
    'Struggles': 2,
    'Unplayable': 1,
    'N/A': 0
};

// Map numeric average back to text badge
const getAverageBadge = (avg: number) => {
    if (avg >= 4.5) return { label: 'PERFECT', color: 'text-green-400 border-green-500' };
    if (avg >= 3.5) return { label: 'GREAT', color: 'text-blue-400 border-blue-500' };
    if (avg >= 2.5) return { label: 'PLAYABLE', color: 'text-yellow-400 border-yellow-500' };
    if (avg >= 1.5) return { label: 'STRUGGLES', color: 'text-orange-400 border-orange-500' };
    if (avg > 0) return { label: 'UNPLAYABLE', color: 'text-red-400 border-red-500' };
    return { label: 'UNTESTED', color: 'text-gray-500 border-gray-700' };
};

const SYSTEM_TIERS = [
    {
        title: 'TIER 1: CLASSIC 2D',
        systems: [
            { key: 'nes_state', label: 'NES' },
            { key: 'snes_state', label: 'SNES' },
            { key: 'master_system', label: 'Master System' },
            { key: 'genesis_state', label: 'Genesis' },
            { key: 'gb_state', label: 'Game Boy' },
            { key: 'gbc_state', label: 'GB Color' },
            { key: 'gba_state', label: 'GBA' },
        ]
    },
    {
        title: 'TIER 2: EARLY 3D',
        systems: [
            { key: 'ps1_state', label: 'PlayStation' },
            { key: 'n64_state', label: 'N64' },
            { key: 'saturn_state', label: 'Saturn' },
            { key: 'nds_state', label: 'Nintendo DS' },
            { key: 'dreamcast_state', label: 'Dreamcast' }
        ]
    },
    {
        title: 'TIER 3: ADVANCED HANDHELDS',
        systems: [
            { key: 'psp_state', label: 'PSP' },
            { key: 'x3ds_state', label: '3DS' },
            { key: 'vita_state', label: 'PS Vita' },
        ]
    },
    {
        title: 'TIER 4: CLASSIC HOME',
        systems: [
            { key: 'ps2_state', label: 'PS2' },
            { key: 'gamecube_state', label: 'GameCube' },
            { key: 'xbox', label: 'Xbox' },
        ]
    },
    {
        title: 'TIER 5: MODERN & HD',
        systems: [
            { key: 'wii_state', label: 'Wii' },
            { key: 'wii_u', label: 'Wii U' },
            { key: 'ps3_state', label: 'PS3' },
            { key: 'xbox_360', label: 'Xbox 360' },
            { key: 'switch_state', label: 'Switch' },
        ]
    }
];

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
        if (!status) return 'bg-gray-800 text-gray-500 border-gray-700';
        
        const s = status.toLowerCase();
        if (s.includes('perfect')) return 'bg-green-500/20 text-green-400 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
        if (s.includes('great')) return 'bg-blue-500/20 text-blue-400 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
        if (s.includes('playable')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
        if (s.includes('struggles')) return 'bg-orange-500/20 text-orange-400 border-orange-500';
        if (s.includes('unplayable')) return 'bg-red-500/20 text-red-400 border-red-500';
        return 'bg-gray-800 text-gray-500 border-gray-700';
    };

    // Filter tiers that have at least one system with data (or N/A)
    // Actually, we want to show all tiers usually, or at least calculate scores.

    return (
        <div className="bg-bg-primary border border-border-normal mb-6 relative overflow-hidden animate-fadeIn">
             
             {/* Header */}
            <div className="bg-black/40 border-b border-border-normal px-4 py-3 flex justify-between items-center">
                <h3 className="font-pixel text-sm text-secondary uppercase tracking-widest">PLAYABILITY MATRIX</h3>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                </div>
            </div>

            <div className="p-4 space-y-2">
                {SYSTEM_TIERS.map((tier) => {
                    // Calculate Average for this Tier
                    let totalScore = 0;
                    let count = 0;
                    let hasAnyData = false;

                    tier.systems.forEach(sys => {
                        const status = (profile as any)[sys.key];
                        if (status) {
                            hasAnyData = true;
                            const score = SCORE_MAP[status] || 0;
                            if (score > 0) { // Ignore N/A (0) for average
                                totalScore += score;
                                count++;
                            }
                        }
                    });

                    // If absolutely no data for this tier (all undefined), maybe skip it?
                    // Or treat as Untested.

                    const average = count > 0 ? totalScore / count : 0;
                    const badge = getAverageBadge(average);
                    const isOpen = openTiers[tier.title];

                    return (
                        <div key={tier.title} className="border border-white/10 bg-black/20">
                            <button
                                onClick={() => toggleTier(tier.title)}
                                className="w-full flex justify-between items-center px-4 py-3 hover:bg-white/5 transition-colors"
                            >
                                <span className="font-mono text-xs text-gray-300 uppercase tracking-wider">{tier.title}</span>
                                <div className={`px-2 py-0.5 border text-[10px] font-pixel ${hasAnyData ? badge.color : 'text-gray-600 border-gray-800'}`}>
                                    {hasAnyData ? badge.label : 'NO DATA'}
                                </div>
                            </button>

                            {isOpen && (
                                <div className="p-4 border-t border-white/10 bg-black/40 animate-fadeIn">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {tier.systems.map((sys) => {
                                            const status = (profile as any)[sys.key] || 'N/A';
                                            // Only render if it exists or we want to show N/A slots
                                            // User said "show every console", so we show N/A too.
                                            return (
                                                <div key={sys.key} className={`border px-3 py-2 flex flex-col items-center justify-center text-center transition-all hover:brightness-110 ${getStatusStyle(status)}`}>
                                                    <div className="text-[9px] font-mono uppercase opacity-70 mb-1">{sys.label}</div>
                                                    <div className="font-pixel text-[9px] uppercase tracking-wider">{status}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {profile.summary_text && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="font-mono text-xs text-gray-400 leading-relaxed">
                            <span className="text-secondary mr-2">» ANALYST NOTE:</span>
                            {profile.summary_text}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayabilityMatrix;
