/* =====================================================
   Constants — Roamora Application
   ===================================================== */

import type { NavLink, Destination } from '../types';

export const APP_NAME = 'Roamora';
export const APP_TAGLINE = 'Discover Beyond The Obvious';
export const APP_DESCRIPTION = 'Uncover hidden gems, build the perfect itinerary, and experience places like never before.';

export const NAV_LINKS: NavLink[] = [
  { label: 'Explore', href: '/explore', isActive: true },
  { label: 'Itinerary', href: '/itinerary' },
  { label: 'Trips', href: '/trips' },
  { label: 'Guides', href: '/guides' },
  { label: 'About', href: '/about' },
];

export const FEATURED_DESTINATIONS: Destination[] = [
  {
    id: 'serene-himalayas',
    name: 'Serene Himalayas',
    location: 'Uttarakhand, India',
    description: 'Untouched peaks, hidden monasteries, and trails that lead to silence.',
    image: '/images/himalayas.png',
    tags: ['Underrated', 'Peaceful', 'Raw'],
    rating: 4.9,
    isHiddenGem: true,
  },
  {
    id: 'faroe-islands',
    name: 'Faroe Islands',
    location: 'North Atlantic',
    description: 'Dramatic sea cliffs, grass-roofed villages, and raw Nordic beauty.',
    image: '/images/faroe-islands.png',
    tags: ['Remote', 'Photography', 'Wild'],
    rating: 4.8,
    isHiddenGem: true,
  },
  {
    id: 'spiti-valley',
    name: 'Spiti Valley',
    location: 'Himachal Pradesh, India',
    description: 'A cold desert wonderland with ancient monasteries and starlit skies.',
    image: '/images/spiti-valley.png',
    tags: ['Adventure', 'Spiritual', 'Offbeat'],
    rating: 4.9,
    isHiddenGem: true,
  },
  {
    id: 'hidden-bali',
    name: 'Hidden Bali',
    location: 'Bali, Indonesia',
    description: 'Secret waterfalls, sacred temples, and untouched jungle trails.',
    image: '/images/bali-waterfall.png',
    tags: ['Nature', 'Spiritual', 'Hidden'],
    rating: 4.7,
    isHiddenGem: true,
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    location: 'Argentina & Chile',
    description: 'Glacial lakes, granite towers, and the edge of the world.',
    image: '/images/patagonia.png',
    tags: ['Wilderness', 'Trek', 'Raw'],
    rating: 4.9,
    isHiddenGem: false,
  },
];

export const FEATURES = [
  {
    icon: 'brain',
    title: 'AI Itinerary Generation',
    description: 'Personalized day-by-day plans crafted by AI, optimized for route efficiency and hidden gem discovery.',
    image: '/images/feature-ai.png',
  },
  {
    icon: 'camera',
    title: 'Photography Mode',
    description: 'Golden hour timing, fog probability, drone zones, and the best viewpoints for every location.',
    image: '/images/feature-photo.png',
  },
  {
    icon: 'map-pin',
    title: 'Hidden Gems Discovery',
    description: 'Uncover secret waterfalls, scenic roads, underrated cafés, and raw local experiences off the tourist trail.',
    image: '/images/feature-gems.png',
  },
  {
    icon: 'cloud-sun',
    title: 'Weather-Aware Planning',
    description: 'Real-time weather integration that adjusts your itinerary for the perfect travel experience.',
    image: '/images/feature-weather.png',
  },
  {
    icon: 'wallet',
    title: 'Smart Budget Estimation',
    description: 'Detailed cost breakdowns for accommodation, food, transport, and activities across all budget levels.',
    image: '/images/feature-budget.png',
  },
  {
    icon: 'route',
    title: 'Route Optimization',
    description: 'AI-powered routing that eliminates backtracking and groups nearby destinations intelligently.',
    image: '/images/feature-route.png',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Choose Your Destination',
    description: 'Search for any destination or let our AI suggest hidden gems based on your travel style.',
  },
  {
    step: 2,
    title: 'Set Your Travel Vibe',
    description: 'Pick your budget, energy level, travel type, and the experiences that excite you most.',
  },
  {
    step: 3,
    title: 'AI Generates Your Plan',
    description: 'Our AI builds a personalized, route-optimized itinerary focused on authentic local experiences.',
  },
  {
    step: 4,
    title: 'Explore Like a Local',
    description: 'Follow your interactive timeline with maps, photography tips, and real-time weather updates.',
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Utsav Tripathi',
    avatar: '',
    tripType: 'Solo Backpacker',
    destination: 'Spiti Valley',
    quote: 'Roamora showed me places in Spiti I never would have found on my own. The photography mode helped me catch the perfect sunrise at Key Monastery.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Shashank prakash',
    avatar: '',
    tripType: 'Photography Trip',
    destination: 'Faroe Islands',
    quote: 'The AI itinerary was incredibly well-planned. Every viewpoint recommendation was spot-on, and I got my best landscape shots ever.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ashwani Yadav',
    avatar: '',
    tripType: 'Friends Group',
    destination: 'Himachal Pradesh',
    quote: 'We used Roamora for our 7-day road trip and it was perfect. The hidden cafés and camping spots it suggested were absolutely magical.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Animesh',
    avatar: '',
    tripType: 'Couple Retreat',
    destination: 'Hidden Bali',
    quote: 'We stumbled upon a secret waterfall that wasn\'t on any map — Roamora knew. Best anniversary trip we\'ve ever taken, hands down.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Sanket Tyagi',
    avatar: '',
    tripType: 'Adventure Trek',
    destination: 'Patagonia',
    quote: 'The route optimization saved us two full days of backtracking. Every campsite recommendation was breathtaking. This app thinks like an explorer.',
    rating: 5,
  },
  {
    id: '6',
    name: 'Shashasnk Singh',
    avatar: '',
    tripType: 'Solo Wanderer',
    destination: 'Faroe Islands',
    quote: 'I was anxious about solo travel until Roamora built me the perfect plan. It felt like having a wise local friend guiding every step of my journey.',
    rating: 5,
  },
];

export const SOCIAL_LINKS = [
  { name: 'Instagram', url: 'https://instagram.com/vishwapratap777', icon: 'instagram' },
  { name: 'YouTube', url: 'https://youtube.com/cinewitbix', icon: 'youtube' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'mountain-snow' },
];
