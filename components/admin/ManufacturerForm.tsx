'use client';

import { useState, type FormEvent, type FC, type KeyboardEvent, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addManufacturer, updateManufacturer, deleteManufacturer } from '../../app/actions';
import { purgeCache } from '../../app/actions/revalidate';
import { supabase } from '../../lib/supabase/singleton';
import { ManufacturerSchema, MANUFACTURER_FORM_FIELDS, Manufacturer } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';
import ImageUpload from '../ui/ImageUpload';

interface ManufacturerFormProps {
    initialData?: Manufacturer | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ManufacturerForm: FC<ManufacturerFormProps> = ({ initialData, onSuccess, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    // Franchise Tag State
    const [franchises, setFranchises] = useState<string[]>([]);
    const [franchiseInput, setFranchiseInput] = useState('');

    // Edit Mode Flag
    const isEditMode = !!initialData;

    // Load Initial Data for Edit Mode
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.key_franchises) {
                setFranchises(initialData.key_franchises.split(',').map(s => s.trim()).filter(Boolean));
            }
        }
    }, [initialData]);

    const generateSlug = (text: string) => {
        return (text || '').toLowerCase()
            .replace(/\s+/g, '-')          // Replace spaces with hyphens
            .replace(/[^a-z0-9-]/g, '')    // Remove special chars
            .replace(/-+/g, '-');          // Collapse multiple hyphens
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [key]: value };

            // Auto-update slug if locked and editing name
            // Only if NOT in edit mode.
            if (key === 'name' && isSlugLocked && !isEditMode) {
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

    const handleDelete = async () => {
        if (!initialData?.id) return;

        if (!confirm(`PERMANENTLY DELETE FABRICATOR "${formData.name}"?\n\nThis action cannot be undone and will fail if consoles are attached.`)) return;

        setLoading(true);
        try {
            const result = await deleteManufacturer(initialData.id);
            if (result.success) {
                await purgeCache();
                onSuccess("FABRICATOR DELETED.");
            } else {
                onError(`DELETE FAILED: ${result.message}`);
            }
        } catch (e: any) {
            onError(`DELETE ERROR: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // --- STANDARD AUTH CHECK ---
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
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
            founded_year: formData.founded_year // safeSchema handles parsing
        };

        const result = ManufacturerSchema.safeParse(rawData);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path.length > 0) newErrors[issue.path[0].toString()] = issue.message;
            });
            setFieldErrors(newErrors);
            onError("VALIDATION FAILED.");
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isEditMode && initialData?.id) {
                response = await updateManufacturer(initialData.id, result.data as any);
            } else {
                response = await addManufacturer(result.data as any);
            }

            if (response.success) {
                // FORCE REVALIDATION
                await purgeCache();

                if (!isEditMode) {
                    setFormData({});
                    setFranchises([]);
                    setFranchiseInput('');
                    setIsSlugLocked(true);
                }
                setFieldErrors({});
                setIsSuccess(true);
                router.refresh();
                onSuccess(isEditMode ? "FABRICATOR UPDATED." : "");
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
            } else {
                onError(`OPERATION FAILED: ${response.message}`);
            }
        } catch (err: any) {
            onError(`SYSTEM ERROR: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {isSuccess && (
                <div className="border border-green-500/50 bg-green-500/10 text-green-500 p-3 text-center font-mono text-xs font-bold uppercase tracking-wider">
                    {isEditMode ? 'FABRICATOR DATA UPDATED.' : 'FABRICATOR REGISTERED. READY FOR NEXT ENTRY.'}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
                {MANUFACTURER_FORM_FIELDS.map(field => {
                    // Custom Layout Rules based on field key or type
                    let colSpan = 'md:col-span-6'; // Default half width
                    if (field.key === 'image_url' || field.key === 'description' || field.key === 'key_franchises') {
                        colSpan = 'md:col-span-12';
                    }

                    if (field.key === 'slug') {
                        return (
                            <div key={field.key} className={colSpan}>
                                <label className={`text-[10px] mb-1.5 block uppercase font-bold tracking-wider flex justify-between items-center ${fieldErrors.slug ? 'text-red-500' : 'text-zinc-500'}`}>
                                    {field.label}
                                    <button
                                        type="button"
                                        onClick={() => setIsSlugLocked(!isSlugLocked)}
                                        className="text-[10px] text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                        title={isSlugLocked ? "Unlock to edit manually" : "Lock to auto-generate from name"}
                                    >
                                        [{isSlugLocked ? 'UNLOCK' : 'LOCK'}]
                                    </button>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full px-3 py-2 font-mono text-xs outline-none transition-colors border ${isSlugLocked
                                            ? 'bg-zinc-900 border-white/10 text-zinc-500 cursor-not-allowed'
                                            : `bg-bg-primary text-white ${fieldErrors.slug ? 'border-red-500' : 'border-white/10 focus:border-white'}`
                                        }`}
                                    value={formData[field.key] || ''}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(field.key, e.target.value)}
                                    readOnly={isSlugLocked}
                                />
                                {fieldErrors.slug && <div className="text-[9px] text-red-500 mt-1 font-mono uppercase font-bold">! {fieldErrors.slug}</div>}
                            </div>
                        );
                    }

                    if (field.key === 'key_franchises') {
                        return (
                            <div key={field.key} className={colSpan}>
                                <label className="text-[10px] text-zinc-500 mb-1.5 block uppercase font-bold tracking-wider">{field.label}</label>
                                <div className="w-full bg-bg-primary border border-white/10 p-2 font-mono flex flex-wrap gap-2 min-h-[50px] transition-colors hover:border-white/30">
                                    {franchises.map(tag => (
                                        <span key={tag} className="bg-zinc-900 text-white px-2 py-1 text-[10px] border border-white/20 flex items-center gap-1 uppercase">
                                            {tag}
                                            <button type="button" onClick={() => removeFranchise(tag)} className="hover:text-red-500 font-bold text-zinc-500 ml-1">×</button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        className="bg-transparent outline-none text-white flex-1 min-w-[120px] text-xs uppercase placeholder:text-zinc-700"
                                        placeholder="TYPE & ENTER..."
                                        value={franchiseInput}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFranchiseInput(e.target.value)}
                                        onKeyDown={handleFranchiseKeyDown}
                                    />
                                </div>
                            </div>
                        );
                    }

                    if (field.key === 'image_url') {
                        return (
                            <div key={field.key} className={colSpan}>
                                <label className={`text-[10px] mb-1.5 block uppercase font-bold tracking-wider ${fieldErrors.image_url ? 'text-red-500' : 'text-zinc-500'}`}>{field.label}</label>
                                <ImageUpload
                                    value={formData[field.key]}
                                    onChange={(url) => handleInputChange(field.key, url)}
                                />
                            </div>
                        );
                    }

                    return (
                        <div key={field.key} className={colSpan}>
                            <AdminInput
                                field={field}
                                value={formData[field.key]}
                                onChange={handleInputChange}
                                error={fieldErrors[field.key]}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                {isEditMode ? (
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="font-mono text-xs text-red-500 border border-red-900/30 bg-red-900/10 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        [ DELETE RECORD ]
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                <Button type="submit" variant="swiss" isLoading={loading}>
                    {isEditMode ? 'UPDATE FABRICATOR' : 'REGISTER FABRICATOR'}
                </Button>
            </div>
        </form>
    );
};
