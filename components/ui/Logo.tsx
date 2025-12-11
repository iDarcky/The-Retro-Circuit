'use client';

import { type FC } from 'react';

interface LogoProps {
  className?: string;
  src?: string | null;
  alt?: string;
}

const Logo: FC<LogoProps> = ({ className = "h-8 w-auto", src, alt = "The Retro Circuit" }) => {
  // Simple logic: Use provided src or default to the file in public/logo.png
  const imagePath = src || '/logo.png';

  return (
    <img 
      src={imagePath} 
      alt={alt} 
      className={`${className} object-contain transition-transform duration-300 hover:scale-105`}
    />
  );
};

export default Logo;