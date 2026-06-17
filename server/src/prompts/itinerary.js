/* =====================================================
   Prompt Templates — AI Itinerary Generation
   ===================================================== */

/**
 * Budget context for prompt engineering
 */
const BUDGET_CONTEXT = {
  backpacker: {
    label: 'Backpacker',
    dailyRange: '₹2,500–₹4,500 per day',
    style: 'Budget hostels/dormitories, street food and local dhabas, public transport (buses/shared autos), free or low-cost attractions. Prioritize authentic local experiences over comfort.',
    costAnchors: `Per-category cost guide (use these as reference for estimatedCost):
      - Accommodation (rest): ₹600–₹1,200 per night
      - Meals (food): ₹150–₹350 per meal
      - Local transport (transport): ₹100–₹500 per ride
      - Activities/entry fees (sightseeing/cultural/trek): ₹100–₹800 per activity
      - Long-distance transport: ₹500–₹1,500`,
  },
  balanced: {
    label: 'Balanced',
    dailyRange: '₹5,000–₹10,000 per day',
    style: 'Mid-range hotels/homestays (private rooms), mix of street food and sit-down restaurants, private transport for longer routes, paid activities. Balance comfort with local immersion.',
    costAnchors: `Per-category cost guide (use these as reference for estimatedCost):
      - Accommodation (rest): ₹2,500–₹5,000 per night
      - Meals (food): ₹300–₹900 per meal
      - Local transport (transport): ₹400–₹1,500 per ride
      - Activities/entry fees (sightseeing/cultural/trek): ₹300–₹3,000 per activity
      - Long-distance transport: ₹1,200–₹4,500`,
  },
  luxury: {
    label: 'Luxury',
    dailyRange: '₹18,000–₹40,000 per day',
    style: 'Premium resorts/boutique hotels (4-5 star), fine dining and curated culinary experiences, private chauffeur-driven vehicles, exclusive access and VIP experiences. Focus on comfort, privacy, and unique luxury.',
    costAnchors: `Per-category cost guide (use these as reference for estimatedCost):
      - Accommodation (rest): ₹8,000–₹20,000 per night
      - Meals (food): ₹1,000–₹4,000 per meal
      - Local transport (transport): ₹2,000–₹6,000 per ride
      - Activities/entry fees (sightseeing/cultural/trek): ₹2,000–₹10,000 per activity
      - Long-distance transport: ₹5,000–₹15,000`,
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
    flight: 'Traveling by flight — you MUST include a "Flight from [Starting Location]" on Day 1, and a "Flight to [Starting Location]" on the Last Day. Estimate the flight ticket price based on a 1-month advance booking window (typically ₹5,000 to ₹10,000 for domestic standard, or higher for international). Activity titles must include a variable cost notation (e.g. prefix "✈️ Flight... (~₹[cost])").',
    train: 'Traveling by train — you MUST include a "Train from [Starting Location]" on Day 1, and a "Train to [Starting Location]" on the Last Day. Estimate the train ticket price based on a 1-month advance window (typically ₹800 to ₹2,500). Activity titles must include a variable cost notation (e.g. prefix "🚊 Train... (~₹[cost])").',
    bus: 'Traveling by bus/coach — you MUST include a "Bus from [Starting Location]" on Day 1, and a "Bus to [Starting Location]" on the Last Day. Estimate the bus ticket price based on a 1-month advance window (typically ₹500 to ₹1,500). Activity titles must include a variable cost notation (e.g. prefix "🚌 Bus... (~₹[cost])").',
    'self-drive': 'Road trip by personal vehicle — you MUST include a "Drive from [Starting Location]" on Day 1, and a "Drive to [Starting Location]" on the Last Day. Estimate fuel/toll costs based on distance and vehicle type. Activity titles must include a variable cost notation (e.g. prefix "🚗 Drive... (~₹[cost])").',
    any: 'Transport mode is flexible — select the best option (flight, train, bus, or drive) based on distance and budget, and you MUST include this transport on both Day 1 and the Last Day. Estimate travel costs assuming a 1-month booking window. Activity titles must include a variable cost notation (e.g. prefix "... (~₹[cost])").',
  };

  const vehicleNotes = {
    bike: 'Vehicle: motorcycle/scooter — ideal for mountain roads. Fuel/tolls at ~₹5/km.',
    car: 'Vehicle: car/sedan — standard fuel/tolls at ~₹8/km.',
    suv: 'Vehicle: SUV/4WD — high clearance. Fuel/tolls at ~₹12/km.',
  };

  // Build transport block
  let transportBlock = '';
  if (preferences.startingFrom) {
    transportBlock += `\n**Starting Location**: ${preferences.startingFrom}`;
  }
  if (preferences.transportMode) {
    const mode = preferences.transportMode === 'any' ? 'flexible' : preferences.transportMode;
    transportBlock += `\n**Mode of Transport**: ${mode}`;
    const desc = transportDescriptions[preferences.transportMode];
    if (desc) transportBlock += `\n${desc}`;
  }
  if (preferences.transportMode === 'self-drive' && preferences.vehicleType) {
    const vNote = vehicleNotes[preferences.vehicleType];
    if (vNote) transportBlock += `\n${vNote}`;
  }
  if (transportBlock) {
    transportBlock = `\n**Reachability & In/Out Transport**:${transportBlock}\n`;
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
- You MUST include a "Getting There" transport activity (category: "transport") as the first activity on Day 1 (incoming travel) and a "Return Journey" transport activity (category: "transport") as the last activity on the final Day (outgoing travel). Estimate realistic ticket or fuel/toll costs assuming a 1-month booking/planning window, outputting this under estimatedCost (positive number), and prepend a variable symbol/text (like "✈️ Flight from [Starting Location] to [Destination] (~₹[cost])") in the activity title.`;
}
