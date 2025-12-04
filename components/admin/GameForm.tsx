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
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!formData.slug && formData.title) {
             formData.slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }
        
        const result = GameSchema.safeParse(formData);
        if (!result.success) { onError(result.error.issues[0].message); return; }
        
        setLoading(true);
        if (await addGame(result.data)) {
            onSuccess("GAME ARCHIVED");
            setFormData({});
        } else {
            onError("ARCHIVAL FAILED");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput field={{ label: 'Title', key: 'title', type: 'text', required: true }} value={formData.title} onChange={handleInputChange} />
                <AdminInput field={{ label: 'Slug (opt)', key: 'slug', type: 'text' }} value={formData.slug} onChange={handleInputChange} />
                <AdminInput field={{ label: 'Developer', key: 'developer', type: 'text', required: true }} value={formData.developer} onChange={handleInputChange} />
                <AdminInput field={{ label: 'Year', key: 'year', type: 'text', required: true }} value={formData.year} onChange={handleInputChange} />
                <AdminInput field={{ label: 'Genre', key: 'genre', type: 'text', required: true }} value={formData.genre} onChange={handleInputChange} />
                
                <div className="flex gap-2">
                <div className="flex-1">
                    <AdminInput field={{ label: 'Console Slug', key: 'console_slug', type: 'text' }} value={formData.console_slug} onChange={handleInputChange} />
                </div>
                <div className="w-24">
                    <AdminInput field={{ label: 'Rating (1-5)', key: 'rating', type: 'number' }} value={formData.rating} onChange={handleInputChange} />
                </div>
                </div>
                
                <div className="md:col-span-2">
                <AdminInput field={{ label: 'Image URL', key: 'image', type: 'url' }} value={formData.image} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                    <AdminInput field={{ label: 'Review Content', key: 'content', type: 'textarea', required: true }} value={formData.content} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                    <AdminInput field={{ label: 'Why It Matters', key: 'whyItMatters', type: 'textarea', required: true }} value={formData.whyItMatters} onChange={handleInputChange} />
                </div>
            </div>
            <div className="flex justify-end"><Button type="submit" isLoading={loading}>ARCHIVE GAME</Button></div>
        </form>
    );
};