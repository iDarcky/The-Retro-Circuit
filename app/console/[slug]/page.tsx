export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { fetchConsoleBySlug, fetchGamesByConsole } from '../../../lib/api';
import Button from '../../../components/ui/Button';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props) {
    const supabase = await createClient();
    
    // Fetch console identity + variants for robust image fallback
    const { data } = await supabase
      .from('consoles')
      .select('name, description, image_url, variants:console_variants(image_url, is_default)')
      .eq('slug', params.slug)
      .single();
    
    if (!data) return { title: 'Unknown Hardware' };
    
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
      }
    };
}

export async function generateStaticParams() {
    return []; // Disable static param generation to enforce dynamic fetching
}

export default async function ConsoleSpecsPage({ params }: Props) {
  const supabase = await createClient();

  // Parallel Fetching using API helpers
  const [consoleData, games] = await Promise.all([
    fetchConsoleBySlug(params.slug, supabase),
    fetchGamesByConsole(params.slug, supabase)
  ]);

  if (!consoleData) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="font-pixel text-retro-pink text-2xl mb-4">ERROR 404</h2>
            <p className="font-mono text-gray-400 mb-8">SYSTEM ARCHIVE NOT FOUND.</p>
            <Link href="/console">
                <Button variant="secondary">RETURN TO VAULT</Button>
            </Link>
        </div>
    );
  }

  return <ConsoleDetailView consoleData={consoleData} games={games} />;
}