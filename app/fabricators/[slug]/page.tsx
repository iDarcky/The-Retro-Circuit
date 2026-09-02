import { cache } from 'react';
import { notFound } from 'next/navigation';
import { supabaseAnon } from '../../../lib/supabase/anon';
import { ConsoleDetails } from '../../../lib/types';
import FabricatorDetailClient from '../../../components/fabricator/FabricatorDetailClient';
import { fetchPublicManufacturers } from '../../../app/actions/manufacturers';
import { defaultVariantOf } from '../../../lib/normalize';

export const revalidate = false;

/**
 * Memoized per request so generateMetadata and the page body share one lookup
 * instead of querying the same brand twice — the pattern `/consoles/[slug]`
 * already uses. Two separate lookups can also disagree about whether the brand
 * exists, which is how the metadata and the body ended up failing differently.
 */
const resolveBrand = cache(async (slug: string) => {
    const { data } = await supabaseAnon
        .from('manufacturer')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
    return data;
});

export async function generateStaticParams() {
  const fabricators = await fetchPublicManufacturers();
  return fabricators.map((f) => ({ slug: f.slug }));
}

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(props: Props) {
    try {
        const params = await props.params;
        const profile = await resolveBrand(params.slug);
        const titleName = profile?.name || decodeURIComponent(params.slug);

        return {
            title: `${titleName} Handheld History | The Retro Circuit`,
            description: `Explore the complete hardware archive of ${titleName}.`,
            alternates: {
                canonical: `/fabricators/${params.slug}`,
            },
        };
    } catch (e) {
        return { title: 'Fabricator Archive | The Retro Circuit' };
    }
}

export default async function FabricatorDetailPage(props: Props) {
    const params = await props.params;
    const slug = params.slug;

    const profile = await resolveBrand(slug);
    if (!profile) notFound();

    let consoles: ConsoleDetails[] = [];

    const { data, error } = await supabaseAnon
        .from('consoles')
        .select('*, manufacturer:manufacturer(*), variants:console_variants(*)')
        .eq('manufacturer_id', profile.id)
        .eq('status', 'published');

    if (error) {
        // A brand with no listable hardware still has a profile worth rendering, so
        // this degrades to an empty grid rather than taking down the whole page.
        console.error('[FabricatorPage] Console Fetch Error:', error.message);
    }

    // Backfill the card fields from the default configuration. The release date used
    // for ordering lives on the variant, not the console, which is why the sort below
    // cannot move into SQL.
    consoles = ((data as any) || []).map((c: any) => {
        const defaultVar = defaultVariantOf<any>(c.variants);
        if (!c.image_url && defaultVar?.image_url) c.image_url = defaultVar.image_url;
        if (!c.release_date && defaultVar?.release_date) c.release_date = defaultVar.release_date;
        c.specs = defaultVar;
        return c;
    });

    // Newest first, with undated hardware at the top: an entry with no release date is
    // an announced-but-unshipped device, which belongs above everything already out.
    // The previous comparator coerced a null date to epoch 0, so those sorted to the
    // bottom instead — the opposite of what its own comment claimed.
    consoles.sort((a, b) => {
        const dateA = a.specs?.release_date ? new Date(a.specs.release_date).getTime() : Infinity;
        const dateB = b.specs?.release_date ? new Date(b.specs.release_date).getTime() : Infinity;
        return dateB - dateA;
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": profile.name,
        "url": `https://theretrocircuit.com/fabricators/${profile.slug}`,
        "logo": profile.image_url
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <FabricatorDetailClient profile={profile} consoles={consoles} />
        </>
    );
}
