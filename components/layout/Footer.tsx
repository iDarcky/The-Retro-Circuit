'use client';

import { type FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useConsent } from '../privacy/ConsentContext';
import { retroAuth } from '../../lib/auth';

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

  // BETA BRANCH: one line on desktop. It wraps on narrow phones, where one line cannot fit.
  const links = [
    { label: 'About', href: '/about' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Credits', href: '/credits' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
  ];
  const link = 'hover:text-white transition-colors';

  return (
    <footer className="w-full bg-bg-primary shrink-0 z-10 relative">
      <div className="w-full h-[2px] bg-gradient-to-r from-[#ff4f00] via-pink-500 via-violet-500 via-cyan-500 to-[#10b981]" />
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 py-4 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-x-5 gap-y-2 text-xs text-text-secondary">
        <Link href="/" className={`font-bold text-white whitespace-nowrap ${link}`}>© {currentYear} The Retro Circuit</Link>
        {/* Amazon specifies this sentence verbatim. */}
        <span className="min-w-0 text-zinc-500 text-center md:text-left">As an Amazon Associate I earn from qualifying purchases.</span>
        <nav aria-label="Footer" className="flex flex-wrap md:flex-nowrap shrink-0 items-center justify-center gap-x-4 gap-y-1 whitespace-nowrap">
          {links.map((l) => <Link key={l.href} href={l.href} className={link}>{l.label}</Link>)}
          <button type="button" onClick={reset} className={link}>Cookies</button>
          <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-wider text-zinc-500">VER {version.replace(/^pre-?alpha\s*/i, '')}</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-500">Online<span className="w-1.5 h-1.5 bg-emerald-500 motion-safe:animate-pulse" aria-hidden /></span>
          <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-wider text-zinc-600">Loc: Mars</span>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
