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
    openaiClient = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
      timeout: 45000, // 45s timeout
      maxRetries: 1,  // 1 automatic retry on 5xx
    });
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

  try {
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
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    // Provide user-friendly error messages for common failures
    if (error.status === 429) {
      console.error(`❌ OpenAI rate limited after ${elapsed}s`);
      const retryErr = new Error('AI service is busy. Please try again in a moment.');
      retryErr.status = 429;
      throw retryErr;
    }

    if (error.status === 401) {
      console.error('❌ OpenAI API key is invalid');
      const authErr = new Error('AI service authentication failed. Check your API key.');
      authErr.status = 503;
      throw authErr;
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error(`❌ OpenAI request timed out after ${elapsed}s`);
      const timeoutErr = new Error('AI generation took too long. Please try again.');
      timeoutErr.status = 504;
      throw timeoutErr;
    }

    if (error.status >= 500) {
      console.error(`❌ OpenAI server error (${error.status}) after ${elapsed}s:`, error.message);
      const serverErr = new Error('AI service is temporarily unavailable. Please try again.');
      serverErr.status = 503;
      throw serverErr;
    }

    // Re-throw unknown errors
    throw error;
  }
}
