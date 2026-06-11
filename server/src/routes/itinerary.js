/* =====================================================
   Itinerary Routes — CRUD + AI Generation
   ===================================================== */

import { Router } from 'express';
import { generateWithOpenAI } from '../services/openai.js';
import { generateWithGroq } from '../services/groq.js';
import { createRateLimiter } from '../middleware/rateLimit.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import Itinerary from '../models/Itinerary.js';
import config from '../config/env.js';
import { connectDB } from '../config/db.js';

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
 * Generate an AI-powered travel itinerary and save to MongoDB
 */
router.post('/generate', optionalAuth, limiter, async (req, res, next) => {
  try {
    await connectDB();

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

    let aiResult;
    let provider;

    // Try OpenAI first, fall back to Groq
    if (config.OPENAI_API_KEY) {
      try {
        aiResult = await generateWithOpenAI(preferences);
        provider = 'openai';
      } catch (openaiError) {
        console.warn('⚠️  OpenAI failed, falling back to Groq:', openaiError.message);

        if (config.GROQ_API_KEY) {
          aiResult = await generateWithGroq(preferences);
          provider = 'groq';
        } else {
          throw openaiError; // No fallback available
        }
      }
    } else if (config.GROQ_API_KEY) {
      aiResult = await generateWithGroq(preferences);
      provider = 'groq';
    } else {
      return res.status(503).json({
        error: 'No AI provider configured. Set OPENAI_API_KEY or GROQ_API_KEY.',
        status: 503,
      });
    }

    // Extract userId from Clerk auth (null if unauthenticated)
    const userId = req.auth?.userId || null;

    // Save to MongoDB
    const itinerary = new Itinerary({
      userId,
      destination: aiResult.destination || preferences.destination,
      preferences,
      days: aiResult.days || [],
      totalBudget: aiResult.totalBudget || 0,
      packingSuggestions: aiResult.packingSuggestions || [],
      travelTips: aiResult.travelTips || [],
      provider,
      isPublic: true, // default public for sharing
    });

    await itinerary.save();

    console.log(`🎉 Itinerary generated & saved: ${preferences.destination} (${preferences.duration} days) via ${provider} → ${itinerary.id}`);

    res.json(itinerary.toJSON());
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/itinerary/user/me
 * List all itineraries for the authenticated user
 */
router.get('/user/me', requireAuth, async (req, res, next) => {
  try {
    await connectDB();

    const userId = req.auth.userId;

    const itineraries = await Itinerary.find({ userId })
      .sort({ createdAt: -1 })
      .select('-days') // Exclude full day data for listing (performance)
      .lean();

    // Transform _id to id
    const results = itineraries.map((it) => ({
      ...it,
      id: it._id.toString(),
      _id: undefined,
      __v: undefined,
    }));

    res.json(results);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/itinerary/:id
 * Fetch a single itinerary by ID
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    await connectDB();

    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        error: 'Itinerary not found',
        status: 404,
      });
    }

    // Access control: allow if public, or if user owns it
    const userId = req.auth?.userId || null;
    if (!itinerary.isPublic && itinerary.userId && itinerary.userId !== userId) {
      return res.status(403).json({
        error: 'You do not have access to this itinerary',
        status: 403,
      });
    }

    res.json(itinerary.toJSON());
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid itinerary ID format',
        status: 400,
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/itinerary/:id
 * Delete an itinerary (owner only)
 */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await connectDB();

    const userId = req.auth.userId;
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        error: 'Itinerary not found',
        status: 404,
      });
    }

    if (itinerary.userId !== userId) {
      return res.status(403).json({
        error: 'You can only delete your own itineraries',
        status: 403,
      });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    console.log(`🗑️ Itinerary deleted: ${itinerary.destination} (${itinerary.id}) by user ${userId}`);

    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid itinerary ID format',
        status: 400,
      });
    }
    next(error);
  }
});

export default router;
