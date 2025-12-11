'use client';

import { type FC } from 'react';

interface LogoProps {
  className?: string;
  animate?: boolean;
  src?: string | null;
  alt?: string;
}

const Logo: FC<LogoProps> = ({ className = "h-8 w-auto", animate = true, src, alt = "The Retro Circuit" }) => {
  const logoSrc = src || '/logo.png';

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* 
        Using standard <img> instead of next/image here because we are loading 
        a static asset from /public where dimensions might not be known at build time,
        preventing the "broken image" or 0x0 size issue.
      */}
      <img 
        src={logoSrc} 
        alt={alt} 
        className={`w-auto h-full object-contain ${animate ? 'hover:scale-105 transition-transform duration-300' : ''}`}
      />
    </div>
  );
};

export default Logo;