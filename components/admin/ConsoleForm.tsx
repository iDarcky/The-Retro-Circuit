
'use client';

import { useState, type FormEvent, type FC } from 'react';
import { addConsole } from '../../lib/api';
import { ConsoleSchema, ConsoleSpecsSchema, Manufacturer, CONSOLE_FORM_FIELDS, CONSOLE_SPECS_FORM_FIELDS } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

interface ConsoleFormProps {
    manufacturers: Manufacturer[];
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ConsoleForm: FC<ConsoleFormProps> = ({ manufacturers, onSuccess, onError }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!formData.slug && formData.name) {
             formData.slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }

        const consoleData: any = { manufacturer_id: formData.manufacturer_id };
        CONSOLE_FORM_FIELDS.forEach(f => { if(formData[f.key]) consoleData[f.key] = formData[f.key]; });
        
        const specsData: any = {};
        CONSOLE_SPECS_FORM_FIELDS.forEach(f => { if(formData[f.key]) specsData[f.key] = formData[f.key]; });

        const consoleResult = ConsoleSchema.safeParse(consoleData);
        if (!consoleResult.success) { onError(`CONSOLE: ${consoleResult.error.issues[0].message}`); return; }

        const specsResult = ConsoleSpecsSchema.safeParse(specsData);
        if(!specsResult.success) { onError(`SPECS: ${specsResult.error.issues[0].message}`); return; }

        setLoading(true);
        const response = await addConsole(consoleResult.data as any, specsResult.data as any);
        if (response.success) {
            onSuccess("HARDWARE & SPECS REGISTERED");
            setFormData({});
        } else {
            onError(`REGISTRATION FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-8">
                    <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase">I. Identity</div>
                    <div className="mb-4">
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Manufacturer</label>
                    <select 
                        className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono" 
                        value={formData.manufacturer_id || ''} 
                        onChange={(e) => handleInputChange('manufacturer_id', e.target.value)}
                        required
                    >
                        <option value="">-- Select Manufacturer --</option>
                        {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CONSOLE_FORM_FIELDS.map(field => (
                        <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
                    ))}
                    </div>
            </div>

            <div>
                <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase">II. Base Specifications</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CONSOLE_SPECS_FORM_FIELDS.map(field => (
                        <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
                    ))}
                </div>
            </div>
            <div className="flex justify-end pt-4"><Button type="submit" isLoading={loading}>REGISTER HARDWARE</Button></div>
        </form>
    );
};
