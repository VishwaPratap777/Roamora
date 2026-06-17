import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, Zap, TrendingDown } from 'lucide-react';
import type { Itinerary } from '../../types';
import { useActivityOverrides } from '../../hooks/useActivityOverrides';
import { cn } from '../../lib/utils';

interface BudgetOptimizerProps {
  itinerary: Itinerary;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-400',
  transport: 'bg-blue-400',
  sightseeing: 'bg-cyan-400',
  trek: 'bg-emerald-400',
  photography: 'bg-violet-400',
  camping: 'bg-amber-400',
  cultural: 'bg-pink-400',
  rest: 'bg-teal-400',
};

export default function BudgetOptimizer({ itinerary }: BudgetOptimizerProps) {
  const [people, setPeople] = useState(1);
  const { skipped } = useActivityOverrides(itinerary.id);

  // All activities flat
  const allActivities = useMemo(
    () => itinerary.days.flatMap((d) => d.activities),
    [itinerary]
  );

  // Budget calculation: exclude skipped
  const activeActivities = allActivities.filter((a) => !skipped.has(a.id));
  const skippedActivities = allActivities.filter((a) => skipped.has(a.id));

  const activeCost = activeActivities.reduce((s, a) => s + (a.estimatedCost || 0), 0);
  const skippedCost = skippedActivities.reduce((s, a) => s + (a.estimatedCost || 0), 0);
  const originalTotal = itinerary.totalBudget;

  // Category breakdown on active activities
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of activeActivities) {
      if (!a.estimatedCost) continue;
      map[a.category] = (map[a.category] || 0) + a.estimatedCost;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [activeActivities]);

  const savingsPercent = originalTotal > 0
    ? Math.round((skippedCost / originalTotal) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-400/15 flex items-center justify-center">
          <Zap className="w-4 h-4 text-violet-400" />
        </div>
        <h3 className="text-sm font-medium text-white/70">Budget Optimizer</h3>
      </div>

      {/* Active vs original */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>Active budget range</span>
          <span className="text-white/60 font-accent">
            ₹{Math.round(activeCost * 0.9).toLocaleString('en-IN')} - ₹{Math.round(activeCost * 1.1).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: originalTotal > 0 ? `${(activeCost / originalTotal) * 100}%` : '100%' }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-300"
          />
        </div>
        {skippedCost > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-xs text-emerald-400/80 mt-1"
          >
            <TrendingDown className="w-3 h-3" />
            Saving ₹{skippedCost.toLocaleString('en-IN')} ({savingsPercent}%) by skipping {skippedActivities.length} activities
          </motion.div>
        )}
      </div>

      {/* Per-person calculator */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs text-white/40">Per Person</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            disabled={people <= 1}
            className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/60 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-heading text-gradient-gold">{people}</div>
            <div className="text-[10px] text-white/30">{people === 1 ? 'person' : 'people'}</div>
          </div>
          <button
            type="button"
            onClick={() => setPeople((p) => Math.min(20, p + 1))}
            disabled={people >= 20}
            className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/60 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            +
          </button>
        </div>
        <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-primary-400/[0.06] border border-primary-400/15">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-xs text-white/50">Per person estimate</span>
          </div>
          <span className="text-sm font-heading text-gradient-gold">
            ₹{Math.round((activeCost / people) * 0.9).toLocaleString('en-IN')} - ₹{Math.round((activeCost / people) * 1.1).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryTotals.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-[10px] text-white/30 uppercase tracking-wider">Spending by Category</div>
          {categoryTotals.slice(0, 5).map(([cat, amount]) => {
            const pct = activeCost > 0 ? (amount / activeCost) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="capitalize text-white/40">{cat}</span>
                  <span className="text-white/50 font-accent">
                    ₹{Math.round(amount * 0.9).toLocaleString('en-IN')} - ₹{Math.round(amount * 1.1).toLocaleString('en-IN')} · {Math.round(pct)}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={cn('h-full rounded-full', CATEGORY_COLORS[cat] || 'bg-white/30')}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Daily average */}
      <div className="pt-3 border-t border-white/[0.06]">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/30">Daily avg range (active)</span>
          <span className="text-white/50 font-accent">
            ₹{Math.round((activeCost / itinerary.days.length) * 0.9).toLocaleString('en-IN')} - ₹{Math.round((activeCost / itinerary.days.length) * 1.1).toLocaleString('en-IN')}/day
          </span>
        </div>
      </div>
    </motion.div>
  );
}
