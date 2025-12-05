import { fetchConsoleList, fetchGameList, fetchManufacturers } from '../lib/api';

export default async function sitemap() {
  const baseUrl = 'https://theretrocircuit.com';

  // Parallel data fetching for performance
  const [consoles, games, manufacturers] = await Promise.all([
    fetchConsoleList(),
    fetchGameList(),
    fetchManufacturers(),
  ]);

  // 1. Core Static Routes
  const routes = [
    '',
    '/signals',
    '/archive',
    '/console',
    '/arena',
    '/chrono',
    '/login',
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

  // 3. Dynamic Game Pages
  const gameRoutes = games.map((g) => ({
    url: `${baseUrl}/archive/${g.slug || g.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Dynamic Manufacturer Pages
  const brandRoutes = manufacturers.map((m) => ({
    url: `${baseUrl}/fabricators/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...consoleRoutes, ...gameRoutes, ...brandRoutes];
}