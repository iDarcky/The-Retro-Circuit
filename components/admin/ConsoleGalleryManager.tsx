'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import ImageUpload from '../ui/ImageUpload';
import SwissButton from '../console/swiss/SwissButton';
import { type ConsoleImage } from '../../app/actions/images';
import { fetchConsoleImagesAdmin, addConsoleImage, deleteConsoleImage } from '../../app/actions/images';

const KINDS = ['front', 'back', 'side', 'ports', 'in_hand', 'screen', 'detail', 'other'];

/**
 * Gallery CRUD for one console. Images are stored in console_images; the cover shot on
 * the console record itself is managed separately by ConsoleForm.
 */
export default function ConsoleGalleryManager({ consoleId }: { consoleId: string }) {
    const [images, setImages] = useState<ConsoleImage[]>([]);
    const [url, setUrl] = useState('');
    const [altText, setAltText] = useState('');
    const [kind, setKind] = useState('front');
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const reload = useCallback(() => {
        if (consoleId) fetchConsoleImagesAdmin(consoleId).then(setImages);
    }, [consoleId]);
    useEffect(() => { reload(); }, [reload]);

    const add = () => {
        if (!url) return;
        setError(null);
        startTransition(async () => {
            const res = await addConsoleImage(consoleId, url, altText, kind);
            if (!res.success) { setError(res.message || 'Failed to add image'); return; }
            setUrl(''); setAltText(''); setKind('front');
            reload();
        });
    };

    const remove = (id: string) => {
        setError(null);
        startTransition(async () => {
            const res = await deleteConsoleImage(id);
            if (!res.success) { setError(res.message || 'Failed to delete image'); return; }
            reload();
        });
    };

    if (!consoleId) {
        return <p className="font-mono text-xs text-gray-500">Save the console first to add gallery images.</p>;
    }

    return (
        <div className="space-y-6">
            {error && <p className="font-mono text-xs text-rose-500">{error}</p>}

            {images.length > 0 && (
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <li key={img.id} className="border border-white/10 p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={img.alt_text || ''} className="w-full aspect-[4/3] object-contain" />
                            <p className="font-mono text-[10px] uppercase text-gray-500 mt-2">{img.kind}</p>
                            <p className="font-mono text-[10px] text-gray-400 truncate" title={img.alt_text || ''}>
                                {img.alt_text || <span className="text-orange-500">no alt text</span>}
                            </p>
                            <button
                                type="button"
                                onClick={() => remove(img.id)}
                                disabled={pending}
                                className="mt-2 font-mono text-[10px] uppercase text-rose-500 hover:bg-rose-500 hover:text-black px-1 disabled:opacity-40"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="border border-white/10 p-4 space-y-3">
                <ImageUpload value={url} onChange={setUrl} />
                <input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Alt text — describe the shot (this is what ranks in image search)"
                    className="w-full bg-transparent border border-white/10 px-3 py-2 font-mono text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500"
                />
                <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                    className="w-full bg-black border border-white/10 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-violet-500"
                >
                    {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <SwissButton type="button" onClick={add} disabled={!url || pending}>
                    {pending ? 'SAVING…' : 'ADD IMAGE'}
                </SwissButton>
            </div>
        </div>
    );
}
