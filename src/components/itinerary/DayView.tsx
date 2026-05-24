import { motion } from 'framer-motion';
import ActivityCard from './ActivityCard';
import type { ItineraryDay } from '../../types';

interface DayViewProps {
  day: ItineraryDay;
}

export default function DayView({ day }: DayViewProps) {
  return (
    <motion.div
      key={day.dayNumber}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-6 md:px-12 py-8"
    >
      {/* Day Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-3"
        >
          <span className="text-xs font-accent text-primary-400 uppercase tracking-[0.2em]">
            Day {day.dayNumber}
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.06]" />
          {day.totalCost !== undefined && (
            <span className="text-xs text-white/30 font-accent">
              ₹{day.totalCost.toLocaleString('en-IN')}
            </span>
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl md:text-3xl font-heading text-gradient-gold mb-2"
        >
          {day.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm text-white/45 leading-relaxed"
        >
          {day.description}
        </motion.p>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-0">
        {day.activities.map((activity, i) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            index={i}
            isLast={i === day.activities.length - 1}
          />
        ))}
      </div>

      {/* Day Cost Footer */}
      {day.totalCost !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 flex items-center justify-between px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <span className="text-xs text-white/40 font-accent">Day {day.dayNumber} Total</span>
          <span className="text-sm font-heading text-gradient-gold">
            ₹{day.totalCost.toLocaleString('en-IN')}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
