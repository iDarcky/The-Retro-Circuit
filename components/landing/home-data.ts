import { fetchAllConsoles } from '../../app/actions/consoles';
import { fetchLatestConsoles } from '../../app/actions/latest';
import { INDEXABLE_ARENA_SIDES, pairKey } from '../../lib/arena/indexable';
import { BEST_OF_COLLECTIONS } from '../../lib/bestof/collections';
import { type ConsoleDetails } from '../../lib/types/domain';
import { SYSTEMS, type HomeData, type HomeDevice, type SystemKey } from './home-types';

const STATE_RANK: Record<string, number> = { Perfect: 4, Great: 3, Playable: 2, Struggles: 1, Unplayable: 0 };

const num = (v: unknown) => (typeof v === 'number' && v > 0 ? v : null);

const fullName = (brand: string, name: string) =>
    !brand || name.toLowerCase().startsWith(brand.toLowerCase()) ? name : `${brand} ${name}`;

function toHomeDevice(c: ConsoleDetails): HomeDevice {
    const s: any = c.specs || {};
    const price = num(s.price_launch_usd ?? s.price_avg_usd);
    const emu = {} as Record<SystemKey, number>;
    for (const { key } of SYSTEMS) {
        let best = 0;
        for (const v of (c.variants as any[]) || []) {
            const p = v.emulation_profile || v.emulation_profiles;
            const prof = Array.isArray(p) ? p[0] : p;
            best = Math.max(best, STATE_RANK[prof?.[`${key}_state`]] ?? 0);
        }
        emu[key] = best;
    }
    return {
        slug: c.slug,
        label: fullName(c.manufacturer?.name ?? '', c.name),
        image: c.image_url ?? null,
        // No handheld sells for under $20; a smaller number is a data-entry slip.
        price: price && price >= 20 ? Math.round(price) : null,
        screenIn: num(s.screen_size_inch),
        chip: s.soc_name || s.soc || null,
        ramGb: num(s.ram_mb) ? Math.round((s.ram_mb / 1024) * 10) / 10 : null,
        batteryMah: num(s.battery_capacity_mah),
        weightG: num(s.weight_g),
        emu,
    };
}

/** Everything the homepage draws, from one read of the published catalogue. */
export async function loadHomeData(): Promise<HomeData> {
    const [all, latest] = await Promise.all([fetchAllConsoles(), fetchLatestConsoles(8)]);
    const bySlug = new Map(all.map((c) => [c.slug, toHomeDevice(c)]));
    const devices = [...bySlug.values()];
    const prices = devices.map((d) => d.price).filter((p): p is number => p !== null);

    return {
        count: all.length,
        minPrice: prices.length ? Math.min(...prices) : null,
        newest: latest.map((c) => bySlug.get(c.slug) ?? toHomeDevice(c)),
        all: devices,
        // The sitemap's curated comparisons, where both consoles are published, so these
        // links point at the indexed URLs.
        pairs: INDEXABLE_ARENA_SIDES.filter(([a, b]) => bySlug.has(a) && bySlug.has(b))
            .slice(0, 12)
            .map(([a, b]) => ({ href: `/arena/${pairKey(a, b)}`, a: bySlug.get(a)!, b: bySlug.get(b)! })),
        guides: BEST_OF_COLLECTIONS.map((g) => ({ href: `/best/${g.slug}`, label: g.shortLabel, title: g.title })),
    };
}
