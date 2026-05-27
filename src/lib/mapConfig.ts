/* =====================================================
   Mapbox Configuration — Roamora Map Theme
   ===================================================== */

/**
 * Activity category → marker color mapping
 */
export const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: '#06b6d4',  // cyan
  food: '#f59e0b',         // amber
  trek: '#10b981',         // emerald
  photography: '#a855f7',  // purple
  camping: '#22c55e',      // green
  cultural: '#f43f5e',     // rose
  transport: '#6b7280',    // gray
  rest: '#8b5cf6',         // violet
};

/**
 * Category emoji icons for markers
 */
export const CATEGORY_ICONS: Record<string, string> = {
  sightseeing: '🏛️',
  food: '🍽️',
  trek: '🥾',
  photography: '📸',
  camping: '⛺',
  cultural: '🎭',
  transport: '🚗',
  rest: '😌',
};

/**
 * Mapbox style URLs
 */
export const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
};

/**
 * Default map configuration
 */
export const MAP_DEFAULTS = {
  style: MAP_STYLES.dark,
  zoom: 11,
  pitch: 0,
  bearing: 0,
  flyToDuration: 1500, // ms
  markerSize: 32,
};

/**
 * Get Mapbox access token from env
 */
export function getMapboxToken(): string {
  return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
}
