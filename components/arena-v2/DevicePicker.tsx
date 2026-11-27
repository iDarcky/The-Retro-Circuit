'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

export interface PickerConsole {
    slug: string;
    label: string;
    image: string | null;
}

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:-outline-offset-2';

/** Type to filter the catalogue. The results float over the page as a dropdown, so opening
 *  it never pushes the layout around; every result is a plain link or button. */
export default function DevicePicker({ consoles, hrefFor, onPick, label, autoFocus, selected }: {
    consoles: PickerConsole[];
    hrefFor?: (slug: string) => string;
    onPick?: (c: PickerConsole) => void;
    label: string;
    autoFocus?: boolean;
    selected?: string | null;
}) {
    const [q, setQ] = useState('');
    const [open, setOpen] = useState(!!autoFocus);
    const root = useRef<HTMLDivElement>(null);
    const hits = useMemo(() => {
        const words = q.toLowerCase().split(/\s+/).filter(Boolean);
        return consoles.filter((c) => words.every((w) => c.label.toLowerCase().includes(w)));
    }, [consoles, q]);

    // Close when a click or focus lands outside the picker, or on Escape.
    useEffect(() => {
        if (!open) return;
        const away = (e: Event) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
        const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('pointerdown', away);
        document.addEventListener('focusin', away);
        document.addEventListener('keydown', esc);
        return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('focusin', away); document.removeEventListener('keydown', esc); };
    }, [open]);

    const item = 'flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.08]';

    return (
        <div ref={root} className="relative">
            <label className="block text-sm text-text-secondary mb-2">{label}</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/30 focus-within:border-violet-500 px-3">
                <Search size={16} className="text-text-secondary shrink-0" aria-hidden />
                <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search handhelds"
                    autoFocus={autoFocus}
                    role="combobox"
                    aria-expanded={open}
                    className="w-full bg-transparent py-3 text-base outline-none placeholder:text-zinc-600"
                />
            </div>
            {open && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-2 p-1.5 rounded-2xl border border-white/15 bg-[#121216]/95 backdrop-blur-xl max-h-[20rem] overflow-y-auto shadow-2xl shadow-black/60">
                    {hits.length === 0 && <li className="px-3 py-3 text-sm text-text-secondary">No handheld matches that.</li>}
                    {hits.map((c) => {
                        const inner = (
                            <>
                                <span className="relative w-10 h-7 shrink-0">{c.image && <Image src={c.image} alt="" fill sizes="40px" className="object-contain" />}</span>
                                <span className="text-sm">{c.label}</span>
                            </>
                        );
                        return (
                            <li key={c.slug}>
                                {hrefFor ? (
                                    <Link href={hrefFor(c.slug)} className={`${item} ${focus}`}>{inner}</Link>
                                ) : (
                                    <button type="button" onClick={() => { onPick?.(c); setOpen(false); setQ(''); }} className={`w-full text-left ${item} ${focus} ${selected === c.slug ? 'bg-white/[0.08]' : ''}`}>{inner}</button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
