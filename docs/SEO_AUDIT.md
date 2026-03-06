# The Retro Circuit — SEO Audit
> Last updated: [date]

## 1. Indexing
- [ ] All console pages indexed (check: Search Console Coverage report)
- [ ] /consoles indexed by Google
- [ ] /consoles indexed by Bing
- [ ] /finder indexed
- [ ] /fabricators indexed
- [ ] /terms set to noindex
- [ ] /privacy set to noindex
- [ ] /credits set to noindex
- [ ] 4 noindex pages fixed (miyoo-mini-plus, powkiddy-rgb30, anbernic-rg28xx, anbernic-rg476h)
- [ ] No pages with accidental noindex in generateMetadata

## 2. Canonicals
- [ ] /consoles canonical points to https://theretrocircuit.com/consoles (not homepage)
- [ ] All console pages canonical uses manufacturer-prefixed slug
- [ ] No duplicate canonicals across the site

## 3. Redirects
- [ ] All /console/[slug] → /consoles/[slug] 301s live
- [ ] Double manufacturer prefix redirects live (asus-asus-rog-ally, nintendo-nintendo-switch)
- [ ] pocket-s-1440p manufacturerSlug fixed to "ayaneo"
- [ ] No redirect chains (A→B→C, should be A→C)

## 4. Titles & Meta
- [ ] No double titles anywhere (all console pages use title: { absolute })
- [ ] /finder title updated and description is not placeholder
- [ ] /fabricators title updated to include "Manufacturers & Brands"
- [ ] /credits has meta description
- [ ] /terms has meta description
- [ ] /privacy has meta description
- [ ] No title over 60 characters (Bing limit)

## 5. Structured Data (JSON-LD)
- [ ] Organization schema on homepage — name, url, logo, sameAs (LinkedIn only)
- [ ] WebSite schema on homepage with SearchAction
- [ ] Product schema on all console pages
- [ ] Product schema includes offers with price > 0
- [ ] Product schema includes url field in offers
- [ ] Brand schema on all /fabricators/[slug] pages
- [ ] No unfilled placeholders (YOUR_USERNAME, YOUR_PROFILE) anywhere
- [ ] Validated via Rich Results Test — 0 errors

## 6. H1 Tags
- [ ] /consoles has an H1 tag
- [ ] All console pages have an H1 tag
- [ ] All fabricator pages have an H1 tag
- [ ] /finder has an H1 tag

## 7. Internal Links
- [ ] No internal links using old short slugs (/consoles/loki, /consoles/mini-plus etc)
- [ ] SimilarConsoles.tsx uses manufacturer-prefixed slugs
- [ ] Arena dropdown uses correct manufacturerSlug for all consoles
- [ ] revalidatePath calls use manufacturer-prefixed slugs

## 8. Sitemap
- [ ] sitemap.xml contains all published console pages
- [ ] No double manufacturer prefix in sitemap URLs
- [ ] No old short slugs in sitemap
- [ ] No RSS or secondary sitemaps generating old URLs
- [ ] Sitemap submitted to Google Search Console
- [ ] Sitemap submitted to Bing Webmaster Tools

## 9. Performance
- [ ] resolveConsoleSlug fix live (no repeated DB calls)
- [ ] Rate limiting active (300 req/min)
- [ ] Static pages not hitting rate limiter
- [ ] /roadmap is static, not force-dynamic
- [ ] Vercel Fluid CPU usage under 3h/4h limit

## 10. IndexNow
- [ ] IndexNow key file exists at /public/[key].txt
- [ ] INDEXNOW_KEY set in Vercel environment variables
- [ ] IndexNow API call added to admin Server Actions on console create/update
- [ ] Sitemap submitted via IndexNow

## 11. Bing Webmaster Tools
- [ ] Site verified in Bing Webmaster Tools
- [ ] Sitemap submitted
- [ ] /consoles canonical error resolved
- [ ] H1 missing error resolved

## 12. Google Search Console
- [ ] 0 pages with noindex error
- [ ] 0 pages with 404 error
- [ ] Redirect validation passing
- [ ] Rich Results showing Product snippets
- [ ] Manual indexing requested for top 10 pages

## 13. Affiliate (Week 2)
- [ ] Amazon Associates application submitted
- [ ] amazon_asin column added to variants table
- [ ] BuyButton component built
- [ ] Legal affiliate disclosure added to site
- [ ] JSON-LD offers url field updated to use affiliate link