
'use client';

import { useState, type FormEvent, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { addConsole } from '../../lib/api';
import { supabase } from '../../lib/supabase/singleton';
import { ConsoleSchema, Manufacturer, CONSOLE_FORM_FIELDS } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

const ImagePreview: FC<{ url?: string }> = ({ url }) => {
    const [error, setError] = useState(false);
    
    if (!url) return (
        <div className="mt-2 h-24 bg-black/20 border border-dashed border-gray-800 flex items-center justify-center">
            <span className="font-mono text-[10px] text-gray-600 uppercase">No Signal</span>
        </div>
    );

    if (error) return (
        <div className="mt-2 h-24 bg-red-900/10 border border-dashed border-red-900/50 flex items-center justify-center">
            <span className="font-mono text-[10px] text-red-500 uppercase">Invalid Signal</span>
        </div>
    );

    return (
        <div className="mt-2 h-24 bg-black/40 border border-retro-grid flex items-center justify-center p-2">
            <img 
                src={url} 
                className="h-full w-auto object-contain" 
                onError={() => setError(true)} 
                alt="Preview" 
            />
        </div>
    );
};

interface ConsoleFormProps {
    manufacturers: Manufacturer[];
    onConsoleCreated: (id: string, name: string) => void;
    onError: (msg: string) => void;
}

export const ConsoleForm: FC<ConsoleFormProps> = ({ manufacturers, onConsoleCreated, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // --- SIMPLE AUTH CHECK (Variant-First Protocol) ---
        console.log('Starting Console submission...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            console.error("Auth Error:", sessionError);
            onError("Session expired. Please refresh the page.");
            return;
        }
        
        // Final safety check: Auto-generate slug if missing
        if (!formData.slug && formData.name) {
             formData.slug = generateSlug(formData.name);
        }

        const consoleData: any = { manufacturer_id: formData.manufacturer_id };
        CONSOLE_FORM_FIELDS.forEach(f => { if(formData[f.key]) consoleData[f.key] = formData[f.key]; });
        
        const consoleResult = ConsoleSchema.safeParse(consoleData);
        if (!consoleResult.success) { onError(`CONSOLE: ${consoleResult.error.issues[0].message}`); return; }

        console.log('Validation Passed. Creating Console Folder...');

        setLoading(true);
        try {
            // New Workflow: We do NOT send specs here. Just the folder identity.
            const response = await addConsole(consoleResult.data as any);
            
            if (response.success && response.id) {
                // DO NOT RESET FORM. 
                // The user wants to see what they just made as they move to the next tab.
                setIsSlugLocked(true);
                
                // Refresh Server Data so the ID is valid for the next step
                router.refresh();

                // Trigger Workflow Switch -> This will change the tab to 'ADD VARIANTS'
                onConsoleCreated(response.id, consoleData.name);

            } else {
                console.error(`[ConsoleForm] Registration Failed:`, response.message);
                onError(`REGISTRATION FAILED: ${response.message}`);
            }
        } catch (err: any) {
             console.error('[ConsoleForm] Critical Exception:', err);
             onError(`SYSTEM ERROR: ${err.message}`);
        } finally {
             setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-retro-blue/10 border-l-4 border-retro-blue p-4 mb-4">
                <h3 className="font-bold text-retro-blue text-sm uppercase">Step 1: System Identity (The Folder)</h3>
                <p className="text-xs text-gray-400">Create the container for this console. You will add technical specs (Variants) in the next step.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2 border-b border-retro-grid pb-4 mb-4">
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Manufacturer (Required)</label>
                    <select 
                        className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono"
                        value={formData.manufacturer_id || ''}
                        onChange={(e) => handleInputChange('manufacturer_id', e.target.value)}
                        required
                    >
                        <option value="">-- Select Fabricator --</option>
                        {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>

                {CONSOLE_FORM_FIELDS.map(field => {
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

                    if (field.key === 'image_url') {
                        return (
                            <div key={field.key}>
                                <AdminInput 
                                    field={field} 
                                    value={formData[field.key]} 
                                    onChange={handleInputChange} 
                                />
                                <ImagePreview url={formData[field.key]} key={formData[field.key]} />
                            </div>
                        );
                    }

                    return <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />;
                })}
            </div>

            <div className="flex justify-end pt-4"><Button type="submit" isLoading={loading}>CREATE FOLDER & START SPECS &gt;</Button></div>
        </form>
    );
};
