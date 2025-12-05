
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
    const [loading, setLoading] = useState(false);
    
    // Template System State
    const [existingVariants, setExistingVariants] = useState<ConsoleVariant[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    
    // Sync pre-selected console when it changes
    useEffect(() => {
        if (preSelectedConsoleId) {
            setFormData(prev => ({ ...prev, console_id: preSelectedConsoleId }));
        }
    }, [preSelectedConsoleId]);

    // Fetch existing variants when parent console is selected
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
        if (!variantId) return;

        const template = existingVariants.find(v => v.id === variantId);
        if (template) {
            // Destructure to separate identity fields from specs
            const { 
                id, // Remove ID
                variant_name, 
                slug, 
                is_default, 
                price_launch_usd, 
                image_url, // Optional: Keep or clear image? Let's keep image for variants usually share design, but arguably clear it. User said "Clear name, slug, is_default, price".
                ...specs 
            } = template;

            setFormData(prev => ({
                ...specs,
                console_id: prev.console_id, // Ensure we stay on the current parent
                variant_name: '', // Reset identity
                slug: '',
                is_default: false,
                price_launch_usd: '', // Reset price
                image_url: image_url // Keep image as it might be useful, easy to clear if needed
            }));
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent, mode: 'SAVE' | 'CLONE' = 'SAVE') => {
        e.preventDefault();

        const rawVariant = { ...formData };
        
        // Automate slug generation
        if (rawVariant.variant_name) {
            rawVariant.slug = rawVariant.variant_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const result = ConsoleVariantSchema.safeParse(rawVariant);
        if (!result.success) { onError(result.error.issues[0].message); return; }

        setLoading(true);
        const response = await addConsoleVariant(result.data as any);
        
        if (response.success) {
            onSuccess(mode === 'CLONE' ? "VARIANT SAVED. FORM PRESERVED FOR NEXT MODEL." : "VARIANT MODEL REGISTERED");
            
            // Refresh templates list immediately
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
                    Define the hardware. Create a &quot;Base Model&quot; first, then use &quot;Save & Clone&quot; to quickly add Pro/Lite versions.
                </p>
            </div>

            <div className="mb-4 space-y-6">
                <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Parent Console</label>
                    <select 
                        className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono" 
                        value={formData.console_id || ''} 
                        onChange={(e) => handleInputChange('console_id', e.target.value)}
                        required
                    >
                        <option value="">-- Select Console Folder --</option>
                        {consoleList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
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
                                        <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
                                        <input 
                                            name="variant_name_focus_target"
                                            type="text"
                                            className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            required={(field as any).required}
                                        />
                                    </div>
                                )
                            }
                            return <AdminInput key={field.key} field={field as any} value={formData[field.key]} onChange={handleInputChange} />
                        })}
                    </div>
                </div>
            ))}
            
            <div className="flex justify-end gap-4 pt-4 border-t border-retro-grid sticky bottom-0 bg-retro-dark p-4 z-10 border-t">
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
