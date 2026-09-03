import type { Metadata } from 'next';
import FacetLanding, { facetMetadata } from '../../../../components/console/FacetLanding';
import { getFacet, fetchFacetValues } from '../../../../lib/config/facets';

/* /consoles/chip/<value>. A static segment, not a dynamic one: `app/consoles/[slug]`
 * already claims the dynamic position here, and two dynamic segments with different
 * names at the same level is a Next.js routing error that took the whole /consoles tree
 * down at request time. See components/console/FacetLanding.tsx. */

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
    const facet = getFacet('chip');
    if (!facet) return [];
    return (await fetchFacetValues(facet)).map(v => ({ value: v.param }));
}

type Props = { params: Promise<{ value: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { value } = await props.params;
    return facetMetadata('chip', value);
}

export default async function Page(props: Props) {
    const { value } = await props.params;
    return <FacetLanding facetSlug="chip" value={value} />;
}
