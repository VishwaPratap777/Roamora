import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { ItineraryDay } from '../../types';

interface DaySelectorProps {
  days: ItineraryDay[];
  activeDay: number;
  onSelect: (dayNumber: number) => void;
}

export default function DaySelector({ days, activeDay, onSelect }: DaySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      // Check if tab is outside visible area
      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeDay]);

  return (
    <div className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide px-6 md:px-12 py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const isActive = day.dayNumber === activeDay;
          return (
            <button
              key={day.dayNumber}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(day.dayNumber)}
              className={cn(
                'relative flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap',
                isActive
                  ? 'text-primary-200'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className={cn(
                  'text-xs font-accent',
                  isActive ? 'text-primary-400' : 'text-white/30'
                )}>
                  Day {day.dayNumber}
                </span>
                <span className="hidden sm:inline text-xs opacity-60">
                  — {day.title.length > 25 ? day.title.slice(0, 25) + '…' : day.title}
                </span>
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="day-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] border border-primary-400/20"
                  style={{
                    boxShadow: '0 0 20px rgba(200, 164, 78, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
