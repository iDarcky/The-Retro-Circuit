

'use client';

import { useState, type FormEvent, type FC } from 'react';
import { addGame } from '../../lib/api';
import { GameSchema } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';

interface GameFormProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const GameForm: FC<GameFormProps> = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!formData.slug && formData.title) {
             formData.slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }
        
        const result = GameSchema.safeParse(formData);
        if (!result.success) { 
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path.length > 0) newErrors[issue.path[0].toString()] = issue.message;
            });
            setFieldErrors(newErrors);
            onError("VALIDATION FAILED. CHECK HIGHLIGHTED FIELDS."); 
            return; 
        }
        
        setLoading(true);
        if (await addGame(result.data)) {
            onSuccess("GAME ARCHIVED");
            setFormData({});
            setFieldErrors({});
        } else {
            onError("ARCHIVAL FAILED");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput field={{ label: 'Title', key: 'title', type: 'text' }} value={formData.title} onChange={handleInputChange} error={fieldErrors.title} />
                <AdminInput field={{ label: 'Slug (opt)', key: 'slug', type: 'text' }} value={formData.slug} onChange={handleInputChange} error={fieldErrors.slug} />
                <AdminInput field={{ label: 'Developer', key: 'developer', type: 'text' }} value={formData.developer} onChange={handleInputChange} error={fieldErrors.developer} />
                <AdminInput field={{ label: 'Year', key: 'year', type: 'text' }} value={formData.year} onChange={handleInputChange} error={fieldErrors.year} />
                <AdminInput field={{ label: 'Genre', key: 'genre', type: 'text' }} value={formData.genre} onChange={handleInputChange} error={fieldErrors.genre} />
                
                <div className="flex gap-2">
                <div className="flex-1">
                    <AdminInput field={{ label: 'Console Slug', key: 'console_slug', type: 'text' }} value={formData.console_slug} onChange={handleInputChange} error={fieldErrors.console_slug} />
                </div>
                <div className="w-24">
                    <AdminInput field={{ label: 'Rating (1-5)', key: 'rating', type: 'number' }} value={formData.rating} onChange={handleInputChange} error={fieldErrors.rating} />
                </div>
                </div>
                
                <div className="md:col-span-2">
                <AdminInput field={{ label: 'Image URL', key: 'image', type: 'url' }} value={formData.image} onChange={handleInputChange} error={fieldErrors.image} />
                </div>
                <div className="md:col-span-2">
                    <AdminInput field={{ label: 'Review Content', key: 'content', type: 'textarea' }} value={formData.content} onChange={handleInputChange} error={fieldErrors.content} />
                </div>
                <div className="md:col-span-2">
                    <AdminInput field={{ label: 'Why It Matters', key: 'whyItMatters', type: 'textarea' }} value={formData.whyItMatters} onChange={handleInputChange} error={fieldErrors.whyItMatters} />
                </div>
            </div>
            <div className="flex justify-end"><Button type="submit" isLoading={loading}>ARCHIVE GAME</Button></div>
        </form>
    );
};
