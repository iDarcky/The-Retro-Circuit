
'use client';

import { useState, type FormEvent, type FC } from 'react';
import { addManufacturer } from '../../lib/api';
import { Manufacturer, ManufacturerSchema, MANUFACTURER_FORM_FIELDS } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

interface ManufacturerFormProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ManufacturerForm: FC<ManufacturerFormProps> = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Auto-generate slug if missing
        if (!formData.slug && formData.name) {
             formData.slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }

        const result = ManufacturerSchema.safeParse(formData);
        if (!result.success) { onError(result.error.issues[0].message); return; }
        
        setLoading(true);
        const response = await addManufacturer(result.data as Omit<Manufacturer, 'id'>);
        if (response.success) {
            onSuccess("CORPORATION REGISTERED");
            setFormData({});
        } else {
            onError(`REGISTRATION FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MANUFACTURER_FORM_FIELDS.map(field => (
                <AdminInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
            ))}
            </div>
            <div className="flex justify-end pt-4"><Button type="submit" isLoading={loading}>REGISTER ENTITY</Button></div>
        </form>
    );
};
