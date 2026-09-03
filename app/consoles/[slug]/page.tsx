import { cache } from 'react';
import { siteConfig } from '../../../config/site';
import { notFound } from 'next/navigation';
import { fetchConsoleBySlug } from '../../../app/actions';
import { fetchConsoleList, fetchSuccessor } from '../../../app/actions/consoles';
import { fetchConsoleImages } from '../../../app/actions/images';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';
import { fetchCatalogueStats } from '../../actions/scoring';
import { circuitScore } from '../../../lib/scoring/circuit-score';
import { ConsoleDetails } from '../../../lib/types';

export const revalidate = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const consoles = await fetchConsoleList(false);
  // DB slug already contains the manufacturer prefix (e.g. "anbernic-rg-28xx").
  return consoles.map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ slug: string }>
};

// Memoized per-request so generateMetadata and the page body share a single DB fetch
// for the same slug instead of querying twice.
const resolveConsoleSlug = cache(async (rawSlug: string): Promise<{ data: ConsoleDetails | null }> => {
  try {
    const exactMatch = await fetchConsoleBySlug(rawSlug, false);
    if (exactMatch && exactMatch.data) {
      return { data: exactMatch.data };
    }
    return { data: null };
  } catch (error) {
    console.error("[resolveConsoleSlug] Error:", error);
    return { data: null };
  }
});

export async function generateMetadata(props: Props) {
  try {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);

    const { data: resolvedData } = await resolveConsoleSlug(slug);
    const data = resolvedData;

    if (!data) return { title: 'Unknown Hardware | The Retro Circuit' };

    let finalImage = data.image_url;
    let defaultVar = null;

    if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
      const variants = data.variants;
      defaultVar = variants.find((v: any) => v.is_default) || variants[0];

      if (!finalImage) {
        finalImage = defaultVar?.image_url;
      }
    }

    finalImage = finalImage || '/og-v2.png';

    const ogImageUrl = '/og-v2.png';

    const specsParts: string[] = [];
    if (defaultVar) {
      if (defaultVar.screen_size_inch) specsParts.push(`${defaultVar.screen_size_inch}"`);
      if (defaultVar.display_type) specsParts.push(defaultVar.display_type);
      if (defaultVar.screen_resolution_y) {
        const commonRes = [240, 480, 720, 1080, 1440, 2160];
        if (commonRes.includes(defaultVar.screen_resolution_y)) {
          specsParts.push(`${defaultVar.screen_resolution_y}p`);
        } else if (defaultVar.screen_resolution_x) {
          specsParts.push(`${defaultVar.screen_resolution_x}x${defaultVar.screen_resolution_y}`);
        } else {
          specsParts.push(`${defaultVar.screen_resolution_y}p`);
        }
      }
      if (defaultVar.price_launch_usd) specsParts.push(`$${defaultVar.price_launch_usd}`);
    }

    if (data.form_factor) {
      const ff = data.form_factor.charAt(0).toUpperCase() + data.form_factor.slice(1);
      specsParts.push(ff);
    }

    if (defaultVar && defaultVar.os) {
      specsParts.push(defaultVar.os);
    }

    const mfgName = data.manufacturer?.name ? data.manufacturer.name + ' ' : '';

    /* The snippet is the product, not the page.
     *
     * Console pages take 64% of impressions and convert at 0.07% — 15-30x below what
     * their average position (~15) should return. That is not a ranking problem, it is
     * a snippet problem: the old title promised "Specs, Price & Variants" to people
     * searching "<device> review" or "<device> worth it", and the old description was
     * one sentence of boilerplate identical on all 85 pages.
     *
     * `specsParts` was already being assembled above and then silently discarded — the
     * concrete detail that makes a snippet clickable (5.5" AMOLED, 1080p, $459) was
     * computed and thrown away on every page. It leads the description now.
     *
     * The year matters because these devices date fast and searchers filter on it. */
    const releaseYear = defaultVar?.release_date ? String(defaultVar.release_date).slice(0, 4) : null;
    const specLine = specsParts.slice(0, 4).join(' · ');

    const description = specLine
        ? `${mfgName}${data.name}: ${specLine}. Emulation tested per system, full spec sheet, and how it compares to the alternatives.`
        : `${mfgName}${data.name} — full spec sheet, emulation performance per system, and how it compares to the alternatives.`;

    const title = releaseYear
        ? `${mfgName}${data.name} (${releaseYear}) — Specs & Emulation Performance | The Retro Circuit`
        : `${mfgName}${data.name} — Specs & Emulation Performance | The Retro Circuit`;

    return {
      title: { absolute: title },
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: `/consoles/${slug}`,
      },
    };
  } catch (e) {
    return { title: 'System Error | The Retro Circuit' };
  }
}

export default async function ConsoleSpecsPage(props: Props) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  let consoleData = null;

  try {
    const { data } = await resolveConsoleSlug(slug);
    consoleData = data;
  } catch (err: any) {
    console.error("[ConsoleSpecsPage] Critical Error:", err);
  }

  if (!consoleData) {
    notFound();
  }

  // [] until the console_images migration is applied, so this is a no-op before then.
  const galleryImages = await fetchConsoleImages((consoleData as any).id);

  // Catalogue-wide distributions for the Circuit Score standings. Anon client, so the
  // page stays static and the comparison set is what a visitor can actually browse.
  const catalogueStats = await fetchCatalogueStats();

  // Only looked up for discontinued devices, which are the only pages that need it.
  const successor = (consoleData as any).release_status === 'discontinued'
    ? await fetchSuccessor((consoleData as any).manufacturer_id, (consoleData as any).id)
    : null;

  // Generate JSON-LD Product Schema
  const mfgName = consoleData.manufacturer?.name || '';
  const fullName = mfgName ? `${mfgName} ${consoleData.name}` : consoleData.name;

  // A device with four configurations at four prices is misrepresented by one number,
  // so collect the range and emit AggregateOffer rather than Offer.
  let minPrice = Infinity;
  let maxPrice = 0;
  let offerCount = 0;
  let hasAsin = false;
  if (consoleData.variants && Array.isArray(consoleData.variants)) {
    consoleData.variants.forEach((v) => {
      const price = (v as any).price_avg_usd || v.price_launch_usd || 0;
      if (price > 0) {
        offerCount += 1;
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
      if (v.amazon_asin) {
        hasAsin = true;
      }
    });
  }

  const hasPrice = minPrice !== Infinity;

  const defaultVariant = consoleData.variants?.find((v) => v.is_default) || consoleData.variants?.[0];
  const isFutureRelease = defaultVariant?.release_date
    ? new Date(defaultVariant.release_date) > new Date()
    : false;

  /* Availability comes from release_status, not from whether we happen to hold an ASIN.
   *
   * Deriving it from the ASIN marked 66 of 73 published consoles as Discontinued, because
   * only 7 had one. Google will not show price or availability rich results for a
   * discontinued product, so the catalogue was telling search it was dead. release_status
   * is hand-maintained in the admin and already holds the real answer. */
  const releaseStatus = (consoleData as any).release_status || 'released';
  const availability =
    releaseStatus === 'discontinued' ? 'https://schema.org/Discontinued'
    : releaseStatus === 'upcoming' || releaseStatus === 'rumoured' || isFutureRelease ? 'https://schema.org/PreOrder'
    : hasAsin ? 'https://schema.org/InStock'
    // Released, but we know of no seller. Honest, and not the same as discontinued.
    : 'https://schema.org/LimitedAvailability';

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fullName,
    url: `${siteConfig.url}/consoles/${slug}`,
    image: [consoleData.image_url, ...galleryImages.map((g) => g.url)].filter(Boolean).length
      ? [consoleData.image_url, ...galleryImages.map((g) => g.url)].filter(Boolean)
      : [`${siteConfig.url}/og-v2.png`],
    description: consoleData.description || `Full specs, variants, and pricing for the ${fullName}.`,
    brand: {
      '@type': 'Brand',
      name: mfgName
    }
  };

  // Google needs offers, review or aggregateRating for a Product to be eligible.
  if (hasPrice) {
    const firstAsin = consoleData.variants?.find((v) => v.amazon_asin)?.amazon_asin;
    const offerUrl = firstAsin
      ? `https://www.amazon.com/dp/${firstAsin}?tag=theretrocircu-20`
      : `${siteConfig.url}/consoles/${slug}`;

    jsonLd.offers = offerCount > 1 && maxPrice > minPrice
      ? {
          '@type': 'AggregateOffer',
          lowPrice: minPrice.toString(),
          highPrice: maxPrice.toString(),
          offerCount,
          priceCurrency: 'USD',
          availability,
          url: offerUrl,
        }
      : {
          '@type': 'Offer',
          price: minPrice.toString(),
          priceCurrency: 'USD',
          availability,
          url: offerUrl,
        };
  }

  /* The Circuit Score as an editorial Review.
   *
   * A self-assigned aggregateRating on your own product page breaks Google's guidelines.
   * An editorial Review authored by the publisher does not, and that is exactly what the
   * Circuit Score is: a documented, reproducible rating we publish on the page itself.
   * Only emitted when the device is actually graded, so it never invents a rating. */
  const scoredVariant = consoleData.variants?.find((v: any) => v.emulation_profile || v.emulation_profiles);
  if (scoredVariant) {
    const profile = (scoredVariant as any).emulation_profile
      || (Array.isArray((scoredVariant as any).emulation_profiles)
        ? (scoredVariant as any).emulation_profiles[0]
        : (scoredVariant as any).emulation_profiles);
    const cs = circuitScore(
      profile,
      (consoleData as any).setup_ease_score,
      (consoleData as any).community_score,
    );
    if (cs) {
      jsonLd.review = {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'The Retro Circuit' },
        reviewRating: {
          '@type': 'Rating',
          // Circuit Score is 0-100; schema.org ratings read better on a 5-point scale.
          ratingValue: (cs.score / 20).toFixed(1),
          bestRating: '5',
          worstRating: '0',
        },
        reviewBody: consoleData.description
          || `Circuit Score ${cs.score}/100, from measured emulation performance up to tier ${cs.reach}.`,
      };
    }
  }

  // Breadcrumbs change how the URL renders in results, and cost nothing.
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Consoles', item: `${siteConfig.url}/consoles` },
      ...(consoleData.manufacturer?.slug
        ? [{ '@type': 'ListItem', position: 2, name: mfgName, item: `${siteConfig.url}/fabricators/${consoleData.manufacturer.slug}` }]
        : []),
      { '@type': 'ListItem', position: consoleData.manufacturer?.slug ? 3 : 2, name: fullName, item: `${siteConfig.url}/consoles/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Gallery feeds the hero frame directly — a separate section below the fold
          duplicated the cover shot and buried the extra angles. */}
      <ConsoleDetailView consoleData={consoleData} galleryImages={galleryImages} catalogueStats={catalogueStats} successor={successor} />
    </>
  );
}
