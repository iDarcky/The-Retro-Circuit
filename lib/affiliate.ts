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

/** Where a buy button should actually point, and how confident that link is. */
export interface BuyTarget {
  url: string;
  /** Retailer name for the button label, e.g. "Amazon", "AliExpress". */
  vendor: string;
  /**
   * `direct` is a known listing for this exact device, `search` is a query we hope
   * lands on it. The two deserve different visual weight: a search that returns
   * unrelated products is worse than an honest "no seller known".
   */
  confidence: 'direct' | 'search';
}

const VENDOR_LABELS: [RegExp, string][] = [
  [/amazon\./i, 'Amazon'],
  [/aliexpress\./i, 'AliExpress'],
  [/litnxt\./i, 'LITNXT'],
  [/droix\./i, 'DROIX'],
  [/ebay\./i, 'eBay'],
  [/banggood\./i, 'Banggood'],
];

const vendorName = (url: string): string => {
  for (const [re, label] of VENDOR_LABELS) if (re.test(url)) return label;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'retailer';
  }
};

/**
 * Pick the single best place to send a buyer.
 *
 * Order matters commercially. A real vendor listing beats an Amazon search, because
 * most of these devices are not sold on Amazon at all and a search for one returns
 * unrelated products. Amazon links are always rebuilt through getBuyUrl so the
 * affiliate tag is applied: the imported console_links rows carry no tag, and
 * rendering one directly earns nothing.
 */
export function pickBuyTarget(opts: {
  asin?: string | null;
  name?: string | null;
  manufacturer?: string | null;
  links?: { kind?: string | null; url?: string | null; label?: string | null; approved?: boolean | null }[] | null;
}): BuyTarget | null {
  if (opts.asin) {
    return { url: getAmazonProductUrl(opts.asin), vendor: 'Amazon', confidence: 'direct' };
  }

  // Unapproved rows are import residue, not a chosen retailer, so they never become a
  // buy destination. See the approval gate on console_links.
  const vendors = (opts.links || []).filter(l => l.kind === 'vendor' && l.url && l.approved);
  if (vendors.length > 0) {
    // Prefer a non-Amazon listing: if we had an Amazon product we would have an ASIN.
    const pick = vendors.find(l => !/amazon\./i.test(l.url!)) ?? vendors[0];
    const url = /amazon\./i.test(pick.url!)
      ? getBuyUrl({ name: opts.name, manufacturer: opts.manufacturer }) ?? pick.url!
      : pick.url!;
    return { url, vendor: vendorName(url), confidence: 'direct' };
  }

  const search = getBuyUrl({ name: opts.name, manufacturer: opts.manufacturer });
  return search ? { url: search, vendor: 'Amazon', confidence: 'search' } : null;
}
