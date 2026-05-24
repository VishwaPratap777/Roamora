/* =====================================================
   Itinerary Generation Route
   ===================================================== */

import { Router } from 'express';
import { generateWithOpenAI } from '../services/openai.js';
import { generateWithGroq } from '../services/groq.js';
import { createRateLimiter } from '../middleware/rateLimit.js';
import config from '../config/env.js';

const router = Router();

// Rate limit: 10 itinerary generations per IP per hour
const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60 * 60 * 1000 });

/**
 * Valid enum values for input validation
 */
const VALID_BUDGETS = ['backpacker', 'balanced', 'luxury'];
const VALID_VIBES = ['adventure', 'photography', 'food', 'spiritual', 'nature', 'hidden-gems', 'roadtrip'];
const VALID_TRIP_TYPES = ['solo', 'couple', 'friends', 'family'];
const VALID_ENERGY = ['relaxed', 'moderate', 'packed'];

/**
 * Validate trip preferences input
 */
function validatePreferences(body) {
  const errors = [];

  if (!body.destination || typeof body.destination !== 'string' || body.destination.trim().length < 2) {
    errors.push('destination is required (min 2 characters)');
  }

  if (!VALID_BUDGETS.includes(body.budget)) {
    errors.push(`budget must be one of: ${VALID_BUDGETS.join(', ')}`);
  }

  if (!Array.isArray(body.vibes) || body.vibes.length === 0) {
    errors.push('vibes must be a non-empty array');
  } else if (body.vibes.some((v) => !VALID_VIBES.includes(v))) {
    errors.push(`vibes must only contain: ${VALID_VIBES.join(', ')}`);
  }

  if (!VALID_TRIP_TYPES.includes(body.tripType)) {
    errors.push(`tripType must be one of: ${VALID_TRIP_TYPES.join(', ')}`);
  }

  if (!VALID_ENERGY.includes(body.energy)) {
    errors.push(`energy must be one of: ${VALID_ENERGY.join(', ')}`);
  }

  const duration = parseInt(body.duration, 10);
  if (isNaN(duration) || duration < 1 || duration > 14) {
    errors.push('duration must be between 1 and 14 days');
  }

  return errors;
}

/**
 * POST /api/itinerary/generate
 * Generate an AI-powered travel itinerary
 */
router.post('/generate', limiter, async (req, res, next) => {
  try {
    // Validate input
    const errors = validatePreferences(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Invalid request',
        details: errors,
        status: 400,
      });
    }

    const preferences = {
      destination: req.body.destination.trim(),
      budget: req.body.budget,
      vibes: req.body.vibes,
      tripType: req.body.tripType,
      energy: req.body.energy,
      duration: parseInt(req.body.duration, 10),
      startDate: req.body.startDate || undefined,
    };

    let itinerary;
    let provider;

    // Try OpenAI first, fall back to Groq
    if (config.OPENAI_API_KEY) {
      try {
        itinerary = await generateWithOpenAI(preferences);
        provider = 'openai';
      } catch (openaiError) {
        console.warn('⚠️  OpenAI failed, falling back to Groq:', openaiError.message);

        if (config.GROQ_API_KEY) {
          itinerary = await generateWithGroq(preferences);
          provider = 'groq';
        } else {
          throw openaiError; // No fallback available
        }
      }
    } else if (config.GROQ_API_KEY) {
      itinerary = await generateWithGroq(preferences);
      provider = 'groq';
    } else {
      return res.status(503).json({
        error: 'No AI provider configured. Set OPENAI_API_KEY or GROQ_API_KEY.',
        status: 503,
      });
    }

    // Construct full itinerary response
    const response = {
      id: `itin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...itinerary,
      preferences,
      createdAt: new Date().toISOString(),
      provider,
    };

    console.log(`🎉 Itinerary generated: ${preferences.destination} (${preferences.duration} days) via ${provider}`);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
