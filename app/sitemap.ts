import { MetadataRoute } from 'next';
import { supabaseAnon } from '../lib/supabase/anon';

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
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

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
    const { data: fabricators } = await supabase.from('manufacturers').select('slug');
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

    // 4. Dynamic News
    const { data: news } = await supabase.from('news').select('id, published_at').eq('status', 'published');
    if (news) {
      news.forEach((item: any) => {
        routes.push({
          url: `${baseUrl}/news/${item.id}`,
          lastModified: new Date(item.published_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      });
    }

    // 5. Dynamic Reviews
    const { data: reviews } = await supabase.from('reviews').select('id, published_at').eq('status', 'published');
    if (reviews) {
      reviews.forEach((item: any) => {
        routes.push({
          url: `${baseUrl}/news/reviews/${item.id}`,
          lastModified: new Date(item.published_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return routes;
}
