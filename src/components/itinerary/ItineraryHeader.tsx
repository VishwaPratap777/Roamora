import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Wallet, Compass, Zap, Sparkles,
} from 'lucide-react';
import type { Itinerary } from '../../types';

interface ItineraryHeaderProps {
  itinerary: Itinerary;
}

const LABELS: Record<string, string> = {
  backpacker: '🎒 Backpacker',
  balanced: '⚖️ Balanced',
  luxury: '👑 Luxury',
  solo: 'Solo',
  couple: 'Couple',
  friends: 'Friends',
  family: 'Family',
  relaxed: 'Relaxed',
  moderate: 'Moderate',
  packed: 'Packed',
  adventure: 'Adventure',
  photography: 'Photography',
  food: 'Food & Cuisine',
  spiritual: 'Spiritual',
  nature: 'Nature',
  'hidden-gems': 'Hidden Gems',
  roadtrip: 'Road Trip',
};

export default function ItineraryHeader({ itinerary }: ItineraryHeaderProps) {
  const { destination, preferences, totalBudget, days } = itinerary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, rgba(200,164,78,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center space-y-6 pt-8 pb-10 px-6">
        {/* Destination Name */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <MapPin className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-accent">
              Your Itinerary
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading text-gradient-gold"
          >
            {destination}
          </motion.h1>
        </div>

        {/* Summary Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {/* Duration */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm text-white/70">
            <Calendar className="w-3.5 h-3.5 text-primary-400" />
            <span>{days.length} {days.length === 1 ? 'day' : 'days'}</span>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm text-white/70">
            <Wallet className="w-3.5 h-3.5 text-primary-400" />
            <span>{LABELS[preferences.budget] || preferences.budget}</span>
          </div>

          {/* Trip Type */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm text-white/70">
            <Compass className="w-3.5 h-3.5 text-primary-400" />
            <span>{LABELS[preferences.tripType] || preferences.tripType}</span>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm text-white/70">
            <Zap className="w-3.5 h-3.5 text-primary-400" />
            <span>{LABELS[preferences.energy] || preferences.energy}</span>
          </div>
        </motion.div>

        {/* Vibes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {preferences.vibes.map((vibe) => (
            <span
              key={vibe}
              className="text-xs px-3 py-1 rounded-full bg-primary-400/10 text-primary-300 border border-primary-400/20"
            >
              <Sparkles className="w-3 h-3 inline-block mr-1 -mt-0.5" />
              {LABELS[vibe] || vibe}
            </span>
          ))}
        </motion.div>

        {/* Total Budget */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-400/10 to-primary-500/5 border border-primary-400/15"
        >
          <span className="text-sm text-white/50">Estimated Total Range:</span>
          <span className="text-lg font-heading text-gradient-gold">
            ₹{Math.round(totalBudget * 0.9).toLocaleString('en-IN')} - ₹{Math.round(totalBudget * 1.1).toLocaleString('en-IN')}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
