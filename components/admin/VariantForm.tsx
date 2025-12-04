
'use client';

import { useState, type FormEvent, type FC } from 'react';
import { addConsoleVariant } from '../../lib/api';
import { ConsoleVariantSchema, VARIANT_FORM_GROUPS } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

interface VariantFormProps {
    consoleList: {name: string, id: string}[];
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const VariantForm: FC<VariantFormProps> = ({ consoleList, onSuccess, onError }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
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
            onSuccess("VARIANT MODEL REGISTERED");
            setFormData({});
        } else {
            onError(`VARIANT FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-retro-grid/10 p-4 border border-retro-grid">
                <h3 className="text-sm font-bold text-retro-blue mb-2">INSTRUCTIONS</h3>
                <p className="text-xs text-gray-400">
                    Select a parent console. Variants override base specs. Only fill fields that differ.
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
                        {group.fields.map(field => (
                            <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
                        ))}
                    </div>
                </div>
            ))}
            
            <div className="flex justify-end pt-4"><Button type="submit" isLoading={loading}>REGISTER VARIANT</Button></div>
        </form>
    );
};
