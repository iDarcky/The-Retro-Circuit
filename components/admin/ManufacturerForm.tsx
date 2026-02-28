
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {isSuccess && (
                <div className="bg-secondary/10 border border-secondary text-secondary p-4 text-center font-bold animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.2)] uppercase tracking-wider">
                    {isEditMode ? 'FABRICATOR DATA UPDATED.' : 'FABRICATOR REGISTERED. READY FOR NEXT ENTRY.'}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bg-primary/20 p-6 border border-border-normal">
                {MANUFACTURER_FORM_FIELDS.map(field => {
                    if (field.key === 'slug') {
                        return (
                            <div key={field.key}>
                                <label className={`text-[10px] mb-1 block uppercase tracking-wider flex justify-between items-center ${fieldErrors.slug ? 'text-accent' : 'text-gray-500'}`}>
                                    {field.label}
                                    <button
                                        type="button"
                                        onClick={() => setIsSlugLocked(!isSlugLocked)}
                                        className="text-[10px] text-gray-500 hover:text-text-primary transition-colors cursor-pointer"
                                        title={isSlugLocked ? "Unlock to edit manually" : "Lock to auto-generate from name"}
                                    >
                                        [{isSlugLocked ? 'UNLOCK' : 'LOCK'}]
                                    </button>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full border p-3 font-mono text-sm outline-none transition-colors ${isSlugLocked
                                            ? 'bg-bg-secondary border-border-normal text-gray-500 cursor-not-allowed opacity-75'
                                            : `bg-bg-primary text-text-primary ${fieldErrors.slug ? 'border-accent' : 'border-border-normal focus:border-border-strong'}`
                                        }`}
                                    value={formData[field.key] || ''}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(field.key, e.target.value)}
                                    readOnly={isSlugLocked}
                                />
                                {fieldErrors.slug && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {fieldErrors.slug}</div>}
                            </div>
                        );
                    }

                    if (field.key === 'key_franchises') {
                        return (
                            <div key={field.key} className="col-span-1 md:col-span-2">
                                <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">{field.label}</label>
                                <div className="w-full bg-bg-primary border border-border-normal p-2 font-mono flex flex-wrap gap-2 min-h-[50px] transition-colors hover:border-border-strong">
                                    {franchises.map(tag => (
                                        <span key={tag} className="bg-bg-secondary text-primary px-2 py-1 text-xs border border-border-normal flex items-center gap-1 uppercase">
                                            {tag}
                                            <button type="button" onClick={() => removeFranchise(tag)} className="hover:text-text-primary font-bold text-gray-500">×</button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        className="bg-transparent outline-none text-text-primary flex-1 min-w-[120px] text-xs uppercase placeholder:text-gray-700"
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
                            <div key={field.key} className="col-span-1 md:col-span-2">
                                <label className={`text-[10px] mb-1 block uppercase tracking-wider ${fieldErrors.image_url ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                                <div className="border border-border-normal bg-bg-primary p-4">
                                    <ImageUpload
                                        value={formData[field.key]}
                                        onChange={(url) => handleInputChange(field.key, url)}
                                    />
                                </div>
                            </div>
                        );
                    }

                    return <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} error={fieldErrors[field.key]} />;
                })}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-border-normal">
                {isEditMode ? (
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="font-mono text-xs text-red-500 border border-red-900 bg-red-900/10 px-4 py-2 hover:bg-red-500 hover:text-text-primary transition-colors uppercase tracking-widest"
                    >
                        [ DELETE RECORD ]
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                <Button type="submit" isLoading={loading}>
                    {isEditMode ? 'UPDATE FABRICATOR' : 'REGISTER FABRICATOR'}
                </Button>
            </div>
        </form>
    );
};
