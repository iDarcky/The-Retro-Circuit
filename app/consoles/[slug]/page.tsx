
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

    if (!finalImage && data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
      const variants = data.variants;
      const defaultVar = variants.find((v: any) => v.is_default);
      finalImage = defaultVar?.image_url || variants[0].image_url;
    }

    // Ensure fallback to site logo if absolutely no image found
    finalImage = finalImage || '/logo.png';

    return {
      title: `${data.name} Specs & Price | The Retro Circuit`,
      description: `View full technical specifications, release date, and variant comparisons for the ${data.name}.`,
      openGraph: {
        title: `${data.name} - Classified Specs`,
        images: [{ url: finalImage }]
      },
      alternates: {
        canonical: `/consoles/${slug}`,
      },
    };
  } catch (e) {
    return { title: 'System Error | The Retro Circuit' };
  }
}

// Remove generateStaticParams entirely as requested
// export async function generateStaticParams() { return []; }

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

  return <ConsoleDetailView consoleData={consoleData} />;
}
