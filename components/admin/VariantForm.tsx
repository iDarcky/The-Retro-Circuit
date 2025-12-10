
'use client';

import { useState, type FormEvent, type FC, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addConsoleVariant, updateConsoleVariant, getVariantsByConsole } from '../../lib/api';
import { purgeCache } from '../../app/actions/revalidate';
import { ConsoleVariantSchema, VARIANT_FORM_GROUPS, ConsoleVariant } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';
import ImageUpload from '../ui/ImageUpload';
import { EmulationForm } from './EmulationForm';

interface VariantFormProps {
    consoleList: {name: string, id: string}[];
    preSelectedConsoleId?: string | null;
    initialData?: ConsoleVariant | null; // For Edit Mode
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

const ChevronDown = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

export const VariantForm: FC<VariantFormProps> = ({ consoleList, preSelectedConsoleId, initialData, onSuccess, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    
    // Edit Mode Detection
    const isEditMode = !!initialData;

    // Emulation Form Toggle
    const [showEmulationForm, setShowEmulationForm] = useState(false);

    // Accordion State (Default First Section Open)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        "IDENTITY & ORIGIN": true
    });
    
    // Template System State
    const [existingVariants, setExistingVariants] = useState<ConsoleVariant[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    
    // Initialize Data
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else if (preSelectedConsoleId) {
            setFormData(prev => ({ ...prev, console_id: preSelectedConsoleId }));
        }
    }, [initialData, preSelectedConsoleId]);

    // Fetch existing variants for template system
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
            // Copy specs but reset identity fields
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

        // 2. Safe Parse using Zod Schema
        const result = ConsoleVariantSchema.safeParse(rawVariant);
        
        if (!result.success) { 
            const newErrors: Record<string, string> = {};
            let errorGroup = "";
            
            result.error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    const fieldKey = issue.path[0].toString();
                    newErrors[fieldKey] = issue.message;
                    // Auto-open section with error
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
            
            onError("VALIDATION FAILED. PLEASE CHECK HIGHLIGHTED FIELDS."); 
            return; 
        }

        setLoading(true);
        try {
            // TIMEOUT SAFETY: 10 Seconds
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Database operation timed out (10s limit)")), 10000)
            );

            let operationPromise;

            if (isEditMode && initialData?.id) {
                operationPromise = updateConsoleVariant(initialData.id, result.data as any);
            } else {
                operationPromise = addConsoleVariant(result.data as any);
            }
            
            // Race: Operation vs Timeout
            const response: any = await Promise.race([operationPromise, timeoutPromise]);
            
            if (response.success) {
                await purgeCache();
                onSuccess(isEditMode ? "VARIANT UPDATED." : "VARIANT SAVED.");
                setFieldErrors({});
                router.refresh();
                
                // Refresh local templates
                if (rawVariant.console_id) {
                    const updatedVariants = await getVariantsByConsole(rawVariant.console_id);
                    setExistingVariants(updatedVariants);
                }

                if (!isEditMode) {
                    if (mode === 'SAVE') {
                        // Reset form but keep console selected
                        setFormData({ console_id: rawVariant.console_id });
                        setSelectedTemplate('');
                        setOpenSections({ "IDENTITY & ORIGIN": true });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        // CLONE mode: Keep specs, just clear identity
                        setFormData(prev => ({ 
                            ...prev, 
                            variant_name: '', 
                            slug: '',
                            is_default: false, 
                            model_no: ''
                        }));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="space-y-6">
            
            {/* 1. Header Card */}
            <div className={`border-l-4 p-5 mb-6 bg-black/40 shadow-md flex justify-between items-start ${isEditMode ? 'border-retro-neon' : 'border-retro-pink'}`}>
                <div>
                    <h3 className={`font-bold text-sm uppercase font-mono tracking-widest ${isEditMode ? 'text-retro-neon' : 'text-retro-pink'}`}>
                        {isEditMode ? 'Edit Mode: Variant Specifications' : 'Step 2: Technical Specifications'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 font-mono">
                        {isEditMode 
                            ? `Modifying Variant ID: ${initialData?.id}` 
                            : 'Define the hardware capabilities. You can create multiple variants (e.g. Pro, Slim, OLED) for this console.'}
                    </p>
                </div>
            </div>

            <form className="space-y-6">
                {/* 2. Console Selector & Template Copy */}
                <div className="mb-8 space-y-6 bg-black/20 p-6 border border-retro-grid relative">
                    <div className="absolute top-0 left-0 bg-retro-grid text-[10px] text-gray-400 px-2 py-0.5 font-mono uppercase">Context</div>
                    
                    <div>
                        <label className={`text-[10px] mb-2 block uppercase font-bold tracking-wider ${fieldErrors.console_id ? 'text-retro-pink' : 'text-gray-500'}`}>
                            Target Console Folder
                        </label>
                        <select 
                            className={`w-full bg-black border p-3 outline-none text-white font-mono text-sm ${fieldErrors.console_id ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon'} ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={formData.console_id || ''} 
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('console_id', e.target.value)}
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
                                Quick Fill: Copy Specs From Existing Variant
                            </label>
                            <select 
                                className="w-full bg-black border border-retro-blue text-retro-blue p-2 font-mono text-xs focus:outline-none"
                                value={selectedTemplate}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleTemplateSelect(e.target.value)}
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

                {/* 3. Form Sections (Accordions) */}
                <div className="space-y-4">
                    {VARIANT_FORM_GROUPS.map((group, idx) => {
                        const isOpen = openSections[group.title];
                        const hasError = group.fields.some(f => fieldErrors[f.key]);

                        return (
                            <div key={idx} className="relative transition-all duration-300">
                                {/* Card Container with Neon Border */}
                                <div className={`
                                    bg-black/40 border-l-4 
                                    ${hasError ? 'border-retro-pink' : 'border-retro-neon'}
                                    shadow-lg transition-colors
                                `}>
                                    {/* Accordion Header */}
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(group.title)}
                                        className={`
                                            w-full flex justify-between items-center p-4 text-left font-mono uppercase tracking-widest text-sm
                                            ${isOpen 
                                                ? 'text-white bg-white/5 font-bold' 
                                                : 'text-gray-400 hover:text-retro-neon hover:bg-white/5'}
                                            transition-colors
                                        `}
                                    >
                                        <span className="flex items-center gap-3">
                                            {hasError && <span className="text-retro-pink animate-pulse font-bold">!</span>}
                                            {group.title}
                                        </span>
                                        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-retro-neon' : 'text-gray-600'}`}>
                                            <ChevronDown />
                                        </div>
                                    </button>

                                    {/* Content Grid */}
                                    {isOpen && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 animate-fadeIn">
                                            {group.fields.map(field => {
                                                const colSpan = (field as any).width === 'full' ? 'md:col-span-2' : 'md:col-span-1';
                                                const error = fieldErrors[field.key];

                                                // A. CUSTOM RENDER: URL / Image Upload
                                                if (field.type === 'url' || field.key.includes('image_url')) {
                                                    return (
                                                        <div key={field.key} className={colSpan}>
                                                            <label className={`text-[10px] mb-2 block uppercase font-bold tracking-wider ${error ? 'text-retro-pink' : 'text-gray-500'}`}>
                                                                {field.label}
                                                            </label>
                                                            <ImageUpload
                                                                value={formData[field.key]}
                                                                onChange={(url) => handleInputChange(field.key, url)}
                                                            />
                                                        </div>
                                                    );
                                                }

                                                // B. CUSTOM RENDER: Styled Checkbox (Label Left, Box Right)
                                                if (field.type === 'checkbox') {
                                                    const rawVal = formData[field.key];
                                                    // Strictly check for true boolean or "true" string to handle potential DB type mismatch
                                                    const checked = String(rawVal) === 'true';
                                                    
                                                    return (
                                                        <div key={field.key} className={colSpan}>
                                                            <div 
                                                                className={`
                                                                    flex items-center justify-between bg-black border p-3 cursor-pointer group transition-all h-[46px] mt-[19px]
                                                                    ${error ? 'border-retro-pink' : 'border-gray-700 hover:border-retro-neon'}
                                                                `}
                                                                onClick={() => handleInputChange(field.key, !checked)}
                                                            >
                                                                <span className={`text-[10px] uppercase font-bold tracking-wider group-hover:text-white ${error ? 'text-retro-pink' : 'text-gray-500'}`}>
                                                                    {field.label}
                                                                </span>
                                                                <div className={`w-5 h-5 border flex items-center justify-center transition-all ${checked ? 'bg-retro-neon border-retro-neon' : 'border-gray-600 bg-transparent'}`}>
                                                                    {checked && <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                                                </div>
                                                            </div>
                                                            {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
                                                        </div>
                                                    )
                                                }

                                                // C. DEFAULT RENDER: AdminInput (Text, Number)
                                                return (
                                                    <div key={field.key} className={colSpan}>
                                                        <AdminInput 
                                                            field={field as any} 
                                                            value={formData[field.key]} 
                                                            onChange={handleInputChange} 
                                                            error={error} 
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* NEW: Emulation Performance Section (Bottom of Form) */}
                {isEditMode && initialData?.id && (
                    <div className="mt-8 border-t-2 border-dashed border-retro-grid pt-8 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-pixel text-sm text-retro-blue">
                                EXTENDED CONFIGURATION
                            </h3>
                        </div>
                        
                        {!showEmulationForm ? (
                            <button
                                type="button"
                                onClick={() => setShowEmulationForm(true)}
                                className="w-full py-4 border-2 border-retro-blue bg-retro-blue/10 text-retro-blue font-pixel text-sm hover:bg-retro-blue hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(59,130,246,0.2)] group"
                            >
                                <span className="w-2 h-2 bg-retro-blue rounded-full animate-pulse group-hover:bg-black"></span>
                                [ EDIT EMULATION PERFORMANCE ]
                            </button>
                        ) : (
                            <div className="border-2 border-retro-blue shadow-[0_0_20px_rgba(59,130,246,0.2)] relative">
                                <div className="bg-retro-blue/20 p-2 flex justify-between items-center border-b border-retro-blue/50">
                                    <span className="text-[10px] font-mono text-retro-blue px-2">PERFORMANCE MATRIX</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowEmulationForm(false)}
                                        className="text-[10px] font-mono text-retro-blue hover:text-white uppercase px-2 py-1 hover:bg-retro-blue/20"
                                    >
                                        [ CLOSE MANAGER ]
                                    </button>
                                </div>
                                <EmulationForm 
                                    variantId={initialData.id} 
                                    onSave={() => onSuccess("EMULATION DATA SYNCED.")} 
                                />
                            </div>
                        )}
                    </div>
                )}
                
                {/* 4. Footer Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-retro-grid sticky bottom-0 bg-retro-dark/95 backdrop-blur p-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
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
        </div>
    );
};
