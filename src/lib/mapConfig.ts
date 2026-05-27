/* =====================================================
   MapLibre Configuration — Roamora Map Theme
   Uses 100% free tile sources — no token required.
   ===================================================== */

/**
 * Activity category → marker color mapping
 */
export const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: '#06b6d4',  // cyan
  food: '#f59e0b',          // amber
  trek: '#10b981',          // emerald
  photography: '#a855f7',   // purple
  camping: '#22c55e',       // green
  cultural: '#f43f5e',      // rose
  transport: '#6b7280',     // gray
  rest: '#8b5cf6',          // violet
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
 * MapLibre GL tile style URLs
 * All free — no API key required.
 *
 * Dark:      CartoDB Dark Matter (OpenStreetMap data)
 * Satellite: Esri World Imagery (public endpoint, no key)
 * Outdoors:  OpenTopoMap — detailed terrain
 */
export const MAP_STYLES = {
  dark: {
    label: 'Dark',
    url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
  satellite: {
    label: 'Satellite',
    // Esri World Imagery wrapped in a MapLibre-compatible style spec
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
  outdoors: {
    label: 'Terrain',
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  },
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;

/**
 * Default map configuration
 */
export const MAP_DEFAULTS = {
  styleKey: 'dark' as MapStyleKey,
  zoom: 11,
  pitch: 0,
  bearing: 0,
  flyToDuration: 1500, // ms
  markerSize: 32,
  defaultCenter: [78.9629, 20.5937] as [number, number], // India
};
