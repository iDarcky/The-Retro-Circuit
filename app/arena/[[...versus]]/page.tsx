export const revalidate = false;
export const dynamic = 'force-static';
// Pairs outside the generated list still render on first request and are then cached.
export const dynamicParams = true;

import { supabaseAnon } from '../../../lib/supabase/anon';
import { fetchArenaPairs } from '../../../lib/arena/pairs';
import { parseToken, splitVersus, buildArenaToken } from '../../../lib/arena/resolve';
import { normalizeVariant, unwrapRelation } from '../../../lib/normalize';
import { INDEXABLE_ARENA_PAIRS, INDEXABLE_ARENA_SIDES, pairKey } from '../../../lib/arena/indexable';
import ArenaView, { type Side } from '../../../components/arena-v2/ArenaView';
import ArenaHub from '../../../components/arena-v2/ArenaHub';

/* Build the comparison pages instead of waiting for a visitor to ask for one.
 *
 * Without this the HTML did not exist until first request, so Google could only find a
 * comparison through an internal link from the finder or the homepage compare box. This
 * is the page type carrying most of the site's non-brand clicks. */
export async function generateStaticParams() {
    const pairs = new Set([...await fetchArenaPairs(), ...INDEXABLE_ARENA_PAIRS]);
    // The bare hub, then one entry per pair.
    return [{ versus: [] as string[] }, ...Array.from(pairs, pair => ({ versus: [pair] }))];
}

async function isIndexablePair(key: string): Promise<boolean> {
    if (INDEXABLE_ARENA_PAIRS.has(key)) return true;
    if (key.includes('~')) return false;
    return (await fetchArenaPairs()).includes(key);
}

export async function generateMetadata({ params }: { params: Promise<{ versus?: string[] }> }) {
    const { versus } = await params;

    const hub = {
        title: 'Arena VS | Compare Any Two Handhelds | The Retro Circuit',
        description: 'Pick any two retro handhelds and compare them head-to-head. Specs, performance, price, and emulation targets.',
        alternates: { canonical: '/arena' },
    };
    if (!versus || versus.length === 0) return hub;

    const parts = splitVersus(versus[0]);
    if (!parts) return hub;

    // Resolving here as well as in the page means a legacy hyphen URL canonicalises onto
    // the `~` form rather than declaring itself canonical, so the two do not compete.
    const { data: index } = await supabaseAnon
        .from('consoles')
        .select('slug, name, manufacturer:manufacturer(name)')
        .eq('status', 'published');
    const rows = (index ?? []) as any[];
    const slugSet = new Set(rows.map(r => r.slug));
    const nameOf = new Map(rows.map(r => {
        const mfg = unwrapRelation<any>(r.manufacturer);
        return [r.slug, [mfg?.name, r.name].filter(Boolean).join(' ')];
    }));

    const sides = parts.map(tok => {
        const parsed = parseToken(tok, slugSet);
        if (!parsed) return { token: tok, label: tok.replace(/[-~]/g, ' ').trim() };
        const base = nameOf.get(parsed.consoleSlug) ?? parsed.consoleSlug.replace(/-/g, ' ');
        // Configuration slugs are terse ("12256"), so they ride along in parentheses
        // rather than being spelled out as if they were words.
        const label = parsed.variantSlug ? `${base} (${parsed.variantSlug.replace(/-/g, ' ')})` : base;
        return { token: buildArenaToken(parsed.consoleSlug, parsed.variantSlug), label };
    });

    const [a, b] = sides;
    const sameDevice = parts.length === 2
        && parseToken(parts[0], slugSet)?.consoleSlug === parseToken(parts[1], slugSet)?.consoleSlug;

    const title = sameDevice
        ? `${a.label} vs ${b.label}: which configuration to buy | The Retro Circuit`
        : `${a.label} vs ${b.label} | The Retro Circuit`;
    const description = sameDevice
        ? `Two configurations of the same device compared: what changes between ${a.label} and ${b.label}, and what the step costs.`
        : `Head-to-head spec comparison: ${a.label} vs ${b.label}. Performance, price, and emulation targets.`;

    const canonicalKey = [a.token, b.token].sort().join('-vs-');
    return {
        title,
        description,
        alternates: { canonical: `/arena/${canonicalKey}` },
        // Noindex only what nobody searches for: configuration pairs (`~`) and pairings
        // outside the generated list (pairs.ts). The curated set is always indexable; the
        // rest of the generated pairs stay indexable but are left out of the sitemap.
        ...(await isIndexablePair(canonicalKey) ? {} : { robots: { index: false, follow: true } }),
        openGraph: { title, description },
    };
}

const BASE = '/arena';

const label = (brand: string | undefined, name: string) =>
    !brand || name.toLowerCase().startsWith(brand.toLowerCase()) ? name : `${brand} ${name}`;

async function fetchSide(id: string, variantSlug: string | null): Promise<Side | null> {
    const { data: c } = await supabaseAnon.from('consoles').select('*, manufacturer:manufacturer(*)').eq('id', id).maybeSingle();
    if (!c) return null;
    const { data: vs } = await supabaseAnon
        .from('console_variants')
        .select('*, emulation_profiles(*), variant_input_profile(*)')
        .eq('console_id', c.id);
    const variants = (vs ?? []).map((v: any) => normalizeVariant(v)).filter(Boolean) as any[];
    variants.sort((x, y) => Number(!!y.is_default) - Number(!!x.is_default) || (x.price_launch_usd ?? 0) - (y.price_launch_usd ?? 0));
    const chosen = (variantSlug && variants.find((v) => v.slug === variantSlug)) || variants[0];
    const brand = unwrapRelation<any>(c.manufacturer)?.name;
    return {
        slug: c.slug,
        brand: brand ?? '',
        name: c.name,
        label: label(brand, c.name),
        image: c.image_url ?? chosen?.image_url ?? null,
        variants,
        initialVariant: chosen ? variants.indexOf(chosen) : 0,
    };
}

export default async function ArenaVersusPage({ params }: { params: Promise<{ versus?: string[] }> }) {
    const { versus } = await params;

    const { data: index } = await supabaseAnon
        .from('consoles')
        .select('id, slug, name, image_url, manufacturer:manufacturer(name)')
        .eq('status', 'published')
        .order('name');
    const rows = (index ?? []) as any[];
    const all = rows.map((r) => ({ slug: r.slug as string, label: label(unwrapRelation<any>(r.manufacturer)?.name, r.name), image: r.image_url as string | null }));
    const bySlug = new Map(rows.map((r) => [r.slug as string, r.id as string]));
    const nameOf = new Map(all.map((c) => [c.slug, c.label]));

    const popular = INDEXABLE_ARENA_SIDES.filter(([a, b]) => bySlug.has(a) && bySlug.has(b)).map(([a, b]) => ({
        href: `${BASE}/${pairKey(a, b)}`,
        a, b,
        label: `${nameOf.get(a)} vs ${nameOf.get(b)}`,
    }));

    const parts = versus?.[0] ? splitVersus(versus[0]) : null;
    if (!parts) return <ArenaHub consoles={all} popular={popular.slice(0, 12)} base={BASE} />;

    const slugSet = new Set(bySlug.keys());
    const [pa, pb] = parts.map((t) => parseToken(t, slugSet));
    const [a, b] = await Promise.all([pa, pb].map((p) => (p && bySlug.has(p.consoleSlug) ? fetchSide(bySlug.get(p.consoleSlug)!, p.variantSlug ?? null) : null)));
    if (!a || !b) return <ArenaHub consoles={all} popular={popular.slice(0, 12)} base={BASE} />;

    // Other comparisons people make with either device, then the rest of the popular list.
    const involving = popular.filter((p) => (p.a === a.slug || p.b === a.slug || p.a === b.slug || p.b === b.slug) && !(new Set([p.a, p.b]).has(a.slug) && new Set([p.a, p.b]).has(b.slug)));
    const related = [...involving, ...popular.filter((p) => !involving.includes(p) && !(p.a === a.slug && p.b === b.slug) && !(p.a === b.slug && p.b === a.slug))].slice(0, 8);

    return <ArenaView a={a} b={b} consoles={all} related={related} base={BASE} />;
}
