# The Retro Circuit — Comprehensive Product Audit
**Date:** March 2026  
**Stage:** Pre-Alpha 0.5.5  
**Context:** Built by solo non-technical PM using AI.

---

## 1. CEO / Founder 
**Score: 6/10**

**What is working:** You have built an actual tool with a clear, focused value proposition. You recognized a gap in the market (comparing the saturated retro handheld space) and shipped a viable solution. The path to revenue (affiliates) is obvious and logical.
**What is broken or missing:** You are building a feature, not a moat. Specs alone are a commodity. If RetroGameCorps drops a spec table tomorrow, your site is redundant. Furthermore, there is zero defensive strategy here—affiliate sites live and die by SEO and traffic. 
**Crucial fix first:** **Diversify your content moat.** You need opinionated, editorialized content ("Best Handhelds under $100") to capture high-intent search traffic. Pure spec databases do not rank well against established editorial sites or Reddit.

## 2. Product Manager 
**Score: 7/10**

**What is working:** The user journey is highly coherent. The hero section makes the value clear, and funneling confused users into the "Finder" quiz is a textbook PM win. The information architecture (Consoles, Finder, Arena, Fabricators) is logical and flat.
**What is broken or missing:** The "Finder" logic risks being a gimmick if it merely spits out a spec sheet at the end. Users taking a quiz don't want a spec sheet—they want a highly opinionated "Buy This Now" recommendation with a clear list of pros/cons. Mixing subjective scores (`setup_ease_score`, `community_score`) with objective hardware specs in the database blurs the line between a database and a review site.
**Crucial fix first:** Rework the Finder results page to aggressively sell *why* the recommended device fits their specific quiz answers, rather than just dropping them on a product page. 

## 3. First-Time User 
**Score: 8/10**

**What is working:** The hero section is incredibly clear. 10 seconds is more than enough to learn that this is a database for comparing retro handhelds. The CTA ("Start Quiz") is perfectly placed for overwhelmed beginners.
**What is broken or missing:** The heavy "cyber/hacker" theme (e.g., "System Online", "DECRYPTING SIGNAL") is fun but borders on self-indulgent. If your target audience includes casuals looking to play Pokémon on a Miyoo, making them feel like they are hacking the mainframe creates unnecessary cognitive friction.
**Crucial fix first:** Tone down the "hacker" flavor on critical conversion paths and ensure product photography takes absolute priority over glowing borders.

## 4. Marketing / Growth 
**Score: 4/10**

**What is working:** You have basic OpenGraph tags, a catchy name, and a Twitter card setup. 
**What is broken or missing:** There is absolutely zero retention mechanism. Once a user buys a console, they have no reason to ever return. There is no email capture, no newsletter for "New Console Drops," and no user accounts to save comparisons. It is a leaky bucket.
**Crucial fix first:** Implement an email capture system instantly. "Get notified when new retro handhelds are announced" is a low-friction way to capture the audience you are paying for with SEO effort.

## 5. UI / UX Designer 
**Score: 7/10**

**What is working:** Premium aesthetic. The site uses Tailwind well, features responsive grids, and avoids the generic "bootstrap" look. It looks like a real, funded product.
**What is broken or missing:** Typography soup. You are loading four different fonts (`Press_Start_2P`, `JetBrains_Mono`, `Share_Tech_Mono`, `Inter`). This is unnecessary overhead and muddies the brand identity. Accessibility (contrast) is also a massive risk with thin glowing text on dark backgrounds.
**Crucial fix first:** Consolidate your typography. Pick one mono font and one sans-serif font. Drop the rest.

## 6. Developer / Code Quality 
**Score: 5/10**

*Note: Evaluated via codebase access.*
**What is working:** The Next.js 14/15 App Router architecture is solid. Supabase integration is clean, and the usage of Upstash for rate-limiting shows excellent foresight for protecting the DB.
**What is broken or missing:** Hardcoded tech debt. Your `next.config.mjs` has 80+ hardcoded 301 redirects mapping old slugs to new ones. This is a maintenance nightmare that will only grow as new consoles drop. Database migrations are erratic (jumping from 2024 to 2026), indicating a lack of structured schema evolution.
**Crucial fix first:** Move the redirect logic out of `next.config.mjs` and into Edge Middleware or a database table (`slug_redirects`), otherwise your config file will soon be 500 lines resulting in slower build times and merge conflicts.

## 7. SEO Analyst 
**Score: 8/10**

**What is working:** Outstanding technical SEO foundation for a solo build. JSON-LD (Organization, WebSite) is injected properly. Sitemaps and robots.txt are automated. You are proactively managing canonicals and monitoring indexing status.
**What is broken or missing:** Technical SEO is perfect, but Content SEO is dangerously thin. A page like `/fabricators/anbernic` is likely just a grid of products. Search engines will view these as "thin content" pages. 
**Crucial fix first:** Add 300-500 words of unique, structured, indexable copy to every Fabricator/Brand page and Category page to give Google semantic context to rank against.

---

### Overall Score: 6.5 / 10
*A brilliant foundation disguised as a polished product. You have built an excellent engine, but a business requires fuel (traffic) and a steering wheel (retention).*

### Top 5 Prioritised Actions (By Impact)
1. **(SEO/CEO)** Build out opinionated, narrative "Best Of" guide pages (e.g., "Best Handheld for PS2 under $150"). Specs don't rank; buying guides do.
2. **(Marketing)** Implement an email capture mechanism urgently. Give people a reason to return when new handhelds launch.
3. **(Developer)** Rip the 80+ hardcoded redirects out of `next.config.mjs` and move them to Middleware backed by a lightweight KV store or DB table.
4. **(PM)** Modify the "Finder" quiz conclusion to heavily sell *why* the recommended device was chosen based on the user's specific answers, rather than dumping them onto a spec sheet.
5. **(UI/UX)** Consolidate your 4 web fonts down to 2 to improve load times and visual consistency, and ensure text contrast passes WCAG AA standards.
