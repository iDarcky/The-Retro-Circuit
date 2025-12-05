'use client';

import { useState, type FormEvent, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { addConsole } from '../../lib/api';
import { supabase } from '../../lib/supabase/singleton';
import { ConsoleSchema, ConsoleSpecsSchema, Manufacturer, CONSOLE_FORM_FIELDS, CONSOLE_SPECS_FORM_FIELDS } from '../../lib/types';
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
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ConsoleForm: FC<ConsoleFormProps> = ({ manufacturers, onSuccess, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

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
        
        // --- PARANOID AUTH START ---
        console.log('Starting Console submission with Paranoid Auth...');
        try {
            // 1. Force Refresh
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                console.warn('[ConsoleForm] Session refresh warning:', refreshError);
            }
            
            // 2. Verify Session Exists
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("Session Lost. Please Login Again.");
            }
            
            console.log('[ConsoleForm] Auth Validated for:', session.user.email);
        } catch (authError: any) {
            console.error('[ConsoleForm] Auth Check Failed:', authError);
            onError(authError.message || 'Authentication Failed');
            return;
        }
        // --- PARANOID AUTH END ---
        
        // Final safety check: Auto-generate slug if missing
        if (!formData.slug && formData.name) {
             formData.slug = generateSlug(formData.name);
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
        try {
            const response = await addConsole(consoleResult.data as any, specsResult.data as any);
            
            if (response.success) {
                // RESET PROTOCOL FOR BULK ENTRY
                setFormData({});
                setIsSlugLocked(true);
                
                // Show local success banner
                setIsSuccess(true);
                
                // Refresh Server Data
                router.refresh();

                // Trigger parent refresh but suppress parent banner (send empty string)
                onSuccess(''); 

                // Auto-dismiss banner
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
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
            {isSuccess && (
                <div className="bg-retro-neon/10 border border-retro-neon text-retro-neon p-4 text-center font-bold animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                    HARDWARE REGISTERED. READY FOR NEXT ENTRY.
                </div>
            )}

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