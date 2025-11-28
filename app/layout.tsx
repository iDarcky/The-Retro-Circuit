import './globals.css';
import type { Metadata } from 'next';
import { Press_Start_2P, Share_Tech_Mono } from 'next/font/google';
import { SoundProvider } from '@/components/ui/SoundContext';
import AppShell from '@/components/AppShell';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'The Retro Circuit | Retro Gaming Database & Comparisons',
  description: 'The ultimate retro gaming database. Compare console specs, read classic game reviews, and view the complete timeline of video game history.',
  keywords: 'retro gaming, console specs, video game database, retro reviews, console comparison, nintendo, sega, playstation history',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${shareTechMono.variable} font-sans`}>
        <div className="scanlines"></div>
        <div className="crt-flicker"></div>
        <SoundProvider>
            <AppShell>
                {children}
            </AppShell>
        </SoundProvider>
      </body>
    </html>
  );
}