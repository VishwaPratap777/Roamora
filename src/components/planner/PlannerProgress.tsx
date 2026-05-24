import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { MapPin, Sliders, Sparkles, Rocket } from 'lucide-react';

interface PlannerProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: 'Destination', icon: MapPin },
  { label: 'Preferences', icon: Sliders },
  { label: 'Vibes', icon: Sparkles },
  { label: 'Generate', icon: Rocket },
];

export default function PlannerProgress({ currentStep, totalSteps }: PlannerProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Desktop progress */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Connecting line background */}
        <div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-white/10" />

        {/* Active connecting line */}
        <motion.div
          className="absolute top-5 left-[10%] h-[2px] bg-gradient-to-r from-primary-500 to-primary-300"
          initial={{ width: '0%' }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 80}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ boxShadow: '0 0 8px rgba(200, 164, 78, 0.4)' }}
        />

        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const Icon = step.icon;

          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isActive
                    ? 'border-primary-400 bg-primary-400/20 text-primary-300 shadow-[0_0_20px_rgba(200,164,78,0.3)]'
                    : isCompleted
                      ? 'border-primary-500 bg-primary-500 text-dark-950'
                      : 'border-white/15 bg-white/[0.04] text-white/30'
                )}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </motion.div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-300',
                  isActive ? 'text-primary-300' : isCompleted ? 'text-white/60' : 'text-white/30'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile progress — compact */}
      <div className="flex sm:hidden items-center justify-between px-4">
        <span className="text-sm text-white/50">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary-300">{STEPS[currentStep - 1]?.label}</span>
        <div className="flex gap-1.5">
          {STEPS.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index + 1 === currentStep
                  ? 'w-6 bg-primary-400'
                  : index + 1 < currentStep
                    ? 'w-1.5 bg-primary-500'
                    : 'w-1.5 bg-white/15'
              )}
              layout
            />
          ))}
        </div>
      </div>
    </div>
  );
}
