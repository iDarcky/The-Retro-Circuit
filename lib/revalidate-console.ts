import { revalidatePath } from 'next/cache';
import { submitToIndexNow } from './indexnow';
import { siteConfig } from '../config/site';


/**
 * Refresh every cached surface that renders a console's *own* content.
 *
 * Public pages are `revalidate = false`, so nothing regenerates on a timer — an edit
 * stays invisible until each surface is explicitly invalidated. This is the cheap set
 * and it runs on every save, not just on publish: the previous version only refreshed
 * the detail page unless the status flipped to `published`, so a spec or image change
 * on an already-published console never reached `/consoles`, the homepage or the
 * brand page.
 *
 * The OG card is its own route segment and has its own cache entry, so a changed
 * image or name needs it invalidated separately or social previews stay stale.
 */
export function revalidateConsoleContent(slug?: string | null, manufacturerSlug?: string | null) {
    if (!slug) return;

    revalidatePath(`/consoles/${slug}`);
    revalidatePath(`/consoles/${slug}/opengraph-image`);
    revalidatePath('/consoles');
    revalidatePath('/');
    if (manufacturerSlug) {
        revalidatePath('/fabricators');
        revalidatePath(`/fabricators/${manufacturerSlug}`);
    }
}

/**
 * Refresh the derived collections a console is ranked or grouped into.
 *
 * These enumerate the whole catalogue, so they are addressed by route pattern rather
 * than by URL — one call marks every prebuilt instance stale and each regenerates
 * lazily on its next request. That is why this is safe to call on an ordinary save:
 * the cost lands on the next reader, not on the admin write.
 */
export function revalidateCatalogueCollections() {
    revalidatePath('/best/[slug]', 'page');
    // One pattern per facet: these are static segments now, because a second dynamic
    // segment beside [slug] is a Next routing error.
    revalidatePath('/consoles/chip/[value]', 'page');
    revalidatePath('/consoles/os/[value]', 'page');
    revalidatePath('/consoles/vendor/[value]', 'page');
    revalidatePath('/arena/[[...versus]]', 'page');
}

/**
 * Everything above, plus the search-engine surfaces. Reserved for changes that alter
 * which URLs exist — publish, unpublish, slug change, delete.
 *
 * `/sitemap.xml` matters most: it is how Google discovers the URL at all. IndexNow
 * only reaches Bing/Yandex, so without this a publish never reaches Google until the
 * next deploy.
 */
export async function revalidateConsoleSurfaces(slug?: string | null, manufacturerSlug?: string | null) {
    if (!slug) return;

    revalidateConsoleContent(slug, manufacturerSlug);
    revalidateCatalogueCollections();
    revalidatePath('/sitemap.xml');

    const base = siteConfig.url;
    const urls = [`${base}/consoles/${slug}`, `${base}/consoles`, `${base}/sitemap.xml`];
    if (manufacturerSlug) urls.push(`${base}/fabricators/${manufacturerSlug}`);
    await submitToIndexNow(urls);
}
