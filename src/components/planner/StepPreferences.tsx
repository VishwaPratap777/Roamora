import { motion } from 'framer-motion';
import { Backpack, Scale, Crown, User, Heart, Users, Baby } from 'lucide-react';
import SelectionCard from '../ui/SelectionCard';
import type { BudgetType, TripType, TripPreferences } from '../../types';

interface StepPreferencesProps {
  preferences: TripPreferences;
  onChange: (updates: Partial<TripPreferences>) => void;
  onNext: () => void;
  onBack: () => void;
}

const BUDGET_OPTIONS: { value: BudgetType; icon: React.ReactNode; title: string; description: string }[] = [
  {
    value: 'backpacker',
    icon: <Backpack className="w-6 h-6" />,
    title: 'Backpacker',
    description: '₹1,500–₹3,000/day • Hostels, street food, public transport',
  },
  {
    value: 'balanced',
    icon: <Scale className="w-6 h-6" />,
    title: 'Balanced',
    description: '₹4,000–₹8,000/day • Homestays, mixed dining, comfort',
  },
  {
    value: 'luxury',
    icon: <Crown className="w-6 h-6" />,
    title: 'Luxury',
    description: '₹12,000–₹25,000/day • Premium resorts, fine dining, exclusivity',
  },
];

const TRIP_TYPE_OPTIONS: { value: TripType; icon: React.ReactNode; title: string; description: string }[] = [
  {
    value: 'solo',
    icon: <User className="w-6 h-6" />,
    title: 'Solo',
    description: 'Flexible & introspective',
  },
  {
    value: 'couple',
    icon: <Heart className="w-6 h-6" />,
    title: 'Couple',
    description: 'Romantic & scenic',
  },
  {
    value: 'friends',
    icon: <Users className="w-6 h-6" />,
    title: 'Friends',
    description: 'Adventure & fun',
  },
  {
    value: 'family',
    icon: <Baby className="w-6 h-6" />,
    title: 'Family',
    description: 'Safe & comfortable',
  },
];

export default function StepPreferences({ preferences, onChange, onNext, onBack }: StepPreferencesProps) {
  const canProceed = preferences.budget && preferences.tripType;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto space-y-10"
    >
      {/* Section Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-heading text-gradient-gold">
          Your Style
        </h2>
        <p className="text-white/50 text-sm md:text-base">
          Tell us how you like to travel
        </p>
      </div>

      {/* Budget Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Budget Tier</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map((option) => (
            <SelectionCard
              key={option.value}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={preferences.budget === option.value}
              onClick={() => onChange({ budget: option.value })}
            />
          ))}
        </div>
      </div>

      {/* Trip Type Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Who's Traveling?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRIP_TYPE_OPTIONS.map((option) => (
            <SelectionCard
              key={option.value}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={preferences.tripType === option.value}
              onClick={() => onChange({ tripType: option.value })}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white/80 font-medium transition-all cursor-pointer"
        >
          ← Back
        </motion.button>
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          whileHover={canProceed ? { scale: 1.02 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
          className={`flex-1 py-4 rounded-2xl font-medium text-base transition-all duration-300 ${
            canProceed
              ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-dark-950 shadow-glow-gold hover:shadow-glow-gold-lg cursor-pointer'
              : 'bg-white/[0.06] text-white/25 cursor-not-allowed'
          }`}
        >
          Continue to Vibes →
        </motion.button>
      </div>
    </motion.div>
  );
}
