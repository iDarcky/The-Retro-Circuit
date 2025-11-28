'use client';

import { type ButtonHTMLAttributes, type FC, type MouseEvent } from 'react';
import { useSound } from './SoundContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  onMouseEnter,
  onClick,
  ...props 
}) => {
  const { playHover, playClick } = useSound();
  
  const baseStyles = "font-mono font-bold py-2 px-6 uppercase tracking-wider transition-all duration-200 transform border-2 relative overflow-hidden group focus:outline-none";
  
  const variants = {
    primary: "border-retro-neon text-retro-neon hover:bg-retro-neon hover:text-retro-dark shadow-[0_0_10px_rgba(0,255,157,0.5)]",
    secondary: "border-retro-blue text-retro-blue hover:bg-retro-blue hover:text-retro-dark shadow-[0_0_10px_rgba(0,255,255,0.5)]",
    danger: "border-retro-pink text-retro-pink hover:bg-retro-pink hover:text-retro-dark shadow-[0_0_10px_rgba(255,0,255,0.5)]",
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) playClick();
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${className}`}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
};

export default Button;