import { cache } from 'react';
import { notFound } from 'next/navigation';
import { fetchConsoleBySlug } from '../../../app/actions';
import { fetchConsoleList, fetchConsoleImages } from '../../../app/actions/consoles';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';
import { fetchCatalogueStats } from '../../actions/scoring';
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
    const description = `Full specs, variants, and pricing for the ${mfgName}${data.name}. Compare emulation performance and find the right console.`;
    const title = `${mfgName}${data.name} Specs, Price & Variants | The Retro Circuit`;

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

  // Generate JSON-LD Product Schema
  const mfgName = consoleData.manufacturer?.name || '';
  const fullName = mfgName ? `${mfgName} ${consoleData.name}` : consoleData.name;

  let minPrice = Infinity;
  let hasAsin = false;
  if (consoleData.variants && Array.isArray(consoleData.variants)) {
    consoleData.variants.forEach((v) => {
      if (v.price_launch_usd && v.price_launch_usd > 0 && v.price_launch_usd < minPrice) {
        minPrice = v.price_launch_usd;
      }
      if (v.amazon_asin) {
        hasAsin = true;
      }
    });
  }

  const hasPrice = minPrice !== Infinity;

  // Determine if the device has a future release date (for PreOrder status)
  const defaultVariant = consoleData.variants?.find((v) => v.is_default) || consoleData.variants?.[0];
  const isFutureRelease = defaultVariant?.release_date
    ? new Date(defaultVariant.release_date) > new Date()
    : false;

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fullName,
    url: `https://theretrocircuit.com/consoles/${slug}`,
    image: [consoleData.image_url, ...galleryImages.map((g) => g.url)].filter(Boolean).length
      ? [consoleData.image_url, ...galleryImages.map((g) => g.url)].filter(Boolean)
      : ['https://theretrocircuit.com/og-v2.png'],
    description: consoleData.description || `Full specs, variants, and pricing for the ${fullName}.`,
    brand: {
      '@type': 'Brand',
      name: mfgName
    }
  };

  // Always include offers when price exists — Google requires offers, review, or aggregateRating
  // Use correct availability: InStock (has ASIN), PreOrder (future release), Discontinued (otherwise)
  if (hasPrice) {
    const firstAsin = consoleData.variants?.find((v) => v.amazon_asin)?.amazon_asin;
    const availability = hasAsin
      ? 'https://schema.org/InStock'
      : isFutureRelease
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/Discontinued';
    jsonLd.offers = {
      '@type': 'Offer',
      price: minPrice.toString(),
      priceCurrency: 'USD',
      availability,
      url: firstAsin
        ? `https://www.amazon.com/dp/${firstAsin}?tag=theretrocircu-20`
        : `https://theretrocircuit.com/consoles/${slug}`
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Gallery feeds the hero frame directly — a separate section below the fold
          duplicated the cover shot and buried the extra angles. */}
      <ConsoleDetailView consoleData={consoleData} galleryImages={galleryImages} catalogueStats={catalogueStats} />
    </>
  );
}
