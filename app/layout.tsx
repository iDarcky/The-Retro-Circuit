import { ReactNode } from "react";
import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono, Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import ClientShell from "../components/layout/ClientShell";
import AuthSync from "../components/AuthSync";
import Footer from "../components/layout/Footer";
import { siteConfig } from "../config/site";

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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f1b",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: 'The Retro Circuit',
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${jetBrainsMono.variable} ${shareTechMono.variable} font-mono min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* CRT Overlay Effects */}
        <div className="scanlines"></div>
        <div className="crt-flicker"></div>
        
        {/* Auth Synchronization */}
        <AuthSync />

        {/* Main Application Shell */}
        <ClientShell>
            {/* Flex wrapper to ensure footer sticks to bottom */}
            <div className="flex-1 w-full flex flex-col">
              {children}
            </div>
            <Footer />
        </ClientShell>
        <Analytics />
      </body>
    </html>
  );
}
