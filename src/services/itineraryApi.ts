/* =====================================================
   Itinerary API Client — Backend-backed CRUD
   ===================================================== */

import type { TripPreferences, Itinerary } from '../types';
import { apiFetch } from './api';

/**
 * Generate an AI-powered itinerary (saves to MongoDB)
 */
export async function generateItinerary(
  preferences: TripPreferences
): Promise<Itinerary> {
  return apiFetch<Itinerary>('/itinerary/generate', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });
}

/**
 * Fetch a single itinerary by ID from the backend
 */
export async function fetchItinerary(id: string): Promise<Itinerary> {
  return apiFetch<Itinerary>(`/itinerary/${id}`);
}

/**
 * Fetch all itineraries for the authenticated user
 */
export async function fetchUserItineraries(): Promise<Itinerary[]> {
  return apiFetch<Itinerary[]>('/itinerary/user/me');
}

/**
 * Delete an itinerary by ID
 */
export async function deleteItinerary(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/itinerary/${id}`, {
    method: 'DELETE',
  });
}
