import { MetadataRoute } from 'next';
import { supabaseAnon } from '../lib/supabase/anon';
import { BEST_OF_COLLECTIONS } from '../lib/bestof/collections';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the anonymous server client for sitemap generation
  const supabase = supabaseAnon;
  const baseUrl = 'https://theretrocircuit.com';

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
    { url: `${baseUrl}/credits`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
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
    const { data: consoles } = await supabase.from('consoles').select('slug, updated_at, manufacturer:manufacturer(slug, name)');
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

    // 3. Dynamic Fabricators
    const { data: fabricators } = await supabase.from('manufacturer').select('slug');
    if (fabricators) {
      fabricators.forEach((item: any) => {
        routes.push({
          url: `${baseUrl}/fabricators/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      });
    }

    // NOTE: /news/{id} and /news/reviews/{id} are intentionally omitted — those routes do not
    // exist (news and reviews render inline on /news), so emitting them produced 404 URLs.
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return routes;
}
