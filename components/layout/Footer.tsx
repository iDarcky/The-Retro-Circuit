'use client';

import { type FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '../../config/site';
import { useConsent } from '../privacy/ConsentContext';
import { retroAuth } from '../../lib/auth';
import { ThemeToggle } from './ThemeToggle';

interface FooterProps {
  version: string;
}

const Footer: FC<FooterProps> = ({ version }) => {
  const currentYear = new Date().getFullYear();
  const { reset } = useConsent();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await retroAuth.isAdmin();
      setIsAdmin(admin);
    };
    checkAdmin();
  }, []);

  return (
    <footer className="w-full bg-bg-primary shrink-0 z-10 relative">
      {/* Swiss Gradient Line - Full Spectrum */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#ff4f00] via-pink-500 via-violet-500 via-cyan-500 to-[#10b981]" />

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        
        {/* Left: Branding & Legal */}
        <div className="flex flex-col items-center md:items-start gap-1 text-xs font-sans text-text-muted">
           <Link href="/" className="font-bold text-text-primary tracking-tight uppercase hover:text-primary transition-colors">
             The Retro Circuit
           </Link>
           <span className="text-[10px]">© {currentYear} All Rights Reserved.</span>
           <button
             onClick={reset}
             className="text-[10px] uppercase text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer text-left"
           >
             Cookie Settings
           </button>
        </div>

        {/* Center: Navigation */}
        <nav className="flex flex-wrap justify-center items-center gap-6 text-xs font-sans font-medium tracking-wide text-text-secondary">
           {siteConfig.routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {route.label}
              </Link>
           ))}
           {isAdmin && (
             <Link
               href="/admin"
               className="hover:text-primary transition-colors duration-200"
             >
               Admin
             </Link>
           )}
           <div className="ml-4 flex items-center">
             <ThemeToggle />
           </div>
        </nav>

        {/* Right: System Status */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-text-secondary tracking-wider uppercase">
           <span>VER: {version}</span>
           <span className="flex items-center gap-2 text-emerald-500">
             ONLINE
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_currentColor]"></span>
           </span>
           <span className="hidden sm:inline opacity-50">LOC: MARS</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
