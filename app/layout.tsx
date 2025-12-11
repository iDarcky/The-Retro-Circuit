import { ReactNode } from "react";
import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import ClientShell from "../components/layout/ClientShell";
import AuthSync from "../components/AuthSync";
import Footer from "../components/layout/Footer";

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
  title: "The Retro Circuit",
  description: "The ultimate retro gaming database.",
  // Icons and OpenGraph images are now automatically handled by Next.js 
  // because the files (favicon.ico, opengraph-image.png) exist in the app/ folder.
  manifest: '/manifest.json',
  openGraph: {
    siteName: 'The Retro Circuit',
    type: 'website',
    locale: 'en_US',
    url: 'https://theretrocircuit.com',
    title: "The Retro Circuit",
    description: "The ultimate retro gaming database.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${shareTech.variable} min-h-screen flex flex-col`}>
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