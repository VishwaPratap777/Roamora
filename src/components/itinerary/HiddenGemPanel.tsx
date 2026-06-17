import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, ChevronDown, MapPin, Clock, Gem } from 'lucide-react';
import type { Itinerary, ItineraryActivity } from '../../types';
import { cn } from '../../lib/utils';

interface HiddenGemPanelProps {
  itinerary: Itinerary;
}

interface GemWithDay {
  activity: ItineraryActivity;
  dayNumber: number;
  dayTitle: string;
}

export default function HiddenGemPanel({ itinerary }: HiddenGemPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGem, setActiveGem] = useState<string | null>(null);

  // Collect all hidden gems across all days
  const gems: GemWithDay[] = itinerary.days.flatMap((day) =>
    day.activities
      .filter((a) => a.isHiddenGem)
      .map((activity) => ({ activity, dayNumber: day.dayNumber, dayTitle: day.title }))
  );

  if (gems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <Gem className="w-8 h-8 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/30">No hidden gems in this itinerary.</p>
          <p className="text-xs text-white/20 mt-1">
            Regenerate with the <span className="text-primary-400/60">Hidden Gems</span> vibe for secret spots.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">
      {/* Header — collapsible trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 mb-1 group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-5 h-5 text-primary-400" />
          </motion.div>
          <h2 className="text-lg font-heading text-gradient-gold">
            Hidden Gems
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-400/15 text-primary-300 border border-primary-400/20 font-accent">
            {gems.length} found
          </span>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-primary-400/20 to-transparent" />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/30 group-hover:text-white/60 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <p className="text-xs text-white/30 mb-5 pl-1">
        Secret spots, underrated experiences & off-the-beaten-path discoveries
      </p>

      {/* Gem grid */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
              {gems.map(({ activity, dayNumber, dayTitle }, i) => {
                const isExpanded = activeGem === activity.id;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className={cn(
                      'rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden',
                      isExpanded
                        ? 'border-primary-400/40 bg-primary-400/[0.06]'
                        : 'border-primary-400/20 bg-white/[0.03] hover:border-primary-400/35 hover:bg-primary-400/[0.04]'
                    )}
                    onClick={() => setActiveGem(isExpanded ? null : activity.id)}
                  >
                    {/* Card top */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-400/15 text-primary-300 border border-primary-400/20 font-accent">
                          Day {dayNumber}
                        </span>
                        <span className="text-[10px] text-white/25 truncate flex-1">{dayTitle}</span>
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                        </motion.div>
                      </div>

                      <h3 className="text-sm font-medium text-white/90 mb-1.5 leading-snug">
                        {activity.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-white/35 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                        <span className="text-white/20">·</span>
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{activity.location}</span>
                      </div>

                      <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                        {activity.description}
                      </p>

                      {/* Expand indicator */}
                      <div className="flex items-center gap-1 mt-3 text-[10px] text-primary-400/50">
                        <ChevronDown
                          className={cn(
                            'w-3 h-3 transition-transform duration-300',
                            isExpanded ? 'rotate-180' : ''
                          )}
                        />
                        {isExpanded ? 'Hide details' : 'See insider tips'}
                      </div>
                    </div>

                    {/* Expandable insider info */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-primary-400/10 space-y-3">
                            {activity.photographyTip && (
                              <div className="flex items-start gap-2">
                                <Camera className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] text-violet-400/70 uppercase tracking-wider block mb-0.5">
                                    Photography Tip
                                  </span>
                                  <p className="text-xs text-white/60">{activity.photographyTip}</p>
                                </div>
                              </div>
                            )}

                            {activity.goldenHourInfo && (
                              <div className="flex items-start gap-2">
                                <span className="text-sm flex-shrink-0">🌅</span>
                                <div>
                                  <span className="text-[10px] text-amber-400/70 uppercase tracking-wider block mb-0.5">
                                    Golden Hour
                                  </span>
                                  <p className="text-xs text-white/60">{activity.goldenHourInfo}</p>
                                </div>
                              </div>
                            )}

                            {activity.estimatedCost !== undefined && (
                              <div className="flex items-center justify-between pt-1 border-t border-primary-400/10">
                                <span className="text-[10px] text-white/30">Estimated Cost Range</span>
                                <span className="text-xs font-accent text-primary-300">
                                  ₹{Math.round(activity.estimatedCost * 0.9).toLocaleString('en-IN')} - ₹{Math.round(activity.estimatedCost * 1.1).toLocaleString('en-IN')}
                                </span>
                              </div>
                            )}

                            {activity.droneAllowed !== undefined && (
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span>🚁</span>
                                <span className={activity.droneAllowed ? 'text-emerald-400/70' : 'text-red-400/70'}>
                                  {activity.droneAllowed ? 'Drone photography allowed here' : 'Drone-restricted zone'}
                                </span>
                              </div>
                            )}

                            {!activity.photographyTip && !activity.goldenHourInfo && (
                              <p className="text-xs text-white/30 italic">
                                A truly local secret — explore with an open mind.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed teaser */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 overflow-x-auto pb-2"
        >
          {gems.slice(0, 4).map(({ activity }) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-primary-400/15 bg-primary-400/[0.04] hover:border-primary-400/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-primary-400/70" />
              <span className="text-xs text-white/60 whitespace-nowrap max-w-[140px] truncate">
                {activity.title}
              </span>
            </button>
          ))}
          {gems.length > 4 && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer"
            >
              +{gems.length - 4} more
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
