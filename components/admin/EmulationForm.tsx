
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
            { key: 'nes', label: 'NES' },
            { key: 'snes', label: 'SNES' },
            { key: 'master_system', label: 'Sega Master System' },
            { key: 'genesis', label: 'Genesis / Mega Drive' },
            { key: 'gb', label: 'Game Boy' },
            { key: 'gbc', label: 'Game Boy Color' },
            { key: 'gba', label: 'Game Boy Advance' },
        ]
    },
    {
        title: 'Tier 2: Early 3D',
        systems: [
            { key: 'ps1', label: 'PlayStation' },
            { key: 'n64', label: 'Nintendo 64' },
            { key: 'saturn', label: 'Sega Saturn' },
            { key: 'nds', label: 'Nintendo DS' },
            { key: 'dreamcast', label: 'Dreamcast' }
        ]
    },
    {
        title: 'Tier 3: Advanced Handhelds',
        systems: [
            { key: 'psp', label: 'PlayStation Portable' },
            { key: '3ds', label: 'Nintendo 3DS' },
            { key: 'vita', label: 'PlayStation Vita' },
        ]
    },
    {
        title: 'Tier 4: Classic Home Consoles',
        systems: [
            { key: 'ps2', label: 'PlayStation 2' },
            { key: 'gamecube', label: 'GameCube' },
            { key: 'xbox', label: 'Xbox' },
        ]
    },
    {
        title: 'Tier 5: Modern & HD Systems',
        systems: [
            { key: 'wii', label: 'Wii' },
            { key: 'wii_u', label: 'Wii U' },
            { key: 'ps3', label: 'PlayStation 3' },
            { key: 'xbox_360', label: 'Xbox 360' },
            { key: 'switch', label: 'Nintendo Switch' },
            // PC Games intentionally omitted from UI/DB as per latest instruction "ignore pc_games"
        ]
    }
];

// Mapping frontend keys to database column names if they differ
// Assuming DB columns match the keys used in original file but stripped of '_state' suffix in the TIERS array for cleanliness
// Let's re-map them to match the DB schema exactly based on the previous read_file output
const DB_KEY_MAP: Record<string, string> = {
    'nes': 'nes_state',
    'snes': 'snes_state',
    'master_system': 'master_system',
    'genesis': 'genesis_state',
    'gb': 'gb_state',
    'gbc': 'gbc_state',
    'gba': 'gba_state',
    'ps1': 'ps1_state',
    'n64': 'n64_state',
    'saturn': 'saturn_state',
    'nds': 'nds_state',
    'dreamcast': 'dreamcast_state',
    'psp': 'psp_state',
    '3ds': 'x3ds_state', // Note the 'x' prefix in DB
    'vita': 'vita_state',
    'ps2': 'ps2_state',
    'gamecube': 'gamecube_state',
    'xbox': 'xbox',
    'wii': 'wii_state',
    'wii_u': 'wii_u',
    'ps3': 'ps3_state',
    'xbox_360': 'xbox_360',
    'switch': 'switch_state'
};

const RATINGS = ['N/A', 'Unplayable', 'Struggles', 'Playable', 'Great', 'Perfect'];

const getColorForRating = (rating?: string) => {
    switch(rating) {
        case 'Perfect': return 'text-white font-bold bg-green-500/20 border-green-500';
        case 'Great': return 'text-white font-bold bg-blue-500/20 border-blue-500';
        case 'Playable': return 'text-yellow-400 border-yellow-400/50';
        case 'Struggles': return 'text-orange-400 border-orange-400/50';
        case 'Unplayable': return 'text-red-500 border-red-500/50';
        default: return 'text-zinc-500 border-white/10';
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

    if (loading) return <div className="p-8 text-center font-mono text-zinc-500 animate-pulse uppercase text-xs tracking-widest">LOADING PROFILE...</div>;

    return (
        <div className="bg-bg-primary border-t border-white/10 p-6 animate-fadeIn">
            {message && (
                <div className={`mb-6 p-3 text-xs font-mono font-bold uppercase border ${message.includes('ERROR') ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-green-500 bg-green-500/10 text-green-500'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {SYSTEM_TIERS.map((tier) => (
                    <div key={tier.title} className="border border-white/10 bg-zinc-900/30">
                        <h4 className="font-mono font-bold text-white text-xs px-4 py-2 border-b border-white/10 bg-zinc-900 uppercase tracking-widest">
                            {tier.title}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-1">
                            {tier.systems.map((sys) => {
                                const dbKey = DB_KEY_MAP[sys.key];
                                const currentValue = (profile as any)[dbKey] || 'N/A';
                                const colorClass = getColorForRating(currentValue);

                                return (
                                    <div key={sys.key} className="flex items-center justify-between bg-bg-primary p-2 border border-white/5 hover:border-white/20 transition-colors">
                                        <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-tight">{sys.label}</label>
                                        <select
                                            className={`bg-transparent border px-2 py-1 text-[10px] font-mono outline-none cursor-pointer appearance-none text-right uppercase w-24 transition-colors ${colorClass}`}
                                            value={currentValue}
                                            onChange={(e) => handleChange(dbKey, e.target.value)}
                                        >
                                            {RATINGS.map(r => (
                                                <option key={r} value={r} className="bg-bg-primary text-white">
                                                    {r.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8">
                        <label className="block text-[10px] font-mono text-zinc-500 font-bold uppercase mb-2">ANALYST SUMMARY / NOTES</label>
                        <textarea
                            className="w-full bg-bg-primary border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-white transition-colors min-h-[120px] resize-none placeholder:text-zinc-700"
                            placeholder="ENTER PERFORMANCE NOTES..."
                            value={profile.summary_text || ''}
                            onChange={(e) => handleChange('summary_text', e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-4 space-y-4">
                        <h4 className="font-mono font-bold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">Verification Data</h4>
                        <div>
                             <label className="block text-[10px] font-mono text-zinc-500 font-bold uppercase mb-1.5">Data Source</label>
                             <input
                                type="text"
                                className="w-full bg-bg-primary border border-white/10 p-2.5 text-xs font-mono text-white outline-none focus:border-white transition-colors placeholder:text-zinc-700"
                                placeholder="E.G. RETRO DODO"
                                value={profile.source || ''}
                                onChange={(e) => handleChange('source', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 font-bold uppercase mb-1.5">Last Verified</label>
                            <input
                                type="date"
                                className="w-full bg-bg-primary border border-white/10 p-2.5 text-xs font-mono text-white outline-none focus:border-white transition-colors"
                                value={profile.last_verified instanceof Date ? profile.last_verified.toISOString().split('T')[0] : (profile.last_verified || '')}
                                onChange={(e) => handleChange('last_verified', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8 pt-4 border-t border-white/10">
                <Button onClick={handleSave} isLoading={saving} variant="swiss">SAVE PROFILE</Button>
            </div>
        </div>
    );
};
