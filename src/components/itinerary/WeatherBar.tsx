import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Droplets, Loader2, AlertCircle } from 'lucide-react';
import { useWeather, weatherEmoji } from '../../hooks/useWeather';
import type { ItineraryDay } from '../../types';

interface WeatherBarProps {
  destination: string;
  days: ItineraryDay[];
  activeDay: number;
  startDate?: string;
}

export default function WeatherBar({ destination, days, activeDay, startDate }: WeatherBarProps) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;
  const { forecast, loading, error } = useWeather(destination, startDate);

  // Don't render anything if no API key configured
  if (!apiKey) return null;

  // Map forecast items to itinerary days (best-effort by index)
  const weatherByDay = new Map(
    forecast.map((w, i) => [i + 1, w])
  );

  const activeWeather = weatherByDay.get(activeDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-white/30 text-xs">
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading weather forecast…
      </div>
    );
  }

  if (error || forecast.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-white/20 text-xs">
        <AlertCircle className="w-3 h-3" />
        Weather unavailable for {destination}
      </div>
    );
  }

  return (
    <div className="border-b border-white/[0.06] bg-white/[0.02]">
      {/* Day strip */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {days.map((day) => {
            const w = weatherByDay.get(day.dayNumber);
            const isActive = day.dayNumber === activeDay;
            return (
              <motion.div
                key={day.dayNumber}
                className={`
                  flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-300 min-w-[72px]
                  ${isActive ? 'bg-white/[0.07] border border-white/[0.1]' : 'hover:bg-white/[0.04]'}
                `}
                animate={{ opacity: isActive ? 1 : 0.6 }}
              >
                <span className="text-[10px] text-white/40 font-accent">Day {day.dayNumber}</span>
                {w ? (
                  <>
                    <span className="text-xl leading-none">{weatherEmoji(w.icon)}</span>
                    <div className="flex items-center gap-1 text-[10px] font-accent">
                      <span className="text-white/70">{w.tempMax}°</span>
                      <span className="text-white/25">/</span>
                      <span className="text-white/35">{w.tempMin}°</span>
                    </div>
                    <span className="text-[9px] text-white/35 capitalize leading-tight text-center">
                      {w.description}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-white/25">—</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active day detail strip */}
      <AnimatePresence mode="wait">
        {activeWeather && (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pb-3 flex items-center gap-4 flex-wrap"
          >
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Droplets className="w-3 h-3 text-blue-400/60" />
              <span>{activeWeather.humidity}% humidity</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Wind className="w-3 h-3 text-cyan-400/60" />
              <span>{activeWeather.windKmh} km/h wind</span>
            </div>
            {activeWeather.pop > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <span>🌂</span>
                <span>{activeWeather.pop}% chance of rain</span>
              </div>
            )}
            <div className="ml-auto text-[10px] text-white/20 font-accent">
              OpenWeatherMap
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
