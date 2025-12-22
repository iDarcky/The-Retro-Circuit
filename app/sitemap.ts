import { MetadataRoute } from 'next';
import { createClient } from '../lib/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const baseUrl = 'https://theretrocircuit.com';

  // 1. Static Routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/consoles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/fabricators`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/arena`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/finder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/credits`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    // 2. Dynamic Consoles
    const { data: consoles } = await supabase.from('consoles').select('slug, updated_at');
    if (consoles) {
      consoles.forEach((item) => {
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
      fabricators.forEach((item) => {
        routes.push({
          url: `${baseUrl}/fabricators/${item.slug}`,
          lastModified: new Date(),
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
