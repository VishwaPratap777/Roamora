/* =====================================================
   Itinerary Map — MapLibre GL (free, no token needed)
   Uses CartoDB Dark Matter tiles via MapLibre WebGL
   ===================================================== */

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion } from 'framer-motion';
import { Layers, Maximize2, Minimize2 } from 'lucide-react';
import type { ItineraryDay, ItineraryActivity } from '../../types';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  MAP_DEFAULTS,
  MAP_STYLES,
  type MapStyleKey,
} from '../../lib/mapConfig';

interface ItineraryMapProps {
  day: ItineraryDay;
  allDays?: ItineraryDay[];
  className?: string;
}

export default function ItineraryMap({ day, allDays: _allDays, className = '' }: ItineraryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [styleKey, setStyleKey] = useState<MapStyleKey>(MAP_DEFAULTS.styleKey);
  const [mapReady, setMapReady] = useState(false);

  // Style order for cycling
  const STYLE_CYCLE: MapStyleKey[] = ['dark', 'satellite', 'outdoors'];
  const nextStyle = STYLE_CYCLE[(STYLE_CYCLE.indexOf(styleKey) + 1) % STYLE_CYCLE.length];

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[styleKey].url,
      center: MAP_DEFAULTS.defaultCenter,
      zoom: MAP_DEFAULTS.zoom,
      pitch: MAP_DEFAULTS.pitch,
      bearing: MAP_DEFAULTS.bearing,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      'top-right'
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    map.on('load', () => {
      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // Only reinitialize when style changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleKey]);

  // Update markers and route when day changes
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove existing route layer/source
    if (map.getSource('route')) {
      if (map.getLayer('route-line')) map.removeLayer('route-line');
      map.removeSource('route');
    }

    // Get activities with valid coordinates
    const activities = day.activities.filter(
      (a) => a.coordinates && a.coordinates.lat && a.coordinates.lng
    );

    if (activities.length === 0) return;

    // Add markers
    activities.forEach((activity, index) => {
      if (!activity.coordinates) return;

      const el = createMarkerElement(activity, index + 1);

      const popupEl = document.createElement('div');
      popupEl.innerHTML = createPopupHTML(activity);
      popupEl.style.cssText = `
        background: #0f172a;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 12px;
        min-width: 220px;
        max-width: 280px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      `;

      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '290px',
        className: 'roamora-popup',
      }).setDOMContent(popupEl);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([activity.coordinates.lng, activity.coordinates.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Add dashed route line connecting activities
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

    // Fit map bounds to all markers
    const bounds = new maplibregl.LngLatBounds();
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

  return (
    <motion.div
      layout
      className={`relative rounded-2xl overflow-hidden border border-white/[0.08] bg-dark-900 ${
        isExpanded ? 'fixed inset-4 z-50' : className
      }`}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />

      {/* Map Controls Overlay — top left */}
      <div className="absolute top-3 left-3 flex gap-2">
        <button
          onClick={() => setStyleKey(nextStyle)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-950/80 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white text-xs transition-all cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{MAP_STYLES[nextStyle].label}</span>
        </button>
      </div>

      {/* Expand / Collapse */}
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

      {/* Day label + location count */}
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

/* ─────────────────────────────────────── helpers ─── */

function createMarkerElement(activity: ItineraryActivity, _index: number): HTMLDivElement {
  const el = document.createElement('div');
  const color = CATEGORY_COLORS[activity.category] || '#c8a44e';
  const isGem = activity.isHiddenGem;

  el.className = 'roamora-marker';
  el.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${color}22;
    border: 2.5px solid ${isGem ? '#f5d98a' : color};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    box-shadow: 0 2px 8px ${color}66${isGem ? ', 0 0 12px #f5d98a55' : ''};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    backdrop-filter: blur(4px);
  `;

  el.innerHTML = `<span style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5))">${
    CATEGORY_ICONS[activity.category] || '📍'
  }</span>`;

  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.25)';
    el.style.boxShadow = `0 4px 16px ${color}99${isGem ? ', 0 0 18px #f5d98a88' : ''}`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
    el.style.boxShadow = `0 2px 8px ${color}66${isGem ? ', 0 0 12px #f5d98a55' : ''}`;
  });

  return el;
}

function createPopupHTML(activity: ItineraryActivity): string {
  const color = CATEGORY_COLORS[activity.category] || '#c8a44e';
  return `
    <div style="font-family: 'Inter', sans-serif; color: #e2e8f0;">
      <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #fff; line-height: 1.3;">
        ${activity.title}
      </div>
      <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
        ${activity.time} · ${activity.location}
      </div>
      <div style="font-size: 11px; color: #64748b; line-height: 1.5; margin-bottom: 8px;">
        ${activity.description.substring(0, 120)}${activity.description.length > 120 ? '…' : ''}
      </div>
      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 10px;">
        <span style="
          display: inline-flex; padding: 2px 8px; border-radius: 9999px;
          background: ${color}22; color: ${color}; border: 1px solid ${color}33;
          text-transform: capitalize;
        ">${activity.category}</span>
        ${activity.isHiddenGem ? '<span style="color: #f5d98a;">✨ Hidden Gem</span>' : ''}
        ${activity.estimatedCost ? `<span style="color: #94a3b8; margin-left: auto;">₹${Math.round(activity.estimatedCost * 0.9).toLocaleString()} - ₹${Math.round(activity.estimatedCost * 1.1).toLocaleString()}</span>` : ''}
      </div>
      ${activity.photographyTip ? `
        <div style="font-size: 10px; color: #a855f7; margin-top: 8px; padding-top: 6px; border-top: 1px solid #1e293b;">
          📸 ${activity.photographyTip.substring(0, 80)}${activity.photographyTip.length > 80 ? '…' : ''}
        </div>
      ` : ''}
    </div>
  `;
}
