/* =====================================================
   Rate Limiter Middleware (In-Memory)
   ===================================================== */

/**
 * Simple in-memory IP-based rate limiter
 * For production, swap with Redis-backed solution
 */
const requestCounts = new Map();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.windowStart > data.windowMs) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Create a rate limiter middleware
 * @param {object} options
 * @param {number} options.maxRequests - Max requests per window (default: 10)
 * @param {number} options.windowMs - Window duration in ms (default: 1 hour)
 */
export function createRateLimiter({ maxRequests = 10, windowMs = 60 * 60 * 1000 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    let record = requestCounts.get(key);

    if (!record || now - record.windowStart > windowMs) {
      // New window
      record = { count: 1, windowStart: now, windowMs };
      requestCounts.set(key, record);
      return next();
    }

    record.count++;

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.windowStart + windowMs - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfterSeconds: retryAfter,
        status: 429,
      });
    }

    next();
  };
}
