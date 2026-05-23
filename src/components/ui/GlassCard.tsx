import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'white' | 'dark';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  onClick?: () => void;
}

const variantClasses = {
  default: 'glass',
  strong: 'glass-strong',
  white: 'glass-white',
  dark: 'glass-dark',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'md',
  rounded = 'xl',
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        roundedClasses[rounded],
        hover && 'glass-hover transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-glass-lg',
        onClick && 'cursor-pointer',
        'transition-all duration-300',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
