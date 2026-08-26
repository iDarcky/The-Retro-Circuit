'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ConsoleDetails, Manufacturer } from '../../lib/types';
import { addConsole as createConsole, updateConsole, deleteConsole } from '../../app/actions/consoles';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';
import ImageUpload from '../ui/ImageUpload';
import ConsoleGalleryManager from './ConsoleGalleryManager';
import { CONSOLE_FORM_FIELDS } from '../../lib/config/constants';
import { SwissDropdown } from '../ui/SwissDropdown';

interface ConsoleFormProps {
    initialData?: ConsoleDetails;
    manufacturers: Manufacturer[];
}

export function ConsoleForm({ initialData, manufacturers }: ConsoleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(!!initialData);
    const [formData, setFormData] = useState<Partial<ConsoleDetails>>(initialData || {
        status: 'draft',
        device_category: 'emulation',
        has_cartridge_slot: false,
        manufacturer_id: '', // Ensure default is empty string, not undefined
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSlugLocked, setIsSlugLocked] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setIsEditMode(true);
            // setIsSlugLocked(true);
        }
    }, [initialData]);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => {
            const updates: any = { [key]: value };
            if (key === 'name' && !isEditMode && !isSlugLocked) {
                updates.slug = generateSlug(value);
            }
            return { ...prev, ...updates };
        });
        if (fieldErrors[key]) {
            setFieldErrors(prev => ({ ...prev, [key]: '' }));
        }
    };

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!formData.name) errors.name = 'REQUIRED';
        if (!formData.slug) errors.slug = 'REQUIRED';
        if (!formData.manufacturer_id) errors.manufacturer_id = 'REQUIRED';

        // Publishing validation
        if (formData.status === "published") {
            if (!formData.image_url) { errors.image_url = "REQUIRED FOR PUBLISH"; errors.status = "CHECK IMAGE"; }
        }

        // Basic slug validation
        if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
            errors.slug = 'INVALID FORMAT (a-z, 0-9, -)';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEditMode && initialData?.id) {
                const result = await updateConsole(initialData.id, formData);
                if (!result.success) {
                    alert(result.message || "Failed to update console.");
                    return;
                }
            } else {
                const result = await createConsole(formData as any);
                if (result?.id) {
                    router.push(`/admin/consoles/${formData.slug}`);
                    return;
                }
            }
            router.refresh();
        } catch (error) {
            console.error('Failed to save console:', error);
            alert('Failed to save console. Check logs.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData?.id) return;
        if (!confirm('ARE YOU SURE? THIS CANNOT BE UNDONE.')) return;

        setLoading(true);
        try {
            await deleteConsole(initialData.id);
            router.push('/admin/consoles');
        } catch (error) {
            console.error('Failed to delete console:', error);
            alert('Failed to delete console.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl animate-fadeIn space-y-8">
            <div className="flex justify-between items-center border-b border-border-normal pb-4">
                <div>
                    <h2 className="text-xl font-pixel text-white uppercase tracking-widest flex items-center gap-3">
                        <span className="w-2 h-2 bg-secondary animate-pulse"></span>
                        {isEditMode ? `EDITING: ${initialData?.name}` : 'NEW HARDWARE ENTRY'}
                    </h2>
                    <p className="text-[10px] font-mono text-gray-500 mt-1">
                        {isEditMode ? `UUID: ${initialData?.id}` : 'INITIALIZING NEW RECORD...'}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <label className="text-[10px] uppercase text-gray-500 mb-1">Status</label>
                        <SwissDropdown
                            value={formData.status || ''}
                            onChange={(val) => handleInputChange('status', val)}
                            options={[
                                { label: 'DRAFT', value: 'draft' },
                                { label: 'REVIEW', value: 'review' },
                                { label: 'PUBLISHED', value: 'published' },
                                { label: 'ARCHIVED', value: 'archived' }
                            ]}
                            labelPrefix="" inverted={false}
                            className="min-w-[120px]"
                            buttonClassName={`bg-transparent border-none outline-none font-mono text-xs uppercase cursor-pointer h-auto p-0 flex gap-2 items-center ${formData.status === 'published' ? 'text-secondary' :
                                    formData.status === 'archived' ? 'text-red-500' :
                                        formData.status === 'review' ? 'text-amber-500' : 'text-gray-400'
                                }`}
                            compact
                        />
                        {fieldErrors.status && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold text-right">! {fieldErrors.status}</div>}
                    </div>
                    <div className="flex flex-col flex-1 items-end pl-4 ml-4 border-l border-white/10">
                        <label className="text-[10px] uppercase text-gray-500 mb-2">Featured Hardware</label>
                        <div className="flex items-center justify-center cursor-pointer group" onClick={() => handleInputChange('is_featured', !formData.is_featured)}>
                            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${formData.is_featured ? 'bg-amber-400 border-amber-400' : 'border-gray-500 bg-transparent group-hover:border-white'}`}>
                                {formData.is_featured && <div className="w-2 h-2 bg-black"></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-6 border border-border-normal">
                <div className="col-span-1 md:col-span-2">
                    <label className={`text-[10px] mb-1 block uppercase tracking-wider ${fieldErrors.manufacturer_id ? 'text-accent' : 'text-gray-500'}`}>Manufacturer</label>
                    <div className="relative">
                        <SwissDropdown
                            className="w-full"
                            buttonClassName={`bg-bg-primary border p-3 outline-none text-white font-mono text-sm cursor-pointer hover:border-white transition-colors h-[46px] flex justify-between items-center ${fieldErrors.manufacturer_id ? 'border-accent' : 'border-border-normal focus:border-white'}`}
                            value={formData.manufacturer_id || ''}
                            onChange={(val) => handleInputChange('manufacturer_id', val)}
                            options={[
                                { label: '-- SELECT FABRICATOR --', value: '' },
                                ...manufacturers.map(m => ({ label: m.name, value: m.id }))
                            ]}
                            labelPrefix="" inverted={false}
                        />
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
                                <input type="text" className={`w-full border p-3 font-mono text-sm outline-none transition-colors ${isSlugLocked ? 'bg-bg-secondary border-border-normal text-gray-500 cursor-not-allowed opacity-75' : `bg-bg-primary text-white ${fieldErrors.slug ? 'border-accent' : 'border-border-normal focus:border-white'}`}`} value={(formData as any)[field.key] || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(field.key, e.target.value)} readOnly={isSlugLocked} />
                                {fieldErrors.slug && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {fieldErrors.slug}</div>}
                            </div>
                        );
                    }
                    if (field.key === 'image_url') {
                        return (
                            <div key={field.key} className="col-span-1 md:col-span-2">
                                <label className={`text-[10px] mb-1 block uppercase tracking-wider ${fieldErrors.image_url ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                                <div className="border border-border-normal bg-black p-4">
                                    <ImageUpload value={(formData as any)[field.key]} onChange={(url) => handleInputChange(field.key, url)} />
                                </div>
                                {fieldErrors.image_url && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {fieldErrors.image_url}</div>}
                            </div>
                        );
                    }
                    return <AdminInput key={field.key} field={field} value={(formData as any)[field.key]} onChange={handleInputChange} error={fieldErrors[field.key]} />;
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
                                <SwissDropdown
                                    className="w-full"
                                    buttonClassName="bg-bg-primary border border-border-normal p-3 outline-none text-white font-mono text-sm cursor-pointer hover:border-white transition-colors focus:border-white h-[46px] flex justify-between items-center"
                                    value={formData.device_category || 'emulation'}
                                    onChange={(val) => handleInputChange('device_category', val)}
                                    options={[
                                        { label: 'EMULATION HANDHELD', value: 'emulation' },
                                        { label: 'PC GAMING HANDHELD', value: 'pc_gaming' },
                                        { label: 'FPGA HANDHELD', value: 'fpga' },
                                        { label: 'ORIGINAL HARDWARE', value: 'legacy' }
                                    ]}
                                    labelPrefix="" inverted={false}
                                />
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

            {isEditMode && initialData?.id && (
                <div className="pt-6 border-t border-border-normal">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
                        Gallery
                    </h3>
                    <ConsoleGalleryManager consoleId={initialData.id} />
                </div>
            )}

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
