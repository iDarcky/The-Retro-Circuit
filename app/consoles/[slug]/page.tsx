
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { fetchConsoleBySlug } from '../../../lib/api';
import Button from '../../../components/ui/Button';
import ConsoleDetailView from '../../../components/console/ConsoleDetailView';

export const revalidate = 3600; // 1 hour

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(props: Props) {
    try {
        const params = await props.params;
        const supabase = await createClient();

        // Fetch console identity + variants for robust image fallback
        const { data } = await supabase
          .from('consoles')
          .select('name, description, image_url, variants:console_variants(image_url, is_default)')
          .eq('slug', params.slug)
          .single();

        if (!data) return { title: 'Unknown Hardware | The Retro Circuit' };

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
            canonical: `/console/${params.slug}`,
          },
        };
    } catch (e) {
        return { title: 'System Error | The Retro Circuit' };
    }
}

export async function generateStaticParams() {
    return []; // Disable static param generation to enforce dynamic fetching on demand
}

export default async function ConsoleSpecsPage(props: Props) {
  const params = await props.params;

  let consoleData = null;
  let fetchError = null;

  try {
      const supabase = await createClient();

      // Check Admin Status
      let isAdmin = false;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          isAdmin = profile?.role === 'admin';
      }

      // Parallel Fetching using API helpers
      const { data, error } = await fetchConsoleBySlug(params.slug, isAdmin);
      consoleData = data;
      fetchError = error;

  } catch (err: any) {
      console.error("[ConsoleSpecsPage] Critical Error:", err);
      fetchError = { message: err.message || "Unknown critical error" };
  }

  if (!consoleData) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <h2 className="font-pixel text-accent text-2xl mb-4">ERROR 404</h2>
            <p className="font-mono text-gray-400 mb-8">SYSTEM ARCHIVE NOT FOUND.</p>
            {fetchError && (
                <div className="bg-red-900/20 border border-red-500 p-4 mb-8 max-w-lg overflow-auto w-full text-left">
                    <p className="font-mono text-red-400 text-xs mb-2 font-bold uppercase border-b border-red-500 pb-1">SYSTEM ERROR</p>
                    <div className="font-mono text-red-300 text-xs whitespace-pre-wrap">
                        <div className="mb-2"><span className="text-red-500">ERROR:</span> {fetchError.message}</div>
                        <div className="mt-4 text-[10px] text-gray-500">
                             TIMESTAMP: {new Date().toISOString()}<br/>
                             SLUG: {params.slug}
                        </div>
                    </div>
                </div>
            )}
            <Link href="/consoles">
                <Button variant="secondary">RETURN TO VAULT</Button>
            </Link>
        </div>
    );
  }

  return <ConsoleDetailView consoleData={consoleData} />;
}
