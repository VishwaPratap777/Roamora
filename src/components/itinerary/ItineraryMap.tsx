/* =====================================================
   Itinerary Map — Interactive Mapbox GL Component
   ===================================================== */

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Map as MapIcon, Layers, Maximize2, Minimize2 } from 'lucide-react';
import type { ItineraryDay, ItineraryActivity } from '../../types';
import {
  getMapboxToken,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  MAP_DEFAULTS,
  MAP_STYLES,
} from '../../lib/mapConfig';

interface ItineraryMapProps {
  day: ItineraryDay;
  allDays?: ItineraryDay[];
  className?: string;
}

export default function ItineraryMap({ day, allDays: _allDays, className = '' }: ItineraryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapStyle, setMapStyle] = useState<string>(MAP_DEFAULTS.style);
  const [mapReady, setMapReady] = useState(false);

  const token = getMapboxToken();

  // Initialize map
  useEffect(() => {
    if (!token || !mapContainerRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [78.9629, 20.5937], // Default: India center
      zoom: MAP_DEFAULTS.zoom,
      pitch: MAP_DEFAULTS.pitch,
      bearing: MAP_DEFAULTS.bearing,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // Only reinitialize when token or style changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mapStyle]);

  // Update markers and route when day changes
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove existing route layer
    if (map.getSource('route')) {
      map.removeLayer('route-line');
      map.removeSource('route');
    }

    // Get activities with coordinates
    const activities = day.activities.filter(
      (a) => a.coordinates && a.coordinates.lat && a.coordinates.lng
    );

    if (activities.length === 0) return;

    // Add markers
    activities.forEach((activity, index) => {
      if (!activity.coordinates) return;

      const el = createMarkerElement(activity, index + 1);

      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: true,
        closeOnClick: false,
        className: 'roamora-popup',
        maxWidth: '280px',
      }).setHTML(createPopupHTML(activity));

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([activity.coordinates.lng, activity.coordinates.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Add route line connecting activities
    if (activities.length > 1) {
      const routeCoords = activities
        .filter((a) => a.coordinates)
        .map((a) => [a.coordinates!.lng, a.coordinates!.lat] as [number, number]);

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoords,
          },
        },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#c8a44e',
          'line-width': 2.5,
          'line-opacity': 0.6,
          'line-dasharray': [2, 3],
        },
      });
    }

    // Fit map bounds to markers
    const bounds = new mapboxgl.LngLatBounds();
    activities.forEach((a) => {
      if (a.coordinates) {
        bounds.extend([a.coordinates.lng, a.coordinates.lat]);
      }
    });

    map.fitBounds(bounds, {
      padding: { top: 60, bottom: 40, left: 40, right: 40 },
      maxZoom: 14,
      duration: MAP_DEFAULTS.flyToDuration,
    });
  }, [day, mapReady]);

  // No token — show placeholder
  if (!token) {
    return (
      <div className={`rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col items-center justify-center p-8 ${className}`}>
        <MapIcon className="w-10 h-10 text-white/15 mb-3" />
        <p className="text-white/30 text-sm text-center">
          Set <code className="text-primary-400/60">VITE_MAPBOX_ACCESS_TOKEN</code> in your
          .env to enable interactive maps
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`relative rounded-2xl overflow-hidden border border-white/[0.08] bg-dark-900 ${
        isExpanded ? 'fixed inset-4 z-50' : className
      }`}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />

      {/* Map Controls Overlay */}
      <div className="absolute top-3 left-3 flex gap-2">
        {/* Style Switcher */}
        <button
          onClick={() =>
            setMapStyle((prev) =>
              prev === MAP_STYLES.dark ? MAP_STYLES.satellite : MAP_STYLES.dark
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-950/80 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white text-xs transition-all cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mapStyle === MAP_STYLES.dark ? 'Satellite' : 'Dark'}</span>
        </button>
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="absolute bottom-3 right-3 p-2 rounded-lg bg-dark-950/80 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
      >
        {isExpanded ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>

      {/* Day Label */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-dark-950/80 backdrop-blur-sm border border-white/10">
        <span className="text-xs font-medium text-primary-400">
          Day {day.dayNumber}
        </span>
        <span className="text-xs text-white/40 ml-2">
          {day.activities.filter((a) => a.coordinates?.lat && a.coordinates?.lng).length} locations
        </span>
      </div>

      {/* Fullscreen backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/60 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </motion.div>
  );
}

/**
 * Create a custom marker DOM element
 */
function createMarkerElement(activity: ItineraryActivity, _index: number): HTMLDivElement {
  const el = document.createElement('div');
  const color = CATEGORY_COLORS[activity.category] || '#c8a44e';
  const isGem = activity.isHiddenGem;

  el.className = 'roamora-marker';
  el.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${color};
    border: 2.5px solid ${isGem ? '#f5d98a' : 'rgba(255,255,255,0.3)'};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    box-shadow: 0 2px 8px ${color}66, ${isGem ? '0 0 12px #f5d98a55' : 'none'};
    transition: transform 0.2s ease;
  `;

  el.innerHTML = `<span style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3))">${
    CATEGORY_ICONS[activity.category] || '📍'
  }</span>`;

  // Hover scale
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.2)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
  });

  return el;
}

/**
 * Create popup HTML content
 */
function createPopupHTML(activity: ItineraryActivity): string {
  const color = CATEGORY_COLORS[activity.category] || '#c8a44e';
  return `
    <div style="font-family: 'Inter', sans-serif; color: #e2e8f0; padding: 4px 0;">
      <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #fff;">
        ${activity.title}
      </div>
      <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
        ${activity.time} · ${activity.location}
      </div>
      <div style="font-size: 11px; color: #64748b; line-height: 1.5; margin-bottom: 6px;">
        ${activity.description.substring(0, 120)}${activity.description.length > 120 ? '…' : ''}
      </div>
      <div style="display: flex; align-items: center; gap: 8px; font-size: 10px;">
        <span style="
          display: inline-flex; padding: 2px 8px; border-radius: 9999px;
          background: ${color}22; color: ${color}; border: 1px solid ${color}33;
        ">${activity.category}</span>
        ${activity.isHiddenGem ? '<span style="color: #f5d98a;">✨ Hidden Gem</span>' : ''}
        ${activity.estimatedCost ? `<span style="color: #94a3b8;">₹${activity.estimatedCost.toLocaleString()}</span>` : ''}
      </div>
      ${activity.photographyTip ? `
        <div style="font-size: 10px; color: #a855f7; margin-top: 6px; padding-top: 6px; border-top: 1px solid #1e293b;">
          📸 ${activity.photographyTip.substring(0, 80)}
        </div>
      ` : ''}
    </div>
  `;
}
