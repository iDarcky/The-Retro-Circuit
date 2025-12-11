export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { fetchConsoleBySlug, fetchGamesByConsole } from '../../../lib/api';
import Button from '../../../components/ui/Button';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';
import { getConsoleImage } from '../../../lib/utils';
import { ConsoleDetails } from '../../../lib/types';

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
    
    const finalImage = getConsoleImage(data as unknown as ConsoleDetails);
  
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
  // Parallel Fetching using API helpers
  const [consoleData, games] = await Promise.all([
    fetchConsoleBySlug(params.slug),
    fetchGamesByConsole(params.slug)
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
