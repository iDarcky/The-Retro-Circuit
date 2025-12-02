import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f1b",
};

export const metadata: Metadata = {
  title: "The Retro Circuit | Retro Gaming Database & Comparisons",
  description: "The ultimate retro gaming database. Compare console specs, read classic game reviews, and view the complete timeline of video game history.",
  keywords: ["retro gaming", "console specs", "video game database", "retro reviews", "console comparison"],
  icons: {
    icon: '/logo.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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