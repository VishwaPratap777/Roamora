import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function ProgressBar({
  progress,
  className,
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/50 font-medium">Progress</span>
          <span className="text-xs text-primary-300 font-medium">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden bg-white/[0.06]',
          size === 'sm' ? 'h-1' : 'h-2'
        )}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 12px rgba(200, 164, 78, 0.4)',
          }}
        />
      </div>
    </div>
  );
}
