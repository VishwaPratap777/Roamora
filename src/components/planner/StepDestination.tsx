import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Calendar, Minus, Plus } from 'lucide-react';
import type { TripPreferences } from '../../types';
import { FEATURED_DESTINATIONS } from '../../lib/constants';

interface StepDestinationProps {
  preferences: TripPreferences;
  onChange: (updates: Partial<TripPreferences>) => void;
  onNext: () => void;
}

export default function StepDestination({ preferences, onChange, onNext }: StepDestinationProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(preferences.destination);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter destinations by search query
  const suggestions = searchQuery.trim().length > 0
    ? FEATURED_DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FEATURED_DESTINATIONS;

  const handleDestinationSelect = (name: string) => {
    setSearchQuery(name);
    onChange({ destination: name });
    setIsFocused(false);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    onChange({ destination: value });
  };

  const handleDurationChange = (delta: number) => {
    const newDuration = Math.min(14, Math.max(1, preferences.duration + delta));
    onChange({ duration: newDuration });
  };

  const canProceed = preferences.destination.trim().length >= 2 && preferences.duration >= 1;

  useEffect(() => {
    // Auto-focus the input on mount
    inputRef.current?.focus();
  }, []);

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
          Where to?
        </h2>
        <p className="text-white/50 text-sm md:text-base">
          Search any destination or pick from our curated hidden gems
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 ${
            isFocused
              ? 'border-primary-400/50 bg-white/[0.07] shadow-[0_0_25px_rgba(200,164,78,0.1)]'
              : 'border-white/10 bg-white/[0.04]'
          }`}
        >
          <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-primary-400' : 'text-white/30'}`} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search destinations... (e.g. Spiti Valley, Bali, Patagonia)"
            className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base md:text-lg"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleInputChange('')}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {isFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-dark-900/95 backdrop-blur-xl overflow-hidden z-50 shadow-glass-xl"
            >
              {suggestions.slice(0, 5).map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleDestinationSelect(dest.name)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.06] transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white/90 group-hover:text-primary-200 transition-colors">
                      {dest.name}
                    </div>
                    <div className="text-xs text-white/40">{dest.location}</div>
                  </div>
                  {dest.isHiddenGem && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-400/15 text-primary-300 border border-primary-400/20">
                      Hidden Gem
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Duration Selector */}
      <div className="space-y-3">
        <label className="text-sm text-white/50 font-medium">Trip Duration</label>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleDurationChange(-1)}
            disabled={preferences.duration <= 1}
            className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <div className="text-5xl font-heading text-gradient-gold">{preferences.duration}</div>
            <div className="text-sm text-white/40 mt-1">
              {preferences.duration === 1 ? 'day' : 'days'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDurationChange(1)}
            disabled={preferences.duration >= 14}
            className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Start Date (Optional) */}
      <div className="space-y-3">
        <label className="text-sm text-white/50 font-medium flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Start Date
          <span className="text-white/25">(optional)</span>
        </label>
        <input
          type="date"
          value={preferences.startDate || ''}
          onChange={(e) => onChange({ startDate: e.target.value || undefined })}
          className="w-full px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 outline-none focus:border-primary-400/40 transition-colors [color-scheme:dark]"
        />
      </div>

      {/* Next Button */}
      <motion.button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        whileHover={canProceed ? { scale: 1.02 } : {}}
        whileTap={canProceed ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-2xl font-medium text-base transition-all duration-300 ${
          canProceed
            ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-dark-950 shadow-glow-gold hover:shadow-glow-gold-lg cursor-pointer'
            : 'bg-white/[0.06] text-white/25 cursor-not-allowed'
        }`}
      >
        Continue to Preferences →
      </motion.button>
    </motion.div>
  );
}
