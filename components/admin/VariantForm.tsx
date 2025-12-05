'use client';

import { useState, type FormEvent, type FC, useEffect, useRef } from 'react';
import { addConsoleVariant } from '../../lib/api';
import { ConsoleVariantSchema, VARIANT_FORM_GROUPS } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

interface VariantFormProps {
    consoleList: {name: string, id: string}[];
    preSelectedConsoleId?: string | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const VariantForm: FC<VariantFormProps> = ({ consoleList, preSelectedConsoleId, onSuccess, onError }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    
    // Ref for the name input to focus it after cloning
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Sync pre-selected console when it changes
    useEffect(() => {
        if (preSelectedConsoleId) {
            setFormData(prev => ({ ...prev, console_id: preSelectedConsoleId }));
        }
    }, [preSelectedConsoleId]);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent, mode: 'SAVE' | 'CLONE' = 'SAVE') => {
        e.preventDefault();

        const rawVariant = { ...formData };
        if (!rawVariant.slug && rawVariant.variant_name) {
             rawVariant.slug = rawVariant.variant_name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }

        const result = ConsoleVariantSchema.safeParse(rawVariant);
        if (!result.success) { onError(result.error.issues[0].message); return; }

        setLoading(true);
        const response = await addConsoleVariant(result.data as any);
        
        if (response.success) {
            onSuccess(mode === 'CLONE' ? "VARIANT SAVED. FORM PRESERVED FOR CLONING." : "VARIANT MODEL REGISTERED");
            
            if (mode === 'SAVE') {
                // Clear Form, but keep the parent console selected for convenience
                setFormData({ console_id: rawVariant.console_id });
            } else {
                // Clone Mode: Keep data, append 'Copy' to name/slug to force user to change it, and focus name
                setFormData(prev => ({ 
                    ...prev, 
                    variant_name: '', // Clear name to force re-entry
                    slug: '' 
                }));
                // Focus the name input
                setTimeout(() => {
                    const nameInput = document.querySelector('input[name="variant_name_focus_target"]') as HTMLInputElement;
                    if (nameInput) nameInput.focus();
                }, 100);
            }
        } else {
            onError(`VARIANT FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    return (
        <form className="space-y-8">
            <div className="bg-retro-pink/10 border-l-4 border-retro-pink p-4 mb-4">
                <h3 className="font-bold text-retro-pink text-sm uppercase">Step 2: Technical Specifications</h3>
                <p className="text-xs text-gray-400">
                    Define the hardware. Create a &quot;Base Model&quot; first, then use &quot;Save & Clone&quot; to quickly add Pro/Lite versions.
                </p>
            </div>

            <div className="mb-4">
                <label className="text-[10px] text-gray-500 mb-1 block uppercase">Parent Console</label>
                <select 
                    className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono" 
                    value={formData.console_id || ''} 
                    onChange={(e) => handleInputChange('console_id', e.target.value)}
                    required
                >
                    <option value="">-- Select Console --</option>
                    {consoleList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {VARIANT_FORM_GROUPS.map((group, idx) => (
                <div key={idx} className="bg-black/30 p-4 border border-gray-800">
                    <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase">{group.title}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.fields.map(field => {
                            // Hack to target focus
                            if (field.key === 'variant_name') {
                                return (
                                    <div key={field.key}>
                                        <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
                                        <input 
                                            name="variant_name_focus_target"
                                            type="text"
                                            className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            required={(field as any).required}
                                        />
                                    </div>
                                )
                            }
                            return <AdminInput key={field.key} field={field as any} value={formData[field.key]} onChange={handleInputChange} />
                        })}
                    </div>
                </div>
            ))}
            
            <div className="flex justify-end gap-4 pt-4 border-t border-retro-grid">
                <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={(e) => handleSubmit(e, 'CLONE')} 
                    isLoading={loading}
                    className="border-dashed"
                >
                    [ SAVE & CLONE ]
                </Button>
                <Button 
                    type="submit" 
                    onClick={(e) => handleSubmit(e, 'SAVE')} 
                    isLoading={loading}
                >
                    REGISTER VARIANT
                </Button>
            </div>
        </form>
    );
};