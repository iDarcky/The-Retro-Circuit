

'use client';

import { useState, type FormEvent, type FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addConsoleVariant, updateConsoleVariant, getVariantsByConsole } from '../../lib/api';
import { purgeCache } from '../../app/actions/revalidate';
import { ConsoleVariantSchema, VARIANT_FORM_GROUPS, ConsoleVariant } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';
import ImageUpload from '../ui/ImageUpload';

interface VariantFormProps {
    consoleList: {name: string, id: string}[];
    preSelectedConsoleId?: string | null;
    initialData?: ConsoleVariant | null; // For Edit Mode
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

const ChevronDown = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ChevronUp = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;

export const VariantForm: FC<VariantFormProps> = ({ consoleList, preSelectedConsoleId, initialData, onSuccess, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    
    // Edit Mode Detection
    const isEditMode = !!initialData;

    // Accordion State
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        "IDENTITY & ORIGIN": true
    });
    
    // Template System State
    const [existingVariants, setExistingVariants] = useState<ConsoleVariant[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    
    // Initialize
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else if (preSelectedConsoleId) {
            setFormData(prev => ({ ...prev, console_id: preSelectedConsoleId }));
        }
    }, [initialData, preSelectedConsoleId]);

    // Fetch existing variants
    useEffect(() => {
        const fetchTemplates = async () => {
            const consoleId = formData.console_id;
            if (consoleId) {
                const variants = await getVariantsByConsole(consoleId);
                setExistingVariants(variants);
                setSelectedTemplate(''); 
            } else {
                setExistingVariants([]);
            }
        };
        fetchTemplates();
    }, [formData.console_id]);

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleTemplateSelect = (variantId: string) => {
        if (isEditMode) return; 

        setSelectedTemplate(variantId);
        setFieldErrors({});
        
        if (!variantId) return;

        const template = existingVariants.find(v => v.id === variantId);
        if (template) {
            const { id, variant_name, slug, is_default, price_launch_usd, model_no, ...specs } = template;

            setFormData(prev => ({
                ...specs,
                console_id: prev.console_id, 
                variant_name: '', 
                slug: '',
                is_default: false,
                price_launch_usd: '', 
                model_no: '',
                image_url: template.image_url 
            }));
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const handleSubmit = async (e: FormEvent, mode: 'SAVE' | 'CLONE' = 'SAVE') => {
        e.preventDefault();

        // 1. Prepare Data
        const rawVariant = { ...formData };
        
        // Auto-slug if name exists
        if (rawVariant.variant_name && !rawVariant.slug) {
            rawVariant.slug = rawVariant.variant_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        // 2. Safe Parse (Permissive Schema)
        const result = ConsoleVariantSchema.safeParse(rawVariant);
        
        if (!result.success) { 
            const newErrors: Record<string, string> = {};
            let errorGroup = "";
            
            result.error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    const fieldKey = issue.path[0].toString();
                    newErrors[fieldKey] = issue.message;
                    if (!errorGroup) {
                         const group = VARIANT_FORM_GROUPS.find(g => g.fields.some(f => f.key === fieldKey));
                         if (group) errorGroup = group.title;
                    }
                }
            });
            
            setFieldErrors(newErrors);
            if (errorGroup) {
                setOpenSections(prev => ({ ...prev, [errorGroup]: true }));
            }
            
            onError("VALIDATION FAILED."); 
            return; 
        }

        setLoading(true);
        try {
            let response;
            if (isEditMode && initialData?.id) {
                response = await updateConsoleVariant(initialData.id, result.data as any);
            } else {
                response = await addConsoleVariant(result.data as any);
            }
            
            if (response.success) {
                // FORCE REVALIDATION
                await purgeCache();
                
                onSuccess(isEditMode ? "VARIANT UPDATED." : "VARIANT SAVED.");
                setFieldErrors({});
                
                // Refresh client side
                router.refresh();
                
                if (rawVariant.console_id) {
                    const updatedVariants = await getVariantsByConsole(rawVariant.console_id);
                    setExistingVariants(updatedVariants);
                }

                if (!isEditMode) {
                    if (mode === 'SAVE') {
                        setFormData({ console_id: rawVariant.console_id });
                        setSelectedTemplate('');
                        setOpenSections({ "IDENTITY & ORIGIN": true });
                    } else {
                        setFormData(prev => ({ 
                            ...prev, 
                            variant_name: '', 
                            slug: '',
                            is_default: false, 
                            model_no: ''
                        }));
                    }
                }
            } else {
                onError(`OPERATION FAILED: ${response.message}`);
            }
        } catch (error: any) {
            onError(`SYSTEM ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6">
            <div className={`border-l-4 p-4 mb-4 ${isEditMode ? 'bg-retro-neon/10 border-retro-neon' : 'bg-retro-pink/10 border-retro-pink'}`}>
                <h3 className={`font-bold text-sm uppercase ${isEditMode ? 'text-retro-neon' : 'text-retro-pink'}`}>
                    {isEditMode ? 'Edit Mode: Updating Existing Variant' : 'Step 2: Technical Specifications'}
                </h3>
                <p className="text-xs text-gray-400">
                    Define the hardware. Create a "Base Model" first.
                </p>
            </div>

            <div className="mb-8 space-y-6">
                <div>
                    <label className={`text-[10px] mb-1 block uppercase ${fieldErrors.console_id ? 'text-retro-pink' : 'text-gray-500'}`}>Parent Console</label>
                    <select 
                        className={`w-full bg-black border p-3 outline-none text-white font-mono ${fieldErrors.console_id ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon'} ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        value={formData.console_id || ''} 
                        onChange={(e) => handleInputChange('console_id', e.target.value)}
                        required
                        disabled={isEditMode}
                    >
                        <option value="">-- Select Console Folder --</option>
                        {consoleList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {!isEditMode && existingVariants.length > 0 && (
                    <div className="p-4 border border-dashed border-retro-blue bg-retro-blue/5 animate-fadeIn">
                        <label className="text-[10px] text-retro-blue mb-2 block uppercase font-bold flex items-center gap-2">
                             <span className="w-2 h-2 bg-retro-blue rounded-full animate-pulse"></span>
                             Copy Specs From (Optional)
                        </label>
                        <select 
                            className="w-full bg-black border border-retro-blue text-retro-blue p-2 font-mono text-xs focus:outline-none"
                            value={selectedTemplate}
                            onChange={(e) => handleTemplateSelect(e.target.value)}
                        >
                            <option value="">-- Select a Base Model Template --</option>
                            {existingVariants.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.variant_name} {v.is_default ? '(Default)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {VARIANT_FORM_GROUPS.map((group, idx) => {
                    const isOpen = openSections[group.title];
                    const hasError = group.fields.some(f => fieldErrors[f.key]);

                    return (
                        <div key={idx} className={`border ${hasError ? 'border-retro-pink' : 'border-retro-grid'} bg-black/50 transition-colors`}>
                            <button
                                type="button"
                                onClick={() => toggleSection(group.title)}
                                className={`w-full flex justify-between items-center p-4 text-left transition-colors ${
                                    isOpen 
                                    ? `bg-retro-neon/10 text-retro-neon border-b ${hasError ? 'border-retro-pink' : 'border-retro-neon'}`
                                    : `hover:bg-white/5 ${hasError ? 'text-retro-pink' : 'text-gray-400'}`
                                }`}
                            >
                                <span className="font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                                    {group.title}
                                </span>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </button>

                            {isOpen && (
                                <div className="p-4 grid grid-cols-2 gap-4 animate-fadeIn">
                                    {group.fields.map(field => {
                                        const colSpan = (field as any).width === 'full' ? 'col-span-2' : 'col-span-1';
                                        
                                        if (field.key === 'variant_name') {
                                            return (
                                                <div key={field.key} className={colSpan}>
                                                    <label className={`text-[10px] mb-1 block uppercase ${fieldErrors[field.key] ? 'text-retro-pink' : 'text-gray-500'}`}>{field.label}</label>
                                                    <input 
                                                        name="variant_name_focus_target"
                                                        type="text"
                                                        className={`w-full bg-black border p-3 outline-none text-white font-mono ${fieldErrors[field.key] ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon'}`}
                                                        value={formData[field.key] || ''}
                                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                    />
                                                    {fieldErrors[field.key] && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {fieldErrors[field.key]}</div>}
                                                </div>
                                            )
                                        }

                                        if (field.key === 'image_url') {
                                            return (
                                                <div key={field.key} className={colSpan}>
                                                    <label className={`text-[10px] mb-1 block uppercase ${fieldErrors.image_url ? 'text-retro-pink' : 'text-gray-500'}`}>{field.label}</label>
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
                                                    field={field as any} 
                                                    value={formData[field.key]} 
                                                    onChange={handleInputChange} 
                                                    error={fieldErrors[field.key]} 
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="flex justify-end gap-4 pt-4 border-t border-retro-grid sticky bottom-0 bg-retro-dark p-4 z-10 border-t shadow-lg">
                {!isEditMode && (
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={(e) => handleSubmit(e, 'CLONE')} 
                        isLoading={loading}
                        className="border-dashed"
                    >
                        [ SAVE & CLONE ]
                    </Button>
                )}
                <Button 
                    type="submit" 
                    onClick={(e) => handleSubmit(e, 'SAVE')} 
                    isLoading={loading}
                >
                    {isEditMode ? 'UPDATE UNIT' : 'REGISTER UNIT'}
                </Button>
            </div>
        </form>
    );
};