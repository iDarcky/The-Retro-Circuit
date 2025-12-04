
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { GameOfTheWeekData } from '../../../lib/types';
import Button from '../../../components/ui/Button';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props) {
    const supabase = await createClient();
    const { data } = await supabase.from('consoles').select('name, description, image_url, manufacturer:manufacturer(name)').eq('slug', params.slug).single();
    
    if (!data) return { title: 'Unknown Hardware' };
  
    return {
      title: `${data.name} Specs`,
      description: data.description?.substring(0, 160) || 'Specs unavailable.',
      openGraph: {
        images: data.image_url ? [data.image_url] : []
      }
    };
}

export default async function ConsoleSpecsPage({ params }: Props) {
  const supabase = await createClient();
  
  // Parallel Fetching with Joins (Include Variants)
  const [consoleRes, gamesRes] = await Promise.all([
    supabase
        .from('consoles')
        .select('*, manufacturer:manufacturer(*), specs:console_specs(*), variants:console_variant(*)')
        .eq('slug', params.slug)
        .single(),
    supabase.from('games').select('*').eq('console_slug', params.slug).order('year', { ascending: true })
  ]);

  const consoleData: any = consoleRes.data;
  const games = (gamesRes.data || []) as any[];
  
  // Map games to type
  const mappedGames: GameOfTheWeekData[] = games.map(g => ({
    id: g.id,
    slug: g.slug,
    title: g.title,
    developer: g.developer,
    year: g.year,
    genre: g.genre,
    content: g.content,
    whyItMatters: g.why_it_matters,
    rating: g.rating,
    image: g.image,
    console_slug: g.console_slug
  }));

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

  // Handle specs structure for the client view
  const rawSpecs = consoleData.specs;
  // If specs is an array (join), extract first item. If object, use as is.
  consoleData.specs = Array.isArray(rawSpecs) ? (rawSpecs[0] || {}) : (rawSpecs || {});

  return <ConsoleDetailView consoleData={consoleData} games={mappedGames} />;
}
