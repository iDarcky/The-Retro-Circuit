
'use client';

import { useState, useEffect, type FC } from 'react';
import { supabase } from '../../lib/supabase/singleton';
import { EmulationProfile } from '../../lib/types';
import Button from '../ui/Button';

interface EmulationFormProps {
    variantId: string;
    onSave?: () => void;
}

// User Defined Tiers
const SYSTEM_TIERS = [
    {
        title: 'Tier 1: Classic 2D',
        systems: [
            { key: 'nes_state', label: 'NES' },
            { key: 'snes_state', label: 'SNES' },
            { key: 'master_system', label: 'Sega Master System' },
            { key: 'genesis_state', label: 'Genesis / Mega Drive' },
            { key: 'gb_state', label: 'Game Boy' },
            { key: 'gbc_state', label: 'Game Boy Color' },
            { key: 'gba_state', label: 'Game Boy Advance' },
        ]
    },
    {
        title: 'Tier 2: Early 3D',
        systems: [
            { key: 'ps1_state', label: 'PlayStation' },
            { key: 'n64_state', label: 'Nintendo 64' },
            { key: 'saturn_state', label: 'Sega Saturn' },
            { key: 'nds_state', label: 'Nintendo DS' },
            // User requested re-order: Dreamcast moved from legacy location if needed,
            // but checked user list: "PlayStation, Nintendo 64, Sega Saturn, Nintendo DS"
            // Wait, Dreamcast is missing from User's Tier 2 list in the prompt text!
            // Prompt said:
            // Tier 2: PS, N64, Sega Saturn, NDS.
            // Tier 3: PSP, 3DS, PS Vita.
            // Tier 4: PS2, GameCube, Xbox.
            // Tier 5: Wii, Wii U, PS3, 360, Switch, PC.
            // Dreamcast is MISSING in the user's specific text list.
            // HOWEVER, Dreamcast exists in the DB. I should probably leave it in Tier 2 or ask?
            // "Add and reorder consoles in the admin panel like the tier bellow."
            // I will strictly follow the list. If Dreamcast is not in the list, where does it go?
            // Usually Dreamcast is with PS2/GC (Tier 4) or N64 (Tier 2).
            // I will add it to Tier 2 as it's closest to Early 3D/High-End.
            // Actually, looking at the previous file, Dreamcast was in 32/64 bit.
            // I will append it to Tier 2 for now to avoid data loss in UI, but keep it at end.
            { key: 'dreamcast_state', label: 'Dreamcast' }
        ]
    },
    {
        title: 'Tier 3: Advanced Handhelds',
        systems: [
            { key: 'psp_state', label: 'PlayStation Portable' },
            { key: 'x3ds_state', label: 'Nintendo 3DS' },
            { key: 'vita_state', label: 'PlayStation Vita' },
        ]
    },
    {
        title: 'Tier 4: Classic Home Consoles',
        systems: [
            { key: 'ps2_state', label: 'PlayStation 2' },
            { key: 'gamecube_state', label: 'GameCube' },
            { key: 'xbox', label: 'Xbox' },
        ]
    },
    {
        title: 'Tier 5: Modern & HD Systems',
        systems: [
            { key: 'wii_state', label: 'Wii' },
            { key: 'wii_u', label: 'Wii U' },
            { key: 'ps3_state', label: 'PlayStation 3' },
            { key: 'xbox_360', label: 'Xbox 360' },
            { key: 'switch_state', label: 'Nintendo Switch' },
            // PC Games intentionally omitted from UI/DB as per latest instruction "ignore pc_games"
        ]
    }
];

const RATINGS = ['N/A', 'Unplayable', 'Struggles', 'Playable', 'Great', 'Perfect'];

const getColorForRating = (rating?: string) => {
    switch(rating) {
        case 'Perfect': return 'text-green-400 font-bold';
        case 'Great': return 'text-blue-400 font-bold';
        case 'Playable': return 'text-yellow-400';
        case 'Struggles': return 'text-orange-400';
        case 'Unplayable': return 'text-accent';
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

    if (loading) return <div className="p-8 text-center font-mono text-secondary animate-pulse">LOADING PROFILE...</div>;

    return (
        <div className="bg-black/80 border border-border-normal p-6 animate-fadeIn">
            {message && <div className={`mb-4 p-2 text-xs font-mono border ${message.includes('ERROR') ? 'border-accent text-accent' : 'border-secondary text-secondary'}`}>{message}</div>}

            {SYSTEM_TIERS.map((tier) => (
                <div key={tier.title} className="mb-8">
                    <h4 className="font-pixel text-primary text-sm mb-4 border-b border-border-normal/50 pb-2">{tier.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tier.systems.map((sys) => {
                            const currentValue = (profile as any)[sys.key] || 'N/A';
                            return (
                                <div key={sys.key}>
                                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">{sys.label}</label>
                                    <select
                                        className={`w-full bg-black border border-gray-700 p-2 text-xs font-mono outline-none focus:border-secondary ${getColorForRating(currentValue)}`}
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
                    className="w-full bg-black border border-gray-700 p-3 text-xs font-mono text-white outline-none focus:border-secondary min-h-[100px]"
                    placeholder="Enter performance notes..."
                    value={profile.summary_text || ''}
                    onChange={(e) => handleChange('summary_text', e.target.value)}
                />
            </div>
            
            {/* ---- VERIFICATION SECTION ---- */}
            <div className="border-t border-border-normal/50 pt-6 mt-6">
                 <h4 className="font-pixel text-secondary text-sm mb-4">Verification</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                         <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Data Source / Reviewer</label>
                         <input
                            type="text"
                            className="w-full bg-black border border-gray-700 p-2 text-xs font-mono text-white outline-none focus:border-secondary"
                            placeholder="e.g., Retro Dodo Review, Self-tested"
                            value={profile.source || ''}
                            onChange={(e) => handleChange('source', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Last Verified Date</label>
                        <input
                            type="date"
                            className="w-full bg-black border border-gray-700 p-2 text-xs font-mono text-white outline-none focus:border-secondary"
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
