import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'selected' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Chip({
  label,
  icon,
  selected = false,
  onClick,
  variant = 'default',
  size = 'md',
  className,
}: ChipProps) {
  const isSelected = selected || variant === 'selected';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border transition-all duration-300 cursor-pointer font-medium',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        isSelected
          ? 'border-primary-400/50 bg-primary-400/15 text-primary-200 shadow-[0_0_15px_rgba(200,164,78,0.15)]'
          : variant === 'muted'
            ? 'border-white/5 bg-white/[0.03] text-white/40'
            : 'border-white/10 bg-white/[0.05] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90',
        className
      )}
    >
      {icon && (
        <span className={cn('flex-shrink-0', isSelected ? 'text-primary-300' : 'text-white/50')}>
          {icon}
        </span>
      )}
      <span>{label}</span>
      {isSelected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-400/30 flex items-center justify-center"
        >
          <svg className="w-2.5 h-2.5 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}
