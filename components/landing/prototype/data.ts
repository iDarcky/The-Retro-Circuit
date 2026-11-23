/* PROTOTYPE (throwaway): data for the homepage variants on branch prototype/homepage-variants.
 * One fetch of the published catalogue, flattened into small plain objects so the client
 * variants get only what they draw. */
import { fetchAllConsoles, fetchConsoleAndVariantCounts } from '../../../app/actions/consoles';
import { fetchLatestConsoles } from '../../../app/actions/latest';
import { INDEXABLE_ARENA_SIDES, pairKey } from '../../../lib/arena/indexable';
import { BEST_OF_COLLECTIONS, selectForCollection } from '../../../lib/bestof/collections';
import { type ConsoleDetails } from '../../../lib/types/domain';

export const SYSTEMS = [
    { key: 'gba', label: 'Game Boy Advance' },
    { key: 'ps1', label: 'PlayStation' },
    { key: 'n64', label: 'N64' },
    { key: 'nds', label: 'Nintendo DS' },
    { key: 'dreamcast', label: 'Dreamcast' },
    { key: 'psp', label: 'PSP' },
    { key: 'ps2', label: 'PS2' },
    { key: 'gamecube', label: 'GameCube' },
    { key: 'switch', label: 'Switch' },
] as const;
export type SystemKey = (typeof SYSTEMS)[number]['key'];

const STATE_RANK: Record<string, number> = { Perfect: 4, Great: 3, Playable: 2, Struggles: 1, Unplayable: 0 };

export interface HomeDevice {
    slug: string;
    name: string;
    brand: string;
    image: string | null;
    price: number | null;
    screenIn: number | null;
    resolution: string | null;
    pixels: number | null;
    chip: string | null;
    ramGb: number | null;
    batteryMah: number | null;
    weightG: number | null;
    formFactor: string | null;
    /** Best rating across variants, 0 (unplayable/unknown) to 4 (perfect). */
    emu: Record<SystemKey, number>;
}

export interface HomeData {
    counts: { consoles: number; variants: number };
    newest: HomeDevice[];
    all: HomeDevice[];
    pairs: { href: string; a: HomeDevice; b: HomeDevice }[];
    guides: { href: string; label: string; title: string; description: string; picks: HomeDevice[] }[];
}

const num = (v: unknown) => (typeof v === 'number' && v > 0 ? v : null);

export function toHomeDevice(c: ConsoleDetails): HomeDevice {
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
    const rx = num(s.screen_resolution_x), ry = num(s.screen_resolution_y);
    return {
        slug: c.slug,
        name: c.name,
        brand: c.manufacturer?.name ?? '',
        image: c.image_url ?? null,
        // No handheld sells for under $20; a smaller number is a data-entry slip.
        price: price && price >= 20 ? Math.round(price) : null,
        screenIn: num(s.screen_size_inch),
        resolution: rx && ry ? `${rx}×${ry}` : null,
        pixels: rx && ry ? rx * ry : null,
        chip: s.soc_name || s.soc || null,
        ramGb: num(s.ram_mb) ? Math.round((s.ram_mb / 1024) * 10) / 10 : num(s.ram_gb),
        batteryMah: num(s.battery_capacity_mah),
        weightG: num(s.weight_g),
        formFactor: c.form_factor ?? null,
        emu,
    };
}

export async function loadHomeData(): Promise<HomeData> {
    const [all, latest, counts] = await Promise.all([
        fetchAllConsoles(),
        fetchLatestConsoles(8),
        fetchConsoleAndVariantCounts(),
    ]);
    const bySlug = new Map(all.map((c) => [c.slug, toHomeDevice(c)]));
    const newest = latest.map((c) => bySlug.get(c.slug) ?? toHomeDevice(c));
    const pairs = INDEXABLE_ARENA_SIDES.filter(([a, b]) => bySlug.has(a) && bySlug.has(b))
        .slice(0, 12)
        .map(([a, b]) => ({ href: `/arena/${pairKey(a, b)}`, a: bySlug.get(a)!, b: bySlug.get(b)! }));
    const guides = BEST_OF_COLLECTIONS.map((g) => ({
        href: `/best/${g.slug}`,
        label: g.shortLabel,
        title: g.title,
        description: g.description,
        picks: selectForCollection(g, all, 8).map((c) => bySlug.get(c.slug)!).filter(Boolean),
    }));
    return { counts, newest, all: [...bySlug.values()], pairs, guides };
}
