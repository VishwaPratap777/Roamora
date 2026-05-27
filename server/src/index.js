/* =====================================================
   Roamora API Server — Entry Point
   ===================================================== */

import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import { connectDB } from './config/db.js';
import healthRouter from './routes/health.js';
import itineraryRouter from './routes/itinerary.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.VITE_APP_URL,
  ].filter(Boolean), // Vite dev + preview + production
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));

// ── Request logging (dev) ──────────────────────────────
if (config.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ── Routes ─────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'Roamora API is running 🌍' });
});

app.use('/api/health', healthRouter);
app.use('/api/itinerary', itineraryRouter);

// ── Error Handling ─────────────────────────────────────
app.use(errorHandler);

// ── Connect DB & Start Server ──────────────────────────
async function startServer() {
  try {
    // Connect to MongoDB (graceful — server starts even if DB fails)
    if (config.MONGODB_URI) {
      await connectDB();
    } else {
      console.warn('⚠️  MONGODB_URI not set — running without database');
    }
  } catch (err) {
    console.error('⚠️  MongoDB connection failed, continuing without database:', err.message);
  }

  app.listen(config.PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════╗
  ║       🌍 Roamora API Server              ║
  ║       Running on port ${config.PORT}              ║
  ║                                           ║
  ║  Providers:                               ║
  ║    OpenAI: ${config.OPENAI_API_KEY ? '✅ Configured' : '❌ Not set   '}              ║
  ║    Groq:   ${config.GROQ_API_KEY ? '✅ Configured' : '❌ Not set   '}              ║
  ║    MongoDB:${config.MONGODB_URI ? '✅ Connected ' : '❌ Not set   '}              ║
  ║    Clerk:  ${config.CLERK_SECRET_KEY ? '✅ Configured' : '❌ Not set   '}              ║
  ╚═══════════════════════════════════════════╝
    `);
  });
}

startServer();

export default app;
