import { motion } from 'framer-motion';
import {
  Wallet, ShoppingBag, Lightbulb, Check,
} from 'lucide-react';
import type { Itinerary } from '../../types';

interface TripSummaryProps {
  itinerary: Itinerary;
}

export default function TripSummary({ itinerary }: TripSummaryProps) {
  const { days, totalBudget, packingSuggestions, travelTips } = itinerary;

  // Calculate max daily cost for bar chart scaling
  const dailyCosts = days.map((d) => d.totalCost || 0);
  const maxCost = Math.max(...dailyCosts, 1);

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-heading text-gradient-gold mb-2">
          Trip Summary
        </h2>
        <p className="text-sm text-white/40">Everything you need to know at a glance</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary-400/15 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-400" />
            </div>
            <h3 className="text-sm font-medium text-white/70">Budget Breakdown</h3>
          </div>

          {/* Total */}
          <div className="mb-5 pb-4 border-b border-white/[0.06]">
            <div className="text-xs text-white/30 mb-1">Total Estimated</div>
            <div className="text-2xl font-heading text-gradient-gold">
              ₹{totalBudget.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Per-day bars */}
          <div className="space-y-3">
            {days.map((day) => {
              const cost = day.totalCost || 0;
              const pct = (cost / maxCost) * 100;
              return (
                <div key={day.dayNumber}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/40">Day {day.dayNumber}</span>
                    <span className="text-white/50 font-accent">₹{cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + day.dayNumber * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Packing List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/15 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-medium text-white/70">Packing List</h3>
          </div>

          <ul className="space-y-2.5">
            {packingSuggestions.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-2.5 text-sm text-white/60"
              >
                <div className="w-4 h-4 mt-0.5 rounded border border-white/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white/25" />
                </div>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Travel Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-medium text-white/70">Travel Tips</h3>
          </div>

          <ol className="space-y-3">
            {travelTips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 text-sm text-white/60"
              >
                <span className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-white/40 font-accent font-medium flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
