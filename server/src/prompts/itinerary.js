/* =====================================================
   Prompt Templates — AI Itinerary Generation
   ===================================================== */

/**
 * Budget context for prompt engineering
 */
const BUDGET_CONTEXT = {
  backpacker: {
    label: 'Backpacker',
    dailyRange: '₹500–₹1,500 per day',
    style: 'Budget hostels, street food, public transport, free attractions. Prioritize authentic local experiences over comfort.',
  },
  balanced: {
    label: 'Balanced',
    dailyRange: '₹2,000–₹5,000 per day',
    style: 'Mid-range hotels/homestays, mix of street food and restaurants, private transport for longer routes. Balance comfort with local immersion.',
  },
  luxury: {
    label: 'Luxury',
    dailyRange: '₹8,000+ per day',
    style: 'Premium resorts/boutique hotels, fine dining and curated food experiences, private vehicles, exclusive access. Focus on comfort and unique luxury experiences.',
  },
};

/**
 * Vibe descriptions for prompt context
 */
const VIBE_CONTEXT = {
  adventure: 'Thrilling activities — trekking, paragliding, rafting, bungee, caving, off-road drives.',
  photography: 'Golden hour spots, fog/mist probability, drone-friendly zones, iconic viewpoints, composition tips.',
  food: 'Local street food, hidden restaurants, regional specialties, cooking experiences, food markets.',
  spiritual: 'Temples, monasteries, meditation spots, sacred lakes, pilgrimage trails, ashrams.',
  nature: 'Scenic trails, waterfalls, lakes, forests, wildlife sanctuaries, stargazing spots.',
  'hidden-gems': 'Off-the-beaten-path locations, underrated villages, secret viewpoints, places most tourists miss.',
  roadtrip: 'Scenic drives, highway stops, roadside eateries, camping spots, fuel stations, drive timings.',
};

/**
 * The JSON schema that the AI must follow for structured output
 */
export const ITINERARY_JSON_SCHEMA = {
  name: 'itinerary_response',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      destination: { type: 'string', description: 'Name of the destination' },
      days: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            dayNumber: { type: 'number' },
            title: { type: 'string', description: 'A catchy title for this day e.g. "The Valley of Gods"' },
            description: { type: 'string', description: 'One-line summary of the day' },
            activities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  time: { type: 'string', description: 'Time of day e.g. "6:00 AM" or "2:30 PM"' },
                  title: { type: 'string' },
                  description: { type: 'string', description: '2-3 sentence description of the activity' },
                  category: {
                    type: 'string',
                    enum: ['sightseeing', 'food', 'trek', 'photography', 'camping', 'cultural', 'transport', 'rest'],
                  },
                  location: { type: 'string', description: 'Name of the place/location' },
                  coordinates: {
                    type: 'object',
                    properties: {
                      lat: { type: 'number' },
                      lng: { type: 'number' },
                    },
                    required: ['lat', 'lng'],
                    additionalProperties: false,
                  },
                  estimatedCost: { type: 'number', description: 'Estimated cost in INR' },
                  difficulty: {
                    type: 'string',
                    enum: ['easy', 'moderate', 'hard'],
                  },
                  isHiddenGem: { type: 'boolean', description: 'True if this is an off-the-beaten-path location' },
                  photographyTip: { type: 'string', description: 'Photography tip for this location, if relevant' },
                  goldenHourInfo: { type: 'string', description: 'Golden hour or lighting info, if relevant' },
                  droneAllowed: { type: 'boolean', description: 'Whether drones are allowed at this location' },
                },
                required: ['id', 'time', 'title', 'description', 'category', 'location', 'coordinates', 'estimatedCost', 'difficulty', 'isHiddenGem', 'photographyTip', 'goldenHourInfo', 'droneAllowed'],
                additionalProperties: false,
              },
            },
            totalCost: { type: 'number', description: 'Total estimated cost for this day in INR' },
          },
          required: ['dayNumber', 'title', 'description', 'activities', 'totalCost'],
          additionalProperties: false,
        },
      },
      totalBudget: { type: 'number', description: 'Total estimated trip budget in INR' },
      packingSuggestions: {
        type: 'array',
        items: { type: 'string' },
        description: '8-12 packing suggestions tailored to the trip',
      },
      travelTips: {
        type: 'array',
        items: { type: 'string' },
        description: '5-8 practical travel tips for this destination',
      },
    },
    required: ['destination', 'days', 'totalBudget', 'packingSuggestions', 'travelTips'],
    additionalProperties: false,
  },
};

/**
 * Build the system prompt
 */
export function buildSystemPrompt() {
  return `You are Roamora AI — an elite travel planning assistant who specializes in discovering hidden gems, underrated destinations, and crafting unforgettable travel experiences.

Your expertise covers:
- Hidden and underrated locations that most tourists miss
- Photography-optimized travel (golden hour spots, viewpoints, drone zones)
- Budget-smart planning across all spending tiers
- Route optimization to minimize backtracking
- Local food culture and authentic culinary experiences
- Adventure activities with accurate difficulty ratings
- Cultural and spiritual experiences

RULES:
1. Always prioritize hidden gems and off-the-beaten-path experiences over mainstream tourist spots.
2. Include realistic time estimates — account for travel between locations, rest periods, meal times.
3. Cost estimates must be realistic and in INR (₹). Research actual prices.
4. Every activity must have valid latitude/longitude coordinates.
5. Generate unique IDs for each activity (use format: "d{dayNumber}-a{activityNumber}").
6. Plan 4-7 activities per day depending on the energy level.
7. Include at least 2-3 food/meal activities per day.
8. Start mornings early for photography vibes (golden hour).
9. Include transport activities when moving between locations.
10. Mark truly unique, off-the-beaten-path locations as hidden gems.
11. If photography vibe is selected, include photography tips and golden hour info.
12. Always include a mix of activity types per day — don't make entire days single-category.

You must respond with valid JSON matching the provided schema. No additional text.`;
}

/**
 * Build the user prompt from trip preferences
 */
export function buildUserPrompt(preferences) {
  const budget = BUDGET_CONTEXT[preferences.budget] || BUDGET_CONTEXT.balanced;
  const vibes = preferences.vibes
    .map((v) => `- ${v.charAt(0).toUpperCase() + v.slice(1)}: ${VIBE_CONTEXT[v] || v}`)
    .join('\n');

  const tripTypeDescriptions = {
    solo: 'Solo traveler — flexible schedule, introspective experiences, safety-conscious recommendations.',
    couple: 'Couple — romantic spots, cozy restaurants, scenic drives, sunset viewpoints.',
    friends: 'Group of friends — fun activities, group-friendly restaurants, adventure sports, nightlife/bonfires.',
    family: 'Family trip — kid-friendly activities, comfortable transport, safe locations, family restaurants.',
  };

  const energyDescriptions = {
    relaxed: '3-4 activities per day. Plenty of rest, leisure time, slow mornings. Prioritize quality over quantity.',
    moderate: '5-6 activities per day. Balanced pace with both exploration and downtime.',
    packed: '6-8 activities per day. Maximum exploration, early starts, late evenings. For travelers who want to see everything.',
  };

  return `Generate a ${preferences.duration}-day travel itinerary for:

**Destination**: ${preferences.destination}

**Budget Tier**: ${budget.label} (${budget.dailyRange})
${budget.style}

**Trip Type**: ${tripTypeDescriptions[preferences.tripType] || preferences.tripType}

**Travel Vibes**:
${vibes}

**Energy Level**: ${preferences.energy} — ${energyDescriptions[preferences.energy] || 'Moderate pace'}

${preferences.startDate ? `**Start Date**: ${preferences.startDate}` : ''}

Remember:
- Focus heavily on HIDDEN GEMS and underrated spots
- Include realistic cost estimates in INR
- Provide accurate GPS coordinates for every location
- Optimize the route to minimize travel time between locations
- Each day should have a compelling, poetic title
- Activities should flow naturally through the day`;
}
