/* =====================================================
   Groq Service — Fallback AI Provider (Llama 3)
   ===================================================== */

import Groq from 'groq-sdk';
import config from '../config/env.js';
import { buildSystemPrompt, buildUserPrompt } from '../prompts/itinerary.js';

let groqClient = null;

function getClient() {
  if (!config.GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: config.GROQ_API_KEY });
  }
  return groqClient;
}

/**
 * Generate an itinerary using Groq Llama 3 as fallback
 * Groq doesn't support json_schema, so we use json_object mode + schema instructions in prompt
 * @param {object} preferences - TripPreferences object
 * @returns {Promise<object>} - Parsed itinerary JSON
 */
export async function generateWithGroq(preferences) {
  const client = getClient();

  console.log('🦙 Generating itinerary with Groq (Llama 3 fallback)...');
  const startTime = Date.now();

  // Append schema info to the system prompt since Groq doesn't support json_schema
  const systemPrompt = buildSystemPrompt() + `

IMPORTANT: Your response MUST be a valid JSON object with this exact structure:
{
  "destination": "string",
  "days": [
    {
      "dayNumber": number,
      "title": "string",
      "description": "string",
      "activities": [
        {
          "id": "string (format: d1-a1)",
          "time": "string (e.g. 6:00 AM)",
          "title": "string",
          "description": "string (2-3 sentences)",
          "category": "sightseeing|food|trek|photography|camping|cultural|transport|rest",
          "location": "string",
          "coordinates": { "lat": number, "lng": number },
          "estimatedCost": number (INR),
          "difficulty": "easy|moderate|hard",
          "isHiddenGem": boolean,
          "photographyTip": "string or empty string",
          "goldenHourInfo": "string or empty string",
          "droneAllowed": boolean
        }
      ],
      "totalCost": number
    }
  ],
  "totalBudget": number,
  "packingSuggestions": ["string"],
  "travelTips": ["string"]
}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: buildUserPrompt(preferences) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    // Capped at 6,500 to keep prompt + max_tokens under the 12,000 TPM limit for Groq's on-demand tier
    max_tokens: Math.min(6500, 2000 + (preferences.duration || 3) * 700),
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Groq response received in ${elapsed}s`);

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Groq');
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse Groq JSON response:', content.substring(0, 200));
    throw new Error('Invalid JSON response from Groq');
  }
}
