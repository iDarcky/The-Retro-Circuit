import { notFound, redirect } from 'next/navigation';
import { fetchConsoleBySlug } from '../../../app/actions';
import { fetchConsoleList } from '../../../app/actions/consoles';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';
import { ConsoleDetails } from '../../../lib/types';

export const revalidate = false;

export async function generateStaticParams() {
  const consoles = await fetchConsoleList(false);
  return consoles.map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ slug: string }>
};

async function resolveConsoleSlug(rawSlug: string): Promise<{ redirectUrl: string | null, data: ConsoleDetails | null }> {
  try {
    // 1. Try exact DB match first (Legacy URL e.g. /consoles/mini)
    const exactMatch = await fetchConsoleBySlug(rawSlug, false);
    if (exactMatch && exactMatch.data) {
      const mfg = exactMatch.data.manufacturer;
      const mfgSlug = mfg?.slug || (mfg?.name ? mfg.name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
      const idealSlug = `${mfgSlug}-${exactMatch.data.slug}`;

      // If the URL is exactly the DB slug, and the ideal slug is different, REDIRECT.
      if (rawSlug !== idealSlug && mfg) {
        return { redirectUrl: `/consoles/${idealSlug}`, data: null };
      }
      return { redirectUrl: null, data: exactMatch.data };
    }

    // 2. Try New Format Match ([mfg]-[slug]) using strict separation logic
    // This assumes all new URLs are built as manufacturerSlug-consoleSlug
    const allConsoles = await fetchConsoleList(false);

    if (allConsoles && Array.isArray(allConsoles)) {
      for (const c of allConsoles) {
        const mfg = c.manufacturer as any;
        const mfgSlug = mfg?.slug || (mfg?.name ? mfg.name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
        const targetSlug = `${mfgSlug}-${c.slug}`;

        if (rawSlug === targetSlug) {
          const fullMatch = await fetchConsoleBySlug(c.slug, false);
          if (fullMatch && fullMatch.data) {
            return { redirectUrl: null, data: fullMatch.data };
          }
        }
      }
    }

    return { redirectUrl: null, data: null };
  } catch (error) {
    console.error("[resolveConsoleSlug] Error:", error);
    return { redirectUrl: null, data: null };
  }
}

export async function generateMetadata(props: Props) {
  try {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);

    const { redirectUrl, data: resolvedData } = await resolveConsoleSlug(slug);

    let data = resolvedData;
    if (redirectUrl && !data) {
      const legacyMatch = await fetchConsoleBySlug(slug, false);
      data = legacyMatch?.data || null;
    }

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

    finalImage = finalImage || '/logo.png';

    const consoleRecord = data as any;
    const cacheBuster = consoleRecord.updated_at
      ? new Date(consoleRecord.updated_at).getTime()
      : new Date().getTime();
    const ogImageUrl = `/consoles/${slug}/opengraph-image?v=${cacheBuster}`;

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
  let shouldRedirect = null;

  try {
    const { redirectUrl, data } = await resolveConsoleSlug(slug);
    shouldRedirect = redirectUrl;
    consoleData = data;
  } catch (err: any) {
    console.error("[ConsoleSpecsPage] Critical Error:", err);
  }

  if (shouldRedirect) {
    redirect(shouldRedirect);
  }

  if (!consoleData) {
    notFound();
  }

  // Generate JSON-LD Product Schema
  const mfgName = consoleData.manufacturer?.name || '';
  const fullName = mfgName ? `${mfgName} ${consoleData.name}` : consoleData.name;

  let minPrice = Infinity;
  if (consoleData.variants && Array.isArray(consoleData.variants)) {
    consoleData.variants.forEach((v) => {
      if (v.price_launch_usd && v.price_launch_usd > 0 && v.price_launch_usd < minPrice) {
        minPrice = v.price_launch_usd;
      }
    });
  }

  const hasPrice = minPrice !== Infinity;

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fullName,
    url: `https://theretrocircuit.com/consoles/${slug}`,
    image: consoleData.image_url || 'https://theretrocircuit.com/logo.png',
    description: consoleData.description || `Full specs, variants, and pricing for the ${fullName}.`,
    brand: {
      '@type': 'Brand',
      name: mfgName
    }
  };

  if (hasPrice) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: minPrice.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://theretrocircuit.com/consoles/${slug}`
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConsoleDetailView consoleData={consoleData} />
    </>
  );
}
