/* =====================================================
   useActivityOverrides — per-itinerary skip/delete state
   Persisted to localStorage so it survives page refreshes.
   ===================================================== */

import { useState, useCallback, useEffect } from 'react';

interface Overrides {
  skipped: Set<string>;   // activity IDs toggled off (dimmed, excluded from budget)
  deleted: Set<string>;   // activity IDs permanently removed from view
}

type PersistedOverrides = {
  skipped: string[];
  deleted: string[];
};

const STORAGE_KEY = 'roamora_activity_overrides';

function loadOverrides(itineraryId: string): Overrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { skipped: new Set(), deleted: new Set() };
    const all: Record<string, PersistedOverrides> = JSON.parse(raw);
    const entry = all[itineraryId];
    if (!entry) return { skipped: new Set(), deleted: new Set() };
    return {
      skipped: new Set(entry.skipped),
      deleted: new Set(entry.deleted),
    };
  } catch {
    return { skipped: new Set(), deleted: new Set() };
  }
}

function persistOverrides(itineraryId: string, overrides: Overrides) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, PersistedOverrides> = raw ? JSON.parse(raw) : {};
    all[itineraryId] = {
      skipped: Array.from(overrides.skipped),
      deleted: Array.from(overrides.deleted),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Ignore quota errors
  }
}

export function useActivityOverrides(itineraryId: string) {
  const [overrides, setOverrides] = useState<Overrides>(() =>
    loadOverrides(itineraryId)
  );

  // Reload when itinerary changes
  useEffect(() => {
    setOverrides(loadOverrides(itineraryId));
  }, [itineraryId]);

  const save = useCallback((next: Overrides) => {
    persistOverrides(itineraryId, next);
    setOverrides({ skipped: new Set(next.skipped), deleted: new Set(next.deleted) });
  }, [itineraryId]);

  const toggleSkip = useCallback((activityId: string) => {
    setOverrides((prev) => {
      const skipped = new Set(prev.skipped);
      if (skipped.has(activityId)) {
        skipped.delete(activityId);
      } else {
        skipped.add(activityId);
      }
      const next = { ...prev, skipped };
      persistOverrides(itineraryId, next);
      return { skipped: new Set(skipped), deleted: new Set(prev.deleted) };
    });
  }, [itineraryId]);

  const deleteActivity = useCallback((activityId: string) => {
    setOverrides((prev) => {
      const deleted = new Set(prev.deleted);
      deleted.add(activityId);
      // Also remove from skipped if present
      const skipped = new Set(prev.skipped);
      skipped.delete(activityId);
      const next = { skipped, deleted };
      persistOverrides(itineraryId, next);
      return { skipped: new Set(skipped), deleted: new Set(deleted) };
    });
  }, [itineraryId]);

  const resetOverrides = useCallback(() => {
    save({ skipped: new Set(), deleted: new Set() });
  }, [save]);

  return {
    skipped: overrides.skipped,
    deleted: overrides.deleted,
    toggleSkip,
    deleteActivity,
    resetOverrides,
    isSkipped: (id: string) => overrides.skipped.has(id),
    isDeleted: (id: string) => overrides.deleted.has(id),
  };
}
