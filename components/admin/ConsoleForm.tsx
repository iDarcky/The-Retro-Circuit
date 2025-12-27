
'use client';

import { useState, type FormEvent, type FC, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addConsole, updateConsole } from '../../lib/api';
import { purgeCache } from '../../app/actions/revalidate';
import { supabase } from '../../lib/supabase/singleton';
import { ConsoleSchema, Manufacturer, CONSOLE_FORM_FIELDS, ConsoleDetails } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';
import ImageUpload from '../ui/ImageUpload';

interface ConsoleFormProps {
    initialData?: ConsoleDetails | null;
    manufacturers: Manufacturer[];
    onConsoleCreated: (id: string, name: string) => void;
    onError: (msg: string) => void;
}

export const ConsoleForm: FC<ConsoleFormProps> = ({ initialData, manufacturers, onConsoleCreated, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({ device_category: 'emulation', status: 'draft' });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    
    const isEditMode = !!initialData;

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-');
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [key]: value };
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            onError("Session expired. Please refresh the page.");
            return;
        }
        
        if (!formData.slug && formData.name) {
             formData.slug = generateSlug(formData.name);
        }

        const consoleData: any = { manufacturer_id: formData.manufacturer_id };
        CONSOLE_FORM_FIELDS.forEach((f: any) => {
            if(f.key && formData[f.key] !== undefined) {
                consoleData[f.key] = formData[f.key];
            }
        });
        
        // Include new fields
        consoleData.device_category = formData.device_category;
        consoleData.chassis_features = formData.chassis_features;
        consoleData.has_cartridge_slot = formData.has_cartridge_slot;
        consoleData.supported_cartridge_types = formData.supported_cartridge_types;
        consoleData.status = formData.status;

        const consoleResult = ConsoleSchema.safeParse(consoleData);
        if (!consoleResult.success) { 
             const newErrors: Record<string, string> = {};
             consoleResult.error.issues.forEach(issue => {
                 if (issue.path.length > 0) newErrors[issue.path[0].toString()] = issue.message;
             });
             setFieldErrors(newErrors);
             onError("VALIDATION FAILED. CHECK HIGHLIGHTED FIELDS."); 
             return; 
        }

        setLoading(true);
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Database operation timed out (10s limit)")), 10000)
            );

            let operationPromise;
            if (isEditMode && initialData?.id) {
                operationPromise = updateConsole(initialData.id, consoleResult.data as any);
            } else {
                operationPromise = addConsole(consoleResult.data as any);
            }
            
            const response: any = await Promise.race([operationPromise, timeoutPromise]);
            
            if (response.success) {
                await purgeCache();
                router.refresh();
                if (isEditMode) {
                    onConsoleCreated(initialData!.id, formData.name);
                } else if ((response as any).id) {
                    onConsoleCreated((response as any).id, consoleData.name);
                }
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
             <div className={`border-l-4 p-4 mb-4 ${isEditMode ? 'bg-secondary/10 border-secondary' : 'bg-primary/10 border-primary'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`font-bold text-sm uppercase ${isEditMode ? 'text-secondary' : 'text-primary'}`}>{isEditMode ? 'Edit Mode: Console Identity' : 'Step 1: System Identity'}</h3>
                        <p className="text-xs text-gray-400">{isEditMode ? 'Update core details of the console folder.' : 'Create the main folder for this console family.'}</p>
                    </div>

                    {/* STATUS SELECTOR */}
                    <div className="bg-black border border-gray-700 p-2 ml-4">
                        <label className="text-[10px] block uppercase text-gray-500 mb-1">Status</label>
                        <select
                            value={formData.status || 'draft'}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className={`text-xs font-mono font-bold bg-transparent outline-none uppercase cursor-pointer ${
                                formData.status === 'published' ? 'text-secondary' :
                                formData.status === 'archived' ? 'text-red-500' : 'text-yellow-500'
                            }`}
                        >
                            <option value="draft">DRAFT</option>
                            <option value="published">PUBLISHED</option>
                            <option value="archived">ARCHIVED</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className={`text-[10px] mb-1 block uppercase ${fieldErrors.manufacturer_id ? 'text-accent' : 'text-gray-500'}`}>Manufacturer</label>
                    <select 
                        className={`w-full bg-black border p-3 outline-none text-white font-mono ${fieldErrors.manufacturer_id ? 'border-accent' : 'border-gray-700 focus:border-secondary'}`}
                        value={formData.manufacturer_id || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('manufacturer_id', e.target.value)}
                    >
                        <option value="">-- Select Fabricator --</option>
                        {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    {fieldErrors.manufacturer_id && <div className="text-[10px] text-accent mt-1 font-mono uppercase">! {fieldErrors.manufacturer_id}</div>}
                </div>

                {CONSOLE_FORM_FIELDS.map((field: any, idx) => {
                     if (!field.key && field.subHeader) {
                         return (
                             <div key={`sub-${idx}`} className="col-span-1 md:col-span-2 mt-4 mb-2">
                                 <h4 className="font-pixel text-secondary text-sm border-b border-gray-800 pb-1">{field.subHeader}</h4>
                             </div>
                         );
                     }

                     if (field.key === 'slug') {
                        return (
                            <div key={field.key}>
                                <label className={`text-[10px] mb-1 block uppercase flex justify-between items-center ${fieldErrors.slug ? 'text-accent' : 'text-gray-500'}`}>
                                    {field.label}
                                    <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="text-[10px] text-primary hover:text-white underline">[{isSlugLocked ? 'UNLOCK' : 'LOCK'}]</button>
                                </label>
                                <input type="text" className={`w-full border p-3 font-mono outline-none transition-colors ${isSlugLocked ? 'bg-gray-900/50 border-gray-800 text-gray-500 cursor-not-allowed' : `bg-black text-white ${fieldErrors.slug ? 'border-accent' : 'border-secondary focus:border-primary'}`}`} value={formData[field.key] || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(field.key, e.target.value)} readOnly={isSlugLocked} />
                                {fieldErrors.slug && <div className="text-[10px] text-accent mt-1 font-mono uppercase">! {fieldErrors.slug}</div>}
                            </div>
                        );
                    }
                    if (field.key === 'image_url') {
                        return (
                            <div key={field.key} className="col-span-1 md:col-span-2">
                                <label className={`text-[10px] mb-1 block uppercase ${fieldErrors.image_url ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                                <ImageUpload value={formData[field.key]} onChange={(url) => handleInputChange(field.key, url)} />
                                {fieldErrors.image_url && <div className="text-[10px] text-accent mt-1 font-mono uppercase">! {fieldErrors.image_url}</div>}
                            </div>
                        );
                    }
                    return <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} error={fieldErrors[field.key]} />;
                })}

                 {/* ---- DEVICE TYPE SECTION ---- */}
                <div className="col-span-1 md:col-span-2 border-t border-border-normal pt-4">
                    <h4 className="font-pixel text-secondary text-sm mb-2">Device Type</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="text-[10px] mb-1 block uppercase text-gray-500">Device Category</label>
                             <select 
                                className="w-full bg-black border p-3 outline-none text-white font-mono border-gray-700 focus:border-secondary"
                                value={formData.device_category || 'emulation'}
                                onChange={(e) => handleInputChange('device_category', e.target.value)}
                            >
                                <option value="emulation">Emulation Handheld</option>
                                <option value="pc_gaming">PC Gaming Handheld</option>
                                <option value="fpga">FPGA Handheld</option>
                                <option value="legacy">Original Hardware</option>
                            </select>
                        </div>
                        <AdminInput field={{ key: 'chassis_features', label: 'Special Chassis Features', placeholder: 'e.g., Dual Screen, Swivel' }} value={formData.chassis_features} onChange={handleInputChange} />
                    </div>
                </div>

                {/* ---- PHYSICAL MEDIA SECTION ---- */}
                <div className="col-span-1 md:col-span-2 border-t border-border-normal pt-4">
                     <h4 className="font-pixel text-secondary text-sm mb-2">Physical Media</h4>
                     <div className="flex items-center space-x-4 mb-2">
                        <input 
                            type="checkbox" 
                            id="has_cartridge_slot"
                            checked={!!formData.has_cartridge_slot}
                            onChange={(e) => handleInputChange('has_cartridge_slot', e.target.checked)}
                            className="form-checkbox h-5 w-5 bg-black border-secondary text-secondary focus:ring-secondary/50"
                        />
                        <label htmlFor="has_cartridge_slot" className="font-mono text-white">Has Cartridge Slot?</label>
                     </div>
                     {formData.has_cartridge_slot && (
                         <AdminInput 
                            field={{ key: 'supported_cartridge_types', label: 'Supported Cartridge Types', placeholder: 'e.g., Game Boy, DS, 3DS' }}
                            value={formData.supported_cartridge_types} 
                            onChange={handleInputChange} 
                        />
                     )}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={loading}>{isEditMode ? 'UPDATE CONSOLE IDENTITY' : 'CREATE FOLDER & START SPECS >'}</Button>
            </div>
        </form>
    );
};