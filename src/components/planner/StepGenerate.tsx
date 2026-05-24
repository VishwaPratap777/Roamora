import { motion } from 'framer-motion';
import {
  MapPin, Wallet, Compass, Zap, Calendar, Sparkles,
} from 'lucide-react';
import type { TripPreferences } from '../../types';

interface StepGenerateProps {
  preferences: TripPreferences;
  onGenerate: () => void;
  onBack: () => void;
  onJumpTo: (step: number) => void;
  isGenerating: boolean;
}

const LABELS: Record<string, string> = {
  backpacker: '🎒 Backpacker',
  balanced: '⚖️ Balanced',
  luxury: '👑 Luxury',
  solo: '🧑 Solo',
  couple: '❤️ Couple',
  friends: '👫 Friends',
  family: '👨‍👩‍👧 Family',
  relaxed: '😌 Relaxed',
  moderate: '⚡ Moderate',
  packed: '🔥 Packed',
  adventure: 'Adventure',
  photography: 'Photography',
  food: 'Food & Cuisine',
  spiritual: 'Spiritual',
  nature: 'Nature',
  'hidden-gems': 'Hidden Gems',
  roadtrip: 'Road Trip',
};

export default function StepGenerate({
  preferences,
  onGenerate,
  onBack,
  onJumpTo,
  isGenerating,
}: StepGenerateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      {/* Section Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-heading text-gradient-gold">
          Ready to Explore?
        </h2>
        <p className="text-white/50 text-sm md:text-base">
          Review your trip details before we craft the perfect itinerary
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
        {/* Destination Header */}
        <div className="px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-primary-400/5 to-transparent">
          <button
            type="button"
            onClick={() => onJumpTo(1)}
            className="group flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-400/15 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-400" />
            </div>
            <div className="text-left">
              <div className="text-xl font-heading text-white group-hover:text-primary-200 transition-colors">
                {preferences.destination}
              </div>
              <div className="text-xs text-white/40 flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {preferences.duration} {preferences.duration === 1 ? 'day' : 'days'}
                {preferences.startDate && ` • Starting ${new Date(preferences.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </div>
            </div>
            <span className="ml-auto text-xs text-white/20 group-hover:text-white/40 transition-colors">Edit ✏️</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
          {/* Budget */}
          <button
            type="button"
            onClick={() => onJumpTo(2)}
            className="group px-6 py-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
              <Wallet className="w-3 h-3" />
              Budget
              <span className="ml-auto text-white/15 group-hover:text-white/30 text-[10px]">Edit</span>
            </div>
            <div className="text-sm font-medium text-white/80">
              {LABELS[preferences.budget] || preferences.budget}
            </div>
          </button>

          {/* Trip Type */}
          <button
            type="button"
            onClick={() => onJumpTo(2)}
            className="group px-6 py-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
              <Compass className="w-3 h-3" />
              Trip Type
              <span className="ml-auto text-white/15 group-hover:text-white/30 text-[10px]">Edit</span>
            </div>
            <div className="text-sm font-medium text-white/80">
              {LABELS[preferences.tripType] || preferences.tripType}
            </div>
          </button>

          {/* Energy */}
          <button
            type="button"
            onClick={() => onJumpTo(3)}
            className="group px-6 py-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
              <Zap className="w-3 h-3" />
              Energy
              <span className="ml-auto text-white/15 group-hover:text-white/30 text-[10px]">Edit</span>
            </div>
            <div className="text-sm font-medium text-white/80">
              {LABELS[preferences.energy] || preferences.energy}
            </div>
          </button>
        </div>

        {/* Vibes */}
        <button
          type="button"
          onClick={() => onJumpTo(3)}
          className="group w-full px-6 py-4 border-t border-white/[0.06] text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
            <Sparkles className="w-3 h-3" />
            Travel Vibes
            <span className="ml-auto text-white/15 group-hover:text-white/30 text-[10px]">Edit</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.vibes.map((vibe) => (
              <span
                key={vibe}
                className="text-xs px-3 py-1 rounded-full bg-primary-400/10 text-primary-300 border border-primary-400/20"
              >
                {LABELS[vibe] || vibe}
              </span>
            ))}
          </div>
        </button>
      </div>

      {/* AI Info */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <Sparkles className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/40 leading-relaxed">
          Our AI will craft a personalized, route-optimized itinerary focused on hidden gems and authentic local experiences.
          This usually takes 8–15 seconds.
        </p>
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
          onClick={onGenerate}
          disabled={isGenerating}
          whileHover={!isGenerating ? { scale: 1.02 } : {}}
          whileTap={!isGenerating ? { scale: 0.98 } : {}}
          className={`flex-1 py-4 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
            isGenerating
              ? 'bg-white/[0.06] text-white/25 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 text-dark-950 shadow-glow-gold hover:shadow-glow-gold-lg cursor-pointer'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Generate My Itinerary
        </motion.button>
      </div>
    </motion.div>
  );
}
