'use client';
/* PROTOTYPE (throwaway): floating variant switcher. Not shown on production deployments. */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Switcher({ variants, current }: { variants: { key: string; name: string }[]; current: string }) {
    const router = useRouter();
    const i = Math.max(0, variants.findIndex((v) => v.key === current));
    const go = (d: number) => {
        const next = variants[(i + d + variants.length) % variants.length];
        router.replace(`/?variant=${next.key}`, { scroll: false });
    };
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement;
            if (t.closest('input, textarea, [contenteditable]')) return;
            if (e.key === 'ArrowLeft') go(-1);
            if (e.key === 'ArrowRight') go(1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });
    return (
        <div className="fixed z-[100] left-1/2 -translate-x-1/2 bottom-24 md:bottom-6 flex items-center gap-1 bg-yellow-300 text-black rounded-full px-2 py-1.5 font-mono text-xs md:text-sm">
            <button onClick={() => go(-1)} aria-label="Previous mockup" className="p-1.5 rounded-full hover:bg-black/10"><ChevronLeft size={16} /></button>
            <span className="px-2 whitespace-nowrap">Mockup {variants[i].key}: {variants[i].name}</span>
            <button onClick={() => go(1)} aria-label="Next mockup" className="p-1.5 rounded-full hover:bg-black/10"><ChevronRight size={16} /></button>
        </div>
    );
}
