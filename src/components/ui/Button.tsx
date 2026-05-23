import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glow?: boolean;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-accent-gold to-primary-300 text-dark-950 font-semibold hover:shadow-glow-gold hover:scale-[1.02]',
  secondary: 'glass glass-hover text-white font-medium',
  outline: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-medium',
  ghost: 'text-white/70 hover:text-white hover:bg-white/5 font-medium',
  glass: 'glass-strong text-white hover:bg-white/15 font-medium',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  glow = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-300 relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        glow && 'animate-glow',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}
