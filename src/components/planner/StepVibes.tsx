import { motion } from 'framer-motion';
import {
  Mountain, Camera, UtensilsCrossed, Flame,
  TreePine, Gem, Car, Battery, BatteryMedium, BatteryFull,
} from 'lucide-react';
import Chip from '../ui/Chip';
import SelectionCard from '../ui/SelectionCard';
import type { TravelVibe, EnergyLevel, TripPreferences } from '../../types';

interface StepVibesProps {
  preferences: TripPreferences;
  onChange: (updates: Partial<TripPreferences>) => void;
  onNext: () => void;
  onBack: () => void;
}

const VIBE_OPTIONS: { value: TravelVibe; label: string; icon: React.ReactNode }[] = [
  { value: 'adventure', label: 'Adventure', icon: <Mountain className="w-4 h-4" /> },
  { value: 'photography', label: 'Photography', icon: <Camera className="w-4 h-4" /> },
  { value: 'food', label: 'Food & Cuisine', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { value: 'spiritual', label: 'Spiritual', icon: <Flame className="w-4 h-4" /> },
  { value: 'nature', label: 'Nature', icon: <TreePine className="w-4 h-4" /> },
  { value: 'hidden-gems', label: 'Hidden Gems', icon: <Gem className="w-4 h-4" /> },
  { value: 'roadtrip', label: 'Road Trip', icon: <Car className="w-4 h-4" /> },
];

const ENERGY_OPTIONS: { value: EnergyLevel; icon: React.ReactNode; title: string; description: string }[] = [
  {
    value: 'relaxed',
    icon: <Battery className="w-6 h-6" />,
    title: 'Relaxed',
    description: '3-4 activities/day • Slow mornings, lots of downtime',
  },
  {
    value: 'moderate',
    icon: <BatteryMedium className="w-6 h-6" />,
    title: 'Moderate',
    description: '5-6 activities/day • Balanced exploration & rest',
  },
  {
    value: 'packed',
    icon: <BatteryFull className="w-6 h-6" />,
    title: 'Packed',
    description: '6-8 activities/day • See everything, early starts',
  },
];

export default function StepVibes({ preferences, onChange, onNext, onBack }: StepVibesProps) {
  const toggleVibe = (vibe: TravelVibe) => {
    const current = preferences.vibes || [];
    const updated = current.includes(vibe)
      ? current.filter((v) => v !== vibe)
      : [...current, vibe];
    onChange({ vibes: updated });
  };

  const canProceed = preferences.vibes.length > 0 && preferences.energy;

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
          Your Vibe
        </h2>
        <p className="text-white/50 text-sm md:text-base">
          What kind of experiences are you looking for?
        </p>
      </div>

      {/* Travel Vibes Multi-Select */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
          Travel Vibes
          <span className="text-white/25 normal-case ml-2">(select all that apply)</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {VIBE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              icon={option.icon}
              selected={preferences.vibes.includes(option.value)}
              onClick={() => toggleVibe(option.value)}
              size="md"
            />
          ))}
        </div>
        {preferences.vibes.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-primary-400/60"
          >
            {preferences.vibes.length} vibe{preferences.vibes.length !== 1 ? 's' : ''} selected
          </motion.p>
        )}
      </div>

      {/* Energy Level */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Energy Level</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ENERGY_OPTIONS.map((option) => (
            <SelectionCard
              key={option.value}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={preferences.energy === option.value}
              onClick={() => onChange({ energy: option.value })}
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
          Review & Generate →
        </motion.button>
      </div>
    </motion.div>
  );
}
