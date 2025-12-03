import { ReactNode } from "react";
import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";
import "../styles/globals.css";
import ClientShell from "../components/layout/ClientShell";

// Load fonts via Next.js to prevent Layout Shift
const pressStart = Press_Start_2P({ 
  weight: "400", 
  subsets: ["latin"],
  variable: '--font-press-start'
});

const shareTech = Share_Tech_Mono({ 
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

export const metadata = {
  metadataBase: new URL('https://theretrocircuit.com'),
  title: "The Retro Circuit | Retro Gaming Database & Comparisons",
  description: "The ultimate retro gaming database. Compare console specs, read classic game reviews, and view the complete timeline of video game history.",
  keywords: ["retro gaming", "console specs", "video game database", "retro reviews", "console comparison"],
  icons: {
    icon: '/logo.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    siteName: 'The Retro Circuit',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${shareTech.variable}`}>
        {/* CRT Overlay Effects */}
        <div className="scanlines"></div>
        <div className="crt-flicker"></div>
        
        {/* Main Application Shell */}
        <ClientShell>
            {children}
        </ClientShell>
      </body>
    </html>
  );
}