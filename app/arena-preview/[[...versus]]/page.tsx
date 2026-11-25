/* MOCKUP ONLY (branch prototype/arena-redesign). The redesigned comparison page, served
 * beside the live /arena so the two can be looked at side by side. Never merge this route:
 * if the design is approved, ArenaView moves onto app/arena/[[...versus]]. */

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = true;

import { supabaseAnon } from '../../../lib/supabase/anon';
import { INDEXABLE_ARENA_SIDES, pairKey } from '../../../lib/arena/indexable';
import { parseToken, splitVersus } from '../../../lib/arena/resolve';
import { normalizeVariant, unwrapRelation } from '../../../lib/normalize';
import ArenaView, { type Side } from '../../../components/arena-v2/ArenaView';
import ArenaHub from '../../../components/arena-v2/ArenaHub';

export const metadata = { title: 'Compare (mockup) | The Retro Circuit', robots: { index: false, follow: false } };

export async function generateStaticParams() {
    return [{ versus: [] as string[] }];
}

const BASE = '/arena'; // beta: rewritten to this route

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

export default async function ArenaPreviewPage({ params }: { params: Promise<{ versus?: string[] }> }) {
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
