import { MetadataRoute } from 'next';
import { siteConfig } from '../config/site';
import { supabaseAnon } from '../lib/supabase/anon';
import { BEST_OF_COLLECTIONS } from '../lib/bestof/collections';
import { fetchPublicManufacturers } from './actions/manufacturers';
import { INDEXABLE_ARENA_SIDES, pairKey } from '../lib/arena/indexable';
import { fetchAllFacetPaths } from '../lib/config/facets';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the anonymous server client for sitemap generation
  const supabase = supabaseAnon;
  const baseUrl = siteConfig.url;

  // 1. Static Routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/consoles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/finder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/fabricators`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/arena`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/best`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    // /credits, /privacy and /terms are noindex, so listing them only sent Google mixed signals.
  ];

  // Buying-guide landing pages — high-value SEO surfaces.
  BEST_OF_COLLECTIONS.forEach((collection) => {
    routes.push({
      url: `${baseUrl}/best/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  try {
    // 2. Dynamic Consoles
    const { data: consoles } = await supabase
      .from('consoles')
      .select('slug, updated_at, manufacturer:manufacturer(slug, name)')
      .eq('status', 'published');
    if (consoles) {
      consoles.forEach((item: any) => {
        routes.push({
          url: `${baseUrl}/consoles/${item.slug}`,
          lastModified: new Date(item.updated_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    // 3. Dynamic Fabricators — published-only, per the public-pages rule in CLAUDE.md.
    const fabricators = await fetchPublicManufacturers();
    if (fabricators) {
      // A brand with no description is noindex (see app/fabricators/[slug]), so it stays out.
      fabricators.filter((item: any) => item.description?.trim()).forEach((item: any) => {
        routes.push({
          url: `${baseUrl}/fabricators/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      });
    }

    // 4. Arena comparisons: the curated, indexable set only (lib/arena/indexable.ts).
    // Listing all ~720 generated pairs made the sitemap 82% one template, and Google
    // stopped crawling most of the site. Pairs whose consoles are not published are skipped.
    const published = new Set((consoles || []).map((c: any) => c.slug));
    const arenaPairs = INDEXABLE_ARENA_SIDES
      .filter(([a, b]) => published.has(a) && published.has(b))
      .map(([a, b]) => pairKey(a, b));
    arenaPairs.forEach((pair) => {
      routes.push({
        url: `${baseUrl}/arena/${pair}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    // 5. Facet listings: /consoles/chip/..., /consoles/os/..., /consoles/vendor/...
    // Generated from the data, so a new chipset gets a page the day a device ships with it.
    const facetPaths = await fetchAllFacetPaths();
    facetPaths.forEach(({ facet, value }) => {
      routes.push({
        url: `${baseUrl}/consoles/${facet}/${value}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });

    // NOTE: /news/{id} and /news/reviews/{id} are intentionally omitted — those routes do not
    // exist (news and reviews render inline on /news), so emitting them produced 404 URLs.
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return routes;
}
