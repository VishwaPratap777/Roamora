/* =====================================================
   Types — Roamora Application
   ===================================================== */

export type BudgetType = 'backpacker' | 'balanced' | 'luxury';
export type TravelVibe = 'adventure' | 'photography' | 'food' | 'spiritual' | 'nature' | 'hidden-gems' | 'roadtrip';
export type TripType = 'solo' | 'couple' | 'friends' | 'family';
export type EnergyLevel = 'relaxed' | 'moderate' | 'packed';
export type TransportMode = 'flight' | 'train' | 'bus' | 'self-drive' | 'any';
export type VehicleType = 'bike' | 'car' | 'suv';

export interface TripPreferences {
  destination: string;
  budget: BudgetType;
  vibes: TravelVibe[];
  tripType: TripType;
  energy: EnergyLevel;
  duration: number; // days
  startDate?: string;
  startingFrom?: string;        // departure city/location
  transportMode?: TransportMode; // preferred mode of transport
  vehicleType?: VehicleType;    // only relevant for self-drive
}

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'sightseeing' | 'food' | 'trek' | 'photography' | 'camping' | 'cultural' | 'transport' | 'rest';
  location: string;
  coordinates?: { lat: number; lng: number };
  estimatedCost?: number;
  difficulty?: 'easy' | 'moderate' | 'hard';
  isHiddenGem: boolean;
  photographyTip?: string;
  goldenHourInfo?: string;
  droneAllowed?: boolean;
  skipped?: boolean; // local override — user opted out
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  description: string;
  activities: ItineraryActivity[];
  totalCost?: number;
  weather?: WeatherInfo;
}

export interface Itinerary {
  id: string;
  destination: string;
  preferences: TripPreferences;
  days: ItineraryDay[];
  totalBudget: number;
  packingSuggestions: string[];
  travelTips: string[];
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  tags: string[];
  rating?: number;
  isHiddenGem: boolean;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  fogProbability?: number;
}

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  tripType: string;
  destination: string;
  quote: string;
  rating: number;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
