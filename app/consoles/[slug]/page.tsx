
import { notFound } from 'next/navigation';
import { fetchConsoleBySlug } from '../../../app/actions';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';

export const revalidate = 3600; // 1 hour

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(props: Props) {
  try {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);

    // Use a lightweight fetch or the same API helper
    const { data, error } = await fetchConsoleBySlug(slug, false);

    if (!data || error) return { title: 'Unknown Hardware | The Retro Circuit' };

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
    // By Next.js convention, placing opengraph-image.tsx in the route folder
    // automatically handles generation, but we explicitly point to it here to be safe.
    // If we rely on automatic generation, we often don't need to specify images here,
    // but specifying it ensures we override any parent metadata.
    const ogImageUrl = `/consoles/${slug}/opengraph-image`;

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

    const specsString = specsParts.join(', ');

    // Construct Description
    const description = specsString
        ? `${specsString}. Detailed technical specs, emulation performance, and comparisons for the ${data.name}.`
        : `View full technical specifications, release date, and variant comparisons for the ${data.name}.`;

    const title = `${data.name} Specs, Price, Release Date & Comparisons`;

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
    // PURELY PUBLIC FETCH
    // No auth checks, no cookies.
    // Force includeHidden = false.
    const { data, error } = await fetchConsoleBySlug(slug, false);
    consoleData = data;

    // Log error but we don't display it directly anymore since we redirect to notFound()
    if (error) {
      console.error("[ConsoleSpecsPage] Fetch Error:", error);
    }

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
