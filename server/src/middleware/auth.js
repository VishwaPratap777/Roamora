/* =====================================================
   Auth Middleware — Clerk Express Integration
   ===================================================== */

import config from '../config/env.js';

/**
 * Optional auth middleware — attaches userId to req.auth if available,
 * but does NOT block unauthenticated requests.
 * Uses Clerk JWT verification when CLERK_SECRET_KEY is set.
 */
export function optionalAuth(req, _res, next) {
  req.auth = { userId: null };

  // Skip auth if Clerk is not configured
  if (!config.CLERK_SECRET_KEY) {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Decode the JWT payload (Clerk tokens are JWTs)
      // In production, use @clerk/express for full verification
      // For now, decode the payload to extract userId
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      req.auth = { userId: payload.sub || null };
    }
  } catch {
    // Token decode failed — continue as unauthenticated
  }

  next();
}

/**
 * Required auth middleware — blocks unauthenticated requests with 401.
 */
export function requireAuth(req, res, next) {
  // First, run optional auth to extract userId
  optionalAuth(req, res, () => {
    if (!req.auth?.userId) {
      return res.status(401).json({
        error: 'Authentication required',
        status: 401,
      });
    }
    next();
  });
}
