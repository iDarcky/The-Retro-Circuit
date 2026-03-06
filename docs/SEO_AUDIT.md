# The Retro Circuit — SEO Audit
> Last updated: [date]

## 1. Indexing
- [ ] All console pages indexed (check: Search Console Coverage report)
  <!-- ACTION: External task. Check Google Search Console. -->
- [ ] /consoles indexed by Google
  <!-- ACTION: External task. Check Google Search Console. -->
- [ ] /consoles indexed by Bing
  <!-- ACTION: External task. Check Bing Webmaster Tools. -->
- [ ] /finder indexed
  <!-- ACTION: External task. Check Google Search Console. -->
- [ ] /fabricators indexed
  <!-- ACTION: External task. Check Google Search Console. -->
- [x] /terms set to noindex
- [x] /privacy set to noindex
- [x] /credits set to noindex
- [ ] 4 noindex pages fixed (miyoo-mini-plus, powkiddy-rgb30, anbernic-rg28xx, anbernic-rg476h)
  <!-- ACTION: Check if these specific console pages are rendering a noindex tag or if they are missing from sitemap. They likely just need to be published or verified in DB. -->
- [x] No pages with accidental noindex in generateMetadata

## 2. Canonicals
- [ ] /consoles canonical points to https://theretrocircuit.com/consoles (not homepage)
  <!-- ACTION: Add canonical logic to `app/consoles/page.tsx` generateMetadata. -->
- [x] All console pages canonical uses manufacturer-prefixed slug
- [ ] No duplicate canonicals across the site
  <!-- ACTION: Verify through crawler or SEO tool. Codebase currently only generates canonicals explicitly in certain dynamic routes. -->

## 3. Redirects
- [ ] All /console/[slug] → /consoles/[slug] 301s live
  <!-- ACTION: Verify if this is handled in Vercel configuration or needs to be added to next.config.mjs redirects. -->
- [ ] Double manufacturer prefix redirects live (asus-asus-rog-ally, nintendo-nintendo-switch)
  <!-- ACTION: Add explicit redirects for these in `next.config.mjs`. -->
- [ ] pocket-s-1440p manufacturerSlug fixed to "ayaneo"
  <!-- ACTION: Needs a database update in Supabase to link the console to the Ayaneo manufacturer. -->
- [ ] No redirect chains (A→B→C, should be A→C)
  <!-- ACTION: Run a crawler over the redirect list in next.config.mjs to ensure none point to each other. -->

## 4. Titles & Meta
- [x] No double titles anywhere (all console pages use title: { absolute })
- [x] /finder title updated and description is not placeholder
- [x] /fabricators title updated to include "Manufacturers & Brands"
- [x] /credits has meta description
- [x] /terms has meta description
- [x] /privacy has meta description
- [ ] No title over 60 characters (Bing limit)
  <!-- ACTION: Review dynamic title generation length, especially in app/consoles/[slug]/page.tsx. -->

## 5. Structured Data (JSON-LD)
- [ ] Organization schema on homepage — name, url, logo, sameAs (LinkedIn only)
  <!-- ACTION: Inject `<script type="application/ld+json">` with Organization schema into `app/page.tsx` or `app/layout.tsx`. -->
- [ ] WebSite schema on homepage with SearchAction
  <!-- ACTION: Add WebSite schema with potential SearchAction definition to the homepage. -->
- [ ] Product schema on all console pages
  <!-- ACTION: Generate and insert Product JSON-LD in `app/consoles/[slug]/page.tsx` based on `consoleData`. -->
- [ ] Product schema includes offers with price > 0
  <!-- ACTION: Ensure the Product schema maps `price_launch_usd` to the Offer property properly. -->
- [ ] Product schema includes url field in offers
  <!-- ACTION: Add the product page URL or affiliate URL to the Offer schema. -->
- [ ] Brand schema on all /fabricators/[slug] pages
  <!-- ACTION: Add Brand or Organization schema to `app/fabricators/[slug]/page.tsx`. -->
- [ ] No unfilled placeholders (YOUR_USERNAME, YOUR_PROFILE) anywhere
  <!-- ACTION: Search the codebase for placeholder strings and replace them with actual site details. -->
- [ ] Validated via Rich Results Test — 0 errors
  <!-- ACTION: External task. Use Google Rich Results Test once JSON-LD is implemented. -->

## 6. H1 Tags
- [ ] /consoles has an H1 tag
  <!-- ACTION: Currently `ConsoleVaultClient.tsx` uses `<h1 className="...">Console <span...>Vault</span>...</h1>`, so this is technically implemented, but confirm it renders correctly in the DOM. Marking as unchecked to verify. -->
- [x] All console pages have an H1 tag
- [ ] All fabricator pages have an H1 tag
  <!-- ACTION: Add an explicit `<h1>` tag for the manufacturer name in `app/fabricators/[slug]/page.tsx`. -->
- [x] /finder has an H1 tag

## 7. Internal Links
- [ ] No internal links using old short slugs (/consoles/loki, /consoles/mini-plus etc)
  <!-- ACTION: Search the codebase (components/ and app/) for hardcoded links using the old short slugs and update them. -->
- [x] SimilarConsoles.tsx uses manufacturer-prefixed slugs
- [ ] Arena dropdown uses correct manufacturerSlug for all consoles
  <!-- ACTION: Verify the `ArenaSelector` component maps options with the manufacturer slug correctly. -->
- [x] revalidatePath calls use manufacturer-prefixed slugs

## 8. Sitemap
- [ ] sitemap.xml contains all published console pages
  <!-- ACTION: Currently `app/sitemap.ts` pulls all consoles, ensure it filters `eq("status", "published")` if applicable. -->
- [ ] No double manufacturer prefix in sitemap URLs
  <!-- ACTION: Check `app/sitemap.ts` string interpolation `${mfgSlug}-${item.slug}` against the current database slug format. -->
- [ ] No old short slugs in sitemap
  <!-- ACTION: Ensure the database `slug` column is clean, as `sitemap.ts` reads directly from it. -->
- [ ] No RSS or secondary sitemaps generating old URLs
  <!-- ACTION: Verify there are no other sitemaps or feeds being generated. (Currently seems none exist). -->
- [ ] Sitemap submitted to Google Search Console
  <!-- ACTION: External task. Submit in GSC. -->
- [ ] Sitemap submitted to Bing Webmaster Tools
  <!-- ACTION: External task. Submit in Bing Webmaster Tools. -->

## 9. Performance
- [ ] resolveConsoleSlug fix live (no repeated DB calls)
  <!-- ACTION: Review `resolveConsoleSlug` in `app/consoles/[slug]/page.tsx` for performance/caching optimizations. -->
- [x] Rate limiting active (300 req/min)
- [ ] Static pages not hitting rate limiter
  <!-- ACTION: Ensure `searchRateLimit` is only applied to API routes or Server Actions, not static page renders. -->
- [ ] /roadmap is static, not force-dynamic
  <!-- ACTION: Currently missing `export const revalidate = false` or similar static declaration in `app/roadmap/page.tsx`. Verify static generation behavior. -->
- [ ] Vercel Fluid CPU usage under 3h/4h limit
  <!-- ACTION: External task. Monitor Vercel usage dashboard. -->

## 10. IndexNow
- [x] IndexNow key file exists at /public/[key].txt
- [ ] INDEXNOW_KEY set in Vercel environment variables
  <!-- ACTION: This is an environment configuration task, not a codebase change. Check Vercel project settings. -->
- [x] IndexNow API call added to admin Server Actions on console create/update
- [ ] Sitemap submitted via IndexNow
  <!-- ACTION: External task. Trigger IndexNow submission manually or via script. -->

## 11. Bing Webmaster Tools
- [ ] Site verified in Bing Webmaster Tools
  <!-- ACTION: External task. Verify site ownership. -->
- [ ] Sitemap submitted
  <!-- ACTION: External task. Submit in Bing Webmaster Tools. -->
- [ ] /consoles canonical error resolved
  <!-- ACTION: Dependent on adding canonical to /consoles metadata. -->
- [ ] H1 missing error resolved
  <!-- ACTION: External verification after H1 fixes. -->

## 12. Google Search Console
- [ ] 0 pages with noindex error
  <!-- ACTION: External task. Check GSC. -->
- [ ] 0 pages with 404 error
  <!-- ACTION: External task. Check GSC. -->
- [ ] Redirect validation passing
  <!-- ACTION: External task. Check GSC. -->
- [ ] Rich Results showing Product snippets
  <!-- ACTION: External task. Check GSC after adding JSON-LD. -->
- [ ] Manual indexing requested for top 10 pages
  <!-- ACTION: External task. Perform in GSC. -->

## 13. Affiliate (Week 2)
- [ ] Amazon Associates application submitted
  <!-- ACTION: External task. Apply on Amazon Associates. -->
- [ ] amazon_asin column added to variants table
  <!-- ACTION: Needs a database migration to add this column to Supabase. -->
- [ ] BuyButton component built
  <!-- ACTION: Create `BuyButton.tsx` in `components/` and integrate it into the console detail views. -->
- [ ] Legal affiliate disclosure added to site
  <!-- ACTION: Add an affiliate disclosure statement to the site footer or relevant pages. -->
- [ ] JSON-LD offers url field updated to use affiliate link
  <!-- ACTION: Wait for BuyButton implementation to integrate affiliate links into JSON-LD. -->