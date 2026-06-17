/* =====================================================
   Prompt Templates — AI Itinerary Generation
   ===================================================== */

/**
 * Budget context for prompt engineering
 */
const BUDGET_CONTEXT = {
  backpacker: {
    label: 'Backpacker',
    dailyRange: '₹1,500–₹3,000 per day',
    style: 'Budget hostels/dormitories, street food and local dhabas, public transport (buses/shared autos), free or low-cost attractions. Prioritize authentic local experiences over comfort.',
    costAnchors: `Per-category cost guide (use these as reference for estimatedCost):
      - Accommodation (rest): ₹400–₹800 per night
      - Meals (food): ₹80–₹200 per meal
      - Local transport (transport): ₹50–₹300 per ride
      - Activities/entry fees (sightseeing/cultural/trek): ₹0–₹500 per activity
      - Long-distance transport: ₹300–₹800`,
  },
  balanced: {
    label: 'Balanced',
    dailyRange: '₹4,000–₹8,000 per day',
    style: 'Mid-range hotels/homestays (private rooms), mix of street food and sit-down restaurants, private transport for longer routes, paid activities. Balance comfort with local immersion.',
    costAnchors: `Per-category cost guide (use these as reference for estimatedCost):
      - Accommodation (rest): ₹1,500–₹3,000 per night
      - Meals (food): ₹200–₹600 per meal
      - Local transport (transport): ₹200–₹800 per ride
      - Activities/entry fees (sightseeing/cultural/trek): ₹200–₹2,000 per activity
      - Long-distance transport: ₹800–₹2,500`,
  },
  luxury: {
    label: 'Luxury',
    dailyRange: '₹12,000–₹25,000 per day',
    style: 'Premium resorts/boutique hotels (4-5 star), fine dining and curated culinary experiences, private chauffeur-driven vehicles, exclusive access and VIP experiences. Focus on comfort, privacy, and unique luxury.',
    costAnchors: `Per-category cost guide (use these as reference for estimatedCost):
      - Accommodation (rest): ₹5,000–₹12,000 per night
      - Meals (food): ₹500–₹2,500 per meal
      - Local transport (transport): ₹800–₹3,000 per ride
      - Activities/entry fees (sightseeing/cultural/trek): ₹1,000–₹5,000 per activity
      - Long-distance transport: ₹2,500–₹8,000`,
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

ITINERARY PLANNING RULES:
1. Always prioritize hidden gems and off-the-beaten-path experiences over mainstream tourist spots.
2. Include realistic time estimates — account for travel between locations, rest periods, meal times.
3. Every activity must have valid latitude/longitude coordinates that correspond to the ACTUAL named location. Never invent fictional places.
4. Generate unique IDs for each activity (use format: "d{dayNumber}-a{activityNumber}").
5. Plan 4-7 activities per day depending on the energy level.
6. Include at least 2-3 food/meal activities per day.
7. Start mornings early for photography vibes (golden hour).
8. Include transport activities when moving between distant locations (distances > 5km).
9. Mark truly unique, off-the-beaten-path locations as hidden gems.
10. If photography vibe is selected, include photography tips and golden hour info.
11. Always include a mix of activity types per day — don't make entire days single-category.
12. Activities within a day must be geographically logical — plan them in a sensible route order to minimize backtracking.
13. Use specific, real, verifiable place names for every location — never use generic or made-up names.
14. Account for realistic travel time between activities. If two consecutive activities are far apart, insert a transport activity between them.

BUDGET & COST RULES (CRITICAL — follow these exactly):
15. Cost estimates must be realistic and in INR (₹). Use the per-category cost guide provided in the budget tier description.
16. Set each activity's "estimatedCost" based on its category and the budget tier's cost anchors.
17. Each day's "totalCost" MUST exactly equal the arithmetic sum of all "estimatedCost" values in that day's activities. Calculate this explicitly.
18. The overall "totalBudget" MUST exactly equal the arithmetic sum of all days' "totalCost" values. Calculate this explicitly.
19. Before outputting JSON, double-check ALL arithmetic: verify every day's totalCost matches its activities sum, and totalBudget matches the days sum.
20. Never assign ₹0 to a paid activity (food, accommodation, transport, entry fees). Only free viewpoints, public parks, or walking activities can be ₹0.
21. Accommodation costs should appear as an activity (category: "rest") once per day — typically the last activity of the day or first of next day.

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

  const transportDescriptions = {
    flight: 'Traveling by flight — include airport drop-off/pick-up logistics, typical flight duration, and arrival transfer in Day 1.',
    train: 'Traveling by train — include station departure, estimated journey time, and scenic route notes for Day 1.',
    bus: 'Traveling by bus/coach — include bus terminal logistics, expected travel time, and comfort tips for Day 1.',
    'self-drive': 'Road trip by personal vehicle — include drive distance, key fuel stops, scenic highway notes, and estimated drive time as a transport activity on Day 1.',
    any: 'Transport mode is flexible — suggest the best option based on distance and budget.',
  };

  const vehicleNotes = {
    bike: 'Vehicle: motorcycle/scooter — ideal for mountain roads, narrow lanes. Include fuel cost at ~₹5/km, note pillion restrictions.',
    car: 'Vehicle: car/sedan — standard fuel at ~₹8/km. Note road conditions and parking situations.',
    suv: 'Vehicle: SUV/4WD — high clearance for rough mountain roads. Fuel at ~₹12/km. Perfect for off-road spots.',
  };

  // Build transport block
  let transportBlock = '';
  if (preferences.startingFrom) {
    transportBlock += `\n**Starting Location**: ${preferences.startingFrom}`;
  }
  if (preferences.transportMode && preferences.transportMode !== 'any') {
    transportBlock += `\n**Mode of Transport**: ${preferences.transportMode}`;
    const desc = transportDescriptions[preferences.transportMode];
    if (desc) transportBlock += `\n${desc}`;
  }
  if (preferences.transportMode === 'self-drive' && preferences.vehicleType) {
    const vNote = vehicleNotes[preferences.vehicleType];
    if (vNote) transportBlock += `\n${vNote}`;
  }
  if (transportBlock) {
    transportBlock = `\n**Reachability & Getting There**:${transportBlock}\n`;
  }

  return `Generate a ${preferences.duration}-day travel itinerary for:

**Destination**: ${preferences.destination}

**Budget Tier**: ${budget.label} (${budget.dailyRange})
${budget.style}

${budget.costAnchors}

**Trip Type**: ${tripTypeDescriptions[preferences.tripType] || preferences.tripType}

**Travel Vibes**:
${vibes}

**Energy Level**: ${preferences.energy} — ${energyDescriptions[preferences.energy] || 'Moderate pace'}

${preferences.startDate ? `**Start Date**: ${preferences.startDate}` : ''}
${transportBlock}
Remember:
- Focus heavily on HIDDEN GEMS and underrated spots
- Use the per-category cost guide above to set realistic estimatedCost for each activity based on its category
- Provide accurate GPS coordinates for every location — coordinates must point to the actual named place
- Optimize the route to minimize travel time between locations within each day
- Each day should have a compelling, poetic title
- Activities should flow naturally through the day in geographic order
- CRITICAL: After generating all activities, calculate each day's totalCost as the exact sum of its activities' estimatedCost values, then calculate totalBudget as the exact sum of all days' totalCost values
- If a starting location is provided, make Day 1's first activity a realistic "Getting There" transport activity with estimated travel time and cost`;
}
