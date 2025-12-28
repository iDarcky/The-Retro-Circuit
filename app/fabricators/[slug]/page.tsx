
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { ConsoleDetails } from '../../../lib/types';
import Button from '../../../components/ui/Button';
import FabricatorDetailClient from '../../../components/fabricator/FabricatorDetailClient';

export const revalidate = 3600; // 1 hour

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(props: Props) {
    const params = await props.params;
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('manufacturer')
        .select('name')
        .eq('slug', params.slug)
        .single();
        
    const titleName = profile?.name || decodeURIComponent(params.slug);
    
    return {
        title: `${titleName} Handheld History | The Retro Circuit`,
        description: `Explore the complete hardware archive of ${titleName}.`,
        alternates: {
            canonical: `/fabricators/${params.slug}`,
        },
    };
}

export async function generateStaticParams() {
    return []; // Disable static param generation to enforce dynamic fetching on demand
}

export default async function FabricatorDetailPage(props: Props) {
    const params = await props.params;
    const supabase = await createClient();
    const slug = params.slug;

    // 1. Fetch Profile
    const { data: profile, error: fetchError } = await supabase
        .from('manufacturer')
        .select('*')
        .eq('slug', slug)
        .single();

    // 2. Fetch Consoles (Only if profile loaded)
    let consoles: ConsoleDetails[] = [];
    if (profile) {
        // Query by name first to ensure we get everything, regardless of NULL release years in parent table
        const { data, error } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*)')
            .eq('manufacturer_id', profile.id)
            .order('name', { ascending: true });
        
        if (error) {
            console.error('[FabricatorPage] Console Fetch Error:', error.message);
        }

        // Normalize & Backfill data from variants
        consoles = ((data as any) || []).map((c: any) => {
             const variants = c.variants || [];
             const defaultVar = variants.find((v: any) => v.is_default) || variants[0];
             // Polyfill image if missing
             if (!c.image_url && defaultVar?.image_url) {
                 c.image_url = defaultVar.image_url;
             }
             if (!c.release_date && defaultVar?.release_date) {
                 c.release_date = defaultVar.release_date;
             }
             c.specs = defaultVar;
             return c;
        });

        // Manual Sort: Newest First (handling TBA/Nulls at top)
        consoles.sort((a, b) => {
             const dateA = a.specs?.release_date ? new Date(a.specs.release_date).getTime() : 0;
             const dateB = b.specs?.release_date ? new Date(b.specs.release_date).getTime() : 0;
             return dateB - dateA;
        });
    }

    if (!profile) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
                <h2 className="font-pixel text-accent text-xl mb-4">FABRICATOR NOT FOUND</h2>
                <div className="bg-red-900/20 border border-red-500 p-4 mb-8 max-w-lg overflow-auto w-full text-left">
                    <p className="font-mono text-red-400 text-xs mb-2 font-bold uppercase border-b border-red-500 pb-1">SYSTEM ERROR</p>
                    <div className="font-mono text-red-300 text-xs whitespace-pre-wrap">
                        <div className="mb-2"><span className="text-red-500">ERROR:</span> {fetchError?.message || "Unknown Database Error"}</div>
                         <div className="mt-4 text-[10px] text-gray-500">
                             TIMESTAMP: {new Date().toISOString()}<br/>
                             SLUG: {slug}
                        </div>
                    </div>
                </div>
                 <Link href="/console">
                    <Button variant="secondary">RETURN TO VAULT</Button>
                </Link>
             </div>
        );
    }

    return (
        <FabricatorDetailClient profile={profile} consoles={consoles} />
    );
}
