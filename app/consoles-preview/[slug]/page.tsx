/* MOCKUP ONLY (branch prototype/arena-redesign). The redesigned console page, served beside
 * the live /consoles/[slug]. Never merge this route: if approved, ConsoleView moves onto
 * app/consoles/[slug] and keeps that route's metadata and JSON-LD. */

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = true;

import { notFound } from 'next/navigation';
import { fetchAllConsoles, fetchConsoleBySlug } from '../../actions/consoles';
import { fetchCatalogueStats } from '../../actions/scoring';
import { circuitScore, percentileOf } from '../../../lib/scoring/circuit-score';
import { buildSummary } from '../../../lib/scoring/verdict';
import { INDEXABLE_ARENA_SIDES, pairKey } from '../../../lib/arena/indexable';
import { pickBuyTarget } from '../../../lib/affiliate';
import ConsoleView from '../../../components/console-v2/ConsoleView';

export const metadata = { title: 'Console (mockup) | The Retro Circuit', robots: { index: false, follow: false } };

export async function generateStaticParams() {
    return [];
}

const label = (brand: string | undefined, name: string) =>
    !brand || name.toLowerCase().startsWith(brand.toLowerCase()) ? name : `${brand} ${name}`;

const priceOf = (v: any): number | null => {
    const p = Number(v?.price_launch_usd);
    return p >= 20 ? Math.round(p) : null;
};

export default async function ConsolePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [{ data: c }, all, stats] = await Promise.all([fetchConsoleBySlug(slug, false), fetchAllConsoles(), fetchCatalogueStats()]);
    if (!c) notFound();

    const brand = c.manufacturer?.name ?? '';
    const variants = [...(c.variants || [])].sort(
        (x: any, y: any) => Number(!!y.is_default) - Number(!!x.is_default) || (x.price_launch_usd ?? 0) - (y.price_launch_usd ?? 0),
    );
    const def: any = variants[0] ?? {};
    const profile = def.emulation_profile ?? (Array.isArray(def.emulation_profiles) ? def.emulation_profiles[0] : def.emulation_profiles);

    // Circuit Score, and where it and the price sit among devices of the same reach.
    const cs = circuitScore(profile, (c as any).setup_ease_score, (c as any).community_score);
    const tier = cs && stats ? stats[cs.reach] : undefined;
    const price = priceOf(def);
    const scorePct = cs && tier?.scores.length ? percentileOf(cs.score, tier.scores) : null;
    const pricePct = price && tier?.prices.length ? percentileOf(price, tier.prices) : null;

    const prices = variants.map(priceOf).filter((p): p is number => p !== null);
    const summary = buildSummary({
        name: c.name,
        brand,
        deviceCategory: (c as any).device_category,
        formFactor: c.form_factor,
        releaseYear: def.release_date ? String(def.release_date).slice(0, 4) : null,
        socName: def.soc_name ?? def.soc,
        socVendor: def.soc_vendor,
        cpuClusters: def.cpu_clusters,
        ramMb: def.ram_mb,
        screenInch: def.screen_size_inch,
        screenResX: def.screen_resolution_x,
        screenResY: def.screen_resolution_y,
        batteryMah: def.battery_capacity_mah,
        batteryWh: def.battery_capacity_wh,
        osFamily: def.os_family,
        priceLow: prices.length ? Math.min(...prices) : null,
        priceHigh: prices.length ? Math.max(...prices) : null,
        variantCount: variants.length,
        profile,
    });

    // Similar: same form factor first, then nearest launch price.
    const others = all.filter((o) => o.slug !== c.slug).map((o) => {
        const ov: any = o.specs || {};
        return { slug: o.slug, label: label(o.manufacturer?.name, o.name), image: o.image_url ?? null, price: priceOf(ov), form: o.form_factor, screen: Number(ov.screen_size_inch) || null };
    });
    const similar = [...others]
        .filter((o) => o.price !== null)
        .sort((a, b) =>
            Number(b.form === c.form_factor) - Number(a.form === c.form_factor)
            || Math.abs((a.price ?? 0) - (price ?? 0)) - Math.abs((b.price ?? 0) - (price ?? 0)))
        .slice(0, 4);

    // Comparisons people already make with this device (the sitemap set).
    const nameOf = new Map(others.map((o) => [o.slug, o.label]));
    const comparisons = INDEXABLE_ARENA_SIDES.filter(([a, b]) => (a === c.slug && nameOf.has(b)) || (b === c.slug && nameOf.has(a)))
        .map(([a, b]) => {
            const other = a === c.slug ? b : a;
            return { href: `/arena-preview/${pairKey(a, b)}`, label: `vs ${nameOf.get(other)}` };
        });

    const buy = pickBuyTarget({ asin: def.amazon_asin, name: c.name, manufacturer: brand, links: (c as any).links });
    const reviews = ((c as any).links || []).filter((l: any) => l.approved && l.kind !== 'vendor' && l.url);

    return (
        <ConsoleView
            slug={c.slug}
            brand={brand}
            brandSlug={c.manufacturer?.slug ?? null}
            name={c.name}
            label={label(brand, c.name)}
            image={c.image_url ?? def.image_url ?? null}
            formFactor={c.form_factor ?? null}
            releaseStatus={(c as any).release_status ?? null}
            year={def.release_date ? String(def.release_date).slice(0, 4) : null}
            variants={variants as any[]}
            description={c.description ?? null}
            summary={summary}
            score={cs ? { score: cs.score, reach: cs.reach, pct: scorePct, medianScore: tier?.medianScore ?? null, pricePct, medianPrice: tier?.medianPrice ?? null, tierSize: tier?.scores.length ?? 0 } : null}
            buy={buy}
            reviews={reviews.map((l: any) => ({ url: l.url, label: l.label || l.url }))}
            similar={similar}
            comparisons={comparisons}
            consoles={others.map(({ slug, label, image }) => ({ slug, label, image }))}
        />
    );
}
