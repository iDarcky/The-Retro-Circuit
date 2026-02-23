
'use client';

import { useState, type FormEvent, type FC, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addConsole, updateConsole, deleteConsole } from '../../app/actions';
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

    // Status Confirmation Modal State
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

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
        // Intercept Status Change
        if (key === 'status') {
            if (value === 'published') {
                setPendingStatus(value);
                setShowStatusModal(true);
                return;
            }
        }

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

    const confirmStatusChange = () => {
        if (pendingStatus) {
            setFormData(prev => ({ ...prev, status: pendingStatus }));
            setPendingStatus(null);
            setShowStatusModal(false);
        }
    };

    const cancelStatusChange = () => {
        setPendingStatus(null);
        setShowStatusModal(false);
    };

    const handleDelete = async () => {
        if (!initialData?.id) return;

        if (!confirm(`PERMANENTLY DELETE "${formData.name}"?\n\nTHIS ACTION CANNOT BE UNDONE.`)) return;

        setLoading(true);
        try {
            const result = await deleteConsole(initialData.id);
            if (result.success) {
                await purgeCache();
                router.push('/admin/consoles');
                router.refresh();
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
            if (f.key && formData[f.key] !== undefined) {
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
        <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Simple Status Confirmation Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-bg-primary border-2 border-secondary p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,255,157,0.3)]">
                        <h3 className="font-pixel text-lg text-secondary mb-4 drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">CONFIRM PUBLISH</h3>
                        <p className="font-mono text-sm text-gray-300 mb-6 leading-relaxed">
                            {formData.status === 'review' ? (
                                <>This console will become <strong className="text-white bg-white/10 px-1">PUBLICLY VISIBLE</strong>. Are you sure?</>
                            ) : (
                                <>Publishing is normally done from <strong className="text-accent">REVIEW</strong>. Continue anyway?</>
                            )}
                        </p>
                        <div className="flex justify-end gap-4 border-t border-border-normal pt-4">
                            <button
                                type="button"
                                onClick={cancelStatusChange}
                                className="text-xs font-mono text-gray-500 hover:text-white uppercase tracking-wider"
                            >
                                [ CANCEL ]
                            </button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={confirmStatusChange}
                                className="text-xs"
                            >
                                {formData.status === 'review' ? 'CONFIRM PUBLISH' : 'FORCE PUBLISH'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`border-l-4 p-5 mb-4 bg-bg-secondary/50 border-secondary`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className={`font-pixel text-sm uppercase text-secondary mb-1`}>{isEditMode ? 'EDIT MODE: CONSOLE IDENTITY' : 'STEP 1: SYSTEM IDENTITY'}</h3>
                        <p className="font-mono text-[10px] text-gray-500 tracking-wide uppercase">// {isEditMode ? 'UPDATE CORE PARAMETERS.' : 'ESTABLISH NEW DATABASE RECORD.'}</p>
                    </div>

                    {/* STATUS SELECTOR */}
                    <div className="flex items-center gap-2 border border-border-normal p-1 pl-3 bg-black">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">STATUS:</label>
                        <select
                            value={formData.status || 'draft'}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className={`text-xs font-mono font-bold bg-transparent outline-none uppercase cursor-pointer py-1 pr-2 ${formData.status === 'published' ? 'text-secondary' :
                                    formData.status === 'archived' ? 'text-red-500' :
                                    formData.status === 'review' ? 'text-amber-500' : 'text-gray-400'
                                }`}
                        >
                            <option value="draft">DRAFT</option>
                            <option value="review">REVIEW</option>
                            <option value="published">PUBLISHED</option>
                            <option value="archived">ARCHIVED</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-6 border border-border-normal">
                <div className="col-span-1 md:col-span-2">
                    <label className={`text-[10px] mb-1 block uppercase tracking-wider ${fieldErrors.manufacturer_id ? 'text-accent' : 'text-gray-500'}`}>Manufacturer</label>
                    <div className="relative">
                        <select
                            className={`w-full bg-bg-primary border p-3 outline-none text-white font-mono text-sm appearance-none cursor-pointer hover:border-white transition-colors ${fieldErrors.manufacturer_id ? 'border-accent' : 'border-border-normal focus:border-white'}`}
                            value={formData.manufacturer_id || ''}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('manufacturer_id', e.target.value)}
                        >
                            <option value="">-- SELECT FABRICATOR --</option>
                            {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                    </div>
                    {fieldErrors.manufacturer_id && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {fieldErrors.manufacturer_id}</div>}
                </div>

                {CONSOLE_FORM_FIELDS.map((field: any, idx) => {
                    if (!field.key && field.subHeader) {
                        return (
                            <div key={`sub-${idx}`} className="col-span-1 md:col-span-2 mt-6 mb-2">
                                <h4 className="font-pixel text-white text-xs border-b border-border-normal pb-2 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1 h-1 bg-secondary inline-block"></span>
                                    {field.subHeader}
                                </h4>
                            </div>
                        );
                    }

                    if (field.key === 'slug') {
                        return (
                            <div key={field.key}>
                                <label className={`text-[10px] mb-1 block uppercase tracking-wider flex justify-between items-center ${fieldErrors.slug ? 'text-accent' : 'text-gray-500'}`}>
                                    {field.label}
                                    <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="text-[10px] text-gray-500 hover:text-white transition-colors">[{isSlugLocked ? 'UNLOCK' : 'LOCK'}]</button>
                                </label>
                                <input type="text" className={`w-full border p-3 font-mono text-sm outline-none transition-colors ${isSlugLocked ? 'bg-bg-secondary border-border-normal text-gray-500 cursor-not-allowed opacity-75' : `bg-bg-primary text-white ${fieldErrors.slug ? 'border-accent' : 'border-border-normal focus:border-white'}`}`} value={formData[field.key] || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(field.key, e.target.value)} readOnly={isSlugLocked} />
                                {fieldErrors.slug && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {fieldErrors.slug}</div>}
                            </div>
                        );
                    }
                    if (field.key === 'image_url') {
                        return (
                            <div key={field.key} className="col-span-1 md:col-span-2">
                                <label className={`text-[10px] mb-1 block uppercase tracking-wider ${fieldErrors.image_url ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                                <div className="border border-border-normal bg-black p-4">
                                    <ImageUpload value={formData[field.key]} onChange={(url) => handleInputChange(field.key, url)} />
                                </div>
                                {fieldErrors.image_url && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {fieldErrors.image_url}</div>}
                            </div>
                        );
                    }
                    return <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} error={fieldErrors[field.key]} />;
                })}

                {/* ---- DEVICE TYPE SECTION ---- */}
                <div className="col-span-1 md:col-span-2 mt-8 pt-6 border-t border-border-normal">
                    <h4 className="font-pixel text-white text-xs mb-4 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 bg-secondary inline-block"></span>
                        Device Classification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] mb-1 block uppercase text-gray-500 tracking-wider">Device Category</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-bg-primary border border-border-normal p-3 outline-none text-white font-mono text-sm appearance-none cursor-pointer hover:border-white transition-colors focus:border-white"
                                    value={formData.device_category || 'emulation'}
                                    onChange={(e) => handleInputChange('device_category', e.target.value)}
                                >
                                    <option value="emulation">EMULATION HANDHELD</option>
                                    <option value="pc_gaming">PC GAMING HANDHELD</option>
                                    <option value="fpga">FPGA HANDHELD</option>
                                    <option value="legacy">ORIGINAL HARDWARE</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                            </div>
                        </div>
                        <AdminInput field={{ key: 'chassis_features', label: 'Special Chassis Features', placeholder: 'E.G. DUAL SCREEN, SWIVEL' }} value={formData.chassis_features} onChange={handleInputChange} />
                    </div>
                </div>

                {/* ---- PHYSICAL MEDIA SECTION ---- */}
                <div className="col-span-1 md:col-span-2 mt-8 pt-6 border-t border-border-normal">
                    <h4 className="font-pixel text-white text-xs mb-4 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 bg-secondary inline-block"></span>
                        Physical Media Support
                    </h4>
                    <div className="flex items-center justify-between bg-bg-primary border border-border-normal p-3 hover:border-white transition-colors cursor-pointer group" onClick={() => handleInputChange('has_cartridge_slot', !formData.has_cartridge_slot)}>
                        <label className="font-mono text-xs text-gray-400 group-hover:text-white uppercase tracking-wider cursor-pointer">Has Cartridge Slot?</label>
                        <div className={`w-4 h-4 border flex items-center justify-center transition-all ${formData.has_cartridge_slot ? 'bg-secondary border-secondary' : 'border-gray-600 bg-transparent'}`}>
                             {formData.has_cartridge_slot && <div className="w-2 h-2 bg-black"></div>}
                        </div>
                    </div>
                    {formData.has_cartridge_slot && (
                        <div className="mt-4 animate-fadeIn">
                             <AdminInput
                                field={{ key: 'supported_cartridge_types', label: 'Supported Cartridge Types', placeholder: 'E.G. GAME BOY, DS, 3DS' }}
                                value={formData.supported_cartridge_types}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-border-normal">
                {isEditMode && formData.status === 'draft' ? (
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="font-mono text-xs text-red-500 border border-red-900 bg-red-900/10 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        [ DELETE DRAFT ]
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                <Button type="submit" isLoading={loading}>{isEditMode ? 'UPDATE CONSOLE IDENTITY' : 'CREATE FOLDER & START SPECS >'}</Button>
            </div>
        </form>
    );
};
