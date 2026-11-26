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
    <footer className="w-full bg-bg-primary shrink-0 z-10 relative border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 py-4 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-x-5 gap-y-2 text-xs text-text-secondary">
        <Link href="/" className={`font-bold text-white whitespace-nowrap ${link}`}>© {currentYear} The Retro Circuit</Link>
        {/* Amazon specifies this sentence verbatim. */}
        <span className="text-zinc-500 text-center md:text-left md:truncate">As an Amazon Associate I earn from qualifying purchases.</span>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 whitespace-nowrap">
          {links.map((l) => <Link key={l.href} href={l.href} className={link}>{l.label}</Link>)}
          <button type="button" onClick={reset} className={link}>Cookies</button>
          <span className="font-mono text-zinc-600">{version.replace(/^pre-?alpha\s*/i, 'v')}</span>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
