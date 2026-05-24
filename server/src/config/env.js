import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server root
dotenv.config({ path: resolve(__dirname, '../../.env') });

const config = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Warn about missing keys but don't crash — allows graceful fallback
if (!config.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set — OpenAI provider unavailable');
}
if (!config.GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY not set — Groq fallback unavailable');
}
if (!config.OPENAI_API_KEY && !config.GROQ_API_KEY) {
  console.error('❌ No AI provider configured! Set at least one of OPENAI_API_KEY or GROQ_API_KEY');
}

export default config;
