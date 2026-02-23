# SEO Optimizations

## 1. Dynamic Metadata (`generateMetadata`)
Dynamic metadata relies on individual pages exporting a `generateMetadata` function that Next.js uses to build the `<head>` of the page on the server.

- **Consoles (`app/consoles/[slug]/page.tsx`)**: Now dynamically fetches the console data based on the slug and sets the `title`, `description`, `openGraph` (including the specific hardware image), and a canonical link.

## 2. Dynamic Sitemap (`app/sitemap.ts`)
The `sitemap.ts` file now queries the Supabase database directly to generate up-to-date XML for search engines. It includes:
- **Consoles**: All console detail pages with priority `0.8`
- **Fabricators**: All manufacturer detail pages with priority `0.6`
- **News**: All published news articles dynamically pointing to `/news/[id]`
- **Reviews**: All published hardware reviews dynamically pointing to `/news/reviews/[id]`

Each entry utilizes the `updated_at` or `published_at` timestamp to give Google an accurate signal of content freshness.

## 3. Enhanced OpenGraph & Social Metadata (`app/layout.tsx`)
The global layout was updated to include extended metadata for social sharing:
- Added `twitter` object with `card: 'summary_large_image'` and the default `og-v2.png` cover.
- Added explicit `canonical` tag linking back to the primary site URL.

## 4. Advanced Entity Schema (JSON-LD)
Structured data was added directly to page bodies to provide search engines with rich semantic context:

- **News Feed (`app/news/page.tsx`)**: Injected `CollectionPage` schema containing an `ItemList` that indexes all currently published articles and reviews.
- **Console Details (`app/consoles/[slug]/page.tsx`)**: Injected `Product` schema representing the hardware, linking the console's name, description, cover image, and manufacturer (`Brand`).
