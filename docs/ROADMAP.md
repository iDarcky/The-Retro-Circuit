# Project Roadmap & Changelog

Generated on: 2/27/2026

## Changelog

### vPre-Alpha 0.5.4 - 2/27/2026
**Search Update**
> Updating the search to include the manufacturer name.

- [x] **Display Variant number**
- [x] **Roadmap page ui **
- [x] **Search remake**

### vPre-Alpha 0.5.3 - 2/25/2026
**Bug fixes **
> Fixed the Drop-down menu bug, changed the background image and OG image.

- [x] **Drop-down menu update**
- [x] **Variant comparison**
- [x] **/fabricators/[slug] redesign**
- [x] **Dynamic OG image**
- [x] **Background photo change**

### vPre-Alpha 0.5.2 - 2/24/2026
**Sorting**
> Sorting update and starting finder, VS and console page redesign.

- [x] **Smart Sorting**

### vPre-Alpha 0.5.1 - 2/23/2026
**SEO optimization **
> Added some SEO optimization for the website 

- [x] **Advanced Entity Schema (JSON-LD)**
- [x] **OpenGraph & Social Metadata **
- [x] **Dynamic Sitemap**
- [x] **Dynamic Metadata**

### vPre-ALPHA 0.5.0 - 2/23/2026
**The UI Update**
> The UI was updated to the swiss design.

- (No features linked)

## Roadmap

### In Progress

#### Critical
- [ ] **Console page redesign**
  - Redesign the Console page.
- [ ] **Finder rework**
  - Rework the finder so that the questions are taken into consideration.

- [ ] **VS page rework**
  - Rework the VS page to make it fit the swiss design language as well to make the data there readable. 

### Planned

#### Critical
- [ ] **Logo clickable ** (Target: 2/23/2026)
  - Make the top right logo clickable, not just the text
- [ ] **Living Design System**
  - Create a hidden /design route that displays all buttons, badges, and typestyles to ensure "Swiss" consistency.
- [ ] **Liability Disclaimer Page**
  - Create a clear Terms/Disclaimer page stating "The Retro Circuit is not responsible for hardware damage from overclocking/modding", and any other things that are needed for the disclaimer, terms poage.
- [ ] **Rate Limiting (API Protection)**
  - Implement upstash/ratelimit or similar on search and form endpoints to prevent abuse and DoS.
- [ ] **Dark Mode Integrity**
  - Ensure class="dark" is enforced and no white flashes occur on load.
- [ ] **Similar consoles**
  - Add a "Similar Consoles" section at the bottom of Detail Views.
- [ ] **Upcoming**
  - Add an option to set the time to upcoming for the consoles.
- [ ] **Legal Disclosures**
  - Add "Amazon Associate" and other affiliate disclosures to the Footer.
- [ ] **Affiliate Integration**
  - Add columns to the DB and implement a BuyButton component.
- [ ] **2nd Screen more fields**
  - Add more fields in regards to the 2nd screen. Panel type, etc
- [ ] **Add GHz to GPU Speed**
  - Add the possibility to convert to GHz to the GPU Clock Speed 
- [ ] **Nav Pill Icons**
  - Change the icons of the nav pill on mobile to the new one, and change the links to home, console vault, vs and news
- [ ] **Landing Page VS fix**
  - Fix the starting of VS from the landing page.

#### Must Have
- [ ] **Command Palette**
  - (Cmd+K): Implement a global command menu for power users to navigate Consoles, VS Mode, and Settings instantly.
- [ ] **Environment Variable Validation**
  - Use t3-env or zod to fail the build immediately if NEXT_PUBLIC_SUPABASE_URL or other keys are missing.
- [ ] **PWA & Install Prompt**
  - Add manifest.json and ios-pwa-splash to allow users to "Install" the site as an app. This aligns with the "Launcher" vision.
- [ ] **Server Actions Migration**
  - Move addConsole/updateConsole logic to Server Actions for better security and type safety.
- [ ] **CI/CD Pipeline**
  - Set up GitHub Actions for automated linting and build verification.
- [ ] **Type Safety**
  - Strictly define ConsoleFormData with Zod to match the DB schema and avoid any types.
- [ ] **Database Backups**
  - Enable Point-in-Time Recovery (PITR) in Supabase.
- [ ] **Error Monitoring**
  - Integrate Sentry for client/server error tracking.
- [ ] **Performance: Image Optimization**
  - Audit FeaturedConsoles and others to use proper sizes props and AVIF/WebP formats.
- [ ] **Custom Scrollbars**
  - Style WebKit scrollbars to match the dark theme.
- [ ] **"Swiss Design" Polish**
  - Standardize all grid gaps and strictly enforce the design system (squares, minimal borders).
- [ ] **Focus States**
  - Ensure visible focus rings (ring-violet-500) for keyboard navigation accessibility.
- [ ] **Loading States**
  - Implement Skeleton screens for all data-fetching components to improve perceived performance.
- [ ] **Social Sharing Cards (OG)**
  - Use @vercel/og to generate dynamic images for comparison pages (e.g., showing both consoles in the preview image).
- [ ] **Email Capture System**
  - Add "Notify when Released" buttons and "Price Drop Alerts" to capture user emails (Mailchimp/Resend integration).
- [ ] **Export as Image/PDF**
  - Allow users to download the comparison card for offline sharing.
- [ ] **Variant sort**
  - Sort the variants by price. If the price is the same, sort by default. Also hide default tag
- [ ] **Variant comparison mobile**
  - Add the variant comparison to mobile 
- [ ] **Mobile /console/[slug] header**
  - Fix the header for the console page. 

#### Nice to Have
- [ ] **Internationalization (i18n) Readiness**
  - Scaffold the project with next-intl to support future Brazilian/SEA markets without a full rewrite.
- [ ] **Haptics**
  - Add navigator.vibrate to key interactions (like the "Fight" button).
- [ ] **Real-World Battery Gauge**
  - Display "Est. 3-5 Hours" based on battery_wh / tdp calculation, not just mAh.
- [ ] **Viewport Management**
  - Add interactive-widget=resizes-content to layout.tsx to fix iOS keyboard layout shifts.
- [ ] **"Verified Owner" Badges**
  - Verification system for users who prove ownership.
- [ ] **Community Playability Voting**
  - Allow logged-in users to vote on game performance ("Playable", "Struggles", "No-Go").
- [ ] **User Reviews & Ratings**
  - Database table for reviews. UI for Star Ratings and short comments.
- [ ] **Price History & Tracking**
  - Create a price history table and display a Sparkline chart (6-month trend) with a "Best Time to Buy" indicator.
- [ ] **"Glitch" Effects**
  - Add a CSS glitch effect to the "VS" circle on hover.
- [ ] **Visual Size Comparison**
  - Render a static SVG outline of a common object (Credit Card, iPhone) next to the console outline using width_mm.
- [ ] **3+ Device Comparison**
  - Expand /arena to support side-by-side comparison of 3-4 devices (currently limited to 2). Update routing to /arena/[...slugs].
- [ ] **"Finder" to Email Capture**
  - At the end of a search/finder result, offer to email updates when better options release.
- [ ] **"Simple Mode" Toggle**
  - A context toggle to hide technical specs (Clock Speed, TDP) for casual users, showing only "Playable Systems", Screen Size, and Battery.
- [ ] **Keyboard Navigation:**
  - Implement ArrowDown / Enter support in the search dropdown for power users.
- [ ] **"No Results" Empty State**
  - Design a helpful component for when search yields no results (e.g., "System Not Found", "Request This Device" link) instead of a blank screen.
- [ ] **Systems-bases search**
  - Allowed the search by systems systems ("PS2", "GameCube").
- [ ] **Game-Based Search Engine**
  - Allow searching by games ("God of War", "Pokemon Emerald").
- [ ] **Console vault scroll **
  - Fix the scroll of the console vault so it goes back to top. Also implement the back logic.
- [ ] **Better Filters**
  - Better filters for the console vault. Implement filters for Price Range ($0-$800), Manufacturer, CPU Generation, RAM (4GB, 8GB, etc.), OS (Android, Linux, Windows), and Release Year.
- [ ] **Fabricator page rework**
  - Rework the fabricator page to fit the new design language 
- [ ] **VS rivals**
  - Better Rivals recommendations.
- [ ] **Add pills to pages**
  - Add matching pills to each pages (Console Vault, Fabricator, VS Arena for now)
- [ ] **Error pages**
  - Error pages update to the Swiss UI
- [ ] **Newsletter**
  - Add a monthly or weekly newsletter with news from the website and from the handheld world

