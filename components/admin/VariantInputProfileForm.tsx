'use client';

import { useState, useEffect, type FormEvent, type FC } from 'react';
import { fetchVariantInputProfile, upsertVariantInputProfile } from '../../lib/api/inputs';
import { VariantInputProfile } from '../../lib/types/domain';
import Button from '../ui/Button';

interface VariantInputProfileFormProps {
    variantId: string;
    variantName: string;
    onSave: () => void;
}

// Enums for Dropdowns
const TECH_OPTIONS = ['membrane', 'microswitch', 'mechanical', 'hall', 'potentiometer', 'spring', 'optical', 'unknown'];
const DPAD_SHAPE_OPTIONS = ['cross', 'disc', 'segmented', 'unknown'];
const PLACEMENT_OPTIONS = ['left', 'right', 'center', 'unknown'];
const FACE_LAYOUT_OPTIONS = ['diamond', 'inline', 'arcade_6', 'split', 'unknown'];
const LABEL_SCHEME_OPTIONS = ['nintendo', 'xbox', 'playstation', 'generic', 'unknown'];
const STICK_LAYOUT_OPTIONS = ['symmetric', 'asymmetric', 'centered', 'unknown'];
const STICK_CAP_OPTIONS = ['concave', 'convex', 'flat', 'domed', 'textured', 'unknown'];
const TRIGGER_TYPE_OPTIONS = ['digital', 'analog', 'unknown'];
const TRIGGER_LAYOUT_OPTIONS = ['inline', 'stacked', 'unknown'];
const KEYBOARD_TYPE_OPTIONS = ['physical', 'touch', 'unknown'];
const SYSTEM_SET_OPTIONS = ['minimal', 'standard', 'extended', 'unknown'];
const CONFIDENCE_OPTIONS = ['confirmed', 'inferred', 'unknown'];

export const VariantInputProfileForm: FC<VariantInputProfileFormProps> = ({ variantId, variantName, onSave }) => {
    const [profile, setProfile] = useState<Partial<VariantInputProfile>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await fetchVariantInputProfile(variantId);
            if (data) {
                setProfile(data);
            } else {
                // Initialize with minimal defaults if needed, or leave empty to trigger "Create"
                setProfile({ variant_id: variantId });
            }
            setLoading(false);
        };
        load();
    }, [variantId]);

    const handleChange = (key: keyof VariantInputProfile, value: any) => {
        setProfile(prev => ({ ...prev, [key]: value }));
        // Auto-clear messages
        if (error) setError(null);
        if (successMsg) setSuccessMsg(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMsg(null);

        // Ensure variant_id is present
        const payload: VariantInputProfile = {
            ...profile,
            variant_id: variantId
        } as VariantInputProfile;

        const res = await upsertVariantInputProfile(payload);
        if (res.success) {
            setSuccessMsg("INPUT PROFILE SAVED.");
            onSave();
        } else {
            setError(res.message || "FAILED TO SAVE PROFILE");
        }
        setSaving(false);
    };

    if (loading) return <div className="text-secondary font-mono animate-pulse">LOADING INPUT PROFILE...</div>;

    const InputGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="border border-gray-800 bg-black/20 p-4 mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 border-b border-gray-800 pb-1">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    const Select = ({ label, value, options, onChange, width = 'full' }: any) => (
        <div className={width === 'half' ? '' : 'col-span-1 md:col-span-2'}>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">{label}</label>
            <select
                className="w-full bg-black border border-gray-700 text-white text-xs p-2 font-mono outline-none focus:border-secondary"
                value={value || 'unknown'}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    const NumberInput = ({ label, value, onChange, min, max, step = 1, width = 'half' }: any) => (
        <div className={width === 'half' ? '' : 'col-span-1 md:col-span-2'}>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">{label}</label>
            <input
                type="number"
                min={min} max={max} step={step}
                className="w-full bg-black border border-gray-700 text-white text-xs p-2 font-mono outline-none focus:border-secondary"
                value={value ?? ''}
                onChange={(e) => {
                    const v = e.target.value === '' ? null : Number(e.target.value);
                    onChange(v);
                }}
            />
        </div>
    );

    const BooleanSelect = ({ label, value, onChange }: any) => (
        <div>
            <label className="text-[10px] text-gray-500 uppercase block mb-1">{label}</label>
            <select
                className="w-full bg-black border border-gray-700 text-white text-xs p-2 font-mono outline-none focus:border-secondary"
                value={value === true ? 'true' : value === false ? 'false' : ''}
                onChange={(e) => {
                    const v = e.target.value;
                    onChange(v === 'true' ? true : v === 'false' ? false : null);
                }}
            >
                <option value="">Unknown (NULL)</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
        </div>
    );

    return (
        <div className="space-y-4 font-mono">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                <div>
                    <h3 className="text-secondary font-bold text-sm">INPUT & MECHANICS EDITOR</h3>
                    <div className="text-[10px] text-gray-500">
                        VARIANT: <span className="text-white">{variantName}</span>
                    </div>
                </div>
                <div className={`px-2 py-1 text-[10px] font-bold border ${profile.dpad_tech ? 'border-secondary text-secondary bg-secondary/10' : 'border-accent text-accent bg-accent/10'}`}>
                    {profile.dpad_tech ? 'PROFILE EXISTS ✅' : 'PROFILE MISSING ⚠️'}
                </div>
            </div>

            {error && <div className="p-3 bg-accent/10 border border-accent text-accent text-xs font-bold">{error}</div>}
            {successMsg && <div className="p-3 bg-secondary/10 border border-secondary text-secondary text-xs font-bold">{successMsg}</div>}

            <form onSubmit={handleSubmit}>
                <InputGroup title="D-Pad">
                    <Select label="Tech" value={profile.dpad_tech} options={TECH_OPTIONS} onChange={(v: any) => handleChange('dpad_tech', v)} width="half" />
                    <Select label="Shape" value={profile.dpad_shape} options={DPAD_SHAPE_OPTIONS} onChange={(v: any) => handleChange('dpad_shape', v)} width="half" />
                    <Select label="Placement" value={profile.dpad_placement} options={PLACEMENT_OPTIONS} onChange={(v: any) => handleChange('dpad_placement', v)} width="half" />
                </InputGroup>

                <InputGroup title="Face Buttons">
                    <NumberInput label="Count (2/4/6)" value={profile.face_button_count} onChange={(v: any) => handleChange('face_button_count', v)} width="half" />
                    <Select label="Layout" value={profile.face_button_layout} options={FACE_LAYOUT_OPTIONS} onChange={(v: any) => handleChange('face_button_layout', v)} width="half" />
                    <Select label="Tech" value={profile.face_button_tech} options={TECH_OPTIONS} onChange={(v: any) => handleChange('face_button_tech', v)} width="half" />
                    <Select label="Label Scheme" value={profile.face_label_scheme} options={LABEL_SCHEME_OPTIONS} onChange={(v: any) => handleChange('face_label_scheme', v)} width="half" />
                </InputGroup>

                <InputGroup title="Analog Sticks">
                    <NumberInput label="Count (0/1/2)" value={profile.stick_count} onChange={(v: any) => handleChange('stick_count', v)} width="half" />
                    <Select label="Layout" value={profile.stick_layout} options={STICK_LAYOUT_OPTIONS} onChange={(v: any) => handleChange('stick_layout', v)} width="half" />
                    <Select label="Tech" value={profile.stick_tech} options={TECH_OPTIONS} onChange={(v: any) => handleChange('stick_tech', v)} width="half" />
                    <Select label="Cap Style" value={profile.stick_cap} options={STICK_CAP_OPTIONS} onChange={(v: any) => handleChange('stick_cap', v)} width="half" />
                    <BooleanSelect label="L3/R3 Clicks?" value={profile.stick_clicks} onChange={(v: any) => handleChange('stick_clicks', v)} />
                </InputGroup>

                <InputGroup title="Triggers & Bumpers">
                    <Select label="L1/R1 Tech" value={profile.bumper_tech} options={TECH_OPTIONS} onChange={(v: any) => handleChange('bumper_tech', v)} width="half" />
                    <Select label="L2/R2 Tech" value={profile.trigger_tech} options={TECH_OPTIONS} onChange={(v: any) => handleChange('trigger_tech', v)} width="half" />
                    <Select label="Trigger Type" value={profile.trigger_type} options={TRIGGER_TYPE_OPTIONS} onChange={(v: any) => handleChange('trigger_type', v)} width="half" />
                    <Select label="Layout" value={profile.trigger_layout} options={TRIGGER_LAYOUT_OPTIONS} onChange={(v: any) => handleChange('trigger_layout', v)} width="half" />
                </InputGroup>

                <InputGroup title="Back Buttons">
                    <NumberInput label="Count (0/2/4)" value={profile.back_button_count} onChange={(v: any) => handleChange('back_button_count', v)} width="full" />
                </InputGroup>

                <InputGroup title="System & Meta">
                    <Select label="System Button Set" value={profile.system_button_set} options={SYSTEM_SET_OPTIONS} onChange={(v: any) => handleChange('system_button_set', v)} width="half" />
                    <div className="col-span-2">
                        <label className="text-[10px] text-gray-500 uppercase block mb-1">System Button Text</label>
                        <input type="text" className="w-full bg-black border border-gray-700 text-white text-xs p-2 font-mono outline-none focus:border-secondary" placeholder="Start, Select, Home..." value={profile.system_buttons_text || ''} onChange={(e) => handleChange('system_buttons_text', e.target.value)} />
                    </div>
                </InputGroup>

                <InputGroup title="Misc">
                    <BooleanSelect label="Gyroscope?" value={profile.has_gyro} onChange={(v: any) => handleChange('has_gyro', v)} />
                    <BooleanSelect label="Has Keyboard?" value={profile.has_keyboard} onChange={(v: any) => handleChange('has_keyboard', v)} />
                    {profile.has_keyboard && (
                         <Select label="Keyboard Type" value={profile.keyboard_type} options={KEYBOARD_TYPE_OPTIONS} onChange={(v: any) => handleChange('keyboard_type', v)} width="half" />
                    )}
                </InputGroup>

                 <InputGroup title="Touchpads">
                    <NumberInput label="Count (0/1/2)" value={profile.touchpad_count} onChange={(v: any) => handleChange('touchpad_count', v)} width="half" />
                    <BooleanSelect label="Clickable?" value={profile.touchpad_clickable} onChange={(v: any) => handleChange('touchpad_clickable', v)} />
                </InputGroup>

                <div className="border-t border-gray-800 pt-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select label="Data Confidence" value={profile.input_confidence} options={CONFIDENCE_OPTIONS} onChange={(v: any) => handleChange('input_confidence', v)} width="half" />
                        <div className="col-span-2">
                            <label className="text-[10px] text-gray-500 uppercase block mb-1">Internal Notes</label>
                            <textarea className="w-full bg-black border border-gray-700 text-white text-xs p-2 font-mono outline-none focus:border-secondary h-20" value={profile.input_notes || ''} onChange={(e) => handleChange('input_notes', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <Button type="submit" isLoading={saving} variant="primary">
                        [ SAVE INPUT PROFILE ]
                    </Button>
                </div>
            </form>
        </div>
    );
};
