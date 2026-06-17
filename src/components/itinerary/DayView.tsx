import { motion } from 'framer-motion';
import ActivityCard from './ActivityCard';
import type { ItineraryDay } from '../../types';
import { useActivityOverrides } from '../../hooks/useActivityOverrides';

interface DayViewProps {
  day: ItineraryDay;
  itineraryId: string;
}

export default function DayView({ day, itineraryId }: DayViewProps) {
  const { isSkipped, isDeleted, toggleSkip, deleteActivity } = useActivityOverrides(itineraryId);

  // Filter deleted activities; keep skipped ones (just dim them)
  const visibleActivities = day.activities.filter((a) => !isDeleted(a.id));

  const skippedCount = visibleActivities.filter((a) => isSkipped(a.id)).length;
  const activeActivities = visibleActivities.filter((a) => !isSkipped(a.id));
  const activeCost = activeActivities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

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
              ₹{Math.round(day.totalCost * 0.9).toLocaleString('en-IN')} - ₹{Math.round(day.totalCost * 1.1).toLocaleString('en-IN')}
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
        {visibleActivities.map((activity, i) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            index={i}
            isLast={i === visibleActivities.length - 1}
            isSkipped={isSkipped(activity.id)}
            onSkip={toggleSkip}
            onDelete={deleteActivity}
          />
        ))}
      </div>

      {/* Skipped / Active cost summary */}
      {(skippedCount > 0 || day.totalCost !== undefined) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 space-y-2"
        >
          {skippedCount > 0 && (
            <div className="flex items-center justify-between px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs text-white/30 font-accent">
                {skippedCount} {skippedCount === 1 ? 'activity' : 'activities'} skipped
              </span>
              <span className="text-xs text-white/25 font-accent">
                Active budget: ₹{activeCost.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {day.totalCost !== undefined && (
            <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs text-white/40 font-accent">Day {day.dayNumber} Total Range</span>
              <span className="text-sm font-heading text-gradient-gold">
                ₹{Math.round(day.totalCost * 0.9).toLocaleString('en-IN')} - ₹{Math.round(day.totalCost * 1.1).toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
