'use client';

/* The catalogue, redesigned: every filter visible at once as chips, results update as
 * you tap, and a "show more" instead of numbered pages. The full A-Z index under it is
 * server-rendered so every console still has a crawlable link. */

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import DeviceCard, { type CardDevice, SHAPE_COLOR, osLabel } from './DeviceCard';
import Bit from '../brand/Bit';
import { CountUp } from '../arena-v2/fx';

export interface BrowseDevice extends CardDevice {
    released?: number; // ms, for sorting
}

const PRICE_BANDS = [
    { id: 'u60', label: 'Under $60', test: (p: number) => p < 60 },
    { id: '60', label: '$60 to $120', test: (p: number) => p >= 60 && p < 120 },
    { id: '120', label: '$120 to $250', test: (p: number) => p >= 120 && p < 250 },
    { id: '250', label: '$250 and up', test: (p: number) => p >= 250 },
];
const SHAPES = ['Horizontal', 'Vertical', 'Clamshell'];
const SORTS = [
    { id: 'new', label: 'Newest' },
    { id: 'cheap', label: 'Cheapest' },
    { id: 'dear', label: 'Priciest' },
    { id: 'az', label: 'A to Z' },
];
const PAGE = 24;

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';

function Chip({ on, onClick, children, dot }: { on: boolean; onClick: () => void; children: React.ReactNode; dot?: string }) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            className={`inline-flex shrink-0 whitespace-nowrap items-center gap-2 border px-3 py-2 text-[13px] sm:text-sm transition-colors ${on ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-300 hover:border-white/40'} ${focus}`}
        >
            {dot && <span className={`w-2 h-2 ${dot}`} />}
            {children}
        </button>
    );
}

export default function BrowseView({ devices, variantCount }: { devices: BrowseDevice[]; variantCount: number }) {
    const [q, setQ] = useState('');
    const [shapes, setShapes] = useState<string[]>([]);
    const [band, setBand] = useState<string | null>(null);
    const [os, setOs] = useState<string | null>(null);
    const [brand, setBrand] = useState('');
    const [sort, setSort] = useState('new');
    const [shown, setShown] = useState(PAGE);

    const osOptions = useMemo(() => {
        const n = new Map<string, number>();
        for (const d of devices) if (d.os) n.set(d.os.toLowerCase(), (n.get(d.os.toLowerCase()) ?? 0) + 1);
        return [...n.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).map(([k]) => k);
    }, [devices]);
    const brands = useMemo(() => [...new Set(devices.map((d) => d.brand).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b)), [devices]);

    const list = useMemo(() => {
        const term = q.trim().toLowerCase();
        const bandDef = PRICE_BANDS.find((b) => b.id === band);
        const out = devices.filter((d) =>
            (!term || `${d.brand} ${d.name} ${d.chip ?? ''}`.toLowerCase().includes(term)) &&
            (!shapes.length || shapes.includes((d.shape ?? '').toLowerCase())) &&
            (!bandDef || (d.price ? bandDef.test(d.price) : false)) &&
            (!os || (d.os ?? '').toLowerCase() === os) &&
            (!brand || d.brand === brand),
        );
        const price = (d: BrowseDevice) => d.price ?? Infinity;
        out.sort((a, b) =>
            sort === 'cheap' ? price(a) - price(b) :
            sort === 'dear' ? (b.price ?? -1) - (a.price ?? -1) :
            sort === 'az' ? a.name.localeCompare(b.name) :
            (b.released ?? 0) - (a.released ?? 0),
        );
        return out;
    }, [devices, q, shapes, band, os, brand, sort]);

    const active = !!(q || shapes.length || band || os || brand);
    const reset = () => { setQ(''); setShapes([]); setBand(null); setOs(null); setBrand(''); setShown(PAGE); };
    const toggleShape = (s: string) => { setShapes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s])); setShown(PAGE); };

    return (
        <div>
            {/* Header */}
            <header className="px-5 md:px-12 pt-12 md:pt-20 pb-8">
                <div className="max-w-[1400px] mx-auto">
                    <p className="font-pixel text-[10px] text-violet-400"><span className="text-text-secondary">01</span>&nbsp;&nbsp;THE CATALOGUE</p>
                    <h1 className="mt-4 text-4xl md:text-7xl font-extrabold tracking-[-0.045em] leading-[0.98]">Every handheld.</h1>
                    <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-[48ch]">
                        <CountUp to={devices.length} className="font-pixel text-white text-base md:text-lg" /> handhelds and {variantCount} configurations, measured the same way.
                    </p>
                </div>
            </header>

            {/* Filters: all visible, sticky under the site header */}
            <div className="sticky top-0 z-30 bg-bg-primary/95 backdrop-blur border-y border-white/10 px-5 md:px-12 py-4">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <label className="relative flex-1">
                            <span className="sr-only">Search handhelds</span>
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
                            <input
                                value={q}
                                onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
                                placeholder="Search by name, brand or chip"
                                className="w-full bg-transparent border border-white/15 focus:border-violet-500 outline-none pl-9 pr-3 py-2.5 text-sm placeholder:text-zinc-600"
                            />
                        </label>
                        <div className="flex gap-3">
                            <select
                                value={brand}
                                onChange={(e) => { setBrand(e.target.value); setShown(PAGE); }}
                                aria-label="Brand"
                                className={`flex-1 sm:flex-none bg-bg-primary border border-white/15 px-3 py-2.5 text-sm ${focus}`}
                            >
                                <option value="">All brands</option>
                                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                aria-label="Sort"
                                className={`flex-1 sm:flex-none bg-bg-primary border border-white/15 px-3 py-2.5 text-sm ${focus}`}
                            >
                                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap pb-1 md:pb-0 [scrollbar-width:none]">
                        {SHAPES.map((s) => <Chip key={s} dot={SHAPE_COLOR[s.toLowerCase()]} on={shapes.includes(s.toLowerCase())} onClick={() => toggleShape(s.toLowerCase())}>{s}</Chip>)}
                        <span className="w-px h-6 bg-white/10 mx-1 shrink-0" aria-hidden />
                        {PRICE_BANDS.map((b) => <Chip key={b.id} on={band === b.id} onClick={() => { setBand(band === b.id ? null : b.id); setShown(PAGE); }}>{b.label}</Chip>)}
                        <span className="w-px h-6 bg-white/10 mx-1 shrink-0" aria-hidden />
                        {osOptions.map((o) => <Chip key={o} on={os === o} onClick={() => { setOs(os === o ? null : o); setShown(PAGE); }}>{osLabel(o)}</Chip>)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary" aria-live="polite">
                        <span><span className="text-white font-semibold">{list.length}</span> of {devices.length}</span>
                        {active && <button type="button" onClick={reset} className={`inline-flex items-center gap-1 font-mono text-xs text-violet-400 hover:text-white ${focus}`}><X size={12} /> Clear filters</button>}
                    </div>
                </div>
            </div>

            {/* Results */}
            <section className="px-5 md:px-12 py-8" aria-label="Handhelds">
                <div className="max-w-[1400px] mx-auto">
                    {list.length === 0 ? (
                        <div className="flex flex-col sm:flex-row items-center gap-6 border border-white/10 px-6 py-12 justify-center">
                            <Bit size={110} />
                            <div>
                                <p className="font-pixel text-[11px] leading-relaxed">Nothing matches all of that.</p>
                                <p className="mt-2 text-text-secondary">Try fewer filters.</p>
                                <button type="button" onClick={reset} className={`mt-4 bg-white text-black font-mono text-sm px-5 py-2.5 hover:bg-violet-500 hover:text-white ${focus}`}>Clear filters</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 border-l border-t border-white/10">
                                {list.slice(0, shown).map((d, i) => <DeviceCard key={d.slug} d={d} priority={i < 6} />)}
                            </div>
                            {shown < list.length && (
                                <div className="mt-8 flex justify-center">
                                    <button type="button" onClick={() => setShown((s) => s + PAGE)} className={`border border-white/20 font-mono text-sm px-6 py-3 hover:bg-white hover:text-black ${focus}`}>
                                        Show {Math.min(PAGE, list.length - shown)} more
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
