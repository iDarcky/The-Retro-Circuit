'use client';

import { useState, type FormEvent, type FC, type KeyboardEvent } from 'react';
import { addManufacturer } from '../../lib/api';
import { Manufacturer, ManufacturerSchema, MANUFACTURER_FORM_FIELDS } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

interface ManufacturerFormProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ManufacturerForm: FC<ManufacturerFormProps> = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);

    // Franchise Tag State
    const [franchises, setFranchises] = useState<string[]>([]);
    const [franchiseInput, setFranchiseInput] = useState('');

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/\s+/g, '-')          // Replace spaces with hyphens
            .replace(/[^a-z0-9-]/g, '')    // Remove special chars
            .replace(/-+/g, '-');          // Collapse multiple hyphens
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [key]: value };
            
            // Auto-update slug if locked and editing name
            if (key === 'name' && isSlugLocked) {
                newData['slug'] = generateSlug(value);
            }
            return newData;
        });
    };

    const handleFranchiseKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmed = franchiseInput.trim().replace(/,/g, ''); // Remove trailing comma if present
            if (trimmed && !franchises.includes(trimmed)) {
                setFranchises([...franchises, trimmed]);
            }
            setFranchiseInput('');
        }
    };

    const removeFranchise = (tag: string) => {
        setFranchises(franchises.filter(f => f !== tag));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Final safety check: Auto-generate slug if missing
        if (!formData.slug && formData.name) {
             formData.slug = generateSlug(formData.name);
        }

        // Prepare data with joined franchises
        const submissionData = { ...formData };
        if (franchises.length > 0) {
            submissionData.key_franchises = franchises.join(', ');
        }

        const result = ManufacturerSchema.safeParse(submissionData);
        if (!result.success) { onError(result.error.issues[0].message); return; }
        
        setLoading(true);
        const response = await addManufacturer(result.data as Omit<Manufacturer, 'id'>);
        if (response.success) {
            onSuccess("CORPORATION REGISTERED");
            setFormData({});
            setFranchises([]);
            setFranchiseInput('');
            setIsSlugLocked(true);
        } else {
            onError(`REGISTRATION FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MANUFACTURER_FORM_FIELDS.map(field => {
                if (field.key === 'slug') {
                    return (
                        <div key={field.key}>
                            <label className="text-[10px] text-gray-500 mb-1 block uppercase flex justify-between items-center">
                                {field.label}
                                <button 
                                    type="button" 
                                    onClick={() => setIsSlugLocked(!isSlugLocked)} 
                                    className="text-[10px] text-retro-blue hover:text-white underline cursor-pointer"
                                    title={isSlugLocked ? "Unlock to edit manually" : "Lock to auto-generate from name"}
                                >
                                    [{isSlugLocked ? 'UNLOCK' : 'LOCK'}]
                                </button>
                            </label>
                            <input 
                                type="text"
                                className={`w-full border p-3 font-mono outline-none transition-colors ${
                                    isSlugLocked 
                                    ? 'bg-gray-900/50 border-gray-800 text-gray-500 cursor-not-allowed' 
                                    : 'bg-black border-retro-neon text-white focus:border-retro-blue'
                                }`}
                                value={formData[field.key] || ''}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                readOnly={isSlugLocked}
                                required={field.required}
                            />
                        </div>
                    );
                }

                if (field.key === 'key_franchises') {
                    return (
                        <div key={field.key} className="col-span-1 md:col-span-2">
                             <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
                             <div className="w-full bg-black border border-gray-700 p-2 focus-within:border-retro-neon transition-colors flex flex-wrap gap-2 items-center min-h-[50px]">
                                {franchises.map((tag) => (
                                    <span key={tag} className="bg-retro-blue/20 text-retro-blue text-xs font-mono px-2 py-1 flex items-center gap-1 border border-retro-blue/50">
                                        {tag}
                                        <button 
                                            type="button"
                                            onClick={() => removeFranchise(tag)}
                                            className="hover:text-white font-bold px-1"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input 
                                    type="text"
                                    className="bg-transparent text-white font-mono text-sm outline-none flex-1 min-w-[120px] p-1"
                                    placeholder={franchises.length === 0 ? "Type franchise & press Enter..." : ""}
                                    value={franchiseInput}
                                    onChange={(e) => setFranchiseInput(e.target.value)}
                                    onKeyDown={handleFranchiseKeyDown}
                                />
                             </div>
                        </div>
                    );
                }

                return (
                    <AdminInput 
                        key={field.key} 
                        field={field} 
                        value={formData[field.key]} 
                        onChange={handleInputChange} 
                    />
                );
            })}
            </div>
            <div className="flex justify-end pt-4"><Button type="submit" isLoading={loading}>REGISTER ENTITY</Button></div>
        </form>
    );
};