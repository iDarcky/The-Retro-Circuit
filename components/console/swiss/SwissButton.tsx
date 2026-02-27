'use client';

import { type ButtonHTMLAttributes, type FC } from 'react';

interface SwissButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'orange';
  isLoading?: boolean;
}

const SwissButton: FC<SwissButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  onClick,
  ...props
}) => {

  const baseStyles = "font-mono text-xs uppercase tracking-wider py-2 px-6 transition-all border disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[1px]";

  const variants = {
    // Primary: Solid White/Black
    primary: "bg-white text-black border-white hover:bg-zinc-200 hover:border-zinc-200",
    // Secondary: Outline
    secondary: "bg-transparent text-white border-white/20 hover:border-white hover:text-white hover:bg-white/5",
    // Danger: Red/Rose
    danger: "bg-transparent text-rose-500 border-rose-500/50 hover:bg-rose-500 hover:text-white hover:border-rose-500",
    // Orange: Solid Orange/Black
    orange: "bg-orange-500 text-black border-orange-500 hover:bg-orange-400 hover:border-orange-400",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
        )}
        {children}
      </span>
    </button>
  );
};

export default SwissButton;
