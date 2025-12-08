'use client';

import { useState, type FormEvent, type FC, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addManufacturer } from '../../lib/api';
import { supabase } from '../../lib/supabase/singleton';
import { ManufacturerSchema, MANUFACTURER_FORM_FIELDS } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';
import ImageUpload from '../ui/ImageUpload';

interface ManufacturerFormProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ManufacturerForm: FC<ManufacturerFormProps> = ({ onSuccess, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

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

        if (fieldErrors[key]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
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
        
        // --- STANDARD AUTH CHECK ---
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            console.error("Auth Error:", sessionError);
            onError("Session expired. Please refresh the page.");
            return;
        }

        // Auto-generate slug if missing
        if (!formData.slug && formData.name) {
             formData.slug = generateSlug(formData.name);
        }

        const rawData = {
            ...formData,
            key_franchises: franchises.join(', '),
            founded_year: Number(formData.founded_year)
        };

        const result = ManufacturerSchema.safeParse(rawData);
        if (!result.success) { 
             const newErrors: Record<string, string> = {};
             result.error.issues.forEach(issue => {
                 if (issue.path.length > 0) newErrors[issue.path[0].toString()] = issue.message;
             });
             setFieldErrors(newErrors);
             onError("VALIDATION FAILED. CHECK HIGHLIGHTED FIELDS."); 
             return; 
        }

        setLoading(true);
        try {
            const response = await addManufacturer(result.data as any);
            
            if (response.success) {
                // RESET PROTOCOL FOR BULK ENTRY
                setFormData({});
                setFranchises([]);
                setFranchiseInput('');
                setIsSlugLocked(true);
                setFieldErrors({});

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
                console.error(`[ManufacturerForm] Registration Failed:`, response.message);
                onError(`REGISTRATION FAILED: ${response.message}`);
            }
        } catch (err: any) {
             console.error('[ManufacturerForm] Critical Exception:', err);
             onError(`SYSTEM ERROR: ${err.message}`);
        } finally {
             // CRITICAL: Always reset loading state so button doesn't get stuck
             setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {isSuccess && (
                <div className="bg-retro-neon/10 border border-retro-neon text-retro-neon p-4 text-center font-bold animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                    FABRICATOR REGISTERED. READY FOR NEXT ENTRY.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MANUFACTURER_FORM_FIELDS.map(field => {
                    if (field.key === 'slug') {
                        return (
                            <div key={field.key}>
                                <label className={`text-[10px] mb-1 block uppercase flex justify-between items-center ${fieldErrors.slug ? 'text-retro-pink' : 'text-gray-500'}`}>
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
                                        : `bg-black text-white ${fieldErrors.slug ? 'border-retro-pink' : 'border-retro-neon focus:border-retro-blue'}`
                                    }`}
                                    value={formData[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    readOnly={isSlugLocked}
                                    required={field.required}
                                />
                                {fieldErrors.slug && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {fieldErrors.slug}</div>}
                            </div>
                        );
                    }
                    
                    if (field.key === 'key_franchises') {
                        return (
                            <div key={field.key} className="col-span-1 md:col-span-2">
                                <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
                                <div className="w-full bg-black border border-gray-700 p-2 font-mono flex flex-wrap gap-2 min-h-[50px]">
                                    {franchises.map(tag => (
                                        <span key={tag} className="bg-retro-blue/20 text-retro-blue px-2 py-1 text-xs border border-retro-blue flex items-center gap-1">
                                            {tag}
                                            <button type="button" onClick={() => removeFranchise(tag)} className="hover:text-white font-bold">×</button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text"
                                        className="bg-transparent outline-none text-white flex-1 min-w-[120px]"
                                        placeholder="Type & Enter..."
                                        value={franchiseInput}
                                        onChange={(e) => setFranchiseInput(e.target.value)}
                                        onKeyDown={handleFranchiseKeyDown}
                                    />
                                </div>
                            </div>
                        );
                    }

                    if (field.key === 'image_url') {
                        return (
                            <div key={field.key} className="col-span-1 md:col-span-2">
                                <label className={`text-[10px] mb-1 block uppercase ${fieldErrors.image_url ? 'text-retro-pink' : 'text-gray-500'}`}>{field.label}</label>
                                <ImageUpload
                                    value={formData[field.key]}
                                    onChange={(url) => handleInputChange(field.key, url)}
                                />
                                {fieldErrors.image_url && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {fieldErrors.image_url}</div>}
                            </div>
                        );
                    }

                    return <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} error={fieldErrors[field.key]} />;
                })}
            </div>
            <div className="flex justify-end pt-4"><Button type="submit" isLoading={loading}>REGISTER FABRICATOR</Button></div>
        </form>
    );
};
