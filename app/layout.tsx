import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Press_Start_2P, JetBrains_Mono, Share_Tech_Mono, Inter } from "next/font/google";
import "./globals.css";
import ClientShell from "../components/layout/ClientShell";
import AuthSync from "../components/auth/AuthSync";
import Footer from "../components/layout/Footer";
import { ConsentProvider } from "../components/privacy/ConsentContext";
import { CookieBanner } from "../components/privacy/CookieBanner";
import { AnalyticsWrapper } from "../components/privacy/AnalyticsWrapper";
import { siteConfig } from "../config/site";
import { getSystemVersion } from "./actions/roadmap";
import { ThemeProvider } from "../components/layout/ThemeProvider";

// Load fonts via Next.js to prevent Layout Shift
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-press-start'
});

// Replaced Share_Tech_Mono with JetBrains_Mono as requested
const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: '--font-mono'
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-share-tech'
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f1b",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon-v2.png',
    shortcut: '/favicon-v2.png',
    apple: '/favicon-v2.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og-v2.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-v2.png'],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const version = await getSystemVersion();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: 'The Retro Circuit',
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/finder?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon-v2.png`,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${pressStart.variable} ${jetBrainsMono.variable} ${shareTechMono.variable} ${inter.variable} font-sans min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased selection:bg-violet-500/30 selection:text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />

        {/* Auth Synchronization */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ConsentProvider>
          <AuthSync />

          {/* Main Application Shell */}
          <ClientShell>
            {/* Flex wrapper to ensure footer sticks to bottom */}
            <div className="flex-1 w-full flex flex-col">
              {children}
            </div>
            <Footer version={version} />
          </ClientShell>

          <CookieBanner />
          <AnalyticsWrapper />
        </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
