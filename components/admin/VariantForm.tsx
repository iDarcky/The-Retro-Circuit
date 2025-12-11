
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
    
    const isEditMode = !!initialData;
    const [showEmulationForm, setShowEmulationForm] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        "IDENTITY & ORIGIN": true,
        "INPUT & MECHANICS": true, // Also open this section
    });
    
    const [existingVariants, setExistingVariants] = useState<ConsoleVariant[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');

    const [ramInput, setRamInput] = useState<{ value: string | number, unit: 'GB' | 'MB' }>({ value: '', unit: 'GB' });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            const mb = Number(initialData.ram_mb);
            if (!isNaN(mb) && mb > 0) {
                 if (mb >= 1024 && mb % 1024 === 0) {
                     setRamInput({ value: mb / 1024, unit: 'GB' });
                 } else {
                     setRamInput({ value: mb, unit: 'MB' });
                 }
            }
        } else if (preSelectedConsoleId) {
            setFormData(prev => ({ ...prev, console_id: preSelectedConsoleId }));
        }
    }, [initialData, preSelectedConsoleId]);

    const handleRamChange = (newVal: string | number, newUnit: 'GB' | 'MB') => {
        setRamInput({ value: newVal, unit: newUnit });
        const val = Number(newVal);
        if (!isNaN(val)) {
            handleInputChange('ram_mb', newUnit === 'GB' ? val * 1024 : val);
        } else {
            handleInputChange('ram_mb', 0);
        }
    };

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

    useEffect(() => {
        const size = parseFloat(formData.screen_size_inch);
        const w = parseFloat(formData.screen_resolution_x);
        const h = parseFloat(formData.screen_resolution_y);
        if (!isNaN(size) && size > 0 && !isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
            const ppi = Math.round(Math.sqrt(w * w + h * h) / size);
            const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
            const divisor = gcd(w, h);
            let ratioX = w / divisor, ratioY = h / divisor;
            if (ratioX === 8 && ratioY === 5) { ratioX = 16; ratioY = 10; }
            const ratio = `${ratioX}:${ratioY}`;
            setFormData(prev => {
                if (prev.ppi === ppi && prev.aspect_ratio === ratio) return prev;
                return { ...prev, ppi, aspect_ratio: ratio };
            });
        }
    }, [formData.screen_size_inch, formData.screen_resolution_x, formData.screen_resolution_y]);

    useEffect(() => {
        const size = parseFloat(formData.second_screen_size_inch);
        const w = parseFloat(formData.second_screen_resolution_x);
        const h = parseFloat(formData.second_screen_resolution_y);
        if (!isNaN(size) && size > 0 && !isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
            const ppi = Math.round(Math.sqrt(w * w + h * h) / size);
            const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
            const divisor = gcd(w, h);
            const ratio = `${w / divisor}:${h / divisor}`;
            setFormData(prev => {
                if (prev.second_screen_ppi === ppi && prev.second_screen_aspect_ratio === ratio) return prev;
                return { ...prev, second_screen_ppi: ppi, second_screen_aspect_ratio: ratio };
            });
        }
    }, [formData.second_screen_size_inch, formData.second_screen_resolution_x, formData.second_screen_resolution_y]);

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
                ...specs, console_id: prev.console_id, variant_name: '', slug: '',
                is_default: false, price_launch_usd: '', model_no: '', image_url: template.image_url
            }));
            const mb = Number(template.ram_mb);
            if (!isNaN(mb) && mb > 0) {
                 if (mb >= 1024 && mb % 1024 === 0) setRamInput({ value: mb / 1024, unit: 'GB' });
                 else setRamInput({ value: mb, unit: 'MB' });
            } else {
                setRamInput({ value: '', unit: 'GB' });
            }
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) {
            setFieldErrors(prev => { const next = { ...prev }; delete next[key]; return next; });
        }
    };

    const handleSubmit = async (e: FormEvent, mode: 'SAVE' | 'CLONE' = 'SAVE') => {
        e.preventDefault();
        const rawVariant = { ...formData };
        if (rawVariant.variant_name && !rawVariant.slug) {
            rawVariant.slug = rawVariant.variant_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        const result = ConsoleVariantSchema.safeParse(rawVariant);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            let errorGroup = "";
            result.error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    const fieldKey = issue.path[0].toString();
                    newErrors[fieldKey] = issue.message;
                    if (!errorGroup) {
                         const group = VARIANT_FORM_GROUPS.find(g => g.fields.some(f => f.key && f.key === fieldKey));
                         if (group) errorGroup = group.title;
                    }
                }
            });
            setFieldErrors(newErrors);
            if (errorGroup) setOpenSections(prev => ({ ...prev, [errorGroup]: true }));
            onError("VALIDATION FAILED. PLEASE CHECK HIGHLIGHTED FIELDS."); 
            return; 
        }

        setLoading(true);
        try {
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Database timeout")), 10000));
            let promise;
            if (isEditMode && initialData?.id) {
                promise = updateConsoleVariant(initialData.id, result.data as any);
            } else {
                promise = addConsoleVariant(result.data as any);
            }
            const response: any = await Promise.race([promise, timeout]);
            if (response.success) {
                await purgeCache();
                onSuccess(isEditMode ? "VARIANT UPDATED." : "VARIANT SAVED.");
                setFieldErrors({});
                router.refresh();
                if (rawVariant.console_id) {
                    const updated = await getVariantsByConsole(rawVariant.console_id);
                    setExistingVariants(updated);
                }
                if (!isEditMode) {
                    if (mode === 'SAVE') {
                        setFormData({ console_id: rawVariant.console_id });
                        setRamInput({ value: '', unit: 'GB' });
                        setSelectedTemplate('');
                        setOpenSections({ "IDENTITY & ORIGIN": true });
                    } else {
                        setFormData(prev => ({ ...prev, variant_name: '', slug: '', is_default: false, model_no: '' }));
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className={`border-l-4 p-5 mb-6 bg-black/40 shadow-md ${isEditMode ? 'border-retro-neon' : 'border-retro-pink'}`}>
                <h3 className={`font-bold text-sm uppercase font-mono tracking-widest ${isEditMode ? 'text-retro-neon' : 'border-retro-pink'}`}>{isEditMode ? 'Edit Mode: Variant Specs' : 'Step 2: Technical Specs'}</h3>
                <p className="text-xs text-gray-400 mt-2 font-mono">{isEditMode ? `Modifying Variant ID: ${initialData?.id}` : 'Define hardware capabilities. Create multiple variants (Pro, Slim, etc.) for a console.'}</p>
            </div>

            <form className="space-y-6">
                <div className="mb-8 space-y-6 bg-black/20 p-6 border border-retro-grid">
                     <div>
                        <label className={`text-[10px] mb-2 block uppercase font-bold ${fieldErrors.console_id ? 'text-retro-pink' : 'text-gray-500'}`}>Target Console Folder</label>
                        <select className={`w-full bg-black border p-3 outline-none text-white font-mono text-sm ${fieldErrors.console_id ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon'} ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`} value={formData.console_id || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('console_id', e.target.value)} required disabled={isEditMode}>
                            <option value="">-- Select Console Folder --</option>
                            {consoleList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {!isEditMode && existingVariants.length > 0 && (
                        <div className="p-4 border border-dashed border-retro-blue bg-retro-blue/5">
                            <label className="text-[10px] text-retro-blue mb-2 block uppercase font-bold">Quick Fill: Copy Specs</label>
                            <select className="w-full bg-black border border-retro-blue text-retro-blue p-2 font-mono text-xs" value={selectedTemplate} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleTemplateSelect(e.target.value)}>
                                <option value="">-- Select a Base Model Template --</option>
                                {existingVariants.map(v => <option key={v.id} value={v.id}>{v.variant_name} {v.is_default ? '(Default)' : ''}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {VARIANT_FORM_GROUPS.map((group, idx) => {
                        const isOpen = openSections[group.title];
                        const hasError = group.fields.some(f => f.key && fieldErrors[f.key as keyof typeof fieldErrors]);
                        return (
                            <div key={idx} className={`bg-black/40 border-l-4 ${hasError ? 'border-retro-pink' : 'border-retro-neon'} shadow-lg`}>
                                <button type="button" onClick={() => toggleSection(group.title)} className={`w-full flex justify-between items-center p-4 text-left font-mono uppercase tracking-widest text-sm ${isOpen ? 'text-white bg-white/5 font-bold' : 'text-gray-400 hover:text-white'}`}>
                                    <span>{group.title}</span><div className={`${isOpen ? 'rotate-180 text-retro-neon' : 'text-gray-600'}`}><ChevronDown /></div>
                                </button>
                                {isOpen && (
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-white/5">
                                        {group.fields.map((field: any, fieldIdx: number) => {
                                            let colSpan = 'md:col-span-6';
                                            if (field.width === 'full') colSpan = 'md:col-span-12';
                                            if (field.width === 'third') colSpan = 'md:col-span-4';
                                            const error = field.key ? fieldErrors[field.key as keyof typeof fieldErrors] : undefined;

                                            if (field.type === 'custom_ram') {
                                                return (
                                                    <div key={field.key || `field-${fieldIdx}`} className={`${colSpan}`}>
                                                        <label className={`text-[10px] mb-1 block uppercase ${error ? 'text-retro-pink' : 'text-gray-500'}`}>{field.label}</label>
                                                        <div className="flex gap-2">
                                                            <input type="number" className={`flex-1 border p-3 outline-none font-mono text-sm bg-black text-white ${error ? 'border-retro-pink' : 'border-gray-700 focus:border-retro-neon'}`} value={ramInput.value} onChange={(e) => handleRamChange(e.target.value, ramInput.unit)} />
                                                            <select className="w-24 bg-black border border-gray-700 p-3 outline-none text-white font-mono text-sm" value={ramInput.unit} onChange={(e) => handleRamChange(ramInput.value, e.target.value as 'GB' | 'MB')}><option value="GB">GB</option><option value="MB">MB</option></select>
                                                        </div>
                                                        {error && <div className="text-[10px] text-retro-pink mt-1 font-mono uppercase">! {error}</div>}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={field.key || `field-${fieldIdx}`} className={`${colSpan}`}>
                                                    {field.subHeader && <div className="col-span-12 mt-2 mb-3 border-b border-gray-800 pb-1"><span className="text-[10px] text-gray-500 font-bold uppercase">{field.subHeader}</span></div>}
                                                    {field.type === 'url' || (field.key && field.key.includes('image_url')) ? (
                                                        <div>
                                                            <label className={`text-[10px] mb-2 block uppercase ${error ? 'text-retro-pink' : 'text-gray-500'}`}>{field.label}</label>
                                                            <ImageUpload value={field.key ? formData[field.key] : ''} onChange={(url) => handleInputChange(field.key, url)} />
                                                        </div>
                                                    ) : (
                                                        <AdminInput field={field} value={field.key ? formData[field.key] : ''} onChange={handleInputChange} error={error} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {/* ---- HAS KEYBOARD CHECKBOX ---- */}
                                        {group.title === 'INPUT & MECHANICS' && (
                                            <div className="md:col-span-12 flex items-center space-x-3 pt-4 border-t border-gray-800">
                                                <input 
                                                    type="checkbox" 
                                                    id="has_keyboard"
                                                    checked={!!formData.has_keyboard}
                                                    onChange={(e) => handleInputChange('has_keyboard', e.target.checked)}
                                                    className="form-checkbox h-5 w-5 bg-black border-retro-neon text-retro-neon focus:ring-retro-neon/50"
                                                />
                                                <label htmlFor="has_keyboard" className="font-mono text-white">Has Physical Keyboard?</label>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isEditMode && initialData?.id && (
                    <div className="mt-8 border-t-2 border-dashed border-retro-grid pt-8">
                        {!showEmulationForm ? (
                            <button type="button" onClick={() => setShowEmulationForm(true)} className="w-full py-4 border-2 border-retro-blue bg-retro-blue/10 text-retro-blue font-pixel text-sm hover:bg-retro-blue hover:text-black">
                                [ EDIT EMULATION PERFORMANCE ]
                            </button>
                        ) : (
                            <div className="border-2 border-retro-blue">
                                <div className="bg-retro-blue/20 p-2 flex justify-between items-center border-b border-retro-blue/50">
                                    <span className="text-[10px] font-mono text-retro-blue px-2">PERFORMANCE MATRIX</span>
                                    <button type="button" onClick={() => setShowEmulationForm(false)} className="text-[10px] font-mono text-retro-blue hover:text-white px-2 py-1">[ CLOSE ]</button>
                                </div>
                                <EmulationForm variantId={initialData.id} onSave={() => onSuccess("EMULATION DATA SYNCED.")} />
                            </div>
                        )}
                    </div>
                )}
                
                <div className="flex justify-end gap-4 pt-6 border-t border-retro-grid">
                    {!isEditMode && <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, 'CLONE')} isLoading={loading}>[ SAVE & CLONE ]</Button>}
                    <Button type="submit" onClick={(e) => handleSubmit(e, 'SAVE')} isLoading={loading}>{isEditMode ? 'UPDATE UNIT' : 'REGISTER UNIT'}</Button>
                </div>
            </form>
        </div>
    );
};