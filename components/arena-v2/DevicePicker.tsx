'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

export interface PickerConsole {
    slug: string;
    label: string;
    image: string | null;
}

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:-outline-offset-2';

/** Type to filter the catalogue; every result is a plain link to the comparison it makes. */
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
    const hits = useMemo(() => {
        const words = q.toLowerCase().split(/\s+/).filter(Boolean);
        return consoles.filter((c) => words.every((w) => c.label.toLowerCase().includes(w)));
    }, [consoles, q]);

    const item = 'flex items-center gap-3 px-3 py-2.5 border-b border-white/10 last:border-b-0 hover:bg-white/[0.06]';

    return (
        <div>
            <label className="block text-sm text-text-secondary mb-2">{label}</label>
            <div className="flex items-center gap-2 border border-white/20 focus-within:border-violet-500 px-3">
                <Search size={16} className="text-text-secondary shrink-0" aria-hidden />
                <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search handhelds"
                    autoFocus={autoFocus}
                    className="w-full bg-transparent py-3 text-base outline-none placeholder:text-zinc-600"
                />
            </div>
            {open && <ul className="mt-2 border border-white/10 max-h-[22rem] overflow-y-auto">
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
                                <button type="button" onClick={() => onPick?.(c)} className={`w-full text-left ${item} ${focus} ${selected === c.slug ? 'bg-white/[0.08]' : ''}`}>{inner}</button>
                            )}
                        </li>
                    );
                })}
            </ul>}
        </div>
    );
}
