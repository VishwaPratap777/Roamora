/* =====================================================
   Itinerary Store — In-memory + localStorage persistence
   ===================================================== */

import { useCallback, useSyncExternalStore } from 'react';
import type { Itinerary } from '../types';

const STORAGE_KEY = 'roamora_itineraries';

/**
 * Module-level store — survives React re-renders.
 * localStorage provides persistence across page refreshes.
 */
let store: Map<string, Itinerary> = new Map();
let listeners: Set<() => void> = new Set();

// Hydrate from localStorage on module load
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed: Record<string, Itinerary> = JSON.parse(raw);
    Object.entries(parsed).forEach(([k, v]) => store.set(k, v));
  }
} catch {
  // Ignore parse errors
}

function persistToStorage() {
  try {
    const obj: Record<string, Itinerary> = {};
    store.forEach((v, k) => (obj[k] = v));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore quota errors
  }
}

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return store;
}

/**
 * Save a generated itinerary to the store
 */
export function saveItinerary(itinerary: Itinerary) {
  store = new Map(store);
  store.set(itinerary.id, itinerary);
  persistToStorage();
  emitChange();
}

/**
 * Get a single itinerary by ID (non-reactive)
 */
export function getItinerary(id: string): Itinerary | undefined {
  return store.get(id);
}

/**
 * React hook — reactively get an itinerary by ID
 */
export function useItinerary(id: string): Itinerary | undefined {
  const currentStore = useSyncExternalStore(subscribe, getSnapshot);
  return currentStore.get(id);
}

/**
 * React hook — get all itineraries
 */
export function useAllItineraries(): Itinerary[] {
  const currentStore = useSyncExternalStore(subscribe, getSnapshot);
  return Array.from(currentStore.values());
}

/**
 * React hook — save callback
 */
export function useSaveItinerary() {
  return useCallback((itinerary: Itinerary) => {
    saveItinerary(itinerary);
  }, []);
}
