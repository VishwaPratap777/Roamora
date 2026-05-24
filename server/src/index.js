/* =====================================================
   Roamora API Server — Entry Point
   ===================================================== */

import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import healthRouter from './routes/health.js';
import itineraryRouter from './routes/itinerary.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'], // Vite dev + preview
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
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

// ── Start Server ───────────────────────────────────────
app.listen(config.PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║       🌍 Roamora API Server              ║
  ║       Running on port ${config.PORT}              ║
  ║                                           ║
  ║  Providers:                               ║
  ║    OpenAI: ${config.OPENAI_API_KEY ? '✅ Configured' : '❌ Not set   '}              ║
  ║    Groq:   ${config.GROQ_API_KEY ? '✅ Configured' : '❌ Not set   '}              ║
  ╚═══════════════════════════════════════════╝
  `);
});

export default app;
