/* =====================================================
   OpenAI Service — Primary AI Provider (GPT-4o)
   ===================================================== */

import OpenAI from 'openai';
import config from '../config/env.js';
import { buildSystemPrompt, buildUserPrompt, ITINERARY_JSON_SCHEMA } from '../prompts/itinerary.js';

let openaiClient = null;

function getClient() {
  if (!config.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Generate an itinerary using OpenAI GPT-4o with structured output
 * @param {object} preferences - TripPreferences object
 * @returns {Promise<object>} - Parsed itinerary JSON
 */
export async function generateWithOpenAI(preferences) {
  const client = getClient();

  console.log('🤖 Generating itinerary with OpenAI GPT-4o...');
  const startTime = Date.now();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(preferences) },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: ITINERARY_JSON_SCHEMA,
    },
    temperature: 0.8,
    max_tokens: 8000,
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ OpenAI response received in ${elapsed}s`);

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse OpenAI JSON response:', content.substring(0, 200));
    throw new Error('Invalid JSON response from OpenAI');
  }
}
