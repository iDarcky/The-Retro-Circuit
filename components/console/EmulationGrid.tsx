
'use client';

import { type FC } from 'react';
import { EmulationProfile } from '../../lib/types';

interface EmulationGridProps {
    profile?: EmulationProfile | EmulationProfile[] | null | any;
}

const EmulationGrid: FC<EmulationGridProps> = ({ profile: rawProfile }) => {
    // Logic to handle array vs object
    const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;

    // Safety Check: Don't render if no profile exists
    if (!profile) return null;

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

    const allSystems = [
        { name: 'PS1', state: profile.ps1_state },
        { name: 'PS2', state: profile.ps2_state },
        { name: 'PSP', state: profile.psp_state },
        { name: 'PS Vita', state: profile.vita_state },
        { name: 'Dreamcast', state: profile.dreamcast_state },
        { name: 'Saturn', state: profile.saturn_state },
        { name: 'GameCube', state: profile.gamecube_state },
        { name: 'Wii', state: profile.wii_state },
        { name: '3DS', state: profile.x3ds_state },
        { name: 'Switch', state: profile.switch_state },
    ];

    // Filter out systems that are N/A, null, or undefined
    const activeSystems = allSystems.filter(sys => sys.state && sys.state !== 'N/A');

    // If no active systems and no summary, render nothing
    if (activeSystems.length === 0 && !profile.summary_text) return null;

    return (
        <div className="bg-bg-primary border border-border-normal mb-6 relative group overflow-hidden animate-fadeIn">
             
             {/* Header */}
            <div className="bg-black/40 border-b border-border-normal px-4 py-2 flex justify-between items-center">
                <h3 className="font-pixel text-[10px] text-secondary uppercase tracking-widest">EMULATION PERFORMANCE</h3>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-secondary transition-colors"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-secondary transition-colors delay-75"></div>
                </div>
            </div>

            <div className="p-4">
                {activeSystems.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {activeSystems.map((sys) => (
                            <div key={sys.name} className={`border px-3 py-2 flex flex-col items-center justify-center text-center transition-all hover:brightness-110 ${getStatusStyle(sys.state)}`}>
                                <div className="text-[10px] font-mono uppercase opacity-70 mb-1">{sys.name}</div>
                                <div className="font-pixel text-[10px] uppercase tracking-wider">{sys.state}</div>
                            </div>
                        ))}
                    </div>
                )}
                
                {profile.summary_text && (
                    <div className={`pt-4 border-white/5 ${activeSystems.length > 0 ? 'mt-4 border-t' : ''}`}>
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

export default EmulationGrid;
