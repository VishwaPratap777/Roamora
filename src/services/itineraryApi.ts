/* =====================================================
   Itinerary API Client
   ===================================================== */

import type { TripPreferences, Itinerary } from '../types';
import { apiFetch } from './api';

/**
 * Generate an AI-powered itinerary
 */
export async function generateItinerary(
  preferences: TripPreferences
): Promise<Itinerary> {
  return apiFetch<Itinerary>('/itinerary/generate', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });
}
