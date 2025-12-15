'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from '../ui/SearchContext';
import { useSound } from '../ui/SoundContext';
import { IconDatabase, IconChip, IconVS, IconSearch } from '../ui/Icons';

const NavItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === to : pathname.startsWith(to);
  const { playHover, playClick } = useSound();

  return (
    <Link
      href={to}
      className={`group flex items-center px-4 py-2 font-mono transition-all duration-200 border-b-2 h-full ${
        isActive
          ? 'border-retro-neon text-white drop-shadow-[0_0_8px_rgba(0,255,157,0.3)]'
          : 'border-transparent text-gray-400 hover:text-retro-blue hover:border-retro-blue'
      }`}
      onMouseEnter={playHover}
      onClick={playClick}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-retro-neon' : 'group-hover:scale-110'}`}>
        <Icon className="w-4 h-4 mr-2" />
      </div>
      <span className="tracking-widest text-sm uppercase">{label}</span>
    </Link>
  );
};

export default function DesktopHeader() {
  const { openSearch } = useSearch();

  return (
    <header className="hidden md:flex sticky top-0 z-50 w-full bg-retro-dark/95 backdrop-blur-md border-b border-retro-grid h-16 items-center justify-between px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

      {/* LEFT: LOGO */}
      <div className="flex items-center">
        <Link href="/" className="block hover:opacity-80 transition-opacity">
          <Image
            src="/brand-logo.png"
            alt="The Retro Circuit"
            width={160}
            height={40}
            priority
            className="object-contain drop-shadow-[0_0_8px_rgba(0,255,157,0.3)]"
          />
        </Link>
      </div>

      {/* CENTER: NAVIGATION */}
      <nav className="flex items-center h-full gap-2">
        <NavItem to="/console" icon={IconDatabase} label="Consoles" />
        <NavItem to="/fabricators" icon={IconChip} label="Fabricators" />
        <NavItem to="/arena" icon={IconVS} label="VS Mode" />
      </nav>

      {/* RIGHT: TOOLS */}
      <div className="flex items-center gap-4">
        {/* Search Trigger */}
        <button
          onClick={openSearch}
          className="bg-black/40 border border-white/10 text-gray-500 font-mono text-sm px-4 py-2 flex items-center gap-3 hover:border-retro-neon hover:text-white transition-all group rounded-sm"
        >
            <IconSearch className="w-4 h-4" />
            <span className="tracking-wider">SEARCH</span>
            <span className="text-[10px] border border-gray-700 px-1.5 py-0.5 rounded text-gray-600 group-hover:text-retro-neon group-hover:border-retro-neon">
                CMD+K
            </span>
        </button>
      </div>

    </header>
  );
}
