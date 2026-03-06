import { notFound, redirect } from 'next/navigation';
import { fetchConsoleBySlug } from '../../../app/actions';
import { fetchConsoleList } from '../../../app/actions/consoles';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';
import { createClient } from '../../../lib/supabase/server';

export const revalidate = false;

export async function generateStaticParams() {
  const consoles = await fetchConsoleList(false);
  return consoles.map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ slug: string }>
};

async function resolveConsoleSlug(rawSlug: string) {
  // 1. Try exact DB match (Legacy URL e.g. /consoles/mini)
  const exactMatch = await fetchConsoleBySlug(rawSlug, false);
  if (exactMatch.data) {
    const mfg = exactMatch.data.manufacturer;
    const mfgSlug = mfg?.slug || (mfg?.name ? mfg.name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
    const idealSlug = `${mfgSlug}-${exactMatch.data.slug}`;

    // If the URL is exactly the DB slug, and the ideal slug is different, REDIRECT.
    if (rawSlug !== idealSlug && mfg) { // Added && mfg so we don't infinitely redirect if no manufacturer
      return { redirectUrl: `/consoles/${idealSlug}`, data: null };
    }
    return { redirectUrl: null, data: exactMatch.data };
  }

  // 2. Optimized Try New Format Match ([mfg]-[slug])
  // Instead of fetching all consoles, we try to split the slug and query directly.
  // E.g., 'anbernic-rg35xx' -> mfg_slug: 'anbernic', console_slug: 'rg35xx'
  const firstHyphenIndex = rawSlug.indexOf('-');
  if (firstHyphenIndex > 0) {
    const possibleMfgSlug = rawSlug.substring(0, firstHyphenIndex);
    const possibleConsoleSlug = rawSlug.substring(firstHyphenIndex + 1);

    const supabase = await createClient();

    // First verify if the possibleMfgSlug is actually a manufacturer
    const { data: mfg } = await supabase
        .from('manufacturers')
        .select('id, slug')
        .eq('slug', possibleMfgSlug)
        .maybeSingle();

    if (mfg) {
        // Now try to fetch the console by slug where manufacturer matches
        const { data: consoleMatch } = await supabase
            .from('consoles')
            .select('slug')
            .eq('slug', possibleConsoleSlug)
            .eq('manufacturer_id', mfg.id)
            .maybeSingle();

        if (consoleMatch) {
            const fullMatch = await fetchConsoleBySlug(consoleMatch.slug, false);
            return { redirectUrl: null, data: fullMatch.data };
        }
    }
  }

  // Fallback: the manufacturer slug might contain hyphens (e.g. some-mfg-slug-console-slug)
  // To avoid complex DB queries in extreme edge cases, do the minimal fetch just for mapping.
  const supabase = await createClient();
  const { data: allMap } = await supabase.from('consoles').select('slug, manufacturer:manufacturer(slug, name)');

  if (allMap) {
      for (const c of allMap) {
        const mfgSlug = (c.manufacturer as any)?.slug || ((c.manufacturer as any)?.name ? (c.manufacturer as any).name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
        const targetSlug = `${mfgSlug}-${c.slug}`;
        if (rawSlug === targetSlug) {
          const fullMatch = await fetchConsoleBySlug(c.slug, false);
          return { redirectUrl: null, data: fullMatch.data };
        }
      }
  }

  return { redirectUrl: null, data: null };
}

export async function generateMetadata(props: Props) {
  try {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);

    const { redirectUrl, data: resolvedData } = await resolveConsoleSlug(slug);

    // Actually, let's just fetch the exact match data if there is a redirect URL, just so the OG tags are valid *during* the redirect hop.
    let data = resolvedData;
    if (redirectUrl && !data) {
      const legacyMatch = await fetchConsoleBySlug(slug, false);
      data = legacyMatch.data;
    }

    if (!data) return { title: 'Unknown Hardware | The Retro Circuit' };

    // Logic to determine best image: Console Image -> Default Variant Image -> First Variant Image
    let finalImage = data.image_url;
    let defaultVar = null;

    if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
      const variants = data.variants;
      defaultVar = variants.find((v: any) => v.is_default) || variants[0];

      if (!finalImage) {
        finalImage = defaultVar?.image_url;
      }
    }

    // Ensure fallback to site logo if absolutely no image found
    finalImage = finalImage || '/logo.png';

    // Define OG Image URL
    const consoleRecord = data as any;
    const cacheBuster = consoleRecord.updated_at
      ? new Date(consoleRecord.updated_at).getTime()
      : new Date().getTime();
    const ogImageUrl = `/consoles/${slug}/opengraph-image?v=${cacheBuster}`;

    // --- Dynamic Spec Extraction for SEO ---
    const specsParts: string[] = [];

    if (defaultVar) {
      // 1. Display Size
      if (defaultVar.screen_size_inch) {
        specsParts.push(`${defaultVar.screen_size_inch}"`);
      }

      // 2. Display Type
      if (defaultVar.display_type) {
        specsParts.push(defaultVar.display_type);
      }

      // 3. Resolution
      if (defaultVar.screen_resolution_y) {
        // Simple heuristic for "p" vs "x"
        const commonRes = [240, 480, 720, 1080, 1440, 2160];
        if (commonRes.includes(defaultVar.screen_resolution_y)) {
          specsParts.push(`${defaultVar.screen_resolution_y}p`);
        } else if (defaultVar.screen_resolution_x) {
          specsParts.push(`${defaultVar.screen_resolution_x}x${defaultVar.screen_resolution_y}`);
        } else {
          specsParts.push(`${defaultVar.screen_resolution_y}p`);
        }
      }

      // 4. Price
      if (defaultVar.price_launch_usd) {
        specsParts.push(`$${defaultVar.price_launch_usd}`);
      }
    }

    // 5. Form Factor
    if (data.form_factor) {
      // Capitalize first letter just in case
      const ff = data.form_factor.charAt(0).toUpperCase() + data.form_factor.slice(1);
      specsParts.push(ff);
    }

    // 6. OS
    if (defaultVar && defaultVar.os) {
      specsParts.push(defaultVar.os);
    }



    // Construct Description
    const description = `Full specs, variants, and pricing for the ${data.manufacturer?.name ? data.manufacturer.name + '-' : ''}${data.name}. Compare emulation performance and find the right console.`;

    const title = `${data.manufacturer?.name ? data.manufacturer.name + '-' : ''}${data.name} Specs, Price & Variants | The Retro Circuit`;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
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
    const { redirectUrl, data } = await resolveConsoleSlug(slug);

    if (redirectUrl) {
      redirect(redirectUrl);
      return null;
    }

    consoleData = data;
  } catch (err: any) {
    console.error("[ConsoleSpecsPage] Critical Error:", err);
  }

  if (!consoleData) {
    // Trigger global 404 page for correct status code
    notFound();
  }

  // Logic to determine best image for Schema
  let finalImage = consoleData.image_url;
  if (!finalImage && consoleData.variants && Array.isArray(consoleData.variants) && consoleData.variants.length > 0) {
    const variants = consoleData.variants;
    const defaultVar = variants.find((v: any) => v.is_default);
    finalImage = defaultVar?.image_url || variants[0].image_url;
  }
  finalImage = finalImage || '/logo.png';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: consoleData.name,
    description: `View full technical specifications, release date, and variant comparisons for the ${consoleData.name}.`,
    image: `https://theretrocircuit.com${finalImage.startsWith('/') ? finalImage : '/' + finalImage}`,
    brand: {
      '@type': 'Brand',
      name: consoleData.manufacturer?.name || 'Unknown Manufacturer'
    }
  };

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
