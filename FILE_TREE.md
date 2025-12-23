# Repository File Structure

This document lists every file in the repository (excluding `.git`, `node_modules`, `.next`, and build artifacts).

```text
.
├── README.md
├── SystemMap.tsx
├── app
│   ├── about
│   │   └── page.tsx
│   ├── actions
│   │   └── revalidate.ts
│   ├── admin
│   │   └── page.tsx
│   ├── arena
│   │   ├── [versus]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── consoles
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   ├── brand
│   │   │   └── [name]
│   │   └── page.tsx
│   ├── credits
│   │   └── page.tsx
│   ├── error.tsx
│   ├── fabricators
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── finder
│   │   ├── actions.ts
│   │   └── page.tsx
│   ├── global-error.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── login
│   │   └── page.tsx
│   ├── news
│   │   └── page.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── privacy
│   │   └── page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── terms
│   │   └── page.tsx
├── components
│   ├── AuthSync.tsx
│   ├── admin
│   │   ├── AdminEditTrigger.tsx
│   │   ├── AdminInput.tsx
│   │   ├── ConsoleForm.tsx
│   │   ├── EmulationForm.tsx
│   │   ├── ManufacturerForm.tsx
│   │   ├── SettingsForm.tsx
│   │   └── VariantForm.tsx
│   ├── arena
│   │   ├── ComparisonRow.tsx
│   │   └── ConsoleSearch.tsx
│   ├── console
│   │   ├── ConsoleDetailView.tsx
│   │   ├── ConsoleVaultClient.tsx
│   │   └── EmulationGrid.tsx
│   ├── finder
│   │   ├── FinderFlow.tsx
│   │   ├── FinderLanding.tsx
│   │   ├── FinderResults.tsx
│   │   └── QuizQuestion.tsx
│   ├── landing
│   │   ├── LandingPage.tsx
│   │   └── QuickCompare.tsx
│   ├── layout
│   │   ├── ClientShell.tsx
│   │   ├── DesktopHeader.tsx
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── MobileTopBar.tsx
│   ├── ui
│   │   ├── AvatarSelector.tsx
│   │   ├── Button.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GlobalSearch.tsx
│   │   ├── Icons.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Logo.tsx
│   │   ├── RetroLoader.tsx
│   │   ├── RetroStatusBar.tsx
│   │   ├── SEOHead.tsx
│   │   ├── SearchContext.tsx
│   │   ├── SoundContext.tsx
│   │   └── specs
│   │       ├── SpecCard.tsx
│   │       ├── SpecField.tsx
│   │       └── TechBadge.tsx
├── config
│   └── site.ts
├── data
│   ├── avatars.tsx
│   └── static.ts
├── lib
│   ├── api
│   │   ├── common.ts
│   │   ├── consoles.ts
│   │   ├── latest.ts
│   │   ├── manufacturers.ts
│   │   └── search.ts
│   ├── api.ts
│   ├── auth.ts
│   ├── compare.ts
│   ├── config
│   │   ├── arena-metrics.ts
│   │   └── constants.ts
│   ├── finder
│   │   └── scoring.ts
│   ├── schemas
│   │   └── validation.ts
│   ├── supabase
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── singleton.ts
│   ├── types
│   │   └── domain.ts
│   ├── types.ts
│   └── utils
│       ├── doc-version.ts
│       └── index.ts
├── metadata.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── proxy.ts
├── public
│   ├── _redirects
│   ├── brand-logo.png
│   ├── favicon-v2.png
│   ├── og-v2.png
│   └── robots.txt
├── styles
│   └── globals.css
├── tailwind.config.js
├── tailwind.config.js.bak
├── tsconfig.json
├── types.ts
└── vercel.json
```
