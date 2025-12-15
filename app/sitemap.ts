import { fetchConsoleList, fetchManufacturers } from '../lib/api';

export default async function sitemap() {
  const baseUrl = 'https://theretrocircuit.com';

  // Parallel data fetching for performance
  const [consoles, manufacturers] = await Promise.all([
    fetchConsoleList(),
    fetchManufacturers(),
  ]);

  // 1. Core Static Routes
  const routes = [
    '',
    '/console',
    '/arena',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // 2. Dynamic Console Pages
  const consoleRoutes = consoles.map((c) => ({
    url: `${baseUrl}/console/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 4. Dynamic Manufacturer Pages
  const brandRoutes = manufacturers.map((m) => ({
    url: `${baseUrl}/fabricators/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...consoleRoutes, ...brandRoutes];
}
