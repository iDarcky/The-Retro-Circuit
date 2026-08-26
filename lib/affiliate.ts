/**
 * Amazon affiliate link helpers.
 *
 * Single source of truth for the associate tag and URL shapes so every surface
 * (console detail, finder results, best-of pages) earns consistently.
 */

// HARD RULE: this tag must never be altered.
export const AMAZON_AFFILIATE_TAG = 'theretrocircu-20';

/** Direct product link. Highest converting — use whenever a variant has an ASIN. */
export function getAmazonProductUrl(asin: string): string {
  return `https://www.amazon.com/dp/${encodeURIComponent(asin)}?tag=${AMAZON_AFFILIATE_TAG}`;
}

/** Search fallback for devices without an ASIN, so the buy path still earns. */
export function getAmazonSearchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_AFFILIATE_TAG}`;
}

/**
 * Best available affiliate URL for a device: direct product link when an ASIN is
 * known, otherwise a search for the product name. Returns null when neither is possible.
 */
export function getBuyUrl(opts: { asin?: string | null; name?: string | null; manufacturer?: string | null }): string | null {
  if (opts.asin) return getAmazonProductUrl(opts.asin);
  const query = [opts.manufacturer, opts.name].filter(Boolean).join(' ').trim();
  return query ? getAmazonSearchUrl(query) : null;
}
