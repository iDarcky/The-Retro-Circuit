'use client';

import { type FC } from 'react';
import Image from 'next/image';

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
      <Image 
        src={logoSrc} 
        alt={alt} 
        width={0}
        height={0}
        sizes="100vw"
        className={`w-auto h-full object-contain ${animate ? 'hover:scale-105 transition-transform duration-300' : ''}`}
        priority
      />
    </div>
  );
};

export default Logo;