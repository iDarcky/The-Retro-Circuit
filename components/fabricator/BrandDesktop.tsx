'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BatteryFull, Wifi, X } from 'lucide-react';
import BrandFolderIcon from './BrandFolderIcon';

/* The Fabricators page as a handheld's home screen: a status bar with a clock, battery and
 * Wi-Fi; brand folders on a dot-grid screen with a cursor that the mouse, Tab or the arrow keys
 * move; and a button-hint bar along the bottom (A open, B back, Y sort). Opening a folder pops
 * a window over the screen with that brand's handhelds. */

export interface DesktopBrand {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    count: number;
    color: string;
    logo: string | null;
    devices: { slug: string; name: string; image: string | null }[];
}

function Hint({ k, label, color, onClick }: { k: string; label: string; color: string; onClick?: () => void }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/60 hover:text-white transition-colors">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black ${color}`}>{k}</span>
            {label}
        </button>
    );
}

function Clock() {
    const [t, setT] = useState('');
    useEffect(() => {
        const tick = () => setT(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        tick();
        const i = setInterval(tick, 15000);
        return () => clearInterval(i);
    }, []);
    return <span className="tabular-nums">{t || '--:--'}</span>;
}

export default function BrandDesktop({ brands }: { brands: DesktopBrand[] }) {
    const [sort, setSort] = useState<'lineup' | 'az'>('lineup');
    const list = useMemo(() => (sort === 'az' ? [...brands].sort((a, b) => a.name.localeCompare(b.name)) : brands), [brands, sort]);
    const [sel, setSel] = useState(0);
    const [open, setOpen] = useState<DesktopBrand | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const columns = () => {
        const kids = gridRef.current?.children;
        if (!kids || kids.length < 2) return 1;
        const top = (kids[0] as HTMLElement).offsetTop;
        let n = 0;
        while (n < kids.length && (kids[n] as HTMLElement).offsetTop === top) n++;
        return n;
    };
    const focusAt = (i: number) => {
        const btn = gridRef.current?.children[i]?.querySelector('button') as HTMLButtonElement | null;
        btn?.focus();
    };
    const close = useCallback(() => {
        setOpen(null);
        requestAnimationFrame(() => focusAt(sel));
    }, [sel]);

    useEffect(() => {
        if (open) closeRef.current?.focus();
    }, [open]);

    const onKey = (e: React.KeyboardEvent) => {
        if (open) {
            if (e.key === 'Escape' || e.key.toLowerCase() === 'b') { e.preventDefault(); close(); }
            return;
        }
        const cols = columns();
        const move: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
        if (e.key in move) {
            e.preventDefault();
            const next = Math.min(list.length - 1, Math.max(0, sel + move[e.key]));
            setSel(next);
            focusAt(next);
        } else if (e.key.toLowerCase() === 'a' && document.activeElement?.closest('[data-desktop-grid]')) {
            e.preventDefault();
            setOpen(list[sel]);
        } else if (e.key.toLowerCase() === 'y') {
            setSort((s) => (s === 'lineup' ? 'az' : 'lineup'));
        }
    };

    const total = brands.reduce((s, b) => s + b.count, 0);

    return (
        <div onKeyDown={onKey} className="relative rounded-[28px] border border-white/10 bg-[#0c0c10] overflow-hidden">
            {/* Status bar */}
            <div className="flex items-center gap-4 px-5 md:px-6 h-11 border-b border-white/[0.06] font-mono text-xs text-white/70">
                <span className="font-pixel text-[10px] text-emerald-400">CIRCUIT OS</span>
                <span className="text-white/30">/</span>
                <span className="uppercase tracking-wider">Fabricators</span>
                <span className="ml-auto flex items-center gap-3 text-white/60">
                    <Wifi size={14} aria-hidden />
                    <BatteryFull size={16} aria-hidden />
                    <Clock />
                </span>
            </div>

            {/* Home screen */}
            <div className="relative min-h-[420px] p-4 md:p-6 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:16px_16px]">
                <div ref={gridRef} data-desktop-grid className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-10 gap-x-1 gap-y-4 pt-2">
                    {list.map((b, i) => (
                        <div key={b.id}>
                            <BrandFolderIcon
                                name={b.name}
                                count={b.count}
                                color={b.color}
                                logo={b.logo}
                                selected={!open && i === sel}
                                onSelect={() => setSel(i)}
                                onOpen={() => { setSel(i); setOpen(b); }}
                            />
                        </div>
                    ))}
                </div>

                {/* The opened folder, as a window over the home screen */}
                {open && (
                    <div className="absolute inset-0 z-20 flex items-start md:items-center justify-center p-3 md:p-8 bg-black/60 backdrop-blur-sm" onClick={close}>
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${open.name} handhelds`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ ['--brand' as string]: open.color }}
                            className="w-full max-w-3xl max-h-full flex flex-col rounded-2xl border border-white/15 bg-[#121218] overflow-hidden motion-safe:animate-[folderOpen_220ms_ease-out]"
                        >
                            <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10 bg-[color-mix(in_srgb,var(--brand)_18%,transparent)]">
                                <span className="relative w-12 h-12 shrink-0 rounded-lg bg-white p-1.5">
                                    {open.logo ? <span className="relative block w-full h-full"><Image src={open.logo} alt="" fill sizes="48px" className="object-contain" /></span>
                                        : <span className="absolute inset-0 flex items-center justify-center font-pixel text-xs text-black">{open.name.charAt(0)}</span>}
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-pixel text-sm md:text-base text-white truncate">{open.name}</span>
                                    {open.tagline && <span className="block mt-1 text-sm text-white/60 truncate">{open.tagline}</span>}
                                </span>
                                <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="ml-auto w-9 h-9 shrink-0 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-4 md:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {open.devices.map((d) => (
                                    <Link key={d.slug} href={`/consoles/${d.slug}`} className="group flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-[var(--brand)] hover:bg-white/[0.05] transition-colors">
                                        <span className="relative aspect-square m-3">
                                            {d.image ? <Image src={d.image} alt={d.name} fill sizes="160px" className="object-contain transition-transform duration-300 group-hover:scale-110" />
                                                : <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-zinc-600">NO VISUAL</span>}
                                        </span>
                                        <span className="px-3 pb-3 text-xs font-semibold text-white leading-tight line-clamp-2">{d.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-white/10">
                                <span className="font-mono text-[11px] text-white/50">{open.count} {open.count === 1 ? 'handheld' : 'handhelds'}</span>
                                <Link href={`/fabricators/${open.slug}`} className="font-mono text-xs uppercase tracking-wider text-[var(--brand)] hover:text-white transition-colors">Brand page →</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Button hints, like the bottom bar of a handheld's menu */}
            <div className="flex items-center gap-5 px-5 md:px-6 h-11 border-t border-white/[0.06]">
                <Hint k="A" label="Open" color="bg-emerald-400" onClick={() => setOpen(list[sel])} />
                <Hint k="B" label="Back" color="bg-rose-400" onClick={open ? close : undefined} />
                <Hint k="Y" label={sort === 'lineup' ? 'Sort A–Z' : 'Sort by line-up'} color="bg-orange-400" onClick={() => setSort((s) => (s === 'lineup' ? 'az' : 'lineup'))} />
                <span className="ml-auto hidden sm:block font-mono text-[11px] text-white/40">{brands.length} folders · {total} handhelds</span>
            </div>
        </div>
    );
}
