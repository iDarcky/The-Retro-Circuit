import Link from 'next/link';
import type { ConsoleDetails } from '../../lib/types';

/**
 * A complete, server-rendered index of every published console, grouped by brand.
 *
 * The vault grid above this is a client component that paginates in React state
 * (24 at a time, no URL per page), so only the first slice ever reaches the HTML.
 * Crawlers therefore never see the rest of the catalogue, and sitemap-only URLs
 * tend to sit in "Discovered - currently not indexed". This gives every console a
 * real <a href> on a static page, and doubles as a scannable A-Z for readers.
 */
export default function ConsoleLinkIndex({ consoles }: { consoles: ConsoleDetails[] }) {
  if (!consoles?.length) return null;

  const byBrand = new Map<string, { slug: string; name: string }[]>();
  for (const c of consoles) {
    if (!c.slug) continue;
    const brand = c.manufacturer?.name?.trim() || 'Other';
    if (!byBrand.has(brand)) byBrand.set(brand, []);
    byBrand.get(brand)!.push({ slug: c.slug, name: c.name });
  }

  const brands = [...byBrand.entries()].sort(([a], [b]) => a.localeCompare(b));
  for (const [, items] of brands) items.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <nav
      aria-label="All consoles"
      className="max-w-[1800px] mx-auto w-full px-6 md:px-12 border-t border-white/10 py-12 mt-12"
    >
      <h2 className="font-pixel text-sm text-orange-500 mb-2 uppercase tracking-widest">
        FULL INDEX
      </h2>
      <p className="font-mono text-xs text-gray-500 mb-8">
        {consoles.length} consoles across {brands.length} brands
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
        {brands.map(([brand, items]) => (
          <div key={brand}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 border-b border-white/10 pb-2 mb-3">
              {brand}
            </h3>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/consoles/${item.slug}`}
                    className="font-mono text-sm text-gray-400 hover:bg-white hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
