
'use client';

import { useState, useEffect, type FC } from 'react';
import { supabase } from '../../lib/supabase/singleton';
import { EmulationProfile } from '../../lib/types';
import Button from '../ui/Button';

interface EmulationFormProps {
    variantId: string;
    onSave?: () => void;
}

const SYSTEM_GROUPS = {
    '8/16-Bit': [
        { key: 'nes_state', label: 'NES' },
        { key: 'snes_state', label: 'SNES' },
        { key: 'genesis_state', label: 'Genesis/Mega Drive' },
        { key: 'gb_state', label: 'Game Boy' },
        { key: 'gbc_state', label: 'Game Boy Color' },
        { key: 'gba_state', label: 'Game Boy Advance' },
    ],
    '32/64-Bit': [
        { key: 'n64_state', label: 'Nintendo 64' },
        { key: 'nds_state', label: 'Nintendo DS' },
        { key: 'ps1_state', label: 'PlayStation 1' },
        { key: 'saturn_state', label: 'Saturn' },
        { key: 'dreamcast_state', label: 'Dreamcast' },
    ],
    'Modern & Handheld': [
        { key: 'ps2_state', label: 'PlayStation 2' },
        { key: 'psp_state', label: 'PSP' },
        { key: 'gamecube_state', label: 'GameCube' },
        { key: 'wii_state', label: 'Wii' },
        { key: 'x3ds_state', label: 'Nintendo 3DS' },
        { key: 'vita_state', label: 'PS Vita' },
        { key: 'switch_state', label: 'Switch' },
    ]
};

const RATINGS = ['N/A', 'Unplayable', 'Struggles', 'Playable', 'Great', 'Perfect'];

const getColorForRating = (rating?: string) => {
    switch(rating) {
        case 'Perfect': return 'text-green-400 font-bold';
        case 'Great': return 'text-blue-400 font-bold';
        case 'Playable': return 'text-yellow-400';
        case 'Struggles': return 'text-orange-400';
        case 'Unplayable': return 'text-retro-pink';
        default: return 'text-gray-500';
    }
};

export const EmulationForm: FC<EmulationFormProps> = ({ variantId, onSave }) => {
    const [profile, setProfile] = useState<Partial<EmulationProfile>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data } = await supabase.from('emulation_profiles').select('*').eq('variant_id', variantId).single();
            if (data) {
                if (data.last_verified) {
                    data.last_verified = new Date(data.last_verified).toISOString().split('T')[0];
                }
                setProfile(data);
            } else {
                setProfile({ variant_id: variantId, last_verified: new Date().toISOString().split('T')[0] });
            }
            setLoading(false);
        };
        if (variantId) fetchProfile();
    }, [variantId]);

    const handleChange = (key: string, value: string) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        const payload = { ...profile, variant_id: variantId };
        if (!payload.id) delete (payload as any).id;
        const { error } = await supabase.from('emulation_profiles').upsert(payload, { onConflict: 'variant_id' });
        if (error) {
            setMessage("ERROR: " + error.message);
        } else {
            setMessage("PROFILE SAVED.");
            if (onSave) onSave();
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-center font-mono text-retro-neon animate-pulse">LOADING PROFILE...</div>;

    return (
        <div className="bg-black/80 border border-retro-grid p-6 animate-fadeIn">
            {message && <div className={`mb-4 p-2 text-xs font-mono border ${message.includes('ERROR') ? 'border-retro-pink text-retro-pink' : 'border-retro-neon text-retro-neon'}`}>{message}</div>}

            {Object.entries(SYSTEM_GROUPS).map(([group, systems]) => (
                <div key={group} className="mb-8">
                    <h4 className="font-pixel text-retro-blue text-sm mb-4 border-b border-retro-grid/50 pb-2">{group}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {systems.map((sys) => {
                            const currentValue = (profile as any)[sys.key] || 'N/A';
                            return (
                                <div key={sys.key}>
                                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">{sys.label}</label>
                                    <select
                                        className={`w-full bg-black border border-gray-700 p-2 text-xs font-mono outline-none focus:border-retro-neon ${getColorForRating(currentValue)}`}
                                        value={currentValue}
                                        onChange={(e) => handleChange(sys.key, e.target.value)}
                                    >
                                        {RATINGS.map(r => <option key={r} value={r} className="text-gray-300">{r}</option>)}
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className="mb-6">
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">ANALYST SUMMARY / NOTES</label>
                <textarea
                    className="w-full bg-black border border-gray-700 p-3 text-xs font-mono text-white outline-none focus:border-retro-neon min-h-[100px]"
                    placeholder="Enter performance notes..."
                    value={profile.summary_text || ''}
                    onChange={(e) => handleChange('summary_text', e.target.value)}
                />
            </div>
            
            {/* ---- VERIFICATION SECTION ---- */}
            <div className="border-t border-retro-grid/50 pt-6 mt-6">
                 <h4 className="font-pixel text-retro-neon text-sm mb-4">Verification</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                         <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Data Source / Reviewer</label>
                         <input
                            type="text"
                            className="w-full bg-black border border-gray-700 p-2 text-xs font-mono text-white outline-none focus:border-retro-neon"
                            placeholder="e.g., Retro Dodo Review, Self-tested"
                            value={profile.source || ''}
                            onChange={(e) => handleChange('source', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Last Verified Date</label>
                        <input
                            type="date"
                            className="w-full bg-black border border-gray-700 p-2 text-xs font-mono text-white outline-none focus:border-retro-neon"
                            value={profile.last_verified instanceof Date ? profile.last_verified.toISOString().split('T')[0] : (profile.last_verified || '')}
                            onChange={(e) => handleChange('last_verified', e.target.value)}
                        />
                    </div>
                 </div>
            </div>

            <div className="flex justify-end mt-8">
                <Button onClick={handleSave} isLoading={saving} variant="primary">SAVE PROFILE</Button>
            </div>
        </div>
    );
};