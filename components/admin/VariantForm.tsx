'use client';

import { useState, type FormEvent, type FC, useEffect } from 'react';
import { addConsoleVariant, getVariantsByConsole } from '../../lib/api';
import { ConsoleVariantSchema, VARIANT_FORM_GROUPS, ConsoleVariant } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

interface VariantFormProps {
    consoleList: {name: string, id: string}[];
    preSelectedConsoleId?: string | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const VariantForm: FC<VariantFormProps> = ({ consoleList, preSelectedConsoleId, onSuccess, onError }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    
    // Template System State
    const [existingVariants, setExistingVariants] = useState<ConsoleVariant[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    
    // Sync pre-selected console when it changes (e.g. coming from ConsoleForm)
    useEffect(() => {
        if (preSelectedConsoleId) {
            setFormData(prev => ({ ...prev, console_id: preSelectedConsoleId }));
        }
    }, [preSelectedConsoleId]);

    // Fetch existing variants when parent console is selected (Load Template Logic)
    useEffect(() => {
        const fetchTemplates = async () => {
            const consoleId = formData.console_id;
            if (consoleId) {
                const variants = await getVariantsByConsole(consoleId);
                setExistingVariants(variants);
                setSelectedTemplate(''); // Reset template selection on console change
            } else {
                setExistingVariants([]);
            }
        };
        fetchTemplates();
    }, [formData.console_id]);

    const handleTemplateSelect = (variantId: string) => {
        setSelectedTemplate(variantId);
        // Clear any previous validation errors when loading a fresh template
        setFieldErrors({});
        
        if (!variantId) return;

        const template = existingVariants.find(v => v.id === variantId);
        if (template) {
            // Destructure to separate identity/unique fields from copyable specs
            const { 
                id, 
                variant_name, 
                slug, 
                is_default, 
                price_launch_usd, 
                // We keep image_url as a base, but everything else is copied
                ...specs 
            } = template;

            // Overwrite form data with template specs, but clear unique identity fields
            setFormData(prev => ({
                ...specs,
                console_id: prev.console_id, // Lock to current parent
                variant_name: '', // Force user to name the new variant
                slug: '',
                is_default: false,
                price_launch_usd: '', 
                image_url: template.image_url // Carry over image, easy to change if needed
            }));
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        // Clear error for this field as user types
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

        const rawVariant = { ...formData };
        
        // Automate slug generation
        if (rawVariant.variant_name) {
            rawVariant.slug = rawVariant.variant_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const result = ConsoleVariantSchema.safeParse(rawVariant);
        if (!result.success) { 
            // Map errors to fields
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    newErrors[issue.path[0].toString()] = issue.message;
                }
            });
            setFieldErrors(newErrors);
            onError("VALIDATION FAILED. CHECK HIGHLIGHTED FIELDS."); 
            return; 
        }

        setLoading(true);
        const response = await addConsoleVariant(result.data as any);
        
        if (response.success) {
            onSuccess(mode === 'CLONE' ? "VARIANT SAVED. FORM PRESERVED FOR NEXT MODEL." : "VARIANT MODEL REGISTERED");
            setFieldErrors({});
            
            // Refresh templates list immediately (so the one we just made is available)
            if (rawVariant.console_id) {
                const updatedVariants = await getVariantsByConsole(rawVariant.console_id);
                setExistingVariants(updatedVariants);
            }

            if (mode === 'SAVE') {
                // Clear Form, but keep the parent console selected for convenience
                setFormData({ console_id: rawVariant.console_id });
                setSelectedTemplate('');
            } else {
                // Clone Mode: Keep data, reset Identity fields
                setFormData(prev => ({ 
                    ...prev, 
                    variant_name: '', // Clear name to force re-entry
                    slug: '',
                    is_default: false // Assuming clone isn't default
                }));
                // Focus the name input
                setTimeout(() => {
                    const nameInput = document.querySelector('input[name="variant_name_focus_target"]') as HTMLInputElement;
                    if (nameInput) nameInput.focus();
                }, 100);
            }
        } else {
            onError(`VARIANT FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    return (
        <form className="space-y-8">
            <div className="bg-retro-pink/10 border-l-4 border-retro-pink p-4 mb-4">
                <h3 className="font-bold text-retro-pink text-sm uppercase">Step 2: Technical Specifications</h3>
                <p className="text-xs text-gray-400">
                    Define the hardware. Create a &quot;Base Model&quot; first, then use &quot;Save & Clone&quot; (or Load Template) to quickly add Pro/Lite versions.
                </p>
            </div>

            <div className="mb-4 space-y-6">
                <div>
                    <label className={`text-[10px] mb-1 block uppercase ${fieldErrors.console_id ? 'text-retro-pink' : 'text-gray-500'}`}>Parent Console</label>
                    <select 
                        className={`w-full bg-black border p-3 outline-none text-white font-mono ${fieldErrors.console_id ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon'}`}
                        value={formData.console_id || ''} 
                        onChange={(e) => handleInputChange('console_id', e.target.value)}
                        required
                    >
                        <option value="">-- Select Console Folder --</option>
                        {consoleList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {fieldErrors.console_id && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {fieldErrors.console_id}</div>}
                </div>

                {/* TEMPLATE SYSTEM */}
                {existingVariants.length > 0 && (
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
                        <p className="text-[10px] text-gray-400 mt-2">
                            * Auto-fills specs (CPU, GPU, RAM, etc) but keeps Name/Price blank for safety.
                        </p>
                    </div>
                )}
            </div>

            {VARIANT_FORM_GROUPS.map((group, idx) => (
                <div key={idx} className="bg-black/30 p-4 border border-gray-800">
                    <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase">{group.title}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.fields.map(field => {
                            // Hack to target focus
                            if (field.key === 'variant_name') {
                                return (
                                    <div key={field.key}>
                                        <label className={`text-[10px] mb-1 block uppercase ${fieldErrors[field.key] ? 'text-retro-pink' : 'text-gray-500'}`}>{field.label}</label>
                                        <input 
                                            name="variant_name_focus_target"
                                            type="text"
                                            className={`w-full bg-black border p-3 outline-none text-white font-mono ${fieldErrors[field.key] ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon'}`}
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            required={(field as any).required}
                                        />
                                        {fieldErrors[field.key] && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {fieldErrors[field.key]}</div>}
                                    </div>
                                )
                            }
                            return <AdminInput key={field.key} field={field as any} value={formData[field.key]} onChange={handleInputChange} error={fieldErrors[field.key]} />
                        })}
                    </div>
                </div>
            ))}
            
            <div className="flex justify-end gap-4 pt-4 border-t border-retro-grid sticky bottom-0 bg-retro-dark p-4 z-10 border-t shadow-lg">
                <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={(e) => handleSubmit(e, 'CLONE')} 
                    isLoading={loading}
                    className="border-dashed"
                >
                    [ SAVE & CLONE ]
                </Button>
                <Button 
                    type="submit" 
                    onClick={(e) => handleSubmit(e, 'SAVE')} 
                    isLoading={loading}
                >
                    REGISTER UNIT
                </Button>
            </div>
        </form>
    );
};
