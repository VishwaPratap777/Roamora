/* =====================================================
   Error Handler Middleware
   ===================================================== */

/**
 * Global error handling middleware for Express
 */
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log detailed error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', {
      status,
      message,
      path: req.path,
      method: req.method,
      stack: err.stack,
    });
  }

  res.status(status).json({
    error: message,
    status,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
