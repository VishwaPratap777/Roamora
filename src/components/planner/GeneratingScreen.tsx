import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

interface GeneratingScreenProps {
  destination: string;
}

const STATUS_MESSAGES = [
  { text: 'Searching for hidden gems', icon: '💎' },
  { text: 'Mapping the perfect route', icon: '🗺️' },
  { text: 'Finding authentic local experiences', icon: '🏔️' },
  { text: 'Calculating golden hour timings', icon: '🌅' },
  { text: 'Estimating costs & budgets', icon: '💰' },
  { text: 'Optimizing your daily schedule', icon: '⚡' },
  { text: 'Discovering secret viewpoints', icon: '📸' },
  { text: 'Almost there...', icon: '✨' },
];

export default function GeneratingScreen({ destination }: GeneratingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar (fake progress capped at 90%)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        // Slow down as it approaches 90
        const increment = prev < 30 ? 8 : prev < 60 ? 5 : prev < 80 ? 2 : 0.5;
        return Math.min(90, prev + increment);
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(200,164,78,0.08) 0%, rgba(200,164,78,0.02) 40%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Animated compass */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400/20 to-primary-500/10 border border-primary-400/20 flex items-center justify-center mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Compass className="w-10 h-10 text-primary-400" />
          </motion.div>
        </motion.div>

        {/* Destination */}
        <motion.h2
          className="text-2xl md:text-3xl font-heading text-gradient-gold mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Planning {destination}
        </motion.h2>

        {/* Status message */}
        <div className="h-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-white/50 text-sm"
            >
              <span>{STATUS_MESSAGES[messageIndex].icon}</span>
              <span>{STATUS_MESSAGES[messageIndex].text} in {destination}...</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <ProgressBar progress={progress} size="sm" />
        </div>

        <p className="text-xs text-white/25 mt-4">
          This usually takes 8–15 seconds
        </p>
      </div>
    </motion.div>
  );
}
