import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, UtensilsCrossed, Mountain, Camera, Tent,
  Landmark, Car, Coffee, MapPin, Sparkles,
  ChevronDown, Gauge, Trash2, CheckCircle2, Circle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ItineraryActivity } from '../../types';

interface ActivityCardProps {
  activity: ItineraryActivity;
  index: number;
  isLast: boolean;
  isSkipped?: boolean;
  onSkip?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  sightseeing: { icon: <Eye className="w-3.5 h-3.5" />, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  food: { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  trek: { icon: <Mountain className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  photography: { icon: <Camera className="w-3.5 h-3.5" />, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
  camping: { icon: <Tent className="w-3.5 h-3.5" />, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  cultural: { icon: <Landmark className="w-3.5 h-3.5" />, color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20' },
  transport: { icon: <Car className="w-3.5 h-3.5" />, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  rest: { icon: <Coffee className="w-3.5 h-3.5" />, color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-400/20' },
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  moderate: { label: 'Moderate', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  hard: { label: 'Hard', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function ActivityCard({
  activity, index, isLast, isSkipped = false, onSkip, onDelete,
}: ActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const category = CATEGORY_CONFIG[activity.category] || CATEGORY_CONFIG.sightseeing;
  const difficulty = activity.difficulty ? DIFFICULTY_CONFIG[activity.difficulty] : null;

  const hasDetails =
    activity.photographyTip || activity.goldenHourInfo || activity.droneAllowed !== undefined || difficulty;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete?.(activity.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSkip?.(activity.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isSkipped ? 0.4 : 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex gap-4 md:gap-6 group/row"
    >
      {/* Timeline Column */}
      <div className="flex flex-col items-center flex-shrink-0 w-16 md:w-20">
        {/* Time Badge */}
        <div className={cn(
          'text-xs font-accent font-medium whitespace-nowrap mb-2 mt-1 transition-colors',
          isSkipped ? 'text-white/25 line-through' : 'text-primary-300'
        )}>
          {activity.time}
        </div>
        {/* Timeline dot */}
        <div className={cn(
          'w-3 h-3 rounded-full border-2 flex-shrink-0',
          isSkipped
            ? 'border-white/15 bg-white/5'
            : activity.isHiddenGem
              ? 'border-primary-400 bg-primary-400/30 shadow-[0_0_8px_rgba(200,164,78,0.4)]'
              : 'border-white/30 bg-white/10'
        )} />
        {/* Timeline line */}
        {!isLast && (
          <div className="w-[1px] flex-1 bg-white/[0.08] min-h-[20px]" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-6">
        <div
          className={cn(
            'rounded-2xl border bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300',
            isSkipped
              ? 'border-white/[0.04] opacity-60'
              : activity.isHiddenGem
                ? 'border-primary-400/20 hover:border-primary-400/30'
                : 'border-white/[0.08] hover:border-white/[0.14]',
            hasDetails && !isSkipped && 'cursor-pointer'
          )}
          onClick={() => !isSkipped && hasDetails && setIsExpanded(!isExpanded)}
        >
          {/* Main Content */}
          <div className="px-5 py-4">
            {/* Top row: badges + controls */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={cn('flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border', category.bg, category.color)}>
                {category.icon}
                <span className="capitalize">{activity.category}</span>
              </span>

              {activity.isHiddenGem && !isSkipped && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary-400/15 text-primary-300 border border-primary-400/20">
                  <Sparkles className="w-3 h-3" />
                  Hidden Gem
                </span>
              )}

              {activity.estimatedCost !== undefined && activity.estimatedCost > 0 && (
                <span className={cn(
                  'text-[10px] ml-auto font-accent transition-colors',
                  isSkipped ? 'text-white/20 line-through' : 'text-white/30'
                )}>
                  ₹{activity.estimatedCost.toLocaleString('en-IN')}
                </span>
              )}

              {/* Skip toggle + Delete — visible on hover */}
              {(onSkip || onDelete) && (
                <div className="flex items-center gap-1.5 ml-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                  {onSkip && (
                    <button
                      type="button"
                      onClick={handleSkip}
                      title={isSkipped ? 'Include activity' : 'Skip activity'}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
                    >
                      {isSkipped
                        ? <Circle className="w-3.5 h-3.5 text-white/30" />
                        : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70" />
                      }
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      title={showDeleteConfirm ? 'Click again to confirm delete' : 'Remove activity'}
                      className={cn(
                        'w-6 h-6 flex items-center justify-center rounded-full transition-all',
                        showDeleteConfirm
                          ? 'bg-red-500/20 hover:bg-red-500/30'
                          : 'hover:bg-white/10'
                      )}
                    >
                      <Trash2 className={cn(
                        'w-3.5 h-3.5 transition-colors',
                        showDeleteConfirm ? 'text-red-400' : 'text-white/25 hover:text-red-400'
                      )} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h4 className={cn(
              'text-base font-medium mb-1.5 transition-colors',
              isSkipped ? 'text-white/30 line-through' : 'text-white/90'
            )}>
              {activity.title}
            </h4>

            {/* Description */}
            {!isSkipped && (
              <p className="text-sm text-white/50 leading-relaxed mb-2">
                {activity.description}
              </p>
            )}

            {/* Location */}
            <div className={cn(
              'flex items-center gap-1.5 text-xs',
              isSkipped ? 'text-white/20' : 'text-white/35'
            )}>
              <MapPin className="w-3 h-3" />
              <span>{activity.location}</span>
            </div>

            {/* Skipped label */}
            {isSkipped && (
              <div className="mt-2 text-[10px] text-white/25 italic">
                Skipped — click toggle to re-include
              </div>
            )}

            {/* Expand indicator */}
            {hasDetails && !isSkipped && (
              <div className="flex items-center justify-center mt-3">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-white/20" />
                </motion.div>
              </div>
            )}
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {isExpanded && hasDetails && !isSkipped && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02] space-y-3">
                  {activity.photographyTip && (
                    <div className="flex items-start gap-2">
                      <Camera className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-violet-400/70 uppercase tracking-wider block mb-0.5">Photography Tip</span>
                        <p className="text-xs text-white/60">{activity.photographyTip}</p>
                      </div>
                    </div>
                  )}

                  {activity.goldenHourInfo && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm flex-shrink-0">🌅</span>
                      <div>
                        <span className="text-[10px] text-amber-400/70 uppercase tracking-wider block mb-0.5">Golden Hour</span>
                        <p className="text-xs text-white/60">{activity.goldenHourInfo}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    {difficulty && (
                      <span className={cn('text-[10px] px-2.5 py-1 rounded-full border flex items-center gap-1', difficulty.color)}>
                        <Gauge className="w-3 h-3" />
                        {difficulty.label}
                      </span>
                    )}

                    {activity.droneAllowed !== undefined && (
                      <span className={cn(
                        'text-[10px] px-2.5 py-1 rounded-full border flex items-center gap-1',
                        activity.droneAllowed
                          ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                          : 'text-red-400 bg-red-400/10 border-red-400/20'
                      )}>
                        🚁 {activity.droneAllowed ? 'Drone OK' : 'No Drones'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delete confirm hint */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1.5 text-[10px] text-red-400/70 px-1"
            >
              Click 🗑️ again to confirm removal
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
