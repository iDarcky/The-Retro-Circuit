import { siteConfig } from '../../config/site';

/* BreadcrumbList JSON-LD.
 *
 * The August search export lists one rich-result type registered across the whole site —
 * Product snippets — with no breadcrumbs anywhere. They were implemented on
 * /consoles/[slug] alone, which is the page type ranking worst; Arena, the page type
 * ranking best, had none. This is the shape that page already used, lifted so the other
 * templates emit exactly the same structure rather than three near-copies of it.
 *
 * Breadcrumbs do not move rank. They change how the URL line renders in results, which on
 * a site whose pages sit at position 13 to 18 is worth having for nothing.
 */
export interface Crumb {
    name: string;
    /** Site-relative, with a leading slash. Absolute URLs are built here. */
    path: string;
}

export function buildBreadcrumbLd(crumbs: Crumb[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `${siteConfig.url}${crumb.path}`,
        })),
    };
}
