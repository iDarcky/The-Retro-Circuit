import { FC, ButtonHTMLAttributes } from 'react';

type SwissButtonVariant = 'primary' | 'secondary' | 'danger' | 'orange';

interface SwissButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SwissButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const SwissButton: FC<SwissButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest px-6 py-3 border transition-all duration-200";

  const variants = {
    // Primary: Light mode: Black border, white bg, black text. Dark mode: White border, white bg, black text.
    primary: "bg-bg-secondary text-text-primary border-border-strong hover:bg-bg-tertiary",
    // Secondary: Outline
    secondary: "bg-transparent text-text-primary border-border-strong hover:bg-bg-primary",
    // Danger: Red outline to solid
    danger: "bg-transparent text-rose-500 border-rose-500 hover:bg-rose-500 hover:text-text-primary",
    // Orange: Solid Orange/Black
    orange: "bg-orange-500 text-black border-orange-500 hover:bg-orange-400 hover:border-orange-400",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {/* Decorative corners */}
      <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current opacity-50 -translate-x-[2px] -translate-y-[2px]" />
      <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-current opacity-50 translate-x-[2px] -translate-y-[2px]" />
      <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-current opacity-50 -translate-x-[2px] translate-y-[2px]" />
      <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current opacity-50 translate-x-[2px] translate-y-[2px]" />

      {children}
    </button>
  );
};

export default SwissButton;
