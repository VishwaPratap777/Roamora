/* =====================================================
   Health Check Route
   ===================================================== */

import { Router } from 'express';
import config from '../config/env.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Roamora API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    providers: {
      openai: !!config.OPENAI_API_KEY,
      groq: !!config.GROQ_API_KEY,
    },
  });
});

export default router;
