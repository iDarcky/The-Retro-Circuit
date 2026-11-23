import { fetchLatestConsoles } from '../../app/actions/latest';
import { fetchConsoleList, fetchConsoleAndVariantCounts } from '../../app/actions/consoles';
import { INDEXABLE_ARENA_SIDES, pairKey } from '../../lib/arena/indexable';
import { BEST_OF_COLLECTIONS } from '../../lib/bestof/collections';
import { type ConsoleDetails } from '../../lib/types/domain';
import LandingView, { type Matchup } from './LandingView';
import { type LedgerDevice } from './SpecLedger';

/** How many curated comparisons the homepage links to. */
const MATCHUP_COUNT = 10;

function toLedgerDevice(c: ConsoleDetails): LedgerDevice {
    const s: any = c.specs || {};
    const size = typeof s.screen_size_inch === 'number' && s.screen_size_inch > 0 ? `${s.screen_size_inch}"` : null;
    const res =
        s.screen_resolution_x && s.screen_resolution_y ? `${s.screen_resolution_x}×${s.screen_resolution_y}` : null;
    const price = s.price_launch_usd ?? s.price_avg_usd ?? null;
    return {
        slug: c.slug,
        name: c.name,
        brand: c.manufacturer?.name ?? '',
        image: c.image_url ?? null,
        chip: s.soc_name || s.soc || null,
        screen: size,
        resolution: res,
        // No handheld sells for under $20, so a smaller number is a data-entry slip; hide it.
        price: typeof price === 'number' && price >= 20 ? Math.round(price) : null,
    };
}

export default async function LandingPage() {
    // Independent queries, run in parallel.
    const [latestAdded, allConsoles, counts] = await Promise.all([
        fetchLatestConsoles(8),
        fetchConsoleList(),
        fetchConsoleAndVariantCounts(),
    ]);

    const searchableConsoles = allConsoles.map((c) => ({
        name: c.name,
        slug: c.slug,
        manufacturerSlug:
            c.manufacturer?.slug || c.manufacturer?.name.toLowerCase().replace(/\s+/g, '-') || 'unknown',
    }));

    // Curated comparisons from the sitemap's keep-list, only where both sides are published.
    // Same canonical URL the sitemap uses, so these links point straight at indexed pages.
    const names = new Map(allConsoles.map((c) => [c.slug, c.name]));
    const matchups: Matchup[] = INDEXABLE_ARENA_SIDES.filter(([a, b]) => names.has(a) && names.has(b))
        .slice(0, MATCHUP_COUNT)
        .map(([a, b]) => ({ href: `/arena/${pairKey(a, b)}`, a: names.get(a)!, b: names.get(b)! }));

    const guides = BEST_OF_COLLECTIONS.map((g) => ({
        href: `/best/${g.slug}`,
        label: g.shortLabel,
        title: g.title,
        description: g.description,
    }));

    return (
        <LandingView
            counts={counts}
            devices={latestAdded.map(toLedgerDevice)}
            matchups={matchups}
            guides={guides}
            searchableConsoles={searchableConsoles}
        />
    );
}
