import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SelectionCard({
  icon,
  title,
  description,
  selected,
  onClick,
  className,
  size = 'md',
}: SelectionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative flex flex-col items-center text-center rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden group',
        size === 'sm' && 'p-4 gap-2',
        size === 'md' && 'p-6 gap-3',
        size === 'lg' && 'p-8 gap-4',
        selected
          ? 'border-primary-400/60 bg-primary-400/10 shadow-glow-gold'
          : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]',
        className
      )}
    >
      {/* Glow overlay when selected */}
      {selected && (
        <motion.div
          layoutId="card-glow"
          className="absolute inset-0 bg-gradient-to-br from-primary-400/10 via-transparent to-primary-500/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          'relative z-10 flex items-center justify-center rounded-xl transition-colors duration-300',
          size === 'sm' && 'w-10 h-10 text-lg',
          size === 'md' && 'w-14 h-14 text-2xl',
          size === 'lg' && 'w-16 h-16 text-3xl',
          selected
            ? 'bg-primary-400/20 text-primary-300'
            : 'bg-white/[0.06] text-white/60 group-hover:text-white/80'
        )}
      >
        {icon}
      </div>

      {/* Title */}
      <span
        className={cn(
          'relative z-10 font-medium transition-colors duration-300',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
          selected ? 'text-primary-200' : 'text-white/80'
        )}
      >
        {title}
      </span>

      {/* Description */}
      {description && (
        <span
          className={cn(
            'relative z-10 text-xs leading-relaxed transition-colors duration-300',
            selected ? 'text-white/60' : 'text-white/40'
          )}
        >
          {description}
        </span>
      )}

      {/* Selected checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-400 flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
