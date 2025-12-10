
'use client';

import { useState, useEffect, type FC } from 'react';
import { supabase } from '../../lib/supabase/singleton';
import { EmulationProfile } from '../../lib/types';
import Button from '../ui/Button';

interface EmulationFormProps {
    variantId: string;
    onSave?: () => void;
}

const SYSTEMS = [
    { key: 'ps1_state', label: 'PlayStation 1' },
    { key: 'ps2_state', label: 'PlayStation 2' },
    { key: 'psp_state', label: 'PSP' },
    { key: 'dreamcast_state', label: 'Dreamcast' },
    { key: 'saturn_state', label: 'Saturn' },
    { key: 'gamecube_state', label: 'GameCube' },
    { key: 'wii_state', label: 'Wii' },
    { key: 'x3ds_state', label: 'Nintendo 3DS' },
    { key: 'vita_state', label: 'PS Vita' },
    { key: 'switch_state', label: 'Switch' },
];

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
            const { data, error } = await supabase
                .from('emulation_profiles')
                .select('*')
                .eq('variant_id', variantId)
                .single();

            if (data) {
                setProfile(data);
            } else {
                // Initialize empty
                setProfile({ variant_id: variantId });
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
        
        // Remove ID if it's undefined to ensure creation works if needed
        if (!payload.id) delete payload.id;

        const { error } = await supabase
            .from('emulation_profiles')
            .upsert(payload, { onConflict: 'variant_id' });

        if (error) {
            console.error(error);
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
            <h3 className="font-pixel text-sm text-retro-neon mb-6 border-b border-retro-grid pb-2">
                EMULATION PERFORMANCE MATRIX
            </h3>

            {message && (
                <div className={`mb-4 p-2 text-xs font-mono border ${message.includes('ERROR') ? 'border-retro-pink text-retro-pink' : 'border-retro-neon text-retro-neon'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {SYSTEMS.map((sys) => {
                    // @ts-ignore
                    const currentValue = profile[sys.key] || 'N/A';
                    return (
                        <div key={sys.key}>
                            <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">{sys.label}</label>
                            <select
                                className={`w-full bg-black border border-gray-700 p-2 text-xs font-mono outline-none focus:border-retro-neon ${getColorForRating(currentValue)}`}
                                value={currentValue}
                                onChange={(e) => handleChange(sys.key, e.target.value)}
                            >
                                {RATINGS.map(r => (
                                    <option key={r} value={r} className="text-gray-300">
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                })}
            </div>

            <div className="mb-6">
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">ANALYST SUMMARY / NOTES</label>
                <textarea
                    className="w-full bg-black border border-gray-700 p-3 text-xs font-mono text-white outline-none focus:border-retro-neon min-h-[100px]"
                    placeholder="Enter performance notes (e.g. 'PS2 runs perfectly at 2x resolution...')"
                    value={profile.summary_text || ''}
                    onChange={(e) => handleChange('summary_text', e.target.value)}
                />
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} isLoading={saving} variant="primary">
                    SAVE PROFILE
                </Button>
            </div>
        </div>
    );
};
