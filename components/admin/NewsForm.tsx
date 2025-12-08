
'use client';

import { useState, type FormEvent, type FC, type ChangeEvent } from 'react';
import { addNewsItem } from '../../lib/api';
import { NewsItem, NewsItemSchema } from '../../lib/types';
import Button from '../ui/Button';

interface NewsFormProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const NewsForm: FC<NewsFormProps> = ({ onSuccess, onError }) => {
    const [newsHeadline, setNewsHeadline] = useState('');
    const [newsSummary, setNewsSummary] = useState('');
    const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('Hardware');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Omit date from schema check as it is generated on submit
        const FormSchema = NewsItemSchema.omit({ date: true });
        const result = FormSchema.safeParse({ headline: newsHeadline, summary: newsSummary, category: newsCategory });
        
        if (!result.success) { onError(result.error.issues[0].message); return; }
        
        setLoading(true);
        // Cast to NewsItem to resolve type mismatch on optional properties
        if (await addNewsItem({ ...result.data, date: new Date().toISOString() } as NewsItem)) {
            onSuccess("NEWS TRANSMITTED");
            setNewsHeadline(''); setNewsSummary('');
        } else {
            onError("TRANSMISSION FAILED");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <input className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono" placeholder="Headline" value={newsHeadline} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewsHeadline(e.target.value)} />
            <select className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono" value={newsCategory} onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewsCategory(e.target.value as NewsItem['category'])}>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Industry">Industry</option>
                <option value="Rumor">Rumor</option>
            </select>
            <textarea className="w-full bg-black border border-gray-700 p-3 h-32 focus:border-retro-neon outline-none text-white font-mono" placeholder="Summary" value={newsSummary} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewsSummary(e.target.value)} />
            <div className="flex justify-end"><Button type="submit" isLoading={loading}>TRANSMIT</Button></div>
        </form>
    );
};